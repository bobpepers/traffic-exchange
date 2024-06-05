import axios from 'axios';
import { API_URL } from '../../config';
import {
  FETCH_RUNESVOLUME_BEGIN,
  FETCH_RUNESVOLUME_SUCCESS,
  FETCH_RUNESVOLUME_FAILURE,
} from '../types/index';

export function getRunesVolume() {
  return function (dispatch) {
    dispatch({
      type: FETCH_RUNESVOLUME_BEGIN,
    });
    axios.get(`${API_URL}/runes/volume`)
      .then((response) => {
        dispatch({
          type: FETCH_RUNESVOLUME_SUCCESS,
          payload: response.data,
        });
      })
      .catch((error) => {
        console.log(error);
        dispatch({
          type: FETCH_RUNESVOLUME_FAILURE,
          payload: error,
        });
      });
  }
}
