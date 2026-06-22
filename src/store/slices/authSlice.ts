import { toast } from 'sonner';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/lib/api/client';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isInitialized: false,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk('auth/login', async (data: any) => {
  try {
    const res = await api.post('/auth/login', data);
    return res.data;
  } catch (err: any) {
    toast.error(err.response?.data?.message || 'Login failed');
  }
});

export const registerUser = createAsyncThunk('auth/register', async (data: any) => {
  try {
    const res = await api.post('/auth/register', data);
    return res.data;
  } catch (err: any) {
    toast.error(err.response?.data?.message || 'Registration failed');
  }
});

export const getMe = createAsyncThunk('auth/getMe', async (_) => {
  try {
    const res = await api.get('/users/me');
    return res.data;
  } catch (err: any) {
    toast.error(err.response?.data?.message || 'Failed to fetch user');
  }
});

export const updateMe = createAsyncThunk('auth/updateMe', async (data: any) => {
  try {
    const res = await api.patch('/users/me', data);
    return res.data;
  } catch (err: any) {
    toast.error(err.response?.data?.message || 'Failed to update user');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isInitialized = true;
      state.error = null;
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        localStorage.setItem('access', action.payload.accessToken);
        if (action.payload.refreshToken) localStorage.setItem('refresh', action.payload.refreshToken);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        localStorage.setItem('access', action.payload.accessToken);
        if (action.payload.refreshToken) localStorage.setItem('refresh', action.payload.refreshToken);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // getMe
      .addCase(getMe.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isInitialized = true;
      })
      .addCase(getMe.rejected, (state) => {
        state.loading = false;
        state.isInitialized = true;
        state.isAuthenticated = false;
        state.user = null;
      })
      // updateMe
      .addCase(updateMe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateMe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logoutUser, clearError } = authSlice.actions;
export default authSlice.reducer;
