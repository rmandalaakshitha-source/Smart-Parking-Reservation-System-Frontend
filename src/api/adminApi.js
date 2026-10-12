import API from './axios';

export const getDashboardStats = () => {
  return API.get('/admin/stats');
};
