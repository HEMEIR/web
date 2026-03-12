# EyeLaw - 智能合约法律条文诠释原型系统与应用平台

## 项目简介
EyeLaw是一个基于React+Express+SQLite开发的智能合约法律条文诠释原型系统与应用平台，旨在帮助用户将法律条文映射为智能合约代码，并提供多语言代码转换功能。

## 核心功能
- **条纹映射代码**：将法律条文映射为智能合约代码
- **合约映射代码**：将智能合约代码映射为法律条文
- **多语言转换引擎**：在不同编程语言之间转换代码
- **用户认证系统**：支持账号密码登录和邮箱验证码登录
- **用户中心**：管理个人资料、修改密码、更换邮箱、注销账号

## 技术栈
- **前端**：React 18.2.0, Vite 5.4.11, Tailwind CSS 3.4.4, React Router 6.23.1
- **后端**：Express 5.1.0, SQLite 3, JWT (JSON Web Tokens)
- **数据库**：SQLite
- **依赖管理**：npm

## 环境要求
- **Node.js**：16.x 或更高版本
- **npm**：8.x 或更高版本
- **操作系统**：Linux/macOS/Windows

## 安装步骤

### 1. 克隆项目
```bash
git clone <项目仓库地址>
cd Eye-Law
```

### 2. 安装依赖
```bash
npm install
```

## 本地开发

### 启动前端开发服务器
```bash
npm run dev
```
前端将在 http://localhost:8081 启动

### 启动后端开发服务器
```bash
node server.js
```
后端将在 http://localhost:5000 启动

### 访问应用
在浏览器中访问 http://localhost:8081 即可使用应用

## 生产部署

### 1. 构建前端项目
```bash
npm run build
```
build产物将生成在 `dist` 目录中

### 2. 配置HTTPS（可选）
- 在项目根目录创建 `cert.pem` 和 `key.pem` 文件
- 服务器将自动使用HTTPS，否则回退到HTTP

### 3. 启动后端服务

#### 使用pm2管理进程（推荐）
```bash
# 全局安装pm2
npm install -g pm2

# 启动后端服务
pm2 start server.js --name "eye-law-backend"

# 设置开机自启
pm2 startup
pm2 save
```

#### 或者直接使用node启动
```bash
# 建议使用nohup在后台运行
nohup node server.js > server.log 2>&1 &
```

### 4. 配置Nginx（用于外网访问）

#### 安装Nginx
```bash
# Ubuntu/Debian
apt-get update
apt-get install nginx

# CentOS/RHEL
yum install nginx
systemctl start nginx
systemctl enable nginx
```

#### 配置Nginx
编辑Nginx配置文件 `/etc/nginx/conf.d/eye-law.conf`
```nginx
server {
    listen 80;
    server_name your-domain.com; # 替换为你的域名或服务器IP

    # 静态资源配置（前端）
    location / {
        root /path/to/Eye-Law/dist; # 替换为你的前端构建目录
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # API代理配置（后端）
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### 重启Nginx
```bash
nginx -t # 测试配置是否正确
systemctl restart nginx
```

### 5. 防火墙配置
确保服务器防火墙允许80端口访问
```bash
# Ubuntu/Debian
ufw allow 80

