import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout, Menu, ConfigProvider, theme } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  DollarOutlined,
  SettingOutlined,
  ClusterOutlined,
  FileTextOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import NodeManagement from './NodeManagement';
import { useState } from 'react';

const { Header, Content, Sider } = Layout;

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('nodes');

  const handleMenuClick = ({ key }: { key: string }) => {
    setSelectedKey(key);
  };

  const getBackgroundColor = () => {
    switch (selectedKey) {
      case 'dashboard':
        return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      case 'users':
        return 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
      case 'orders':
        return 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
      case 'nodes':
        return 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)';
      case 'logs':
        return 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)';
      default:
        return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
  };

  const menuItems = [
    { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: 'users', icon: <UserOutlined />, label: 'Users' },
    { key: 'orders', icon: <DollarOutlined />, label: 'Orders' },
    { key: 'nodes', icon: <ClusterOutlined />, label: 'Nodes' },
    { key: 'logs', icon: <FileTextOutlined />, label: 'Logs' },
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#667eea',
          borderRadius: 8,
        },
      }}
    >
      <Router>
        <Layout style={{ minHeight: '100vh' }}>
          <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
            <div style={{
              height: '64px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: '18px',
              fontWeight: 'bold',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}>
              {collapsed ? 'VPN' : 'VPN Admin'}
            </div>
            <Menu
              theme="dark"
              mode="inline"
              selectedKeys={[selectedKey]}
              items={menuItems}
              onClick={handleMenuClick}
            />
          </Sider>

          <Layout>
            <Header style={{ padding: '0 24px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ margin: 0 }}>Admin Dashboard</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '14px' }}>Admin User</span>
                <Button icon={<LogoutOutlined />} type="text">
                  Logout
                </Button>
              </div>
            </Header>

            <Content style={{ margin: '24px' }}>
              <Routes>
                <Route path="/admin" element={<Navigate to="/admin/nodes" replace />} />
                <Route path="/admin/dashboard" element={<div style={{ padding: '24px', background: getBackgroundColor(), borderRadius: '12px', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ textAlign: 'center', color: 'white' }}>
                    <h1>Dashboard</h1>
                    <p>Welcome to VPN Admin Dashboard</p>
                  </div>
                </div>} />
                <Route path="/admin/nodes" element={<NodeManagement />} />
                <Route path="/admin/users" element={<div style={{ padding: '24px', background: getBackgroundColor(), borderRadius: '12px', minHeight: '400px' }}>
                  <h2>Users Management</h2>
                  <p>Users management page will be implemented here.</p>
                </div>} />
                <Route path="/admin/orders" element={<div style={{ padding: '24px', background: getBackgroundColor(), borderRadius: '12px', minHeight: '400px' }}>
                  <h2>Orders Management</h2>
                  <p>Orders management page will be implemented here.</p>
                </div>} />
                <Route path="/admin/logs" element={<div style={{ padding: '24px', background: getBackgroundColor(), borderRadius: '12px', minHeight: '400px' }}>
                  <h2>Logs Management</h2>
                  <p>Logs management page will be implemented here.</p>
                </div>} />
              </Routes>
            </Content>
          </Layout>
        </Layout>
      </Router>
    </ConfigProvider>
  );
};

export default App;