# VPN管理后台赛博朋克UI改造实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将VPN管理后台从传统企业风格改造为赛博朋克科技风UI，包括主题配置、全局样式、组件改造和动画效果

**Architecture:** 使用Ant Design主题定制系统 + CSS变量 + 工具类 + React组件改造，保持组件化架构，逐步改造各页面组件

**Tech Stack:** React 19.2.6, Ant Design 5.21.4, TanStack React Query, Vite, TypeScript

---

## 文件结构映射

### 新建文件
```
src/
├── theme/
│   └── index.ts          # Ant Design主题配置文件
└── index.css             # 全局样式文件（覆盖原文件）
```

### 修改文件
```
src/
├── main.tsx               # 应用主题配置（修改）
├── App.tsx                # 路由配置（可能修改）
├── App.css                # 原样式文件（修改）
└── src/pages/
    ├── Dashboard.tsx      # 仪表盘页面（修改）
    ├── Users.tsx          # 用户管理页面（修改）
    ├── Nodes.tsx          # 节点管理页面（修改）
    ├── Orders.tsx         # 订单管理页面（修改）
    ├── SubscriptionPlans.tsx  # 订阅计划页面（修改）
    └── Logs.tsx           # 系统日志页面（修改）
```

---

## 实施计划

### Task 1: 创建主题配置文件

**Files:**
- Create: `src/theme/index.ts`
- Modify: 无

- [ ] **Step 1: 创建主题配置文件**

创建文件 `src/theme/index.ts`：

```typescript
import { theme } from 'antd';

export const cyberpunkTheme = {
  algorithm: theme.darkAlgorithm,

  token: {
    // 主色调
    colorPrimary: '#6366f1',
    colorInfo: '#8b5cf6',
    colorSuccess: '#0aff60',
    colorWarning: '#facc15',
    colorError: '#ff0099',

    // 颜色
    colorBgContainer: 'rgba(22, 24, 53, 0.6)',
    colorBgLayout: 'rgba(10, 11, 30, 0.8)',
    colorText: '#ffffff',
    colorTextSecondary: 'rgba(255, 255, 255, 0.7)',
    colorTextTertiary: 'rgba(255, 255, 255, 0.5)',
    colorBorder: 'rgba(139, 92, 246, 0.3)',
    colorBorderSecondary: 'rgba(255, 255, 255, 0.1)',

    // 圆角
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 6,

    // 字体
    fontSize: 14,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },

  components: {
    Layout: {
      siderBg: 'rgba(22, 24, 53, 0.9)',
      headerBg: 'rgba(22, 24, 53, 0.8)',
      bodyBg: 'transparent',
      headerHeight: 64,
      siderBgCollapsed: 'rgba(10, 11, 30, 1)',
    },

    Card: {
      colorBgContainer: 'rgba(22, 24, 53, 0.6)',
      colorBgLayout: 'rgba(10, 11, 30, 0.8)',
      colorBorder: 'rgba(139, 92, 246, 0.3)',
      borderRadiusLG: 12,
    },

    Menu: {
      colorItemBg: 'transparent',
      colorItemText: 'rgba(255, 255, 255, 0.7)',
      colorItemBgHover: 'rgba(139, 92, 246, 0.2)',
      colorItemTextHover: '#ffffff',
      colorItemBgSelected: 'rgba(139, 92, 246, 0.3)',
      colorItemTextSelected: '#ffffff',
      colorItemBorderRadius: 8,
      colorSubItemBg: 'transparent',
      colorSubItemText: 'rgba(255, 255, 255, 0.6)',
      colorSubItemTextHover: '#ffffff',
    },

    Button: {
      colorPrimary: '#6366f1',
      colorPrimaryHover: '#8b5cf6',
      borderRadius: 6,
    },

    Table: {
      colorBgContainer: 'rgba(30, 31, 58, 0.8)',
      colorBorder: 'rgba(139, 92, 246, 0.3)',
      headerBg: 'rgba(139, 92, 246, 0.2)',
      headerColor: '#ffffff',
      rowHoverBg: 'rgba(139, 92, 246, 0.1)',
    },

    Input: {
      colorBgContainer: 'rgba(22, 24, 53, 0.6)',
      colorBorder: 'rgba(139, 92, 246, 0.3)',
      colorText: '#ffffff',
      borderRadius: 6,
    },

    Select: {
      colorBgContainer: 'rgba(22, 24, 53, 0.6)',
      colorBorder: 'rgba(139, 92, 246, 0.3)',
      colorText: '#ffffff',
      borderRadius: 6,
    },

    Statistic: {
      colorText: 'rgba(255, 255, 255, 0.8)',
    },

    Modal: {
      colorBgContainer: 'rgba(22, 24, 53, 0.9)',
      colorBgMask: 'rgba(10, 11, 30, 0.8)',
      colorBorder: 'rgba(139, 92, 246, 0.3)',
    },

    Form: {
      colorText: '#ffffff',
    },

    DatePicker: {
      colorBgContainer: 'rgba(22, 24, 53, 0.6)',
      colorBorder: 'rgba(139, 92, 246, 0.3)',
      colorText: '#ffffff',
      borderRadius: 6,
    },

    Tag: {
      colorBgError: 'rgba(255, 0, 153, 0.2)',
      colorBgWarning: 'rgba(250, 204, 21, 0.2)',
      colorBgSuccess: 'rgba(10, 255, 96, 0.2)',
      colorTextError: '#ff0099',
      colorTextWarning: '#facc15',
      colorTextSuccess: '#0aff60',
    },
  },
};

export default cyberpunkTheme;
```

