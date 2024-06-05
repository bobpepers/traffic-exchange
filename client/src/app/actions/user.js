import axios from 'axios';
import {
  FETCH_USER_BEGIN,
  FETCH_USER_FAIL,
  FETCH_USER_SUCCESS,
  UPDATE_TRANSACTION,
  INSERT_TRANSACTION,
  UPDATE_WALLET,
  UPDATE_WEBSLOT,
  UPDATE_JACKPOT_TICKETS,
  // UPDATE_PRICE,
} from './types/index';

/**
 * Fetch User Data
 */
export function fetchUserData() {
  return function (dispatch) {
    dispatch({
      type: FETCH_USER_BEGIN,
    });
    // axios.get(`${API_URL}/user`, { headers: { authorization: user.token } })
    axios.get(`${process.env.API_URL}/user`)
      .then((response) => {
        dispatch({
          type: FETCH_USER_SUCCESS,
          payload: response.data,
        });
      }).catch((error) => {
        dispatch({
          type: FETCH_USER_FAIL,
          payload: error,
        });
      });
  }
}

export function onUpdateTransaction(data) {
  return function (dispatch) {
    dispatch({
      type: UPDATE_TRANSACTION,
      payload: data,
    });
  }
}

export function onInsertTransaction(data) {
  return function (dispatch) {
    dispatch({
      type: INSERT_TRANSACTION,
      payload: data,
    });
  }
}

export function onUpdateJackpotTickets(data) {
  return function (dispatch) {
    dispatch({
      type: UPDATE_JACKPOT_TICKETS,
      payload: data,
    });
  }
}

export function onUpdateWallet(data) {
  return function (dispatch) {
    dispatch({
      type: UPDATE_WALLET,
      payload: data,
    });
  }
}
export function onUpdateWebslot(data) {
  return function (dispatch) {
    dispatch({
      type: UPDATE_WEBSLOT,
      payload: data,
    });
  }
}
// export function onUpdatePrice(data) {
//  return function (dispatch) {
//    dispatch({
//      type: UPDATE_PRICE,
//      payload: data,
//    });
//  }
// }
