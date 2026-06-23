/* eslint-disable @typescript-eslint/no-explicit-any */
import { Table, Button, Space, Tag, Input, Modal, Form, Select, Tooltip, Popconfirm, message } from 'antd';
import { useState } from 'react';
import { PlusOutlined, EditOutlined, DeleteOutlined, DashboardOutlined, ImportOutlined } from '@ant-design/icons';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { InputNumber } from 'antd';
import api from '../services/api';

interface Node {
  id: string;
  name: string;
  region: string;
  protocol: 'vless' | 'vmess' | 'trojan' | 'shadowsocks';
  address: string;
  port: number;
  uuid: string;
  security: 'reality' | 'tls' | 'none';
  sni?: string;
  encryption: string;
  fp?: string;
  type: 'tcp' | 'ws' | 'grpc';
  host?: string;
  path?: string;
  status: 'online' | 'offline' | 'maintenance';
  statusMessage?: string;
  uptime: number;
  delay: number;
  load: number;
  maxConnections: number;
  currentConnections: number;
  bandwidth: number;
  createdAt?: string;
  updatedAt?: string;
}

interface NodeFormData {
  name: string;
  region: string;
  protocol: Node['protocol'];
  address: string;
  port: number;
  uuid: string;
  security: Node['security'];
  sni?: string;
  encryption: string;
  fp?: string;
  type: Node['type'];
  host?: string;
  path?: string;
  status: Node['status'];
  maxConnections: number;
}

const toNumber = (value: unknown, fallback = 0): number => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

const getNodes = (payload: any): Node[] => {
  if (Array.isArray(payload)) {
    return payload;
  }
  if (Array.isArray(payload?.data)) {
    return payload.data;
  }
  return [];
};

const getHealthData = (payload: any) => payload?.data || payload;

const getDefaultNodeValues = (): Partial<NodeFormData> => ({
  protocol: 'vless',
  port: 443,
  security: 'tls',
  encryption: 'none',
  type: 'ws',
  status: 'online',
  maxConnections: 10,
});

const getRawQueryValue = (query: string, key: string): string | undefined => {
  const pairs = query.replace(/^\?/, '').split('&').filter(Boolean);
  const pair = pairs.find((item) => item.split('=')[0] === key);
  return pair?.split('=').slice(1).join('=');
};

const normalizeNodeProtocol = (protocol: string): Node['protocol'] => {
  const value = protocol.replace(':', '').toLowerCase();
  if (['vless', 'vmess', 'trojan', 'shadowsocks'].includes(value)) {
    return value as Node['protocol'];
  }
  throw new Error(`暂不支持 ${value || '未知'} 协议`);
};

const normalizeNodeSecurity = (security: string | null): Node['security'] => {
  const value = (security || 'none').toLowerCase();
  return ['reality', 'tls', 'none'].includes(value) ? value as Node['security'] : 'none';
};

const normalizeNodeType = (type: string | null): Node['type'] => {
  const value = (type || 'tcp').toLowerCase();
  return ['tcp', 'ws', 'grpc'].includes(value) ? value as Node['type'] : 'tcp';
};

