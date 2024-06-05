import axios from 'axios';
import {
  BUY_ADZONESLOT_IDLE,
  BUY_ADZONESLOT_BEGIN,
  BUY_ADZONESLOT_SUCCESS,
  BUY_ADZONESLOT_FAIL,
  BUY_ADZONESLOT,
  ENQUEUE_SNACKBAR,
  UPDATE_WALLET,
  UPDATE_JACKPOT_TICKETS,
} from './types/index';

export function idlebuyAdzoneslot() {
  return function (dispatch) {
    dispatch({
      type: BUY_ADZONESLOT_IDLE,
      payload: {
        data: 0,
        isFetching: false,
        phase: 0,
        error: null,
      },
    });
  }
}

export function executebuyAdzoneslot(id) {
  return function (dispatch) {
    dispatch({
      type: BUY_ADZONESLOT_BEGIN,
    });
    console.log(id);
    console.log('id');
    axios.post(`${process.env.API_URL}/adzone/buy`, { id })
      .then((response) => {
        dispatch({
          type: ENQUEUE_SNACKBAR,
          notification: {
            message: 'Success: Extra Adzone bought',
            key: new Date().getTime() + Math.random(),
            options: {
              variant: 'success',
            },
          },
        });
        dispatch({
          type: BUY_ADZONESLOT_SUCCESS,
          payload: response,
        });
        console.log('buyadzoneslot');
        console.log(response);

        dispatch({
          type: UPDATE_JACKPOT_TICKETS,
          payload: response.data.jackpot_tickets,
        });
        dispatch({
          type: UPDATE_WALLET,
          payload: response.data.wallet,
        });
        dispatch({
          type: BUY_ADZONESLOT,
          payload: response.data,
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
          type: BUY_ADZONESLOT_FAIL,
          payload: error,
        });
      });
  }
}
