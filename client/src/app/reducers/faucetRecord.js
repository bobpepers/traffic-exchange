import {
  FETCH_FAUCETRECORD_BEGIN,
  FETCH_FAUCETRECORD_SUCCESS,
  FETCH_FAUCETRECORD_FAIL,
} from '../actions/types/index';

const initialState = {
  loading: false,
  error: null,
};

export default function faucetRecordReducer(
  state = initialState,
  action,
) {
  switch (action.type) {
    case FETCH_FAUCETRECORD_BEGIN:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_FAUCETRECORD_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };

    case FETCH_FAUCETRECORD_FAIL:
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
