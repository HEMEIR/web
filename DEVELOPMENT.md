# EyeLaw项目开发文档

## 项目概述

EyeLaw是一个智能合约法律条文诠释原型系统与应用平台，旨在帮助用户将法律条文映射为智能合约代码，并提供多语言转换功能。

### 核心功能
- **条纹映射代码**：将法律条文映射为智能合约代码
- **合约映射代码**：将智能合约代码映射为法律条文
- **多语言转换引擎**：在不同编程语言之间转换代码
- **用户认证系统**：支持账号密码登录和邮箱验证码登录
- **用户中心**：管理个人资料、修改密码、更换邮箱、注销账号

## 技术栈

### 前端技术
- **框架**：React 18.2.0
- **路由**：React Router 6.23.1
- **UI组件**：Radix UI、Lucide React
- **样式**：Tailwind CSS 3.4.4
- **状态管理**：React useState、useEffect
- **HTTP请求**：Fetch API
- **构建工具**：Vite 5.4.11

### 后端技术
- **框架**：Express 5.1.0
- **数据库**：SQLite 3
- **认证**：JWT (JSON Web Tokens)
- **邮件服务**：Nodemailer 7.0.12
- **CORS**：cors 2.8.5
- **安全**：输入验证、SQL注入防护

### 开发工具
- **代码编辑器**：Visual Studio Code
- **包管理器**：npm
- **代码质量**：ESLint
- **版本控制**：Git

## 项目结构

```
Eye-Law/
├── public/              # 静态资源
│   └── codeSource/      # 代码示例
│       ├── agreementToCode/ # 协议转代码示例
│       ├── applicationScenarios/ # 应用场景示例
│       ├── codeToCode/ # 代码转代码示例
│       ├── correctCode/ # 正确代码示例
│       └── termsToCode/ # 条款转代码示例
├── src/                 # 源代码
│   ├── components/      # 共用组件
│   │   ├── ui/          # UI组件
│   │   ├── Navbar.jsx   # 导航栏组件
│   │   └── PrivateRoute.jsx # 私有路由组件
│   ├── lib/             # 工具库
│   ├── pages/           # 页面组件
│   │   ├── LawToolchain/ # 法律工具链子页面
│   │   │   ├── ApplicationScenarios.jsx # 应用场景
│   │   │   ├── AutoContractTag.jsx # 自动合约标签
│   │   │   ├── CAM-CEE.jsx # CAM-CEE工具
│   │   │   ├── DocTransPro.jsx # 文档转换专业版
│   │   │   ├── ProvBench.jsx # 证明基准
│   │   │   ├── Sparrow.jsx # Sparrow工具
│   │   │   └── 可编程语言转换引擎.jsx # 编程语言转换引擎
│   │   ├── Anquanpage.jsx # 安全页面
│   │   ├── Benmodel.jsx # 本模型页面
│   │   ├── Ceshipage.jsx # 测试页面
│   │   ├── Gongnengpage.jsx # 功能页面
│   │   ├── Index.jsx # 首页
│   │   ├── Jiamodel.jsx # 加模型页面
│   │   ├── Kaifapage.jsx # 开发页面
│   │   ├── Kaifatoolpage.jsx # 开发工具页面
│   │   ├── LawToolchain.jsx # 法律工具链页面
│   │   ├── Login.jsx # 登录页面
│   │   ├── Mubiaopage.jsx # 目标页面
│   │   ├── Register.jsx # 注册页面
│   │   ├── UserCenter.jsx # 用户中心页面
│   │   ├── Yemodel.jsx # 叶模型页面
│   │   ├── Yingshepage.jsx # 映射页面
│   │   └── Zhishipage.jsx # 知识页面
│   ├── resource/        # 资源文件
│   ├── utils/           # 工具函数
│   ├── App.jsx          # 应用根组件
│   ├── main.jsx         # 应用入口
│   ├── index.css        # 全局样式
│   ├── nav-items.js     # 导航项配置
│   └── nav-items.jsx    # 导航项组件
├── server.js            # 后端服务器
├── database.db          # SQLite数据库
├── package.json         # 项目配置
├── vite.config.js       # Vite配置
├── tailwind.config.js   # Tailwind配置
├── DEVELOPMENT.md       # 开发文档
└── README.md            # 项目说明文档
```

## 核心功能模块

### 1. 用户认证系统

