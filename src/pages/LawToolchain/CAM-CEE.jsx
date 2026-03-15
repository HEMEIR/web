import React, { useState, useEffect } from 'react';
import { camceeApi } from '@/utils/apiBase';

const DATASET_UPLOAD_API_PATH = '/api/camcee/datasets/upload';
const DATASET_DOWNLOAD_API_PATH = '/api/camcee/datasets/download';
const CAMCEE_CACHE_TTL_MS = Number(import.meta.env.VITE_CAMCEE_CACHE_TTL_MS || (30 * 60 * 1000));

const getCamceeTrainingCacheKey = () => {
  if (typeof window === 'undefined') {
    return 'camcee:training:guest';
  }

  try {
    const userRaw = window.localStorage.getItem('user');
    if (!userRaw) return 'camcee:training:guest';
    const user = JSON.parse(userRaw);
    const userId = user?.id || user?.userId || user?.email || user?.username || 'guest';
    return `camcee:training:${userId}`;
  } catch {
    return 'camcee:training:guest';
  }
};

const getCamceeModelTrainingCacheKey = () => {
  if (typeof window === 'undefined') {
    return 'camcee:model-training:guest';
  }

  try {
    const userRaw = window.localStorage.getItem('user');
    if (!userRaw) return 'camcee:model-training:guest';
    const user = JSON.parse(userRaw);
    const userId = user?.id || user?.userId || user?.email || user?.username || 'guest';
    return `camcee:model-training:${userId}`;
  } catch {
    return 'camcee:model-training:guest';
  }
};

const normalizeExtractionResponse = (raw) => {
  const payload = raw?.data && typeof raw.data === 'object' ? raw.data : raw;
  const rawElements =
    payload?.elements ||
    payload?.extractionResults ||
    payload?.extraction_results ||
    payload?.result ||
    payload?.results ||
    [];

  const elements = Array.isArray(rawElements)
    ? rawElements.map((item, index) => {
        if (typeof item === 'string') {
          return { name: `要素${index + 1}`, value: item };
        }

        if (item && typeof item === 'object') {
          const name = item.name || item.key || item.label || item.type || `要素${index + 1}`;
          const value = item.value || item.content || item.text || item.result || JSON.stringify(item);
          return { name, value };
        }

        return { name: `要素${index + 1}`, value: String(item ?? '') };
      })
    : Object.entries(rawElements || {}).map(([name, value]) => ({
        name,
        value: typeof value === 'string' ? value : JSON.stringify(value),
      }));

  return {
    contractName: payload?.contractName || payload?.contract_name || payload?.title || '未返回合同名称',
    extractedElements: Number(payload?.extractedElements || payload?.elementCount || payload?.count || elements.length || 0),
    elements,
  };
};

const normalizePredictResponse = (raw) => {
  const payload = raw?.data && typeof raw.data === 'object' ? raw.data : raw;
  const segments = Array.isArray(payload?.segments)
    ? payload.segments.map((item, index) => ({
        id: index + 1,
        text: item?.text || '',
        label: item?.label || 'NL',
        isEntity: Boolean(item?.is_entity),
        color: item?.color || '#6B7280',
      }))
    : [];

  const entities = Array.isArray(payload?.entities)
    ? payload.entities.map((item, index) => ({
        id: index + 1,
        text: item?.text || '',
        label: item?.label || `要素${index + 1}`,
        color: item?.color || '#10B981',
      }))
    : [];

  return {
    input: payload?.input || '',
    segments,
    entities,
  };
};

const extractTrainingStats = (data) => {
  const logText = (data?.trainingLogs || []).join('\n');
  const accuracyMatch = logText.match(/accuracy:\s*([0-9]+(?:\.[0-9]+)?)/i);
  const recallMatch = logText.match(/recall:\s*([0-9]+(?:\.[0-9]+)?)/i);
  const toPercent = (value) => {
    const parsed = Number.parseFloat(value);
    if (!Number.isFinite(parsed)) return '-';
    return `${(parsed * 100).toFixed(2)}%`;
  };

  return {
    requestedAt: data?.requestedAt || '-',
    accuracy: accuracyMatch?.[1] ? toPercent(accuracyMatch[1]) : '-',
    recall: recallMatch?.[1] ? toPercent(recallMatch[1]) : '-',
  };
};

