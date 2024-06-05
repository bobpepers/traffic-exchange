import axios from 'axios';
import {
  FETCH_BANNERORDER_BEGIN,
  FETCH_BANNERORDER_SUCCESS,
  FETCH_BANNERORDER_FAIL,
} from './types/index';

export function fetchBannerOrders() {
  return function (dispatch) {
    dispatch({
      type: FETCH_BANNERORDER_BEGIN,
    });
    axios.get(`${process.env.API_URL}/orders/banner`)
      .then((response) => {
        dispatch({
          type: FETCH_BANNERORDER_SUCCESS,
          payload: response.data,
        })
      }).catch((error) => {
        dispatch({
          type: FETCH_BANNERORDER_FAIL,
          payload: error,
        });
      });
  }
}
