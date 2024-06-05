import {
  FETCH_ADMINPUBLISHERS_BEGIN,
  FETCH_ADMINPUBLISHERS_SUCCESS,
  FETCH_ADMINPUBLISHERS_FAIL,
  UPDATE_ADMIN_PUBLISHER,
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
    case FETCH_ADMINPUBLISHERS_BEGIN:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_ADMINPUBLISHERS_SUCCESS:
      console.log('FETCH_ADMINPUBLISHERS_SUCCESS');
      console.log(action.payload);
      return {
        ...state,
        loading: false,
        data: action.payload,
      };

    case FETCH_ADMINPUBLISHERS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        data: null,
      };

    case UPDATE_ADMIN_PUBLISHER:
      return {
        ...state,
        loading: false,
        data: [
          ...state.data.map(
            (publisher) => (publisher.id === action.payload.id
              ? action.payload
              : publisher),
          ),
        ],
      };

    default:
      return state;
  }
}
