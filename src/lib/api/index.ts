export * from './client';
export * from './auth';
export * from './users';
export * from './contacts';
export * from './debts';
export * from './payments';
export * from './folders';
export * from './dashboard';
export * from './system';

// PascalCase aliases for backward compatibility with existing imports
export { loginUser as LoginUser, registerUser as RegisterUser } from './auth';
export { getMe as GetMe, updateMe as UpdateMe } from './users';
export { getContacts as GetContacts, getContactById as GetContactById, createContact as CreateContact, updateContact as UpdateContact, deleteContact as DeleteContact } from './contacts';
export { getDebts as GetDebts, getDebtById as GetDebtById, createDebt as CreateDebt, updateDebt as UpdateDebt, deleteDebt as DeleteDebt } from './debts';
export { getDebtPayments as GetDebtPayments, createDebtPayment as CreateDebtPayment } from './payments';
export { getFolders as GetFolders, getFolderById as GetFolderById, createFolder as CreateFolder, updateFolder as UpdateFolder, deleteFolder as DeleteFolder } from './folders';
export { getDashboardSummary as GetDashboardSummary } from './dashboard';
export { getSystemHealth as GetSystemHealth } from './system';
