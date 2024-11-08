import { configureStore } from "@reduxjs/toolkit";
import { reducer as appReducer } from "./app/reducer";
import { movieReducer } from "./data/reducer";
import { cinemasReducer } from "./cinemas/cinemasReducer";
import { bookingReducer } from "./booking_details/bookingReducer";
import { foodReducer } from "./food/reducer";
import { bookingDataReducer } from "./booking/bookingDataReducer";

const rootReducer = {
  app: appReducer,
  cinemas: cinemasReducer,
  data: movieReducer,
  booking_details: bookingReducer,
  food: foodReducer,
  after_payment: bookingDataReducer,
};

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== "production", // Enables Redux DevTools in development
});

export { store };