- [ ] **Step 2: Commit**

```bash
git add src/theme/index.ts
git commit -m "feat: 创建赛博朋克主题配置"
```

### Task 2: 应用主题配置

**Files:**
- Modify: `src/main.tsx:1-26`
- Create: 无

- [ ] **Step 1: 修改main.tsx应用主题**

修改 `src/main.tsx` 文件：

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import App from './App';
import cyberpunkTheme from './theme';
import 'antd/dist/reset.css';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      cacheTime: 300 * 1000,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        locale={zhCN}
        theme={cyberpunkTheme}
      >
        <App />
      </ConfigProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
```

- [ ] **Step 2: Commit**

```bash
git add src/main.tsx
git commit -m "feat: 应用赛博朋克主题配置"
```

### Task 3: 创建全局样式文件

**Files:**
- Create: `src/index.css`
- Modify: 无

- [ ] **Step 1: 创建全局样式文件**

创建文件 `src/index.css`：

```css
:root {
  /* 主色调 */
  --color-bg-primary: #0a0b1e;
  --color-bg-secondary: #1a1b3e;
  --color-bg-glass: rgba(22, 24, 53, 0.8);

  /* 渐变色 */
  --gradient-primary: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%);
  --gradient-hover: linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #06b6d4 100%);
  --gradient-card: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(6, 182, 212, 0.1));
  --gradient-text: linear-gradient(90deg, #6366f1, #8b5cf6);

  /* 霓虹色 */
  --color-neon-blue: #00f3ff;
  --color-neon-purple: #bc13fe;
  --color-neon-green: #0aff60;
  --color-neon-pink: #ff0099;

  /* 文字颜色 */
  --color-text-primary: #ffffff;
  --color-text-secondary: rgba(255, 255, 255, 0.7);
  --color-text-muted: rgba(255, 255, 255, 0.5);

  /* 边框颜色 */
  --color-border-glass: rgba(139, 92, 246, 0.3);
  --color-border-glow: rgba(0, 243, 255, 0.5);

  /* 阴影 */
  --shadow-glow: 0 0 15px rgba(139, 92, 246, 0.4);
  --shadow-glow-strong: 0 0 30px rgba(139, 92, 246, 0.6);
  --shadow-glass: 0 8px 32px rgba(0, 0, 0, 0.3);

  /* 动画 */
  --transition-speed: 0.3s;
  --transition-ease: ease-in-out;
}

/* 重置和基础样式 */
body {
  margin: 0;
  padding: 0;
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  min-height: 100vh;
  overflow-x: hidden;
}

/* 玻璃态工具类 */
.glass {
  background: var(--color-bg-glass);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--color-border-glass);
}

.glass-strong {
  background: rgba(22, 24, 53, 0.95);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(139, 92, 246, 0.4);
}

/* 渐变工具类 */
.gradient-primary {
  background: var(--gradient-primary);
}

.gradient-text {
  background: var(--gradient-text);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 霓虹工具类 */
.neon-text-blue {
  color: var(--color-neon-blue);
  text-shadow: 0 0 10px rgba(0, 243, 255, 0.5);
}

.neon-text-purple {
  color: var(--color-neon-purple);
  text-shadow: 0 0 10px rgba(188, 19, 254, 0.5);
}

.neon-text-green {
  color: var(--color-neon-green);
  text-shadow: 0 0 10px rgba(10, 255, 96, 0.5);
}

.neon-text-pink {
  color: var(--color-neon-pink);
  text-shadow: 0 0 10px rgba(255, 0, 153, 0.5);
}

/* 阴影工具类 */
.shadow-glow {
  box-shadow: var(--shadow-glow);
}

.shadow-glow-strong {
  box-shadow: var(--shadow-glow-strong);
}

/* 动画工具类 */
.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out forwards;
  opacity: 0;
}

.animate-card-hover {
  transition: transform 0.3s var(--transition-ease), box-shadow 0.3s var(--transition-ease);
}

.animate-card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(139, 92, 246, 0.3);
}

.animate-button-click {
  transition: all var(--transition-speed) var(--transition-ease);
}

.animate-button-click:active {
  transform: scale(0.95);
}

.animate-border-glow {
  animation: borderGlow 2s ease-in-out infinite;
}

/* 卡片样式 */
.cyber-card {
  background: var(--color-bg-glass);
  border: 1px solid var(--color-border-glass);
  border-radius: 12px;
  padding: 24px;
  transition: all var(--transition-speed) var(--transition-ease);
}

.cyber-card:hover {
  border-color: rgba(0, 243, 255, 0.5);
  box-shadow: var(--shadow-glow-strong);
}

