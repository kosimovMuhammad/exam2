import { api } from './client';

export const getDashboardSummary = async () => {
  const res = await api.get('/dashboard/summary');
  return res.data;
};
