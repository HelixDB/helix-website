import { configureStore } from '@reduxjs/toolkit';
import instancesReducer from './features/instancesSlice';

export const store = configureStore({
  reducer: {
    instances: instancesReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 