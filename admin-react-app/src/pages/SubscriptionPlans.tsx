import { Table, Button, Space, Input, Modal, Form } from 'antd';
import { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { useQuery, useMutation } from '@tanstack/react-query';
/* eslint-disable @typescript-eslint/no-explicit-any */
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