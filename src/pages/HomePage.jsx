import { Typography } from 'antd';
import PageHeader from '../components/common/PageHeader';

const { Paragraph } = Typography;

function HomePage() {
  return (
    <>
      <PageHeader
        title="Welcome to Carlo's Website"
        description="WEEK 3 — React Fundamentals + UI Libraries"
      />
      <Paragraph>
      Week 3 marks a major shift in the learner’s transition from QA to full‑fledged development. After years of analyzing systems, debugging issues, and building automation scripts, 
      the focus now shifts to building user interfaces with React.
      </Paragraph>
    </>
  );
}

export default HomePage;
