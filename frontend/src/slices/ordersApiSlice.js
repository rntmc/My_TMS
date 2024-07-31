import { ORDERS_URL, UPLOADS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const ordersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: ({ keyword } = {}) => {
        const params = {};
        if (keyword) {
          params.keyword = keyword;
        }
        return {
          url: ORDERS_URL,
          params,
        };
      },
      providesTags: ['Orders'],
      keepUnusedDataFor: 5,
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
      }),
      invalidatesTags: ['Orders'],
    }),
    updateOrderStatus: builder.mutation({
      query: ({ orderId, status }) => ({
        url: `${ORDERS_URL}/${orderId}`,
        method: 'PATCH',
        body: {status},
      }),
      invalidatesTags: ['Orders'],
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
      query: ({ keyword } = {}) => {
        const params = {};
        if (keyword) {
          params.keyword = keyword;
        }
        return {
          url: `${ORDERS_URL}/myorders`,
          params,
        };
      },
      keepUnusedDataFor: 5
    }),
    uploadOrderDocument: builder.mutation({
      query: (data) => ({
        url: `${UPLOADS_URL}`,
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