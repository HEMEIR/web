import React, { useState } from 'react';

/*转化与标注：AutoContractTag*/
const AutoContractTag = () => {
  // 响应式数据
  const [services, setServices] = React.useState({
    webserver: {
      running: false,
      starting: false,
      pid: null,
      error: null
    },
    task: {
      running: false,
      starting: false,
      pid: null,
      error: null
    },
    extract: {
      running: false,
      starting: false,
      pid: null,
      error: null,
      scriptOutput: null
    }
  });

  const [runningDiagnostics, setRunningDiagnostics] = React.useState(false);
  const [diagnosticVisible, setDiagnosticVisible] = React.useState(false);
  const [diagnosticResult, setDiagnosticResult] = React.useState(null);

  const [checkingPorts, setCheckingPorts] = React.useState(false);
  const [portStatus, setPortStatus] = React.useState(null);

  const [checkingProcesses, setCheckingProcesses] = React.useState(false);
  const [processInfo, setProcessInfo] = React.useState(null);

  const [gettingLogs, setGettingLogs] = React.useState(false);
  const [gettingExtractLogs, setGettingExtractLogs] = React.useState(false);
  const [scriptLogs, setScriptLogs] = React.useState(null);

  const [troubleshooting, setTroubleshooting] = React.useState(false);

  const [refreshing, setRefreshing] = React.useState(false);
  const [startingAll, setStartingAll] = React.useState(false);
  const [stoppingAll, setStoppingAll] = React.useState(false);

  const [autoScrollLogs, setAutoScrollLogs] = React.useState(true);
  const [logs, setLogs] = React.useState([]);

  // 添加日志
  const addLog = (service, level, message) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString();

    setLogs(prev => {
      const newLogs = [
        { time: timeStr, service, level, message },
        ...prev
      ];
      // 限制日志数量
      if (newLogs.length > 200) {
        return newLogs.slice(0, 100);
      }
      return newLogs;
    });
  };

  // 清空日志
  const clearLogs = () => {
    setLogs([]);
  };

  // 获取服务状态类型
  const getServiceStatusType = (service) => {
    const s = services[service];
    if (s.starting) return 'warning';
    if (s.running) return 'success';
    if (s.error) return 'danger';
    return 'info';
  };

  // 获取服务状态文本
  const getServiceStatusText = (service) => {
    const s = services[service];
    if (s.starting) return '启动中';
    if (s.running) return '运行中';
    if (s.error) return '错误';
    return '未运行';
  };

  // 完整诊断
  const runFullDiagnostics = async () => {
    setRunningDiagnostics(true);
    try {
      addLog('system', 'info', '开始运行完整诊断...');
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 2000));
      const result = {
        backend_connected: true,
        port_8000_active: true,
        port_8000_status: '运行中',
        port_8001_active: false,
        port_8001_status: '未运行',
        services: {
          webserver: { running: true, pid: 1234, error: null, logs: 'Web服务运行正常' },
          task: { running: true, pid: 5678, error: null, logs: '任务服务运行正常' },
          extract: { running: false, pid: null, error: '服务未启动', logs: '' }
        },
        recommendations: ['启动Extract服务', '检查8001端口配置']
      };
      setDiagnosticResult(result);
      setDiagnosticVisible(true);
      addLog('system', 'success', '完整诊断完成');
    } catch (err) {
      addLog('system', 'error', `诊断失败: ${err.message}`);
    } finally {
      setRunningDiagnostics(false);
    }
  };

  // 检查端口状态
  const checkPorts = async () => {
    setCheckingPorts(true);
    try {
      addLog('system', 'info', '检查端口状态...');
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 1500));
      const result = {
        port8000: { active: true, status: '运行中' },
        port8001: { active: false, status: '未运行' }
      };
      setPortStatus(result);
      addLog('system', 'info', `端口检查完成: 8000=${result.port8000.status}, 8001=${result.port8001.status}`);
    } catch (err) {
      addLog('system', 'error', `端口检查失败: ${err.message}`);
    } finally {
      setCheckingPorts(false);
    }
  };

  // 检查进程状态
  const checkProcesses = async () => {
    setCheckingProcesses(true);
    try {
      addLog('system', 'info', '检查进程状态...');
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 1500));
      const result = {
        webserver: { running: true, pid: 1234 },
        task: { running: true, pid: 5678 },
        extract: { running: false, pid: null }
      };
      setProcessInfo(result);
      addLog('system', 'info', '进程状态检查完成');
    } catch (err) {
      addLog('system', 'error', `进程检查失败: ${err.message}`);
    } finally {
      setCheckingProcesses(false);
    }
  };

  // 获取脚本日志
  const getScriptLogs = async () => {
    setGettingLogs(true);
    try {
      addLog('system', 'info', '获取脚本日志...');
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 1500));
      const result = {
        logs: ['服务启动成功', '处理了10个文件', '出现错误: 端口已被占用', '尝试重启服务', '服务重启成功']
      };
      setScriptLogs(result.logs);
      addLog('system', 'info', '脚本日志获取完成');
    } catch (err) {
      addLog('system', 'error', `获取日志失败: ${err.message}`);
    } finally {
      setGettingLogs(false);
    }
  };

  // 获取提取脚本日志
  const getExtractLogs = async () => {
    setGettingExtractLogs(true);
    try {
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 1000));
      const result = {
        logs: ['提取服务启动', '监听端口8001', '接收请求', '处理完成', '出现错误: 连接超时']
      };
      
      if (result.logs && result.logs.length > 0) {
        setServices(prev => ({
          ...prev,
          extract: {
            ...prev.extract,
            scriptOutput: result.logs.slice(-3).join(' | ')
          }
        }));
        addLog('extract', 'info', `脚本输出: ${result.logs.slice(-1)[0]}`);
      } else {
        addLog('extract', 'warning', '没有找到脚本输出日志');
      }
    } catch (err) {
      addLog('extract', 'error', `获取提取脚本日志失败: ${err.message}`);
    } finally {
      setGettingExtractLogs(false);
    }
  };

  // 测试端口连接
  const testPort = async (port) => {
    try {
      addLog('system', 'info', `测试端口 ${port} 连接...`);
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 1000));
      addLog('system', 'success', `端口 ${port} 连接成功`);
    } catch (err) {
      addLog('system', 'error', `端口 ${port} 连接失败: ${err.message}`);
    }
  };

  // 故障排除8001端口
  const troubleshootExtract = async () => {
    setTroubleshooting(true);
    try {
      addLog('system', 'info', '开始排除8001端口故障...');
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 2000));
      const result = {
        message: '故障排除完成',
        success: true,
        recommendations: ['重启Extract服务', '检查端口占用情况', '查看服务日志']
      };
      
      addLog('system', 'info', `故障排除结果: ${result.message}`);
      
      if (result.recommendations) {
        result.recommendations.forEach(rec => {
          addLog('system', 'warning', `建议: ${rec}`);
        });
      }
    } catch (err) {
      addLog('system', 'error', `故障排除失败: ${err.message}`);
    } finally {
      setTroubleshooting(false);
    }
  };

  // 服务管理方法
  const startWebServer = async () => {
    setServices(prev => ({
      ...prev,
      webserver: {
        ...prev.webserver,
        starting: true
      }
    }));
    try {
      addLog('webserver', 'info', '正在启动 Doccano Web 服务器...');
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 2000));
      setServices(prev => ({
        ...prev,
        webserver: {
          ...prev.webserver,
          running: true,
          pid: Math.floor(Math.random() * 10000),
          error: null,
          starting: false
        }
      }));
      addLog('webserver', 'success', `Web 服务器启动成功 (PID: ${services.webserver.pid})`);
    } catch (err) {
      setServices(prev => ({
        ...prev,
        webserver: {
          ...prev.webserver,
          error: err.message,
          starting: false
        }
      }));
      addLog('webserver', 'error', `Web 服务器启动失败: ${err.message}`);
    }
  };

  const startTaskWorker = async () => {
    setServices(prev => ({
      ...prev,
      task: {
        ...prev.task,
        starting: true
      }
    }));
    try {
      addLog('task', 'info', '正在启动任务处理器...');
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 2000));
      setServices(prev => ({
        ...prev,
        task: {
          ...prev.task,
          running: true,
          pid: Math.floor(Math.random() * 10000),
          error: null,
          starting: false
        }
      }));
      addLog('task', 'success', `任务处理器启动成功 (PID: ${services.task.pid})`);
    } catch (err) {
      setServices(prev => ({
        ...prev,
        task: {
          ...prev.task,
          error: err.message,
          starting: false
        }
      }));
      addLog('task', 'error', `任务处理器启动失败: ${err.message}`);
    }
  };

  const startExtractScript = async () => {
    setServices(prev => ({
      ...prev,
      extract: {
        ...prev.extract,
        starting: true
      }
    }));
    try {
      addLog('extract', 'info', '正在启动合同提取脚本...');
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 2000));
      setServices(prev => ({
        ...prev,
        extract: {
          ...prev.extract,
          running: true,
          pid: Math.floor(Math.random() * 10000),
          error: null,
          starting: false
        }
      }));
      addLog('extract', 'success', `提取脚本启动成功 (PID: ${services.extract.pid})`);
      
      // 等待几秒后自动获取日志
      setTimeout(() => {
        getExtractLogs();
      }, 3000);
    } catch (err) {
      setServices(prev => ({
        ...prev,
        extract: {
          ...prev.extract,
          error: err.message,
          starting: false
        }
      }));
      addLog('extract', 'error', `提取脚本启动失败: ${err.message}`);
    }
  };

  const stopWebServer = async () => {
    try {
      setServices(prev => ({
        ...prev,
        webserver: {
          ...prev.webserver,
          running: false,
          pid: null
        }
      }));
      addLog('webserver', 'info', 'Web 服务器已停止');
    } catch (err) {
      addLog('webserver', 'error', `停止失败: ${err.message}`);
    }
  };

  const stopTaskWorker = async () => {
    try {
      setServices(prev => ({
        ...prev,
        task: {
          ...prev.task,
          running: false,
          pid: null
        }
      }));
      addLog('task', 'info', '任务处理器已停止');
    } catch (err) {
      addLog('task', 'error', `停止失败: ${err.message}`);
    }
  };

  const stopExtractScript = async () => {
    try {
      setServices(prev => ({
        ...prev,
        extract: {
          ...prev.extract,
          running: false,
          pid: null,
          scriptOutput: null
        }
      }));
      addLog('extract', 'info', '提取脚本已停止');
    } catch (err) {
      addLog('extract', 'error', `停止失败: ${err.message}`);
    }
  };

  const startAllServices = async () => {
    setStartingAll(true);
    try {
      addLog('system', 'info', '开始启动所有服务...');
      
      // 模拟启动所有服务
      await startWebServer();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await startTaskWorker();
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await startExtractScript();
      
      addLog('system', 'success', '所有服务启动完成');
    } catch (err) {
      addLog('system', 'error', `启动服务失败: ${err.message}`);
    } finally {
      setStartingAll(false);
    }
  };

  const stopAllServices = async () => {
    setStoppingAll(true);
    try {
      await Promise.all([
        stopWebServer(),
        stopTaskWorker(),
        stopExtractScript()
      ]);
      addLog('system', 'info', '所有服务已停止');
    } finally {
      setStoppingAll(false);
    }
  };

  const refreshAllStatus = async () => {
    setRefreshing(true);
    try {
      // 模拟API请求
      await new Promise(resolve => setTimeout(resolve, 1500));
      const status = {
        webserver: { running: true, pid: 1234 },
        task: { running: true, pid: 5678 },
        extract: { running: false, pid: null }
      };
      
      setServices(prev => {
        const updated = { ...prev };
        for (const [serviceName, serviceStatus] of Object.entries(status)) {
          if (updated[serviceName]) {
            updated[serviceName].running = serviceStatus.running;
            updated[serviceName].pid = serviceStatus.pid;
          }
        }
        return updated;
      });
      
      addLog('system', 'info', '状态已刷新');
    } catch (err) {
      addLog('system', 'error', `刷新状态失败: ${err.message}`);
    } finally {
      setRefreshing(false);
    }
  };

  // 界面访问
  const openDoccanoUI = () => {
    window.open('http://127.0.0.1:8000', '_blank');
    addLog('system', 'info', '尝试打开 Doccano UI');
  };

  const openExtractUI = () => {
    window.open('http://127.0.0.1:8001', '_blank');
    addLog('system', 'info', '尝试打开提取界面');
  };

