import { configureStore} from '@reduxjs/toolkit'
import { apiSlice } from './slices/apiSlice'
import bookingSliceReducer from './slices/bookingSlice'

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    booking: bookingSliceReducer, //check if it will be needed
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
})

export default store