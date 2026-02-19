import { Typography } from 'antd';
import PageHeader from '../components/common/PageHeader';

const { Paragraph } = Typography;

function AboutPage() {
  return (
    <>
      <PageHeader title="About" description="Learn more about Carlo's Website." />
      <Paragraph>I am a SQA Automation Analyst at Versa Innovations Corp. that is transisioning to a new role as a Full Stack Developer.</Paragraph>
    </>
  );
}

export default AboutPage;
