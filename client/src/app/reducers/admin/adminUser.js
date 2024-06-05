import {
  FETCH_ADMINUSER_BEGIN,
  FETCH_ADMINUSER_SUCCESS,
  FETCH_ADMINUSER_FAIL,
} from '../../actions/types/index';

const initialState = {
  data: null,
  loading: false,
  error: null,
};

export default function adminUserReducer(
  state = initialState,
  action,
) {
  switch (action.type) {
    case FETCH_ADMINUSER_BEGIN:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_ADMINUSER_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload.user,
      };

    case FETCH_ADMINUSER_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        data: null,
      };

    default:
      return state;
  }
}
