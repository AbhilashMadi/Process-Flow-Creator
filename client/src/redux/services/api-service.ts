import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

const apiService = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: BACKEND_BASE_URL }),
  endpoints: () => ({}),
});

export default apiService;