/* 表格样式 */
.cyber-table {
  background: rgba(30, 31, 58, 0.8);
  border-radius: 12px;
  overflow: hidden;
}

.cyber-table .ant-table {
  background: transparent;
}

.cyber-table .ant-table-thead > tr > th {
  background: var(--gradient-card);
  color: var(--color-text-primary);
  font-weight: 600;
  border-bottom: 1px solid var(--color-border-glass);
}

.cyber-table .ant-table-tbody > tr > td {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.cyber-table .ant-table-tbody > tr:hover > td {
  background: rgba(139, 92, 246, 0.1);
  border-color: rgba(139, 92, 246, 0.3);
}

.cyber-table .ant-table-pagination-item-active {
  background: var(--gradient-primary);
  border: none;
}

.cyber-table .ant-table-pagination-item {
  border: 1px solid var(--color-border-glass);
  color: var(--color-text-primary);
}

.cyber-table .ant-table-pagination-item:hover:not(.ant-table-pagination-item-active) {
  border-color: #8b5cf6;
}

/* 输入框样式 */
.cyber-input,
.cyber-select,
.cyber-textarea,
.cyber-picker {
  background: rgba(22, 24, 53, 0.6);
  border: 1px solid var(--color-border-glass);
  border-radius: 6px;
  color: var(--color-text-primary);
  transition: all var(--transition-speed) var(--transition-ease);
}

.cyber-input:hover,
.cyber-select:hover,
.cyber-textarea:hover,
.cyber-picker:hover {
  border-color: #8b5cf6;
  box-shadow: 0 0 10px rgba(139, 92, 246, 0.3);
}

.cyber-input:focus,
.cyber-select:focus,
.cyber-textarea:focus,
.cyber-picker:focus {
  border-color: #8b5cf6;
  box-shadow: 0 0 15px rgba(139, 92, 246, 0.4);
}

.cyber-input::placeholder {
  color: var(--color-text-muted);
}

/* 按钮样式 */
.cyber-btn-primary {
  background: var(--gradient-primary);
  border: none;
  border-radius: 6px;
  color: var(--color-text-primary);
  box-shadow: var(--shadow-glow);
  transition: all var(--transition-speed) var(--transition-ease);
}

.cyber-btn-primary:hover {
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(139, 92, 246, 0.6);
}

.cyber-btn-primary:active {
  transform: scale(0.95);
}

.cyber-btn-secondary {
  background: transparent;
  border: 1px solid var(--color-border-glass);
  border-radius: 6px;
  color: var(--color-text-primary);
  transition: all var(--transition-speed) var(--transition-ease);
}

.cyber-btn-secondary:hover {
  border-color: #8b5cf6;
  background: rgba(139, 92, 246, 0.1);
}

.cyber-btn-danger {
  background: rgba(255, 0, 153, 0.2);
  border: 1px solid rgba(255, 0, 153, 0.3);
  border-radius: 6px;
  color: var(--color-text-primary);
  transition: all var(--transition-speed) var(--transition-ease);
}

.cyber-btn-danger:hover {
  border-color: rgba(255, 0, 153, 0.5);
  background: rgba(255, 0, 153, 0.3);
}

/* Tag样式 */
.cyber-tag {
  border-radius: 4px;
  padding: 2px 10px;
  font-size: 12px;
  border: 1px solid currentColor;
}

.cyber-tag-blue {
  color: var(--color-neon-blue);
  background: rgba(0, 243, 255, 0.1);
  border-color: rgba(0, 243, 255, 0.3);
}

.cyber-tag-purple {
  color: var(--color-neon-purple);
  background: rgba(188, 19, 254, 0.1);
  border-color: rgba(188, 19, 254, 0.3);
}

.cyber-tag-green {
  color: var(--color-neon-green);
  background: rgba(10, 255, 96, 0.1);
  border-color: rgba(10, 255, 96, 0.3);
}

.cyber-tag-pink {
  color: var(--color-neon-pink);
  background: rgba(255, 0, 153, 0.1);
  border-color: rgba(255, 0, 153, 0.3);
}

.cyber-tag-orange {
  color: var(--color-warning);
  background: rgba(250, 204, 21, 0.1);
  border-color: rgba(250, 204, 21, 0.3);
}

/* Modal样式 */
.cyber-modal {
  background: rgba(22, 24, 53, 0.9);
  border: 1px solid var(--color-border-glass);
  border-radius: 12px;
}

.cyber-modal .ant-modal-header {
  border-bottom: 1px solid var(--color-border-glass);
  padding: 20px 24px;
}

.cyber-modal .ant-modal-body {
  padding: 24px;
}

.cyber-modal .ant-modal-footer {
  border-top: 1px solid var(--color-border-glass);
  padding: 16px 24px;
}

.cyber-modal .ant-modal-close {
  color: var(--color-text-primary);
}

.cyber-modal .ant-modal-close:hover {
  color: var(--color-neon-blue);
}

/* Statistic样式 */
.cyber-statistic-title {
  color: var(--color-text-secondary);
  font-size: 16px;
}

.cyber-statistic-value {
  color: var(--color-text-primary);
  font-size: 36px;
  font-weight: 600;
}

/* 隐藏滚动条但保留功能 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(10, 11, 30, 0.8);
}

::-webkit-scrollbar-thumb {
  background: rgba(139, 92, 246, 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(139, 92, 246, 0.5);
}

/* 动画关键帧 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes cardHover {
  from {
    box-shadow: 0 4px 20px rgba(139, 92, 246, 0.1);
    transform: translateY(0);
  }
  to {
    box-shadow: 0 8px 30px rgba(139, 92, 246, 0.3);
    transform: translateY(-2px);
  }
}

@keyframes buttonClick {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.95);
  }
}

@keyframes numberGrow {
  from {
    opacity: 0;
    transform: scale(0.5);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes borderGlow {
  0%, 100% {
    border-color: rgba(139, 92, 246, 0.3);
  }
  50% {
    border-color: rgba(0, 243, 255, 0.6);
  }
}

/* 添加动画类 */
.animate-number {
  animation: numberGrow 0.5s ease-out forwards;
  opacity: 0;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .cyber-card {
    padding: 16px;
  }

  .cyber-input,
  .cyber-select,
  .cyber-textarea {
    padding: 8px 12px;
    font-size: 14px;
  }

  .cyber-statistic-value {
    font-size: 28px;
  }

  .cyber-statistic-title {
    font-size: 14px;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/index.css
git commit -m "feat: 创建赛博朋克全局样式"
```

### Task 4: 改造AppLayout组件

**Files:**
- Modify: `src/components/AppLayout.tsx:1-52`
- Create: 无

- [ ] **Step 1: 改造AppLayout组件**

修改 `src/components/AppLayout.tsx` 文件：

```typescript
import { Layout, Menu, Breadcrumb } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

const { Header, Content, Sider } = Layout;

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { key: '/', label: '首页' },
    { key: '/dashboard', label: '仪表盘' },
    { key: '/users', label: '用户管理' },
    { key: '/nodes', label: '节点管理' },
    { key: '/orders', label: '订单管理' },
    { key: '/plans', label: '订阅计划' },
    { key: '/logs', label: '系统日志' },
  ];

  return (
    <Layout style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0b1e 0%, #1a1b3e 50%, #0a0b1e 100%)',
    }}>
      <Sider width={240} theme="dark" style={{
        background: 'rgba(22, 24, 53, 0.9)',
        backdropFilter: 'blur(10px)',
        borderRight: '1px solid rgba(139, 92, 246, 0.3)',
      }}>
        <div style={{
          padding: '20px',
          color: '#fff',
          fontSize: '24px',
          fontWeight: 'bold',
          textShadow: '0 0 10px rgba(139, 92, 246, 0.5)',
        }}>
          管理控制台
        </div>
        <Menu
          theme="dark"
          selectedKeys={[location.pathname]}
          mode="inline"
          style={{
            border: 'none',
          }}
        >
          <Menu.Item key="/" icon={</* 使用图标 */>}>
            首页
          </Menu.Item>
          <Menu.Item key="/dashboard" icon={</* 使用图标 */>}>
            仪表盘
          </Menu.Item>
          <Menu.Item key="/users" icon={</* 使用图标 */>}>
            用户管理
          </Menu.Item>
          <Menu.Item key="/nodes" icon={</* 使用图标 */>}>
            节点管理
          </Menu.Item>
          <Menu.Item key="/orders" icon={</* 使用图标 */>}>
            订单管理
          </Menu.Item>
          <Menu.Item key="/plans" icon={</* 使用图标 */>}>
            订阅计划
          </Menu.Item>
          <Menu.Item key="/logs" icon={</* 使用图标 */>}>
            系统日志
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{
          background: 'rgba(22, 24, 53, 0.8)',
          backdropFilter: 'blur(10px)',
        }}>
          <div style={{
            color: 'rgba(255,255,255,0.9)',
            fontSize: '16px',
            fontWeight: 500,
          }}>
            {menuItems.find(item => item.key === location.pathname)?.label || '管理控制台'}
          </div>
        </Header>
        <Content style={{
          padding: '24px',
          background: 'transparent',
        }}>
          <Breadcrumb style={{ marginBottom: 16 }}>
            <Breadcrumb.Item>首页</Breadcrumb.Item>
            <Breadcrumb.Item>
              {menuItems.find(item => item.key === location.pathname)?.label || '管理控制台'}
            </Breadcrumb.Item>
          </Breadcrumb>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/AppLayout.tsx
