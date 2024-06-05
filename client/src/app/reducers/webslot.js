import {
  FETCH_WEBSLOT_BEGIN,
  FETCH_WEBSLOT_SUCCESS,
  FETCH_WEBSLOT_FAIL,
  REMOVE_WEBSLOT_ORDER,
} from '../actions/types/index';

const initialState = {
  items: [],
  loading: false,
  error: null,
};

export default function webslotsReducer(
  state = initialState,
  action,
) {
  switch (action.type) {
    case FETCH_WEBSLOT_BEGIN:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_WEBSLOT_SUCCESS:
      return {
        ...state,
        loading: false,
        items: action.payload,
      };

    case FETCH_WEBSLOT_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        items: [],
      };
    case REMOVE_WEBSLOT_ORDER:
      console.log(action.payload);
      console.log(action.payload.id);
      console.log('action.payload.id ');
      console.log('state');

      console.log(state);
      return {
        ...state,
        items: state.data.map(
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
}
