import { Typography } from 'antd';
import PageHeader from '../components/common/PageHeader';

const { Paragraph } = Typography;

function ContactPage() {
  return (
    <>
      <PageHeader title="Contact" description="Get in touch." />
      <Paragraph>This is my email address: rc.martinez@versa-global.com</Paragraph>
    </>
  );
}

export default ContactPage;
