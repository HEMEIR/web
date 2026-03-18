import React, { useEffect, useState } from 'react';
import { featureApi } from '@/utils/apiBase';

const MODEL_ORDER = ['bert', 'roberta', 'legalbert'];
const TRAIN_MODEL_OPTIONS = ['bert', 'roberta', 'legalbert'];

const EMPTY_PERFORMANCE = {
  bert: { r1: null, r3: null, r5: null },
  roberta: { r1: null, r3: null, r5: null },
  legalbert: { r1: null, r3: null, r5: null },
};

const MODEL_COLORS = {
  bert: 'text-green-600',
  roberta: 'text-purple-600',
  legalbert: 'text-amber-600',
};
const PROVBENCH_CACHE_TTL_MS = Number(import.meta.env.VITE_PROVBENCH_CACHE_TTL_MS || (30 * 60 * 1000));
const EMPTY_UPDATED_AT = {
  bert: null,
  roberta: null,
  legalbert: null,
};
const EMPTY_ERROR_STATE = {
  legalbert: '',
  bert: '',
  roberta: '',
};

const getConflictMeta = (conflict) => {
  if (Number(conflict) === 1) {
    return {
      label: '有潜在矛盾',
      risk: '高风险',
      tone: 'red',
    };
  }

  return {
    label: '无矛盾',
    risk: '低风险',
    tone: 'green',
  };
};

const getConflictStyles = (conflict) => {
  const meta = getConflictMeta(conflict);
  if (meta.tone === 'red') {
    return {
      card: 'border-l-4 border-red-500 bg-red-50/30 rounded-r-lg p-4',
      badge: 'inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium',
      riskBadge: 'inline-flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium border border-red-200',
      index: 'text-red-600',
      summary: 'text-red-700',
    };
  }

  return {
    card: 'border-l-4 border-green-500 bg-green-50/30 rounded-r-lg p-4',
    badge: 'inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium',
    riskBadge: 'inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium border border-green-200',
    index: 'text-green-600',
    summary: 'text-green-700',
  };
};

const buildInferenceSummary = (items = []) => {
  if (!Array.isArray(items) || items.length === 0) {
    return '未返回匹配法条。';
  }

  return items.map((item, idx) => {
    const meta = getConflictMeta(item?.conflict);
    return [
      `${idx + 1}. 《${item?.law_cate || '未知法典'}》第${item?.law_num || '-'}条`,
      `风险等级：${meta.risk}（${meta.label}）`,
      `法条内容：${item?.law_text || '暂无内容'}`,
    ].join('\n');
  }).join('\n\n');
};

const hasCompleteMetrics = (metrics) => {
  return ['r1', 'r3', 'r5'].every((key) => typeof metrics?.[key] === 'number');
};

const getProvbenchCacheKey = () => {
  if (typeof window === 'undefined') {
    return 'provbench:performance:guest';
  }

  try {
    const userRaw = window.localStorage.getItem('user');
    if (!userRaw) return 'provbench:performance:guest';
    const user = JSON.parse(userRaw);
    const userId = user?.id || user?.userId || user?.email || user?.username || 'guest';
    return `provbench:performance:${userId}`;
  } catch {
    return 'provbench:performance:guest';
  }
};

const getProvbenchTrainingCacheKey = () => {
  return getProvbenchCacheKey().replace('provbench:performance:', 'provbench:training:');
};

const toNum = (value) => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value.replace('%', '').trim());
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const parseMetricPayload = (payload) => {
  const source = payload?.metrics || payload?.performance || payload?.result?.metrics || payload?.data?.metrics || payload?.data || payload;
  const read = (...keys) => {
    for (const key of keys) {
      const value = toNum(source?.[key]);
      if (value !== null) return value;
    }
    return null;
  };

  return {
    r1: read('r1', 'R1', 'R@1', 'r_at_1', 'recall_at_1'),
    r3: read('r3', 'R3', 'R@3', 'r_at_3', 'recall_at_3'),
    r5: read('r5', 'R5', 'R@5', 'r_at_5', 'recall_at_5'),
  };
};

