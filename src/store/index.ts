import { configureStore, createSlice } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import authReducer from './slices/authSlice';
import contactsReducer from './slices/contactsSlice';
import debtsReducer from './slices/debtsSlice';
import foldersReducer from './slices/foldersSlice';
import paymentsReducer from './slices/paymentsSlice';
import dashboardReducer from './slices/dashboardSlice';
import systemReducer from './slices/systemSlice';

const uiSlice = createSlice({
  name: 'ui',
  initialState: { sidebarCollapsed: false, isMobileMenuOpen: false },
  reducers: {
    toggleSidebar: (state) => { state.sidebarCollapsed = !state.sidebarCollapsed; },
    setMobileMenuOpen: (state, action) => { state.isMobileMenuOpen = action.payload; },
  },
});

export const { toggleSidebar, setMobileMenuOpen } = uiSlice.actions;

export const store = configureStore({
  reducer: {
    auth: authReducer,
    contacts: contactsReducer,
    debts: debtsReducer,
    folders: foldersReducer,
    payments: paymentsReducer,
    dashboard: dashboardReducer,
    system: systemReducer,
    ui: uiSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export * from './slices/authSlice';
export * from './slices/contactsSlice';
export * from './slices/debtsSlice';
export * from './slices/foldersSlice';
export * from './slices/paymentsSlice';
export * from './slices/dashboardSlice';
export * from './slices/systemSlice';
