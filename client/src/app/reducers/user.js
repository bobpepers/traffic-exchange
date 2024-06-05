import {
  FETCH_USER_BEGIN,
  FETCH_USER_SUCCESS,
  FETCH_USER_FAIL,
  CHANGE_USER_TFA_STATE,
  CREATE_WITHDRAW_SUCCESS,
  UPDATE_TRANSACTION,
  UPDATE_WALLET,
  INSERT_TRANSACTION,
  INSERT_ORDER,
  REMOVE_WEBSLOT,
  INSERT_WEBSLOT,
  BUY_WEBSLOT,
  UPDATE_WEBSLOT,
  REMOVE_WEBSLOT_ORDER,
  UPDATE_JACKPOT_TICKETS,
  UPDATE_SURF_COUNT,
  UPDATE_AVATAR_PATH,
  BUY_BANNERSLOT,
  BUY_PUBLISHERSLOT,
} from '../actions/types/index';

const initialState = {
  data: {
    user: {
      webslots: [],
      wallet: {
        available: 0,
        locker: 0,
      },
    },
  },
  loading: false,
  error: null,
};

export default function userReducer(
  state = initialState,
  action,
) {
  switch (action.type) {
    case FETCH_USER_BEGIN:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case FETCH_USER_SUCCESS:
      console.log(action.payload);
      console.log('action.payload');
      return {
        ...state,
        loading: false,
        data: action.payload,
      };

    case FETCH_USER_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        data: null,
      };

    case CHANGE_USER_TFA_STATE:
      return {
        ...state,
        data: {
          ...state.data,
          tfa: action.payload.data,
        },
        loading: false,
        error: null,
      };

    case CREATE_WITHDRAW_SUCCESS:
      return {
        ...state,
        data: {
          ...state.data,
          wallet: {
            ...state.data.wallet,
            available: action.payload.wallet.available,
            locked: action.payload.wallet.locked,
            addresses: {
              ...state.data.wallet.addresses,
              0: {
                ...state.data.wallet.addresses[0],
                transactions: [
                  ...state.data.wallet.addresses[0].transactions,
                  action.payload.transaction,
                ],
              },
            },
          },
        },
        loading: false,
        error: null,
      };

    case INSERT_TRANSACTION:
      console.log('INSERT_TRANSACTION');
      console.log(action.payload);
      const existsInArray = state.data.wallet.addresses[0].transactions.some((transaction) => transaction.id === action.payload.transaction[0].id)
      if (existsInArray) {
        return state;
      }
      return {
        ...state,
        data: {
          ...state.data,
          wallet: {
            ...state.data.wallet,
            addresses: {
              ...state.data.wallet.addresses,
              0: {
                ...state.data.wallet.addresses[0],
                transactions: [
                  ...state.data.wallet.addresses[0].transactions,
                  action.payload.transaction[0],
                ],
              },
            },
          },
        },
        loading: false,
        error: null,
      };

    case UPDATE_TRANSACTION:
      return {
        ...state,
        data: {
          ...state.data,
          wallet: {
            ...state.data.wallet,
            addresses: {
              ...state.data.wallet.addresses,
              0: {
                ...state.data.wallet.addresses[0],
                transactions: state.data.wallet.addresses[0].transactions.map(
                  (transaction) => (transaction.id === action.payload.transaction.id
                    ? {
                      ...transaction,
                      confirmations: action.payload.transaction.confirmations,
                      phase: action.payload.transaction.phase,
                      txid: action.payload.transaction.txid,
                    }
                    : transaction),
                ),
              },
            },
          },
        },
        loading: false,
        error: null,
      };

    case UPDATE_JACKPOT_TICKETS:
      return {
        ...state,
        data: {
          ...state.data,
          jackpot_tickets: action.payload,
        },
        loading: false,
        error: null,
      };

    case UPDATE_WALLET:
      return {
        ...state,
        data: {
          ...state.data,
          wallet: {
            ...action.payload,
            addresses: {
              ...state.data.wallet.addresses,
            },
          },
        },
        loading: false,
        error: null,
      };

    case UPDATE_SURF_COUNT:
      console.log('UPDATE_JACKPOT_TICKETS_UPDATE_JACKPOT_TICKETS_UPDATE_JACKPOT_TICKETS_UPDATE_JACKPOT_TICKETS_UPDATE_JACKPOT_TICKETS_UPDATE_JACKPOT_TICKETS_UPDATE_JACKPOT_TICKETS_UPDATE_JACKPOT_TICKETS_UPDATE_JACKPOT_TICKETS_UPDATE_JACKPOT_TICKETS_UPDATE_JACKPOT_TICKETS_UPDATE_JACKPOT_TICKETS_UPDATE_JACKPOT_TICKETS_UPDATE_JACKPOT_TICKETS_UPDATE_JACKPOT_TICKETS_UPDATE_JACKPOT_TICKETS_UPDATE_JACKPOT_TICKETS_UPDATE_JACKPOT_TICKETS_UPDATE_JACKPOT_TICKETS_UPDATE_JACKPOT_TICKETS_UPDATE_JACKPOT_TICKETS_UPDATE_JACKPOT_TICKETS_UPDATE_JACKPOT_TICKETS_UPDATE_JACKPOT_TICKETS_UPDATE_JACKPOT_TICKETS_UPDATE_JACKPOT_TICKETS_UPDATE_JACKPOT_TICKETS_UPDATE_JACKPOT_TICKETS_UPDATE_JACKPOT_TICKETS_UPDATE_JACKPOT_TICKETS_UPDATE_JACKPOT_TICKETS_')
      console.log(action.payload);
      return {
        ...state,
        data: {
          ...state.data,
          surf_count: action.payload,
        },
        loading: false,
        error: null,
      };
    case UPDATE_AVATAR_PATH:
      console.log('UPDATE_AVATAR_PATH');
      console.log(action.payload);
      return {
        ...state,
        data: {
          ...state.data,
          avatar_path: action.payload.data,
        },
        loading: false,
        error: null,
      };

    case UPDATE_WEBSLOT:
      console.log('update webslot');
      console.log(action.payload);
      console.log(action.payload.data);
      return {
        ...state,
        data: {
          ...state.data,
          webslots: state.data.webslots.map(
            (webslot) => (webslot.id === action.payload.id
              ? {
                ...action.payload,
                order: [
                  ...webslot.order,
                ],
              }
              : webslot),
          ),
        },
        loading: false,
        error: null,
      };

    case INSERT_ORDER:
      return {
        ...state,
        data: {
          ...state.data,
          wallet: {
            ...state.data.wallet,
            available: action.payload.data.wallet.available,
            locked: action.payload.data.wallet.locked,
          },
          webslots: state.data.webslots.map(
            (webslot) => (webslot.id === action.payload.data.order.webslotId
              ? {
                ...webslot,
                order: [
                  ...webslot.order,
                  {
                    ...action.payload.data.order,
                    surfTicket: [],
                  },
                ],
              }
              : webslot),
          ),
        },
        loading: false,
        error: null,
      };

    case REMOVE_WEBSLOT_ORDER:
      console.log('REMOVE_WEBSLOT_ORDER');
      console.log(action.payload);
      console.log(action.payload.data.order);
      console.log(state.data.webslots);
      return {
        ...state,
        data: {
          ...state.data,
          wallet: {
            ...state.data.wallet,
          },
          webslots: state.data.webslots.map(
            (webslot) => ({
              ...webslot,
              order: webslot.order.filter((order) => {
                console.log(action.payload.data.order.id);
                console.log(order.id);
                console.log('13');
                if (Number(action.payload.data.order.id) !== Number(order.id)) {
                  return true;
                }
                return false;
              }),
            }),
          ),
        },
        loading: false,
        error: null,
      };

    case INSERT_WEBSLOT: {
      const existsInWebslots = state.data.webslots.some((webslot) => webslot.id === action.payload.webslot.id);
      if (existsInWebslots) {
        return state;
      }

      return {
        ...state,
        data: {
          ...state.data,
          webslots: [
            {
              ...action.payload.webslot,
              order: [
                // {
                //  surfTicket: [],
                // },
              ],
              domain: action.payload.domain,
            },
            ...state.data.webslots,
          ],
        },
        loading: false,
        error: null,
      }; }

    case REMOVE_WEBSLOT:
      return {
        ...state,
        data: {
          ...state.data,
          webslots: [
            ...state.data.webslots.filter((webslot) => webslot.id !== action.payload.data.webslot.id),
          ],
        },
        loading: false,
        error: null,
      };

    case BUY_WEBSLOT:
      return {
        ...state,
        data: {
          ...state.data,
          wallet: {
            ...state.data.wallet,
            ...action.payload.data.wallet,
          },
          webslot_amount: action.payload.data.webslot_amount,
          jackpot_tickets: action.payload.data.jackpot_tickets,
        },
        loading: false,
        error: null,
      };

    case BUY_BANNERSLOT:
      return {
        ...state,
        data: {
          ...state.data,
          wallet: {
            ...state.data.wallet,
            ...action.payload.data.wallet,
          },
          banners_amount: action.payload.data.banners_amount,
          jackpot_tickets: action.payload.data.jackpot_tickets,
        },
        loading: false,
        error: null,
      };

    case BUY_PUBLISHERSLOT:
      return {
        ...state,
        data: {
          ...state.data,
          wallet: {
            ...state.data.wallet,
            ...action.payload.data.wallet,
          },
          publishers_amount: action.payload.data.banners_amount,
          jackpot_tickets: action.payload.data.jackpot_tickets,
        },
        loading: false,
        error: null,
      };

    default:
      return state;
  }
}
