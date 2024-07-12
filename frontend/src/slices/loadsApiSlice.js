import { LOADS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const loadsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLoads: builder.query({
      query: () => ({
        url: LOADS_URL,
      }),
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
      })
    }),
    updateLoadStatus: builder.mutation({
      query: ({ loadId, status }) => ({
        url: `${LOADS_URL}/${loadId}`,
        method: 'PATCH',
        body: {status},
      })
    }),
  }),
})

export const {
  useGetLoadsQuery, 
  useGetLoadDetailsQuery,
  useCreateLoadMutation,
  useUpdateLoadStatusMutation
} = loadsApiSlice;