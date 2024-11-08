import * as actionType from "./actionTypes";

const initState = {
  movies: [],
  isError: false,
  isLoading: false,
};

export const movieReducer = (state = initState, action) => {
  switch (action.type) {
    case actionType.GET_MOVIE_REQUEST:
      return {
        ...state,
        isLoading: true,
      };
    case actionType.GET_MOVIE_SUCCESS:
      return {
        ...state,
        movies: action.payload,
        isLoading: false,
        isError: false,
      };
    case actionType.GET_MOVIE_FAILURE:
      return {
        ...state,
        isError: true,
        isLoading: false,
      };
    default:
      return state;
  }
};
