import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const LoginUser = async (data: any) => (await api.post('/auth/login', data)).data;
export const RegisterUser = async (data: any) => (await api.post('/auth/register', data)).data;

// Users
export const GetMe = async () => (await api.get('/users/me')).data;
export const UpdateMe = async (data: any) => (await api.patch('/users/me', data)).data;

// Contacts
export const GetContacts = async (params?: any) => (await api.get('/contacts', { params })).data;
export const GetContactById = async (id: string) => (await api.get(`/contacts/${id}`)).data;
export const CreateContact = async (data: any) => (await api.post('/contacts', data)).data;
export const UpdateContact = async (id: string, data: any) => (await api.patch(`/contacts/${id}`, data)).data;
export const DeleteContact = async (id: string) => (await api.delete(`/contacts/${id}`)).data;

// Debts
export const GetDebts = async (params?: any) => (await api.get('/debts', { params })).data;
export const GetDebtById = async (id: string) => (await api.get(`/debts/${id}`)).data;
export const CreateDebt = async (data: any) => (await api.post('/debts', data)).data;
export const UpdateDebt = async (id: string, data: any) => (await api.patch(`/debts/${id}`, data)).data;
export const DeleteDebt = async (id: string) => (await api.delete(`/debts/${id}`)).data;

// Payments
export const GetDebtPayments = async (debtId: string) => (await api.get(`/debts/${debtId}/payments`)).data;
export const CreateDebtPayment = async (debtId: string, data: any) => (await api.post(`/debts/${debtId}/payments`, data)).data;

// Folders
export const GetFolders = async () => (await api.get('/folders')).data;
export const GetFolderById = async (id: string) => (await api.get(`/folders/${id}`)).data;
export const CreateFolder = async (data: any) => (await api.post('/folders', data)).data;
export const UpdateFolder = async (id: string, data: any) => (await api.patch(`/folders/${id}`, data)).data;
export const DeleteFolder = async (id: string) => (await api.delete(`/folders/${id}`)).data;

// Dashboard
export const GetDashboardSummary = async () => (await api.get('/dashboard/summary')).data;

// System
export const GetSystemHealth = async () => (await api.get('/health')).data;
