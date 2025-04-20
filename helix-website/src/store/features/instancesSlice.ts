import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api, { InstanceDetails, Query } from '@/app/api';
import { RootState } from '../store';
import { toSnakeCase } from '@/lib/utils';


interface InstancesState {
  instances: InstanceDetails[];
  lastFetched: number | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  queries: Query[];
  queriesStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: InstancesState = {
  instances: [],
  status: 'idle',
  lastFetched: null,
  queries: [],
  queriesStatus: 'idle',
};

// Thunk for fetching instances
export const fetchInstances = createAsyncThunk(
  'instances/fetchInstances',
  async (userId: string) => {
    const response = await api.getUserResources(userId, '');
    return Array.isArray(response) ? response : [response];
  }
);

// Thunk for fetching queries
export const fetchQueries = createAsyncThunk(
  'instances/fetchQueries',
  async ({ userId, instanceId }: { userId: string; instanceId: string }) => {
    const response = await api.getQueries(userId, instanceId);
    return response.queries;
  }
);

// Thunk for pushing a single query
export const pushQuery = createAsyncThunk(
  'instances/pushQuery',
  async ({
    userId,
    instanceId,
    instanceName,
    clusterId,
    region,
    query
  }: {
    userId: string;
    instanceId: string;
    instanceName: string;
    clusterId: string;
    region: string;
    query: Query;
  }, { rejectWithValue }) => {
    try {
      if (!userId || !instanceId || !instanceName || !clusterId || !region || !query) {
        throw new Error('Missing required parameters');
      }

      const response = await api.pushQuery(
        userId,
        instanceId,
        instanceName,
        clusterId,
        region,
        query
      );

      // Check if response exists and has expected data
      if (!response || response.error) {
        throw new Error(response?.error || 'Failed to push query: No response from server');
      }

      return response;
    } catch (error) {
      console.error('Error pushing query:', error);
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred while pushing the query');
    }
  }
);

// Thunk for deleting a query
export const deleteQuery = createAsyncThunk(
  'instances/deleteQuery',
  async ({
    userId,
    instanceId,
    instanceName,
    clusterId,
    region,
    query
  }: {
    userId: string;
    instanceId: string;
    instanceName: string;
    clusterId: string;
    region: string;
    query: Query;
  }, { rejectWithValue }) => {
    try {
      if (!userId || !instanceId || !instanceName || !clusterId || !region || !query) {
        throw new Error('Missing required parameters');
      }

      const response = await api.deleteQuery(
        userId,
        instanceId,
        instanceName,
        clusterId,
        region,
        query
      );

      // Check if response exists and has expected data
      if (!response || response.error) {
        throw new Error(response?.error || 'Failed to delete query: No response from server');
      }

      return response;
    } catch (error) {
      console.error('Error deleting query:', error);
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('An unknown error occurred while deleting the query');
    }
  }
);

// Thunk for deleting an instance
export const deleteInstanceThunk = createAsyncThunk(
  'instances/deleteInstance',
  async ({
    userId,
    instanceId,
    clusterId,
    region
  }: {
    userId: string;
    instanceId: string;
    clusterId: string;
    region: string;
  }) => {
    await api.deleteInstance(userId, clusterId, region, instanceId);
    return instanceId;
  }
);

export const instancesSlice = createSlice({
  name: 'instances',
  initialState,
  reducers: {
    clearInstances: (state) => {
      state.instances = [];
      state.lastFetched = null;
    },
    clearQueries: (state) => {
      state.queries = [];
      state.queriesStatus = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      // Instance fetching cases
      .addCase(fetchInstances.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchInstances.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.instances = action.payload;
        state.lastFetched = Date.now();
      })
      .addCase(fetchInstances.rejected, (state, action) => {
        state.status = 'failed';
      })
      // Query fetching cases
      .addCase(fetchQueries.pending, (state) => {
        state.queriesStatus = 'loading';
      })
      .addCase(fetchQueries.fulfilled, (state, action) => {
        state.queriesStatus = 'succeeded';
        state.queries = action.payload;
      })
      .addCase(fetchQueries.rejected, (state, action) => {
        state.queriesStatus = 'failed';
      })
      // Push query cases
      .addCase(pushQuery.fulfilled, (state, action) => {
        state.queriesStatus = 'succeeded';
        const queryIndex = state.queries.findIndex(q => q.id === action.meta.arg.query.id);
        if (queryIndex !== -1) {
          state.queries[queryIndex] = {
            id: action.meta.arg.query.id,
            name: action.meta.arg.query.name,
            content: action.meta.arg.query.content
          };
        } else {
          state.queries.push(action.meta.arg.query);
        }
        // Set instance state to redeploying
        const instance = state.instances.find(i => i.instance_id === action.meta.arg.instanceId);
        if (instance) {
          instance.instance_status = "redeploying";
        }
      })
      .addCase(pushQuery.rejected, (state, action) => {
        state.queriesStatus = 'failed';
      })
      .addCase(deleteQuery.fulfilled, (state, action) => {
        state.queriesStatus = 'succeeded';
        state.queries = state.queries.filter(q => q.id !== action.meta.arg.query.id);
        // Set instance state to redeploying
        const instance = state.instances.find(i => i.instance_id === action.meta.arg.instanceId);
        if (instance) {
          instance.instance_status = "redeploying";
        }
      })
      .addCase(deleteQuery.rejected, (state, action) => {
        state.queriesStatus = 'failed';
      })
      .addCase(deleteInstanceThunk.fulfilled, (state, action) => {
        state.instances = state.instances.filter(instance => instance.instance_id !== action.meta.arg.instanceId);
      });
  },
});

// Selectors
export const selectAllInstances = (state: RootState) => state.instances.instances;
export const selectInstanceById = (state: RootState, instanceId: string) =>
  state.instances.instances.find(instance => instance.instance_id === instanceId);
export const selectInstancesStatus = (state: RootState) => state.instances.status;
export const selectLastFetched = (state: RootState) => state.instances.lastFetched;

// Query-related selectors
export const selectQueries = (state: RootState) => state.instances.queries;
export const selectQueriesStatus = (state: RootState) => state.instances.queriesStatus;

export const {
  clearInstances,
  clearQueries,
} = instancesSlice.actions;

export default instancesSlice.reducer; 