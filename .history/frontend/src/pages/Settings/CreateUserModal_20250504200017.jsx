import React, { useState } from 'react';
import { Modal, Form, Button, Alert } from 'antd';
import useLanguage from '@/locale/useLanguage';
import request from '@/request'; // Import the request utility
import UserForm from '@/forms/UserForm'; // Import the UserForm

const CreateUserModal = ({ visible, onClose, onCreated }) => {
  const translate = useLanguage();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const entity = 'admin'; // Define the entity for API requests

  const handleOk = async () => {
    setError(null);
    try {
      const values = await form.validateFields();
      setLoading(true);

      // Exclude confirmPassword before sending to backend
      const { confirmPassword, ...userData } = values;

      const response = await request.create({ entity, jsonData: userData });

      if (response.success) {
        form.resetFields();
        onCreated(); // Callback to refresh the user list
        onClose(); // Close the modal
        // Success notification is handled by request.js successHandler
      } else {
        setError(response.message || translate('Failed to create user'));
        // Error notification is handled by request.js errorHandler/successHandler
      }
    } catch (errInfo) {
      // Form validation failed
      console.log('Validate Failed:', errInfo);
      setError(translate('Please check the form fields for errors.'));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (!loading) {
      form.resetFields();
      setError(null);
      onClose();
    }
  };

  return (
    <Modal
      title={translate('Create New User')}
      visible={visible}
      onCancel={handleCancel}
      confirmLoading={loading}
      footer={[
        <Button key="back" onClick={handleCancel} disabled={loading}>
          {translate('Cancel')}
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
          {translate('Create')}
        </Button>,
      ]}
      destroyOnClose={true} // Reset form state when modal is closed
    >
      {error && <Alert message={error} type="error" style={{ marginBottom: 24 }} showIcon />}
      <UserForm form={form} />
    </Modal>
  );
};

export default CreateUserModal;