// 响应式数据
const [originalContract, setOriginalContract] = useState(`省级红色文化遗址保护标志树立项目

合同草案条款
甲方（釆购人）：晋中市文化和旅游局
统一社会信用代码：11140800558745220K
乙方（成交人）：山西晋韵古建筑有限公司 统一社会信用代码：91140106713678575D
鉴于2022年10月17日在山西汇鑫源工程招标代理有限公司组织进行的省 级红色文化遗址保护标志树立釆购项目（项目编号：sxhxy竞字［20221008）中， 经谈判小组评定，确定乙方为成交供应商。根据《中华人民共和国政府采购法》、 《中华人民共和国民法典》等相关法律法规及本项目谈判文件的规定，经双方协 商一致，签订本合同，并共同遵守。
一、设备条款
乙方向甲方提供供货明细表（附件一）中所列产品及相关服务，详细 参数见乙方响应文件。
　　二、合同总金额
　　人民币（大写）：壹拾玖万元整
　　　　　（小写）：￥ 190000.00 	
本合同总金额除双方另有约定外，包括与交货有关的费用（包括但不仅 限于运输费、包装费、保险费、税费等）等标准伴随服务的费用。此价格为合同 执行不变价，不因国家政策及市场价格变化而变化。
三、支付方式
1、本合同项下所有款项均以人民币支付。
2、付款方式：付款方式是合同签订后支付百分之68,验收合格后支付剩余部分。
3、付款时，乙方须出具符合税务部门要求的发票。
四、交货
1、 交货地点：晋中市文化和旅游局
2 、交货时间：2022年12月10日 	
3、在合同标的物之外，乙方不得提供、甲方不得接受赠品。
　　4、乙方应在产品送至交货地点时提交如下资料：
　　(1)有乙方、送货单位盖章确认的送货单原件。
　　(2)有乙方与第三方签订的釆购订单原件。
　　(3)合同约定的交货文件；
　　(4)其他相关文件。
如乙方未按约定完全提供上述资料，甲方有权要求乙方在五日内予以 补齐，并在补齐前不予支付货款(或要求退回已付款项)，对此不视为甲方违约。
5、乙方提供的产品包装应能适应各种运输装卸，如甲方对产品包装 有要求的，还应按甲方要求包装，包装物处理按甲方要求。
五、质量及验收
1、质量标准：参照山西省红色文化遗址保护规格
2、验收程序：安装完毕按技术参数标准验收
3、质量异议：甲方对产品的质量提出异议时，甲方可要求乙方把产 品送有相应资质的部门检验鉴定。乙方应在收到质量异议七日内送检，送 检费用由乙方承担。若乙方不同意将产品送检或因乙方原因未送检的，视 为乙方认可甲方对产品质量提出的异议。
六、售后服务
1、质量保证期(2)年自甲方最终在《验收结算报告》上签字之日算 起。
2、其它服务承诺详见乙方投标文件。
七、甲方责任
1、组织验收并及时办理付款手续。
2、项目验收合格后。
八、乙方责任
1、权利保证
1.乙方应保证甲方在使用该货物或其任何一部分时不受第三方提出侵犯其专 利权、版权、商标权或其他权利的起诉。一旦出现侵权，乙方应承担全部责任。
　　2,保证所供货物均为响应文件承诺货物，符合相关质量检测标准， 具有该产品的出厂标准或国家鉴定证书。
　　3、保证货物的售后服务，严格依据响应文件及相关承诺，对货物及 系统进行保修、维护等服务。
　　九、违约责任
　　1,如果甲方逾期付款，超过10日后，每日应向乙方偿付应付款项的 0.5%作为违约金；
　　2,如果乙方没有按合同规定提供货物或维修服务的，每延迟一天扣 除合同总金额的0.5%的违约金，直至按合同交货或提供服务为止。违约金 最高限额为合同总金额的5%. 一旦达到该最高限额，甲方有权终止合同。 因此造成甲方损失的，乙方还应承担赔偿责任。
　　3,乙方产品经经验收不合格的，乙方应负责免费更换-若无法更换 的，甲方有权拒收，若给甲方造成损失，乙方还应承担赔偿责任。
　　十、补充条款
　　　　无
　　十—、不可抗力
　　甲乙双方的任何一方由于不可抗力的原因不能履行合同时，应及时向对方通报不能履行或不能完全履行理由；在取得有关主管机关证明以后， 允许延期履行、部分履行或者不履行合同，并根据情况可部分或全部免予 承担违约责任。
　　十二、争议解决
　　1、因履行本合同发生的争议，由甲乙双方协商解决-协商不成的， 依法向甲方所在地人民法院起诉。
　　2、当产生任何争议及争议正在诉讼程序时，除争议事项，双方应继 续行使其剩余的相关权利，履行本合同的其他义务。
　　十三、合同生效及其他
　　1、合同由甲乙双方法人或委托代理人签章确认并加盖骑缝章后，即行生效。
　　2、本合同一式四份，甲乙双方各一份，山西汇鑫源工程招标代理有限公司两份。
　　4、合同执行过程中出现的未尽事宜，双方在不违背合同和招标文件的前提下协商解决。协商结果以"补充合同"形式作为合同附件，与合同具有同等效力。
　　5、本合同第十四、十五条款所列文件均为本合同不可分割的一部分，与本合同具有同等法律效力。
　　十四、下列文件为本合同不可分割部分
　　1、谈判文件
　　2、响应文件
　　3、乙方所做的其他承诺
　　十五、附件明细
　　1、供货明细表
　　2、采购需求
　　

甲方（盖章)

单位名称:晋中市文化和旅游局

单位地址:晋中市榆次区顺城街80号

法人或委托代理人:程红解


日期:2022年10月20日

乙方（盖章)

单位名称:山西晋韵古建筑有限公司

单位地址:太原市迎泽区老军营南区11号楼

法人或委托代理人:能四升

开户行:交通银行太啤新建南路支行
账号:141000614018170030782
行号:301161000203
日期:2022年10月20日
`);

