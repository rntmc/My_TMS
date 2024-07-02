//Not dealing with asynchronous requests
import { createSlice } from "@reduxjs/toolkit";
import { useGetLoadDetailsQuery } from "./loadsApiSlice";

const initialState = localStorage.getItem("booking") ? JSON.parse(localStorage.getItem("booking")) : {bookings: []}

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    addToBooking: (state, action) => {
      const booking = action.payload;

      const existBooking = state.bookings.find((b) => b._id === booking._id);

      if(existBooking) {
        state.bookings = state.bookings.map((x) => x._id === existBooking._id ? booking : x );
      } else {
        state.bookings = [...state.bookings, booking]
      }
    }
  }
})

export default bookingSlice.reducer;