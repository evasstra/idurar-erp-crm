import { Form, Input } from 'antd';
import { validatePhoneNumber } from '@/utils/helpers';
import useLanguage from '@/locale/useLanguage';
import GeocodingNotification from '@/components/GeocodingNotification';

export default function CustomerForm({ isUpdateForm = false }) {
  const translate = useLanguage();
  const validateEmptyString = (_, value) => {
    if (value && value.trim() === '') {
      return Promise.reject(new Error('Field cannot be empty'));
    }

    return Promise.resolve();
  };

  return (
    <div style={{ border: '2px solid red', padding: '10px' }}> {/* Debugging border */}
      <GeocodingNotification />
      <Form.Item
        label={translate('company')}
        name="company"
        rules={[
          {
            required: true,
          },
          {
            validator: validateEmptyString,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={translate('Manager first Name')}
        name="managerName"
        rules={[
          {
            required: true,
          },
          {
            validator: validateEmptyString,
          },
        ]}
        style={{
          display: 'inline-block',
          width: 'calc(50%)',
          paddingRight: '5px',
        }}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={translate('Manager Last Name')}
        name="managerSurname"
        rules={[
          {
            required: true,
          },
          {
            validator: validateEmptyString,
          },
        ]}
        style={{
          display: 'inline-block',
          width: 'calc(50%)',
          paddingLeft: '5px',
        }}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="phone"
        label={translate('Phone')}
        rules={[
          {
            required: true,
          },
          {
            validator: validateEmptyString,
          },
          {
            pattern: validatePhoneNumber,
            message: 'Please enter a valid phone number',
          },
        ]}
      >
        <Input />
      </Form.Item>
      
      <Form.Item
        label={translate('Latitude')}
        name="latitude"
        rules={[
          {
            pattern: /^-?([1-8]?[0-9]\.\d+|90\.0+)$/,
            message: 'Invalid latitude value (-90 to 90)'
          }
        ]}
        style={{
          display: 'inline-block',
          width: 'calc(50%)',
          paddingRight: '5px',
        }}
      >
        <Input placeholder="e.g., 37.7749" />
      </Form.Item>
      
      <Form.Item
        label={translate('Longitude')}
        name="longitude"
        rules={[
          {
            pattern: /^-?((1[0-7]|[1-9])?\d(\.\d+)?|180\.0+)$/,
            message: 'Invalid longitude value (-180 to 180)'
          }
        ]}
        style={{
          display: 'inline-block',
          width: 'calc(50%)',
          paddingLeft: '5px',
        }}
      >
        <Input placeholder="e.g., -122.4194" />
      </Form.Item>

      <Form.Item
        name="email"
        label={translate('email')}
        rules={[
          {
            type: 'email',
          },
          {
            required: true,
          },
          {
            validator: validateEmptyString,
          },
        ]}
      >
        <Input />
      </Form.Item>
    </div>
  );
}
