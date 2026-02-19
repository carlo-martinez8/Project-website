import { Layout, Menu } from 'antd';
import {
  HomeOutlined,
  InboxOutlined,
  InfoCircleOutlined,
  MailOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';

const { Sider } = Layout;

const menuItems = [
  { key: '/', icon: <HomeOutlined />, label: 'Home' },
  { key: '/inventory', icon: <InboxOutlined />, label: 'Inventory' },
  { key: '/about', icon: <InfoCircleOutlined />, label: 'About' },
  { key: '/contact', icon: <MailOutlined />, label: 'Contact' },
];

function Sidebar({ collapsed = false, onCollapsedChange }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(c) => onCollapsedChange?.(c)}
      onBreakpoint={(broken) => onCollapsedChange?.(broken)}
      breakpoint="lg"
      collapsedWidth="0"
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          height: 64,
          margin: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: 18,
          fontWeight: 600,
        }}
      >
        Carlo's Website
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
      />
    </Sider>
  );
}

export default Sidebar;
