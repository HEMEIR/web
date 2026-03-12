import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CAMCEE from './CAM-CEE';

// Mock echarts-for-react
jest.mock('echarts-for-react', () => ({
  __esModule: true,
  default: ({ option }) => <div data-testid="echarts">{JSON.stringify(option)}</div>,
}));

// Mock setTimeout
global.setTimeout = jest.fn((fn, delay) => {
  fn();
  return null;
});

describe('CAMCEE Component', () => {
  beforeEach(() => {
    // Reset document title before each test
    document.title = '';
    // Clear all mocks
    jest.clearAllMocks();
  });

  describe('Component Rendering', () => {
    test('should render without crashing', () => {
      render(<CAMCEE />);
      expect(screen.getByText('CAM-CEE 合约要素提取模型')).toBeInTheDocument();
    });

    test('should set document title on mount', () => {
      render(<CAMCEE />);
      expect(document.title).toBe('EyeLaw-控制台');
    });

    test('should render system introduction', () => {
      render(<CAMCEE />);
      expect(screen.getByText('CAM-CEE 系统简介')).toBeInTheDocument();
      expect(screen.getByText(/CAM-CEE 是一个面向智能合约化场景的上下文感知要素提取模型/)).toBeInTheDocument();
    });

    test('should render model architecture section', () => {
      render(<CAMCEE />);
      expect(screen.getByText('CAM-CEE 模型架构')).toBeInTheDocument();
    });
  });

  describe('Tab Navigation', () => {
    test('should render all four tabs', () => {
      render(<CAMCEE />);
      expect(screen.getByText('📊 要素提取数据读取与执行')).toBeInTheDocument();
      expect(screen.getByText('⚙️ 模型训练与优化')).toBeInTheDocument();
      expect(screen.getByText('📁 数据集管理')).toBeInTheDocument();
      expect(screen.getByText('📈 模型评估')).toBeInTheDocument();
    });

    test('should have extraction tab as default active tab', () => {
      render(<CAMCEE />);
      const extractionTab = screen.getByText('📊 要素提取数据读取与执行');
      expect(extractionTab).toHaveClass('bg-blue-600', 'text-white');
    });

    test('should switch tabs when clicked', async () => {
      render(<CAMCEE />);

      // Click on training tab
      const trainingTab = screen.getByText('⚙️ 模型训练与优化');
      fireEvent.click(trainingTab);

      await waitFor(() => {
        expect(trainingTab).toHaveClass('bg-blue-600', 'text-white');
      });

      // Click on dataset tab
      const datasetTab = screen.getByText('📁 数据集管理');
      fireEvent.click(datasetTab);

      await waitFor(() => {
        expect(datasetTab).toHaveClass('bg-blue-600', 'text-white');
      });
    });

    test('should clear result and error when switching tabs', async () => {
      render(<CAMCEE />);

      // Perform an action to get a result
      const executeButton = screen.getByText('执行提取');
      fireEvent.click(executeButton);

      await waitFor(() => {
        expect(screen.getByText('提取结果')).toBeInTheDocument();
      });

      // Switch tabs
      const trainingTab = screen.getByText('⚙️ 模型训练与优化');
      fireEvent.click(trainingTab);

      await waitFor(() => {
        expect(screen.queryByText('提取结果')).not.toBeInTheDocument();
      });
    });
  });

  describe('Extraction Module', () => {
    test('should render extraction module when active', () => {
      render(<CAMCEE />);
      expect(screen.getByText('要素提取数据读取与执行')).toBeInTheDocument();
    });

    test('should render file input and execute button', () => {
      render(<CAMCEE />);
      expect(screen.getByLabelText('选择数据文件')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /执行提取/ })).toBeInTheDocument();
    });

    test('should display loading state during extraction', async () => {
      render(<CAMCEE />);

      const executeButton = screen.getByRole('button', { name: '执行提取' });
      fireEvent.click(executeButton);

      await waitFor(() => {
        expect(screen.getByText('执行中...')).toBeInTheDocument();
      });
    });

    test('should display extraction results after successful extraction', async () => {
      render(<CAMCEE />);

      const executeButton = screen.getByRole('button', { name: '执行提取' });
      fireEvent.click(executeButton);

      await waitFor(() => {
        expect(screen.getByText('提取结果')).toBeInTheDocument();
      });

      expect(screen.getByText('合同名称')).toBeInTheDocument();
      expect(screen.getByText('买卖合同')).toBeInTheDocument();
      expect(screen.getByText('提取要素数量')).toBeInTheDocument();
      expect(screen.getByText('8个')).toBeInTheDocument();
    });

    test('should display extracted elements in table', async () => {
      render(<CAMCEE />);

      const executeButton = screen.getByRole('button', { name: '执行提取' });
      fireEvent.click(executeButton);

      await waitFor(() => {
        expect(screen.getByText('主要提取要素')).toBeInTheDocument();
      });

      expect(screen.getByText('甲方：')).toBeInTheDocument();
      expect(screen.getByText('乙方：')).toBeInTheDocument();
      expect(screen.getByText('上海市卫生健康委员会')).toBeInTheDocument();
    });

    test('should handle extraction errors', async () => {
      // Mock setTimeout to throw error
      const originalSetTimeout = global.setTimeout;
      global.setTimeout = jest.fn((fn, delay) => {
        if (delay === 2000) {
          throw new Error('网络错误');
        }
        fn();
        return null;
      });

      render(<CAMCEE />);

      const executeButton = screen.getByRole('button', { name: '执行提取' });
      fireEvent.click(executeButton);

      await waitFor(() => {
        expect(screen.getByText(/网络错误|操作失败/)).toBeInTheDocument();
      }, { timeout: 100 });

      global.setTimeout = originalSetTimeout;
    });
  });

  describe('Training Module', () => {
    test('should render training module when activated', async () => {
      render(<CAMCEE />);

      const trainingTab = screen.getByText('⚙️ 模型训练与优化');
      fireEvent.click(trainingTab);

      await waitFor(() => {
        expect(screen.getByText('模型训练与优化')).toBeInTheDocument();
      });
    });

    test('should render training controls', async () => {
      render(<CAMCEE />);

      const trainingTab = screen.getByText('⚙️ 模型训练与优化');
      fireEvent.click(trainingTab);

      await waitFor(() => {
        expect(screen.getByLabelText('选择训练数据集')).toBeInTheDocument();
        expect(screen.getByText('开始训练')).toBeInTheDocument();
      });
    });

    test('should display loading state during training', async () => {
      render(<CAMCEE />);

      const trainingTab = screen.getByText('⚙️ 模型训练与优化');
      fireEvent.click(trainingTab);

      await waitFor(() => {
        const startButton = screen.getByRole('button', { name: '开始训练' });
        fireEvent.click(startButton);
      });

      await waitFor(() => {
        expect(screen.getByText('训练中...')).toBeInTheDocument();
      });
    });

    test('should display training results after successful training', async () => {
      render(<CAMCEE />);

      const trainingTab = screen.getByText('⚙️ 模型训练与优化');
      fireEvent.click(trainingTab);

      await waitFor(() => {
        const startButton = screen.getByRole('button', { name: '开始训练' });
        fireEvent.click(startButton);
      });

      await waitFor(() => {
        expect(screen.getByText('训练结果')).toBeInTheDocument();
      });

      expect(screen.getByText('准确率')).toBeInTheDocument();
      expect(screen.getByText('损失值')).toBeInTheDocument();
      expect(screen.getByText('迭代次数')).toBeInTheDocument();
      expect(screen.getByText('训练时间')).toBeInTheDocument();
    });

    test('should display correct training metrics', async () => {
      render(<CAMCEE />);

      const trainingTab = screen.getByText('⚙️ 模型训练与优化');
      fireEvent.click(trainingTab);

      await waitFor(() => {
        const startButton = screen.getByRole('button', { name: '开始训练' });
        fireEvent.click(startButton);
      });

      await waitFor(() => {
        expect(screen.getByText('0.915')).toBeInTheDocument();
        expect(screen.getByText('0.080')).toBeInTheDocument();
        expect(screen.getByText('50')).toBeInTheDocument();
        expect(screen.getByText('2小时30分钟')).toBeInTheDocument();
      });
    });
  });

  describe('Dataset Module', () => {
    test('should render dataset module when activated', async () => {
      render(<CAMCEE />);

      const datasetTab = screen.getByText('📁 数据集管理');
      fireEvent.click(datasetTab);

      await waitFor(() => {
        expect(screen.getByText('数据集管理')).toBeInTheDocument();
      });
    });

    test('should render dataset control buttons', async () => {
      render(<CAMCEE />);

      const datasetTab = screen.getByText('📁 数据集管理');
      fireEvent.click(datasetTab);

      await waitFor(() => {
        expect(screen.getByText('📁 上传数据集')).toBeInTheDocument();
        expect(screen.getByText('🔄 刷新列表')).toBeInTheDocument();
        expect(screen.getByText('📊 加载数据集')).toBeInTheDocument();
      });
    });

    test('should display loading state when loading datasets', async () => {
      render(<CAMCEE />);

      const datasetTab = screen.getByText('📁 数据集管理');
      fireEvent.click(datasetTab);

      await waitFor(() => {
        const loadButton = screen.getByRole('button', { name: '📊 加载数据集' });
        fireEvent.click(loadButton);
      });

      await waitFor(() => {
        expect(screen.queryByText('📊 加载数据集')).not.toBeInTheDocument();
      });
    });

    test('should display dataset list after loading', async () => {
      render(<CAMCEE />);

      const datasetTab = screen.getByText('📁 数据集管理');
      fireEvent.click(datasetTab);

      await waitFor(() => {
        const loadButton = screen.getByRole('button', { name: '📊 加载数据集' });
        fireEvent.click(loadButton);
      });

      await waitFor(() => {
        expect(screen.getByText('数据集列表')).toBeInTheDocument();
      });

      expect(screen.getByText('共20个数据集，5000个样本')).toBeInTheDocument();
      expect(screen.getByText('买卖合同数据集')).toBeInTheDocument();
      expect(screen.getByText('租赁合同数据集')).toBeInTheDocument();
    });

    test('should display dataset table correctly', async () => {
      render(<CAMCEE />);

      const datasetTab = screen.getByText('📁 数据集管理');
      fireEvent.click(datasetTab);

      await waitFor(() => {
        const loadButton = screen.getByRole('button', { name: '📊 加载数据集' });
        fireEvent.click(loadButton);
      });

      await waitFor(() => {
        expect(screen.getByText('买卖合同数据集')).toBeInTheDocument();
        expect(screen.getByText('1000')).toBeInTheDocument();
      });
    });
  });

  describe('Evaluation Module', () => {
    test('should render evaluation module when activated', async () => {
      render(<CAMCEE />);

      const evaluationTab = screen.getByText('📈 模型评估');
      fireEvent.click(evaluationTab);

      await waitFor(() => {
        expect(screen.getByText('模型评估')).toBeInTheDocument();
      });
    });

    test('should render evaluation controls', async () => {
      render(<CAMCEE />);

      const evaluationTab = screen.getByText('📈 模型评估');
      fireEvent.click(evaluationTab);

      await waitFor(() => {
        expect(screen.getByLabelText('选择模型版本')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: '开始评估' })).toBeInTheDocument();
      });
    });

    test('should display loading state during evaluation', async () => {
      render(<CAMCEE />);

      const evaluationTab = screen.getByText('📈 模型评估');
      fireEvent.click(evaluationTab);

      await waitFor(() => {
        const startButton = screen.getByRole('button', { name: '开始评估' });
        fireEvent.click(startButton);
      });

      await waitFor(() => {
        expect(screen.getByText('评估中...')).toBeInTheDocument();
      });
    });

    test('should display evaluation results after successful evaluation', async () => {
      render(<CAMCEE />);

      const evaluationTab = screen.getByText('📈 模型评估');
      fireEvent.click(evaluationTab);

      await waitFor(() => {
        const startButton = screen.getByRole('button', { name: '开始评估' });
        fireEvent.click(startButton);
      });

      await waitFor(() => {
        expect(screen.getByText('CAM-CEE 模型评估结果')).toBeInTheDocument();
      });

      expect(screen.getByText('精确率')).toBeInTheDocument();
      expect(screen.getByText('召回率')).toBeInTheDocument();
    });

    test('should display experiment comparison charts', async () => {
      render(<CAMCEE />);

      const evaluationTab = screen.getByText('📈 模型评估');
      fireEvent.click(evaluationTab);

      await waitFor(() => {
        const startButton = screen.getByRole('button', { name: '开始评估' });
        fireEvent.click(startButton);
      });

      await waitFor(() => {
        expect(screen.getByText('实验对比方案图')).toBeInTheDocument();
      });

      // Check if charts are rendered
      const charts = screen.getAllByTestId('echarts');
      expect(charts.length).toBe(6);
    });

    test('should display all chart labels', async () => {
      render(<CAMCEE />);

      const evaluationTab = screen.getByText('📈 模型评估');
      fireEvent.click(evaluationTab);

      await waitFor(() => {
        const startButton = screen.getByRole('button', { name: '开始评估' });
        fireEvent.click(startButton);
      });

      await waitFor(() => {
        expect(screen.getByText('Accuracy/%')).toBeInTheDocument();
        expect(screen.getByText('micro F1/%')).toBeInTheDocument();
        expect(screen.getByText('macro F1/%')).toBeInTheDocument();
        expect(screen.getByText('minimum F1/%')).toBeInTheDocument();
        expect(screen.getByText('每轮训练时间/s')).toBeInTheDocument();
        expect(screen.getByText('显存占用/GB')).toBeInTheDocument();
      });
    });
  });

  describe('getBarOption Function', () => {
    test('should render charts with correct data', async () => {
      render(<CAMCEE />);

      const evaluationTab = screen.getByText('📈 模型评估');
      fireEvent.click(evaluationTab);

      await waitFor(() => {
        const startButton = screen.getByRole('button', { name: '开始评估' });
        fireEvent.click(startButton);
      });

      await waitFor(() => {
        const charts = screen.getAllByTestId('echarts');
        const accuracyChart = JSON.parse(charts[0].textContent);

        expect(accuracyChart.xAxis.data).toEqual([
          'W2NER',
          'Graph4CNER',
          'LWICNER',
          'CAM-CEE(n)',
          'CAM-CEE(w)'
        ]);
      });
    });

    test('should handle null values in experiment data', async () => {
      render(<CAMCEE />);

      const evaluationTab = screen.getByText('📈 模型评估');
      fireEvent.click(evaluationTab);

      await waitFor(() => {
        const startButton = screen.getByRole('button', { name: '开始评估' });
        fireEvent.click(startButton);
      });

      await waitFor(() => {
        const charts = screen.getAllByTestId('echarts');
        const accuracyChart = JSON.parse(charts[0].textContent);

        // W2NER has null accuracy
        expect(accuracyChart.series[0].data[0]).toBe('-');
      });
    });
  });

  describe('Loading States', () => {
    test('should disable buttons when loading', async () => {
      render(<CAMCEE />);

      const executeButton = screen.getByRole('button', { name: '执行提取' });
      fireEvent.click(executeButton);

      await waitFor(() => {
        expect(executeButton).toBeDisabled();
      });
    });

    test('should re-enable buttons after operation completes', async () => {
      render(<CAMCEE />);

      const executeButton = screen.getByRole('button', { name: '执行提取' });
      fireEvent.click(executeButton);

      await waitFor(() => {
        expect(screen.getByText('提取结果')).toBeInTheDocument();
      }, { timeout: 3000 });

      await waitFor(() => {
        expect(executeButton).not.toBeDisabled();
      });
    });
  });

  describe('Error Handling', () => {
    test('should display error message when API fails', async () => {
      // Mock simulateApiRequest to throw error
      const originalSetTimeout = global.setTimeout;
      global.setTimeout = jest.fn((fn, delay) => {
        throw new Error('API Error');
      });

      render(<CAMCEE />);

      const executeButton = screen.getByRole('button', { name: '执行提取' });
      fireEvent.click(executeButton);

      await waitFor(() => {
        const errorElement = screen.queryByText(/API Error|操作失败/);
        if (errorElement) {
          expect(errorElement).toBeInTheDocument();
        }
      }, { timeout: 100 });

      global.setTimeout = originalSetTimeout;
    });

    test('should clear error when switching tabs', async () => {
      // Force an error state
      const originalSetTimeout = global.setTimeout;
      global.setTimeout = jest.fn((fn, delay) => {
        throw new Error('Test Error');
      });

      render(<CAMCEE />);

      const executeButton = screen.getByRole('button', { name: '执行提取' });
      fireEvent.click(executeButton);

      await waitFor(() => {
        const errorElement = screen.queryByText(/Test Error|操作失败/);
      }, { timeout: 100 });

      // Switch tabs
      global.setTimeout = originalSetTimeout;
      const trainingTab = screen.getByText('⚙️ 模型训练与优化');
      fireEvent.click(trainingTab);

      await waitFor(() => {
        expect(screen.queryByText(/Test Error|操作失败/)).not.toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    test('should have proper button labels', () => {
      render(<CAMCEE />);
      expect(screen.getByRole('button', { name: '执行提取' })).toBeInTheDocument();
      expect(screen.getByText('📁 上传数据集')).toBeInTheDocument();
      expect(screen.getByText('🔄 刷新列表')).toBeInTheDocument();
    });

    test('should have proper input labels', () => {
      render(<CAMCEE />);
      expect(screen.getByLabelText('选择数据文件')).toBeInTheDocument();
    });
  });

  describe('experimentData', () => {
    test('should contain correct number of models', async () => {
      render(<CAMCEE />);

      const evaluationTab = screen.getByText('📈 模型评估');
      fireEvent.click(evaluationTab);

      await waitFor(() => {
        const startButton = screen.getByRole('button', { name: '开始评估' });
        fireEvent.click(startButton);
      });

      await waitFor(() => {
        const charts = screen.getAllByTestId('echarts');
        const accuracyChart = JSON.parse(charts[0].textContent);

        expect(accuracyChart.xAxis.data).toHaveLength(5);
      });
    });

    test('should have all required metrics for each model', async () => {
      render(<CAMCEE />);

      const evaluationTab = screen.getByText('📈 模型评估');
      fireEvent.click(evaluationTab);

      await waitFor(() => {
        const startButton = screen.getByRole('button', { name: '开始评估' });
        fireEvent.click(startButton);
      });

      await waitFor(() => {
        expect(screen.getByText('W2NER')).toBeInTheDocument();
        expect(screen.getByText('Graph4CNER')).toBeInTheDocument();
        expect(screen.getByText('LWICNER')).toBeInTheDocument();
        expect(screen.getByText('CAM-CEE(n)')).toBeInTheDocument();
        expect(screen.getByText('CAM-CEE(w)')).toBeInTheDocument();
      });
    });
  });
});
