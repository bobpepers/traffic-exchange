import {
  FETCH_ACTIVITY_BEGIN,
  FETCH_ACTIVITY_SUCCESS,
  FETCH_ACTIVITY_FAIL,
  INSERT_ACTIVITY,
} from '../actions/types/index';

const initialState = {
  loading: false,
  error: null,
};

export default function userReducer(
  state = initialState,
  action,
) {
  switch (action.type) {
    case FETCH_ACTIVITY_BEGIN:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_ACTIVITY_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload.activity,
      };

    case FETCH_ACTIVITY_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        data: null,
      };

    case INSERT_ACTIVITY: {
      return {
        ...state,
        data: [
          action.payload,
          ...state.data,
        ],
        loading: false,
        error: null,
      }; }

    default:
      return state;
  }
}
