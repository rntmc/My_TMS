import { LOADS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const loadsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLoads: builder.query({
      query: () => ({
        url: LOADS_URL,
      }),
      providesTags: ['Loads'],
      keepUnusedDataFor: 5
    }),
    getLoadDetails: builder.query({
      query: (loadId) => ({
        url: `${LOADS_URL}/${loadId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    createLoad: builder.mutation({
      query: (load) => ({
        url: LOADS_URL,
        method: 'POST',
        body: {...load},
      }),
      invalidatesTags: ['Load'],
    }),
    updateLoadStatus: builder.mutation({
      query: ({ loadId, status }) => ({
        url: `${LOADS_URL}/${loadId}`,
        method: 'PATCH',
        body: {status},
      })
    }),
    deleteOrCancelLoad: builder.mutation({
      query: (loadId) => ({
        url: `${LOADS_URL}/${loadId}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Loads'], 
    }),
    updateLoad: builder.mutation({
      query: (data) => ({
        url: `${LOADS_URL}/${data.loadId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Loads'],
    }),
  }),
})

export const {
  useGetLoadsQuery, 
  useGetLoadDetailsQuery,
  useCreateLoadMutation,
  useUpdateLoadStatusMutation,
  useDeleteOrCancelLoadMutation,
  useUpdateLoadMutation,
} = loadsApiSlice;