import { api } from './client';

export const getContacts = async (params?: any) => {
  const res = await api.get('/contacts', { params });
  return res.data;
};

export const getContactById = async (id: string) => {
  const res = await api.get(`/contacts/${id}`);
  return res.data;
};

export const createContact = async (data: any) => {
  const res = await api.post('/contacts', data);
  return res.data;
};

export const updateContact = async (id: string, data: any) => {
  const res = await api.patch(`/contacts/${id}`, data);
  return res.data;
};

export const deleteContact = async (id: string) => {
  const res = await api.delete(`/contacts/${id}`);
  return res.data;
};
