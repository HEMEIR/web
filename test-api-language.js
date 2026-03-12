// 测试语法纠错API（根据语言类型）
const fetch = require('node-fetch');

async function testCorrectSyntax(language, code, description) {
  try {
    console.log(`开始测试${description}`);
    const response = await fetch('http://localhost:5000/api/correct-syntax', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        language: language,
        code: code
      })
    });

    console.log('API响应状态码:', response.status);
    const data = await response.json();
    console.log('API响应数据:', data);
    console.log('\n');
  } catch (error) {
    console.error('测试失败:', error);
    console.log('\n');
  }
}

// 测试Go语言
testCorrectSyntax('go', 'func main() {\n    fmt.Println("Hello, World!")\n}', 'Go语言语法纠错');

// 测试Vyper语言
testCorrectSyntax('vyper', '@external\ndef hello() -> str:\n    return "Hello, World!"', 'Vyper语言语法纠错');
