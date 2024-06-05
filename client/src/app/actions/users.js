import axios from 'axios';
import {
  FETCH_USERS,
  FETCH_USER_COUNT,
} from './types/index';

/**
 * Fetch all users
 */
export function fetchUsers() {
  const user = JSON.parse(localStorage.getItem('user'));

  return function (dispatch) {
    axios.get(process.env.API_URL, { headers: { authorization: user.token } })
      .then((response) => {
        dispatch({
          type: FETCH_USERS,
          payload: response.data,
        });
      });
  }
}

export function fetchUserCount() {
  return function (dispatch) {
    axios.get(`${process.env.API_URL}/users/total`)
      .then((response) => {
        dispatch({
          type: FETCH_USER_COUNT,
          payload: response.data,
        });
      });
  }
}
