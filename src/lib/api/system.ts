import { api } from './client';

export const getSystemHealth = async () => {
  const res = await api.get('/health');
  return res.data;
};