#### 1.1 登录功能
- **账号密码登录**：通过用户名和密码登录
- **邮箱验证码登录**：通过邮箱和验证码登录，支持自动注册
- **JWT令牌**：登录成功后生成JWT令牌并存储到localStorage
- **密码可见性**：支持密码显示/隐藏切换

#### 1.2 注册功能
- **账号密码注册**：设置用户名和密码
- **邮箱注册**：通过邮箱验证码注册
- **验证码发送**：支持邮箱验证码发送，带有60秒冷却时间
- **输入验证**：对用户名、密码、邮箱进行格式验证

### 2. 用户中心

#### 2.1 个人资料管理
- **补充资料**：未设置用户名和密码的用户可以补充资料
- **资料更新**：更新用户名和密码
- **验证提示**：对输入进行实时验证并显示错误提示

#### 2.2 密码修改
- **密码验证**：验证新密码格式
- **邮箱验证**：通过邮箱验证码验证身份
- **等待弹窗**：密码修改成功后显示等待弹窗，然后跳转到登录页面

#### 2.3 邮箱更换
- **双重验证**：先验证当前邮箱，再验证新邮箱
- **邮箱格式**：支持多种邮箱后缀选择
- **实时验证**：对邮箱格式进行实时验证

#### 2.4 账号注销
- **危险提示**：显示注销账号的危险提示
- **双重确认**：需要用户确认注销操作
- **动态加载**：注销过程中显示动态省略号加载效果
- **数据清除**：注销成功后清除用户数据并跳转到首页

### 3. 法律工具链

#### 3.1 条纹映射代码
- **功能**：将法律条文映射为智能合约代码
- **操作选项**：支持下载输入内容和输出内容

#### 3.2 合约映射代码
- **功能**：将智能合约代码映射为法律条文
- **操作选项**：支持下载输入内容和输出结果

#### 3.3 多语言转换引擎
- **功能**：在不同编程语言之间转换代码
- **支持的语言**：包括Solidity、Go、Vyper等
- **转换准确率**：显示代码转换的准确率
- **转换一致性**：显示代码转换的一致性
- **布局优化**：将转换准确率、转换准确率比较、转换一致性和转换一致性比较四个区域整合到单语言转换页面中
- **语言判断**：在编译器页面添加了语言判断功能，根据选择的语言检查代码是否符合该语言的特征

## API接口说明

### 1. 认证相关API

#### 1.1 发送验证码
- **路径**：`/api/send-code`
- **方法**：POST
- **参数**：`{ email: string }`
- **返回**：`{ message: string }` 或 `{ error: string }`

#### 1.2 验证验证码
- **路径**：`/api/verify-code`
- **方法**：POST
- **参数**：`{ email: string, code: string }`
- **返回**：`{ message: string }` 或 `{ error: string }`

#### 1.3 账号密码登录
- **路径**：`/api/login`
- **方法**：POST
- **参数**：`{ username: string, password: string }`
- **返回**：`{ message: string, token: string, userId: number, username: string, email: string }` 或 `{ error: string }`

#### 1.4 邮箱登录
- **路径**：`/api/login/sms`
- **方法**：POST
- **参数**：`{ email: string, code: string }`
- **返回**：`{ message: string, token: string, userId: number, username: string, email: string }` 或 `{ error: string }`

#### 1.5 注册
- **路径**：`/api/register`
- **方法**：POST
- **参数**：`{ username?: string, password?: string, email: string }`
- **返回**：`{ message: string, userId: number }` 或 `{ error: string }`

### 2. 用户中心API

#### 2.1 获取用户信息
- **路径**：`/api/user`
- **方法**：GET
- **头部**：`Authorization: Bearer <token>`
- **返回**：`{ message: string, user: object }` 或 `{ error: string }`

#### 2.2 更新个人资料
- **路径**：`/api/update-profile`
- **方法**：POST
- **参数**：`{ userId: string, username: string, password: string }`
- **返回**：`{ message: string }` 或 `{ error: string }`

#### 2.3 修改密码
- **路径**：`/api/change-password`
- **方法**：POST
- **参数**：`{ userId: string, newPassword: string }`
- **返回**：`{ message: string }` 或 `{ error: string }`

#### 2.4 检查密码
- **路径**：`/api/check-password`
- **方法**：POST
- **参数**：`{ userId: string }`
- **返回**：`{ hasPassword: boolean }` 或 `{ error: string }`

#### 2.5 更换邮箱
- **路径**：`/api/change-email`
- **方法**：POST
- **参数**：`{ userId: string, newEmail: string }`
- **返回**：`{ message: string }` 或 `{ error: string }`

