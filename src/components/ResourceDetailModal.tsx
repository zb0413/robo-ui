import React, { useEffect, useState } from 'react';
import { Modal, Descriptions, Tag, Spin, Typography, Tabs, Table, Image as AntImage } from 'antd';
import { Image, Video, Music, FileText, File } from 'lucide-react';
import api from '../api';

const { Title } = Typography;
const { TabPane } = Tabs;

interface ResourceDetailModalProps {
  resourceId: string | null;
  onClose: () => void;
}

interface ResourceItem {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  size: string;
  type: string;
  format: string;
  thumbnail?: string;
  width?: number;
  height?: number;
  duration?: string;
  resolution?: string;
  bitrate?: string;
  wordCount?: number;
  pageCount?: number;
  items: {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    size: string;
    format?: string;
    thumbnail?: string;
    width?: number;
    height?: number;
    duration?: string;
    resolution?: string;
    bitrate?: string;
    wordCount?: number;
    pageCount?: number;
  }[];
}

interface ResourceDetail {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  tags: string[];
  summary: {
    images: {
      count: number;
      formats: string[];
      totalSize: string;
    };
    videos: {
      count: number;
      formats: string[];
      totalDuration: string;
      totalSize: string;
    };
    audio: {
      count: number;
      formats: string[];
      totalDuration: string;
      totalSize: string;
    };
    text: {
      count: number;
      formats: string[];
      totalSize: string;
    };
    other: {
      count: number;
      formats: string[];
      totalSize: string;
    };
  };
  resources: {
    images: ResourceItem[];
    videos: ResourceItem[];
    audio: ResourceItem[];
    text: ResourceItem[];
    other: ResourceItem[];
  };
}

