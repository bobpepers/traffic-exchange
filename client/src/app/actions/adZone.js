import axios from 'axios';
import {
  ADD_ADZONE_IDLE,
  ADD_ADZONE_BEGIN,
  ADD_ADZONE_SUCCESS,
  ADD_ADZONE_FAIL,
  ENQUEUE_SNACKBAR,
} from './types/index';

export function AddAdZoneAction(obj) {
  console.log('AddAdZoneAction action start');
  console.log(obj);
  return function (dispatch) {
    dispatch({
      type: ADD_ADZONE_BEGIN,
    });
    // axios.get(`${API_URL}/user`, { headers: { authorization: user.token } })
    axios.post(`${process.env.API_URL}/publisher/adzone/add`, obj)
      .then((response) => {
        console.log(response);
        dispatch({
          type: ADD_ADZONE_SUCCESS,
          payload: response.data,
        });
        dispatch({
          type: ENQUEUE_SNACKBAR,
          notification: {
            message: 'Success: Adzone Added',
            key: new Date().getTime() + Math.random(),
            options: {
              variant: 'success',
            },
          },
        });
      }).catch((error) => {
        dispatch({
          type: ADD_ADZONE_FAIL,
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

export function AddAdZoneActionPlaceholder(obj) {
  console.log('123')
}
