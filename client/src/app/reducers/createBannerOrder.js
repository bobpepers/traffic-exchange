import {
  CREATE_BANNERORDER_IDLE,
  CREATE_BANNERORDER_BEGIN,
  CREATE_BANNERORDER_SUCCESS,
  CREATE_BANNERORDER_FAIL,
  INSERT_BANNERORDER,
} from '../actions/types/index';

const initialState = {
  data: 0,
  isFetching: false, // Default to fetching..
  phase: 0,
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CREATE_BANNERORDER_IDLE:
      return {
        data: 0,
        isFetching: false,
        phase: 0,
        error: null,
      };
    case CREATE_BANNERORDER_BEGIN:
      return {
        ...state,
        isFetching: true,
        phase: 0,
        error: null,
      };
    case CREATE_BANNERORDER_SUCCESS:
      return {
        ...state,
        data: action.payload,
        phase: 1,
        isFetching: false,
      };
    case CREATE_BANNERORDER_FAIL:
      console.log('Error: ', action.error);
      return {
        ...state,
        error: action.error,
        phase: 2,
        isFetching: false,
      };
    default:
      return state;
  }
};