const [generatedContract, setGeneratedContract] = useState('');
const [isGenerating, setIsGenerating] = useState(false);
const [downloadUrl, setDownloadUrl] = useState('');
const [fileInputRef] = useState(React.createRef());
const [isAnnotationModalOpen, setIsAnnotationModalOpen] = useState(false);

// 处理文件上传
const handleFileUpload = () => {
  fileInputRef.current.click();
};

// 处理文件选择
const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // 检查文件类型
  const allowedTypes = ['.txt', '.doc', '.docx', '.pdf', '.md'];
  const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
  
  if (!allowedTypes.includes(fileExtension)) {
    alert('请选择文本文件 (.txt, .doc, .docx, .pdf, .md)');
    return;
  }

  // 检查文件大小（限制为5MB）
  if (file.size > 5 * 1024 * 1024) {
    alert('文件太大，请选择小于5MB的文件');
    return;
  }

  // 读取文件内容
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const content = e.target.result;
      setOriginalContract(content);
      alert(`文件 "${file.name}" 上传成功！`);
    } catch (error) {
      console.error('读取文件失败:', error);
      alert('读取文件失败，请检查文件格式');
    }
  };
  
  reader.onerror = () => {
    alert('读取文件时发生错误');
  };
  
  reader.readAsText(file);
  
  // 重置文件输入，以便可以再次选择同一个文件
  event.target.value = '';
};

