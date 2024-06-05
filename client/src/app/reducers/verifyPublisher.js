import {
  VERIFY_PUBLISHER_BEGIN,
  VERIFY_PUBLISHER_SUCCESS,
  VERIFY_PUBLISHER_FAIL,
  VERIFY_PUBLISHER_IDLE,
} from '../actions/types/index';

const initialState = {
  data: 0,
  isFetching: false, // Default to fetching..
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case VERIFY_PUBLISHER_IDLE:
      return {
        data: false,
        isFetching: false,
        error: null,
      };
    case VERIFY_PUBLISHER_BEGIN:
      return {
        ...state,
        isFetching: true,
        error: null,
      };
    case VERIFY_PUBLISHER_SUCCESS:
      return {
        ...state,
        data: action.payload,
        isFetching: false,
      };
    case VERIFY_PUBLISHER_FAIL:
      console.log('ADD_PUBLISHER_FAIL');
      console.log(action.payload);
      return {
        ...state,
        error: action.payload.error,
        isFetching: false,
      };
    default:
      return state;
  }
};
