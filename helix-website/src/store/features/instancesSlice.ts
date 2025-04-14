import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api, { InstanceDetails } from '@/app/api';
import { RootState } from '../store';

interface InstancesState {
  instances: InstanceDetails[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  lastFetched: number | null;
}

const initialState: InstancesState = {
  instances: [],
  status: 'idle',
  error: null,
  lastFetched: null,
};

// Thunk for fetching instances
export const fetchInstances = createAsyncThunk(
  'instances/fetchInstances',
  async (userId: string) => {
    const response = await api.getUserResources(userId, '');
    return Array.isArray(response) ? response : [response];
  }
);

export const instancesSlice = createSlice({
  name: 'instances',
  initialState,
  reducers: {
    clearInstances: (state) => {
      state.instances = [];
      state.status = 'idle';
      state.error = null;
      state.lastFetched = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInstances.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchInstances.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.instances = action.payload;
        state.lastFetched = Date.now();
        state.error = null;
      })
      .addCase(fetchInstances.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to fetch instances';
      });
  },
});

// Selectors
export const selectAllInstances = (state: RootState) => state.instances.instances;
export const selectInstanceById = (state: RootState, instanceId: string) =>
  state.instances.instances.find(instance => instance.instance_id === instanceId);
export const selectInstancesStatus = (state: RootState) => state.instances.status;
export const selectInstancesError = (state: RootState) => state.instances.error;
export const selectLastFetched = (state: RootState) => state.instances.lastFetched;

export const { clearInstances } = instancesSlice.actions;
export default instancesSlice.reducer; 