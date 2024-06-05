import axios from 'axios';
import history from '../history';
import {
  CONTACT_SEND,
  CONTACT_RESET,
} from './types/index';

/**
 * CONTACT SEND
 */
export function contactSend(props) {
  const {
    name, email, message, captchaResponse,
  } = props;

  return function (dispatch) {
    axios.post(`${process.env.API_URL}/contact/send`, {
      name, email, message, captchaResponse,
    })
      .then((response) => {
        console.log(response);

        dispatch({
          type: CONTACT_SEND,
          payload: response.data,
        });

        history.push('/contact/success');
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

export const contactReset = () => ({ type: CONTACT_RESET });
