import axios from 'axios';
import {
  CREATE_BANNERORDER_IDLE,
  CREATE_BANNERORDER_BEGIN,
  CREATE_BANNERORDER_SUCCESS,
  CREATE_BANNERORDER_FAIL,
  INSERT_BANNER_ORDER,
  ENQUEUE_SNACKBAR,
  UPDATE_WALLET,
} from './types/index';

export function idleCreateBannerOrder() {
  return function (dispatch) {
    dispatch({
      type: CREATE_BANNERORDER_IDLE,
      payload: {
        data: 0,
        isFetching: false,
        phase: 0,
        error: null,
      },
    });
  }
}

export function createBannerOrderAction(obj) {
  return function (dispatch) {
    dispatch({
      type: CREATE_BANNERORDER_BEGIN,
    });
    console.log('START_CREATE_BANNER_ORDER_ACTION');
    axios.post(`${process.env.API_URL}/banners/order/create`, obj)
      .then((response) => {
        console.log('webslot/order/START_CREATE_BANNER_ORDER_SUCCESS');
        console.log(response);
        dispatch({
          type: CREATE_BANNERORDER_SUCCESS,
          payload: response,
        });
        dispatch({
          type: UPDATE_WALLET,
          payload: response.data.wallet,
        });
        dispatch({
          type: ENQUEUE_SNACKBAR,
          notification: {
            message: `Success: order created #${response.data.order.id}`,
            key: new Date().getTime() + Math.random(),
            options: {
              variant: 'success',
            },
          },
        });
        dispatch({
          type: INSERT_BANNER_ORDER,
          payload: response.data.order,
        });
      }).catch((error) => {
        if (error.response) {
          // client received an error response (5xx, 4xx)
          console.log(error.response);
          if (error.response.status === 429) {
            dispatch({
              type: ENQUEUE_SNACKBAR,
              notification: {
                message: `${error.response.status}: ${error.response.data}`,
                key: new Date().getTime() + Math.random(),
                options: {
                  variant: 'error',
                },
              },
            });
          } else {
            dispatch({
              type: ENQUEUE_SNACKBAR,
              notification: {
                message: `${error.response.status}: ${error.response.data.error}`,
                key: new Date().getTime() + Math.random(),
                options: {
                  variant: 'error',
                },
              },
            });
          }
        } else if (error.request) {
          // client never received a response, or request never left
          dispatch({
            type: ENQUEUE_SNACKBAR,
            notification: {
              message: 'Connection Timeout',
              key: new Date().getTime() + Math.random(),
              options: {
                variant: 'error',
              },
            },
          });
        } else {
          dispatch({
            type: ENQUEUE_SNACKBAR,
            notification: {
              message: 'Unknown Error',
              key: new Date().getTime() + Math.random(),
              options: {
                variant: 'error',
              },
            },
          });
        }
        dispatch({
          type: CREATE_BANNERORDER_FAIL,
          payload: error,
        });
      });
  }
}
