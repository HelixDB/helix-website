import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api, { InstanceDetails, Query } from '@/app/api';
import { RootState } from '../store';
import { toSnakeCase } from '@/lib/utils';

interface QueryEdit {
  id: string;
  content: string;
  name: string;
  originalContent: string;
  originalName: string;
  hasUnsavedChanges: boolean;
}

interface InstancesState {
  instances: InstanceDetails[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  lastFetched: number | null;
  // Query management state
  queries: Query[];
  activeQueryId: string | null;
  queryEdits: { [key: string]: QueryEdit };
  queriesStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  queriesError: string | null;
}

const initialState: InstancesState = {
  instances: [],
  status: 'idle',
  error: null,
  lastFetched: null,
  queries: [],
  activeQueryId: null,
  queryEdits: {},
  queriesStatus: 'idle',
  queriesError: null,
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
  }) => {
    return await api.pushQuery(
      userId,
      instanceId,
      instanceName,
      clusterId,
      region,
      query
    );
  }
);

// Thunk for deleting a query
export const deleteQueryThunk = createAsyncThunk(
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
  }) => {
    return await api.deleteQuery(
      userId,
      instanceId,
      instanceName,
      clusterId,
      region,
      query
    );
  }
);

// Thunk for deleting an instance
export const deleteInstanceThunk = createAsyncThunk(
  'instances/deleteInstance',
  async ({ 
    userId, 
    instanceId,
    instanceName,
    clusterId,
    region
  }: { 
    userId: string;
    instanceId: string;
    instanceName: string;
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
      state.status = 'idle';
      state.error = null;
      state.lastFetched = null;
    },
    setActiveQuery: (state, action: PayloadAction<string | null>) => {
      state.activeQueryId = action.payload;
      if (action.payload && !state.queryEdits[action.payload]) {
        const query = state.queries.find(q => q.id === action.payload);
        if (query) {
          state.queryEdits[action.payload] = {
            id: query.id,
            content: query.content,
            name: query.name,
            originalContent: query.content,
            originalName: query.name,
            hasUnsavedChanges: false
          };
        }
      }
    },
    updateQueryContent: (state, action: PayloadAction<{ id: string; content: string }>) => {
      const { id, content } = action.payload;
      if (state.queryEdits[id]) {
        // Extract name from query content - stop at whitespace, =>, newline, or opening parenthesis
        const queryMatch = content.match(/QUERY\s+([^\s=>\n(]+)/i);
        let newName = state.queryEdits[id].name;
        
        if (queryMatch && queryMatch[1]) {
          try {
            // Remove any special characters and convert to snake case
            const rawName = queryMatch[1].trim();
            newName = toSnakeCase(rawName);
          } catch (error) {
            console.error("Failed to convert query name to snake case:", error);
            // Keep the existing name if conversion fails
          }
        }
        
        state.queryEdits[id] = {
          ...state.queryEdits[id],
          content,
          name: newName,
          hasUnsavedChanges: content !== state.queryEdits[id].originalContent || newName !== state.queryEdits[id].originalName
        };
      }
    },
    revertQueryChanges: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.queryEdits[id]) {
        state.queryEdits[id] = {
          ...state.queryEdits[id],
          content: state.queryEdits[id].originalContent,
          name: state.queryEdits[id].originalName,
          hasUnsavedChanges: false
        };
      }
    },
    clearQueryEdits: (state) => {
      state.queryEdits = {};
      state.activeQueryId = null;
    }
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
        state.error = null;
      })
      .addCase(fetchInstances.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to fetch instances';
      })
      // Query fetching cases
      .addCase(fetchQueries.pending, (state) => {
        state.queriesStatus = 'loading';
      })
      .addCase(fetchQueries.fulfilled, (state, action) => {
        state.queriesStatus = 'succeeded';
        state.queries = action.payload;
        state.queriesError = null;
        // Clear any existing edits when new queries are loaded
        state.queryEdits = {};
        state.activeQueryId = null;
      })
      .addCase(fetchQueries.rejected, (state, action) => {
        state.queriesStatus = 'failed';
        state.queriesError = action.error.message ?? 'Failed to fetch queries';
      })
      // Push query cases
      .addCase(pushQuery.fulfilled, (state, action) => {
        const queryId = state.activeQueryId;
        if (queryId && state.queryEdits[queryId]) {
          // Update the original query in the queries array
          const queryIndex = state.queries.findIndex(q => q.id === queryId);
          if (queryIndex !== -1) {
            state.queries[queryIndex] = {
              id: queryId,
              name: state.queryEdits[queryId].name,
              content: state.queryEdits[queryId].content
            };
          }
          // Update the edit state to reflect saved changes
          state.queryEdits[queryId] = {
            ...state.queryEdits[queryId],
            originalContent: state.queryEdits[queryId].content,
            originalName: state.queryEdits[queryId].name,
            hasUnsavedChanges: false
          };
        }
      })
      .addCase(deleteQueryThunk.fulfilled, (state, action) => {
        const queryId = state.activeQueryId;
        if (queryId) {
          state.queries = state.queries.filter(q => q.id !== queryId);
          delete state.queryEdits[queryId];
          state.activeQueryId = null;
        }
      })
      .addCase(deleteInstanceThunk.fulfilled, (state, action) => {
        state.instances = state.instances.filter(instance => instance.instance_id !== action.payload);
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

// Query-related selectors
export const selectQueries = (state: RootState) => state.instances.queries;
export const selectQueriesStatus = (state: RootState) => state.instances.queriesStatus;
export const selectQueriesError = (state: RootState) => state.instances.queriesError;
export const selectActiveQueryId = (state: RootState) => state.instances.activeQueryId;
export const selectActiveQueryEdit = (state: RootState) => {
  const activeId = state.instances.activeQueryId;
  return activeId ? state.instances.queryEdits[activeId] : null;
};
export const selectQueryEdits = (state: RootState) => state.instances.queryEdits;

export const {
  clearInstances,
  setActiveQuery,
  updateQueryContent,
  revertQueryChanges,
  clearQueryEdits
} = instancesSlice.actions;

export default instancesSlice.reducer; 