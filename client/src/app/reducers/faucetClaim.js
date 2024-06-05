import {
  FETCH_FAUCETCLAIM_BEGIN,
  FETCH_FAUCETCLAIM_SUCCESS,
  FETCH_FAUCETCLAIM_FAIL,
} from '../actions/types/index';

const initialState = {
  loading: false,
  error: null,
};

export default function faucetClaimReducer(
  state = initialState,
  action,
) {
  switch (action.type) {
    case FETCH_FAUCETCLAIM_BEGIN:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_FAUCETCLAIM_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };

    case FETCH_FAUCETCLAIM_FAIL:
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
