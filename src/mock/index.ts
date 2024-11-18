import Mock from 'mockjs';

const Random = Mock.Random;

// 生成素材统计数据
Mock.mock('/api/material-counts', 'get', () => {
  return {
    images: Random.integer(1000, 2000),
    videos: Random.integer(400, 600),
    audio: Random.integer(700, 900),
    text: Random.integer(2000, 2500),
    other: Random.integer(300, 400)
  };
});

// 生成7天趋势数据
Mock.mock('/api/trend-data', 'get', () => {
  const data = [];
  for (let i = 1; i <= 7; i++) {
    data.push({
      name: `Day ${i}`,
      images: Random.integer(1200, 1300),
      videos: Random.integer(430, 460),
      audio: Random.integer(750, 800),
      text: Random.integer(2250, 2350),
      other: Random.integer(300, 330)
    });
  }
  return data;
});

// 生成资源列表数据
Mock.mock('/api/resource-list', 'get', () => {
  const data = [];
  for (let i = 1; i <= 10; i++) {
    data.push({
      key: i.toString(),
      name: `项目${Random.character('ABCDEFGHIJKLMNOPQRSTUVWXYZ')}`,
      images: Random.integer(100, 500),
      videos: Random.integer(20, 100),
      audio: Random.integer(50, 200),
      text: Random.integer(200, 800),
      other: Random.integer(10, 50),
      videoDuration: `${Random.integer(1, 10)}:${Random.integer(10, 59)}:${Random.integer(10, 59)}`,
      diskUsage: `${Random.float(0.5, 5, 1, 1)} GB`
    });
  }
  return data;
});

// 生成资源详情数据
Mock.mock(/\/api\/resource-detail\/\d+/, 'get', (options) => {
  const id = options.url.match(/\/api\/resource-detail\/(\d+)/)[1];
  
  // Generate resource items for each type
  const generateItems = (type: string, count: number) => {
    return Array(count).fill(null).map((_, index) => {
      const baseItem = {
        id: `${type}-${index + 1}`,
        name: `${type}-文件-${index + 1}`,
        createdAt: Random.datetime(),
        updatedAt: Random.datetime(),
        size: `${Random.float(0.1, 10, 1, 2)} MB`,
        items: Array(Random.integer(2, 5)).fill(null).map((_, subIndex) => ({
          id: `${type}-${index + 1}-${subIndex + 1}`,
          name: `${type}-子文件-${index + 1}-${subIndex + 1}`,
          createdAt: Random.datetime(),
          updatedAt: Random.datetime(),
          size: `${Random.float(0.01, 1, 1, 2)} MB`,
        }))
      };

      switch (type) {
        case 'image':
          return {
            ...baseItem,
            type: 'image',
            format: Random.pick(['PNG', 'JPG', 'GIF']),
            width: Random.integer(800, 3000),
            height: Random.integer(600, 2000),
            thumbnail: Random.image('200x200'),
            items: baseItem.items.map(item => ({
              ...item,
              format: Random.pick(['PNG', 'JPG', 'GIF']),
              width: Random.integer(400, 1500),
              height: Random.integer(300, 1000),
              thumbnail: Random.image('100x100'),
            }))
          };
        case 'video':
          return {
            ...baseItem,
            type: 'video',
            format: Random.pick(['MP4', 'AVI', 'MOV']),
            duration: `${Random.integer(0, 2)}:${Random.integer(10, 59)}:${Random.integer(10, 59)}`,
            resolution: `${Random.pick(['1920x1080', '1280x720', '3840x2160'])}`,
            thumbnail: Random.image('200x200'),
            items: baseItem.items.map(item => ({
              ...item,
              format: Random.pick(['MP4', 'AVI', 'MOV']),
              duration: `${Random.integer(0, 0)}:${Random.integer(1, 10)}:${Random.integer(10, 59)}`,
              resolution: `${Random.pick(['1920x1080', '1280x720', '3840x2160'])}`,
              thumbnail: Random.image('100x100'),
            }))
          };
        case 'audio':
          return {
            ...baseItem,
            type: 'audio',
            format: Random.pick(['MP3', 'WAV', 'AAC']),
            duration: `${Random.integer(0, 1)}:${Random.integer(10, 59)}:${Random.integer(10, 59)}`,
            bitrate: `${Random.integer(128, 320)} kbps`,
            items: baseItem.items.map(item => ({
              ...item,
              format: Random.pick(['MP3', 'WAV', 'AAC']),
              duration: `${Random.integer(0, 0)}:${Random.integer(1, 10)}:${Random.integer(10, 59)}`,
              bitrate: `${Random.integer(128, 320)} kbps`,
            }))
          };
        case 'text':
          return {
            ...baseItem,
            type: 'text',
            format: Random.pick(['TXT', 'DOC', 'PDF']),
            wordCount: Random.integer(100, 10000),
            pageCount: Random.integer(1, 50),
            items: baseItem.items.map(item => ({
              ...item,
              format: Random.pick(['TXT', 'DOC', 'PDF']),
              wordCount: Random.integer(50, 5000),
              pageCount: Random.integer(1, 25),
            }))
          };
        default:
          return {
            ...baseItem,
            type: 'other',
            format: Random.pick(['ZIP', 'RAR']),
            items: baseItem.items.map(item => ({
              ...item,
              format: Random.pick(['ZIP', 'RAR']),
            }))
          };
      }
    });
  };

  const imageCount = Random.integer(5, 10);
  const videoCount = Random.integer(3, 7);
  const audioCount = Random.integer(4, 8);
  const textCount = Random.integer(6, 12);
  const otherCount = Random.integer(2, 5);

  return {
    id,
    name: `项目${Random.character('ABCDEFGHIJKLMNOPQRSTUVWXYZ')}`,
    createdAt: Random.datetime(),
    updatedAt: Random.datetime(),
    description: Random.paragraph(),
    tags: Array(Random.integer(2, 5)).fill(null).map(() => Random.word()),
    summary: {
      images: {
        count: imageCount,
        formats: ['PNG', 'JPG', 'GIF'],
        totalSize: `${Random.float(0.1, 2, 1, 1)} GB`
      },
      videos: {
        count: videoCount,
        formats: ['MP4', 'AVI', 'MOV'],
        totalDuration: `${Random.integer(1, 10)}:${Random.integer(10, 59)}:${Random.integer(10, 59)}`,
        totalSize: `${Random.float(0.5, 3, 1, 1)} GB`
      },
      audio: {
        count: audioCount,
        formats: ['MP3', 'WAV', 'AAC'],
        totalDuration: `${Random.integer(1, 5)}:${Random.integer(10, 59)}:${Random.integer(10, 59)}`,
        totalSize: `${Random.float(0.1, 1, 1, 1)} GB`
      },
      text: {
        count: textCount,
        formats: ['TXT', 'DOC', 'PDF'],
        totalSize: `${Random.float(0.05, 0.5, 2, 2)} GB`
      },
      other: {
        count: otherCount,
        formats: ['ZIP', 'RAR'],
        totalSize: `${Random.float(0.1, 1, 1, 1)} GB`
      }
    },
    resources: {
      images: generateItems('image', imageCount),
      videos: generateItems('video', videoCount),
      audio: generateItems('audio', audioCount),
      text: generateItems('text', textCount),
      other: generateItems('other', otherCount)
    }
  };
});

export default Mock;