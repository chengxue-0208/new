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
          items={menuItems}
          onClick={({ key }) => navigate(key)}
          style={{
            border: 'none',
          }}
        />
      </Sider>
      <Layout>
        <Header style={{
          background: 'rgba(22, 24, 53, 0.8)',
          backdropFilter: 'blur(10px)',
          padding: '0 24px',
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
          margin: '24px 16px',
          padding: '24px',
          background: 'transparent',
          borderRadius: '8px',
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