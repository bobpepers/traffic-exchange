import axios from 'axios';
import {
  FETCH_ORDER_BEGIN,
  FETCH_ORDER_SUCCESS,
  FETCH_ORDER_FAIL,
} from './types/index';

export function fetchSurfOrders() {
  return function (dispatch) {
    dispatch({
      type: FETCH_ORDER_BEGIN,
    });
    axios.get(`${process.env.API_URL}/orders/surf`)
      .then((response) => {
        dispatch({
          type: FETCH_ORDER_SUCCESS,
          payload: response.data,
        })
      }).catch((error) => {
        dispatch({
          type: FETCH_ORDER_FAIL,
          payload: error,
        });
      });
  }
}
