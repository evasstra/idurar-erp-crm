import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Table, Button, Spin, Alert, Tag, Space } from 'antd';
import { PlusOutlined, EditOutlined } from '@ant-design/icons'; // Add EditOutlined
import { useSelector } from 'react-redux'; // Import useSelector

import useLanguage from '@/locale/useLanguage';
import { request } from '@/request';
import CreateUserModal from './CreateUserModal';
import EditUserModal from './EditUserModal'; // Import EditUserModal
import { selectCurrentAdmin } from '@/redux/auth/selectors'; // Import selector

const { Title } = Typography;

export default function UserSettings() {
  const translate = useLanguage();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // State for controlling the create modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  // State for controlling the edit modal
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const entity = 'admin'; // Define the entity for API requests
  const currentAdmin = useSelector(selectCurrentAdmin); // Get logged-in user data
  const loggedInUserRole = currentAdmin?.role; // Get role

  // Wrap fetchUsers in useCallback
  const fetchUsers = useCallback(async () => {
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
  }, [translate]); // Add translate as a dependency for useCallback

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]); // Add fetchUsers to the dependency array

  const handleAddUser = () => {
    setIsModalVisible(true); // Open the create modal
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsEditModalVisible(true);
    // TODO: Implement EditUserModal - This comment is now obsolete
    // console.log("Edit User button clicked for:", user);
  };

  const handleCloseEditModal = () => {
    setIsEditModalVisible(false);
    setEditingUser(null);
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
    // Add Actions column
    {
      title: translate('Actions'),
      key: 'actions',
      render: (_, record) => {
        // Only show Edit button for admin/owner roles
        const canEdit = loggedInUserRole === 'admin' || loggedInUserRole === 'owner';
        if (!canEdit) return null;

        // Prevent editing the owner user? (Optional, consider implications)
        // if (record.role === 'owner') return null;

        return (
          <Space size="middle">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleEditUser(record)}
              style={{ padding: 0 }} // Adjust padding for link button
            >
              {translate('Edit')}
            </Button>
            {/* Add Delete button later if needed */}
          </Space>
        );
      },
    },
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

      {/* Render the Create User Modal */}
      <CreateUserModal
        visible={isModalVisible}
        onClose={handleCloseModal}
        onCreated={fetchUsers} // Pass fetchUsers to refresh list after creation
      />

      {/* Render the Edit User Modal */}
      <EditUserModal
        visible={isEditModalVisible}
        onClose={handleCloseEditModal}
        onUpdated={fetchUsers} // Pass fetchUsers to refresh list after update
        user={editingUser} // Pass the user being edited
      />
    </div>
  );
}
