import {
  FETCH_SURFSTART_BEGIN,
  FETCH_SURFSTART_SUCCESS,
  FETCH_SURFSTART_FAILURE,
} from '../actions/types/index';

const initialState = {
  data: [],
  isFetching: true, // Default to fetching..
  error: null,
};
export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SURFSTART_BEGIN:
      return {
        ...state,
        isFetching: true,
        error: null,
      };
    case FETCH_SURFSTART_SUCCESS:
      return {
        ...state,
        data: action.payload,
        isFetching: false,
      };
    case FETCH_SURFSTART_FAILURE:
      return {
        ...state,
        error: action.payload.response.data.error,
        isFetching: false,
      };
    default:
      return state;
  }
};
