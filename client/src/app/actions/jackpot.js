import axios from 'axios';
import {
  FETCH_JACKPOT_BEGIN,
  FETCH_JACKPOT_SUCCESS,
  FETCH_JACKPOT_FAIL,
  UPDATE_JACKPOT,
} from './types/index';

export function fetchJackpots() {
  return function (dispatch) {
    dispatch({
      type: FETCH_JACKPOT_BEGIN,
    });
    axios.get(`${process.env.API_URL}/jackpots`)
      .then((response) => {
        dispatch({
          type: FETCH_JACKPOT_SUCCESS,
          payload: response,
        })
      }).catch((error) => {
        dispatch({
          type: FETCH_JACKPOT_FAIL,
          payload: error,
        });
      });
  }
}

export function onUpdateJackpot(payload) {
  return function (dispatch) {
    dispatch({
      type: UPDATE_JACKPOT,
      payload,
    });
  }
}
