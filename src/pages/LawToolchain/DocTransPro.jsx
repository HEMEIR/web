import React, { useEffect, useState } from 'react';
import { featureApi } from '@/utils/apiBase';

const DOC_TRANS_PRO_CACHE_KEY = 'doc_trans_pro_last_result';

/*转化与标注：DocTransPro*/
const DocTransPro = () => {
  const [launching, setLaunching] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState('');
  const [lastStartTime, setLastStartTime] = useState(null);
  const [serviceStatusText, setServiceStatusText] = useState('待启动');
  const [serviceMessage, setServiceMessage] = useState('');

  const [showConversionDemo, setShowConversionDemo] = useState(false);
  const [uploadedPdfFile, setUploadedPdfFile] = useState(null);
  const [uploadedJobId, setUploadedJobId] = useState('');
  const [conversionStep, setConversionStep] = useState(0);
  const [isUploadingJob, setIsUploadingJob] = useState(false);
  const [isConvertingDocx, setIsConvertingDocx] = useState(false);
  const [isConvertingTxt, setIsConvertingTxt] = useState(false);
  const [docxPreviewUrl, setDocxPreviewUrl] = useState('');
  const [txtPreviewUrl, setTxtPreviewUrl] = useState('');

  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewContent, setPreviewContent] = useState('');
  const [previewFileName, setPreviewFileName] = useState('');
  const [previewMode, setPreviewMode] = useState('text');

  const stripHtmlToText = (content) => {
    if (!content || typeof content !== 'string') {
      return '';
    }

    if (typeof window !== 'undefined' && typeof window.DOMParser !== 'undefined') {
      const parsed = new window.DOMParser().parseFromString(content, 'text/html');
      return parsed.body?.textContent?.replace(/\n{3,}/g, '\n\n').trim() || '';
    }

    return content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  };

  const getStatusSummary = (payload) => {
    if (!payload || typeof payload !== 'object') {
      return { running: false, text: '待启动', message: '' };
    }

    const inferredRunning =
      payload.running ??
      payload.is_running ??
      payload.data?.running ??
      payload.data?.is_running;

    const running = typeof inferredRunning === 'boolean'
      ? inferredRunning
      : Boolean(payload.success && (payload.status === 'running' || payload.state === 'running'));

    const text =
      payload.status_text ||
      payload.status ||
      payload.state ||
      payload.message ||
      payload.data?.status_text ||
      payload.data?.status ||
      payload.data?.state ||
      (running ? '程序运行中' : '待启动');

    const message =
      payload.message ||
      payload.detail ||
      payload.data?.message ||
      '';

    return { running, text, message };
  };

  const syncServiceStatus = async ({ silent = false } = {}) => {
    if (!silent) {
      setError('');
    }

    try {
      const response = await fetch(featureApi('/api/doctranspro/status'));
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.message || payload?.detail || `状态查询失败（${response.status}）`);
      }

      const summary = getStatusSummary(payload);
      setIsRunning(summary.running);
      setServiceStatusText(summary.text || (summary.running ? '程序运行中' : '待启动'));
      setServiceMessage(summary.message || '');
    } catch (err) {
      setError(err.message || '状态检查失败');
      setServiceStatusText('状态异常');
    }
  };

  useEffect(() => {
    syncServiceStatus({ silent: true });
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const cachedRaw = window.localStorage.getItem(DOC_TRANS_PRO_CACHE_KEY);
      if (!cachedRaw) return;

      const cached = JSON.parse(cachedRaw);
      if (!cached || typeof cached !== 'object') return;

      setUploadedPdfFile(cached.uploadedPdfFile || null);
      setUploadedJobId(cached.uploadedJobId || '');
      setConversionStep(cached.conversionStep || 0);
      setDocxPreviewUrl(cached.docxPreviewUrl || '');
      setTxtPreviewUrl(cached.txtPreviewUrl || '');
      setLastStartTime(cached.lastStartTime || null);
      setServiceStatusText(cached.serviceStatusText || '待启动');
      setServiceMessage(cached.serviceMessage || '');
      setIsRunning(Boolean(cached.isRunning));
    } catch {
      window.localStorage.removeItem(DOC_TRANS_PRO_CACHE_KEY);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const cachePayload = {
      uploadedPdfFile,
      uploadedJobId,
      conversionStep,
      docxPreviewUrl,
      txtPreviewUrl,
      lastStartTime,
      serviceStatusText,
      serviceMessage,
      isRunning
    };

    window.localStorage.setItem(DOC_TRANS_PRO_CACHE_KEY, JSON.stringify(cachePayload));
  }, [
    uploadedPdfFile,
    uploadedJobId,
    conversionStep,
    docxPreviewUrl,
    txtPreviewUrl,
    lastStartTime,
    serviceStatusText,
    serviceMessage,
    isRunning
  ]);

  const getDocxFileName = () => {
    if (!uploadedPdfFile) return 'output.docx';
    return uploadedPdfFile.name.replace(/\.pdf$/i, '.docx');
  };

  const getTxtFileName = () => {
    if (!uploadedPdfFile) return 'output.txt';
    return uploadedPdfFile.name.replace(/\.pdf$/i, '.txt');
  };

  const getDocxDownloadUrl = () => {
    if (!uploadedJobId) return '';
    return featureApi(`/api/doctranspro/jobs/${uploadedJobId}/download/docx`);
  };

  const getTxtDownloadUrl = () => {
    if (!uploadedJobId) return '';
    return featureApi(`/api/doctranspro/jobs/${uploadedJobId}/download/txt`);
  };

  const triggerDownload = async (downloadUrl, fileName) => {
    try {
      const response = await fetch(downloadUrl);
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `下载失败（${response.status}）`);
      }

      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(objectUrl);
    } catch (err) {
      setError(err.message || '文件下载失败');
    }
  };

  const openPreview = async (previewUrl, fileName) => {
    try {
      const response = await fetch(previewUrl);
      const contentType = response.headers.get('content-type') || '';
      const content = contentType.includes('application/json')
        ? JSON.stringify(await response.json(), null, 2)
        : await response.text();

      if (!response.ok) {
        throw new Error(content || `预览失败（${response.status}）`);
      }

      const isHtmlPreview =
        contentType.includes('text/html') ||
        (typeof content === 'string' && /<\s*!doctype html>|<html[\s>]/i.test(content));

      const isTxtFile = fileName.toLowerCase().endsWith('.txt');
      const normalizedContent = isTxtFile && isHtmlPreview
        ? stripHtmlToText(content)
        : content;

      setPreviewMode(isHtmlPreview && !isTxtFile ? 'html' : 'text');
      setPreviewContent(normalizedContent || '文件内容为空');
      setPreviewFileName(fileName);
      setPreviewVisible(true);
    } catch (err) {
      setError(err.message || '文件预览失败');
    }
  };

  const openConversionPanel = async () => {
    if (isRunning) {
      setShowConversionDemo(true);
      return;
    }

    setLaunching(true);
    setError('');

    try {
      const response = await fetch(featureApi('/api/doctranspro/launch'), {
        method: 'POST'
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.message || payload?.detail || `启动失败（${response.status}）`);
      }

      const summary = getStatusSummary(payload);
      setIsRunning(summary.running || true);
      setServiceStatusText(summary.text || '程序运行中');
      setServiceMessage(summary.message || '服务启动成功');
      setLastStartTime(new Date().toLocaleString('zh-CN'));
      setShowConversionDemo(true);
      setConversionStep(0);
      setUploadedPdfFile(null);
      setUploadedJobId('');
      setDocxPreviewUrl('');
      setTxtPreviewUrl('');
    } catch (err) {
      setError(err.message || '启动失败');
      setServiceStatusText('启动失败');
    } finally {
      setLaunching(false);
    }
  };

  const handlePdfUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf')) {
      alert('请上传 PDF 文件');
      event.target.value = '';
      return;
    }

    setIsUploadingJob(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(featureApi('/api/doctranspro/jobs'), {
        method: 'POST',
        body: formData
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.message || payload?.detail || `上传失败（${response.status}）`);
      }

      setUploadedPdfFile({
        name: file.name,
        size: file.size,
        type: file.type
      });
      setUploadedJobId(payload?.job_id || '');
      setConversionStep(1);
      setDocxPreviewUrl('');
      setTxtPreviewUrl('');
    } catch (err) {
      setError(err.message || 'PDF 上传失败');
      event.target.value = '';
    } finally {
      setIsUploadingJob(false);
    }
  };

  const convertToDocx = async () => {
    if (!uploadedJobId) {
      setError('缺少 job_id，请重新上传 PDF');
      return;
    }

    setIsConvertingDocx(true);
    setError('');

    try {
      const response = await fetch(featureApi(`/api/doctranspro/jobs/${uploadedJobId}/convert/docx`), {
        method: 'POST'
      });
      const contentType = response.headers.get('content-type') || '';
      const payload = contentType.includes('application/json')
        ? await response.json()
        : await response.text();

      if (!response.ok) {
        const message = typeof payload === 'string'
          ? payload
          : payload?.message || payload?.detail;
        throw new Error(message || `DOCX 转换失败（${response.status}）`);
      }

      setDocxPreviewUrl(featureApi(`/api/doctranspro/jobs/${uploadedJobId}/preview/docx`));
      setConversionStep(2);
    } catch (err) {
      setError(err.message || 'DOCX 转换失败');
    } finally {
      setIsConvertingDocx(false);
    }
  };

  const convertToTxt = async () => {
    if (!uploadedJobId) {
      setError('缺少 job_id，请重新上传 PDF');
      return;
    }

    setIsConvertingTxt(true);
    setError('');

    try {
      const response = await fetch(featureApi(`/api/doctranspro/jobs/${uploadedJobId}/convert/txt`), {
        method: 'POST'
      });
      const contentType = response.headers.get('content-type') || '';
      const payload = contentType.includes('application/json')
        ? await response.json()
        : await response.text();

      if (!response.ok) {
        const message = typeof payload === 'string'
          ? payload
          : payload?.message || payload?.detail;
        throw new Error(message || `TXT 转换失败（${response.status}）`);
      }

      setTxtPreviewUrl(featureApi(`/api/doctranspro/jobs/${uploadedJobId}/preview/txt`));
      setConversionStep(3);
    } catch (err) {
      setError(err.message || 'TXT 转换失败');
    } finally {
      setIsConvertingTxt(false);
    }
  };

  const closeConversionDemo = () => {
    setShowConversionDemo(false);
  };

  const resetConversion = () => {
    setConversionStep(0);
    setUploadedPdfFile(null);
    setUploadedJobId('');
    setDocxPreviewUrl('');
    setTxtPreviewUrl('');
  };

  const getStatusType = () => {
    if (launching) return 'warning';
    if (error) return 'danger';
    if (isRunning) return 'success';
    return 'info';
  };

  const getStatusText = () => {
    if (launching) return '正在启动';
    if (error) return '状态异常';
    return serviceStatusText || (isRunning ? '程序运行中' : '待启动');
  };

  const clearError = () => {
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 py-8 px-4">
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-4 mb-3">
          <div className="text-red-600 text-5xl">📄</div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">DocTransPro 文档格式转化与表格识别系统</h1>
            <p className="text-xl text-gray-600 font-light italic">Document Transformation Professional - 智能文档处理解决方案</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden p-6">
          <div className="mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="text-blue-500 text-xl">ℹ️</div>
                <h2 className="text-lg font-semibold text-blue-800">DocTransPro 系统简介</h2>
              </div>
              <p className="text-gray-700">
                DocTransPro 是一个文档格式转化与文本提取系统，支持 PDF 上传、PDF 转 DOCX、DOCX 转 TXT，
                并提供 DOCX/TXT 在线预览能力。当前页面已接入真实接口，可直接验证文字型 PDF 和图片型 PDF 的转换流程。
              </p>
            </div>
          </div>

          <div className="mb-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="text-red-500 text-xl">⚙️</div>
                <h2 className="text-xl font-bold text-gray-900">系统控制台</h2>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="text-sm font-medium text-gray-500 mb-2">系统状态</div>
                      <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${getStatusType() === 'success' ? 'bg-green-100 text-green-800' : getStatusType() === 'danger' ? 'bg-red-100 text-red-800' : getStatusType() === 'warning' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                        {getStatusText()}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500 mb-2">服务接口</div>
                      <p className="text-sm text-blue-600">/api/doctranspro</p>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500 mb-2">上次启动时间</div>
                      <p className="text-sm text-gray-700">{lastStartTime || '暂无记录'}</p>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500 mb-2">状态说明</div>
                      <p className="text-sm text-gray-700">{serviceMessage || '可通过控制台按钮检查服务状态并执行转换任务。'}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-gray-600">
                    点击开始转换后，系统会自动准备服务并打开 PDF 转换面板。
                  </p>

                  <button
                    onClick={openConversionPanel}
                    disabled={launching}
                    className="shrink-0 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>▶</span>
                    {launching ? '正在准备...' : '开始转换'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-green-500 text-4xl mb-3">1</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">上传 PDF</h3>
                </div>
                <div className="text-center">
                  <div className="text-yellow-500 text-4xl mb-3">2</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">转 DOCX</h3>
                </div>
                <div className="text-center">
                  <div className="text-red-500 text-4xl mb-3">3</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">预览 DOCX</h3>
                </div>
                <div className="text-center">
                  <div className="text-blue-500 text-4xl mb-3">4</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">转 TXT</h3>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="text-green-500 text-xl">🧭</div>
                <h2 className="text-xl font-bold text-gray-900">使用说明</h2>
              </div>

              <div className="border-l-4 border-blue-500 pl-6 text-gray-600">
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-full font-medium bg-blue-600 text-white">1</div>
                    <h3 className="text-lg font-semibold">开始转换</h3>
                  </div>
                  <p className="ml-11 text-sm">点击【开始转换】后，前端会自动确保服务可用，并直接打开转换面板。</p>
                </div>

                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-full font-medium bg-blue-600 text-white">2</div>
                    <h3 className="text-lg font-semibold">上传 PDF</h3>
                  </div>
                  <p className="ml-11 text-sm">在转换面板中上传 PDF，系统会创建真实任务并返回 `job_id`。</p>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-full font-medium bg-blue-600 text-white">3</div>
                    <h3 className="text-lg font-semibold">执行转换与预览</h3>
                  </div>
                  <p className="ml-11 text-sm">依次执行 PDF → DOCX → TXT 转换，并可在每一步直接预览结果。</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {error && (
        <div className="max-w-6xl mx-auto mt-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="text-red-500 text-xl">❌</div>
              <h3 className="text-lg font-semibold text-red-800">{error}</h3>
              <button
                onClick={clearError}
                className="ml-auto text-red-500 hover:text-red-700 transition-colors duration-300"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {showConversionDemo && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-900">📄 PDF 文件转换面板</h3>
              <button
                onClick={closeConversionDemo}
                className="text-gray-500 hover:text-gray-700 text-2xl transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              {!uploadedPdfFile && (
                <div className="space-y-6">
                  <div className="bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg p-8 text-center">
                    <div className="text-5xl mb-4">📁</div>
                    <h4 className="text-xl font-semibold text-blue-900 mb-2">选择 PDF 文件</h4>
                    <p className="text-blue-700 mb-6">上传后将创建真实任务，并返回 `job_id`。</p>
                    <label className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition-all duration-300">
                      {isUploadingJob ? '上传中...' : '选择 PDF 文件'}
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handlePdfUpload}
                        className="hidden"
                        disabled={isUploadingJob}
                      />
                    </label>
                  </div>
                </div>
              )}

              {uploadedPdfFile && (
                <div className="space-y-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-4xl">✅</div>
                      <div>
                        <h4 className="text-lg font-semibold text-green-900">PDF 上传成功</h4>
                        <p className="text-green-700">文件名: {uploadedPdfFile.name}</p>
                        <p className="text-green-600 text-sm">job_id: {uploadedJobId || '--'}</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={convertToDocx}
                    disabled={isConvertingDocx}
                    className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isConvertingDocx ? 'DOCX 转换中...' : '转换为 DOCX 文件'}
                  </button>
                </div>
              )}

              {docxPreviewUrl && (
                <div className="space-y-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-4xl">✅</div>
                      <div>
                        <h4 className="text-lg font-semibold text-green-900">成功转换为 DOCX</h4>
                        <p className="text-green-700">预览接口已就绪</p>
                        <p className="text-green-600 text-sm">{docxPreviewUrl}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <button
                      onClick={() => openPreview(docxPreviewUrl, getDocxFileName())}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      👁️ 预览 DOCX
                    </button>

                    <button
                      onClick={() => triggerDownload(getDocxDownloadUrl(), getDocxFileName())}
                      className="px-6 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 border border-slate-900"
                      style={{ backgroundColor: '#1e293b', color: '#ffffff' }}
                    >
                      ⬇️ 下载 DOCX
                    </button>
                  </div>

                  <button
                    onClick={convertToTxt}
                    disabled={isConvertingTxt}
                    className="w-full px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isConvertingTxt ? 'TXT 转换中...' : '转换为 TXT 文件'}
                  </button>
                </div>
              )}

              {txtPreviewUrl && (
                <div className="space-y-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-4xl">✅</div>
                      <div>
                        <h4 className="text-lg font-semibold text-green-900">成功转换为 TXT</h4>
                        <p className="text-green-700">TXT 预览接口已就绪</p>
                        <p className="text-green-600 text-sm">{txtPreviewUrl}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <button
                      onClick={() => openPreview(txtPreviewUrl, getTxtFileName())}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      👁️ 预览 TXT
                    </button>
                    <button
                      onClick={() => triggerDownload(getTxtDownloadUrl(), getTxtFileName())}
                      className="px-6 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 border border-slate-900"
                      style={{ backgroundColor: '#1e293b', color: '#ffffff' }}
                    >
                      ⬇️ 下载 TXT
                    </button>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6 text-center">
                    <div className="text-5xl mb-4">🎉</div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">转换流程已完成</h4>
                    <p className="text-gray-700 mb-4">已完成 PDF → DOCX → TXT 文档转换。</p>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>📄 原始文件: {uploadedPdfFile?.name}</p>
                      <p>📥 DOCX 文件: {getDocxFileName()}</p>
                      <p>📝 TXT 文件: {getTxtFileName()}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t sticky bottom-0 bg-white flex justify-end gap-3">
              {uploadedPdfFile && (
                <button
                  onClick={resetConversion}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300"
                >
                  重新选择
                </button>
              )}
              <button
                onClick={closeConversionDemo}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${txtPreviewUrl ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-600 hover:bg-gray-700 text-white'}`}
              >
                {txtPreviewUrl ? '完成' : '关闭'}
              </button>
            </div>
          </div>
        </div>
      )}

      {previewVisible && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div
            className={`bg-white rounded-xl shadow-lg w-full overflow-y-auto ${
              previewMode === 'html' ? 'max-w-3xl max-h-[86vh]' : 'max-w-2xl max-h-[62vh]'
            }`}
          >
            <div className="p-6 border-b sticky top-0 bg-white flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900">📄 {previewFileName}</h3>
              <button
                onClick={() => setPreviewVisible(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              {previewMode === 'html' ? (
                <div
                  className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                  style={{ maxHeight: '32vh', overflowY: 'auto' }}
                >
                  <iframe
                    title={previewFileName}
                    srcDoc={previewContent || '<p>文件内容为空</p>'}
                    className="w-full bg-white border-0"
                    style={{ height: '32vh' }}
                  />
                </div>
              ) : (
                <div
                  className="bg-gray-50 border border-gray-200 rounded-lg p-4 whitespace-pre-wrap break-words text-sm font-mono text-gray-700"
                  style={{ maxHeight: '32vh', overflowY: 'auto' }}
                >
                  {previewContent || '文件内容为空'}
                </div>
              )}
            </div>
            <div className="p-6 border-t sticky bottom-0 bg-white flex justify-end">
              <button
                onClick={() => setPreviewVisible(false)}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocTransPro;
