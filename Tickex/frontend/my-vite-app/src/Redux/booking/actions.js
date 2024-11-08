// Redux/booking/actions.js
import axios from "axios";
import {
  ADD_BOOKING_DETAILS_REQUEST,
  ADD_BOOKING_DETAILS_SUCCESS,
  ADD_BOOKING_DETAILS_FAILURE,
  GET_BOOKING_DETAILS_REQUEST,
  GET_BOOKING_DETAILS_SUCCESS,
  GET_BOOKING_DETAILS_FAILURE,
  CHECKOUT_REQUEST,
  CHECKOUT_SUCCESS,
  CHECKOUT_FAILURE,
  ADD_DONATION_REQUEST,
  ADD_DONATION_SUCCESS,
  ADD_DONATION_FAILURE,
} from "./actionTypes";

// POST Booking Details (Book Seats)
const postBookingDetailsRequest = () => ({ type: ADD_BOOKING_DETAILS_REQUEST });
const postBookingDetailsSuccess = (payload) => ({
  type: ADD_BOOKING_DETAILS_SUCCESS,
  payload,
});
const postBookingDetailsFailure = (error) => ({
  type: ADD_BOOKING_DETAILS_FAILURE,
  error,
});

export const postBookingDetails = (payload) => (dispatch) => {
  dispatch(postBookingDetailsRequest());
  return axios
    .post("/api/booking/book", payload)
    .then((res) => {
      dispatch(postBookingDetailsSuccess(res.data));
      return { success: true };
    })
    .catch((error) => {
      dispatch(postBookingDetailsFailure(error));
      return { success: false };
    });
};

// GET Booking Summary
const getBookingDetailsRequest = () => ({ type: GET_BOOKING_DETAILS_REQUEST });
const getBookingDetailsSuccess = (payload) => ({
  type: GET_BOOKING_DETAILS_SUCCESS,
  payload,
});
const getBookingDetailsFailure = (error) => ({
  type: GET_BOOKING_DETAILS_FAILURE,
  error,
});

export const getBookingDetails = () => (dispatch) => {
  dispatch(getBookingDetailsRequest());
  return axios
    .get("/api/booking/summary")
    .then((res) => {
      dispatch(getBookingDetailsSuccess(res.data));
    })
    .catch((error) => dispatch(getBookingDetailsFailure(error)));
};

// POST Checkout (Confirm Booking Payment)
const checkoutRequest = () => ({ type: CHECKOUT_REQUEST });
const checkoutSuccess = (payload) => ({ type: CHECKOUT_SUCCESS, payload });
const checkoutFailure = (error) => ({ type: CHECKOUT_FAILURE, error });

export const checkoutBooking = (bookingId, paymentDetails) => (dispatch) => {
  dispatch(checkoutRequest());
  return axios
    .post(`/api/booking/checkout`, { bookingId, paymentDetails })
    .then((res) => {
      dispatch(checkoutSuccess(res.data));
      return { success: true };
    })
    .catch((error) => {
      dispatch(checkoutFailure(error));
      return { success: false };
    });
};

// POST Add Donation
const addDonationRequest = () => ({ type: ADD_DONATION_REQUEST });
const addDonationSuccess = (payload) => ({
  type: ADD_DONATION_SUCCESS,
  payload,
});
const addDonationFailure = (error) => ({ type: ADD_DONATION_FAILURE, error });

export const addDonation = (bookingId, donationAmount) => (dispatch) => {
  dispatch(addDonationRequest());
  return axios
    .post("/api/booking/add-donation", { bookingId, donationAmount })
    .then((res) => {
      dispatch(addDonationSuccess(res.data));
      return { success: true };
    })
    .catch((error) => {
      dispatch(addDonationFailure(error));
      return { success: false };
    });
};
