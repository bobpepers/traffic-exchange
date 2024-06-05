import {
  ADD_ADZONE_IDLE,
  ADD_ADZONE_BEGIN,
  ADD_ADZONE_SUCCESS,
  ADD_ADZONE_FAIL,
} from '../actions/types/index';

const initialState = {
  data: 0,
  isFetching: false, // Default to fetching..
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_ADZONE_IDLE:
      return {
        data: false,
        isFetching: false,
        error: null,
      };
    case ADD_ADZONE_BEGIN:
      return {
        ...state,
        isFetching: true,
        error: null,
      };
    case ADD_ADZONE_SUCCESS:
      console.log(action.payload);
      console.log('ADD_PUBLISHER_SUCCESS payload')
      return {
        ...state,
        data: action.payload,
        isFetching: false,
      };
    case ADD_ADZONE_FAIL:
      return {
        ...state,
        error: action.payload.error,
        isFetching: false,
      };
    default:
      return state;
  }
};
