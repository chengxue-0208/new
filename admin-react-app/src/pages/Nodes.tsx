/* eslint-disable @typescript-eslint/no-explicit-any */
import { Table, Button, Space, Tag, Input, Modal, Form, Select, Tooltip, Popconfirm } from 'antd';
import { useState } from 'react';
import { PlusOutlined, EditOutlined, DeleteOutlined, DashboardOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { InputNumber } from 'antd';
import api from '../services/api';

const { TextArea } = Input;

interface Node {
  id: string;
  name: string;
  region: string;
  ipAddress: string;
  serverAddress?: string;
  port?: number;
  status: 'online' | 'offline' | 'maintenance';
  statusMessage?: string;
  uptime: number;
  load: number;
  maxConnections: number;
  currentConnections: number;
  bandwidth: number;
}

interface NodeFormData {
  name: string;
  region: string;
  ipAddress: string;
  serverAddress?: string;
  port?: number;
  maxConnections: number;
}

const toNumber = (value: unknown, fallback = 0): number => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

export default function Nodes() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);
  const [editNode, setEditNode] = useState<Node | null>(null);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['nodes'],
    queryFn: () => api.get('/nodes'),
  });

  const mutation = useMutation({
    mutationFn: (values: NodeFormData) => {
      const url = editNode ? `/nodes/${editNode.id}` : '/nodes';
      return editNode ? api.put(url, values) : api.post(url, values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nodes'] });
      setIsModalOpen(false);
      setIsHealthModalOpen(false);
      setEditNode(null);
      form.resetFields();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/nodes/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nodes'] });
    },
  });

  const healthMutation = useMutation({
    mutationFn: () => api.get('/nodes/health'),
    onSuccess: (data: any) => {
      setHealthData(data as any);
      setIsHealthModalOpen(true);
    },
  });

  const [healthData, setHealthData] = useState<any>(null);

  const handleAdd = () => {
    setEditNode(null);
    form.resetFields();
    form.setFieldsValue({
      maxConnections: 10,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (node: Node) => {
    setEditNode(node);
    form.setFieldsValue({
      name: node.name,
      region: node.region,
      ipAddress: node.ipAddress,
      serverAddress: node.serverAddress,
      port: node.port,
      maxConnections: node.maxConnections,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleCheckHealth = () => {
    healthMutation.mutate();
  };

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
      title: '区域',
      dataIndex: 'region',
      key: 'region',
      render: (region: string) => <Tag color="cyan">{region}</Tag>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          'online': 'green',
          'offline': 'red',
          'maintenance': 'orange'
        };
        return <Tag color={colorMap[status] || 'default'}>{status === 'online' ? '在线' : status === 'offline' ? '离线' : '维护中'}</Tag>;
      },
    },
    {
      title: '服务器',
      key: 'server',
      render: (_: any, node: Node) => (
        <Tooltip title={node.ipAddress}>
          <span>{node.serverAddress || node.ipAddress}</span>
        </Tooltip>
      ),
    },
    {
      title: '负载',
      dataIndex: 'load',
      key: 'load',
      render: (load: number | string) => {
        const loadValue = toNumber(load);
        return (
        <Tooltip title={`当前负载: ${loadValue.toFixed(2)}%`}>
          <div style={{ width: 100 }}>
            <div style={{ marginBottom: 4 }}>
              {loadValue > 80 ? '红色' : loadValue > 50 ? '橙色' : '绿色'}
            </div>
            <div
              style={{
                height: 8,
                backgroundColor: loadValue > 80 ? '#ff4d4f' : loadValue > 50 ? '#faad14' : '#52c41a',
                borderRadius: 4,
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${Math.min(100, Math.max(0, loadValue))}%`,
                  backgroundColor: 'white',
                  borderRadius: 4,
                }}
              />
            </div>
          </div>
        </Tooltip>
      );
      },
    },
    {
      title: '连接数',
      key: 'connections',
      children: [
        {
          title: '当前',
          render: (_: any, node: Node) => `${node.currentConnections}/${node.maxConnections}`,
        },
        {
          title: '带宽',
          render: (_: any, node: Node) => `${(toNumber(node.bandwidth) / 1024 / 1024).toFixed(2)} MB`,
        },
      ],
    },
    {
      title: '操作',
      key: 'actions',
      render: (_: any, node: Node) => (
        <Space size="small">
          <Tooltip title="编辑">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleEdit(node)}
            />
          </Tooltip>
          <Popconfirm
            title="确定要删除这个节点吗？"
            onConfirm={() => handleDelete(node.id)}
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
          节点管理
        </h2>
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
            className="cyber-btn-primary"
          >
            添加节点
          </Button>
          <Button
            type="default"
            icon={<DashboardOutlined />}
            onClick={handleCheckHealth}
            className="cyber-btn-secondary"
          >
            健康检查
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
        title={editNode ? '编辑节点' : '添加节点'}
        open={isModalOpen}
        onOk={form.submit}
        onCancel={() => {
          setIsModalOpen(false);
          setEditNode(null);
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
            label="节点名称"
            rules={[{ required: true, message: '请输入节点名称' }]}
          >
            <Input className="cyber-input" placeholder="请输入节点名称" />
          </Form.Item>

          <Form.Item
            name="region"
            label="区域"
            rules={[{ required: true, message: '请选择区域' }]}
          >
            <Select
              className="cyber-select"
              placeholder="请选择区域"
            >
              <Select.Option value="asia">亚洲</Select.Option>
              <Select.Option value="europe">欧洲</Select.Option>
              <Select.Option value="north_america">北美</Select.Option>
              <Select.Option value="south_america">南美</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="ipAddress"
            label="IP地址"
            rules={[{ required: true, message: '请输入IP地址' }]}
          >
            <Input className="cyber-input" placeholder="例如: 192.168.1.1" />
          </Form.Item>

          <Form.Item
            name="serverAddress"
            label="服务器地址"
          >
            <Input className="cyber-input" placeholder="可选，例如: vpn.example.com" />
          </Form.Item>

          <Form.Item
            name="port"
            label="端口"
          >
            <Input className="cyber-input" placeholder="可选，例如: 443" />
          </Form.Item>

          <Form.Item
            name="maxConnections"
            label="最大连接数"
            rules={[{ required: true, message: '请输入最大连接数' }]}
          >
            <InputNumber
              min={1}
              style={{ width: '100%' }}
              className="cyber-input"
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="节点健康状态"
        open={isHealthModalOpen}
        onCancel={() => setIsHealthModalOpen(false)}
        footer={null}
        className="cyber-modal"
      >
        <div style={{ marginBottom: 16 }}>
          <Space>
            <Tag color="green">在线: {healthData?.online || 0}</Tag>
            <Tag color="red">离线: {healthData?.offline || 0}</Tag>
            <Tag color="blue">总数: {healthData?.total || 0}</Tag>
          </Space>
        </div>
        <div>
          <Table
            columns={[
              {
                title: '节点名称',
                dataIndex: 'name',
                key: 'name',
              },
              {
                title: '区域',
                dataIndex: 'region',
                key: 'region',
              },
              {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                render: (status: string) => (
                  <Tag color={status === 'online' ? 'green' : 'red'}>{status === 'online' ? '在线' : '离线'}</Tag>
                ),
              },
              {
                title: '运行时间',
                dataIndex: 'uptime',
                key: 'uptime',
                render: (uptime: number) => `${Math.floor(uptime / 3600)}小时`,
              },
            ]}
            dataSource={healthData?.nodes || []}
            rowKey="id"
          />
        </div>
      </Modal>
    </div>
  );
}
