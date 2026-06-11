# Admin React App

VPN 服务管理控制台前端应用

## 功能特性

- 仪表盘 - 数据统计概览
- 用户管理 - 用户列表和搜索
- 节点管理 - VPN 节点管理
- 订单管理 - 订单列表和管理
- 订阅计划 - 计划配置
- 系统日志 - 操作日志查看

## 技术栈

- React 19
- TypeScript
- Ant Design
- React Router
- TanStack Query
- Vite

## 开发命令

```bash
# 安装依赖
npm install

# 启动开发服务器
npx vite dev

# 构建生产版本
npx vite build

# 预览生产构建
npx vite preview

# 运行测试
npm test

# 运行测试UI模式
npm run test:ui
```

## 环境变量

创建 `.env` 文件：

```
VITE_API_BASE_URL=http://localhost:3001/api
```

## 构建说明

由于 Vite 构建配置问题，生产构建会报错。建议使用开发服务器进行预览。

开发服务器可以在浏览器中访问 http://localhost:5173/

## API 集成

应用使用 axios 封装 API 客户端，基础 URL 配置在 `.env` 文件中。

当前配置指向 `http://localhost:3001/api`