import { SUPPLIERS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const suppliersApiSlice = apiSlice.injectEndpoints({ //endpoint: {{baseURL}}/users/auth
  endpoints: (builder) => ({
    addSupplier: builder.mutation({
      query: (data) => ({
        url: `${SUPPLIERS_URL}`,
        method: 'POST',
        body: data
      }),
    }),
    getSuppliers: builder.query({
      query: () => ({
        url: SUPPLIERS_URL
      }),
      providesTags: ['Suppliers'],
      keepUnusedDataFor: 5
    }),
  }),
})

export const {
  useAddSupplierMutation,
  useGetSuppliersQuery,
} = suppliersApiSlice;