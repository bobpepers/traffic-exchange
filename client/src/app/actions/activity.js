import axios from 'axios';
import {
  FETCH_ACTIVITY_BEGIN,
  FETCH_ACTIVITY_FAIL,
  FETCH_ACTIVITY_SUCCESS,
  INSERT_ACTIVITY,
  FETCH_RECENTUSERACTIVITY_BEGIN,
  FETCH_RECENTUSERACTIVITY_SUCCESS,
  FETCH_RECENTUSERACTIVITY_FAIL,
} from './types/index';

/**
 * Fetch User Data
 */
export function fetchActivity() {
  return function (dispatch) {
    dispatch({
      type: FETCH_ACTIVITY_BEGIN,
    });
    // axios.get(`${API_URL}/user`, { headers: { authorization: user.token } })
    axios.get(`${process.env.API_URL}/activity/all`)
      .then((response) => {
        dispatch({
          type: FETCH_ACTIVITY_SUCCESS,
          payload: response.data,
        })
      }).catch((error) => {
        dispatch({
          type: FETCH_ACTIVITY_FAIL,
          payload: error,
        })
      });
  }
}

/**
 * Fetch User Recent Activity
 */
export function fetchUserRecentActivity() {
  return function (dispatch) {
    dispatch({
      type: FETCH_RECENTUSERACTIVITY_BEGIN,
    });
    // axios.get(`${API_URL}/user`, { headers: { authorization: user.token } })
    axios.get(`${process.env.API_URL}/activity/user`)
      .then((response) => {
        dispatch({
          type: FETCH_RECENTUSERACTIVITY_SUCCESS,
          payload: response.data,
        })
      }).catch((error) => {
        dispatch({
          type: FETCH_RECENTUSERACTIVITY_FAIL,
          payload: error,
        })
      });
  }
}

export function onInsertActivity(data) {
  return function (dispatch) {
    dispatch({
      type: INSERT_ACTIVITY,
      payload: data,
    });
  }
}
