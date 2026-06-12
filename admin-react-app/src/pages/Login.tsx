import { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (values: any) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/login', {
        username: values.username,
        password: values.password,
      });

      const { user, accessToken } = response;

      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', accessToken);

      message.success('登录成功');
      navigate('/dashboard');
    } catch (error: any) {
      message.error(error.response?.data?.message || '登录失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0a0b1e 0%, #1a1b3e 50%, #0a0b1e 100%)',
    }}>
      <Card
        title="管理控制台登录"
        style={{
          width: 400,
          background: 'rgba(22, 24, 53, 0.9)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
        }}
      >
        <Form
          name="login"
          onFinish={handleLogin}
          autoComplete="off"
          style={{ marginTop: 20 }}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名"
              size="large"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                color: '#fff',
              }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              size="large"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                color: '#fff',
              }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{
                background: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
                border: 'none',
                height: 44,
              }}
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}