const normalizeDatasetResponse = (raw) => {
  const payload = raw?.data && typeof raw.data === 'object' ? raw.data : raw;
  const rawDatasets =
    payload?.datasets ||
    payload?.results ||
    payload?.items ||
    payload?.list ||
    payload?.files ||
    payload;

  const datasets = Array.isArray(rawDatasets)
    ? rawDatasets.map((item, index) => ({
        id: typeof item === 'string' ? index + 1 : (item?.id ?? item?.dataset_id ?? index + 1),
        name: typeof item === 'string' ? item : (item?.name || item?.dataset_name || item?.title || item?.filename || `数据集${index + 1}`),
        samples: typeof item === 'string' ? '-' : (item?.samples ?? item?.sample_count ?? item?.count ?? '-'),
        status: typeof item === 'string' ? '可用' : (item?.status || item?.state || '可用'),
      }))
    : [];

  const totalSamples = datasets.reduce((sum, item) => {
    const value = Number(item?.samples);
    return Number.isFinite(value) ? sum + value : sum;
  }, 0);

  return {
    totalDatasets: payload?.totalDatasets ?? payload?.total ?? payload?.count ?? datasets.length,
    totalSamples: payload?.totalSamples ?? payload?.sampleTotal ?? totalSamples,
    datasets,
  };
};

