import axios from 'axios';
import {
  FETCH_SURFSTART_BEGIN,
  FETCH_SURFSTART_SUCCESS,
  FETCH_SURFSTART_FAILURE,
  ENQUEUE_SNACKBAR,
} from './types/index';

export function startSurfAction() {
  return function (dispatch) {
    return new Promise((resolve) => {
      dispatch({
        type: FETCH_SURFSTART_BEGIN,
      });
      axios.get(`${process.env.API_URL}/surf/start`)
        .then((response) => {
          console.log(response);
          dispatch({
            type: FETCH_SURFSTART_SUCCESS,
            payload: response.data,
          });
          dispatch({
            type: ENQUEUE_SNACKBAR,
            notification: {
              message: 'Success: Surf Started',
              key: new Date().getTime() + Math.random(),
              options: {
                variant: 'success',
              },
            },
          });
          resolve();
        })
        .catch((error) => {
          console.log(error);
          dispatch({
            type: FETCH_SURFSTART_FAILURE,
            payload: error,
          });
          if (error.response) {
          // client received an error response (5xx, 4xx)
            console.log(error.response);
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
          resolve();
        });
    });
  }
}
