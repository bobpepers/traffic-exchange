import {
  FETCH_RECENTUSERACTIVITY_BEGIN,
  FETCH_RECENTUSERACTIVITY_SUCCESS,
  FETCH_RECENTUSERACTIVITY_FAIL,
} from '../actions/types/index';

const initialState = {
  loading: false,
  error: null,
  data: [],
};

export default function userReducer(
  state = initialState,
  action,
) {
  switch (action.type) {
    case FETCH_RECENTUSERACTIVITY_BEGIN:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_RECENTUSERACTIVITY_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload.activity,
      };

    case FETCH_RECENTUSERACTIVITY_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        data: [],
      };

    default:
      return state;
  }
}
