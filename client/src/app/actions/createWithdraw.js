import axios from 'axios';
import { reset } from 'redux-form';
import {
  CREATE_WITHDRAW_IDLE,
  CREATE_WITHDRAW_BEGIN,
  CREATE_WITHDRAW_SUCCESS,
  CREATE_WITHDRAW_FAIL,
  ENQUEUE_SNACKBAR,
} from './types/index';

export function idleWithdraw() {
  return function (dispatch) {
    dispatch({
      type: CREATE_WITHDRAW_IDLE,
      payload: {
        data: 0,
        isFetching: false,
        phase: 0,
        error: null,
      },
    });
  }
}

export function createWithdraw(obj) {
  return function (dispatch) {
    dispatch({
      type: CREATE_WITHDRAW_BEGIN,
    });
    axios.post(`${process.env.API_URL}/withdraw`, obj)
      .then((response) => {
        dispatch({
          type: CREATE_WITHDRAW_SUCCESS,
          payload: response.data,
        });
        dispatch({
          type: ENQUEUE_SNACKBAR,
          notification: {
            message: 'Success: Withdrawal is being reviewed',
            key: new Date().getTime() + Math.random(),
            options: {
              variant: 'success',
            },
          },
        });
        dispatch(reset('withdraw'));
      }).catch((error) => {
        if (error.response) {
          // client received an error response (5xx, 4xx)
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
          type: CREATE_WITHDRAW_FAIL,
          payload: error,
        });
      });
  }
}
