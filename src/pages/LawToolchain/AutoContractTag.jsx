import React, { useState } from 'react';
import { featureApi } from '@/utils/apiBase';

/*转化与标注：AutoContractTag*/
const AutoContractTag = () => {
// 响应式数据
const [originalContract, setOriginalContract] = useState('');
const [generatedContract, setGeneratedContract] = useState('');
const [generatedAnnotation, setGeneratedAnnotation] = useState('');
const [structuredAnnotation, setStructuredAnnotation] = useState(null);
const [annotationMeta, setAnnotationMeta] = useState(null);
const [isGenerating, setIsGenerating] = useState(false);
const [isGeneratingAnnotation, setIsGeneratingAnnotation] = useState(false);
const [isDownloadingContract, setIsDownloadingContract] = useState(false);
const [fileInputRef] = useState(React.createRef());
const [isUploadingFile, setIsUploadingFile] = useState(false);

// 处理文件上传
const handleFileUpload = () => {
  if (isUploadingFile) return;
  fileInputRef.current?.click();
};

// 处理文件选择
const handleFileSelect = async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  // 检查文件类型
  const allowedTypes = ['.txt'];
  const fileExtension = `.${file.name.split('.').pop().toLowerCase()}`;
  
  if (!allowedTypes.includes(fileExtension)) {
    alert('请选择文本文件 (.txt)');
    event.target.value = '';
    return;
  }

  setIsUploadingFile(true);

  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(featureApi('/api/autocontracttag/upload'), {
      method: 'POST',
      body: formData,
    });

    const contentType = response.headers.get('content-type') || '';
    const payload = contentType.includes('application/json')
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      const errorMessage = typeof payload === 'string'
        ? payload
        : payload?.message || payload?.detail || payload?.error;
      throw new Error(errorMessage || `上传失败（${response.status}）`);
    }

    const uploadedText = typeof payload === 'string'
      ? payload
      : payload?.content
        || payload?.text
        || payload?.data?.content
        || payload?.data?.text
        || payload?.result?.content
        || payload?.result?.text
        || '';

    if (uploadedText) {
      setOriginalContract(uploadedText);
    }

    alert(`文件 "${file.name}" 上传成功！`);
  } catch (error) {
    console.error('上传文件失败:', error);
    alert(error.message || '上传文件失败，请稍后重试');
  } finally {
    setIsUploadingFile(false);
    event.target.value = '';
  }
};

// 清空合同内容
const clearContractContent = () => {
  if (window.confirm('确定要清空合同内容吗？所有输入的内容将会丢失。')) {
    setOriginalContract('');
    alert('合同内容已清空');
  }
};

const getGeneratedContractText = (payload) => {
  if (typeof payload === 'string') {
    return payload;
  }

  if (!payload || typeof payload !== 'object') {
    return '';
  }

  return (
    payload.filled_contract ||
    payload.generated_contract ||
    payload.contract_text ||
    payload.contract ||
    payload.content_text ||
    payload.text ||
    payload.content ||
    payload.result?.filled_contract ||
    payload.result?.generated_contract ||
    payload.result?.contract_text ||
    payload.result?.contract ||
    payload.result?.content_text ||
    payload.result?.text ||
    payload.result?.content ||
    payload.data?.filled_contract ||
    payload.data?.generated_contract ||
    payload.data?.contract_text ||
    payload.data?.contract ||
    payload.data?.content_text ||
    payload.data?.text ||
    payload.data?.content ||
    ''
  );
};

// 真实合同生成
const handleGenerateContract = async () => {
  if (!originalContract.trim()) {
    alert('请输入原合同内容');
    return;
  }

  if (!structuredAnnotation?.rawItems?.length) {
    alert('请先点击“生成标注”，再生成合同。');
    return;
  }

  setIsGenerating(true);

  try {
    const response = await fetch(featureApi('/api/autocontracttag/generate'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content: structuredAnnotation.rawItems
      })
    });

    const contentType = response.headers.get('content-type') || '';
    const payload = contentType.includes('application/json')
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      const errorMessage = typeof payload === 'string'
        ? payload
        : payload?.message || payload?.detail || payload?.error;
      throw new Error(errorMessage || `生成合同失败（${response.status}）`);
    }

    const generatedContent = getGeneratedContractText(payload);
    if (!generatedContent) {
      throw new Error('接口调用成功，但未返回可展示的合同内容。');
    }

    setGeneratedContract(generatedContent);
  } catch (error) {
    console.error('生成合同失败:', error);
    alert(error.message || '生成合同失败，请稍后重试');
  } finally {
    setIsGenerating(false);
  }
};