const parseMetricFromOutputText = (text) => {
  if (typeof text !== 'string' || !text.trim()) {
    return { r1: null, r3: null, r5: null };
  }

  const getMetric = (names) => {
    for (const name of names) {
      const reg = new RegExp(`${name}\\s*[:=]\\s*([0-9]+(?:\\.[0-9]+)?)`, 'i');
      const match = text.match(reg);
      if (match?.[1]) {
        const parsed = Number.parseFloat(match[1]);
        if (Number.isFinite(parsed)) {
          return parsed;
        }
      }
    }
    return null;
  };

  return {
    r1: getMetric(['r1', 'r@1', 'recall@1', 'recall_at_1']),
    r3: getMetric(['r3', 'r@3', 'recall@3', 'recall_at_3']),
    r5: getMetric(['r5', 'r@5', 'recall@5', 'recall_at_5']),
  };
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/*提取与判定：ProvBench模块*/
const ProvBench = () => {
  const [activeModule, setActiveModule] = React.useState('evaluate');
  const [loading, setLoading] = React.useState({
    legalbert: false,
    bert: false,
    roberta: false
  });
  const [results, setResults] = React.useState([]);
  const [activeResultIndex, setActiveResultIndex] = React.useState(0);
  const [currentExecution, setCurrentExecution] = React.useState({
    model: null,
    startTime: null
  });
  const [progressPercentage, setProgressPercentage] = React.useState(0);
  const [showInputModal, setShowInputModal] = React.useState(false);
  const [selectedModel, setSelectedModel] = React.useState(null);
  const [inputText, setInputText] = React.useState('');
  const [performance, setPerformance] = React.useState(EMPTY_PERFORMANCE);
  const [performanceUpdatedAt, setPerformanceUpdatedAt] = React.useState(EMPTY_UPDATED_AT);
  const [performanceLoading, setPerformanceLoading] = React.useState({
    legalbert: false,
    bert: false,
    roberta: false,
  });
  const [performanceError, setPerformanceError] = React.useState(EMPTY_ERROR_STATE);
  const [trainingModel, setTrainingModel] = React.useState('legalbert');
  const [trainingEpoch, setTrainingEpoch] = React.useState('50');
  const [trainingLoading, setTrainingLoading] = React.useState(false);
  const [trainingStopping, setTrainingStopping] = React.useState(false);
  const [trainingLogs, setTrainingLogs] = React.useState([]);
  const [trainingError, setTrainingError] = React.useState('');
  const [trainingStartedAt, setTrainingStartedAt] = React.useState('');
  const [trainingUpdatedAt, setTrainingUpdatedAt] = React.useState('');
  const [trainingCacheReady, setTrainingCacheReady] = React.useState(false);

  // 计算是否有任何模型正在加载
  const isAnyLoading = Object.values(loading).some(status => status);

  // 获取模型显示名称
  const getModelDisplayName = (model) => {
    const names = {
      legalbert: 'LegalBERT',
      bert: 'BERT',
      roberta: 'RoBERTa'
    };
    return names[model] || model.toUpperCase();
  };

  // 获取模型图标
  const getModelIcon = (model) => {
    const icons = {
      legalbert: '📚',
      bert: '💻',
      roberta: '⚙️'
    };
    return icons[model] || '📄';
  };

  const getPerf = (model, metric) => {
    const value = performance?.[model]?.[metric];
    return typeof value === 'number' ? value : 0;
  };

  const formatPerf = (model, metric) => {
    const value = performance?.[model]?.[metric];
    return typeof value === 'number' ? value.toFixed(2) : '--';
  };
  const isPerformanceReady = (model) => hasCompleteMetrics(performance?.[model]);
  const hasPerformanceData = MODEL_ORDER.some((model) =>
    ['r1', 'r3', 'r5'].some((metric) => typeof performance?.[model]?.[metric] === 'number')
  );
  const isAnyPerformanceLoading = MODEL_ORDER.some((model) => performanceLoading[model]);

  const fetchModelMetrics = async (modelType, textValue = '') => {
    const requestBody = { model: modelType };
    if (typeof textValue === 'string' && textValue.trim()) {
      requestBody.text = textValue;
    }
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 300000);
    let response;
    try {
      response = await fetch(featureApi('/api/run-model'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(errText || `请求失败(${response.status})`);
    }

    const payload = await response.json();
    const parsedFromJson = parseMetricPayload(payload);
    const parsedFromOutput = parseMetricFromOutputText(payload?.output);
    const metrics = {
      r1: parsedFromJson.r1 ?? parsedFromOutput.r1,
      r3: parsedFromJson.r3 ?? parsedFromOutput.r3,
      r5: parsedFromJson.r5 ?? parsedFromOutput.r5,
    };

    return { payload, metrics };
  };

  const fetchModelInference = async (modelType, contractText) => {
    const requestBody = {
      model: modelType,
      contract: contractText,
      conflict_ckpt: null,
    };
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 300000);
    let response;
    try {
      response = await fetch(featureApi('/api/provrec/infer'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(errText || `请求失败(${response.status})`);
    }

    const payload = await response.json();
    if (payload?.success === false) {
      throw new Error(payload?.message || '模型推理失败');
    }

    return payload;
  };

  // 获取模型的默认输入示例
  const getModelExample = (modelType) => {
    const examples = {
      legalbert: `卖方所售商品即便质量存在问题，也不承担退换责任，除非商品未开封并且在配送后24小时内出现问题。`,
      
      bert: `新衣购买后首次洗涤就严重缩水、掉色，卖方仅承诺下次购买同款服装打七五折，对此次问题服装不接受退换处理。`,
      
      roberta: `债权人在转让债权时，应书面通知债务人，并提供有关债权转让的详细信息，包括受让方的身份和联系方式。通知后，债务人有权对受让方提出抗辩或请求抵销。`
    };
    
    return examples[modelType] || '请输入合约内容...';
  };

  // 进度模拟
  const simulateProgress = () => {
    setProgressPercentage(0);
    const interval = setInterval(() => {
      setProgressPercentage(prev => {
        if (prev < 90) {
          return prev + Math.random() * 10;
        }
        return prev;
      });
      if (!isAnyLoading) {
        setProgressPercentage(100);
        setTimeout(() => {
          clearInterval(interval);
          setProgressPercentage(0);
        }, 500);
      }
    }, 1000);
    return interval;
  };

  // 运行模型
  const runModel = (modelType) => {
    setSelectedModel(modelType);
    setInputText(getModelExample(modelType));
    setShowInputModal(true);
  };

  // 确认输入并执行模型
  const handleConfirmInput = async () => {
    if (!inputText.trim() || !selectedModel) return;
    
    setShowInputModal(false);
    setLoading(prev => ({ ...prev, [selectedModel]: true }));
    setCurrentExecution({
      model: selectedModel,
      startTime: Date.now()
    });

    const interval = simulateProgress();

    try {
      const startedAt = Date.now();
      const payload = await fetchModelInference(selectedModel, inputText.trim());
      const inferenceResults = Array.isArray(payload?.results) ? payload.results : [];

      const result = {
        model: selectedModel,
        timestamp: new Date().toLocaleString('zh-CN'),
        success: true,
        input: inputText,
        output: buildInferenceSummary(inferenceResults),
        inferenceResults,
        error: '',
        duration: Date.now() - startedAt,
        showConflict: true,
        dynamic: true,
      };

      setResults(prev => [result, ...prev]);
      setActiveResultIndex(0);
    } catch (error) {
      const result = {
        model: selectedModel,
        timestamp: new Date().toLocaleString('zh-CN'),
        success: false,
        input: inputText,
        output: '',
        error: `执行 ${getModelDisplayName(selectedModel)} 模型时发生错误：\n${error.message}`,
        duration: 2500,
        showConflict: false
      };

      setResults(prev => [result, ...prev]);
      setActiveResultIndex(0);
    } finally {
      setLoading(prev => ({ ...prev, [selectedModel]: false }));
      setCurrentExecution({
        model: null,
        startTime: null
      });
      clearInterval(interval);
    }
  };

  const loadPerformanceMetrics = async ({ force = false } = {}) => {
    if (typeof window !== 'undefined' && !force) {
      try {
        const cacheKey = getProvbenchCacheKey();
        const cachedRaw = window.localStorage.getItem(cacheKey);
        if (cachedRaw) {
          const cached = JSON.parse(cachedRaw);
          const hasUsableCache = MODEL_ORDER.every((model) => hasCompleteMetrics(cached?.performance?.[model]));
          if (cached?.expiresAt > Date.now() && hasUsableCache) {
            setPerformance(cached.performance);
            setPerformanceUpdatedAt(cached.performanceUpdatedAt || EMPTY_UPDATED_AT);
            setPerformanceError(EMPTY_ERROR_STATE);
            setPerformanceLoading({
              legalbert: false,
              bert: false,
              roberta: false,
            });
            return;
          }
          window.localStorage.removeItem(cacheKey);
        }
      } catch {
        // 忽略缓存异常，回退到实时请求
      }
    }

    setPerformance({
      bert: { r1: null, r3: null, r5: null },
      roberta: { r1: null, r3: null, r5: null },
      legalbert: { r1: null, r3: null, r5: null },
    });
    setPerformanceUpdatedAt(EMPTY_UPDATED_AT);
    setPerformanceError(EMPTY_ERROR_STATE);
    setPerformanceLoading({
      bert: true,
      roberta: true,
      legalbert: true,
    });

    const tasks = MODEL_ORDER.map(async (model) => {
      try {
        const { metrics } = await fetchModelMetrics(model);
        if (hasCompleteMetrics(metrics)) {
          setPerformance((prev) => ({
            ...prev,
            [model]: {
              r1: metrics.r1,
              r3: metrics.r3,
              r5: metrics.r5,
            },
          }));
          setPerformanceUpdatedAt((prev) => ({
            ...prev,
            [model]: new Date().toLocaleString('zh-CN'),
          }));
          setPerformanceError((prev) => ({ ...prev, [model]: '' }));
        } else {
          setPerformanceError((prev) => ({
            ...prev,
            [model]: '结果不完整，请重新测试',
          }));
        }
      } catch (error) {
        console.error(`自动加载 ${model} 指标失败:`, error);
        setPerformanceError((prev) => ({
          ...prev,
          [model]: error?.name === 'AbortError' ? '请求超时' : (error?.message || '请求失败'),
        }));
      } finally {
        setPerformanceLoading((prev) => ({ ...prev, [model]: false }));
      }
    });

    await Promise.allSettled(tasks);
  };

  useEffect(() => {
    loadPerformanceMetrics();
  }, []);

  const rerunPerformanceMetrics = async () => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem(getProvbenchCacheKey());
      } catch {
        // 忽略缓存清理异常
      }
    }

    await loadPerformanceMetrics({ force: true });
  };

  useEffect(() => {
    if (!hasPerformanceData || typeof window === 'undefined') return;

    try {
      const cacheKey = getProvbenchCacheKey();
      window.localStorage.setItem(cacheKey, JSON.stringify({
        performance,
        performanceUpdatedAt,
        expiresAt: Date.now() + PROVBENCH_CACHE_TTL_MS,
      }));
    } catch {
      // 忽略缓存写入异常
    }
  }, [performance, performanceUpdatedAt, hasPerformanceData]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const cacheKey = getProvbenchTrainingCacheKey();
      const cachedRaw = window.localStorage.getItem(cacheKey);
      if (!cachedRaw) return;

      const cached = JSON.parse(cachedRaw);
      if (!cached?.expiresAt || cached.expiresAt <= Date.now()) {
        window.localStorage.removeItem(cacheKey);
        return;
      }

      if (typeof cached.trainingModel === 'string') setTrainingModel(cached.trainingModel);
      if (typeof cached.trainingEpoch === 'string') setTrainingEpoch(cached.trainingEpoch);
      if (Array.isArray(cached.trainingLogs)) setTrainingLogs(cached.trainingLogs);
      if (typeof cached.trainingError === 'string') setTrainingError(cached.trainingError);
      if (typeof cached.trainingStartedAt === 'string') setTrainingStartedAt(cached.trainingStartedAt);
      if (typeof cached.trainingUpdatedAt === 'string') setTrainingUpdatedAt(cached.trainingUpdatedAt);
    } catch {
      // 忽略训练缓存恢复异常
    } finally {
      setTrainingCacheReady(true);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !trainingCacheReady) return;

    try {
      const cacheKey = getProvbenchTrainingCacheKey();
      const hasTrainingCache =
        trainingLogs.length > 0 ||
        !!trainingError ||
        !!trainingStartedAt ||
        !!trainingUpdatedAt;

      if (!hasTrainingCache) {
        window.localStorage.removeItem(cacheKey);
        return;
      }

      window.localStorage.setItem(cacheKey, JSON.stringify({
        trainingModel,
        trainingEpoch,
        trainingLogs,
        trainingError,
        trainingStartedAt,
        trainingUpdatedAt,
        expiresAt: Date.now() + PROVBENCH_CACHE_TTL_MS,
      }));
    } catch {
      // 忽略训练缓存写入异常
    }
  }, [
    trainingCacheReady,
    trainingModel,
    trainingEpoch,
    trainingLogs,
    trainingError,
    trainingStartedAt,
    trainingUpdatedAt,
  ]);

  const runTrainingProcess = async () => {
    const epochInt = Number.parseInt(trainingEpoch, 10);
    if (!Number.isInteger(epochInt) || epochInt <= 0) {
      setTrainingError('epoch 必须是大于 0 的整数');
      return;
    }

    const startedAt = new Date().toLocaleString('zh-CN');
    setTrainingLoading(true);
    setTrainingError('');
    setTrainingStartedAt(startedAt);
    setTrainingLogs([
      `开始训练：model=${trainingModel}, epoch=${epochInt}`,
      `训练任务已提交，开始时间：${startedAt}`,
      '正在等待后端返回训练过程，请稍候...',
    ]);
    setTrainingUpdatedAt('');

    const appendLog = (line) => {
      if (!line || !line.trim()) return;
      setTrainingLogs((prev) => [...prev, line].slice(-800));
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 300000);
      let response;
      try {
        response = await fetch(featureApi('/api/run-train'), {
          method: 'POST',
          headers: {
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: trainingModel,
            epoch: epochInt,
          }),
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timeoutId);
      }

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || `请求失败(${response.status})`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        // 兜底：不支持流式时退回一次性读取
        const responseText = await response.text();
        const contentType = response.headers.get('content-type') || '';
        let payload = null;

        if (contentType.includes('application/json')) {
          try {
            payload = JSON.parse(responseText);
          } catch {
            payload = null;
          }
        }

        const outputText = payload
          ? (payload?.output || payload?.result || payload?.message || JSON.stringify(payload, null, 2))
          : responseText;

        const lines = String(outputText).split(/\r?\n/).filter(Boolean);
        for (const line of lines.slice(0, 400)) {
          appendLog(line);
          await delay(20);
        }
        if (lines.length > 400) {
          appendLog(`... 已省略 ${lines.length - 400} 行日志`);
        }

        const parsedFromJson = payload ? parseMetricPayload(payload) : { r1: null, r3: null, r5: null };
        const parsedFromText = parseMetricFromOutputText(outputText);
        const metrics = {
          r1: parsedFromJson.r1 ?? parsedFromText.r1,
          r3: parsedFromJson.r3 ?? parsedFromText.r3,
          r5: parsedFromJson.r5 ?? parsedFromText.r5,
        };

        if (metrics.r1 !== null && metrics.r3 !== null && metrics.r5 !== null) {
          setPerformance((prev) => ({
            ...prev,
            [trainingModel]: metrics,
          }));
          setPerformanceUpdatedAt((prev) => ({
            ...prev,
            [trainingModel]: new Date().toLocaleString('zh-CN'),
          }));
        }

        setTrainingUpdatedAt(new Date().toLocaleString('zh-CN'));
        appendLog('训练完成');
      } else {
        const decoder = new TextDecoder('utf-8');
        let buffer = '';
        let allText = '';

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          allText += chunk;
          buffer += chunk;

          const lines = buffer.split(/\r?\n/);
          buffer = lines.pop() || '';
          for (const line of lines) {
            if (line) appendLog(line);
          }
        }

        if (buffer) {
          appendLog(buffer);
          allText += buffer;
        }

        // 训练结束后再从完整文本里解析指标
        const parsedFromText = parseMetricFromOutputText(allText);
        const metrics = {
          r1: parsedFromText.r1,
          r3: parsedFromText.r3,
          r5: parsedFromText.r5,
        };

        if (metrics.r1 !== null && metrics.r3 !== null && metrics.r5 !== null) {
          setPerformance((prev) => ({
            ...prev,
            [trainingModel]: metrics,
          }));
          setPerformanceUpdatedAt((prev) => ({
            ...prev,
            [trainingModel]: new Date().toLocaleString('zh-CN'),
          }));
        }

        setTrainingUpdatedAt(new Date().toLocaleString('zh-CN'));
        appendLog('训练完成');
      }

    } catch (error) {
      setTrainingError(error?.name === 'AbortError' ? '训练请求超时' : (error?.message || '训练失败'));
    } finally {
      setTrainingLoading(false);
    }
  };

  const stopTrainingProcess = async () => {
    setTrainingStopping(true);
    setTrainingError('');

    try {
      const response = await fetch(featureApi('/api/run-train/stop'), {
        method: 'POST',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || `请求失败(${response.status})`);
      }

      setTrainingLogs((prev) => [...prev, '已发送停止训练请求，等待后端释放资源...'].slice(-800));
      setTrainingUpdatedAt(new Date().toLocaleString('zh-CN'));
    } catch (error) {
      setTrainingError(error?.message || '停止训练失败');
    } finally {
      setTrainingStopping(false);
    }
  };

  // 清空结果
  const clearResults = () => {
    setResults([]);
    setActiveResultIndex(0);
  };

  // 切换矛盾检测报告显示状态
  const toggleConflictReport = (index) => {
    setResults(prev => prev.map((r, idx) => 
      idx === index ? { ...r, showConflict: !r.showConflict } : r
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 py-8 px-4">
      
      {/* 输入模态框 */}
      {showInputModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-4xl text-white">📝</div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">输入合约内容</h3>
                    <p className="text-purple-100">请为 {getModelDisplayName(selectedModel)} 模型提供输入</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowInputModal(false);
                    setSelectedModel(null);
                    setInputText('');
                  }}
                  className="text-white hover:text-purple-200 text-2xl transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="text-xl">📄</div>
                    <span>合约内容</span>
                  </div>
                </label>
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`请输入需要分析的合约内容...`}
                  className="w-full h-64 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all duration-200"
                  autoFocus
                />
                <div className="flex justify-between mt-2">
                  <span className="text-sm text-gray-500">
                    {selectedModel === 'legalbert' ? '示例：法律合同文本' : 
                     selectedModel === 'bert' ? '示例：合作协议' : 
                     '示例：债权转让协议'}
                  </span>
                  <span className={`text-sm ${inputText.length > 2000 ? 'text-red-500' : 'text-gray-500'}`}>
                    {inputText.length}/2000 字符
                  </span>
                </div>
              </div>
              
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => {
                    setShowInputModal(false);
                    setSelectedModel(null);
                    setInputText('');
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium"
                >
                  取消
                </button>
                <button
                  onClick={handleConfirmInput}
                  disabled={!inputText.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center gap-2"
                >
                  <span>🚀</span>
                  开始分析
                </button>
              </div>
            </div>
            
            <div className="bg-gray-50 border-t border-gray-200 p-4">
              <div className="flex items-start gap-3">
                <div className="text-blue-500 text-xl">💡</div>
                <div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">提示：</span>
                    {selectedModel === 'legalbert' ? 'LegalBERT专门针对法律文本优化，擅长识别法律合同中的关键权利义务与程序性条款。' : 
                     selectedModel === 'bert' ? 'BERT是通用语言模型，适合分析服务合同中的违约责任、扣款条款等商业约定。' : 
                     'RoBERTa在处理债权转让、抵销权等复杂法律条文方面表现更佳。'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* 页面标题 */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-4 mb-2">
          <div className="text-purple-600 text-5xl">📄</div>
          <div>
            <h2 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">合约一致性判定模型</h2>
            <p className="text-xl text-gray-600 font-light">ProvBench - 基于深度学习的智能合约分析平台</p>
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="max-w-7xl mx-auto">
        {/* 系统简介 */}
        <div className="mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="text-blue-500 text-xl">ℹ️</div>
              <h2 className="text-lg font-semibold text-blue-800">ProvBench 系统简介</h2>
            </div>
            <p className="text-gray-700">
              ProvBench 是一个面向流程驱动的数据溯源系统性能与功能评估的标准化基准测试平台。
              针对数据溯源领域缺乏统一评估标准的问题，ProvBench构建了涵盖异构工作负载的测试框架，支持多类溯源捕获模式、查询响应效率及存储开销的量化比较。平台提供可扩展的测试数据集与评测指标，为溯源系统的算法优化与架构选型提供可复现的验证环境。
            </p>
          </div>
        </div>
        
        {/* 模型选择卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {[
            { 
              id: 'legalbert', 
              title: 'LegalBERT', 
              description: '专门针对法律文本优化的BERT模型，在法律领域数据上进行预训练，擅长分析各类合同与法律文本。', 
              tags: ['法律专用', '高精度', '法律文本'], 
              icon: '📚', 
              color: 'primary' 
            },
            { 
              id: 'bert', 
              title: 'BERT', 
              description: '经典的双向编码器表示模型，在多种NLP任务中表现优异，适用于分析各类文本。', 
              tags: ['经典模型', '通用性强', '合作协议'], 
              icon: '💻', 
              color: 'success' 
            },
            { 
              id: 'roberta', 
              title: 'RoBERTa', 
              description: '优化的BERT模型，采用改进的预训练策略和更大的训练数据，在处理复杂法律条款时表现优异。', 
              tags: ['优化版本', '性能提升'], 
              icon: '⚙️', 
              color: 'warning' 
            }
          ].map((model) => (
            <div 
              key={model.id} 
              className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              style={{ borderLeft: `4px solid ${model.color === 'primary' ? '#3b82f6' : model.color === 'success' ? '#10b981' : '#f59e0b'}` }}
            >
              <div className="p-6">
                <div className="text-4xl mb-4">{model.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{model.title}</h3>
                <p className="text-gray-600 mb-4 min-h-[48px]">{model.description}</p>
                <div className="flex gap-2 mb-6 flex-wrap">
                  {model.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className={`px-3 py-1 text-xs font-medium rounded-full ${model.color === 'primary' ? 'bg-blue-100 text-blue-800' : model.color === 'success' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => runModel(model.id)}
                  disabled={isAnyLoading}
                  className={`w-full py-3 px-6 rounded-full font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${model.color === 'primary' ? 'bg-blue-600 hover:bg-blue-700' : model.color === 'success' ? 'bg-green-600 hover:bg-green-700' : 'bg-amber-600 hover:bg-amber-700'} text-white disabled:opacity-50 disabled:cursor-not-allowed`}
                  style={{ height: '48px' }}
                >
                  {loading[model.id] ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      执行中...
                    </>
                  ) : (
                    <>
                      ▶️
                      运行模型
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* 执行状态 */}
        {currentExecution.model && (
          <div className="mb-10">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-6">
                <div className="text-4xl text-blue-600 animate-spin">🔄</div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-gray-900 mb-2">模型执行中</h4>
                  <p className="text-gray-600">正在运行 {getModelDisplayName(currentExecution.model)} 模型，请耐心等待...</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {currentExecution.model === 'legalbert' ? '分析法律文本中的关键权利义务条款...' : 
                     currentExecution.model === 'bert' ? '分析合作协议违约责任条款...' : 
                     '分析债权转让通知义务条款...'}
                  </p>
                </div>
                <div className="w-48">
                  <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 transition-all duration-300" 
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 结果显示区域 */}
        {results.length > 0 ? (
          <div className="mb-10">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                📊
                执行结果
                <span className="text-sm font-normal text-gray-600">({results.length} 个分析记录)</span>
              </h3>
              <button
                onClick={clearResults}
                disabled={isAnyLoading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🗑️
                清空结果
              </button>
            </div>

            <div className="mb-4 overflow-x-auto">
              <div className="flex gap-3 min-w-max pb-2">
                {results.map((result, index) => (
                  <button
                    key={`${result.model}-${result.timestamp}-${index}`}
                    onClick={() => setActiveResultIndex(index)}
                    className={`rounded-xl border px-4 py-3 text-left transition-all duration-200 min-w-[220px] ${
                      activeResultIndex === index
                        ? 'border-blue-500 bg-blue-50 shadow-sm'
                        : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/40'
                    }`}
                  >
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                      <span>{getModelIcon(result.model)}</span>
                      <span>{getModelDisplayName(result.model)}</span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">{result.timestamp}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-xs rounded-full ${result.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {result.success ? '成功' : '失败'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {Array.isArray(result.inferenceResults) ? `${result.inferenceResults.length} 条法条` : '无结果'}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              {results[activeResultIndex] ? (
                <div 
                  key={`${results[activeResultIndex].model}-${results[activeResultIndex].timestamp}-${activeResultIndex}`}
                  className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden"
                >
                  {/* 结果头部 */}
                  <div className="bg-gray-50 border-b border-gray-200 p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{getModelIcon(results[activeResultIndex].model)}</div>
                        <div>
                          <span className="text-xl font-bold text-gray-900">{getModelDisplayName(results[activeResultIndex].model)}</span>
                          <p className="text-sm text-gray-500">法律条款匹配与矛盾检测</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${results[activeResultIndex].success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {results[activeResultIndex].success ? '执行成功' : '执行失败'}
                        </span>
                        {results[activeResultIndex].dynamic && (
                          <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                            动态测试
                          </span>
                        )}
                        <span className="text-sm text-gray-500">{results[activeResultIndex].timestamp}</span>
                      </div>
                    </div>
                  </div>

                  {/* 结果内容 */}
                  <div className="p-6">
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="text-xl">📋</div>
                        <h4 className="font-semibold text-gray-900">输入合约内容</h4>
                      </div>
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-auto max-h-[240px]">
                        <pre className="text-sm text-gray-700 whitespace-pre-wrap">{results[activeResultIndex].input}</pre>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <div className="flex items-center justify-between gap-3">
                        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                          <span className="text-xl">⚖️</span>
                          匹配和矛盾检测结果
                        </h4>
                        <button
                          onClick={() => toggleConflictReport(activeResultIndex)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-lg text-amber-800 font-medium transition-colors duration-200"
                        >
                          <span>{results[activeResultIndex].showConflict ? '收起' : '展开'}</span>
                          <span className="text-xs bg-amber-200 px-2 py-0.5 rounded-full">
                            {Array.isArray(results[activeResultIndex].inferenceResults) ? `${results[activeResultIndex].inferenceResults.length} 条法条` : '0 条法条'}
                          </span>
                        </button>
                      </div>

                      {results[activeResultIndex].showConflict && (
                        <div className="mt-4 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-gray-200 px-6 py-4">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">⚖️</span>
                              <h3 className="text-lg font-bold text-gray-900">匹配和矛盾检测结果</h3>
                              <span className="ml-auto text-sm text-gray-500">{getModelDisplayName(results[activeResultIndex].model)}</span>
                            </div>
                          </div>

                          <div className="p-6 space-y-4">
                            {Array.isArray(results[activeResultIndex].inferenceResults) && results[activeResultIndex].inferenceResults.length > 0 ? (
                              results[activeResultIndex].inferenceResults.map((item, itemIndex) => {
                                const meta = getConflictMeta(item?.conflict);
                                const styles = getConflictStyles(item?.conflict);
                                return (
                                  <div key={`${results[activeResultIndex].model}-${itemIndex}-${item?.law_num || 'unknown'}`} className={styles.card}>
                                    <div className="flex items-start gap-3">
                                      <span className={`${styles.index} font-bold text-base`}>{itemIndex + 1}.</span>
                                      <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-2 mb-3">
                                          <span className="inline-flex items-center px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-700">
                                            《{item?.law_cate || '未知法典'}》
                                          </span>
                                          <span className="inline-flex items-center px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-700">
                                            第 {item?.law_num || '-'} 条
                                          </span>
                                        </div>
                                        <p className="text-gray-800 text-sm leading-relaxed">
                                          <span className="font-medium">法条内容：</span>
                                          {item?.law_text || '暂无法条内容'}
                                        </p>
                                        <div className="flex items-center gap-3 mt-3">
                                          <span className={styles.badge}>
                                            <span>{Number(item?.conflict) === 1 ? '❌' : '✔'}</span>
                                            {meta.label}
                                          </span>
                                          <span className={styles.riskBadge}>
                                            {meta.risk}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })
                            ) : (
                              <div className="border border-dashed border-gray-300 rounded-lg p-6 text-sm text-gray-500 text-center">
                                后端未返回匹配法条。
                              </div>
                            )}
                          </div>

                          <div className="bg-gray-50 border-t border-gray-200 px-6 py-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">
                                检测时间: {new Date().toLocaleString('zh-CN')}
                              </span>
                              <span className="text-xs text-gray-500">
                                {`高风险 ${Array.isArray(results[activeResultIndex].inferenceResults) ? results[activeResultIndex].inferenceResults.filter((item) => Number(item?.conflict) === 1).length : 0} 条，低风险 ${Array.isArray(results[activeResultIndex].inferenceResults) ? results[activeResultIndex].inferenceResults.filter((item) => Number(item?.conflict) !== 1).length : 0} 条`}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {results[activeResultIndex].error && (
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          ⚠️
                          <h4 className="font-semibold text-red-600">错误信息</h4>
                        </div>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 overflow-auto max-h-[80px]">
                          <pre className="text-sm text-red-700 whitespace-pre-wrap">{results[activeResultIndex].error}</pre>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
        
        <div className="mt-16 max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-200">
              <div className="flex overflow-x-auto">
                {[
                  { id: 'evaluate', label: '模型动态测试启动', icon: '📊' },
                  { id: 'training', label: '模型动态训练启动', icon: '⚙️' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveModule(tab.id)}
                    className={`px-6 py-4 whitespace-nowrap font-medium transition-all duration-300 flex items-center gap-2 ${
                      activeModule === tab.id
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700'
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className={`p-6 ${activeModule !== 'evaluate' ? 'hidden' : ''}`}>
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                {['R@1', 'R@3', 'R@5'].map((metric, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-sm"
                      style={{
                        backgroundColor: idx === 0 ? '#3b82f6' :
                          idx === 1 ? '#10b981' :
                          '#8b5cf6'
                      }}
                    ></div>
                    <span className="text-sm text-gray-700">{metric}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
                {MODEL_ORDER.map((model) => (
                  <div key={model} className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-800">{getModelDisplayName(model)}</span>
                      {performanceLoading[model] ? (
                        <span className="text-xs text-blue-600 animate-pulse">动态测试中...</span>
                      ) : performanceError[model] ? (
                        <span className="text-xs text-red-600" title={performanceError[model]}>加载失败</span>
                      ) : isPerformanceReady(model) ? (
                        <span className="text-xs text-green-600">已完成</span>
                      ) : (
                        <span className="text-xs text-amber-600">未完成</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      最近更新：{performanceUpdatedAt[model] || (performanceError[model] ? '失败' : '未测试')}
                    </p>
                    {performanceError[model] && (
                      <p className="mt-2 text-xs text-red-600">{performanceError[model]}</p>
                    )}
                  </div>
                ))}
              </div>

              {hasPerformanceData ? (
                <div className="relative overflow-x-auto">
                  <div className="flex h-64 min-w-max mx-auto justify-center">
                    <div className="flex items-end gap-32 px-8 h-full relative">
                      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                        {[...Array(5)].map((_, idx) => (
                          <div key={idx} className="border-t border-gray-100"></div>
                        ))}
                      </div>
                      {MODEL_ORDER.map((model) => (
                        <div key={model} className="flex flex-col items-center z-10 h-full">
                          <div className="text-sm font-medium text-gray-700 mb-2 h-6">{getModelDisplayName(model)}</div>
                          <div className="flex items-end gap-4 flex-1 w-full relative">
                            <div
                              className={`w-6 bg-blue-500 rounded-t-sm hover:bg-blue-600 transition-all relative group ${performanceLoading[model] ? 'animate-pulse' : ''}`}
                              style={{ height: `${Math.max(0, Math.min(100, getPerf(model, 'r1')))}%` }}
                            >
                              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                                R@1: {formatPerf(model, 'r1')}%
                              </div>
                            </div>
                            <div
                              className={`w-6 bg-green-500 rounded-t-sm hover:bg-green-600 transition-all relative group ${performanceLoading[model] ? 'animate-pulse' : ''}`}
                              style={{ height: `${Math.max(0, Math.min(100, getPerf(model, 'r3')))}%` }}
                            >
                              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                                R@3: {formatPerf(model, 'r3')}%
                              </div>
                            </div>
                            <div
                              className={`w-6 bg-purple-500 rounded-t-sm hover:bg-purple-600 transition-all relative group ${performanceLoading[model] ? 'animate-pulse' : ''}`}
                              style={{ height: `${Math.max(0, Math.min(100, getPerf(model, 'r5')))}%` }}
                            >
                              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                                R@5: {formatPerf(model, 'r5')}%
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-600">
                  {isAnyPerformanceLoading ? '模型性能动态测试中，结果返回后将展示柱状图。' : '暂未获取到性能结果。'}
                </div>
              )}

              <div className="mt-8 overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3 px-4 text-left font-medium text-gray-700 border-b">TextEncoder</th>
                      <th className="py-3 px-4 text-left font-medium text-gray-700 border-b">R@1</th>
                      <th className="py-3 px-4 text-left font-medium text-gray-700 border-b">R@3</th>
                      <th className="py-3 px-4 text-left font-medium text-gray-700 border-b">R@5</th>
                    </tr>
                  </thead>
                  <tbody>
                    {MODEL_ORDER.map((model) => (
                      <tr key={model} className="hover:bg-gray-50">
                        <td className={`py-3 px-4 border-b font-medium ${MODEL_COLORS[model] || 'text-gray-700'}`}>
                          {getModelDisplayName(model)}
                        </td>
                        <td className="py-3 px-4 border-b">{formatPerf(model, 'r1')}</td>
                        <td className="py-3 px-4 border-b">{formatPerf(model, 'r3')}</td>
                        <td className="py-3 px-4 border-b">{formatPerf(model, 'r5')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex flex-col gap-3 text-sm text-gray-500 md:flex-row md:items-center md:justify-between">
                <p>注：R@1、R@3、R@5表示召回率。LegalBERT在法律条文推荐任务中综合表现最佳。</p>
                <button
                  onClick={rerunPerformanceMetrics}
                  disabled={isAnyPerformanceLoading}
                  className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnyPerformanceLoading ? '重新测试中...' : '重新测试'}
                </button>
              </div>
            </div>

            <div className={`p-6 ${activeModule !== 'training' ? 'hidden' : ''}`}>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">模型训练与优化</h3>
                <p className="text-gray-700 text-sm">选择模型并设置 epoch（整数），点击开始训练后将动态展示返回的训练过程。</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">模型</label>
                  <select
                    value={trainingModel}
                    onChange={(e) => setTrainingModel(e.target.value)}
                    disabled={trainingLoading}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  >
                    {TRAIN_MODEL_OPTIONS.map((model) => (
                      <option key={model} value={model}>
                        {getModelDisplayName(model)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">epoch（整数）</label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={trainingEpoch}
                    onChange={(e) => setTrainingEpoch(e.target.value)}
                    disabled={trainingLoading}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div className="flex items-end">
                  <div className="w-full grid grid-cols-2 gap-3">
                    <button
                      onClick={runTrainingProcess}
                      disabled={trainingLoading || trainingStopping}
                      className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {trainingLoading ? '训练中...' : '开始训练'}
                    </button>
                    <button
                      onClick={stopTrainingProcess}
                      disabled={trainingStopping}
                      className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {trainingStopping ? '停止中...' : '停止训练'}
                    </button>
                  </div>
                </div>
              </div>

              {trainingError && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                  {trainingError}
                </div>
              )}

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-700">训练过程动态日志</p>
                  <p className="text-xs text-gray-500">
                    {trainingLoading
                      ? `训练进行中 · 启动于 ${trainingStartedAt || '刚刚'}`
                      : trainingUpdatedAt
                        ? `最近完成：${trainingUpdatedAt}`
                        : '尚未执行'}
                  </p>
                </div>
                <div className="max-h-[420px] overflow-auto bg-white border border-gray-200 rounded p-3">
                  {trainingLoading && (
                    <div className="mb-3 flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2">
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>训练任务已启动，正在持续接收后端结果...</span>
                    </div>
                  )}
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap break-all">
                    {trainingLogs.length > 0 ? trainingLogs.join('\n') : '点击“开始训练”后，这里会动态显示后端返回的训练过程。'}
                  </pre>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default ProvBench;
