import {
  ADD_PUBLISHER_BEGIN,
  ADD_PUBLISHER_SUCCESS,
  ADD_PUBLISHER_FAIL,
  ADD_PUBLISHER_IDLE,
} from '../actions/types/index';

const initialState = {
  data: 0,
  isFetching: false, // Default to fetching..
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_PUBLISHER_IDLE:
      console.log('ADD_PUBLISHER_IDLE')
      return {
        data: false,
        isFetching: false,
        error: null,
      };
    case ADD_PUBLISHER_BEGIN:
      return {
        ...state,
        isFetching: true,
        error: null,
      };
    case ADD_PUBLISHER_SUCCESS:
      console.log(action.payload);
      console.log('ADD_PUBLISHER_SUCCESS payload')
      return {
        ...state,
        data: action.payload,
        isFetching: false,
      };
    case ADD_PUBLISHER_FAIL:
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
