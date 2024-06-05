import {
  FETCH_ADMINREVIEWPUBLISHERS_BEGIN,
  FETCH_ADMINREVIEWPUBLISHERS_SUCCESS,
  FETCH_ADMINREVIEWPUBLISHERS_FAIL,
  REMOVE_REVIEW_PUBLISHER,
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
    case FETCH_ADMINREVIEWPUBLISHERS_BEGIN:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_ADMINREVIEWPUBLISHERS_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
      };

    case FETCH_ADMINREVIEWPUBLISHERS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        data: null,
      };

    case REMOVE_REVIEW_PUBLISHER:
      return {
        ...state,
        loading: false,
        data: [
          ...state.data.filter((publisher) => publisher.id !== action.payload.id),
        ],
      };

    default:
      return state;
  }
}
