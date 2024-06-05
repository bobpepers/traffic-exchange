import {
  CONTACT_SEND,
  CONTACT_RESET,
} from '../actions/types/index';

export default function(state = {}, action) {
  switch(action.type) {
    case CONTACT_SEND:
      return { list: action.payload, ...state };
    case CONTACT_RESET: {
      return {};
    }
  }

  return state;
}