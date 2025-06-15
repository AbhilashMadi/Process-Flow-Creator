import apiService from "./api-service";

export const resourcesApi = apiService.injectEndpoints({
  endpoints: (builder) => ({
    getNodes: builder.query<Node[], void>({
      query: () => "/resources/nodes",
    }),
    getTemplates: builder.query({
      query: () => "/resources/templates",
    }),
  }),
});

export const { useGetNodesQuery, useGetTemplatesQuery } = resourcesApi;
