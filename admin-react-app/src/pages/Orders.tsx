/* eslint-disable @typescript-eslint/no-explicit-any */
import { Table, Button, Space, Tag, Input, Modal, Form, Select, Tooltip, Popconfirm, message } from 'antd';
import { useState } from 'react';
import { SearchOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

type NumericValue = number | string | null | undefined;

interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  username: string;
  subscriptionPlanId: string;
  planName: string;
  status: string;
  totalAmount: NumericValue;
  paidAmount: NumericValue;
  discountAmount: NumericValue;
  pointsUsed: number;
  pointsEarned: number;
  paymentMethod: string;
  transactionId?: string;
  createdAt: string;
  paymentTime?: string;
  completedTime?: string;
}

interface OrderFormData {
  status: string;
  paymentTime?: Date;
  transactionId?: string;
}

const toNumber = (value: NumericValue, fallback = 0): number => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

const formatCurrency = (value: NumericValue): string => `¥${toNumber(value).toFixed(2)}`;

export default function Orders() {
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['orders', pagination.current, pagination.pageSize, searchText, statusFilter],
    queryFn: () => api.get(`/orders?page=${pagination.current}&limit=${pagination.pageSize}&search=${searchText}&status=${statusFilter}`).then((res: any) => res.data),
  });

  const updateMutation = useMutation({
    mutationFn: (data: OrderFormData) => api.put(`/orders/${selectedOrder?.id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      setEditModalVisible(false);
      form.resetFields();
      message.success('订单信息更新成功');
    },
    onError: (error: any) => {
      message.error(error.message || '更新失败');
    },
  });

  const columns = [
    {
      title: '订单号',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      width: 200,
    },
    {
      title: '订单ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: '用户',
      dataIndex: 'username',
      key: 'username',
      width: 100,
    },
    {
      title: '订阅计划',
      dataIndex: 'planName',
      key: 'planName',
      width: 120,
      render: (planName: string) => <Tag color="blue">{planName}</Tag>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap: Record<string, { color: string; label: string }> = {
          'PENDING': { color: 'orange', label: '待支付' },
          'PAID': { color: 'green', label: '已支付' },
          'COMPLETED': { color: 'blue', label: '已完成' },
          'CANCELLED': { color: 'red', label: '已取消' },
          'REFUNDED': { color: 'cyan', label: '已退款' },
        };
        const statusInfo = statusMap[status] || { color: 'default', label: status };
        return <Tag color={statusInfo.color}>{statusInfo.label}</Tag>;
      },
    },
    {
      title: '支付方式',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      render: (method: string) => {
        const methodMap: Record<string, string> = {
          'WALLET': '钱包',
          'CREDIT_CARD': '信用卡',
          'ALIPAY': '支付宝',
          'WECHAT_PAY': '微信支付',
          'OTHER': '其他',
        };
        return methodMap[method] || method;
      },
    },
    {
      title: '金额',
      key: 'amount',
      children: [
        {
          title: '总金额',
          render: (_: any, order: Order) => (
            <span>{formatCurrency(order.totalAmount)}</span>
          ),
        },
        {
          title: '实付',
          render: (_: any, order: Order) => (
            <span style={{ color: '#52c41a', fontWeight: 'bold' }}>
              {formatCurrency(order.paidAmount)}
            </span>
          ),
        },
      ],
    },
    {
      title: '优惠',
      key: 'discount',
      children: [
        {
          title: '优惠金额',
          render: (_: any, order: Order) => (
            <span style={{ color: '#ff4d4f' }}>
              -{formatCurrency(order.discountAmount)}
            </span>
          ),
        },
        {
          title: '积分',
          render: (_: any, order: Order) => (
            <span>
              {order.pointsUsed} / {order.pointsEarned}
            </span>
          ),
        },
      ],
    },
    {
      title: '时间',
      key: 'time',
      children: [
        {
          title: '订单时间',
          render: (_: any, order: Order) => new Date(order.createdAt).toLocaleString('zh-CN'),
        },
        {
          title: '支付时间',
          render: (_: any, order: Order) => order.paymentTime ? new Date(order.paymentTime).toLocaleString('zh-CN') : '-',
        },
      ],
    },
    {
      title: '操作',
      key: 'actions',
      width: 150,
      render: (_: any, order: Order) => (
        <Space size="small">
          <Tooltip title="编辑">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => {
                setSelectedOrder(order);
                form.setFieldsValue({
                  status: order.status,
                  transactionId: order.transactionId,
                });
                setEditModalVisible(true);
              }}
            />
          </Tooltip>
          <Popconfirm
            title="确定要删除这个订单吗？"
            onConfirm={() => handleDelete(order.id)}
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

  const handleDelete = (id: string) => {
    api.delete(`/orders/${id}`)
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ['orders'] });
        message.success('订单删除成功');
      })
      .catch((error: any) => {
        message.error(error.message || '删除失败');
      });
  };

  const handleSearch = () => {
    refetch();
  };

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
          onPressEnter={handleSearch}
          style={{ width: 300 }}
        />
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          style={{ width: 150 }}
        >
          <Select.Option value="all">全部状态</Select.Option>
          <Select.Option value="PENDING">待支付</Select.Option>
          <Select.Option value="PAID">已支付</Select.Option>
          <Select.Option value="COMPLETED">已完成</Select.Option>
          <Select.Option value="CANCELLED">已取消</Select.Option>
          <Select.Option value="REFUNDED">已退款</Select.Option>
        </Select>
        <Button
          type="primary"
          icon={<SearchOutlined />}
          onClick={handleSearch}
          className="cyber-btn-primary"
        >
          搜索
        </Button>
        <Button
          type="default"
          icon={<ReloadOutlined />}
          onClick={() => refetch()}
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
        title="编辑订单"
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false);
          setSelectedOrder(null);
          form.resetFields();
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
            label="订单状态"
            name="status"
            rules={[{ required: true, message: '请选择订单状态' }]}
          >
            <Select>
              <Select.Option value="PENDING">待支付</Select.Option>
              <Select.Option value="PAID">已支付</Select.Option>
              <Select.Option value="COMPLETED">已完成</Select.Option>
              <Select.Option value="CANCELLED">已取消</Select.Option>
              <Select.Option value="REFUNDED">已退款</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="支付时间"
            name="paymentTime"
          >
            <Input type="datetime-local" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            label="交易ID"
            name="transactionId"
          >
            <Input placeholder="可选，例如：2024-06-11-123456" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                保存
              </Button>
              <Button onClick={() => {
                setEditModalVisible(false);
                setSelectedOrder(null);
                form.resetFields();
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
