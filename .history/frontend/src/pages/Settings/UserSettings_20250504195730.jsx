import React, { useState, useEffect } from 'react';
import { Typography, Table, Button, Spin, Alert, Tag, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

import useLanguage from '@/locale/useLanguage';
import request from '@/request'; // Import the request utility

const { Title } = Typography;

export default function UserSettings() {
  const translate = useLanguage();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // State for controlling the create modal (to be implemented)
  const [isModalVisible, setIsModalVisible] = useState(false);

  const entity = 'admin'; // Define the entity for API requests

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await request.list({ entity });
      if (response.success) {
        setUsers(response.result);
      } else {
        setError(response.message || translate('Failed to fetch users'));
      }
    } catch (err) {
      setError(translate('An error occurred while fetching users'));
      console.error("Fetch users error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []); // Fetch users on component mount

  const handleAddUser = () => {
    setIsModalVisible(true); // Open the modal (implementation pending)
    // TODO: Implement modal and form for adding a user
    console.log("Add User button clicked - Modal implementation pending.");
  };

  const columns = [
    {
      title: translate('Name'),
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => `${record.name} ${record.surname || ''}`,
    },
    {
      title: translate('Email'),
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: translate('Role'),
      dataIndex: 'role',
      key: 'role',
      render: (role) => <Tag>{role}</Tag>,
    },
    {
      title: translate('Enabled'),
      dataIndex: 'enabled',
      key: 'enabled',
      render: (enabled) => (
        <Tag color={enabled ? 'green' : 'red'}>
          {enabled ? translate('Yes') : translate('No')}
        </Tag>
      ),
    },
    // Add Actions column later (e.g., Edit, Delete)
    // {
    //   title: translate('Actions'),
    //   key: 'actions',
    //   render: (_, record) => (
    //     <Space size="middle">
    //       <a>{translate('Edit')}</a>
    //       <a>{translate('Delete')}</a>
    //     </Space>
    //   ),
    // },
  ];

  return (
    <div>
      <Title level={4}>{translate('User Management')}</Title>
      <Space style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddUser}
        >
          {translate('Add User')}
        </Button>
      </Space>

      {error && <Alert message={error} type="error" style={{ marginBottom: 16 }} />}

      {loading ? (
        <Spin />
      ) : (
        <Table
          columns={columns}
          dataSource={users}
          rowKey="_id" // Assuming MongoDB _id is the unique key
          pagination={false} // Add pagination if needed later
        />
      )}

      {/* TODO: Add Modal component here for creating users */}
      {/* <CreateUserModal visible={isModalVisible} onClose={() => setIsModalVisible(false)} onCreated={fetchUsers} /> */}
    </div>
  );
}
