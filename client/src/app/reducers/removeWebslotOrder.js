import {
  REMOVE_WEBSLOT_ORDER_IDLE,
  REMOVE_WEBSLOT_ORDER_BEGIN,
  REMOVE_WEBSLOT_ORDER_SUCCESS,
  REMOVE_WEBSLOT_ORDER_FAIL,
} from '../actions/types/index';

const initialState = {
  data: 0,
  isFetching: false, // Default to fetching..
  phase: 0,
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case REMOVE_WEBSLOT_ORDER_IDLE:
      return {
        data: 0,
        isFetching: false,
        phase: 0,
        error: null,
      };
    case REMOVE_WEBSLOT_ORDER_BEGIN:
      return {
        ...state,
        isFetching: true,
        phase: 0,
        error: null,
      };
    case REMOVE_WEBSLOT_ORDER_SUCCESS:
      return {
        ...state,
        data: action.payload,
        phase: 1,
        isFetching: false,
      };
    case REMOVE_WEBSLOT_ORDER_FAIL:
      console.log('Error: ', action.payload.response.data.error);
      return {
        ...state,
        error: action.payload.response.data.error,
        phase: 2,
        isFetching: false,
      };
    default:
      return state;
  }
};