#### 2.6 注销账号
- **路径**：`/api/delete-account`
- **方法**：POST
- **参数**：`{ userId: string }`
- **返回**：`{ message: string }` 或 `{ error: string }`

### 3. 工具链API

#### 3.1 代码转换
- **路径**：`/api/calc`
- **方法**：POST
- **参数**：`{ a: number, b: number, op: string }`
- **返回**：`{ result: number }` 或 `{ error: string }`

## 数据库设计

### 用户表 (users)
| 字段名 | 数据类型 | 约束 | 描述 |
|-------|---------|------|------|
| id | INTEGER | PRIMARY KEY AUTOINCREMENT | 用户ID |
| username | TEXT | NULL | 用户名 |
| password | TEXT | NULL | 密码 |
| email | TEXT | UNIQUE NOT NULL | 邮箱 |
| created_at | TEXT | NOT NULL | 创建时间 |

## 部署流程

### 本地开发环境

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd Eye-Law
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **启动前端开发服务器**
   ```bash
   npm run dev
   ```
   前端服务器将在 http://localhost:8081 启动

4. **启动后端服务器**
   ```bash
   node server.js
   ```
   后端服务器将在 http://localhost:5000 启动

### 生产环境部署

1. **构建前端**
   ```bash
   npm run build
   ```

2. **配置HTTPS**（可选）
   - 在项目根目录创建 `cert.pem` 和 `key.pem` 文件
   - 服务器将自动使用HTTPS，否则回退到HTTP

3. **启动服务器**
   ```bash
   node server.js
   ```

## 开发规范

### 代码风格
- **缩进**：使用4个空格
- **命名**：
  - 组件名：PascalCase
  - 变量和函数名：camelCase
  - 常量：UPPER_SNAKE_CASE
- **引号**：使用单引号
- **分号**：使用分号

### 提交规范
- **提交信息**：使用中文描述，格式为 `[功能模块] 具体修改内容`
- **分支管理**：
  - `main`：主分支，用于生产环境
  - `dev`：开发分支，用于集成测试
  - `feature/*`：特性分支，用于开发新功能
  - `bugfix/*`：修复分支，用于修复bug

### 安全规范
- **输入验证**：对所有用户输入进行验证和清理
- **密码安全**：避免在代码中硬编码密码
- **SQL注入防护**：使用参数化查询
- **XSS防护**：对输出进行适当的转义
- **CSRF防护**：实现CSRF令牌验证

## 常见问题与解决方案

### 1. 端口冲突
- **问题**：Vite开发服务器默认使用端口8080，可能与其他服务冲突
- **解决方案**：Vite会自动切换到可用端口，如8081

### 2. 邮箱验证码发送失败
- **问题**：可能是SMTP配置错误或网络问题
- **解决方案**：检查 `server.js` 中的SMTP配置，确保邮箱账号和密码正确

### 3. 用户信息不完整
- **问题**：登录后显示"用户信息不完整，请重新登录"
- **解决方案**：检查localStorage中的用户信息，确保包含userId字段

### 4. 验证码错误
- **问题**：输入正确的验证码但显示错误
- **解决方案**：检查验证码是否过期，或是否输入了正确的邮箱

### 5. HTTPS配置
- **问题**：HTTPS服务器启动失败
- **解决方案**：确保 `cert.pem` 和 `key.pem` 文件存在且格式正确

## 测试指南

### 功能测试
1. **用户认证测试**：测试登录、注册功能
2. **用户中心测试**：测试个人资料修改、密码修改、邮箱更换、账号注销功能
3. **工具链测试**：测试条纹映射代码、合约映射代码、多语言转换功能

### 安全测试
1. **SQL注入测试**：尝试输入SQL注入攻击代码
2. **XSS测试**：尝试输入XSS攻击代码
3. **认证测试**：尝试使用无效令牌访问受保护的API

### 性能测试
1. **页面加载测试**：使用浏览器开发者工具测试页面加载速度
2. **API响应测试**：测试API响应时间

## 维护指南

### 依赖更新
- **定期更新**：定期运行 `npm update` 更新依赖包
- **安全检查**：使用 `npm audit` 检查安全漏洞

### 数据库维护
- **备份**：定期备份 `database.db` 文件
- **清理**：定期清理无用数据

### 日志管理
- **错误日志**：监控服务器错误日志
- **访问日志**：记录API访问日志，便于分析

---

**最后更新时间**：2026年3月6日