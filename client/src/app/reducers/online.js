import {
  FETCH_ONLINE_BEGIN,
  FETCH_ONLINE_SUCCESS,
  FETCH_ONLINE_FAILURE,
} from '../actions/types/index';

const initialState = {
  people: 0,
  isFetching: true, // Default to fetching..
  error: null,
};
export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ONLINE_BEGIN:
      return {
        ...state,
        isFetching: true,
        error: null,
      };
    case FETCH_ONLINE_SUCCESS:
      return {
        ...state,
        people: action.payload,
        isFetching: false,
      };
    case FETCH_ONLINE_FAILURE:
      console.log('Error: ', action.error);
      return {
        ...state,
        error: action.error,
        isFetching: false,
      };
    default:
      return state;
  }
};
