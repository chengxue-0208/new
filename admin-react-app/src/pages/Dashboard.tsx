import { Card, Statistic, Row, Col, Typography } from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

const { Title, Paragraph, Text } = Typography;

const dashboardNameStyle = {
  fontSize: '64px',
  fontWeight: 'bold',
  margin: '0 0 16px 0',
  textShadow: '0 0 20px rgba(139, 92, 246, 0.5)',
};

export default function Dashboard() {
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => api.get('/dashboard/stats').then((res: any) => res.data),
  });

  return (
    <div>
      <div style={{
        fontSize: '64px',
        fontWeight: 'bold',
        margin: '0 0 16px 0',
        background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
        textShadow: '0 0 20px rgba(139, 92, 246, 0.5)',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}>
        周承学
      </div>
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
              value={(stats as any)?.totalUsers || 0}
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
              value={(stats as any)?.totalOrders || 0}
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