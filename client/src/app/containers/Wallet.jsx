import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Grid } from '@material-ui/core';
import Transactions from '../components/Transactions';

const WalletContainer = (props) => {
  const {
    wallet,
    addresses,
  } = props;
  return (
    <div>
      <Grid
        container
      >
        <Grid
          container
          item
          xs={12}
          sm={4}
          md={4}
          className="glass"
          justify="center"
        >
          <span className="dashboardWalletItem">Available</span>
          <span>
            {wallet ? (wallet.available / 1e8) : 'loading'}
            {' '}
            RUNES
          </span>
        </Grid>
        <Grid
          item
          container
          xs={12}
          sm={4}
          md={4}
          className="glass"
          justify="center"
        >
          <span className="dashboardWalletItem">Locked</span>
          <span className="dashboardWalletItem">
            {wallet ? (wallet.locked / 1e8) : 'loading'}
            {' '}
            RUNES
          </span>
        </Grid>
        <Grid
          item
          container
          xs={12}
          sm={4}
          md={4}
          className="glass"
          justify="center"
        >
          <span className="dashboardWalletItem">Total</span>
          <span className="dashboardWalletItem">
            {wallet ? ((wallet.available + wallet.locked) / 1e8) : 'loading'}
            {' '}
            RUNES
          </span>
        </Grid>
        <Grid
          item
          xs={12}
          className="transactionsContainer"
        >
          <Transactions
            addresses={addresses || []}
            transactions={addresses[0] ? addresses[0].transactions : []}
          />
        </Grid>
      </Grid>
    </div>
  )
}

function mapStateToProps(state) {
  return {
    websites: state.website.list,
  };
}

export default connect(mapStateToProps)(WalletContainer);