const parseNodeUrl = (value: string): NodeFormData => {
  const trimmedValue = value.trim();
  if (!trimmedValue) {
    throw new Error('剪切板内容为空');
  }

  const parsedUrl = new URL(trimmedValue);
  const protocol = normalizeNodeProtocol(parsedUrl.protocol);
  const port = Number(parsedUrl.port);

  if (!parsedUrl.username || !parsedUrl.hostname || !Number.isInteger(port)) {
    throw new Error('节点链接缺少 UUID、地址或端口');
  }

  const params = parsedUrl.searchParams;
  const name = decodeURIComponent(parsedUrl.hash.replace(/^#/, '')) || parsedUrl.hostname;

  return {
    ...getDefaultNodeValues(),
    name,
    region: 'Imported',
    protocol,
    uuid: parsedUrl.username,
    address: parsedUrl.hostname,
    port,
    encryption: params.get('encryption') || 'none',
    security: normalizeNodeSecurity(params.get('security')),
    sni: params.get('sni') || undefined,
    fp: params.get('fp') || undefined,
    type: normalizeNodeType(params.get('type')),
    host: params.get('host') || undefined,
    path: getRawQueryValue(parsedUrl.search, 'path') || params.get('path') || undefined,
    status: 'online',
    maxConnections: 10,
  };
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

  const importMutation = useMutation({
    mutationFn: (values: NodeFormData) => api.post('/nodes', values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nodes'] });
      message.success('节点已从剪切板导入');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || error.message || '节点导入失败');
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
      setHealthData(getHealthData(data));
      setIsHealthModalOpen(true);
    },
  });

  const [healthData, setHealthData] = useState<any>(null);

  const handleAdd = () => {
    setEditNode(null);
    form.resetFields();
    form.setFieldsValue(getDefaultNodeValues());
    setIsModalOpen(true);
  };

  const handleEdit = (node: Node) => {
    setEditNode(node);
    form.setFieldsValue({
      name: node.name,
      region: node.region,
      protocol: node.protocol,
      address: node.address,
      port: node.port,
      uuid: node.uuid,
      security: node.security,
      sni: node.sni,
      encryption: node.encryption,
      fp: node.fp,
      type: node.type,
      host: node.host,
      path: node.path,
      status: node.status,
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

  const handleImportFromClipboard = async () => {
    try {
      if (!navigator.clipboard?.readText) {
        throw new Error('当前浏览器不支持读取剪切板');
      }

      const clipboardText = await navigator.clipboard.readText();
      const nodeData = parseNodeUrl(clipboardText);
      importMutation.mutate(nodeData);
    } catch (error: any) {
      message.error(error.message || '无法解析剪切板节点信息');
    }
  };

  const columns = [
    {
      title: '节点ID',
      dataIndex: 'id',
      key: 'id',
      width: 220,
      ellipsis: true,
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
      title: '协议',
      dataIndex: 'protocol',
      key: 'protocol',
      render: (protocol: string) => <Tag color="blue">{protocol?.toUpperCase()}</Tag>,
    },
    {
      title: '传输',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => <Tag color="purple">{type?.toUpperCase()}</Tag>,
    },
    {
      title: '安全',
      dataIndex: 'security',
      key: 'security',
      render: (security: string) => <Tag color={security === 'none' ? 'default' : 'gold'}>{security}</Tag>,
    },
    {
      title: '服务器',
      key: 'server',
      render: (_: any, node: Node) => (
        <Tooltip title={`${node.address}:${node.port}`}>
          <span>{node.address}:{node.port}</span>
        </Tooltip>
      ),
    },
    {
      title: 'SNI / Host',
      key: 'host',
      render: (_: any, node: Node) => node.sni || node.host || '-',
    },
    {
      title: '延迟',
      dataIndex: 'delay',
      key: 'delay',
      render: (delay: number | string) => `${toNumber(delay)} ms`,
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
          <Button
            type="default"
            icon={<ImportOutlined />}
            onClick={handleImportFromClipboard}
            loading={importMutation.isPending}
            className="cyber-btn-secondary"
          >
            从剪切板导入
          </Button>
        </Space>
      </div>

      <div className="cyber-table">
        <Table
          columns={columns}
          dataSource={getNodes(data)}
          rowKey="id"
          loading={isLoading}
          scroll={{ x: 1300 }}
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
        width={720}
        styles={{ body: { maxHeight: '70vh', overflowY: 'auto' } }}
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
            rules={[{ required: true, message: '请输入区域' }]}
          >
            <Input className="cyber-input" placeholder="例如: Hong Kong" />
          </Form.Item>

          <Form.Item
            name="protocol"
            label="协议"
            rules={[{ required: true, message: '请选择协议' }]}
          >
            <Select className="cyber-select" placeholder="请选择协议">
              <Select.Option value="vless">VLESS</Select.Option>
              <Select.Option value="vmess">VMess</Select.Option>
              <Select.Option value="trojan">Trojan</Select.Option>
              <Select.Option value="shadowsocks">Shadowsocks</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="address"
            label="服务器地址"
            rules={[{ required: true, message: '请输入服务器地址' }]}
          >
            <Input className="cyber-input" placeholder="例如: hk-01.example.com 或 1.1.1.1" />
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
              placeholder="例如: 443"
            />
          </Form.Item>

          <Form.Item
            name="uuid"
            label="UUID"
            rules={[{ required: true, message: '请输入UUID' }]}
          >
            <Input className="cyber-input" placeholder="例如: ed1e0621-5024-4de9-8673-d8bc2a4fd197" />
          </Form.Item>

          <Form.Item
            name="security"
            label="安全类型"
            rules={[{ required: true, message: '请选择安全类型' }]}
          >
            <Select className="cyber-select" placeholder="请选择安全类型">
              <Select.Option value="tls">TLS</Select.Option>
              <Select.Option value="reality">Reality</Select.Option>
              <Select.Option value="none">None</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="encryption"
            label="加密方式"
            rules={[{ required: true, message: '请输入加密方式' }]}
          >
            <Input className="cyber-input" placeholder="例如: none" />
          </Form.Item>

          <Form.Item
            name="type"
            label="传输类型"
            rules={[{ required: true, message: '请选择传输类型' }]}
          >
            <Select className="cyber-select" placeholder="请选择传输类型">
              <Select.Option value="tcp">TCP</Select.Option>
              <Select.Option value="ws">WebSocket</Select.Option>
              <Select.Option value="grpc">gRPC</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="sni"
            label="SNI"
          >
            <Input className="cyber-input" placeholder="可选，例如: dpdns.org" />
          </Form.Item>

          <Form.Item
            name="fp"
            label="指纹"
          >
            <Input className="cyber-input" placeholder="可选，例如: chrome" />
          </Form.Item>

          <Form.Item
            name="host"
            label="Host"
          >
            <Input className="cyber-input" placeholder="可选，例如: dpdns.org" />
          </Form.Item>

          <Form.Item
            name="path"
            label="Path"
          >
            <Input className="cyber-input" placeholder="可选，例如: /proxyip=156.154.245.83" />
          </Form.Item>

          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select className="cyber-select" placeholder="请选择状态">
              <Select.Option value="online">在线</Select.Option>
              <Select.Option value="offline">离线</Select.Option>
              <Select.Option value="maintenance">维护中</Select.Option>
            </Select>
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
        width={760}
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
                title: '协议',
                dataIndex: 'protocol',
                key: 'protocol',
                render: (protocol: string) => protocol?.toUpperCase() || '-',
              },
              {
                title: '服务器',
                key: 'server',
                render: (_: any, node: Node) => `${node.address}:${node.port}`,
              },
              {
                title: '状态',
                dataIndex: 'status',
                key: 'status',
                render: (status: string) => (
                  <Tag color={status === 'online' ? 'green' : status === 'maintenance' ? 'orange' : 'red'}>
                    {status === 'online' ? '在线' : status === 'maintenance' ? '维护中' : '离线'}
                  </Tag>
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
