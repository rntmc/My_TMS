import { ORDERS_URL, UPLOAD_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const ordersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: () => ({
        url: ORDERS_URL,
      }),
      keepUnusedDataFor: 5
    }),
    getOrderDetails: builder.query({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}`,
      }),
      keepUnusedDataFor: 5,
    }),
    createOrder: builder.mutation({
      query: (order) => ({
        url: ORDERS_URL,
        method: 'POST',
        body: {...order},
      })
    }),
    updateOrderStatus: builder.mutation({
      query: ({ orderId, status }) => ({
        url: `${ORDERS_URL}/${orderId}`,
        method: 'PATCH',
        body: {status},
      })
    }),
    deleteOrCancelOrder: builder.mutation({
      query: (orderId) => ({
        url: `${ORDERS_URL}/${orderId}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Orders'], 
    }),
    updateOrder: builder.mutation({
      query: (data) => ({
        url: `${ORDERS_URL}/${data.orderId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Orders'],
    }),
    getMyOrders: builder.query({ //orders associated with a user
      query: () => ({
        url: `${ORDERS_URL}/myorders`,
      }),
      keepUnusedDataFor: 5
    }),
    uploadOrderDocument: builder.mutation({
      query: (data) => ({
        url: `${UPLOAD_URL}`,
        method: 'POST',
        body: data,
      }),
    }),
  }),
})

export const {
  useGetOrdersQuery, 
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  useUpdateOrderStatusMutation,
  useDeleteOrCancelOrderMutation,
  useUpdateOrderMutation,
  useGetMyOrdersQuery,
  useUploadOrderDocumentMutation,
} = ordersApiSlice;