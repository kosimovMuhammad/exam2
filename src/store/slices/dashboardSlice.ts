import { toast } from 'sonner';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/lib/api/client';
import type { DashboardSummary } from '@/types';

interface DashboardState {
  data: DashboardSummary | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: DashboardState = {
  data: null,
  status: 'idle',
  error: null,
};

export const fetchDashboardSummary = createAsyncThunk('dashboard/fetchSummary', async (_) => {
  try {
    const res = await api.get('/dashboard/summary');
    return res.data;
  } catch (err: any) {
    toast.error(err.response?.data?.message || 'Failed to fetch dashboard summary');
    throw err;
  }
});

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardSummary.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchDashboardSummary.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchDashboardSummary.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default dashboardSlice.reducer;
