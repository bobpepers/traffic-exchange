import {
  FETCH_REGISTERED_BEGIN,
  FETCH_REGISTERED_SUCCESS,
  FETCH_REGISTERED_FAILURE,
} from '../actions/types/index';

const initialState = {
  people: 0,
  isFetching: true, // Default to fetching..
  error: null,
};
export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_REGISTERED_BEGIN:
      return {
        ...state,
        isFetching: true,
        error: null,
      };
    case FETCH_REGISTERED_SUCCESS:
      return {
        ...state,
        people: action.payload,
        isFetching: false,
      };
    case FETCH_REGISTERED_FAILURE:
      return {
        ...state,
        error: action.error,
        isFetching: false,
      };
    default:
      return state;
  }
};
