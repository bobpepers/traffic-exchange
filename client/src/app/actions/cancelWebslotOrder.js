import axios from 'axios';
import {
  REMOVE_WEBSLOT_ORDER_IDLE,
  REMOVE_WEBSLOT_ORDER_BEGIN,
  REMOVE_WEBSLOT_ORDER_SUCCESS,
  REMOVE_WEBSLOT_ORDER_FAIL,
  REMOVE_WEBSLOT_ORDER,
  ENQUEUE_SNACKBAR,
} from './types/index';

export function idleCancelWebslotOrder() {
  return function (dispatch) {
    dispatch({
      type: REMOVE_WEBSLOT_ORDER_IDLE,
      payload: {
        data: 0,
        isFetching: false,
        phase: 0,
        error: null,
      },
    });
  }
}

export function cancelWebslotOrder(obj) {
  return function (dispatch) {
    dispatch({
      type: REMOVE_WEBSLOT_ORDER_BEGIN,
    });
    axios.post(`${process.env.API_URL}/webslot/order/cancel`, obj)
      .then((response) => {
        dispatch({
          type: REMOVE_WEBSLOT_ORDER_SUCCESS,
          payload: response,
        });
        console.log('/webslot/order/cancel');
        console.log(response);
        console.log(obj);
        dispatch({
          type: ENQUEUE_SNACKBAR,
          notification: {
            message: `Success: Order #${response.data.order.id} canceled`,
            key: new Date().getTime() + Math.random(),
            options: {
              variant: 'success',
            },
          },
        });
        dispatch({
          type: REMOVE_WEBSLOT_ORDER,
          payload: response,
        });
      }).catch((error) => {
        dispatch({
          type: REMOVE_WEBSLOT_ORDER_FAIL,
          payload: error,
        });
      });
  }
}
