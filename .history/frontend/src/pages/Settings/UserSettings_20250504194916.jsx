import React from 'react';
import { Typography } from 'antd';

import useLanguage from '@/locale/useLanguage';

const { Title } = Typography;

export default function UserSettings() {
  const translate = useLanguage();

  return (
    <div>
      <Title level={4}>{translate('User Management')}</Title>
      {/* User list and creation form will go here */}
      <p>{translate('User management functionality will be implemented here.')}</p>
    </div>
  );
}
