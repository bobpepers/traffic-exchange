import axios from 'axios';
import {
  FETCH_REGISTERED_BEGIN,
  FETCH_REGISTERED_SUCCESS,
  FETCH_REGISTERED_FAILURE,
} from './types/index';

export function getRequestRegister() {
  return function (dispatch) {
    dispatch({
      type: FETCH_REGISTERED_BEGIN,
    });
    axios.get(`${process.env.API_URL}/users/total`)
      .then((response) => {
        dispatch({
          type: FETCH_REGISTERED_SUCCESS,
          payload: response.data,
        });
      })
      .catch((error) => {
        console.log(error);
        dispatch({
          type: FETCH_REGISTERED_FAILURE,
          payload: error,
        });
      });
  }
}
