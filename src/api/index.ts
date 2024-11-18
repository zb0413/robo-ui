import axios from 'axios';

const api = {
  getMaterialCounts: () => axios.get('/api/material-counts'),
  getTrendData: () => axios.get('/api/trend-data'),
  getResourceList: () => axios.get('/api/resource-list'),
  getResourceDetail: (id: string) => axios.get(`/api/resource-detail/${id}`)
};

export default api;