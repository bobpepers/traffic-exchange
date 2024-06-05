import {
  FETCH_ADMINWITHDRAWAL_BEGIN,
  FETCH_ADMINWITHDRAWAL_FAIL,
  FETCH_ADMINWITHDRAWAL_SUCCESS,
  UPDATE_WITHDRAW,
} from '../../actions/types/index';

const initialState = {
  data: null,
  loading: false,
  error: null,
};

export default function adminWithdrawalReducer(
  state = initialState,
  action,
) {
  switch (action.type) {
    case FETCH_ADMINWITHDRAWAL_BEGIN:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_ADMINWITHDRAWAL_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload.withdrawals,
      };

    case FETCH_ADMINWITHDRAWAL_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        data: null,
      };

    case UPDATE_WITHDRAW:
      console.log(action.payload);
      console.log('update withdrawal reducer');
      return {
        ...state,
        loading: false,
        data: state.data.map((transaction) => (transaction.id === action.payload.id
          ? action.payload
          : transaction)),
      };

    default:
      return state;
  }
}
