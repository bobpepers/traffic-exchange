import {
  BUY_PUBLISHERSLOT_IDLE,
  BUY_PUBLISHERSLOT_BEGIN,
  BUY_PUBLISHERSLOT_SUCCESS,
  BUY_PUBLISHERSLOT_FAIL,
} from '../actions/types/index';

const initialState = {
  data: 0,
  isFetching: false, // Default to fetching..
  phase: 0,
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case BUY_PUBLISHERSLOT_IDLE:
      return {
        data: 0,
        isFetching: false,
        phase: 0,
        error: null,
      };
    case BUY_PUBLISHERSLOT_BEGIN:
      return {
        ...state,
        isFetching: true,
        phase: 0,
        error: null,
      };
    case BUY_PUBLISHERSLOT_SUCCESS:
      return {
        ...state,
        data: action.payload,
        phase: 1,
        isFetching: false,
      };
    case BUY_PUBLISHERSLOT_FAIL:
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
