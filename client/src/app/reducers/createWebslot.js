import {
  CREATE_WEBSLOT_IDLE,
  CREATE_WEBSLOT_BEGIN,
  CREATE_WEBSLOT_SUCCESS,
  CREATE_WEBSLOT_FAIL,
} from '../actions/types/index';

const initialState = {
  data: 0,
  isFetching: false, // Default to fetching..
  phase: 0,
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CREATE_WEBSLOT_IDLE:
      return {
        data: 0,
        isFetching: false,
        phase: 0,
        error: null,
      };
    case CREATE_WEBSLOT_BEGIN:
      return {
        ...state,
        isFetching: true,
        phase: 0,
        error: null,
      };
    case CREATE_WEBSLOT_SUCCESS:
      return {
        ...state,
        data: action.payload,
        phase: 1,
        isFetching: false,
      };
    case CREATE_WEBSLOT_FAIL:
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
