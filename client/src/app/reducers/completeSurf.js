import {
  FETCH_SURFCOMPLETE_BEGIN,
  FETCH_SURFCOMPLETE_SUCCESS,
  FETCH_SURFCOMPLETE_FAILURE,
} from '../actions/types/index';

const initialState = {
  data: [],
  isFetching: false, // Default to fetching..
  error: null,
};
export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SURFCOMPLETE_BEGIN:
      return {
        ...state,
        isFetching: true,
        error: null,
      };
    case FETCH_SURFCOMPLETE_SUCCESS:
      return {
        ...state,
        data: action.payload,
        isFetching: false,
      };
    case FETCH_SURFCOMPLETE_FAILURE:
      return {
        ...state,
        error: action.error,
        isFetching: false,
      };
    default:
      return state;
  }
};
