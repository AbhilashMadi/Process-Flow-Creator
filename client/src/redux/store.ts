import { configureStore } from "@reduxjs/toolkit";

import workflowSlice from '@/redux/features/workflow-slice';
import apiService from "@/redux/services/api-service";

export const store = configureStore({
  reducer: {
    [workflowSlice.name]: workflowSlice.reducer,
    [apiService.reducerPath]: apiService.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiService.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
