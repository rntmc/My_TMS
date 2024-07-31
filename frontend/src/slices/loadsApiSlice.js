import { LOADS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const loadsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLoads: builder.query({
      query: ({ keyword } = {}) => {
        const params = {};
        if (keyword) {
          params.keyword = keyword;
        }
        return {
          url: LOADS_URL,
          params,
        };
      },
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
    getMyLoads: builder.query({ //loads associated with a user
      query: () => ({
        url: `${LOADS_URL}/myloads`,
      }),
      keepUnusedDataFor: 5
    }),
    uploadLoadDocument: builder.mutation({
      query: (data) => ({
        url: `${LOADS_URL}`,
        method: 'POST',
        body: data,
      }),
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
  useGetMyLoadsQuery,
  useUploadLoadDocumentMutation,
} = loadsApiSlice;