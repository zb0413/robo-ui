import React, { useState, useEffect } from 'react';
import { Layout, Typography, Row, Col, Card, Statistic, Table, Button, ConfigProvider, theme } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Image, Video, Music, FileText, File, HardDrive, Clock, Sun, Moon } from 'lucide-react';
import api from './api';
import ResourceDetailModal from './components/ResourceDetailModal';

const { Header, Content } = Layout;
const { Title } = Typography;
const { defaultAlgorithm, darkAlgorithm } = theme;

interface MaterialCounts {
  images: number;
  videos: number;
  audio: number;
  text: number;
  other: number;
}

interface TrendData {
  name: string;
  images: number;
  videos: number;
  audio: number;
  text: number;
  other: number;
}

interface ResourceData {
  key: string;
  name: string;
  images: number;
  videos: number;
  audio: number;
  text: number;
  other: number;
  videoDuration: string;
  diskUsage: string;
}

const columns = [
  {
    title: '项目名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '图片',
    dataIndex: 'images',
    key: 'images',
  },
  {
    title: '视频',
    dataIndex: 'videos',
    key: 'videos',
  },
  {
    title: '音频',
    dataIndex: 'audio',
    key: 'audio',
  },
  {
    title: '文本',
    dataIndex: 'text',
    key: 'text',
  },
  {
    title: '其他',
    dataIndex: 'other',
    key: 'other',
  },
  {
    title: '视频时长',
    dataIndex: 'videoDuration',
    key: 'videoDuration',
  },
  {
    title: '磁盘占用',
    dataIndex: 'diskUsage',
    key: 'diskUsage',
  },
];

function App() {
  const [materialCounts, setMaterialCounts] = useState<MaterialCounts | null>(null);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [resourceListData, setResourceListData] = useState<ResourceData[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [countsResponse, trendResponse, resourceResponse] = await Promise.all([
          api.getMaterialCounts(),
          api.getTrendData(),
          api.getResourceList()
        ]);
        setMaterialCounts(countsResponse.data);
        setTrendData(trendResponse.data);
        setResourceListData(resourceResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const onRowClick = (record: any) => ({
    onClick: () => {
      setSelectedResourceId(record.key);
    },
  });

  if (!materialCounts) {
    return <div>Loading...</div>;
  }

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
        token: {
          colorPrimary: isDarkMode ? '#177ddc' : '#1890ff',
        },
      }}
    >
      <Layout className="min-h-screen">
        <Header className={`flex justify-between items-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <Title level={3} className={`py-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>素材管理仪表板</Title>
          <Button
            icon={isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            onClick={toggleTheme}
            className="mr-4"
          >
            {isDarkMode ? '亮色模式' : '暗色模式'}
          </Button>
        </Header>
        <Content className="p-6">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8} lg={4}>
              <Card>
                <Statistic
                  title="图片"
                  value={materialCounts.images}
                  prefix={<Image size={24} />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={4}>
              <Card>
                <Statistic
                  title="视频"
                  value={materialCounts.videos}
                  prefix={<Video size={24} />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={4}>
              <Card>
                <Statistic
                  title="音频"
                  value={materialCounts.audio}
                  prefix={<Music size={24} />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={4}>
              <Card>
                <Statistic
                  title="文本"
                  value={materialCounts.text}
                  prefix={<FileText size={24} />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={4}>
              <Card>
                <Statistic
                  title="其他"
                  value={materialCounts.other}
                  prefix={<File size={24} />}
                />
              </Card>
            </Col>
          </Row>
          <Card className="mt-6">
            <Title level={4}>近7天变化趋势</Title>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="images" stroke="#8884d8" />
                <Line type="monotone" dataKey="videos" stroke="#82ca9d" />
                <Line type="monotone" dataKey="audio" stroke="#ffc658" />
                <Line type="monotone" dataKey="text" stroke="#ff7300" />
                <Line type="monotone" dataKey="other" stroke="#a4de6c" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
          <Card className="mt-6">
            <Title level={4}>资源列表</Title>
            <Table 
              columns={columns} 
              dataSource={resourceListData} 
              onRow={onRowClick}
            />
          </Card>
        </Content>
      </Layout>
      <ResourceDetailModal
        resourceId={selectedResourceId}
        onClose={() => setSelectedResourceId(null)}
      />
    </ConfigProvider>
  );
}

export default App;