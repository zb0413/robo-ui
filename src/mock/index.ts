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

export default Mock;