git commit -m "feat: 改造AppLayout为赛博朋克风格"
```

### Task 5: 改造Sidebar组件

**Files:**
- Modify: `src/components/sidebar/Sidebar.tsx:1-41`
- Create: 无

- [ ] **Step 1: 改造Sidebar组件**

修改 `src/components/sidebar/Sidebar.tsx` 文件：

```typescript
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Menu } from 'antd';
import { LayoutDashboard, Users, Global, ShoppingCart, CreditCard, FileText } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import config from '../../config/sidebar';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = config.children.map((item) => {
    const Icon = getIcon(item.icon);
    return {
      key: item.path,
      icon: <Icon style={{ color: '#ffffff' }} />,
      label: item.title,
    };
  });

  const getIcon = (iconName: string) => {
    const iconMap: Record<string, any> = {
      LayoutDashboard,
      Users,
      Global,
      ShoppingCart,
      CreditCard,
      FileText,
    } as Record<string, any>;
    return iconMap[iconName] || null;
  };

  return (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[location.pathname]}
      items={menuItems}
      onClick={({ key }) => navigate(key)}
      style={{
        border: 'none',
      }}
    />
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/sidebar/Sidebar.tsx
git commit -m "feat: 改造Sidebar组件为赛博朋克风格"
```

### Task 6: 改造Dashboard页面

**Files:**
- Modify: `src/pages/Dashboard.tsx:1-46`
- Create: 无

- [ ] **Step 1: 改造Dashboard页面**

修改 `src/pages/Dashboard.tsx` 文件：

```typescript
import { Card, Statistic, Row, Col, Typography } from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