const CAMCEE = () => {
  // 设置页面标题
  useEffect(() => {
    document.title = 'EyeLaw-控制台';
  }, []);
  
  // 响应式数据
  const [activeTab, setActiveTab] = React.useState('extraction');
  const [extractionLoading, setExtractionLoading] = React.useState(false);
  const [extractionResult, setExtractionResult] = React.useState(null);
  const [extractionError, setExtractionError] = React.useState('');
  const [trainingLoading, setTrainingLoading] = React.useState(false);
  const [trainingResult, setTrainingResult] = React.useState(null);
  const [trainingError, setTrainingError] = React.useState('');
  const [trainingCacheReady, setTrainingCacheReady] = React.useState(false);
  const [modelTrainingLoading, setModelTrainingLoading] = React.useState(false);
  const [modelTrainingStopping, setModelTrainingStopping] = React.useState(false);
  const [modelTrainingResult, setModelTrainingResult] = React.useState(null);
  const [modelTrainingError, setModelTrainingError] = React.useState('');
  const [modelTrainingCacheReady, setModelTrainingCacheReady] = React.useState(false);
  const [extractionText, setExtractionText] = React.useState('甲方与乙方于2024年5月1日签订设备采购合同，总价120万元');
  const [datasets, setDatasets] = React.useState([]);
  const [datasetSummary, setDatasetSummary] = React.useState({ totalDatasets: 0, totalSamples: 0 });
  const [datasetLoading, setDatasetLoading] = React.useState(false);
  const [datasetUploading, setDatasetUploading] = React.useState(false);
  const [datasetDownloading, setDatasetDownloading] = React.useState('');
  const [datasetError, setDatasetError] = React.useState('');
  const [datasetSuccess, setDatasetSuccess] = React.useState('');
  const [selectedDataset, setSelectedDataset] = React.useState('');
  const [trainingEpoch, setTrainingEpoch] = React.useState('50');
  const datasetFileInputRef = React.useRef(null);

  // 处理标签页切换
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  const loadDatasets = async () => {
    setDatasetLoading(true);
    setDatasetError('');
    try {
      const response = await fetch(camceeApi('/api/camcee/datasets'), {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `请求失败(${response.status})`);
      }

      const payload = await response.json();
      const normalized = normalizeDatasetResponse(payload);
      setDatasets(normalized.datasets);
      setDatasetSummary({
        totalDatasets: normalized.totalDatasets,
        totalSamples: normalized.totalSamples,
      });
      setSelectedDataset((prev) => {
        if (prev && normalized.datasets.some((item) => String(item.id) === String(prev))) {
          return prev;
        }
        return normalized.datasets[0] ? String(normalized.datasets[0].id) : '';
      });
      return normalized;
    } catch (err) {
      setDatasetError(err.message || '数据集加载失败，请重试');
      throw err;
    } finally {
      setDatasetLoading(false);
    }
  };

  useEffect(() => {
    loadDatasets().catch(() => {});
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const cachedRaw = window.localStorage.getItem(getCamceeTrainingCacheKey());
      if (!cachedRaw) return;

      const cached = JSON.parse(cachedRaw);
      if (!cached?.expiresAt || cached.expiresAt <= Date.now()) {
        window.localStorage.removeItem(getCamceeTrainingCacheKey());
        return;
      }

      if (cached?.trainingResult) {
        setTrainingResult(cached.trainingResult);
      }
      if (typeof cached?.trainingError === 'string') {
        setTrainingError(cached.trainingError);
      }
      if (typeof cached?.selectedDataset === 'string') {
        setSelectedDataset((prev) => prev || cached.selectedDataset);
      }
    } catch {
      // 忽略训练缓存恢复异常
    } finally {
      setTrainingCacheReady(true);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const cachedRaw = window.localStorage.getItem(getCamceeModelTrainingCacheKey());
      if (!cachedRaw) return;

      const cached = JSON.parse(cachedRaw);
      if (!cached?.expiresAt || cached.expiresAt <= Date.now()) {
        window.localStorage.removeItem(getCamceeModelTrainingCacheKey());
        return;
      }

      if (cached?.modelTrainingResult) {
        setModelTrainingResult(cached.modelTrainingResult);
      }
      if (typeof cached?.modelTrainingError === 'string') {
        setModelTrainingError(cached.modelTrainingError);
      }
      if (typeof cached?.trainingEpoch === 'string') {
        setTrainingEpoch(cached.trainingEpoch);
      }
    } catch {
      // 忽略训练缓存恢复异常
    } finally {
      setModelTrainingCacheReady(true);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !trainingCacheReady) return;

    try {
      const cacheKey = getCamceeTrainingCacheKey();
      const hasTrainingCache = !!trainingResult || !!trainingError;
      if (!hasTrainingCache) {
        window.localStorage.removeItem(cacheKey);
        return;
      }

      window.localStorage.setItem(cacheKey, JSON.stringify({
        trainingResult,
        trainingError,
        selectedDataset,
        expiresAt: Date.now() + CAMCEE_CACHE_TTL_MS,
      }));
    } catch {
      // 忽略训练缓存写入异常
    }
  }, [trainingCacheReady, trainingResult, trainingError, selectedDataset]);

  useEffect(() => {
    if (typeof window === 'undefined' || !modelTrainingCacheReady) return;

    try {
      const cacheKey = getCamceeModelTrainingCacheKey();
      const hasTrainingCache = !!modelTrainingResult || !!modelTrainingError;
      if (!hasTrainingCache) {
        window.localStorage.removeItem(cacheKey);
        return;
      }

      window.localStorage.setItem(cacheKey, JSON.stringify({
        modelTrainingResult,
        modelTrainingError,
        trainingEpoch,
        expiresAt: Date.now() + CAMCEE_CACHE_TTL_MS,
      }));
    } catch {
      // 忽略训练缓存写入异常
    }
  }, [modelTrainingCacheReady, modelTrainingResult, modelTrainingError, trainingEpoch]);

  const validateJsonlFile = async (file) => {
    if (!file || !/\.jsonl$/i.test(file.name)) {
      throw new Error('仅支持上传 .jsonl 格式的数据集文件');
    }

    const text = await file.text();
    const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    if (lines.length === 0) {
      throw new Error('JSONL 文件内容不能为空');
    }

    for (let index = 0; index < lines.length; index += 1) {
      try {
        JSON.parse(lines[index]);
      } catch {
        throw new Error(`JSONL 格式校验失败：第 ${index + 1} 行不是合法 JSON`);
      }
    }
  };

  const resolveUploadFileName = (file) => {
    const existingNames = new Set(datasets.map((dataset) => String(dataset.name).trim().toLowerCase()));
    if (!existingNames.has(file.name.trim().toLowerCase())) {
      return file.name;
    }

    const renamed = window.prompt('检测到同名数据集，请输入新的文件名（必须以 .jsonl 结尾）', file.name);
    if (!renamed) {
      throw new Error('已取消上传');
    }

    const trimmed = renamed.trim();
    if (!/\.jsonl$/i.test(trimmed)) {
      throw new Error('重命名后的文件必须是 .jsonl 格式');
    }

    if (existingNames.has(trimmed.toLowerCase())) {
      throw new Error('重命名后仍与现有数据集重名，请更换名称后重试');
    }

    return trimmed;
  };

  const uploadDataset = async (file) => {
    setDatasetUploading(true);
    setDatasetError('');
    setDatasetSuccess('');

    try {
      await validateJsonlFile(file);
      const finalName = resolveUploadFileName(file);
      const uploadFile = finalName === file.name
        ? file
        : new File([file], finalName, { type: file.type || 'application/json' });

      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('filename', finalName);

      const response = await fetch(camceeApi(DATASET_UPLOAD_API_PATH), {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `请求失败(${response.status})`);
      }

      const payload = await response.json();
      if (payload?.status !== 'success') {
        throw new Error(payload?.message || '上传失败');
      }

      setDatasetSuccess(`上传成功：${payload.filename || finalName}`);
      await loadDatasets();
    } catch (err) {
      setDatasetError(err.message || '上传数据集失败，请重试');
    } finally {
      setDatasetUploading(false);
      if (datasetFileInputRef.current) {
        datasetFileInputRef.current.value = '';
      }
    }
  };

  const handleDatasetFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await uploadDataset(file);
  };

  const downloadDataset = async (datasetName) => {
    if (!datasetName) return;

    setDatasetDownloading(datasetName);
    setDatasetError('');
    setDatasetSuccess('');

    try {
      const query = new URLSearchParams({ dataset: datasetName }).toString();
      const response = await fetch(camceeApi(`${DATASET_DOWNLOAD_API_PATH}?${query}`), {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `请求失败(${response.status})`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = datasetName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      setDatasetSuccess(`下载成功：${datasetName}`);
    } catch (err) {
      setDatasetError(err.message || '下载数据集失败，请重试');
    } finally {
      setDatasetDownloading('');
    }
  };

  const getSelectedDatasetName = () => {
    const currentDataset = datasets.find((dataset) => String(dataset.id) === String(selectedDataset));
    return currentDataset?.name || '';
  };

  const runExtraction = async () => {
    if (!extractionText.trim()) {
      setExtractionError('请输入要提取的合同文本');
      return;
    }

    setExtractionLoading(true);
    setExtractionError('');
    setExtractionResult(null);
    try {
      const response = await fetch(camceeApi('/api/camcee/predict'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        body: JSON.stringify({
          text: extractionText.trim(),
        }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `请求失败(${response.status})`);
      }

      const data = await response.json();
      setExtractionResult({
        success: true,
        message: '要素提取成功',
        data: normalizePredictResponse(data),
      });
    } catch (err) {
      setExtractionError(err.message || '要素提取失败，请重试');
    } finally {
      setExtractionLoading(false);
    }
  };

  const runTrainingByExtractionApi = async () => {
    setTrainingLoading(true);
    setTrainingError('');
    const datasetName = getSelectedDatasetName();
    const apiQuery = datasetName
      ? `?${new URLSearchParams({ dataset: datasetName }).toString()}`
      : '';
    const apiPath = `/api/camcee/extraction${apiQuery}`;
    const startedAt = new Date().toLocaleString();

    setTrainingResult({
      success: true,
      message: '训练进行中',
      data: {
        contractName: '-',
        extractedElements: 0,
        elements: [],
        rawResponse: '',
        requestedAt: startedAt,
        datasetName,
        requestPath: apiPath,
        trainingLogs: ['开始请求训练接口...'],
        finished: false,
      },
    });

    const appendTrainingLog = (line) => {
      if (!line) return;
      setTrainingResult((prev) => {
        if (!prev?.data) return prev;
        return {
          ...prev,
          data: {
            ...prev.data,
            trainingLogs: [...(prev.data.trainingLogs || []), line].slice(-300),
          },
        };
      });
    };

    const mergeTrainingSnapshot = (payload) => {
      const normalized = normalizeExtractionResponse(payload);
      setTrainingResult((prev) => {
        if (!prev?.data) return prev;
        return {
          ...prev,
          data: {
            ...prev.data,
            contractName: normalized.contractName || prev.data.contractName,
            extractedElements: normalized.extractedElements ?? prev.data.extractedElements,
            elements: normalized.elements?.length ? normalized.elements : prev.data.elements,
          },
        };
      });
    };

    try {
      const response = await fetch(camceeApi(apiPath), {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `请求失败(${response.status})`);
      }

      const contentType = response.headers.get('content-type') || '';
      const isStreamLike = Boolean(response.body) && (
        contentType.includes('text/event-stream') ||
        contentType.includes('text/plain') ||
        contentType.includes('application/x-ndjson')
      );

      if (isStreamLike && response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let buffer = '';
        let rawResponseText = '';

        const handleLine = (line) => {
          const trimmed = line.trim();
          if (!trimmed) return;

          const content = trimmed.startsWith('data:') ? trimmed.replace(/^data:\s?/, '') : trimmed;
          if (content === '[DONE]') {
            appendTrainingLog('训练流结束');
            return;
          }

          try {
            const parsed = JSON.parse(content);
            const logLine =
              parsed.message ||
              parsed.log ||
              parsed.status ||
              parsed.progress ||
              parsed.text ||
              parsed.output;
            appendTrainingLog(logLine || JSON.stringify(parsed));
            mergeTrainingSnapshot(parsed);
          } catch {
            appendTrainingLog(content);
          }
        };

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          rawResponseText += chunk;
          buffer += chunk;

          const lines = buffer.split(/\r?\n/);
          buffer = lines.pop() || '';
          lines.forEach(handleLine);
        }

        if (buffer.trim()) {
          handleLine(buffer);
        }

        setTrainingResult((prev) => ({
          ...prev,
          message: '训练完成',
          data: {
            ...prev.data,
            rawResponse: rawResponseText,
            finished: true,
          },
        }));
      } else if (contentType.includes('application/json')) {
        const payload = await response.json();
        mergeTrainingSnapshot(payload);
        appendTrainingLog('已收到 JSON 结果');
        setTrainingResult((prev) => ({
          ...prev,
          message: '训练完成',
          data: {
            ...prev.data,
            rawResponse: payload,
            finished: true,
          },
        }));
      } else {
        const payload = await response.text();
        appendTrainingLog(payload);
        try {
          mergeTrainingSnapshot(JSON.parse(payload));
        } catch {
          // 文本模式下不强制要求 JSON
        }
        setTrainingResult((prev) => ({
          ...prev,
          message: '训练完成',
          data: {
            ...prev.data,
            rawResponse: payload,
            finished: true,
          },
        }));
      }
    } catch (err) {
      setTrainingError(err.message || '接口请求失败，请重试');
    } finally {
      setTrainingLoading(false);
    }
  };

  const runModelTraining = async () => {
    const epochInt = Number.parseInt(trainingEpoch, 10);
    if (!Number.isInteger(epochInt) || epochInt <= 0) {
      setModelTrainingError('epoch 必须是大于 0 的整数');
      return;
    }

    setModelTrainingLoading(true);
    setModelTrainingError('');
    const apiPath = `/api/camcee/train?${new URLSearchParams({ epochs: String(epochInt) }).toString()}`;
    const startedAt = new Date().toLocaleString();

    setModelTrainingResult({
      success: true,
      message: '训练进行中',
      data: {
        requestedAt: startedAt,
        requestPath: apiPath,
        trainingLogs: ['开始请求训练接口...'],
        finished: false,
      },
    });

    const appendTrainingLog = (line) => {
      if (!line || !String(line).trim()) return;
      setModelTrainingResult((prev) => {
        if (!prev?.data) return prev;
        return {
          ...prev,
          data: {
            ...prev.data,
            trainingLogs: [...(prev.data.trainingLogs || []), String(line)].slice(-800),
          },
        };
      });
    };

    try {
      const response = await fetch(camceeApi(apiPath), {
        method: 'POST',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `请求失败(${response.status})`);
      }

      const contentType = response.headers.get('content-type') || '';
      const reader = response.body?.getReader();

      if (reader) {
        const decoder = new TextDecoder('utf-8');
        let buffer = '';
        let rawResponseText = '';

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          rawResponseText += chunk;
          buffer += chunk;

          const lines = buffer.split(/\r?\n/);
          buffer = lines.pop() || '';
          lines.forEach((line) => appendTrainingLog(line));
        }

        if (buffer.trim()) {
          appendTrainingLog(buffer);
          rawResponseText += buffer;
        }

        setModelTrainingResult((prev) => ({
          ...prev,
          message: '训练完成',
          data: {
            ...prev.data,
            rawResponse: rawResponseText,
            contentType,
            finished: true,
          },
        }));
      } else if (contentType.includes('application/json')) {
        const payload = await response.json();
        appendTrainingLog(JSON.stringify(payload, null, 2));
        setModelTrainingResult((prev) => ({
          ...prev,
          message: '训练完成',
          data: {
            ...prev.data,
            rawResponse: payload,
            contentType,
            finished: true,
          },
        }));
      } else {
        const text = await response.text();
        text.split(/\r?\n/).forEach((line) => appendTrainingLog(line));
        setModelTrainingResult((prev) => ({
          ...prev,
          message: '训练完成',
          data: {
            ...prev.data,
            rawResponse: text,
            contentType,
            finished: true,
          },
        }));
      }
    } catch (err) {
      setModelTrainingError(err.message || '训练失败，请重试');
    } finally {
      setModelTrainingLoading(false);
    }
  };

  const stopModelTraining = async () => {
    setModelTrainingStopping(true);
    setModelTrainingError('');

    try {
      const response = await fetch(camceeApi('/api/camcee/train/stop'), {
        method: 'POST',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `请求失败(${response.status})`);
      }

      setModelTrainingResult((prev) => {
        if (!prev?.data) return prev;
        return {
          ...prev,
          data: {
            ...prev.data,
            trainingLogs: [...(prev.data.trainingLogs || []), '已发送停止训练请求，等待后端释放资源...'].slice(-800),
          },
        };
      });
    } catch (err) {
      setModelTrainingError(err.message || '停止训练失败，请重试');
    } finally {
      setModelTrainingStopping(false);
    }
  };

  // 模拟API请求
  const simulateApiRequest = async (action) => {
    if (action === 'extract') {
      await runExtraction();
      return;
    }

    if (action === 'train') {
      await runTrainingByExtractionApi();
      return;
    }

    throw new Error('无效操作');
  };

  // 要素提取模块
  const ExtractionModule = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-3">要素提取数据读取与执行</h3>
        <p className="text-gray-700 mb-4">该模块负责读取法律条文数据并执行要素提取，支持多种格式的数据输入和批量处理。</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 items-stretch">
          <div className="flex flex-col h-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">输入合同文本</label>
            <textarea
              value={extractionText}
              onChange={(event) => setExtractionText(event.target.value)}
              rows={6}
              className="w-full flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none"
              placeholder="请输入需要进行要素提取的合同文本"
            />
            <button
              onClick={() => simulateApiRequest('extract')}
              disabled={extractionLoading}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {extractionLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  执行中...
                </span>
              ) : (
                '执行提取'
              )}
            </button>
          </div>

          <div className="flex flex-col h-full">
            <p className="text-sm text-gray-600 mb-3 font-semibold">原文分段高亮</p>
            <div className="flex-1 min-h-[176px] bg-blue-50/60 border border-blue-200 rounded-lg p-4 leading-8">
              {extractionResult?.data?.segments?.length > 0 ? (
                extractionResult.data.segments.map((segment) => (
                  <span
                    key={segment.id}
                    className={`inline rounded px-1 py-0.5 mr-1 ${segment.isEntity ? 'font-semibold' : ''}`}
                    style={{
                      color: segment.isEntity ? '#111827' : segment.color,
                      backgroundColor: segment.isEntity ? `${segment.color}22` : 'transparent',
                      border: segment.isEntity ? `1px solid ${segment.color}` : 'none',
                    }}
                    title={segment.label}
                  >
                    {segment.text}
                  </span>
                ))
              ) : (
                <span className="text-gray-500">执行提取后，这里会根据后端返回结果动态高亮原文片段。</span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* 结果展示 */}
      {extractionResult && extractionResult.success && (
        <div className="bg-white rounded-lg shadow-md p-6 border border-green-200">
          <h4 className="text-lg font-semibold text-green-800 mb-4">提取结果</h4>

          <div>
            <p className="text-sm text-gray-600 mb-4 font-semibold">识别出的实体要素</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-700">
                <thead className="bg-blue-50 border-b border-blue-200">
                  <tr>
                    <th className="px-4 py-3 font-semibold text-gray-900 w-24">序号</th>
                    <th className="px-4 py-3 font-semibold text-gray-900 w-40">实体类型</th>
                    <th className="px-4 py-3 font-semibold text-gray-900">实体内容</th>
                  </tr>
                </thead>
                <tbody>
                  {extractionResult.data.entities.length > 0 ? (
                    extractionResult.data.entities.map((entity, index) => (
                      <tr key={entity.id} className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
                        <td className="px-4 py-3 text-gray-600">{index + 1}</td>
                        <td className="px-4 py-3 font-medium text-gray-900">
                          <span
                            className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium"
                            style={{
                              backgroundColor: `${entity.color}22`,
                              color: entity.color,
                            }}
                          >
                            {entity.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{entity.text}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="px-4 py-6 text-center text-gray-500">
                        后端未返回实体结果。
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      
      {extractionError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="text-red-500 text-xl">❌</div>
            <h4 className="text-lg font-semibold text-red-800">{extractionError}</h4>
          </div>
        </div>
      )}
    </div>
  );

  // 数据集管理模块
  const DatasetModule = () => (
    <div className="space-y-6">
      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
        <h3 className="text-lg font-semibold text-purple-800 mb-3">数据集管理</h3>
        <p className="text-gray-700 mb-4">该模块负责管理用于训练和测试的数据集，支持数据集的上传、下载。</p>
        
        <div className="flex flex-wrap gap-3 mb-6">
          <input
            ref={datasetFileInputRef}
            type="file"
            accept=".jsonl"
            onChange={handleDatasetFileChange}
            className="hidden"
          />
          <button
            onClick={() => datasetFileInputRef.current?.click()}
            disabled={datasetUploading || datasetLoading}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {datasetUploading ? '⏫ 上传中...' : '📁 上传数据集'}
          </button>
          <button
            onClick={() => loadDatasets().catch(() => {})}
            disabled={datasetLoading || datasetUploading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🔄 刷新列表
          </button>
          <button
            onClick={() => loadDatasets().catch(() => {})}
            disabled={datasetLoading || datasetUploading}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {datasetLoading ? (
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              '📊 加载数据集'
            )}
          </button>
        </div>
      </div>
      
      {/* 数据集结果 */}
      {datasetSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="text-green-500 text-xl">✅</div>
            <h4 className="text-lg font-semibold text-green-800">{datasetSuccess}</h4>
          </div>
        </div>
      )}

      {datasetError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="text-red-500 text-xl">❌</div>
            <h4 className="text-lg font-semibold text-red-800">{datasetError}</h4>
          </div>
        </div>
      )}

      {datasets.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 border border-green-200">
          <div className="mb-6">
            <div>
              <h4 className="text-lg font-semibold text-green-800">数据集列表</h4>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">ID</th>
                  <th scope="col" className="px-6 py-3">数据集名称</th>
                  <th scope="col" className="px-6 py-3">状态</th>
                  <th scope="col" className="px-6 py-3">下载</th>
                </tr>
              </thead>
              <tbody>
                {datasets.map((dataset) => (
                  <tr key={dataset.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{dataset.id}</td>
                    <td className="px-6 py-4">{dataset.name}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${dataset.status === '可用' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {dataset.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => downloadDataset(dataset.name)}
                        disabled={datasetDownloading === dataset.name}
                        className="text-blue-600 hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                      >
                        {datasetDownloading === dataset.name ? '下载中...' : '下载'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  // 模型评估模块
  const EvaluationModule = () => (
    <div className="space-y-6">
      <div className="bg-orange-50 rounded-lg shadow-md p-6 border border-orange-200">
        <h3 className="text-lg font-semibold text-orange-800 mb-3">模型评估</h3>
        <p className="text-gray-700 mb-4">该模块负责执行 CAM-CEE 模型测试并返回动态日志与评估指标。</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">选择测试数据集</label>
            <select
              value={selectedDataset}
              onChange={(event) => setSelectedDataset(event.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              {datasets.length > 0 ? (
                datasets.map((dataset) => (
                  <option key={dataset.id} value={String(dataset.id)}>
                    {dataset.name}
                  </option>
                ))
              ) : (
                <option value="">暂无可用数据集</option>
              )}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => runTrainingByExtractionApi()}
              disabled={trainingLoading}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {trainingLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  测试中...
                </span>
              ) : (
                '开始测试'
              )}
            </button>
          </div>
        </div>

        {trainingResult && trainingResult.success && (
          <>
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
            <p className="text-sm font-medium text-orange-800 mb-2">测试过程动态展示</p>
            <div className="max-h-56 overflow-auto bg-gray-50 border border-gray-200 rounded p-3">
              <pre className="text-xs text-gray-700 whitespace-pre-wrap break-all">
                {(trainingResult.data.trainingLogs || []).join('\n')}
              </pre>
            </div>
            {!trainingResult.data.finished && (
              <p className="text-xs text-orange-700 mt-2">测试进行中，日志会持续更新...</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-lg bg-orange-50 border border-orange-200 p-4">
            <div className="bg-white p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">请求时间</p>
              <p className="text-base font-semibold text-orange-700">{extractTrainingStats(trainingResult.data).requestedAt}</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">准确率</p>
              <p className="text-base font-semibold text-blue-700">{extractTrainingStats(trainingResult.data).accuracy}</p>
            </div>
            <div className="bg-white p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">召回率</p>
              <p className="text-base font-semibold text-purple-700">{extractTrainingStats(trainingResult.data).recall}</p>
            </div>
          </div>
          </>
        )}
      </div>
      
      {trainingError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="text-red-500 text-xl">❌</div>
            <h4 className="text-lg font-semibold text-red-800">{trainingError}</h4>
          </div>
        </div>
      )}
    </div>
  );

  const TrainingModule = () => (
    <div className="space-y-6">
      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <h3 className="text-lg font-semibold text-green-800 mb-3">模型训练与优化</h3>
        <p className="text-gray-700 mb-4">该模块负责触发 CAM-CEE 模型训练，并实时展示后端终端输出。</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">训练 epoch</label>
            <input
              type="number"
              min="1"
              step="1"
              value={trainingEpoch}
              onChange={(event) => setTrainingEpoch(event.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              placeholder="请输入训练轮次"
            />
          </div>

          <div className="flex items-end">
            <div className="w-full grid grid-cols-2 gap-3">
              <button
                onClick={runModelTraining}
                disabled={modelTrainingLoading || modelTrainingStopping}
                className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {modelTrainingLoading ? '训练中...' : '开始训练'}
              </button>
              <button
                onClick={stopModelTraining}
                disabled={modelTrainingStopping}
                className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {modelTrainingStopping ? '停止中...' : '停止训练'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {modelTrainingResult && modelTrainingResult.success && (
        <div className="bg-white rounded-lg border border-green-200 p-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <p className="text-sm font-medium text-green-800 mb-2">训练过程动态展示</p>
            <div className="max-h-64 overflow-auto bg-white border border-green-100 rounded p-3">
              <pre className="text-xs text-gray-700 whitespace-pre-wrap break-all">
                {(modelTrainingResult.data.trainingLogs || []).join('\n')}
              </pre>
            </div>
            {!modelTrainingResult.data.finished && (
              <p className="text-xs text-green-700 mt-2">训练进行中，日志会持续更新...</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">请求时间</p>
              <p className="text-base font-semibold text-green-700">{modelTrainingResult.data.requestedAt || '-'}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">训练状态</p>
              <p className="text-base font-semibold text-blue-700">
                {modelTrainingResult.data.finished ? '已完成' : '进行中'}
              </p>
            </div>
          </div>
        </div>
      )}

      {modelTrainingError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="text-red-500 text-xl">❌</div>
            <h4 className="text-lg font-semibold text-red-800">{modelTrainingError}</h4>
          </div>
        </div>
      )}
    </div>
  );
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8 px-4">
      {/* 页面标题 */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-4 mb-2">
          <div className="text-blue-600 text-5xl">📄</div>
          <div>
            <h2 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">CAM-CEE 合约要素提取模型</h2>
            <p className="text-xl text-gray-600 font-light italic">Contract Analysis Model - Contract Element Extraction</p>
          </div>
        </div>
      </div>

      {/* 系统简介 */}
      <div className="mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="text-blue-500 text-xl">ℹ️</div>
            <h2 className="text-lg font-semibold text-blue-800">CAM-CEE 系统简介</h2>
          </div>
          <p className="text-gray-700">
                CAM-CEE 是一个面向智能合约化场景的上下文感知要素提取模型，通过融合上下文语义感知动态填充方法、三重注意力层和要素边缘加权损失函数，有效提升了长文本文档中合约要素的提取性能。该模型在自主构建的中文买卖合约数据集上超越了所有基线模型，并展现出良好的通用性和硬件适应性。
          </p>
        </div>

        {/* 模型架构图 */}
        <div className="mt-4 bg-white border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="text-blue-500 text-xl">🏗️</div>
            <h2 className="text-lg font-semibold text-blue-800">CAM-CEE 模型架构</h2>
          </div>
          <div className="flex flex-col items-center">
            <img 
              src="../src/resource/img/jiagoutu.png" 
              alt="CAM-CEE模型架构图" 
              className="max-w-full h-auto rounded-lg shadow-md"
            />
            <p className="text-sm text-gray-600 mt-3 text-center">
              图：CAM-CEE模型架构，包含BERT嵌入层、双向GRU层和三重注意力机制（前注意层、自注意层、后注意层），用于捕获合同文本的上下文语义信息。
            </p>
          </div>
        </div>
        
      </div>

      {/* 功能模块选择 */}
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* 标签页导航 */}
          <div className="bg-gray-50 border-b border-gray-200 rounded-t-xl">
            <div className="flex overflow-x-auto">
              {[
                { id: 'extraction', label: '要素提取数据读取与执行', icon: '📊' },
                { id: 'training', label: '模型训练与优化', icon: '⚙️' },
                { id: 'dataset', label: '数据集管理', icon: '📁' },
                { id: 'evaluation', label: '模型评估', icon: '📈' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`px-6 py-4 whitespace-nowrap font-medium transition-all duration-300 flex items-center gap-2 ${activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'}`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* 标签页内容 */}
          <div className="p-6">
            {activeTab === 'extraction' && ExtractionModule()}
            {activeTab === 'training' && TrainingModule()}
            {activeTab === 'dataset' && DatasetModule()}
            {activeTab === 'evaluation' && EvaluationModule()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CAMCEE;
