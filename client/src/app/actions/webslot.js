import axios from 'axios';
// import https from 'https'
// const fetch = require('node-fetch');
import {
  FETCH_WEBSLOT_BEGIN,
  FETCH_WEBSLOT_FAIL,
  FETCH_WEBSLOT_SUCCESS,
  CREATE_WEBSLOT_BEGIN,
  CREATE_WEBSLOT_FAIL,
  CREATE_WEBSLOT_SUCCESS,
  CREATE_WEBSLOT_IDLE,
  INSERT_WEBSLOT,
  REMOVE_WEBSLOT,
  REMOVE_WEBSLOT_BEGIN,
  REMOVE_WEBSLOT_FAIL,
  REMOVE_WEBSLOT_SUCCESS,
  REMOVE_WEBSLOT_IDLE,
  ENQUEUE_SNACKBAR,
} from './types/index';

export function idleWebslot() {
  return function (dispatch) {
    dispatch({
      type: CREATE_WEBSLOT_IDLE,
      payload: {
        data: 0,
        isFetching: false,
        phase: 0,
        error: null,
      },
    });
  }
}

/**
 * Add a Webslot
 */

export function addWebslot(obj) {
  return function (dispatch) {
    dispatch({
      type: CREATE_WEBSLOT_BEGIN,
    });
    axios.post(`${process.env.API_URL}/webslots/create`, obj)
      .then((response) => {
        console.log(response);
        console.log(response.data);
        console.log('response data------------------------------------------------------------------------!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        dispatch({
          type: CREATE_WEBSLOT_SUCCESS,
          payload: response.data,
        })
        dispatch({
          type: ENQUEUE_SNACKBAR,
          notification: {
            message: 'Success: Webslot added',
            key: new Date().getTime() + Math.random(),
            options: {
              variant: 'success',
            },
          },
        });
        dispatch({
          type: INSERT_WEBSLOT,
          payload: response.data,
        })
      }).catch((error) => {
        dispatch({
          type: CREATE_WEBSLOT_FAIL,
          payload: error,
        });
        console.log('error');
        console.log(error);
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
      });
  }
}

export function idleDeactivateWebslot() {
  return function (dispatch) {
    dispatch({
      type: REMOVE_WEBSLOT_IDLE,
    });
  }
}

export function deactivateWebslot(obj) {
  return function (dispatch) {
    dispatch({
      type: REMOVE_WEBSLOT_BEGIN,
    });
    axios.post(`${process.env.API_URL}/webslots/deactivate`, obj)
      .then((response) => {
        dispatch({
          type: REMOVE_WEBSLOT_SUCCESS,
          payload: response.data,
        })
        dispatch({
          type: ENQUEUE_SNACKBAR,
          notification: {
            message: 'Success: Webslot removed',
            key: new Date().getTime() + Math.random(),
            options: {
              variant: 'success',
            },
          },
        });
        setTimeout(() => {
          dispatch({
            type: REMOVE_WEBSLOT,
            payload: response,
          });
        }, 2100);
      }).catch((error) => {
        console.log(error);
        dispatch({
          type: REMOVE_WEBSLOT_FAIL,
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
      });
  }
}
