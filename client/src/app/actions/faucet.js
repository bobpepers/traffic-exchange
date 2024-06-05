import axios from 'axios';
import {
  FETCH_FAUCETRECORD_BEGIN,
  FETCH_FAUCETRECORD_SUCCESS,
  FETCH_FAUCETRECORD_FAIL,
  FETCH_FAUCETCLAIM_BEGIN,
  FETCH_FAUCETCLAIM_SUCCESS,
  FETCH_FAUCETCLAIM_FAIL,
  UPDATE_WALLET,
  ENQUEUE_SNACKBAR,
  FETCH_FAUCETROLLS_BEGIN,
  FETCH_FAUCETROLLS_SUCCESS,
  FETCH_FAUCETROLLS_FAIL,
  INSERT_FAUCETROLL,
  UPDATE_JACKPOT_TICKETS,
} from './types/index';

export function fetchFaucetRolls() {
  return function (dispatch) {
    dispatch({
      type: FETCH_FAUCETROLLS_BEGIN,
    });
    axios.get(`${process.env.API_URL}/faucetrolls`)
      .then((response) => {
        dispatch({
          type: FETCH_FAUCETROLLS_SUCCESS,
          payload: response.data.faucetRolls,
        })
      }).catch((error) => {
        dispatch({
          type: FETCH_FAUCETROLLS_FAIL,
          payload: error,
        })
      });
  }
}

export function fetchFaucetRecord() {
  return function (dispatch) {
    dispatch({
      type: FETCH_FAUCETRECORD_BEGIN,
    });
    // axios.get(`${API_URL}/user`, { headers: { authorization: user.token } })
    axios.get(`${process.env.API_URL}/faucetrecord`)
      .then((response) => {
        dispatch({
          type: FETCH_FAUCETRECORD_SUCCESS,
          payload: response.data.faucetRecord,
        })
      }).catch((error) => {
        dispatch({
          type: FETCH_FAUCETRECORD_FAIL,
          payload: error,
        })
      });
  }
}

export function claimFaucet(captchaResponse) {
  return function (dispatch) {
    dispatch({
      type: FETCH_FAUCETCLAIM_BEGIN,
    });
    // axios.get(`${API_URL}/user`, { headers: { authorization: user.token } })
    axios.post(`${process.env.API_URL}/faucetclaim`, { captchaResponse })
      .then((response) => {
        dispatch({
          type: FETCH_FAUCETCLAIM_SUCCESS,
          payload: response.data.faucetRoll,
        });
        dispatch({
          type: INSERT_FAUCETROLL,
          payload: response.data.faucetRoll,
        });
        dispatch({
          type: UPDATE_WALLET,
          payload: response.data.wallet,
        });
        dispatch({
          type: FETCH_FAUCETRECORD_SUCCESS,
          payload: response.data.faucetRecord,
        });
        dispatch({
          type: UPDATE_JACKPOT_TICKETS,
          payload: response.data.jackpot_tickets,
        });
      }).catch((error) => {
        dispatch({
          type: FETCH_FAUCETCLAIM_FAIL,
          payload: error,
        });
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
      });
  }
}
