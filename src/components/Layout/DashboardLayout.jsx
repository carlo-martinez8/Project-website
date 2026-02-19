import { useState } from 'react';
import { Layout } from 'antd';
import Sidebar from './Sidebar';

const { Content } = Layout;

function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar collapsed={collapsed} onCollapsedChange={setCollapsed} />
      <Layout style={{ marginLeft: collapsed ? 0 : 200 }}>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: '#fff',
            borderRadius: 8,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}

export default DashboardLayout;