const ResourceDetailModal: React.FC<ResourceDetailModalProps> = ({ resourceId, onClose }) => {
  const [detail, setDetail] = useState<ResourceDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('summary');

  useEffect(() => {
    const fetchDetail = async () => {
      if (!resourceId) return;
      
      setLoading(true);
      try {
        const response = await api.getResourceDetail(resourceId);
        setDetail(response.data);
      } catch (error) {
        console.error('Error fetching resource detail:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [resourceId]);

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image size={20} />;
      case 'video':
        return <Video size={20} />;
      case 'audio':
        return <Music size={20} />;
      case 'text':
        return <FileText size={20} />;
      default:
        return <File size={20} />;
    }
  };

  const imageColumns = [
    {
      title: '预览',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      render: (thumbnail: string) => (
        <AntImage src={thumbnail} width={50} height={50} />
      ),
    },
    { title: '名称', dataIndex: 'name', key: 'name' },
    { title: '格式', dataIndex: 'format', key: 'format' },
    { title: '尺寸', key: 'dimensions', render: (record: ResourceItem) => `${record.width}x${record.height}` },
    { title: '大小', dataIndex: 'size', key: 'size' },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt' },
    { title: '更新时间', dataIndex: 'updatedAt', key: 'updatedAt' },
  ];

  const videoColumns = [
    {
      title: '预览',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      render: (thumbnail: string) => (
        <AntImage src={thumbnail} width={50} height={50} />
      ),
    },
    { title: '名称', dataIndex: 'name', key: 'name' },
    { title: '格式', dataIndex: 'format', key: 'format' },
    { title: '时长', dataIndex: 'duration', key: 'duration' },
    { title: '分辨率', dataIndex: 'resolution', key: 'resolution' },
    { title: '大小', dataIndex: 'size', key: 'size' },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt' },
  ];

  const audioColumns = [
    { title: '名称', dataIndex: 'name', key: 'name' },
    { title: '格式', dataIndex: 'format', key: 'format' },
    { title: '时长', dataIndex: 'duration', key: 'duration' },
    { title: '比特率', dataIndex: 'bitrate', key: 'bitrate' },
    { title: '大小', dataIndex: 'size', key: 'size' },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt' },
  ];

  const textColumns = [
    { title: '名称', dataIndex: 'name', key: 'name' },
    { title: '格式', dataIndex: 'format', key: 'format' },
    { title: '字数', dataIndex: 'wordCount', key: 'wordCount' },
    { title: '页数', dataIndex: 'pageCount', key: 'pageCount' },
    { title: '大小', dataIndex: 'size', key: 'size' },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt' },
  ];

  const otherColumns = [
    { title: '名称', dataIndex: 'name', key: 'name' },
    { title: '格式', dataIndex: 'format', key: 'format' },
    { title: '大小', dataIndex: 'size', key: 'size' },
    { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt' },
  ];

  const expandedRowRender = (record: ResourceItem, type: string) => {
    let columns;
    switch (type) {
      case 'images':
        columns = [
          {
            title: '预览',
            dataIndex: 'thumbnail',
            key: 'thumbnail',
            width: 80,
            render: (thumbnail: string) => (
              <AntImage src={thumbnail} width={50} height={50} />
            ),
          },
          { title: '名称', dataIndex: 'name', key: 'name' },
          { title: '格式', dataIndex: 'format', key: 'format' },
          { title: '尺寸', key: 'dimensions', render: (record: any) => record.width && record.height ? `${record.width}x${record.height}` : '-' },
          { title: '大小', dataIndex: 'size', key: 'size' },
          { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt' },
        ];
        break;
      case 'videos':
        columns = [
          {
            title: '预览',
            dataIndex: 'thumbnail',
            key: 'thumbnail',
            width: 80,
            render: (thumbnail: string) => (
              <AntImage src={thumbnail} width={50} height={50} />
            ),
          },
          { title: '名称', dataIndex: 'name', key: 'name' },
          { title: '格式', dataIndex: 'format', key: 'format' },
          { title: '时长', dataIndex: 'duration', key: 'duration' },
          { title: '分辨率', dataIndex: 'resolution', key: 'resolution' },
          { title: '大小', dataIndex: 'size', key: 'size' },
          { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt' },
        ];
        break;
      case 'audio':
        columns = [
          { title: '名称', dataIndex: 'name', key: 'name' },
          { title: '格式', dataIndex: 'format', key: 'format' },
          { title: '时长', dataIndex: 'duration', key: 'duration' },
          { title: '比特率', dataIndex: 'bitrate', key: 'bitrate' },
          { title: '大小', dataIndex: 'size', key: 'size' },
          { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt' },
        ];
        break;
      case 'text':
        columns = [
          { title: '名称', dataIndex: 'name', key: 'name' },
          { title: '格式', dataIndex: 'format', key: 'format' },
          { title: '字数', dataIndex: 'wordCount', key: 'wordCount' },
          { title: '页数', dataIndex: 'pageCount', key: 'pageCount' },
          { title: '大小', dataIndex: 'size', key: 'size' },
          { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt' },
        ];
        break;
      default:
        columns = [
          { title: '名称', dataIndex: 'name', key: 'name' },
          { title: '格式', dataIndex: 'format', key: 'format' },
          { title: '大小', dataIndex: 'size', key: 'size' },
          { title: '创建时间', dataIndex: 'createdAt', key: 'createdAt' },
        ];
    }

    return (
      <div className="pl-12 pr-4 pb-4">
        <Table
          columns={columns}
          dataSource={record.items}
          pagination={false}
          rowKey="id"
          size="small"
        />
      </div>
    );
  };

  return (
    <Modal
      title={<Title level={4}>资源详情</Title>}
      open={!!resourceId}
      onCancel={onClose}
      footer={null}
      width={1200}
    >
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Spin size="large" />
        </div>
      ) : detail ? (
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="基本信息" key="summary">
            <div className="space-y-6">
              <Descriptions bordered column={2}>
                <Descriptions.Item label="项目名称" span={2}>{detail.name}</Descriptions.Item>
                <Descriptions.Item label="创建时间">{detail.createdAt}</Descriptions.Item>
                <Descriptions.Item label="更新时间">{detail.updatedAt}</Descriptions.Item>
                <Descriptions.Item label="描述" span={2}>{detail.description}</Descriptions.Item>
                <Descriptions.Item label="标签" span={2}>
                  {detail.tags.map(tag => (
                    <Tag key={tag} className="mr-2">{tag}</Tag>
                  ))}
                </Descriptions.Item>
              </Descriptions>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Image size={20} />
                  <Title level={5} className="!mb-0">图片资源</Title>
                </div>
                <Descriptions bordered size="small">
                  <Descriptions.Item label="数量">{detail.summary.images.count}</Descriptions.Item>
                  <Descriptions.Item label="格式">{detail.summary.images.formats.join(', ')}</Descriptions.Item>
                  <Descriptions.Item label="总大小">{detail.summary.images.totalSize}</Descriptions.Item>
                </Descriptions>

                <div className="flex items-center space-x-2">
                  <Video size={20} />
                  <Title level={5} className="!mb-0">视频资源</Title>
                </div>
                <Descriptions bordered size="small">
                  <Descriptions.Item label="数量">{detail.summary.videos.count}</Descriptions.Item>
                  <Descriptions.Item label="格式">{detail.summary.videos.formats.join(', ')}</Descriptions.Item>
                  <Descriptions.Item label="总时长">{detail.summary.videos.totalDuration}</Descriptions.Item>
                  <Descriptions.Item label="总大小">{detail.summary.videos.totalSize}</Descriptions.Item>
                </Descriptions>

                <div className="flex items-center space-x-2">
                  <Music size={20} />
                  <Title level={5} className="!mb-0">音频资源</Title>
                </div>
                <Descriptions bordered size="small">
                  <Descriptions.Item label="数量">{detail.summary.audio.count}</Descriptions.Item>
                  <Descriptions.Item label="格式">{detail.summary.audio.formats.join(', ')}</Descriptions.Item>
                  <Descriptions.Item label="总时长">{detail.summary.audio.totalDuration}</Descriptions.Item>
                  <Descriptions.Item label="总大小">{detail.summary.audio.totalSize}</Descriptions.Item>
                </Descriptions>

                <div className="flex items-center space-x-2">
                  <FileText size={20} />
                  <Title level={5} className="!mb-0">文本资源</Title>
                </div>
                <Descriptions bordered size="small">
                  <Descriptions.Item label="数量">{detail.summary.text.count}</Descriptions.Item>
                  <Descriptions.Item label="格式">{detail.summary.text.formats.join(', ')}</Descriptions.Item>
                  <Descriptions.Item label="总大小">{detail.summary.text.totalSize}</Descriptions.Item>
                </Descriptions>

                <div className="flex items-center space-x-2">
                  <File size={20} />
                  <Title level={5} className="!mb-0">其他资源</Title>
                </div>
                <Descriptions bordered size="small">
                  <Descriptions.Item label="数量">{detail.summary.other.count}</Descriptions.Item>
                  <Descriptions.Item label="格式">{detail.summary.other.formats.join(', ')}</Descriptions.Item>
                  <Descriptions.Item label="总大小">{detail.summary.other.totalSize}</Descriptions.Item>
                </Descriptions>
              </div>
            </div>
          </TabPane>
          <TabPane tab={
            <span className="flex items-center space-x-1">
              <Image size={16} />
              <span>图片 ({detail.summary.images.count})</span>
            </span>
          } key="images">
            <Table
              columns={imageColumns}
              dataSource={detail.resources.images}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              expandable={{
                expandedRowRender: record => expandedRowRender(record, 'images'),
                expandRowByClick: true,
              }}
            />
          </TabPane>
          <TabPane tab={
            <span className="flex items-center space-x-1">
              <Video size={16} />
              <span>视频 ({detail.summary.videos.count})</span>
            </span>
          } key="videos">
            <Table
              columns={videoColumns}
              dataSource={detail.resources.videos}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              expandable={{
                expandedRowRender: record => expandedRowRender(record, 'videos'),
                expandRowByClick: true,
              }}
            />
          </TabPane>
          <TabPane tab={
            <span className="flex items-center space-x-1">
              <Music size={16} />
              <span>音频 ({detail.summary.audio.count})</span>
            </span>
          } key="audio">
            <Table
              columns={audioColumns}
              dataSource={detail.resources.audio}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              expandable={{
                expandedRowRender: record => expandedRowRender(record, 'audio'),
                expandRowByClick: true,
              }}
            />
          </TabPane>
          <TabPane tab={
            <span className="flex items-center space-x-1">
              <FileText size={16} />
              <span>文本 ({detail.summary.text.count})</span>
            </span>
          } key="text">
            <Table
              columns={textColumns}
              dataSource={detail.resources.text}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              expandable={{
                expandedRowRender: record => expandedRowRender(record, 'text'),
                expandRowByClick: true,
              }}
            />
          </TabPane>
          <TabPane tab={
            <span className="flex items-center space-x-1">
              <File size={16} />
              <span>其他 ({detail.summary.other.count})</span>
            </span>
          } key="other">
            <Table
              columns={otherColumns}
              dataSource={detail.resources.other}
              rowKey="id"
              pagination={{ pageSize: 10 }}
              expandable={{
                expandedRowRender: record => expandedRowRender(record, 'other'),
                expandRowByClick: true,
              }}
            />
          </TabPane>
        </Tabs>
      ) : null}
    </Modal>
  );
};

export default ResourceDetailModal;
