import { Table, Tag, Input, Select, DatePicker, Space, Button } from 'antd';
import { useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';

export default function Logs() {
  const [searchText, setSearchText] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[Date, Date] | null>(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  const { data, isLoading } = useQuery({
    queryKey: ['logs', pagination.current, pagination.pageSize, searchText, levelFilter, dateRange],
    queryFn: () => api.get(`/logs?page=${pagination.current}&limit=${pagination.pageSize}&search=${searchText}&level=${levelFilter}&dateFrom=${dateRange?.[0]?.toISOString()}&dateTo=${dateRange?.[1]?.toISOString()}`),
  });

  const columns = [
    {
      title: '日志ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '级别',
      dataIndex: 'level',
      key: 'level',
      render: (level: string) => (
        <Tag color={level === 'error' ? 'red' : level === 'warning' ? 'orange' : 'green'}>
          {level.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: '消息',
      dataIndex: 'message',
      key: 'message',
      ellipsis: true,
    },
    {
      title: 'IP地址',
      dataIndex: 'ip',
      key: 'ip',
    },
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp: string) => new Date(timestamp).toLocaleString(),
    },
  ];

  return (
    <div>
      <h2 style={{
        color: '#ffffff',
        margin: '0 0 16px 0',
      }}>
        系统日志
      </h2>
      <Space style={{ marginBottom: 16 }}>
        <Input
          className="cyber-input"
          placeholder="搜索日志消息"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        <Select
          className="cyber-select"
          value={levelFilter}
          onChange={setLevelFilter}
          style={{ width: 150 }}
        >
          <Select.Option value="all">全部级别</Select.Option>
          <Select.Option value="info">INFO</Select.Option>
          <Select.Option value="warning">WARNING</Select.Option>
          <Select.Option value="error">ERROR</Select.Option>
        </Select>
        <DatePicker.RangePicker className="cyber-picker" value={dateRange} onChange={setDateRange} />
        <Button type="primary" className="cyber-btn-primary">
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
    </div>
  );
}