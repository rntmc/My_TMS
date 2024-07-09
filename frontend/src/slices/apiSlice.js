// parent to other apiSlices - Dealing with asynchronous requests
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'

import {BASE_URL} from '../constants'

const baseQuery = fetchBaseQuery({baseUrl: BASE_URL})

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['Load', 'Order', 'User', 'Carrier', 'Suppliers'],
  endpoints: (builder) => ({})
})