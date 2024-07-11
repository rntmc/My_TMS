import { CARRIERS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const carriersApiSlice = apiSlice.injectEndpoints({ //endpoint: {{baseURL}}/users/auth
  endpoints: (builder) => ({
    addCarrier: builder.mutation({
      query: (data) => ({
        url: `${CARRIERS_URL}`,
        method: 'POST',
        body: data
      }),
    }),
    getCarriers: builder.query({
      query: () => ({
        url: CARRIERS_URL
      }),
      providesTags: ['Carriers'],
      keepUnusedDataFor: 5
    }),
    deleteCarriers: builder.mutation({
      query: (carrierId) => ({
        url: `${CARRIERS_URL}/${carrierId}`,
        method: 'DELETE'
      })
    }),
    getCarrier: builder.query({
      query: () => ({
        url: `${CARRIERS_URL}`,
      }),
      keepUnusedDataFor: 5,
    }),
    updateCarrier: builder.mutation({
      query: (data) => ({
        url: `${CARRIERS_URL}/${data.carrierId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Carriers'],
    }),
  }),
})

export const {
  useAddCarrierMutation,
  useGetCarriersQuery,
  useDeleteCarriersMutation,
  useGetCarrierQuery,
  useUpdateCarrierMutation,
} = carriersApiSlice;