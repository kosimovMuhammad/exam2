import { toast } from 'sonner';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/lib/api/client';
import type { Payment } from '@/types';

interface PaymentsState {
  items: Payment[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: PaymentsState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchDebtPayments = createAsyncThunk('payments/fetchDebtPayments', async (debtId: string) => {
  try {
    const res = await api.get(`/debts/${debtId}/payments`);
    return res.data;
  } catch (err: any) {
    toast.error(err.response?.data?.message || 'Failed to fetch payments');
    throw err;
  }
});

export const fetchAllPayments = createAsyncThunk('payments/fetchAllPayments', async (_) => {
  try {
    const debtsRes = await api.get('/debts');
    const debts: any[] = debtsRes.data;
    const allPayments: any[] = [];
    for (const debt of debts) {
      try {
        const paymentsRes = await api.get(`/debts/${debt.id}/payments`);
        paymentsRes.data.forEach((p: any) => {
          allPayments.push({
            ...p,
            debtDescription: debt.description || 'Untitled Debt',
            debtAmount: debt.amount,
          });
        });
      } catch (err) {}
    }
    allPayments.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return allPayments;
  } catch (err: any) {
    toast.error(err.response?.data?.message || 'Failed to fetch all payments');
    throw err;
  }
});

export const createDebtPayment = createAsyncThunk('payments/createDebtPayment', async ({ debtId, data }: { debtId: string; data: any }) => {
  try {
    const res = await api.post(`/debts/${debtId}/payments`, data);
    return res.data;
  } catch (err: any) {
    toast.error(err.response?.data?.message || 'Failed to create payment');
    throw err;
  }
});

const paymentsSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDebtPayments.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchDebtPayments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchDebtPayments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(fetchAllPayments.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAllPayments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchAllPayments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(createDebtPayment.fulfilled, (state, action) => {
        state.items.push(action.payload);
      });
  },
});

export default paymentsSlice.reducer;
