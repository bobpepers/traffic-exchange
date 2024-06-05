import axios from 'axios';
import {
  BUY_BANNERSLOT_IDLE,
  BUY_BANNERSLOT_BEGIN,
  BUY_BANNERSLOT_SUCCESS,
  BUY_BANNERSLOT_FAIL,
  BUY_BANNERSLOT,
  ENQUEUE_SNACKBAR,
} from './types/index';

export function idlebuyBannerslot() {
  return function (dispatch) {
    dispatch({
      type: BUY_BANNERSLOT_IDLE,
      payload: {
        data: 0,
        isFetching: false,
        phase: 0,
        error: null,
      },
    });
  }
}

export function executebuyBannerslot() {
  return function (dispatch) {
    dispatch({
      type: BUY_BANNERSLOT_BEGIN,
    });
    axios.post(`${process.env.API_URL}/banners/buy`)
      .then((response) => {
        dispatch({
          type: ENQUEUE_SNACKBAR,
          notification: {
            message: 'Success: Extra webslot added',
            key: new Date().getTime() + Math.random(),
            options: {
              variant: 'success',
            },
          },
        });
        dispatch({
          type: BUY_BANNERSLOT_SUCCESS,
          payload: response,
        });
        dispatch({
          type: BUY_BANNERSLOT,
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
          type: BUY_BANNERSLOT_FAIL,
          payload: error,
        });
      });
  }
}