const { Title, Paragraph } = Typography;

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => api.get('/dashboard/stats'),
  });

  if (isLoading) {
    return <div>加载中...</div>;
  }

  return (
    <div>
      <Title level={2} style={{
        color: '#ffffff',
        margin: '0 0 16px 0',
      }}>
        仪表盘
      </Title>
      <Paragraph style={{
        color: 'rgba(255, 255, 255, 0.7)',
        margin: '0 0 24px 0',
      }}>
        欢迎来到管理控制台
      </Paragraph>

      <Row gutter={[16, 16]} style={{ marginTop: '24px' }}>
        <Col span={12}>
          <Card
            className="cyber-card"
            style={{ animationDelay: '0.1s' }}
            hoverable
          >
            <Statistic
              title={<span className="cyber-statistic-title">总用户数</span>}
              value={stats?.totalUsers || 0}
              prefix={<ArrowUpOutlined style={{ color: '#0aff60' }} />}
              valueStyle={{
                color: '#0aff60',
                fontSize: 36,
                fontWeight: 'bold',
                textShadow: '0 0 10px rgba(10, 255, 96, 0.5)',
              }}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card
            className="cyber-card"
            style={{ animationDelay: '0.2s' }}
            hoverable
          >
            <Statistic
              title={<span className="cyber-statistic-title">总订单数</span>}
              value={stats?.totalOrders || 0}
              valueStyle={{
                color: '#bc13fe',
                fontSize: 36,
                fontWeight: 'bold',
                textShadow: '0 0 10px rgba(188, 19, 254, 0.5)',
              }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/Dashboard.tsx
git commit -m "feat: 改造Dashboard页面为赛博朋克风格"
```

### Task 7: 改造Users页面

**Files:**
- Modify: `src/pages/Users.tsx`
- Create: 无

- [ ] **Step 1: 改造Users页面**

修改 `src/pages/Users.tsx` 文件：

```typescript
import { Table, Button, Space, Tag, Input } from 'antd';
import { useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export default function Users() {
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  const { data, isLoading } = useQuery({
    queryKey: ['users', pagination.current, pagination.pageSize, searchText],
    queryFn: () => api.get(`/users?page=${pagination.current}&limit=${pagination.pageSize}&search=${searchText}`),
  });

  const columns = [
    {
      title: '用户ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag
          className="cyber-tag"
          color={status === 'active' ? 'success' : status === 'inactive' ? 'warning' : 'error'}
          style={{ borderColor: 'currentColor' }}
        >
          {status}
        </Tag>
      ),
    },
    {
      title: '注册时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString(),
    },
  ];

  return (
    <div>
      <h2 style={{
        color: '#ffffff',
        margin: '0 0 16px 0',
      }}>
        用户管理
      </h2>
      <Space style={{ marginBottom: 16 }}>
        <Input
          className="cyber-input"
          placeholder="搜索用户"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        <Button type="primary" className="cyber-btn-primary">
          刷新
        </Button>
      </Space>

      <div className="cyber-table">
        <Table
          columns={columns}
          dataSource={data?.data || []}
          rowKey="id"
          loading={isLoading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: data?.total || 0,
            onChange: (page, pageSize) => setPagination({ current: page, pageSize }),
          }}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/Users.tsx
git commit -m "feat: 改造Users页面为赛博朋克风格"
```

### Task 8: 改造Nodes页面

**Files:**
- Modify: `src/pages/Nodes.tsx`
- Create: 无

- [ ] **Step 1: 改造Nodes页面**

修改 `src/pages/Nodes.tsx` 文件：

```typescript
import { Table, Button, Space, Tag, Input, Modal, Form, Select } from 'antd';
import { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../services/api';

const { TextArea } = Input;

export default function Nodes() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['nodes'],
    queryFn: () => api.get('/nodes'),
  });

  const mutation = useMutation({
    mutationFn: (values: any) => api.post('/nodes', values),
    onSuccess: () => {
      refetch();
      setIsModalOpen(false);
      form.resetFields();
    },
  });

  const columns = [
    {
      title: '节点ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '节点名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => <Tag color="blue">{type}</Tag>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag
          className="cyber-tag"
          color={status === 'online' ? 'success' : status === 'offline' ? 'error' : 'warning'}
          style={{ borderColor: 'currentColor' }}
        >
          {status}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space>
          <Button type="link">编辑</Button>
          <Button type="link" danger>删除</Button>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const onFinish = (values: any) => {
    mutation.mutate(values);
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{
          color: '#ffffff',
          margin: '0 0 8px 0',
        }}>
          节点管理
        </h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
          className="cyber-btn-primary"
        >
          添加节点
        </Button>
      </div>

      <div className="cyber-table">
        <Table
          columns={columns}
          dataSource={data?.data || []}
          rowKey="id"
          loading={isLoading}
        />
      </div>

      <Modal
        title="添加节点"
        open={isModalOpen}
        onOk={form.submit}
        onCancel={handleCancel}
        className="cyber-modal"
      >
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            name="name"
            label="节点名称"
            rules={[{ required: true, message: '请输入节点名称' }]}
          >
            <Input className="cyber-input" placeholder="请输入节点名称" />
          </Form.Item>

          <Form.Item
            name="type"
            label="节点类型"
            rules={[{ required: true, message: '请选择节点类型' }]}
          >
            <Select
              className="cyber-select"
              placeholder="请选择节点类型"
            >
              <Select.Option value="vmess">VMess</Select.Option>
              <Select.Option value="vless">VLESS</Select.Option>
              <Select.Option value="trojan">Trojan</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="config"
            label="节点配置"
            rules={[{ required: true, message: '请输入节点配置' }]}
          >
            <TextArea rows={4} className="cyber-textarea" placeholder="请输入节点配置" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/Nodes.tsx
git commit -m "feat: 改造Nodes页面为赛博朋克风格"
```

### Task 9: 改造Orders页面

**Files:**
- Modify: `src/pages/Orders.tsx`
- Create: 无

- [ ] **Step 1: 改造Orders页面**

修改 `src/pages/Orders.tsx` 文件：

```typescript
import { Table, Button, Space, Tag, Input } from 'antd';
import { useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export default function Orders() {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  const { data, isLoading } = useQuery({
    queryKey: ['orders', pagination.current, pagination.pageSize, searchText, statusFilter],
    queryFn: () => api.get(`/orders?page=${pagination.current}&limit=${pagination.pageSize}&search=${searchText}&status=${statusFilter}`),
  });

  const columns = [
    {
      title: '订单号',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
    },
    {
      title: '用户',
      dataIndex: 'user',
      key: 'user',
      render: (user: any) => user?.username || '-',
    },
    {
      title: '订阅计划',
      dataIndex: 'plan',
      key: 'plan',
      render: (plan: string) => <Tag color="blue">{plan}</Tag>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag
          className="cyber-tag"
          color={status === 'paid' ? 'success' : status === 'pending' ? 'warning' : 'error'}
          style={{ borderColor: 'currentColor' }}
        >
          {status}
        </Tag>
      ),
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `$${amount.toFixed(2)}`,
    },
    {
      title: '订单时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString(),
    },
  ];

  return (
    <div>
      <h2 style={{
        color: '#ffffff',
        margin: '0 0 16px 0',
      }}>
        订单管理
      </h2>
      <Space style={{ marginBottom: 16 }}>
        <Input
          className="cyber-input"
          placeholder="搜索订单号或用户"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          style={{ width: 150 }}
        >
          <Select.Option value="all">全部状态</Select.Option>
          <Select.Option value="pending">待支付</Select.Option>
          <Select.Option value="paid">已支付</Select.Option>
          <Select.Option value="cancelled">已取消</Select.Option>
        </Select>
        <Button type="primary" className="cyber-btn-primary">
          刷新
        </Button>
      </Space>

      <div className="cyber-table">
        <Table
          columns={columns}
          dataSource={data?.data || []}
          rowKey="id"
          loading={isLoading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: data?.total || 0,
            onChange: (page, pageSize) => setPagination({ current: page, pageSize }),
          }}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/Orders.tsx
git commit -m "feat: 改造Orders页面为赛博朋克风格"
```

### Task 10: 改造SubscriptionPlans页面

**Files:**
- Modify: `src/pages/SubscriptionPlans.tsx`
- Create: 无

- [ ] **Step 1: 改造SubscriptionPlans页面**

修改 `src/pages/SubscriptionPlans.tsx` 文件：

```typescript
import { Table, Button, Space, Input, Modal, Form } from 'antd';
import { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../services/api';

const { TextArea } = Input;

export default function SubscriptionPlans() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['plans'],
    queryFn: () => api.get('/plans'),
  });

  const mutation = useMutation({
    mutationFn: (values: any) => api.post('/plans', values),
    onSuccess: () => {
      refetch();
      setIsModalOpen(false);
      form.resetFields();
    },
  });

  const columns = [
    {
      title: '计划ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '计划名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `$${price.toFixed(2)} / 月`,
    },
    {
      title: '流量',
      dataIndex: 'bandwidth',
      key: 'bandwidth',
      render: (bandwidth: string) => bandwidth,
    },
    {
      title: '有效期',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space>
          <Button type="link">编辑</Button>
          <Button type="link" danger>删除</Button>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const onFinish = (values: any) => {
    mutation.mutate(values);
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{
          color: '#ffffff',
          margin: '0 0 8px 0',
        }}>
          订阅计划
        </h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
          className="cyber-btn-primary"
        >
          添加计划
        </Button>
      </div>

      <div className="cyber-table">
        <Table
          columns={columns}
          dataSource={data?.data || []}
          rowKey="id"
          loading={isLoading}
        />
      </div>

      <Modal
        title="添加订阅计划"
        open={isModalOpen}
        onOk={form.submit}
        onCancel={handleCancel}
        className="cyber-modal"
      >
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            name="name"
            label="计划名称"
            rules={[{ required: true, message: '请输入计划名称' }]}
          >
            <Input className="cyber-input" placeholder="请输入计划名称" />
          </Form.Item>

          <Form.Item
            name="price"
            label="价格（元/月）"
            rules={[{ required: true, message: '请输入价格' }]}
          >
            <Input className="cyber-input" placeholder="请输入价格" type="number" />
          </Form.Item>

          <Form.Item
            name="bandwidth"
            label="流量"
            rules={[{ required: true, message: '请输入流量' }]}
          >
            <Input className="cyber-input" placeholder="请输入流量，例如：10GB" />
          </Form.Item>

          <Form.Item
            name="duration"
            label="有效期"
            rules={[{ required: true, message: '请输入有效期' }]}
          >
            <Input className="cyber-input" placeholder="请输入有效期，例如：30天" />
          </Form.Item>

          <Form.Item
            name="features"
            label="功能特性"
          >
            <TextArea rows={4} className="cyber-textarea" placeholder="请输入功能特性，每行一个" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/SubscriptionPlans.tsx
git commit -m "feat: 改造SubscriptionPlans页面为赛博朋克风格"
```

### Task 11: 改造Logs页面

**Files:**
- Modify: `src/pages/Logs.tsx`
- Create: 无

- [ ] **Step 1: 改造Logs页面**

修改 `src/pages/Logs.tsx` 文件：

```typescript
import { Table, Tag, Input, Select, DatePicker, Space, Button } from 'antd';
import { useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export default function Logs() {
  const [searchText, setSearchText] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[Date, Date] | null>(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  const { data, isLoading } = useQuery({
    queryKey: ['logs', pagination.current, pagination.pageSize, searchText, levelFilter, dateRange],
    queryFn: () => api.get(`/logs?page=${pagination.current}&limit=${pagination.pageSize}&search=${searchText}&level=${levelFilter}&dateFrom=${dateRange?.[0]?.toISOString()}&dateTo=${dateRange?.[1]?.toISOString()}`),
  });

  const columns = [
    {
      title: '日志ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '级别',
      dataIndex: 'level',
      key: 'level',
      render: (level: string) => (
        <Tag
          className="cyber-tag"
          color={level === 'error' ? 'error' : level === 'warning' ? 'warning' : 'success'}
          style={{ borderColor: 'currentColor' }}
        >
          {level.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: '消息',
      dataIndex: 'message',
      key: 'message',
      ellipsis: true,
    },
    {
      title: 'IP地址',
      dataIndex: 'ip',
      key: 'ip',
    },
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp: string) => new Date(timestamp).toLocaleString(),
    },
  ];

  return (
    <div>
      <h2 style={{
        color: '#ffffff',
        margin: '0 0 16px 0',
      }}>
        系统日志
      </h2>
      <Space style={{ marginBottom: 16 }}>
        <Input
          className="cyber-input"
          placeholder="搜索日志消息"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        <Select
          className="cyber-select"
          value={levelFilter}
          onChange={setLevelFilter}
          style={{ width: 150 }}
        >
          <Select.Option value="all">全部级别</Select.Option>
          <Select.Option value="info">INFO</Select.Option>
          <Select.Option value="warning">WARNING</Select.Option>
          <Select.Option value="error">ERROR</Select.Option>
        </Select>
        <DatePicker.RangePicker className="cyber-picker" value={dateRange} onChange={setDateRange} />
        <Button type="primary" className="cyber-btn-primary">
          刷新
        </Button>
      </Space>

      <div className="cyber-table">
        <Table
          columns={columns}
          dataSource={data?.data || []}
          rowKey="id"
          loading={isLoading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: data?.total || 0,
            onChange: (page, pageSize) => setPagination({ current: page, pageSize }),
          }}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/Logs.tsx
git commit -m "feat: 改造Logs页面为赛博朋克风格"
```

### Task 12: 测试所有页面

**Files:**
- Test: `src/pages/*.tsx`
- Test: `src/components/AppLayout.tsx`
- Test: `src/components/sidebar/Sidebar.tsx`
- Create: 无

- [ ] **Step 1: 启动开发服务器**

Run: `npm run dev`
Expected: 服务器成功启动

- [ ] **Step 2: 测试所有页面**

访问以下页面：
- http://localhost:5173/
- http://localhost:5173/dashboard
- http://localhost:5173/users
- http://localhost:5173/nodes
- http://localhost:5173/orders
- http://localhost:5173/plans
- http://localhost:5173/logs

检查：
- 页面背景为深色渐变
- 侧边栏和头部使用玻璃态效果
- 卡片具有半透明背景
- 霓虹色边框和光效
- 文字颜色为白色系

- [ ] **Step 3: 检查控制台错误**

Run: `npm run lint`
Expected: 无错误和警告

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "test: 测试所有页面UI改造效果"
```

### Task 13: 优化动画效果

**Files:**
- Modify: `src/index.css`
- Create: 无

- [ ] **Step 1: 优化动画时长**

修改 `src/index.css` 中的动画时长：

```css
:root {
  --transition-speed: 0.4s;
  --transition-ease: ease-in-out;
}
```

- [ ] **Step 2: 添加更多动画效果**

在 `src/index.css` 中添加：

```css
/* 添加更多动画 */
.animate-fade-in-left {
  animation: fadeInLeft 0.5s ease-out forwards;
  opacity: 0;
}

@keyframes fadeInLeft {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-fade-in-right {
  animation: fadeInRight 0.5s ease-out forwards;
  opacity: 0;
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
```

- [ ] **Step 3: 添加数字增长动画**

在 `src/pages/Dashboard.tsx` 中添加：

```typescript
// 在Statistic中添加
valueStyle={{
  color: '#0aff60',
  fontSize: 36,
  fontWeight: 'bold',
  textShadow: '0 0 10px rgba(10, 255, 96, 0.5)',
}}
className="animate-number"
```

- [ ] **Step 4: Commit**

```bash
git add src/index.css src/pages/Dashboard.tsx
git commit -m "feat: 优化动画效果"
```

### Task 14: 代码优化和清理

**Files:**
- Modify: `src/index.css`, `src/components/AppLayout.tsx`, `src/components/sidebar/Sidebar.tsx`, `src/pages/*.tsx`
- Create: 无

- [ ] **Step 1: 提取公共样式类**

在 `src/index.css` 中提取：

```css
/* 通用卡片样式 */
.cyber-card-common {
  background: var(--color-bg-glass);
  border: 1px solid var(--color-border-glass);
  border-radius: 12px;
  padding: 24px;
  transition: all var(--transition-speed) var(--transition-ease);
}

.cyber-card-common:hover {
  border-color: rgba(0, 243, 255, 0.5);
  box-shadow: var(--shadow-glow-strong);
}

/* 通用按钮样式 */
.cyber-btn {
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  cursor: pointer;
  transition: all var(--transition-speed) var(--transition-ease);
}

.cyber-btn-primary {
  background: var(--gradient-primary);
  color: var(--color-text-primary);
  box-shadow: var(--shadow-glow);
}

.cyber-btn-primary:hover {
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(139, 92, 246, 0.6);
}

.cyber-btn-secondary {
  background: transparent;
  border: 1px solid var(--color-border-glass);
  color: var(--color-text-primary);
}

.cyber-btn-secondary:hover {
  border-color: #8b5cf6;
  background: rgba(139, 92, 246, 0.1);
}
```

- [ ] **Step 2: 清理重复代码**

检查并清理所有页面中的重复样式代码，使用提取的公共样式类。

- [ ] **Step 3: 检查代码质量**

Run: `npm run lint`
Run: `npm run build`
Expected: 无错误和警告，构建成功

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "refactor: 优化代码，提取公共样式"
```

---

## 实施计划验收标准

### 功能验收
- [ ] 所有页面正常显示
- [ ] 页面背景为深色渐变
- [ ] 侧边栏和头部使用玻璃态效果
- [ ] 卡片具有半透明背景和霓虹边框
- [ ] 文字颜色为白色系
- [ ] 按钮使用渐变色背景
- [ ] 表格具有深色半透明背景
- [ ] 输入框和选择框使用玻璃态效果

### 交互验收
- [ ] 动画平滑，无明显卡顿
- [ ] 悬停效果响应及时
- [ ] 点击反馈自然
- [ ] 输入框焦点效果明显
- [ ] 状态切换过渡流畅

### 质量验收
- [ ] 代码结构清晰
- [ ] 样式分层合理
- [ ] CSS变量统一管理
- [ ] 无重复代码
- [ ] 无控制台错误
- [ ] 无性能问题
- [ ] Lint检查通过
- [ ] Build成功

---

## 预期成果

完成后，VPN管理后台将具有：

1. **视觉风格**: 赛博朋克科技风，深色渐变背景 + 紫蓝渐变 + 霓虹光效
2. **组件样式**: 玻璃态半透明效果，霓虹边框
3. **动画效果**: 平滑的过渡动画和微交互
4. **代码质量**: 清晰的代码结构，统一的样式管理
5. **用户体验**: 流畅的交互体验，良好的视觉效果

---

**实施计划版本**: 1.0
**最后更新**: 2026-06-11
**作者**: OpenCode
**预计完成时间**: 8小时