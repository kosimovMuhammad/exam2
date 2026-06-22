import { api } from './client';

export const getDebtPayments = async (debtId: string) => {
  const res = await api.get(`/debts/${debtId}/payments`);
  return res.data;
};

export const createDebtPayment = async (debtId: string, data: any) => {
  const res = await api.post(`/debts/${debtId}/payments`, data);
  return res.data;
};
