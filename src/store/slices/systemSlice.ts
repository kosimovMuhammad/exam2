import { toast } from 'sonner';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/lib/api/client';

interface SystemState {
  health: any | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: SystemState = {
  health: null,
  status: 'idle',
  error: null,
};

export const fetchSystemHealth = createAsyncThunk('system/fetchHealth', async (_) => {
  try {
    const res = await api.get('/health');
    return res.data;
  } catch (err: any) {
    toast.error(err.response?.data?.message || 'Failed to fetch system health');
    throw err;
  }
});

const systemSlice = createSlice({
  name: 'system',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSystemHealth.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSystemHealth.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.health = action.payload;
      })
      .addCase(fetchSystemHealth.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default systemSlice.reducer;