const getAnnotationItems = (payload) => {
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  const content =
    payload.content ||
    payload.result?.content ||
    payload.data?.content;

  return Array.isArray(content) ? content : null;
};

const formatAnnotationResult = (payload) => {
  if (typeof payload === 'string') {
    return payload;
  }

  if (!payload || typeof payload !== 'object') {
    return '';
  }

  const preferredText =
    payload.annotation_text ||
    payload.annotated_text ||
    payload.annotation ||
    payload.result_text ||
    payload.content ||
    payload.text ||
    payload.result?.annotation_text ||
    payload.result?.annotated_text ||
    payload.result?.annotation ||
    payload.result?.result_text ||
    payload.result?.content ||
    payload.result?.text ||
    payload.data?.annotation_text ||
    payload.data?.annotated_text ||
    payload.data?.annotation ||
    payload.data?.result_text ||
    payload.data?.content ||
    payload.data?.text;

  if (typeof preferredText === 'string' && preferredText.trim()) {
    return preferredText;
  }

  return JSON.stringify(payload, null, 2);
};

const buildStructuredAnnotation = (payload) => {
  const items = getAnnotationItems(payload);
  if (!items) {
    return null;
  }

  const getByType = (type) => items.find((item) => item?.type === type);

  return {
    contractName: getByType('contract_name'),
    partyA: getByType('party_a'),
    partyB: getByType('party_b'),
    amount: getByType('amount'),
    payment: getByType('payment'),
    deliveryDate: getByType('delivery_date'),
    penalty: getByType('penalty'),
    jurisdiction: getByType('jurisdiction'),
    signDate: getByType('sign_date'),
    rawItems: items
  };
};

const getAnnotationTypeLabel = (type) => {
  const labelMap = {
    contract_name: '合同名称',
    party_a: '甲方信息',
    party_b: '乙方信息',
    amount: '合同金额',
    payment: '支付行为',
    delivery_date: '交付时间',
    penalty: '违约责任',
    jurisdiction: '争议管辖',
    sign_date: '签订日期'
  };

  return labelMap[type] || type || '未知字段';
};

const getAnnotationDisplayLabel = (item) => {
  if (!item || typeof item !== 'object') {
    return '未知字段';
  }

  if (typeof item.label === 'string' && item.label.trim()) {
    return item.label;
  }

  if (typeof item.name === 'string' && item.name.trim()) {
    return item.name;
  }

  return getAnnotationTypeLabel(item.type);
};

