import {
  FETCH_ADMINREVIEWBANNERS_BEGIN,
  FETCH_ADMINREVIEWBANNERS_SUCCESS,
  FETCH_ADMINREVIEWBANNERS_FAIL,
  REMOVE_REVIEW_BANNER,
} from '../../actions/types/index';

const initialState = {
  data: null,
  loading: false,
  error: null,
};

export default function adminReviewPublishersReducer(
  state = initialState,
  action,
) {
  switch (action.type) {
    case FETCH_ADMINREVIEWBANNERS_BEGIN:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_ADMINREVIEWBANNERS_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };

    case FETCH_ADMINREVIEWBANNERS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        data: null,
      };

    case REMOVE_REVIEW_BANNER:
      return {
        ...state,
        loading: false,
        data: [
          ...state.data.filter((banner) => banner.id !== action.payload.id),
        ],
      };

    default:
      return state;
  }
}
