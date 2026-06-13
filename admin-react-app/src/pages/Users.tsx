import { Table, Button, Space, Tag, Input, Modal, Form, InputNumber, message, Popconfirm, Tooltip } from 'antd';
import { useState } from 'react';
import { SearchOutlined, EditOutlined, DeleteOutlined, DollarOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

interface User {
  id: string;
  username: string;
  email: string;
  balance: number;
  trafficUsed: number;
  trafficLimit: number;
  subscriptionStatus: 'ACTIVE' | 'INACTIVE' | 'EXPIRED' | 'PENDING';
  subscriptionExpiresAt: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

interface UserFormData {
  balance: number;
  trafficLimit: number;
}

const toNumber = (value: unknown, fallback = 0): number => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

export default function Users() {
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['users', pagination.current, pagination.pageSize, searchText],
    queryFn: () => api.get(`/users?page=${pagination.current}&limit=${pagination.pageSize}&search=${searchText}`).then((res: any) => res.data),
  });

  const updateMutation = useMutation({
    mutationFn: (data: UserFormData) => api.put(`/users/${selectedUser?.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setEditModalVisible(false);
      form.resetFields();
      message.success('用户信息更新成功');
    },
    onError: (error: any) => {
      message.error(error.message || '更新失败');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      message.success('用户删除成功');
    },
    onError: (error: any) => {
      message.error(error.message || '删除失败');
    },
  });

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    form.setFieldsValue({
      balance: user.balance,
      trafficLimit: user.trafficLimit,
    });
    setEditModalVisible(true);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleSearch = () => {
    queryClient.invalidateQueries({ queryKey: ['users'] });
  };

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
      title: '订阅状态',
      dataIndex: 'subscriptionStatus',
      key: 'subscriptionStatus',
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          'ACTIVE': 'green',
          'INACTIVE': 'orange',
          'EXPIRED': 'red',
          'PENDING': 'blue'
        };
        return <Tag color={colorMap[status] || 'default'}>{status}</Tag>;
      },
    },
    {
      title: '余额',
      dataIndex: 'balance',
      key: 'balance',
      render: (balance: number | string) => {
        const value = toNumber(balance);
        return (
          <Tooltip title="余额">
            <DollarOutlined style={{ marginRight: 4 }} />
            ¥{value.toFixed(2)}
          </Tooltip>
        );
      },
    },
    {
      title: '流量使用',
      key: 'traffic',
      children: [
        {
          title: '已用',
          render: (_: any, user: User) => `${(toNumber(user.trafficUsed) / 1024).toFixed(2)} GB`,
        },
        {
          title: '总量',
          render: (_: any, user: User) => `${(toNumber(user.trafficLimit) / 1024).toFixed(2)} GB`,
        },
      ],
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '注册时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString('zh-CN'),
    },
    {
      title: '操作',
      key: 'actions',
      render: (_: any, user: User) => (
        <Space size="small">
          <Tooltip title="编辑">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleEdit(user)}
            />
          </Tooltip>
          <Popconfirm
            title="确定要删除这个用户吗？"
            onConfirm={() => handleDelete(user.id)}
            okText="确定"
            cancelText="取消"
          >
            <Tooltip title="删除">
              <Button type="link" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
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
          onPressEnter={handleSearch}
        />
        <Button
          type="primary"
          className="cyber-btn-primary"
          icon={<SearchOutlined />}
          onClick={handleSearch}
        >
          搜索
        </Button>
        <Button
          type="default"
          className="cyber-btn-secondary"
        >
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

      <Modal
        title="编辑用户"
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          form.resetFields();
          setSelectedUser(null);
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            updateMutation.mutate(values);
          }}
        >
          <Form.Item
            label="余额"
            name="balance"
            rules={[{ required: true, message: '请输入余额' }]}
          >
            <InputNumber
              min={0}
              precision={2}
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item
            label="流量上限 (GB)"
            name="trafficLimit"
            rules={[{ required: true, message: '请输入流量上限' }]}
          >
            <InputNumber
              min={0}
              precision={2}
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
              <Button onClick={() => {
                setEditModalVisible(false);
                form.resetFields();
                setSelectedUser(null);
              }}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
