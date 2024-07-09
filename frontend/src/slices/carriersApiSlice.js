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
  }),
})

export const {
  useAddCarrierMutation,
  useGetCarriersQuery,
} = carriersApiSlice;