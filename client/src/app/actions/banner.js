import axios from 'axios';
import {
  ADD_BANNER_BEGIN,
  ADD_BANNER_SUCCESS,
  ADD_BANNER_FAIL,
  ENQUEUE_SNACKBAR,
  FETCH_BANNER_BEGIN,
  FETCH_BANNER_FAIL,
  FETCH_BANNER_SUCCESS,
  INSERT_BANNER,
  ADD_BANNER_IDLE,
  REMOVE_WEBSLOT_BANNER_IDLE,
  REMOVE_WEBSLOT_BANNER_BEGIN,
  REMOVE_WEBSLOT_BANNER_SUCCESS,
  REMOVE_WEBSLOT_BANNER_FAIL,
  REMOVE_BANNER_ORDER,
  UPDATE_WALLET,
} from './types/index';

/**
 * Fetch Withdrawal Data
 */
export const addBannerAction = (banner) => function (dispatch) {
  const data = new FormData();
  // data.append('name', 'image');
  console.log(banner.banner[0].name);
  console.log('banner.banner[0].name');
  console.log('banner.banner[0].name');
  console.log('banner.banner[0].name');
  console.log('banner.banner[0].name');
  console.log('banner.banner[0].name');
  console.log('banner.banner[0].name');
  console.log('banner.banner[0].name');
  data.append('banner', banner.banner[0], banner.banner[0].name);
  data.append('bannerResolution', banner.bannerResolution);
  data.append('url', banner.url);

  console.log(data);

  const config = {
    header: {
      'Content-Type': 'multipart/form-data',
    },
  }
  // return function (dispatch) {
  dispatch({
    type: ADD_BANNER_BEGIN,
  });
  // axios.get(`${API_URL}/user`, { headers: { authorization: user.token } })
  axios.post(`${process.env.API_URL}/banner/add`, data, config)
    .then((response) => {
      console.log(response);
      console.log('axios response add banner');
      dispatch({
        type: ADD_BANNER_SUCCESS,
        payload: response.data,
      });
      dispatch({
        type: INSERT_BANNER,
        payload: response.data,
      });
      dispatch({
        type: ENQUEUE_SNACKBAR,
        notification: {
          message: 'Success: Banner Added',
          key: new Date().getTime() + Math.random(),
          options: {
            variant: 'success',
          },
        },
      });
    }).catch((error) => {
      console.log(error);
      console.log(error.response);
      console.log('banner add error');
      dispatch({
        type: ADD_BANNER_FAIL,
        payload: error.response.data,
      });
      if (error.response) {
        // client received an error response (5xx, 4xx)
        console.log(error.response);
        if (error.response.status === 413 && error.response.statusText === 'Request Entity Too Large') {
          dispatch({
            type: ENQUEUE_SNACKBAR,
            notification: {
              message: `${error.response.status}: FILE_SIZE_TOO_LARGE`,
              key: new Date().getTime() + Math.random(),
              options: {
                variant: 'error',
              },
            },
          });
        } else if (error.response.status === 429) {
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
  // }
}

export function fetchBannerData() {
  return function (dispatch) {
    dispatch({
      type: FETCH_BANNER_BEGIN,
    });
    // axios.get(`${API_URL}/user`, { headers: { authorization: user.token } })
    axios.get(`${process.env.API_URL}/banner/all`)
      .then((response) => {
        dispatch({
          type: FETCH_BANNER_SUCCESS,
          payload: response.data,
        })
      }).catch((error) => {
        dispatch({
          type: FETCH_BANNER_FAIL,
          payload: error,
        });
      });
  }
}

export function idleAddBannerAction() {
  return function (dispatch) {
    dispatch({
      type: ADD_BANNER_IDLE,
    });
  }
}

export function idleCancelBannerOrder() {
  return function (dispatch) {
    dispatch({
      type: REMOVE_WEBSLOT_BANNER_IDLE,
      payload: {
        data: 0,
        isFetching: false,
        phase: 0,
        error: null,
      },
    });
  }
}

export function cancelBannerOrder(obj) {
  return function (dispatch) {
    dispatch({
      type: REMOVE_WEBSLOT_BANNER_BEGIN,
    });
    axios.post(`${process.env.API_URL}/banner/order/cancel`, obj)
      .then((response) => {
        console.log(response);
        console.log('cancelBannerOrder response');
        dispatch({
          type: REMOVE_WEBSLOT_BANNER_SUCCESS,
          payload: response,
        });
        dispatch({
          type: ENQUEUE_SNACKBAR,
          notification: {
            message: `Success: Order #${response.data.order.id} canceled`,
            key: new Date().getTime() + Math.random(),
            options: {
              variant: 'success',
            },
          },
        });

        dispatch({
          type: REMOVE_BANNER_ORDER,
          payload: response.data.order,
        });
        dispatch({
          type: UPDATE_WALLET,
          payload: response.data.wallet,
        });
      }).catch((error) => {
        dispatch({
          type: REMOVE_WEBSLOT_BANNER_FAIL,
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
