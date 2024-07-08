import { USERS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({ //endpoint: {{baseURL}}/users/auth
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({ //data: email, password
        url: `${USERS_URL}/auth`,
        method: 'POST',
        body: data
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`,
        method: 'POST',
        body: data
      }),
    }),
    logout : builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: 'POST',
      })
    }),
    getUsers: builder.query({
      query: () => ({
        url: USERS_URL
      }),
      providesTags: ['Users'],
      keepUnusedDataFor: 5
    }),
  }),
})

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useGetUsersQuery,
} = usersApiSlice;