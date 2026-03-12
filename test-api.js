// 测试语法纠错API
const fetch = require('node-fetch');

async function testCorrectSyntax() {
  try {
    console.log('开始测试语法纠错API');
    const response = await fetch('http://localhost:5000/api/correct-syntax', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        language: 'go',
        code: 'package main\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}'
      })
    });

    console.log('API响应状态码:', response.status);
    const data = await response.json();
    console.log('API响应数据:', data);
  } catch (error) {
    console.error('测试失败:', error);
  }
}

testCorrectSyntax();
