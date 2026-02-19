import { Card } from 'antd';

function FormCard({ title, children, ...rest }) {
  return (
    <Card title={title} style={{ marginBottom: 24 }} {...rest}>
      {children}
    </Card>
  );
}

export default FormCard;
