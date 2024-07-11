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
    deleteSupplier: builder.mutation({
      query: (supplierId) => ({
        url: `${SUPPLIERS_URL}/${supplierId}`,
        method: 'DELETE'
      })
    }),
    getSupplier: builder.query({
      query: () => ({
        url: `${SUPPLIERS_URL}`,
      }),
      keepUnusedDataFor: 5,
    }),
    updateSupplier: builder.mutation({
      query: (data) => ({
        url: `${SUPPLIERS_URL}/${data.supplierId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Suppliers'],
    }),
  }),
})

export const {
  useAddSupplierMutation,
  useGetSuppliersQuery,
  useDeleteSupplierMutation,
  useGetSupplierQuery,
  useUpdateSupplierMutation,
} = suppliersApiSlice;