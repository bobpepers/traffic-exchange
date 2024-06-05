import {
  FETCH_PRICE_BEGIN,
  FETCH_PRICE_SUCCESS,
  FETCH_PRICE_FAIL,
} from '../actions/types/index';

const initialState = {
  price: 0,
  isFetching: false, // Default to fetching..
  error: null,
};
export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PRICE_BEGIN:
      return {
        ...state,
        isFetching: true,
        error: null,
      };
    case FETCH_PRICE_SUCCESS:
      return {
        ...state,
        price: action.payload.price,
        isFetching: false,
      };
    case FETCH_PRICE_FAIL:
      return {
        ...state,
        error: action.error,
        isFetching: false,
      };
    default:
      return state;
  }
};
