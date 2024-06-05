import {
  FETCH_BANNER_BEGIN,
  FETCH_BANNER_SUCCESS,
  FETCH_BANNER_FAIL,
  // UPDATE_BANNER,
  INSERT_BANNER,
  REMOVE_BANNER_ORDER,
  INSERT_BANNER_ORDER,
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
    case FETCH_BANNER_BEGIN:
      return {
        ...state,
        isFetching: true,
        error: null,
      };
    case FETCH_BANNER_SUCCESS:
      return {
        ...state,
        data: action.payload,
        isFetching: false,
      };
    case FETCH_BANNER_FAIL:
      console.log('FETCH_PUBLISHER_FAIL');
      console.log(action.payload);
      return {
        ...state,
        error: action.payload.error,
        isFetching: false,
      };
    case INSERT_BANNER:
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

    case INSERT_BANNER_ORDER:
      console.log('INSERT_BANNER_ORDER');
      console.log(action.payload);

      return {
        ...state,
        data: state.data.map(
          (banner) => {
            // ...banner,
            console.log('banner');
            console.log(banner.bannerOrder);
            console.log(banner.id);
            console.log(action.payload.bannerId);
            if (banner.id === action.payload.bannerId) {
              console.log('found banner id ');

              console.log(action);
              banner.bannerOrder.push(action.payload);
            }
            return banner;
          },
        ),
        loading: false,
        error: null,
      };

    case REMOVE_BANNER_ORDER:
      console.log(action.payload.id);
      console.log('action.payload.id ');
      return {
        ...state,
        data: state.data.map(
          (banner) => ({
            ...banner,
            bannerOrder: banner.bannerOrder.filter((order) => {
              console.log(order.id);
              console.log(action.payload.id);
              if (action.payload.id !== order.id) {
                return true;
              }
              return false;

              // return action.payload.id !== order.id
            }),
          }),
        ),
        loading: false,
        error: null,
      };
    default:
      return state;
  }
};
