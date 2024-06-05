import {
  FETCH_FAUCETROLLS_BEGIN,
  FETCH_FAUCETROLLS_SUCCESS,
  FETCH_FAUCETROLLS_FAIL,
  INSERT_FAUCETROLL,
} from '../actions/types/index';

const initialState = {
  loading: false,
  error: null,
};

export default function faucetRollsReducer(
  state = initialState,
  action,
) {
  switch (action.type) {
    case FETCH_FAUCETROLLS_BEGIN:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_FAUCETROLLS_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };

    case FETCH_FAUCETROLLS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        data: null,
      };

    case INSERT_FAUCETROLL:
      return {
        ...state,
        loading: false,
        error: null,
        data: [
          {
            ...action.payload,
          },
          ...state.data,
        ],
      };

    default:
      return state;
  }
}
