import { toast } from 'sonner';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/lib/api/client';
import type { Folder } from '@/types';

interface FoldersState {
  items: Folder[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: FoldersState = {
  items: [],
  status: 'idle',
  error: null,
};

export const fetchFolders = createAsyncThunk<any, any | void>('folders/fetchFolders', async (params) => {
  try {
    const res = await api.get('/folders', { params: params || {} });
    return res.data;
  } catch (err: any) {
    toast.error(err.response?.data?.message || 'Failed to fetch folders');
    throw err;
  }
});

export const createFolder = createAsyncThunk('folders/createFolder', async (data: any) => {
  try {
    const res = await api.post('/folders', data);
    return res.data;
  } catch (err: any) {
    toast.error(err.response?.data?.message || 'Failed to create folder');
    throw err;
  }
});

export const updateFolder = createAsyncThunk('folders/updateFolder', async ({ id, data }: { id: string; data: any }) => {
  try {
    const res = await api.patch(`/folders/${id}`, data);
    return res.data;
  } catch (err: any) {
    toast.error(err.response?.data?.message || 'Failed to update folder');
    throw err;
  }
});

export const deleteFolder = createAsyncThunk('folders/deleteFolder', async (id: string) => {
  try {
    await api.delete(`/folders/${id}`);
    return id;
  } catch (err: any) {
    toast.error(err.response?.data?.message || 'Failed to delete folder');
    throw err;
  }
});

const foldersSlice = createSlice({
  name: 'folders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFolders.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchFolders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchFolders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(createFolder.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateFolder.fulfilled, (state, action) => {
        const index = state.items.findIndex((f) => f.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteFolder.fulfilled, (state, action) => {
        state.items = state.items.filter((f) => f.id !== action.payload);
      });
  },
});

export default foldersSlice.reducer;
