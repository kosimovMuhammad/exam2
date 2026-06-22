import { api } from './client';

export const getDebts = async (params?: any) => {
  const res = await api.get('/debts', { params });
  return res.data;
};

export const getDebtById = async (id: string) => {
  const res = await api.get(`/debts/${id}`);
  return res.data;
};

export const createDebt = async (data: any) => {
  const res = await api.post('/debts', data);
  return res.data;
};

export const updateDebt = async (id: string, data: any) => {
  const res = await api.patch(`/debts/${id}`, data);
  return res.data;
};

export const deleteDebt = async (id: string) => {
  const res = await api.delete(`/debts/${id}`);
  return res.data;
};
