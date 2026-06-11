import { Table, Button, Space, Tag, Input, Modal, Form, Select, Tooltip, Popconfirm } from 'antd';
import { useState } from 'react';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, CopyOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

interface VPNConfig {
  id: string;
  name: string;
  nodeId: string;
  node: string;
  protocol: string;
  port: number;
  dns?: string;
  encryption?: string;
  compression?: string;
  bandwidth: number;
  maxConnections: number;
  currentConnections: number;
  isActive: boolean;
}

interface VPNConfigFormData {
  name: string;
  nodeId: string;
  protocol: string;
  port: number;
  dns?: string;
  encryption?: string;
  compression?: string;
  bandwidth: number;
  maxConnections: number;
  isActive: boolean;
}

export default function VPNConfig() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editConfig, setEditConfig] = useState<VPNConfig | null>(null);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [previewConfig, setPreviewConfig] = useState<any>(null);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['vpn-configs'],
    queryFn: () => api.get('/vpn-configs'),
  });

  const mutation = useMutation({
    mutationFn: (values: VPNConfigFormData) => {
      const url = editConfig ? `/vpn-configs/${editConfig.id}` : '/vpn-configs';
      return editConfig ? api.put(url, values) : api.post(url, values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vpn-configs'] });
      setIsModalOpen(false);
      setEditConfig(null);
      form.resetFields();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/vpn-configs/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vpn-configs'] });
    },
  });

  const handleAdd = () => {
    setEditConfig(null);
    form.resetFields();
    form.setFieldsValue({
      isActive: true,
      protocol: 'tcp',
      maxConnections: 10,
      port: 443,
    });
    setIsModalOpen(true);
  };

  const handleEdit = (config: VPNConfig) => {
    setEditConfig(config);
    form.setFieldsValue({
      name: config.name,
      nodeId: config.nodeId,
      protocol: config.protocol,
      port: config.port,
      dns: config.dns,
      encryption: config.encryption,
      compression: config.compression,
      bandwidth: config.bandwidth,
      maxConnections: config.maxConnections,
      isActive: config.isActive,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handlePreview = (config: VPNConfig) => {
    setPreviewConfig(config);
    setPreviewModalVisible(true);
  };

  const columns = [
    {
      title: '配置ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
    },
    {
      title: '配置名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '节点',
      dataIndex: 'node',
      key: 'node',
      width: 100,
    },
    {
      title: '协议',
      dataIndex: 'protocol',
      key: 'protocol',
      render: (protocol: string) => <Tag color="blue">{protocol.toUpperCase()}</Tag>,
    },
    {
      title: '端口',
      dataIndex: 'port',
      key: 'port',
      render: (port: number) => port,
    },
    {
      title: 'DNS',
      dataIndex: 'dns',
      key: 'dns',
      render: (dns: string) => dns || '-',
    },
    {
      title: '加密',
      dataIndex: 'encryption',
      key: 'encryption',
      render: (encryption: string) => encryption || '-',
    },
    {
      title: '压缩',
      dataIndex: 'compression',
      key: 'compression',
      render: (compression: string) => compression || '-',
    },
    {
      title: '带宽',
      dataIndex: 'bandwidth',
      key: 'bandwidth',
      render: (bandwidth: number) => `${(bandwidth / 1024 / 1024).toFixed(2)} MB`,
    },
    {
      title: '连接数',
      key: 'connections',
      children: [
        {
          title: '当前',
          render: (_: any, config: VPNConfig) => `${config.currentConnections}/${config.maxConnections}`,
        },
        {
          title: '最大',
          render: (_: any, config: VPNConfig) => config.maxConnections,
        },
      ],
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => <Tag color={isActive ? 'green' : 'red'}>{isActive ? '启用' : '禁用'}</Tag>,
    },
    {
      title: '操作',
      key: 'actions',
      width: 200,
      render: (_: any, config: VPNConfig) => (
        <Space size="small">
          <Tooltip title="预览">
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => handlePreview(config)}
            />
          </Tooltip>
          <Tooltip title="编辑">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleEdit(config)}
            />
          </Tooltip>
          <Popconfirm
            title="确定要删除这个VPN配置吗？"
            onConfirm={() => handleDelete(config.id)}
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
          VPN配置管理
        </h2>
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
            className="cyber-btn-primary"
          >
            添加配置
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
        title={editConfig ? '编辑VPN配置' : '添加VPN配置'}
        open={isModalOpen}
        onOk={form.submit}
        onCancel={() => {
          setIsModalOpen(false);
          setEditConfig(null);
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
            label="配置名称"
            rules={[{ required: true, message: '请输入配置名称' }]}
          >
            <Input className="cyber-input" placeholder="例如：TCP_443_SSL" />
          </Form.Item>

          <Form.Item
            name="nodeId"
            label="节点ID"
            rules={[{ required: true, message: '请选择节点' }]}
          >
            <Select
              className="cyber-select"
              placeholder="请选择节点"
            >
              <Select.Option value="1">节点1</Select.Option>
              <Select.Option value="2">节点2</Select.Option>
              <Select.Option value="3">节点3</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="protocol"
            label="协议类型"
            rules={[{ required: true, message: '请选择协议类型' }]}
          >
            <Select
              className="cyber-select"
              placeholder="请选择协议类型"
            >
              <Select.Option value="tcp">TCP</Select.Option>
              <Select.Option value="udp">UDP</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="port"
            label="端口"
            rules={[{ required: true, message: '请输入端口' }]}
          >
            <InputNumber
              min={1}
              max={65535}
              style={{ width: '100%' }}
              className="cyber-input"
            />
          </Form.Item>

          <Form.Item
            name="dns"
            label="DNS服务器"
          >
            <Input className="cyber-input" placeholder="例如: 8.8.8.8" />
          </Form.Item>

          <Form.Item
            name="encryption"
            label="加密方式"
          >
            <Select
              className="cyber-select"
              placeholder="可选"
            >
              <Select.Option value="aes-128-gcm">AES-128-GCM</Select.Option>
              <Select.Option value="chacha20-poly1305">ChaCha20-Poly1305</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="compression"
            label="压缩方式"
          >
            <Select
              className="cyber-select"
              placeholder="可选"
            >
              <Select.Option value="none">无压缩</Select.Option>
              <Select.Option value="zstd">ZSTD</Select.Option>
              <Select.Option value="lz4">LZ4</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="bandwidth"
            label="带宽 (MB)"
            rules={[{ required: true, message: '请输入带宽' }]}
          >
            <InputNumber
              min={0}
              style={{ width: '100%' }}
              className="cyber-input"
            />
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

      <Modal
        title="VPN配置预览"
        open={previewModalVisible}
        onCancel={() => setPreviewModalVisible(false)}
        footer={null}
        className="cyber-modal"
      >
        {previewConfig && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <Space>
                <Tag color="blue">{previewConfig.protocol.toUpperCase()}</Tag>
                <Tag color="green">{previewConfig.isActive ? '启用' : '禁用'}</Tag>
              </Space>
            </div>
            <pre style={{
              backgroundColor: '#000',
              padding: '16px',
              borderRadius: '8px',
              overflow: 'auto',
              maxHeight: '400px',
              color: '#52c41a',
            }}>
{`[${previewConfig.protocol.toUpperCase()}]
server = ${previewConfig.node}
port = ${previewConfig.port}
dns = ${previewConfig.dns || '8.8.8.8'}
encryption = ${previewConfig.encryption || 'none'}
compression = ${previewConfig.compression || 'none'}
bandwidth = ${previewConfig.bandwidth} MB`}
            </pre>
          </div>
        )}
      </Modal>
    </div>
  );
}