import axios from 'axios';
import {
  REJECT_WITHDRAW_BEGIN,
  REJECT_WITHDRAW_SUCCESS,
  REJECT_WITHDRAW_FAIL,
  ACCEPT_WITHDRAW_BEGIN,
  ACCEPT_WITHDRAW_SUCCESS,
  ACCEPT_WITHDRAW_FAIL,
  UPDATE_WITHDRAW,
} from './types/index';

export function rejectWithdrawal(obj) {
  console.log(`reducer reject ${obj}`);
  return function (dispatch) {
    dispatch({
      type: REJECT_WITHDRAW_BEGIN,
    });
    axios.post(`${process.env.API_URL}/admin/withdraw/reject`, obj)
      .then((response) => {
        console.log(response);
        console.log('reject withdrawal response!')
        dispatch({
          type: REJECT_WITHDRAW_SUCCESS,
          payload: response.data.transaction,
        });
        dispatch({
          type: UPDATE_WITHDRAW,
          payload: response.data.transaction,
        });
      }).catch((error) => {
        dispatch({
          type: REJECT_WITHDRAW_FAIL,
          payload: error,
        });
      });
  }
}

export function acceptWithdrawal(obj) {
  return function (dispatch) {
    dispatch({
      type: ACCEPT_WITHDRAW_BEGIN,
    });
    axios.post(`${process.env.API_URL}/admin/withdraw/accept`, obj)
      .then((response) => {
        console.log(response);
        console.log('accept withdrawal response!')
        dispatch({
          type: ACCEPT_WITHDRAW_SUCCESS,
          payload: response.data.transaction,
        });
        dispatch({
          type: UPDATE_WITHDRAW,
          payload: response.data.transaction,
        });
      }).catch((error) => {
        dispatch({
          type: ACCEPT_WITHDRAW_FAIL,
          payload: error,
        });
      });
  }
}
