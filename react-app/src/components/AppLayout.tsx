import { Layout, Menu, Breadcrumb } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './components/sidebar/Sidebar';

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
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200} theme="dark">
        <div style={{ padding: '16px', color: 'white', fontSize: '18px', fontWeight: 'bold' }}>
          管理控制台
        </div>
        <Menu
          theme="dark"
          selectedKeys={[location.pathname]}
          mode="inline"
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 24px', boxShadow: '0 1px 4px rgba(0,21,41,0.08)' }}>
          <div style={{ color: 'rgba(0,0,0,0.85)', fontSize: '16px', fontWeight: 500 }}>
            {menuItems.find(item => item.key === location.pathname)?.label || '管理控制台'}
          </div>
        </Header>
        <Content style={{ margin: '24px 16px', padding: '24px', background: '#fff', borderRadius: '8px' }}>
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