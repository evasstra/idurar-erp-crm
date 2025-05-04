import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Alert, Input, Select } from 'antd';
import useLanguage from '@/locale/useLanguage';
import { request } from '@/request'; // Use named import

const { Option } = Select;

const EditUserModal = ({ visible, onClose, onUpdated, user }) => {
  const translate = useLanguage();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const entity = 'admin'; // Define the entity for API requests
  const roles = ['admin', 'staff']; // Define available roles (excluding 'owner')

  // Pre-fill form when the modal becomes visible and user data is available
  useEffect(() => {
    if (user && visible) {
      form.setFieldsValue({
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
        enabled: user.enabled, // Include enabled status if you want to edit it
      });
    } else {
      form.resetFields(); // Reset fields if no user or modal not visible
    }
  }, [user, visible, form]);

  const handleOk = async () => {
    setError(null);
    if (!user) {
      setError(translate('No user selected for editing.'));
      return;
    }

    try {
      const values = await form.validateFields();
      setLoading(true);

      // Only send fields that are allowed to be updated
      const updateData = {
        name: values.name,
        surname: values.surname,
        email: values.email,
        role: values.role,
        enabled: values.enabled, // Include enabled status if editable
      };

      // Prevent trying to change the owner's role
      if (user.role === 'owner' && values.role !== 'owner') {
         setError(translate("Cannot change the role of the 'owner' user."));
         setLoading(false);
         return;
      }

      const response = await request.update({ entity, id: user._id, jsonData: updateData });

      if (response.success) {
        onUpdated(); // Callback to refresh the user list
        onClose(); // Close the modal
        // Success notification handled by request.js
      } else {
        setError(response.message || translate('Failed to update user'));
        // Error notification handled by request.js
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
      setError(null);
      onClose(); // Don't reset fields here, useEffect handles it
    }
  };

  // Disable role selection if the user being edited is the 'owner'
  const isOwner = user?.role === 'owner';

  return (
    <Modal
      title={translate('Edit User')}
      visible={visible}
      onCancel={handleCancel}
      confirmLoading={loading}
      footer={[
        <Button key="back" onClick={handleCancel} disabled={loading}>
          {translate('Cancel')}
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
          {translate('Update')}
        </Button>,
      ]}
      destroyOnClose={true} // Reset form state when modal is closed (handled by useEffect too)
    >
      {error && <Alert message={error} type="error" style={{ marginBottom: 24 }} showIcon />}
      <Form form={form} layout="vertical" name="edit_user_form">
        <Form.Item
          name="name"
          label={translate('Name')}
          rules={[{ required: true, message: translate('Please input the name!') }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="surname"
          label={translate('Surname')}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label={translate('Email')}
          rules={[
            { required: true, message: translate('Please input the email!') },
            { type: 'email', message: translate('The input is not valid E-mail!') },
          ]}
        >
          <Input />
        </Form.Item>
         <Form.Item
          name="role"
          label={translate('Role')}
          rules={[{ required: true, message: translate('Please select a role!') }]}
        >
          <Select disabled={isOwner}> {/* Disable role change for owner */}
            {isOwner ? (
              <Option key="owner" value="owner">{translate('owner')}</Option>
            ) : (
              roles.map((role) => (
                <Option key={role} value={role}>
                  {translate(role)}
                </Option>
              ))
            )}
          </Select>
        </Form.Item>
        <Form.Item
          name="enabled"
          label={translate('Enabled')}
          valuePropName="checked" // Use valuePropName for Switch/Checkbox
        >
           <Select>
             <Option value={true}>{translate('Yes')}</Option>
             <Option value={false}>{translate('No')}</Option>
           </Select>
        </Form.Item>
        {/* Password fields are intentionally omitted */}
      </Form>
    </Modal>
  );
};

export default EditUserModal;