// 清空合同内容
const clearContractContent = () => {
  if (window.confirm('确定要清空合同内容吗？所有输入的内容将会丢失。')) {
    setOriginalContract('');
    alert('合同内容已清空');
  }
};

// 模拟合同生成
const handleGenerateContract = () => {
  if (!originalContract.trim()) {
    alert('请输入原合同内容');
    return;
  }

  setIsGenerating(true);
  
  // 模拟生成延迟
  setTimeout(() => {
    // 基于原合同生成标准化合同
    const generatedContent = `买卖合同

订立合同双方：
甲方：晋中市文化和旅游局
乙方：山西晋韵古建筑有限公司

供需双方本着平等互利、协商一致的原则，签订本合同，以资双方信守执行。

第一条 标的
标的名称：
标的数量：
标的单价：
标的总价：190000.00

第二条 合同价格
合同总金额：人民币元，合同金额包括运输费、安装调试费和服务费等。

第三条 商品质量标准
货物必须符合国家标准。

第四条 履行方式
发货：根据双方具体情况协商而定。
验收：验收。

第五条 付款方式及期限：支付百分之68,。

第六条 违约责任
非终止违约：每延迟一天扣除合同总金额的0.5%的违约金，直至按合同交货或提供服务为止。
终止违约：因此造成甲方损失的，乙方还应承担赔偿责任，甲方有权终止合同。

第七条 不可抗力
当事人一方因不可抗力不能履行合同时，应当及时通知对方，并在合理期限内提供有关机构出具的证明，可以全部或部分免除该方当事人的责任。

第八条 争议解决
因合同执行而产生问题的解决方式可选择以下方式处理：
1. 合同各方应通过友好协商，争议解决在执行本合同过程中所发生的或与本合同有关的一切争端。
2. 如从协商开始十天内仍不能解决，可向人民法院提出诉讼。
3. 调解不成则申请仲裁机构根据其仲裁规则和程序进行仲裁。如仲裁事项不影响合同其它部分的履行，则在仲裁期间，除正在进行仲裁的部分外，本合同的其它部分应继续执行。
4. 按相关法律法规处理。

第九条 合同执行期间，如因故不能履行或需要修改，必须经双方同意，并互相换文或另订合同，方为有效。

第十条 本合同一式三份，由甲方执一份，乙方执一份，备案一份。

甲方：晋中市文化和旅游局（盖章） 乙方：山西晋韵古建筑有限公司（盖章）
签订时间：2022年12月10日
`;

    setGeneratedContract(generatedContent);
    createDownloadFile(generatedContent);
    setIsGenerating(false);
  }, 2000);
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

// 创建可下载文件
const createDownloadFile = (content) => {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  setDownloadUrl(url);
};

// 处理下载
const handleDownload = () => {
  if (!downloadUrl) return;
  
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = `合同文档_${new Date().getTime()}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// 清除生成的合同
const clearGeneratedContract = () => {
  setGeneratedContract('');
  if (downloadUrl) {
    URL.revokeObjectURL(downloadUrl);
    setDownloadUrl('');
  }
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
          <div className="flex items-center gap-3 mb-4">
            <div className="text-blue-600 text-3xl">📄</div>
            <div>
              <h2 className="text-2xl font-bold text-blue-800">合同生成系统</h2>
              <p className="text-blue-600">基于AI的智能合同生成与标准化处理</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 左侧：原合同输入 */}
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
                <div className="relative">
                  <textarea
                    className="w-full h-72 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                    value={originalContract}
                    onChange={(e) => setOriginalContract(e.target.value)}
                    placeholder="请输入或粘贴原合同内容..."
                  />
                  <div className="absolute bottom-2 right-2 text-xs text-gray-500">
                    {originalContract.length} 字符
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <button 
                  onClick={handleFileUpload}
                  className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full hover:bg-blue-200 transition-colors flex items-center gap-1"
                >
                  <span className="text-xs">📁</span>
                  上传合同文件
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
                <p>支持格式：.txt, .doc, .docx, .pdf, .md</p>
                <p>文件大小限制：小于5MB</p>
              </div>
            </div>
            
            {/* 右侧：生成的合同文档 */}
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
                <div className="border border-gray-300 rounded-lg h-72 overflow-y-auto bg-gray-50 p-4 text-sm">
                  {generatedContract ? (
                    <pre className="whitespace-pre-wrap font-mono text-gray-700">{generatedContract}</pre>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <div className="text-4xl mb-2">📄</div>
                      <p className="text-lg">生成的合同将显示在这里</p>
                      <p className="text-sm mt-2">点击"开始生成"按钮生成标准化合同</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* 生成统计信息 */}
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
          
      {/* 生成按钮区域 */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex-1">
            <div className="text-sm text-gray-600 mb-2">生成进度</div>
            {isGenerating ? (
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
            <button
              onClick={handleGenerateContract}
              disabled={isGenerating || !originalContract.trim()}
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
                  开始生成
                </>
              )}
            </button>
            
            {/* 添加：查看标注按钮 */}
            <button
              onClick={() => setIsAnnotationModalOpen(true)}
              disabled={!generatedContract || isGenerating}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
            >
              <span className="text-lg">🔍</span>
              查看标注
            </button>
            
            <button
              onClick={handleDownload}
              disabled={!generatedContract || isGenerating}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
            >
              <span className="text-lg">📥</span>
              下载合同文档
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

        {/* 在合同生成系统模块的最后，return语句之前添加标注弹窗 */}
        {isAnnotationModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-800">合同标注示意图</h3>
                <button
                  onClick={() => setIsAnnotationModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  &times;
                </button>
              </div>
              <div className="p-4 overflow-auto max-h-[calc(90vh-120px)]">
                <div className="text-center">
                  <img 
                    src="../src/resource/biaozhu.png" 
                    alt="合同标注示意图" 
                    className="max-w-full h-auto mx-auto rounded-lg shadow-md"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://via.placeholder.com/800x600?text=标注图片加载中...";
                    }}
                  />
                  <p className="text-sm text-gray-500 mt-4">图例说明：合同标注过程</p>
                </div>
              </div>
              <div className="p-6 border-t border-gray-200 flex justify-end">
                <button
                  onClick={() => setIsAnnotationModalOpen(false)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        )}
        </div>
        
        {/* 生成统计信息 */}
        {generatedContract && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white rounded-lg shadow p-4 border border-green-200">
              <div className="flex items-center gap-3">
                <div className="text-green-600 text-2xl">📊</div>
                <div>
                  <p className="text-sm text-gray-600">合同要素提取</p>
                  <p className="text-lg font-semibold">23 个要素</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4 border border-orange-200">
              <div className="flex items-center gap-3">
                <div className="text-orange-600 text-2xl">⚖️</div>
                <div>
                  <p className="text-sm text-gray-600">合规性检查</p>
                  <p className="text-lg font-semibold">通过</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>

      {/* 功能模块 */}
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden p-6">
          {/* 调试信息面板 */}
          <div className="mb-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <div className="text-red-500 text-xl">🛠️</div>
                  <h2 className="text-xl font-bold text-gray-900">调试工具</h2>
                </div>
                <button
                  onClick={runFullDiagnostics}
                  disabled={runningDiagnostics}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  🔍
                  {runningDiagnostics ? '诊断中...' : '完整诊断'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">端口检查</h4>
                  <button
                    onClick={checkPorts}
                    disabled={checkingPorts}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                  >
                    {checkingPorts ? '检查中...' : '检查端口状态'}
                  </button>
                  {portStatus && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-700 mb-1">
                        <strong>8000端口:</strong> 
                        <span className={`px-2 py-1 rounded text-xs font-medium ${portStatus.port8000.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {portStatus.port8000.status}
                        </span>
                      </p>
                      <p className="text-sm text-gray-700">
                        <strong>8001端口:</strong> 
                        <span className={`px-2 py-1 rounded text-xs font-medium ${portStatus.port8001.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {portStatus.port8001.status}
                        </span>
                      </p>
                    </div>
                  )}
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">进程检查</h4>
                  <button
                    onClick={checkProcesses}
                    disabled={checkingProcesses}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                  >
                    {checkingProcesses ? '检查中...' : '检查运行进程'}
                  </button>
                  {processInfo && (
                    <div className="mt-4">
                      {Object.entries(processInfo).map(([service, info]) => (
                        <div key={service} className="mb-2">
                          <p className="text-sm text-gray-700">
                            <strong>{service}:</strong> {info.running ? '运行中' : '未运行'}
                          </p>
                          {info.pid && (
                            <p className="text-xs text-gray-500 ml-6">
                              PID: {info.pid} | 运行时间: 未知
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">脚本输出</h4>
                  <button
                    onClick={getScriptLogs}
                    disabled={gettingLogs}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
                  >
                    {gettingLogs ? '获取中...' : '获取脚本日志'}
                  </button>
                  {scriptLogs && (
                    <div className="mt-4 max-h-20 overflow-y-auto bg-gray-50 p-2 rounded text-xs font-mono text-gray-700">
                      {scriptLogs.slice(-5).map((log, index) => (
                        <div key={index} className="mb-1">{log}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 服务管理面板 */}
          <div className="mb-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="text-blue-500 text-xl">🖥️</div>
                <h2 className="text-xl font-bold text-gray-900">服务管理</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Doccano Web Server (8000) */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <div className="flex flex-col items-center mb-4">
                    <div className="text-blue-500 text-3xl mb-2">🖥️</div>
                    <h3 className="text-lg font-semibold text-gray-900">Web Server (8000)</h3>
                    <p className="text-xs text-gray-500 mt-1">Doccano标注界面</p>
                  </div>
                  <div className="mb-4">
                    <span className={`px-4 py-1 rounded-full text-sm font-medium ${services.webserver.running ? 'bg-green-100 text-green-800' : services.webserver.error ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                      {services.webserver.starting ? '启动中' : services.webserver.running ? '运行中' : services.webserver.error ? '错误' : '未运行'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    <p>进程ID: {services.webserver.pid || '未运行'}</p>
                    {services.webserver.error && (
                      <p className="text-red-500 text-xs mt-1">错误: {services.webserver.error}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    {!services.webserver.running ? (
                      <button
                        onClick={startWebServer}
                        disabled={services.webserver.starting}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {services.webserver.starting ? '启动中...' : '启动'}
                      </button>
                    ) : (
                      <button
                        onClick={stopWebServer}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-all duration-300"
                      >
                        停止
                      </button>
                    )}
                    <button
                      onClick={() => testPort(8000)}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm transition-all duration-300"
                    >
                      测试端口
                    </button>
                  </div>
                </div>

                {/* Doccano Task Worker */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <div className="flex flex-col items-center mb-4">
                    <div className="text-green-500 text-3xl mb-2">⚙️</div>
                    <h3 className="text-lg font-semibold text-gray-900">Task Worker</h3>
                    <p className="text-xs text-gray-500 mt-1">任务处理器</p>
                  </div>
                  <div className="mb-4">
                    <span className={`px-4 py-1 rounded-full text-sm font-medium ${services.task.running ? 'bg-green-100 text-green-800' : services.task.error ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                      {services.task.starting ? '启动中' : services.task.running ? '运行中' : services.task.error ? '错误' : '未运行'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    <p>进程ID: {services.task.pid || '未运行'}</p>
                    {services.task.error && (
                      <p className="text-red-500 text-xs mt-1">错误: {services.task.error}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    {!services.task.running ? (
                      <button
                        onClick={startTaskWorker}
                        disabled={services.task.starting}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {services.task.starting ? '启动中...' : '启动'}
                      </button>
                    ) : (
                      <button
                        onClick={stopTaskWorker}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-all duration-300"
                      >
                        停止
                      </button>
                    )}
                  </div>
                </div>

                {/* Contract Extract Script (8001端口) */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <div className="flex flex-col items-center mb-4">
                    <div className="text-red-500 text-3xl mb-2">📄</div>
                    <h3 className="text-lg font-semibold text-gray-900">Extract Script (8001)</h3>
                    <p className="text-xs text-gray-500 mt-1">合同提取服务</p>
                  </div>
                  <div className="mb-4">
                    <span className={`px-4 py-1 rounded-full text-sm font-medium ${services.extract.running ? 'bg-green-100 text-green-800' : services.extract.error ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                      {services.extract.starting ? '启动中' : services.extract.running ? '运行中' : services.extract.error ? '错误' : '未运行'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    <p>进程ID: {services.extract.pid || '未运行'}</p>
                    {services.extract.error && (
                      <p className="text-red-500 text-xs mt-1">错误: {services.extract.error}</p>
                    )}
                    {services.extract.scriptOutput && (
                      <p className="text-green-500 text-xs mt-1 font-mono">最新输出: {services.extract.scriptOutput}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    {!services.extract.running ? (
                      <button
                        onClick={startExtractScript}
                        disabled={services.extract.starting}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {services.extract.starting ? '启动中...' : '启动'}
                      </button>
                    ) : (
                      <button
                        onClick={stopExtractScript}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-all duration-300"
                      >
                        停止
                      </button>
                    )}
                    <button
                      onClick={() => testPort(8001)}
                      className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm transition-all duration-300"
                    >
                      测试端口
                    </button>
                    <button
                      onClick={getExtractLogs}
                      disabled={gettingExtractLogs}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {gettingExtractLogs ? '获取中...' : '查看日志'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 快速操作面板 */}
          <div className="mb-8">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="text-green-500 text-xl">⚙️</div>
                <h2 className="text-xl font-bold text-gray-900">快速操作</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">服务管理</h3>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={startAllServices}
                      disabled={startingAll}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ▶️
                      {startingAll ? '启动中...' : '启动全部服务'}
                    </button>
                    
                    <button
                      onClick={stopAllServices}
                      disabled={stoppingAll}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ⏸️
                      {stoppingAll ? '停止中...' : '停止全部服务'}
                    </button>
                    
                    <button
                      onClick={troubleshootExtract}
                      disabled={troubleshooting}
                      className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg flex items-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      🛠️
                      {troubleshooting ? '排除中...' : '故障排除8001'}
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">界面访问</h3>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={openDoccanoUI}
                      disabled={!services.webserver.running}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      🔗
                      打开 Doccano UI (8000)
                    </button>
                    
                    <button
                      onClick={openExtractUI}
                      className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg flex items-center gap-2 transition-all duration-300"
                    >
                      🔗
                      尝试打开提取界面 (8001)
                    </button>
                    
                    <button
                      onClick={() => testPort(8001)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-all duration-300"
                    >
                      🔍
                      手动测试8001
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 实时日志面板 */}
          <div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <div className="text-gray-500 text-xl">📄</div>
                  <h2 className="text-xl font-bold text-gray-900">实时日志 & 调试信息</h2>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="autoScroll"
                      checked={autoScrollLogs}
                      onChange={(e) => setAutoScrollLogs(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <label htmlFor="autoScroll" className="text-sm text-gray-600">自动滚动</label>
                  </div>
                  <button
                    onClick={clearLogs}
                    className="text-sm text-gray-600 hover:text-red-600 transition-colors duration-300"
                  >
                    清空日志
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-96 overflow-y-auto">
                {logs.length > 0 ? (
                  logs.map((log, index) => (
                    <div key={index} className={`mb-2 text-xs ${log.level === 'error' ? 'text-red-500' : log.level === 'success' ? 'text-green-500' : log.level === 'warning' ? 'text-yellow-500' : 'text-gray-700'}`}>
                      <span className="text-gray-500">[{log.time}]</span>
                      <span className="font-semibold ml-2">[{log.service}]</span>
                      <span className="ml-2">{log.message}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-8">暂无日志</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 诊断对话框 */}
      {diagnosticVisible && diagnosticResult && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">完整诊断报告</h3>
            </div>
            <div className="p-6">
              <h4 className="font-semibold text-gray-900 mb-4">系统状态概览</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-500 mb-2">后端连接</div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${diagnosticResult.backend_connected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {diagnosticResult.backend_connected ? '正常' : '异常'}
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-500 mb-2">8000端口状态</div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${diagnosticResult.port_8000_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {diagnosticResult.port_8000_status}
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-500 mb-2">8001端口状态</div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${diagnosticResult.port_8001_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {diagnosticResult.port_8001_status}
                  </div>
                </div>
              </div>

              {diagnosticResult.services && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-4">服务详情</h4>
                  {Object.entries(diagnosticResult.services).map(([name, service]) => (
                    <div key={name} className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-3">
                      <h5 className="font-medium text-gray-900 mb-2">{name}</h5>
                      <p className="text-sm text-gray-600">状态: {service.running ? '运行中' : '未运行'}</p>
                      {service.pid && <p className="text-sm text-gray-600">进程ID: {service.pid}</p>}
                      {service.error && <p className="text-sm text-red-500">错误: {service.error}</p>}
                      {service.logs && <p className="text-sm text-gray-600">最新日志: {service.logs}</p>}
                    </div>
                  ))}
                </div>
              )}

              {diagnosticResult.recommendations && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">建议解决方案</h4>
                  <ul className="list-disc pl-5 text-sm text-gray-600">
                    {diagnosticResult.recommendations.map((rec, index) => (
                      <li key={index} className="mb-2">{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="p-6 border-t flex justify-end">
              <button
                onClick={() => setDiagnosticVisible(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300"
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

export default AutoContractTag;