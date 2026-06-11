import { Table, Button, Space, Tag, Input, Modal, Form, Select, Tooltip, Popconfirm } from 'antd';
import { useState } from 'react';
import { PlusOutlined, EditOutlined, DeleteOutlined, TagOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

const { TextArea } = Input;

interface SubscriptionPlan {
  id: string;
  name: string;
  type: string;
  price: number;
  originalPrice?: number;
  durationDays: number;
  trafficLimit: number;
  maxDevices: number;
  discountRate: number;
  isActive: boolean;
}

interface SubscriptionPlanFormData {
  name: string;
  type: string;
  price: number;
  durationDays: number;
  trafficLimit: number;
  maxDevices: number;
  discountRate: number;
  originalPrice?: number;
  isActive: boolean;
}

export default function SubscriptionPlans() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editPlan, setEditPlan] = useState<SubscriptionPlan | null>(null);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['subscription-plans'],
    queryFn: () => api.get('/subscription-plans'),
  });

  const mutation = useMutation({
    mutationFn: (values: SubscriptionPlanFormData) => {
      const url = editPlan ? `/subscription-plans/${editPlan.id}` : '/subscription-plans';
      return editPlan ? api.put(url, values) : api.post(url, values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription-plans'] });
      setIsModalOpen(false);
      setEditPlan(null);
      form.resetFields();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/subscription-plans/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription-plans'] });
    },
  });

  const handleAdd = () => {
    setEditPlan(null);
    form.resetFields();
    form.setFieldsValue({
      isActive: true,
      discountRate: 0,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (plan: SubscriptionPlan) => {
    setEditPlan(plan);
    form.setFieldsValue({
      name: plan.name,
      type: plan.type,
      price: plan.price,
      originalPrice: plan.originalPrice,
      durationDays: plan.durationDays,
      trafficLimit: plan.trafficLimit,
      maxDevices: plan.maxDevices,
      discountRate: plan.discountRate,
      isActive: plan.isActive,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const columns = [
    {
      title: '计划ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: '计划名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => {
        const typeMap: Record<string, { color: string; label: string }> = {
          'MONTHLY': { color: 'blue', label: '月付' },
          'QUARTERLY': { color: 'cyan', label: '季付' },
          'YEARLY': { color: 'green', label: '年付' },
          'LIFETIME': { color: 'gold', label: '终身' },
        };
        const typeInfo = typeMap[type] || { color: 'default', label: type };
        return <Tag color={typeInfo.color}>{typeInfo.label}</Tag>;
      },
    },
    {
      title: '价格',
      key: 'price',
      children: [
        {
          title: '当前价',
          render: (_: any, plan: SubscriptionPlan) => (
            <span style={{ color: '#52c41a', fontWeight: 'bold' }}>
              ¥{plan.price.toFixed(2)}
            </span>
          ),
        },
        {
          title: '原价',
          render: (_: any, plan: SubscriptionPlan) => {
            if (plan.originalPrice) {
              return (
                <Tooltip title={`节省 ¥${(plan.originalPrice - plan.price).toFixed(2)}`}>
                  <span style={{ color: '#ff4d4f', textDecoration: 'line-through' }}>
                    ¥{plan.originalPrice.toFixed(2)}
                  </span>
                </Tooltip>
              );
            }
            return null;
          },
        },
      ],
    },
    {
      title: '优惠率',
      dataIndex: 'discountRate',
      key: 'discountRate',
      render: (discountRate: number) => (
        <Tooltip title={`节省 ${(100 - discountRate).toFixed(0)}%`}>
          <Tag color="purple">-{discountRate.toFixed(0)}%</Tag>
        </Tooltip>
      ),
    },
    {
      title: '时长',
      key: 'duration',
      children: [
        {
          title: '天数',
          render: (_: any, plan: SubscriptionPlan) => `${plan.durationDays}天`,
        },
        {
          title: '设备数',
          render: (_: any, plan: SubscriptionPlan) => plan.maxDevices,
        },
      ],
    },
    {
      title: '流量',
      dataIndex: 'trafficLimit',
      key: 'trafficLimit',
      render: (trafficLimit: number) => `${(trafficLimit / 1024).toFixed(2)} GB`,
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>{isActive ? '启用' : '禁用'}</Tag>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      width: 150,
      render: (_: any, plan: SubscriptionPlan) => (
        <Space size="small">
          <Tooltip title="编辑">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleEdit(plan)}
            />
          </Tooltip>
          <Popconfirm
            title="确定要删除这个订阅计划吗？"
            onConfirm={() => handleDelete(plan.id)}
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
      <div style={{ marginBottom: 16 }}>
        <h2 style={{
          color: '#ffffff',
          margin: '0 0 8px 0',
        }}>
          订阅计划管理
        </h2>
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
            className="cyber-btn-primary"
          >
            添加计划
          </Button>
        </Space>
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
        title={editPlan ? '编辑订阅计划' : '添加订阅计划'}
        open={isModalOpen}
        onOk={form.submit}
        onCancel={() => {
          setIsModalOpen(false);
          setEditPlan(null);
          form.resetFields();
        }}
        className="cyber-modal"
      >
        <Form
          form={form}
          onFinish={(values) => mutation.mutate(values)}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="计划名称"
            rules={[{ required: true, message: '请输入计划名称' }]}
          >
            <Input className="cyber-input" placeholder="例如：标准月度订阅" />
          </Form.Item>

          <Form.Item
            name="type"
            label="订阅类型"
            rules={[{ required: true, message: '请选择订阅类型' }]}
          >
            <Select
              className="cyber-select"
              placeholder="请选择订阅类型"
            >
              <Select.Option value="MONTHLY">月度订阅</Select.Option>
              <Select.Option value="QUARTERLY">季度订阅</Select.Option>
              <Select.Option value="YEARLY">年度订阅</Select.Option>
              <Select.Option value="LIFETIME">终身订阅</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="price"
            label="价格（元）"
            rules={[{ required: true, message: '请输入价格' }]}
          >
            <InputNumber
              min={0}
              precision={2}
              style={{ width: '100%' }}
              className="cyber-input"
            />
          </Form.Item>

          <Form.Item
            name="originalPrice"
            label="原价（元）"
          >
            <InputNumber
              min={0}
              precision={2}
              style={{ width: '100%' }}
              className="cyber-input"
            />
          </Form.Item>

          <Form.Item
            name="durationDays"
            label="时长（天）"
            rules={[{ required: true, message: '请输入时长' }]}
          >
            <InputNumber
              min={1}
              style={{ width: '100%' }}
              className="cyber-input"
            />
          </Form.Item>

          <Form.Item
            name="trafficLimit"
            label="流量限制（GB）"
            rules={[{ required: true, message: '请输入流量限制' }]}
          >
            <InputNumber
              min={1}
              style={{ width: '100%' }}
              className="cyber-input"
            />
          </Form.Item>

          <Form.Item
            name="maxDevices"
            label="最大设备数"
            rules={[{ required: true, message: '请输入最大设备数' }]}
          >
            <InputNumber
              min={1}
              style={{ width: '100%' }}
              className="cyber-input"
            />
          </Form.Item>

          <Form.Item
            name="discountRate"
            label="优惠率（%）"
          >
            <InputNumber
              min={0}
              max={100}
              precision={2}
              style={{ width: '100%' }}
              className="cyber-input"
            />
          </Form.Item>

          <Form.Item
            name="isActive"
            valuePropName="checked"
          >
            <Select defaultValue={true} className="cyber-select" style={{ display: 'block' }}>
              <Select.Option value={true}>启用</Select.Option>
              <Select.Option value={false}>禁用</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}