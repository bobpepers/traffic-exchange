import {
  ADD_BANNER_BEGIN,
  ADD_BANNER_SUCCESS,
  ADD_BANNER_FAIL,
  ADD_BANNER_IDLE,
} from '../actions/types/index';

const initialState = {
  data: 0,
  isFetching: false, // Default to fetching..
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_BANNER_IDLE:
      console.log('ADD_BANNER_IDLE')
      return {
        data: false,
        isFetching: false,
        error: null,
      };
    case ADD_BANNER_BEGIN:
      return {
        ...state,
        isFetching: true,
        error: null,
      };
    case ADD_BANNER_SUCCESS:
      console.log(action.payload);
      console.log('ADD_PUBLISHER_SUCCESS payload')
      return {
        ...state,
        data: action.payload,
        isFetching: false,
      };
    case ADD_BANNER_FAIL:
      console.log('ADD_BANNER_FAIL');
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
