# StudyOS - 计算机系统实验学习平台

## 项目简介
StudyOS 是一个专注于计算机系统实验教学的在线学习平台。该平台旨在为学生提供直观、交互式的计算机系统实验学习体验，帮助理解计算机系统的基本原理和运行机制。

## 功能特性
- 章节式学习内容组织
- 交互式实验环境
- 实时实验反馈
- 学习进度追踪
- 响应式用户界面

## 技术栈
- 前端框架：Vue 3
- 构建工具：Vite
- UI 组件库：Element Plus
- 状态管理：Pinia
- 路由管理：Vue Router
- HTTP 客户端：Axios
- 开发语言：TypeScript

## 项目结构
```
studyos/
├── src/                # 源代码目录
│   ├── assets/        # 静态资源
│   ├── components/    # 公共组件
│   ├── request/       # API 请求封装
│   ├── router/        # 路由配置
│   ├── stores/        # 状态管理
│   ├── views/         # 页面视图
│   ├── App.vue        # 根组件
│   └── main.ts        # 入口文件
├── public/            # 公共资源
└── package.json       # 项目依赖配置
```

## 安装说明

### 环境要求
- Node.js (推荐 v16 或更高版本)
- npm 或 yarn

### 安装步骤
1. 克隆项目
```bash
git clone [项目地址]
cd studyos
```

2. 安装依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm run dev
```

4. 构建生产版本
```bash
npm run build
```

## 使用说明
1. 访问 http://localhost:5173 进入平台
2. 在首页浏览可用的实验章节
3. 选择感兴趣的章节开始学习
4. 按照实验指导完成实验内容
5. 查看实验反馈和结果

## 开发指南
- 使用 `npm run dev` 启动开发服务器
- 使用 `npm run build` 构建生产版本
- 使用 `npm run preview` 预览生产构建
- 使用 `npm run type-check` 进行类型检查

## 贡献指南
欢迎提交 Issue 和 Pull Request 来帮助改进项目。

## 许可证
[待定]
