import axios from 'axios';
import {
  CREATE_REPORT_BEGIN,
  CREATE_REPORT_FAIL,
  CREATE_REPORT_SUCCESS,
  CREATE_REPORT_IDLE,
  ENQUEUE_SNACKBAR,
} from './types/index';

export function createReportAction(props, webslotId, domainId) {
  const { reason, description, captchaResponse } = props;

  return function (dispatch) {
    dispatch({
      type: CREATE_REPORT_BEGIN,
    });
    axios.post(`${process.env.API_URL}/report/create`,
      {
        reason,
        description,
        captchaResponse,
        webslotId,
        domainId,
      }).then((response) => {
      dispatch({
        type: CREATE_REPORT_SUCCESS,
        payload: response,
      });
      dispatch({
        type: ENQUEUE_SNACKBAR,
        notification: {
          message: 'Success: Domain Reported',
          key: new Date().getTime() + Math.random(),
          options: {
            variant: 'success',
          },
        },
      });
    }).catch((error) => {
      dispatch({
        type: CREATE_REPORT_FAIL,
        payload: error,
      });
      if (error.response) {
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
      console.log('some err');
      console.log(error);
    });
  }
}

export function idleCreateReportAction() {
  return function (dispatch) {
    dispatch({
      type: CREATE_REPORT_IDLE,
    });
  }
}
