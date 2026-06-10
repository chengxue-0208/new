import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, message, Space, Tag, Switch } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { nodeApi, Node, NodeCreateData } from '../api';

const { Option } = Select;

const NodeManagement: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingNode, setEditingNode] = useState<Node | null>(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'offline'>('all');

  const fetchNodes = async () => {
    setLoading(true);
    try {
      const data = await nodeApi.getAll();
      setNodes(data);
    } catch (error) {
      message.error('Failed to fetch nodes');
      console.error('Fetch nodes error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNodes();
  }, []);

  const handleCreate = () => {
    setEditingNode(null);
    form.resetFields();
    form.setFieldsValue({
      status: 'online',
      delay: 0,
      isFree: false,
    });
    setModalVisible(true);
  };

  const handleEdit = async (record: Node) => {
    try {
      const node = await nodeApi.getById(record.id);
      setEditingNode(node);
      form.setFieldsValue(node);
      setModalVisible(true);
    } catch (error) {
      message.error('Failed to fetch node details');
    }
  };

  const handleDelete = async (record: Node) => {
    Modal.confirm({
      title: 'Confirm Delete',
      content: `Are you sure you want to delete node "${record.name}"?`,
      okText: 'Yes',
      cancelText: 'No',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await nodeApi.delete(record.id);
          message.success('Node deleted successfully');
          fetchNodes();
        } catch (error) {
          message.error('Failed to delete node');
        }
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();

      if (editingNode) {
        await nodeApi.update(editingNode.id, values);
        message.success('Node updated successfully');
      } else {
        await nodeApi.create(values);
        message.success('Node created successfully');
      }

      setModalVisible(false);
      fetchNodes();
    } catch (error) {
      if (error instanceof Error && error.message.includes('Failed to fetch')) {
        message.error('Authentication failed. Please login again.');
      } else {
        message.error('Operation failed');
      }
    }
  };

  const handleModalCancel = () => {
    setModalVisible(false);
  };

  const filteredNodes = nodes.filter(node => {
    const matchesSearch = node.name.toLowerCase().includes(searchText.toLowerCase()) ||
                         node.region.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === 'all' || node.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      searchable: true,
    },
    {
      title: 'Region',
      dataIndex: 'region',
      key: 'region',
      searchable: true,
    },
    {
      title: 'Protocol',
      dataIndex: 'protocol',
      key: 'protocol',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      ellipsis: true,
    },
    {
      title: 'Port',
      dataIndex: 'port',
      key: 'port',
    },
    {
      title: 'Server Name',
      dataIndex: 'serverName',
      key: 'serverName',
      ellipsis: true,
      render: (text) => text || '-',
    },
    {
      title: 'Path',
      dataIndex: 'path',
      key: 'path',
      ellipsis: true,
      render: (text) => text || '-',
    },
    {
      title: 'Delay (ms)',
      dataIndex: 'delay',
      key: 'delay',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        status === 'online' ? (
          <Tag icon={<CheckCircleOutlined />} color="success">
            {status}
          </Tag>
        ) : (
          <Tag icon={<CloseCircleOutlined />} color="error">
            {status}
          </Tag>
        )
      ),
    },
    {
      title: 'Type',
      dataIndex: 'isFree',
      key: 'isFree',
      render: (isFree: boolean) => (
        <Tag color={isFree ? 'default' : 'blue'}>
          {isFree ? 'Free' : 'Paid'}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Node) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>Node Management</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
        >
          Create Node
        </Button>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <Space>
          <Input
            placeholder="Search by name or region..."
            style={{ width: 300 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 120 }}
          >
            <Option value="all">All Status</Option>
            <Option value="online">Online</Option>
            <Option value="offline">Offline</Option>
          </Select>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={filteredNodes}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 20,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} nodes`,
        }}
      />

      <Modal
        title={editingNode ? 'Edit Node' : 'Create Node'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={600}
        okText={editingNode ? 'Update' : 'Create'}
        cancelText="Cancel"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            status: 'online',
            delay: 0,
            isFree: false,
          }}
        >
          <Form.Item
            label="Node Name"
            name="name"
            rules={[{ required: true, message: 'Please enter node name' }]}
          >
            <Input placeholder="Enter node name" />
          </Form.Item>

          <Form.Item
            label="Region"
            name="region"
            rules={[{ required: true, message: 'Please enter region' }]}
          >
            <Input placeholder="e.g., Hong Kong, US, Japan" />
          </Form.Item>

          <Form.Item
            label="Protocol"
            name="protocol"
            rules={[{ required: true, message: 'Please select protocol' }]}
          >
            <Select placeholder="Select protocol">
              <Option value="WireGuard">WireGuard</Option>
              <Option value="OpenVPN">OpenVPN</Option>
              <Option value="IKEv2">IKEv2</Option>
              <Option value="L2TP">L2TP</Option>
              <Option value="SoftEther">SoftEther</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Address"
            name="address"
            rules={[{ required: true, message: 'Please enter address' }]}
          >
            <Input placeholder="e.g., 192.168.1.100 or vpn.example.com" />
          </Form.Item>

          <Form.Item
            label="Port"
            name="port"
            rules={[
              { required: true, message: 'Please enter port' },
              { type: 'number', min: 1, max: 65535, message: 'Port must be between 1 and 65535' }
            ]}
          >
            <InputNumber placeholder="e.g., 443" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Server Name"
            name="serverName"
            extra="Optional: Server hostname"
          >
            <Input placeholder="e.g., vpn-server-01" />
          </Form.Item>

          <Form.Item
            label="Path"
            name="path"
            extra="Required for WireGuard configuration"
          >
            <Input placeholder="e.g., /etc/wireguard/wg0.conf" />
          </Form.Item>

          <Form.Item
            label="Initial Delay (ms)"
            name="delay"
            extra="Initial ping delay in milliseconds"
          >
            <InputNumber placeholder="e.g., 50" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
          >
            <Select placeholder="Select initial status">
              <Option value="online">Online</Option>
              <Option value="offline">Offline</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Free Node"
            name="isFree"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default NodeManagement;