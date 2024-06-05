import {
  FETCH_ONLINE_BEGIN,
  FETCH_ONLINE_SUCCESS,
  FETCH_ONLINE_FAILURE,
} from './types/index';
// Action creators return a consistent "command" object.
export const getRequestPeople = () => ({
  type: FETCH_ONLINE_BEGIN,
});
export const getSuccessPeople = (data) => {
  console.log('getsee');
  console.log(data);
  return {
    type: FETCH_ONLINE_SUCCESS,
    payload: data,
  };
};
export const getFailurePeople = (err) => ({
  type: FETCH_ONLINE_FAILURE,
  err,
});
// This method has one required option which is the reference to
// socket being utilized.  That connection happens somewhere else.
// Assume we're connected when this function is called.
export const getPeople = (options) => async (dispatch) => {
  // Notify our state that we're doing something asynchronous.
  console.log('getPeopleeee');
  dispatch(getRequestPeople());
  // Sanity, don't need to pass the socket itself down the wire.
  const { socket } = options;
  delete options.socket;
  try {
    // Emit the request to the back-end via the socket.
    socket.emit(FETCH_REGISTERED_BEGIN, options);
  } catch (err) {
    dispatch(getFailurePeople(err));
  }
};
