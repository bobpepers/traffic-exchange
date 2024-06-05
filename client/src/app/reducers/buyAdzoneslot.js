import {
  BUY_ADZONESLOT_IDLE,
  BUY_ADZONESLOT_BEGIN,
  BUY_ADZONESLOT_SUCCESS,
  BUY_ADZONESLOT_FAIL,
} from '../actions/types/index';

const initialState = {
  data: 0,
  isFetching: false, // Default to fetching..
  phase: 0,
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case BUY_ADZONESLOT_IDLE:
      return {
        data: 0,
        isFetching: false,
        phase: 0,
        error: null,
      };
    case BUY_ADZONESLOT_BEGIN:
      return {
        ...state,
        isFetching: true,
        phase: 0,
        error: null,
      };
    case BUY_ADZONESLOT_SUCCESS:
      return {
        ...state,
        data: action.payload,
        phase: 1,
        isFetching: false,
      };
    case BUY_ADZONESLOT_FAIL:
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
