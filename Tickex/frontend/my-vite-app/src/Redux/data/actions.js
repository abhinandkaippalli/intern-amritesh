import * as actionType from "./actionTypes";
import axios from "axios";

const getMovieRequest = () => {
  return {
    type: actionType.GET_MOVIE_REQUEST,
  };
};

const getMovieSuccess = (payload) => {
  return {
    type: actionType.GET_MOVIE_SUCCESS,
    payload,
  };
};

const getMovieFailure = (error) => {
  return {
    type: actionType.GET_MOVIE_FAILURE,
    payload: {
      error: error,
    },
  };
};

// Fetch movie details by ID
export const getMovies = (id) => (dispatch) => {
  dispatch(getMovieRequest());
  return axios
    .get(`/api/movies/${id}`)
    .then((res) => {
      dispatch(getMovieSuccess(res.data));
    })
    .catch((err) => dispatch(getMovieFailure(err)));
};

// Update movie rating by ID
export const putMovies = (id, param) => (dispatch) => {
  return axios
    .patch(`/api/movies/${id}/rate`, param)
    .then((res) => {
      dispatch(getMovies(id));
    })
    .catch((err) => dispatch(getMovieFailure(err)));
};
