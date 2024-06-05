import React, {
  useEffect,
  useState,
  useRef,
} from 'react';
import {
  connect,
  useDispatch,
} from 'react-redux';
import {
  Grid,
  Tooltip,
} from '@material-ui/core';
import { withTranslation } from 'react-i18next';
// import actions from 'redux-form/lib/actions';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import ConfirmationNumberIcon from '@material-ui/icons/ConfirmationNumber';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import ExposureIcon from '@material-ui/icons/Exposure';
import ThemeToggle from '../components/ThemeToggle';
import { getPrice } from '../actions';
import { fetchUserData } from '../actions/user';

const Footer = (props) => {
  const {
    t,
    error,
    loading,
  } = props;

  const dispatch = useDispatch();
  const [onlineCount, setOnlineCount] = useState('');

  useEffect(() => dispatch(fetchUserData()), [dispatch]);
  useEffect(() => dispatch(getPrice()), [dispatch]);
  useEffect(() => {}, [props.price]);
  useEffect(() => {}, [props.user]);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="infoBar footer">
      <Grid
        container
        // className="height100 d-flex justify-content-around justify-content-md-center Grid itemst-unstyled categories ng-scope"
        // ng-controller="myController"
        direction="row"
        justify="center"
        alignItems="baseline"
      >
        <Grid
          item
          container
          justify="center"
          xs={4}
          sm={4}
          md={2}
        >
          <Tooltip title="People Online" aria-label="show">
            <p className="noBottomMargin floatLeft">
              <FiberManualRecordIcon />
              {' '}
              {onlineCount !== '' ? onlineCount : props.online}
            </p>
          </Tooltip>
        </Grid>
        <Grid
          item
          container
          justify="center"
          xs={4}
          sm={4}
          md={2}
        >
          <Tooltip title="Wallet total balance" aria-label="show">
            <p className="noBottomMargin floatLeft">
              <AccountBalanceWalletIcon />
              {' '}
              {
             props.user && props.user.wallet
               ? ((props.user.wallet.available + props.user.wallet.locked) / 1e8)
               : 0
            }
            </p>
          </Tooltip>
        </Grid>
        <Grid
          item
          container
          justify="center"
          xs={4}
          sm={4}
          md={2}
        >
          <Tooltip title="Lottery tickets" aria-label="show">
            <p className="noBottomMargin floatLeft">
              <ConfirmationNumberIcon />
              {' '}
              {
             props.user && props.user
               ? props.user.jackpot_tickets
               : 0
            }
            </p>
          </Tooltip>
        </Grid>
        <Grid
          item
          container
          xs={4}
          sm={4}
          md={2}
          justify="center"
          // direction="column"
        >
          <Tooltip title="Estimated Wallet Value" aria-label="show">
            <p className="noBottomMargin">
              <ExposureIcon />
              {' '}
              ~$
              {
             props.user && props.user.wallet
               ? (((props.user.wallet.available + props.user.wallet.locked) / 1e8) * props.price.price).toFixed(3)
               : 0
            }
            </p>
          </Tooltip>
        </Grid>
        <Grid
          item
          container
          xs={4}
          sm={4}
          md={2}
          justify="center"
          // direction="column"
        >
          <Tooltip title="Current RUNES price" aria-label="show">
            <p className="noBottomMargin">
              <LocalOfferIcon />
              {' '}
              {props.price.price}
              {' '}
              $
            </p>
          </Tooltip>
        </Grid>
        <Grid
          item
          xs={4}
          sm={4}
          md={2}
          align="center"
          // alignItems="center"
          // direction="row"
        >
          <ThemeToggle />
        </Grid>
      </Grid>
    </div>
  )
}

const mapStateToProps = (state) => ({
  price: state.price,
  online: state.online.people,
  // wallet: state.user.data.user,
  user: state.user.data,
  errorMessage: state.auth.error,
})

export default connect(mapStateToProps)(withTranslation()(Footer));
