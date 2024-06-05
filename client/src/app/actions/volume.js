import axios from 'axios';
import {
  FETCH_VOLUME_BEGIN,
  FETCH_VOLUME_SUCCESS,
  FETCH_VOLUME_FAIL,
} from './types/index';

export function getVolume() {
  return function (dispatch) {
    dispatch({
      type: FETCH_VOLUME_BEGIN,
    });
    axios.get(`${process.env.API_URL}/volume`).then((response) => {
      console.log(response);
      console.log('statssss');
      dispatch({
        type: FETCH_VOLUME_SUCCESS,
        payload: response.data,
      });
    })
      .catch((error) => {
        console.log(error);
        dispatch({
          type: FETCH_VOLUME_FAIL,
          payload: error,
        });
      });
  }
}

export function onVolume(data) {
  return function (dispatch) {
    console.log(data);
    dispatch({
      type: FETCH_VOLUME_SUCCESS,
      payload: data,
    });
  }
}

export const getVolumeSocket = (options) => async (dispatch) => {
  // Notify our state that we're doing something asynchronous.
  console.log('getPeopleeee');
  dispatch(getVolume());
  // Sanity, don't need to pass the socket itself down the wire.
  const { socket } = options;
  delete options.socket;
  try {
    // Emit the request to the back-end via the socket.
    socket.emit(FETCH_VOLUME_BEGIN, options);
  } catch (err) {
    dispatch(getFailurePeople(err));
  }
};
