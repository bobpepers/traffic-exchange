import axios from 'axios';
import {
  CREATE_ORDER_IDLE,
  CREATE_ORDER_BEGIN,
  CREATE_ORDER_SUCCESS,
  CREATE_ORDER_FAILURE,
  INSERT_ORDER,
  ENQUEUE_SNACKBAR,
} from './types/index';

export function idleOrder() {
  return function (dispatch) {
    dispatch({
      type: CREATE_ORDER_IDLE,
      payload: {
        data: 0,
        isFetching: false,
        phase: 0,
        error: null,
      },
    });
  }
}

export function createOrder(obj) {
  return function (dispatch) {
    dispatch({
      type: CREATE_ORDER_BEGIN,
    });
    axios.post(`${process.env.API_URL}/webslot/order/create`, obj)
      .then((response) => {
        dispatch({
          type: CREATE_ORDER_SUCCESS,
          payload: response,
        })
        console.log('webslot/order/create');
        console.log(response);
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
          type: INSERT_ORDER,
          payload: response,
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
          type: CREATE_ORDER_FAILURE,
          payload: error,
        });
      });
  }
}