# CentOS/RHEL
firewall-cmd --permanent --add-port=80/tcp
firewall-cmd --reload
```

## 使用指南

### 1. 用户注册与登录

#### 1.1 注册
- **账号密码注册**：设置用户名和密码，然后通过邮箱验证完成注册
- **邮箱注册**：直接通过邮箱和验证码完成注册
- **注册流程**：
  1. 访问 http://localhost:8081/register
  2. 选择注册方式（账号密码或邮箱）
  3. 填写相关信息
  4. 点击"获取验证码"，查看邮箱获取验证码
  5. 输入验证码并点击注册按钮
  6. 注册成功后自动跳转到登录页面

#### 1.2 登录
- **账号密码登录**：使用用户名和密码登录
- **邮箱登录**：使用邮箱和验证码登录，支持自动注册
- **登录流程**：
  1. 访问 http://localhost:8081/login
  2. 选择登录方式（账号密码或邮箱）
  3. 填写相关信息
  4. 邮箱登录需要点击"获取验证码"获取验证码
  5. 点击登录按钮
  6. 登录成功后自动跳转到首页

### 2. 用户中心

#### 2.1 访问用户中心
- 登录后，点击导航栏中的用户名，在下拉菜单中选择"用户中心"
- 或直接访问 http://localhost:8081/user-center

#### 2.2 个人资料管理
- **补充资料**：如果未设置用户名和密码，可以在此页面补充
- **资料更新**：更新用户名和密码
- **操作流程**：
  1. 在用户中心左侧菜单选择"个人资料"
  2. 填写用户名和密码
  3. 点击"补充资料"按钮
  4. 资料更新成功后会显示弹窗提示

#### 2.3 密码修改
- **密码修改**：修改用户密码
- **操作流程**：
  1. 在用户中心左侧菜单选择"修改密码"
  2. 输入新密码和确认密码
  3. 点击"下一步"按钮
  4. 系统会发送验证码到你的邮箱
  5. 输入验证码并点击"确认修改"按钮
  6. 密码修改成功后会显示等待弹窗，然后自动跳转到登录页面

#### 2.4 邮箱更换
- **邮箱更换**：更换绑定的邮箱
- **操作流程**：
  1. 在用户中心左侧菜单选择"更换绑定邮箱"
  2. 点击"发送验证码"按钮，获取当前邮箱的验证码
  3. 输入验证码并点击"验证当前邮箱"按钮
  4. 输入新邮箱地址并选择邮箱后缀
  5. 点击"发送验证码"按钮，获取新邮箱的验证码
  6. 输入验证码并点击"确认更换"按钮
  7. 邮箱更换成功后会显示弹窗提示

#### 2.5 账号注销
- **账号注销**：注销用户账号
- **操作流程**：
  1. 在用户中心左侧菜单选择"注销账号"
  2. 阅读危险提示信息
  3. 点击"我已知晓，确认注销"按钮
  4. 在弹窗中点击"确认注销"按钮
  5. 注销成功后会显示等待弹窗，然后自动跳转到首页

### 3. 法律工具链

#### 3.1 条纹映射代码
- **功能**：将法律条文映射为智能合约代码
- **操作流程**：
  1. 在首页或导航栏选择"条纹映射代码"
  2. 在输入框中粘贴法律条文
  3. 点击"映射"按钮
  4. 查看映射结果
  5. 可以点击"下载条文内容"和"下载Sparrow代码"按钮下载内容

#### 3.2 合约映射代码
- **功能**：将智能合约代码映射为法律条文
- **操作流程**：
  1. 在首页或导航栏选择"合约映射代码"
  2. 在输入框中粘贴智能合约代码
  3. 点击"映射"按钮
  4. 查看映射结果
  5. 可以点击"下载合约内容"和"下载Sparrow代码"按钮下载内容

#### 3.3 多语言转换引擎
- **功能**：在不同编程语言之间转换代码，包括Solidity、Go、Vyper等
- **操作流程**：
  1. 在首页或导航栏选择"多语言转换引擎"
  2. 选择源语言和目标语言
  3. 在输入框中粘贴代码
  4. 点击"转换"按钮
  5. 查看转换结果
  6. 可以点击"下载输入内容"和"下载输出内容"按钮下载内容
- **新增功能**：
  - 显示代码转换的准确率和一致性
  - 提供转换准确率比较和转换一致性比较图表
  - 编译器页面添加了语言判断功能，根据选择的语言检查代码是否符合该语言的特征

## 数据库说明

### 数据库类型
项目使用SQLite数据库，数据库文件为 `database.db`，位于项目根目录

### 数据库备份
定期备份 `database.db` 文件即可完成数据备份
```bash
# 示例：每日备份
cp /path/to/Eye-Law/database.db /path/to/backup/database_$(date +%Y%m%d).db
```

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

## API说明

### 基础URL
```
http://your-domain.com/api
```

### 主要接口

#### 用户认证
- `POST /api/register` - 用户注册
- `POST /api/login` - 账号密码登录
- `POST /api/login/sms` - 邮箱验证码登录
- `GET /api/user` - 获取当前用户信息
- `POST /api/logout` - 退出登录
- `POST /api/send-code` - 发送验证码
- `POST /api/verify-code` - 验证验证码

#### 用户中心
- `POST /api/update-profile` - 更新个人资料
- `POST /api/change-password` - 修改密码
- `POST /api/check-password` - 检查用户是否有密码
- `POST /api/change-email` - 更换邮箱
- `POST /api/delete-account` - 注销账号

#### 工具链
- `POST /api/calc` - 代码转换

## 注意事项

1. **安全性**: 生产环境中建议修改默认的数据库路径和文件名
2. **备份**: 定期备份数据库文件，防止数据丢失
3. **性能**: 对于高并发场景，建议考虑使用更强大的数据库（如PostgreSQL或MySQL）
4. **HTTPS**: 生产环境建议配置HTTPS证书，可通过Let's Encrypt免费获取
5. **日志**: 建议配置日志管理，便于排查问题

## 常见问题

### Q: 为什么登录失败？
A: 检查用户名和密码是否正确，或者查看服务器日志获取详细错误信息

### Q: 为什么验证码发送失败？
A: 检查邮箱地址是否正确，或者查看服务器日志获取详细错误信息

### Q: 为什么修改密码失败？
A: 检查验证码是否正确，或者查看服务器日志获取详细错误信息

### Q: 为什么更换邮箱失败？
A: 检查验证码是否正确，或者新邮箱是否已被注册

### Q: 为什么账号注销失败？
A: 检查用户信息是否完整，或者查看服务器日志获取详细错误信息

### Q: 为什么法律工具链功能无法使用？
A: 检查网络连接是否正常，或者查看浏览器控制台获取详细错误信息

### Q: 如何更新前端代码？
A: 重新构建前端项目，然后重启Nginx或刷新缓存

### Q: 如何备份数据库？
A: 定期复制 `database.db` 文件到备份目录

## 联系方式
如有问题，请联系项目维护人员

---

© 2026 EyeLaw. 保留所有权利.