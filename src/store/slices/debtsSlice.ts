import { toast } from 'sonner';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/lib/api/client';
import type { Debt } from '@/types';

interface DebtsState {
  items: Debt[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  currentDebt: Debt | null;
  currentDebtStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: DebtsState = {
  items: [],
  status: 'idle',
  error: null,
  currentDebt: null,
  currentDebtStatus: 'idle',
};

export const fetchDebts = createAsyncThunk<any, any | void>('debts/fetchDebts', async (params) => {
  try {
    const res = await api.get('/debts', { params: params || {} });
    return res.data;
  } catch (err: any) {
    toast.error(err.response?.data?.message || 'Failed to fetch debts');
    throw err;
  }
});

export const fetchDebtById = createAsyncThunk('debts/fetchDebtById', async (id: string) => {
  try {
    const res = await api.get(`/debts/${id}`);
    return res.data;
  } catch (err: any) {
    toast.error(err.response?.data?.message || 'Failed to fetch debt details');
    throw err;
  }
});

export const createDebt = createAsyncThunk('debts/createDebt', async (data: any) => {
  try {
    const res = await api.post('/debts', data);
    return res.data;
  } catch (err: any) {
    toast.error(err.response?.data?.message || 'Failed to create debt');
    throw err;
  }
});

export const updateDebt = createAsyncThunk('debts/updateDebt', async ({ id, data }: { id: string; data: any }) => {
  try {
    const res = await api.patch(`/debts/${id}`, data);
    return res.data;
  } catch (err: any) {
    toast.error(err.response?.data?.message || 'Failed to update debt');
    throw err;
  }
});

export const deleteDebt = createAsyncThunk('debts/deleteDebt', async (id: string) => {
  try {
    await api.delete(`/debts/${id}`);
    return id;
  } catch (err: any) {
    toast.error(err.response?.data?.message || 'Failed to delete debt');
    throw err;
  }
});

const debtsSlice = createSlice({
  name: 'debts',
  initialState,
  reducers: {
    clearCurrentDebt: (state) => {
      state.currentDebt = null;
      state.currentDebtStatus = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchDebts
      .addCase(fetchDebts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchDebts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchDebts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // fetchDebtById
      .addCase(fetchDebtById.pending, (state) => {
        state.currentDebtStatus = 'loading';
      })
      .addCase(fetchDebtById.fulfilled, (state, action) => {
        state.currentDebtStatus = 'succeeded';
        state.currentDebt = action.payload;
      })
      .addCase(fetchDebtById.rejected, (state, action) => {
        state.currentDebtStatus = 'failed';
        state.error = action.payload as string;
      })
      // createDebt
      .addCase(createDebt.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // updateDebt
      .addCase(updateDebt.fulfilled, (state, action) => {
        const index = state.items.findIndex((d) => d.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.currentDebt?.id === action.payload.id) {
          state.currentDebt = action.payload;
        }
      })
      // deleteDebt
      .addCase(deleteDebt.fulfilled, (state, action) => {
        state.items = state.items.filter((d) => d.id !== action.payload);
        if (state.currentDebt?.id === action.payload) {
          state.currentDebt = null;
        }
      });
  },
});

export const { clearCurrentDebt } = debtsSlice.actions;
export default debtsSlice.reducer;
