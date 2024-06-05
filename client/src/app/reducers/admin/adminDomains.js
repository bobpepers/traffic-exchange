import {
  FETCH_ADMINDOMAINS_BEGIN,
  FETCH_ADMINDOMAINS_SUCCESS,
  FETCH_ADMINDOMAINS_FAIL,
  UPDATE_ADMIN_DOMAIN,
} from '../../actions/types/index';

const initialState = {
  data: null,
  loading: false,
  error: null,
};

export default function adminDomainsReducer(
  state = initialState,
  action,
) {
  switch (action.type) {
    case FETCH_ADMINDOMAINS_BEGIN:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_ADMINDOMAINS_SUCCESS:
      console.log('FETCH_ADMINPUBLISHERS_SUCCESS');
      console.log(action.payload);
      return {
        ...state,
        loading: false,
        data: action.payload,
      };

    case FETCH_ADMINDOMAINS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        data: null,
      };

    case UPDATE_ADMIN_DOMAIN:
      return {
        ...state,
        loading: false,
        data: [
          ...state.data.map(
            (domain) => (domain.id === action.payload.id
              ? action.payload
              : domain),
          ),
        ],
      };

    default:
      return state;
  }
}
