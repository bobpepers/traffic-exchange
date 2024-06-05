import {
  FETCH_ADMINUSERLIST_BEGIN,
  FETCH_ADMINUSERLIST_SUCCESS,
  FETCH_ADMINUSERLIST_FAIL,
  UPDATE_ADMIN_USER,
} from '../../actions/types/index';

const initialState = {
  data: null,
  loading: false,
  error: null,
};

export default function adminUserListReducer(
  state = initialState,
  action,
) {
  switch (action.type) {
    case FETCH_ADMINUSERLIST_BEGIN:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_ADMINUSERLIST_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload.userlist,
      };

    case FETCH_ADMINUSERLIST_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        data: null,
      };

    case UPDATE_ADMIN_USER:
      return {
        ...state,
        loading: false,
        data: [
          ...state.data.map(
            (user) => (user.id === action.payload.id
              ? action.payload
              : user),
          ),
        ],
      };

    default:
      return state;
  }
}
