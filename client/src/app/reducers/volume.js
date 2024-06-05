import {
  FETCH_VOLUME_BEGIN,
  FETCH_VOLUME_SUCCESS,
  FETCH_VOLUME_FAIL,
} from '../actions/types/index';

const initialState = {
  volume: 0,
  isFetching: false, // Default to fetching..
  error: null,
};
export default (state = initialState, action) => {
  console.log(action.payload);
  switch (action.type) {
    case FETCH_VOLUME_BEGIN:
      return {
        ...state,
        isFetching: true,
        error: null,
      };
    case FETCH_VOLUME_SUCCESS:
      return {
        ...state,
        volume: action.payload,
        isFetching: false,
      };
    case FETCH_VOLUME_FAIL:
      return {
        ...state,
        error: action.error,
        isFetching: false,
      };
    default:
      return state;
  }
};