const formatCurrency = (value) => {
  if (value === null || value === undefined || value === '') {
    return '--';
  }

  const number = Number(value);
  if (Number.isNaN(number)) {
    return String(value);
  }

  return `¥${number.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

const getAnnotationExtractText = (item) => {
  if (!item || typeof item !== 'object') {
    return '--';
  }

  const directText =
    item.element_text ||
    item.extract_item ||
    item.extract ||
    item.source_text ||
    item.text ||
    item.snippet ||
    item.description;

  if (typeof directText === 'string' && directText.trim()) {
    return directText;
  }

  switch (item.type) {
    case 'contract_name':
      return item.value || '--';
    case 'party_a':
    case 'party_b':
      return `${item.name || ''}：${item.company || '--'}，法定代表人${item.representative || '--'}，地址${item.address || '--'}，联系电话${item.phone || '--'}`;
    case 'amount':
      return `${item.name || '合同总金额'}为${item.chinese || '--'}（${formatCurrency(item.value)}）`;
    case 'payment':
      return `甲方向乙方支付首付款${item.first_payment_percent ?? '--'}%，即${item.first_payment_chinese || '--'}（${formatCurrency(item.first_payment)}）；验收后支付剩余${item.second_payment_percent ?? '--'}%，即${item.second_payment_chinese || '--'}（${formatCurrency(item.second_payment)}）`;
    case 'delivery_date':
      return `乙方应于${item.value || '--'}前完成交付`;
    case 'penalty':
      return `违约方应承担${item.description || item.value || '--'}的违约责任`;
    case 'jurisdiction':
      return `争议由${item.value || '--'}管辖`;
    case 'sign_date':
      return item.value || '--';
    default:
      return item.value || JSON.stringify(item, null, 2);
  }
};

const getAnnotationCount = (payload) => {
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  const explicitCount =
    payload.annotation_count ??
    payload.annotations_count ??
    payload.element_count ??
    payload.entity_count ??
    payload.result?.annotation_count ??
    payload.result?.annotations_count ??
    payload.result?.element_count ??
    payload.result?.entity_count ??
    payload.data?.annotation_count ??
    payload.data?.annotations_count ??
    payload.data?.element_count ??
    payload.data?.entity_count;

  if (typeof explicitCount === 'number') {
    return explicitCount;
  }

  const annotationList =
    payload.annotations ||
    payload.entities ||
    payload.labels ||
    payload.content ||
    payload.result?.annotations ||
    payload.result?.entities ||
    payload.result?.labels ||
    payload.result?.content ||
    payload.data?.annotations ||
    payload.data?.entities ||
    payload.data?.labels ||
    payload.data?.content;

  return Array.isArray(annotationList) ? annotationList.length : null;
};

// 真实标注生成
const handleGenerateAnnotation = async () => {
  if (!originalContract.trim()) {
    alert('请输入原合同内容');
    return;
  }

  setIsGeneratingAnnotation(true);

  const startTime = performance.now();

  try {
    const response = await fetch(featureApi('/api/autocontracttag/annotate'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: originalContract
      })
    });

    const contentType = response.headers.get('content-type') || '';
    const payload = contentType.includes('application/json')
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      const errorMessage = typeof payload === 'string'
        ? payload
        : payload?.message || payload?.detail || payload?.error;
      throw new Error(errorMessage || `标注失败（${response.status}）`);
    }

    const annotationContent = formatAnnotationResult(payload);
    const parsedAnnotation = buildStructuredAnnotation(payload);
    const elapsedSeconds = ((performance.now() - startTime) / 1000).toFixed(2);
    const annotationCount = getAnnotationCount(payload);

    setGeneratedAnnotation(annotationContent || '接口调用成功，但未返回可展示的标注内容。');
    setStructuredAnnotation(parsedAnnotation);
    setAnnotationMeta({
      duration: elapsedSeconds,
      annotationCount,
      generatedAt: new Date().toLocaleString()
    });
  } catch (error) {
    console.error('生成标注失败:', error);
    setGeneratedAnnotation(`标注失败：${error.message || '请稍后重试'}`);
    setStructuredAnnotation(null);
    setAnnotationMeta(null);
    alert(error.message || '生成标注失败，请稍后重试');
  } finally {
    setIsGeneratingAnnotation(false);
  }
};

// 生成合同编号
const generateContractNumber = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `CONTRACT-${year}${month}${day}-${random}`;
};

// 处理下载
const handleDownload = async () => {
  if (!generatedContract) return;

  setIsDownloadingContract(true);

  try {
    const filename = 'AutoTag.txt';
    const response = await fetch(featureApi('/api/autocontracttag/download'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        content: generatedContract,
        filename
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || `下载失败（${response.status}）`);
    }

    const blob = await response.blob();
    const contentDisposition = response.headers.get('content-disposition') || '';
    const matchedFilename = contentDisposition.match(/filename\*?=(?:UTF-8'')?"?([^\";]+)"?/i);
    const downloadFilename = matchedFilename?.[1]
      ? 'AutoTag.txt'
      : filename;

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = downloadFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('下载合同失败:', error);
    alert(error.message || '下载合同失败，请稍后重试');
  } finally {
    setIsDownloadingContract(false);
  }
};

// 清除生成的合同
const clearGeneratedContract = () => {
  setGeneratedContract('');
};

// 清除生成的标注
const clearGeneratedAnnotation = () => {
  setGeneratedAnnotation('');
  setStructuredAnnotation(null);
  setAnnotationMeta(null);
};

// 隐藏的文件输入
const hiddenFileInput = (
  <input
    type="file"
    ref={fileInputRef}
    style={{ display: 'none' }}
    onChange={handleFileSelect}
    accept=".txt,.doc,.docx,.pdf,.md"
  />
);

return (
  <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 py-8 px-4">
    {/* 页面标题 */}
    <div className="text-center mb-10">
      <div className="flex items-center justify-center gap-4 mb-3">
        <div className="text-orange-600 text-5xl">✏️</div>
        <div>
          <h1 className="text-4xl font-bold text-gray-900 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">AutoContractTag 合同自动标注与生成系统</h1>
          <p className="text-xl text-gray-600 font-light italic">Automatic Contract Tagging - 调试版本</p>
        </div>
      </div>
    </div>


    {/* 合同生成系统模块 */}
    <div className="max-w-6xl mx-auto mb-8">
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden p-6">
      {/* 系统简介 */}
      <div className="mb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="text-blue-500 text-xl">ℹ️</div>
            <h2 className="text-lg font-semibold text-blue-800">AutoContractTag 系统简介</h2>
          </div>
          <p className="text-gray-700">
                AutoContractTag 是一款基于Doccano的法律合同智能处理工具，专注于实现合同文本的自动要素标注与标准化文档生成。该工具深度融合预训练语言模型与可视化标注平台，能够自动识别合同中的当事人、日期、金额、条款等关键法律要素，并将其高效映射至Doccano标注界面。
          </p>
        </div>
      </div>
        <div className="bg-blue-50 p-6 rounded-xl mb-6 border border-blue-200">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 左侧：原合同输入 - 简洁格式 */}
            <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <div className="text-green-600 text-xl">📋</div>
                  <h3 className="text-lg font-semibold text-gray-900">原合同</h3>
                </div>
                <div className="text-sm text-gray-500">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">可编辑</span>
                </div>
              </div>
              
              <div className="mb-4">
                <textarea
                  className="w-full h-96 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                  value={originalContract}
                  onChange={(e) => setOriginalContract(e.target.value)}
                  placeholder="请上传或输入原合同内容..."
                />
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <button 
                  onClick={handleFileUpload}
                  disabled={isUploadingFile}
                  className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full hover:bg-blue-200 transition-colors flex items-center gap-1"
                >
                  <span className="text-xs">📁</span>
                  {isUploadingFile ? '上传中...' : '上传合同文件'}
                </button>
                <button 
                  onClick={clearContractContent}
                  className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full hover:bg-green-200 transition-colors flex items-center gap-1"
                >
                  <span className="text-xs">🗑️</span>
                  清空内容
                </button>
                {hiddenFileInput}
              </div>
              
              {/* 文件信息提示 */}
              <div className="text-xs text-gray-500 mt-2">
                <p>支持格式：.txt</p>
              </div>
            </div>
            
            {/* 右侧：两个框体竖着排列 */}
            <div className="flex flex-col gap-6">
              {/* 生成的标注结果框体 */}
              <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <div className="text-purple-600 text-xl">🔍</div>
                    <h3 className="text-lg font-semibold text-gray-900">生成的标注结果</h3>
                  </div>
                  {generatedAnnotation && (
                    <div className="text-sm">
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">已标注</span>
                    </div>
                  )}
                </div>
                
                <div className="mb-4">
                  <div className="border border-gray-300 rounded-lg min-h-32 max-h-96 overflow-y-auto bg-gray-50 p-4 text-sm">
                    {generatedAnnotation ? (
                      structuredAnnotation ? (
                        <div className="space-y-4 text-gray-700">
                          {structuredAnnotation.contractName && (
                            <div className="bg-white rounded-lg border border-purple-100 p-3">
                              <div className="text-xs text-purple-600 font-semibold mb-1">合同名称</div>
                              <div className="text-base font-semibold text-gray-900">
                                {structuredAnnotation.contractName.value || '--'}
                              </div>
                            </div>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {[structuredAnnotation.partyA, structuredAnnotation.partyB].filter(Boolean).map((party) => (
                              <div key={party.type} className="bg-white rounded-lg border border-gray-200 p-3">
                                <div className="text-xs font-semibold text-blue-600 mb-2">{party.name || party.type}</div>
                                <div className="space-y-1 text-sm">
                                  <div><span className="text-gray-500">公司：</span>{party.company || '--'}</div>
                                  <div><span className="text-gray-500">代表：</span>{party.representative || '--'}</div>
                                  <div><span className="text-gray-500">地址：</span>{party.address || '--'}</div>
                                  <div><span className="text-gray-500">电话：</span>{party.phone || '--'}</div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {(structuredAnnotation.amount || structuredAnnotation.payment) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {structuredAnnotation.amount && (
                                <div className="bg-white rounded-lg border border-emerald-100 p-3">
                                  <div className="text-xs font-semibold text-emerald-600 mb-2">合同金额</div>
                                  <div className="text-sm space-y-1">
                                    <div><span className="text-gray-500">{structuredAnnotation.amount.name || '金额'}：</span>{structuredAnnotation.amount.value ?? '--'}</div>
                                    <div><span className="text-gray-500">大写：</span>{structuredAnnotation.amount.chinese || '--'}</div>
                                  </div>
                                </div>
                              )}
                              {structuredAnnotation.payment && (
                                <div className="bg-white rounded-lg border border-amber-100 p-3">
                                  <div className="text-xs font-semibold text-amber-600 mb-2">付款方式</div>
                                  <div className="text-sm space-y-1">
                                    <div>首付款：{structuredAnnotation.payment.first_payment ?? '--'}（{structuredAnnotation.payment.first_payment_percent ?? '--'}%）</div>
                                    <div>首付款大写：{structuredAnnotation.payment.first_payment_chinese || '--'}</div>
                                    <div>尾款：{structuredAnnotation.payment.second_payment ?? '--'}（{structuredAnnotation.payment.second_payment_percent ?? '--'}%）</div>
                                    <div>尾款大写：{structuredAnnotation.payment.second_payment_chinese || '--'}</div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {structuredAnnotation.deliveryDate && (
                              <div className="bg-white rounded-lg border border-gray-200 p-3">
                                <div className="text-xs font-semibold text-gray-600 mb-1">交付时间</div>
                                <div>{structuredAnnotation.deliveryDate.value || '--'}</div>
                              </div>
                            )}
                            {structuredAnnotation.signDate && (
                              <div className="bg-white rounded-lg border border-gray-200 p-3">
                                <div className="text-xs font-semibold text-gray-600 mb-1">签订日期</div>
                                <div>{structuredAnnotation.signDate.value || '--'}</div>
                              </div>
                            )}
                            {structuredAnnotation.penalty && (
                              <div className="bg-white rounded-lg border border-gray-200 p-3">
                                <div className="text-xs font-semibold text-gray-600 mb-1">违约责任</div>
                                <div>{structuredAnnotation.penalty.description || structuredAnnotation.penalty.value || '--'}</div>
                              </div>
                            )}
                            {structuredAnnotation.jurisdiction && (
                              <div className="bg-white rounded-lg border border-gray-200 p-3">
                                <div className="text-xs font-semibold text-gray-600 mb-1">争议管辖</div>
                                <div>{structuredAnnotation.jurisdiction.value || '--'}</div>
                              </div>
                            )}
                          </div>

                          {structuredAnnotation.rawItems?.length > 0 && (
                            <div className="space-y-2">
                              {structuredAnnotation.rawItems.map((item, index) => (
                                <div
                                  key={`${item.type || 'item'}-${index}`}
                                  className="rounded-md bg-gray-50 border border-gray-100 px-3 py-2"
                                >
                                  <div className="text-xs font-semibold text-purple-700 mb-1">
                                    {getAnnotationDisplayLabel(item)}
                                  </div>
                                  <div className="text-sm text-gray-700 break-words">
                                    {getAnnotationExtractText(item)}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ) : (
                        <pre className="whitespace-pre-wrap font-mono text-gray-700">{generatedAnnotation}</pre>
                      )
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <div className="text-4xl mb-2">🏷️</div>
                        <p className="text-lg">生成的标注将显示在这里</p>
                        <p className="text-sm mt-2">点击"生成标注"按钮进行合同要素标注</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* 标注结果清除按钮 */}
                {generatedAnnotation && (
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={clearGeneratedAnnotation}
                      className="text-xs text-gray-500 hover:text-red-600 transition-colors"
                    >
                      清空标注结果
                    </button>
                  </div>
                )}
              </div>

              {/* 生成的合同文档框体 */}
              <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <div className="text-red-600 text-xl">📊</div>
                    <h3 className="text-lg font-semibold text-gray-900">生成的合同文档</h3>
                  </div>
                  {generatedContract && (
                    <div className="text-sm">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">已生成</span>
                    </div>
                  )}
                </div>
                
                <div className="mb-4">
                  <div className="border border-gray-300 rounded-lg h-56 overflow-y-auto bg-gray-50 p-4 text-sm">
                    {generatedContract ? (
                      <pre className="whitespace-pre-wrap font-mono text-gray-700">{generatedContract}</pre>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <div className="text-4xl mb-2">📄</div>
                        <p className="text-lg">生成的合同将显示在这里</p>
                        <p className="text-sm mt-2">点击"生成合同"按钮生成标准化合同</p>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* 生成统计信息 - 合同 */}
                {generatedContract && (
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    <div className="text-center">
                      <div className="text-xs text-gray-500">生成时间</div>
                      <div className="text-sm font-medium">2.1秒</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500">字符数</div>
                      <div className="text-sm font-medium">{generatedContract.length}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500">行数</div>
                      <div className="text-sm font-medium">{generatedContract.split('\n').length}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* 生成按钮区域 - 重新布局 */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex-1">
                <div className="text-sm text-gray-600 mb-2">生成进度</div>
                {isGenerating || isGeneratingAnnotation ? (
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full animate-pulse w-3/4"></div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">
                    {originalContract ? '准备就绪' : '请输入或上传合同内容'}
                  </div>
                )}
              </div>
              
              <div className="flex gap-3">
                {/* 生成标注按钮 - 放在最左边 */}
                <button
                  onClick={handleGenerateAnnotation}
                  disabled={isGeneratingAnnotation || !originalContract.trim() || isGenerating}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
                >
                  {isGeneratingAnnotation ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      标注中...
                    </>
                  ) : (
                    <>
                      <span className="text-lg">🔍</span>
                      生成标注
                    </>
                  )}
                </button>
                
                {/* 生成合同按钮 */}
                <button
                  onClick={handleGenerateContract}
                  disabled={isGenerating || !originalContract.trim() || isGeneratingAnnotation}
                  className="px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
                >
                  {isGenerating ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      生成中...
                    </>
                  ) : (
                    <>
                      <span className="text-lg">▶</span>
                      生成合同
                    </>
                  )}
                </button>
                
                <button
                  onClick={handleDownload}
                  disabled={!generatedContract || isGenerating || isGeneratingAnnotation || isDownloadingContract}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
                >
                  <span className="text-lg">📥</span>
                  {isDownloadingContract ? '下载中...' : '下载合同文档'}
                </button>
                
                {generatedContract && (
                  <button
                    onClick={clearGeneratedContract}
                    className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white rounded-lg transition-all duration-300 flex items-center gap-2 font-medium"
                  >
                    <span className="text-lg">🗑️</span>
                    清空结果
                  </button>
                )}
              </div>
            </div>
          </div>

        </div>
        
        {/* 生成统计信息 */}
        {generatedAnnotation && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white rounded-lg shadow p-4 border border-green-200">
              <div className="flex items-center gap-3">
                <div className="text-green-600 text-2xl">📊</div>
                <div>
                  <p className="text-sm text-gray-600">标注耗时</p>
                  <p className="text-lg font-semibold">{annotationMeta?.duration ? `${annotationMeta.duration}秒` : '--'}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4 border border-orange-200">
              <div className="flex items-center gap-3">
                <div className="text-orange-600 text-2xl">⚖️</div>
                <div>
                  <p className="text-sm text-gray-600">要素数量</p>
                  <p className="text-lg font-semibold">
                    {typeof annotationMeta?.annotationCount === 'number' ? `${annotationMeta.annotationCount} 个` : '--'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4 border border-purple-200">
              <div className="flex items-center gap-3">
                <div className="text-purple-600 text-2xl">🏷️</div>
                <div>
                  <p className="text-sm text-gray-600">返回字符数</p>
                  <p className="text-lg font-semibold">{generatedAnnotation.length}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>

    </div>
  );
};

export default AutoContractTag;
