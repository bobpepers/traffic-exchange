import axios from 'axios';
import {
  FETCH_USERS,
  FETCH_WEBSITES,
  FETCH_WEBSITES_SUCCESS,
  WEBSITE_CREATE_FAIL,
  WEBSITE_CREATE_SUCCESS,
} from './types/index';

/**
 * Fetch all users
 */
export function fetchWebsites() {
  return function (dispatch) {
    axios.get(`${process.env.API_URL}/domains`)
      .then((response) => {
        dispatch({
          type: FETCH_WEBSITES_SUCCESS,
          payload: response.data,
        });
      });
  }
}
