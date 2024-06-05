import axios from 'axios';
import {
  FETCH_SURFCOMPLETE_BEGIN,
  FETCH_SURFCOMPLETE_SUCCESS,
  FETCH_SURFCOMPLETE_FAILURE,
  ENQUEUE_SNACKBAR,
  UPDATE_WALLET,
  UPDATE_JACKPOT_TICKETS,
  UPDATE_SURF_COUNT,
} from './types/index';

export function completeSurfAction(verificationCode, captchaResponse) {
  return function (dispatch) {
    return new Promise((resolve) => {
      dispatch({
        type: FETCH_SURFCOMPLETE_BEGIN,
      });
      axios.post(`${process.env.API_URL}/surf/complete`,
        {
          verificationCode,
          captchaResponse,
          withCredentials: true,
        })
        .then((response) => {
          dispatch({
            type: FETCH_SURFCOMPLETE_SUCCESS,
            payload: response.data,
          });
          dispatch({
            type: UPDATE_WALLET,
            payload: response.data.wallet,
          });
          dispatch({
            type: UPDATE_JACKPOT_TICKETS,
            payload: response.data.jackpot_tickets,
          });
          dispatch({
            type: UPDATE_SURF_COUNT,
            payload: response.data.surfcount,
          });
          dispatch({
            type: ENQUEUE_SNACKBAR,
            notification: {
              message: 'Success: Surf complete',
              key: new Date().getTime() + Math.random(),
              options: {
                variant: 'success',
              },
            },
          });
          resolve();
        })
        .catch((error) => {
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
            type: FETCH_SURFCOMPLETE_FAILURE,
            payload: error,
          });
          resolve();
        });
    });
  }
}
