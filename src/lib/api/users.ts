import { api } from './client';

export const getMe = async () => {
  const res = await api.get('/users/me');
  return res.data;
};

export const updateMe = async (data: any) => {
  const res = await api.patch('/users/me', data);
  return res.data;
};
