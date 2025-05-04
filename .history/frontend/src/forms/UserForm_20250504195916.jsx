import React from 'react';
import { Form, Input, Select } from 'antd';
import useLanguage from '@/locale/useLanguage';

const { Option } = Select;

const UserForm = ({ form }) => {
  const translate = useLanguage();

  const roles = ['admin', 'staff']; // Define available roles (excluding 'owner')

  return (
    <Form form={form} layout="vertical" name="user_form">
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
        // Surname is optional based on the backend model
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
        name="password"
        label={translate('Password')}
        rules={[{ required: true, message: translate('Please input the password!') }]}
        hasFeedback
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        name="confirmPassword" // Add confirm password field
        label={translate('Confirm Password')}
        dependencies={['password']}
        hasFeedback
        rules={[
          { required: true, message: translate('Please confirm your password!') },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error(translate('The two passwords that you entered do not match!')));
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        name="role"
        label={translate('Role')}
        rules={[{ required: true, message: translate('Please select a role!') }]}
      >
        <Select>
          {roles.map((role) => (
            <Option key={role} value={role}>
              {translate(role)} {/* Assuming roles can be translated */}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </Form>
  );
};

export default UserForm;
