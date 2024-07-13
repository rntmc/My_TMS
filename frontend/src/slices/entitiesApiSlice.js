import { ENTITIES_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const entitiesApiSlice = apiSlice.injectEndpoints({ //endpoint: {{baseURL}}/users/auth
  endpoints: (builder) => ({
    addEntity: builder.mutation({
      query: (data) => ({
        url: `${ENTITIES_URL}`,
        method: 'POST',
        body: data
      }),
    }),
    getEntities: builder.query({
      query: () => ({
        url: ENTITIES_URL
      }),
      providesTags: ['Entities'],
      keepUnusedDataFor: 5
    }),
    deleteEntity: builder.mutation({
      query: (entityId) => ({
        url: `${ENTITIES_URL}/${entityId}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Entities'],
    }),
    getEntity: builder.query({
      query: (entityId) => ({
        url: `${ENTITIES_URL}/${entityId}`,
      }),
      providesTags: ['Entities'],
      keepUnusedDataFor: 5,
    }),
    updateEntity: builder.mutation({
      query: (data) => ({
        url: `${ENTITIES_URL}/${data.entityId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Entities'],
    }),
  }),
})

export const {
  useAddEntityMutation,
  useGetEntitiesQuery,
  useDeleteEntityMutation,
  useGetEntityQuery,
  useUpdateEntityMutation,
} = entitiesApiSlice;