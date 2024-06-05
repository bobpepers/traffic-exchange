import axios from 'axios';
import {
  FETCH_PRICE_BEGIN,
  FETCH_PRICE_SUCCESS,
  FETCH_PRICE_FAIL,
} from './types/index';

export function getPrice() {
  return function (dispatch) {
    dispatch({
      type: FETCH_PRICE_BEGIN,
    });
    axios.get(`${process.env.API_URL}/price`).then((response) => {
      dispatch({
        type: FETCH_PRICE_SUCCESS,
        payload: response.data,
      });
    })
      .catch((error) => {
        console.log(error);
        dispatch({
          type: FETCH_PRICE_FAIL,
          payload: error,
        });
      });
  }
}

export function onUpdatePrice(data) {
  return function (dispatch) {
    dispatch({
      type: FETCH_PRICE_SUCCESS,
      payload: data,
    });
  }
}
