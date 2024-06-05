import axios from 'axios';
import {
  ADD_PUBLISHER_BEGIN,
  ADD_PUBLISHER_SUCCESS,
  ADD_PUBLISHER_FAIL,
  VERIFY_PUBLISHER_BEGIN,
  VERIFY_PUBLISHER_SUCCESS,
  VERIFY_PUBLISHER_FAIL,
  ENQUEUE_SNACKBAR,
  FETCH_PUBLISHER_BEGIN,
  FETCH_PUBLISHER_FAIL,
  FETCH_PUBLISHER_SUCCESS,
  UPDATE_PUBLISHER,
  INSERT_PUBLISHER,
  ADD_PUBLISHER_IDLE,
  VERIFY_PUBLISHER_IDLE,
} from './types/index';

/**
 * Fetch Withdrawal Data
 */
export function addPublisherAction(url) {
  return function (dispatch) {
    dispatch({
      type: ADD_PUBLISHER_BEGIN,
    });
    // axios.get(`${API_URL}/user`, { headers: { authorization: user.token } })
    axios.post(`${process.env.API_URL}/publisher/add`, url)
      .then((response) => {
        console.log(response);
        console.log('axios response add publisher')
        dispatch({
          type: ADD_PUBLISHER_SUCCESS,
          payload: response.data,
        });
        dispatch({
          type: INSERT_PUBLISHER,
          payload: response.data,
        });
        dispatch({
          type: ENQUEUE_SNACKBAR,
          notification: {
            message: 'Success: Publisher Added',
            key: new Date().getTime() + Math.random(),
            options: {
              variant: 'success',
            },
          },
        });
      }).catch((error) => {
        console.log(error);
        console.log('publisher add error');
        dispatch({
          type: ADD_PUBLISHER_FAIL,
          payload: error.response.data,
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

export function verifyPublisherAction(id) {
  console.log('verify publisher action start');
  console.log(id);
  return function (dispatch) {
    dispatch({
      type: VERIFY_PUBLISHER_BEGIN,
    });
    // axios.get(`${API_URL}/user`, { headers: { authorization: user.token } })
    axios.post(`${process.env.API_URL}/publisher/verify`, { id })
      .then((response) => {
        dispatch({
          type: VERIFY_PUBLISHER_SUCCESS,
          payload: response.data,
        });
        dispatch({
          type: ENQUEUE_SNACKBAR,
          notification: {
            message: 'Success: Publisher Verified',
            key: new Date().getTime() + Math.random(),
            options: {
              variant: 'success',
            },
          },
        });
      }).catch((error) => {
        dispatch({
          type: VERIFY_PUBLISHER_FAIL,
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

export function fetchPublisherData() {
  return function (dispatch) {
    dispatch({
      type: FETCH_PUBLISHER_BEGIN,
    });
    // axios.get(`${API_URL}/user`, { headers: { authorization: user.token } })
    axios.get(`${process.env.API_URL}/publisher/all`)
      .then((response) => {
        dispatch({
          type: FETCH_PUBLISHER_SUCCESS,
          payload: response.data,
        })
      }).catch((error) => {
        dispatch({
          type: FETCH_PUBLISHER_FAIL,
          payload: error,
        });
      });
  }
}

export function idleAddPublisherAction() {
  return function (dispatch) {
    dispatch({
      type: ADD_PUBLISHER_IDLE,
    });
  }
}
export function idleVerifyPublisherAction() {
  return function (dispatch) {
    dispatch({
      type: VERIFY_PUBLISHER_IDLE,
    });
  }
}
