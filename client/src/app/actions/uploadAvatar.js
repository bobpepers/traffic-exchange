import axios from 'axios';
import {
  UPLOAD_AVATAR_BEGIN,
  UPLOAD_AVATAR_SUCCESS,
  UPLOAD_AVATAR_FAIL,
  ENQUEUE_SNACKBAR,
  UPDATE_AVATAR_PATH,
} from './types/index';

const uploadAvatarAction = (avatar) => function (dispatch) {
  const data = new FormData();
  // data.append('name', 'image');
  data.append('avatar', avatar, 'temp.png');

  const config = {
    header: {
      'Content-Type': 'multipart/form-data',
    },
  }
  console.log('upload avatar start');
  dispatch({
    type: UPLOAD_AVATAR_BEGIN,
  });
  axios.post(`${process.env.API_URL}/upload/avatar`, data, config)
    .then((response) => {
      console.log(response);
      dispatch({
        type: UPLOAD_AVATAR_SUCCESS,
        payload: response,
      });
      dispatch({
        type: UPDATE_AVATAR_PATH,
        payload: response,
      })
      dispatch({
        type: ENQUEUE_SNACKBAR,
        notification: {
          message: 'Success: Updated Profile Image',
          key: new Date().getTime() + Math.random(),
          options: {
            variant: 'success',
          },
        },
      });
    }).catch((error) => {
      console.log('error');
      console.log(error);
      dispatch({
        type: UPLOAD_AVATAR_FAIL,
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

export default uploadAvatarAction;
