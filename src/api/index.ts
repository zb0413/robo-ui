import axios from 'axios';

const api = {
  getMaterialCounts: () => axios.get('/api/material-counts'),
  getTrendData: () => axios.get('/api/trend-data'),
  getResourceList: () => axios.get('/api/resource-list')
};

export default api;