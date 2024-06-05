import {
  FETCH_BANNERORDER_BEGIN,
  FETCH_BANNERORDER_SUCCESS,
  FETCH_BANNERORDER_FAIL,
} from '../actions/types/index';

const initialState = {
  data: 0,
  isFetching: false, // Default to fetching..
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_BANNERORDER_BEGIN:
      return {
        ...state,
        isFetching: true,
        error: null,
      };
    case FETCH_BANNERORDER_SUCCESS:
      return {
        ...state,
        data: action.payload.data,
        isFetching: false,
      };
    case FETCH_BANNERORDER_FAIL:
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
