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
        <Tag color={status === 'online' ? 'green' : status === 'offline' ? 'red' : 'orange'}>
          {status}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
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
        <h2>节点管理</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          添加节点
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={data?.data || []}
        rowKey="id"
        loading={isLoading}
      />

      <Modal
        title="添加节点"
        open={isModalOpen}
        onOk={form.submit}
        onCancel={handleCancel}
      >
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item
            name="name"
            label="节点名称"
            rules={[{ required: true, message: '请输入节点名称' }]}
          >
            <Input placeholder="请输入节点名称" />
          </Form.Item>

          <Form.Item
            name="type"
            label="节点类型"
            rules={[{ required: true, message: '请选择节点类型' }]}
          >
            <Select placeholder="请选择节点类型">
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
            <TextArea rows={4} placeholder="请输入节点配置" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}