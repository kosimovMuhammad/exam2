import { api } from './client';

export const getFolders = async (params?: any) => {
  const res = await api.get('/folders', { params });
  return res.data;
};

export const getFolderById = async (id: string) => {
  const res = await api.get(`/folders/${id}`);
  return res.data;
};

export const createFolder = async (data: any) => {
  const res = await api.post('/folders', data);
  return res.data;
};

export const updateFolder = async (id: string, data: any) => {
  const res = await api.patch(`/folders/${id}`, data);
  return res.data;
};

export const deleteFolder = async (id: string) => {
  const res = await api.delete(`/folders/${id}`);
  return res.data;
};
