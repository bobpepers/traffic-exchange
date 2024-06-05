import {
  FETCH_PUBLISHER_BEGIN,
  FETCH_PUBLISHER_SUCCESS,
  FETCH_PUBLISHER_FAIL,
  UPDATE_PUBLISHER,
  INSERT_PUBLISHER,
  BUY_ADZONESLOT,
} from '../actions/types/index';

const initialState = {
  data: 0,
  isFetching: false, // Default to fetching..
  error: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    // case BUY_WEBSLOT_IDLE:
    //  return {
    //    data: 0,
    //    isFetching: false,
    //    error: null,
    //  };
    case FETCH_PUBLISHER_BEGIN:
      return {
        ...state,
        isFetching: true,
        error: null,
      };
    case FETCH_PUBLISHER_SUCCESS:
      return {
        ...state,
        data: action.payload,
        isFetching: false,
      };
    case FETCH_PUBLISHER_FAIL:
      console.log('FETCH_PUBLISHER_FAIL');
      console.log(action.payload);
      return {
        ...state,
        error: action.payload.error,
        isFetching: false,
      };
    case INSERT_PUBLISHER:
      console.log('INSERT_TRANSACTION');
      console.log(action.payload);
      const existsInArray = state.data.some((publisher) => publisher.id === action.payload.id)
      if (existsInArray) {
        return state;
      }
      return {
        ...state,
        data: [
          ...state.data,
          action.payload,
        ],
        loading: false,
        error: null,
      };
    case BUY_ADZONESLOT:
      return {
        ...state,
        data: [
          ...state.data.map((publisher) => {
            if (publisher.id === action.payload.publisherId) {
              publisher.adzones_amount = action.payload.adzones_amount;
            }
            return publisher;
          }),
        ],
        loading: false,
        error: null,
      };
    default:
      return state;
  }
};
