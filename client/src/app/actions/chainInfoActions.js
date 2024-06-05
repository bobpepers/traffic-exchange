import axios from 'axios';
import {
  FETCH_CHAININFO_BEGIN,
  FETCH_CHAININFO_SUCCESS,
  FETCH_CHAININFO_FAILURE,
} from './types/index';

export function fetchChainInfo() {
  return (dispatch) => {
    dispatch(fetchChainInfoBegin());
    return axios.get(`${process.env.API_URL}/chaininfo`)
      .then((response) => {
        dispatch(fetchChainInfoSuccess(response.data));
        return response.data;
      })
      .catch((error) => dispatch(fetchChainInfoFailure(error)));
  };
}

// Handle HTTP errors since fetch won't.
function handleErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}

export const fetchChainInfoBegin = () => ({
  type: FETCH_CHAININFO_BEGIN,
});

export const fetchChainInfoSuccess = (chaininfo) => ({
  type: FETCH_CHAININFO_SUCCESS,
  payload: { chaininfo },
});

export const fetchChainInfoFailure = (error) => ({
  type: FETCH_CHAININFO_FAILURE,
  payload: { error },
});
