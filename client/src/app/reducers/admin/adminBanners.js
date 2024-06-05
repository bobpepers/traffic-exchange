import {
  FETCH_ADMINBANNERS_BEGIN,
  FETCH_ADMINBANNERS_SUCCESS,
  FETCH_ADMINBANNERS_FAIL,
  UPDATE_ADMIN_BANNER,
} from '../../actions/types/index';

const initialState = {
  data: null,
  loading: false,
  error: null,
};

export default function adminPublishersReducer(
  state = initialState,
  action,
) {
  switch (action.type) {
    case FETCH_ADMINBANNERS_BEGIN:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_ADMINBANNERS_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };

    case FETCH_ADMINBANNERS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        data: null,
      };

    case UPDATE_ADMIN_BANNER:
      return {
        ...state,
        loading: false,
        data: [
          ...state.data.map(
            (banner) => (banner.id === action.payload.id
              ? action.payload
              : banner),
          ),
        ],
      };

    default:
      return state;
  }
}
