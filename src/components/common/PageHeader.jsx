import { Typography } from 'antd';

const { Title, Text } = Typography;

function PageHeader({ title, description }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <Title level={2}>{title}</Title>
      {description && <Text type="secondary">{description}</Text>}
    </div>
  );
}

export default PageHeader;
