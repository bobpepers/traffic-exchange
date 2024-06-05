import {
  FETCH_RUNESVOLUME_BEGIN,
  FETCH_RUNESVOLUME_SUCCESS,
  FETCH_RUNESVOLUME_FAILURE,
} from '../actions/types/index';

const initialState = {
  volume: 0,
  isFetching: true, // Default to fetching..
  error: null
};
export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_RUNESVOLUME_BEGIN:
      return {
        ...state,
        isFetching: true,
        error: null
      };
    case FETCH_RUNESVOLUME_SUCCESS:
      return {
        ...state,
        volume: action.payload,
        isFetching: false
      };
    case FETCH_RUNESVOLUME_FAILURE:
      return {
        ...state,
        error: action.error,
        isFetching: false
      };
    default:
      return state;
  }
};