import {
  UPLOAD_AVATAR_BEGIN,
  UPLOAD_AVATAR_SUCCESS,
  UPLOAD_AVATAR_FAIL,
} from '../actions/types/index';

const initialState = {
  data: 0,
  isFetching: false, // Default to fetching..
  error: null,
};
export default (state = initialState, action) => {
  switch (action.type) {
    case UPLOAD_AVATAR_BEGIN:
      return {
        ...state,
        isFetching: true,
        error: null,
      };
    case UPLOAD_AVATAR_SUCCESS:
      return {
        ...state,
        data: action.payload,
        isFetching: false,
      };
    case UPLOAD_AVATAR_FAIL:
      return {
        ...state,
        error: action.error,
        isFetching: false,
      };
    default:
      return state;
  }
};
