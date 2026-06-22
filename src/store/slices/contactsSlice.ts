import { toast } from 'sonner';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/lib/api/client';
import type { Contact } from '@/types';

interface ContactsState {
  items: Contact[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ContactsState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchContacts = createAsyncThunk<any, any | void>('contacts/fetchContacts', async (params) => {
  try {
    const res = await api.get('/contacts', { params: params || {} });
    return res.data;
  } catch (err: any) {
    toast.error(err.response?.data?.message || 'Failed to fetch contacts');
    throw err;
  }
});

export const createContact = createAsyncThunk('contacts/createContact', async (data: any) => {
  try {
    const res = await api.post('/contacts', data);
    return res.data;
  } catch (err: any) {
    toast.error(err.response?.data?.message || 'Failed to create contact');
    throw err;
  }
});

export const updateContact = createAsyncThunk('contacts/updateContact', async ({ id, data }: { id: string; data: any }) => {
  try {
    const res = await api.patch(`/contacts/${id}`, data);
    return res.data;
  } catch (err: any) {
    toast.error(err.response?.data?.message || 'Failed to update contact');
    throw err;
  }
});

export const deleteContact = createAsyncThunk('contacts/deleteContact', async (id: string) => {
  try {
    await api.delete(`/contacts/${id}`);
    return id;
  } catch (err: any) {
    toast.error(err.response?.data?.message || 'Failed to delete contact');
    throw err;
  }
});

const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(createContact.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateContact.fulfilled, (state, action) => {
        const index = state.items.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c.id !== action.payload);
      });
  },
});

export default contactsSlice.reducer;
