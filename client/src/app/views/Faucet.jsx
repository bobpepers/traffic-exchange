import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Box,
} from '@material-ui/core';

import AnimatedNumber from 'animated-number-react';
import Countdown from 'react-countdown';
import {
  reduxForm,
  Field,
  formValueSelector,
  change,
} from 'redux-form';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import {
  fetchFaucetRecord,
  claimFaucet,
  fetchFaucetRolls,
} from '../actions/faucet';
import Captcha from '../components/Captcha';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const Faucet = (props) => {
  const {
    handleSubmit,
    faucetRecord,
    faucetClaim,
    faucetRolls,
    auth: {
      authenticated,
    },
  } = props;

  document.title = 'RunesX - Faucet';
  const [usingAdblock, setUsingAdblock] = useState(false)
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [rerender, setRerender] = useState(1);
  const [page, setPage] = useState(0);
  const classes = useStyles();
  const dispatch = useDispatch();
  useEffect(() => dispatch(fetchFaucetRecord()), [dispatch]);
  useEffect(() => dispatch(fetchFaucetRolls()), [dispatch]);
  useEffect(() => {
    console.log('rerender');
  }, [
    faucetRecord,
    faucetClaim,
    faucetRolls,
  ]);
  useEffect(() => {
    document.title = 'RunesX - Faucet';
  }, []);

  useEffect(() => {
    setRerender(rerender + 1);
    const s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = 'https://www.runesx.com/uploads/runesx.js';
    document.body.appendChild(s);

    return () => {
      document.body.removeChild(s);
      if (document.getElementById('runesx-2')) {
        document.getElementById('runesx-2').innerHTML = '';
      }
    };
  }, [faucetClaim.data]);

  const handleFormSubmit = async (values) => {
    const { captchaResponse } = values;
    // document.getElementById('runesx-2').innerHTML = '';
    await dispatch(claimFaucet(captchaResponse));
    setRerender(rerender + 1);
    // document.getElementById('runesx-2').innerHTML = '';
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const renderer = ({
    hours, minutes, seconds, completed,
  }) => {
    if (completed) {
      return (
        <div className="text-center">
          <Field
            component={Captcha}
            change={change}
            name="captchaResponse"
          />
          <Button
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            type="submit"
          >
            Roll!
          </Button>
        </div>
      );
    }

    return (
      <span className="w-100 text-center">
        <h3 style={{ margin: 0, padding: 0 }}>Next claim in</h3>
        <h3 style={{ margin: 0, padding: 0 }}>
          {minutes}
          :
          {seconds}
        </h3>

      </span>
    );
  };

  const refreshPage = () => {
    window.location.reload(false);
  };
  let fakeAdBanner
  useEffect(() => {
    if (fakeAdBanner) {
      setUsingAdblock(fakeAdBanner.offsetHeight === 0)
    }
  })

  if (usingAdblock) {
    return (
      <div className="height100 surfContainer content text-center">
        <div
          ref={(r) => (fakeAdBanner = r)}
          style={{
            height: '1px',
            width: '1px',
            visibility: 'hidden',
            pointerEvents: 'none',
          }}
          className="adBanner"
        />
        <h2>It looks like you're using an ad blocker. That's okay. Who doesn't?</h2>
        <h2>But advertisement is the source of revenue for this website.</h2>
        <h2>Please disable adblocker to use the faucet feature</h2>
        <Button
          variant="contained"
          color="primary"
          onClick={refreshPage}
          size="large"
          fullWidth
        >
          I understand, I have disabled my adblocker.
        </Button>
      </div>
    );
  }

  return (
    <div className="content index600 height100 shadow-w ">
      <div
        ref={(r) => (fakeAdBanner = r)}
        style={{
          height: '1px', width: '1px', visibility: 'hidden', pointerEvents: 'none',
        }}
        className="adBanner"
      />
      <h2 className="dashboardWalletItem shadow-w">Faucet</h2>
      <Grid
        container
        justify="center"
        spacing={3}
      >
        <Box
          component={Grid}
          container
          item
          md={3}
          lg={3}
          xl={3}
          style={{
            width: '100%',
            textAlign: 'center',
            zIndex: 50,
          }}
          display={{
            xs: 'none',
            sm: 'none',
            md: 'block',
          }}
        >
          <iframe
            key={rerender}
            title="A-ads tower 1"
            data-aa="1500080"
            src="//ad.a-ads.com/1500080?size=160x600"
            scrolling="no"
            style={{
              width: '160px',
              height: '600px',
              border: '0px',
              padding: 0,
              overflow: 'hidden',
            }}
            allowtransparency="true"
          />
        </Box>
        <Grid container item xs={12} sm={12} md={6} lg={6} xl={6} className="text-center" spacing={3}>
          <Grid item xs={6} className="table_header_background">
            Lucky Number
          </Grid>
          <Grid item xs={6} className="table_header_background">
            Payout
          </Grid>
          <Grid item xs={6}>
            0 - 9885
          </Grid>
          <Grid item xs={6}>
            0.15
          </Grid>
          <Grid item xs={6}>
            9886 - 9985
          </Grid>
          <Grid item xs={6}>
            0.5
          </Grid>
          <Grid item xs={6}>
            9986 - 9993
          </Grid>
          <Grid item xs={6}>
            2
          </Grid>
          <Grid item xs={6}>
            9994 - 9997
          </Grid>
          <Grid item xs={6}>
            5
          </Grid>
          <Grid item xs={6}>
            9998 - 9999
          </Grid>
          <Grid item xs={6}>
            15
          </Grid>
          <Grid item xs={6}>
            10000
          </Grid>
          <Grid item xs={6}>
            50
          </Grid>

        </Grid>
        <Box
          component={Grid}
          container
          item
          md={3}
          lg={3}
          xl={3}
          className="adspot-right"
          style={{
            width: '100%',
            textAlign: 'center',
            zIndex: 50,
          }}
          display={{
            xs: 'none',
            sm: 'none',
            md: 'block',
          }}
          id="faucet-ad-wrapper-right"
        >
          <div
            className="_fa7cdd4c68507744"
            data-options="min_cpm=0.05"
            data-zone="c528826924bd4399966d705d7b11aec3"
            style={{
              width: '160px',
              height: '600px',
              display: 'inline-block',
              margin: '0 auto',
            }}
          >
            <div
              id="runesx-2"
              key={rerender}
            />

          </div>
          {/*
          <div
            id="runesx-2"
            key={rerender}
          />

          <iframe
            src="https://coinmedia.co/new_code_site131436.js"
            scrolling="no"
            frameBorder="0"
            width="160px"
            height="630px"
          />
          <div
            key={rerender}
            id="data_48695"
          />
          <ScriptTag
            data-cfasync="false"
            async
            type="text/javascript"
            src="//www.bitcoadz.io/display/items.php?48695&78037&160&600&1&0&0&0&0"
          /> */}

        </Box>

        <div id="block_22106" />
        <Grid container item xs={12} justify="center" spacing={3}>
          <Grid
            item
            container
            xs={12}
            alignContent="center"
            justify="center"
            alignItems="center"
            direction="column"
            className="text-center"
          >
            <h2>
              <AnimatedNumber
                value={faucetClaim && faucetClaim.data ? faucetClaim.data.rolled : 0}
                formatValue={(value) => value.toFixed(0)}
              />
            </h2>

          </Grid>
          <Grid item xs={12}>

            {faucetClaim
            && faucetClaim.data
            && (
            <p className="text-center">
              You claimed
              {' '}
              {faucetClaim.data.claimAmount / 1e8}
              {' '}
              RUNES and 1 jackpot ticket
            </p>
            )}
            <form onSubmit={handleSubmit((values) => handleFormSubmit(values))}>
              {
                  faucetRecord
                  && faucetRecord.data
                  && (
                  <Countdown
                    key={new Date(faucetRecord.data.updatedAt).valueOf()}
                    date={new Date(faucetRecord.data.updatedAt).valueOf() + (10 * 60 * 1000)}
                    renderer={renderer}
                  />
                  )
                }
            </form>
            {!authenticated
             && (
             <Button
               variant="contained"
               color="primary"
               size="large"
               fullWidth
               component={Link}
               to="/signin"
             >
               Sign in
             </Button>
             )}
          </Grid>
          <Grid
            container
            item
            xs={12}
            justify="center"
          >
            <div>
              <div
                className="_fa7cdd4c68507744"
                data-options="min_cpm=0.05"
                data-zone="25191682e2de44dcbf261f46ddd22fc3"
                style={{
                  width: '728px',
                  height: '90px',
                  display: 'inline-block',
                  margin: '0 auto',
                }}
              >
                <div
                  id="runesx-1"
                  key={rerender}
                />
              </div>
            </div>
          </Grid>

          <Grid item xs={12}>
            <h2 className="shadow-w text-center">Previous Rolls</h2>
            <TableContainer>
              <Table className={classes.table} size="small" aria-label="simple table">
                <TableHead className="faucet_table_header">
                  <TableRow>
                    <TableCell>Time</TableCell>
                    <TableCell>id</TableCell>
                    <TableCell align="right">Rolled</TableCell>
                    <TableCell align="right">Claimed</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody className="faucet_table_body">
                  { faucetRolls
                  && faucetRolls.data
                  && faucetRolls.data.length > 0
                  && faucetRolls.data
                    .sort((a, b) => b.id - a.id)
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((roll) => (
                      <TableRow key={roll.id}>
                        <TableCell component="th" scope="row">
                          {roll.createdAt}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {roll.id}
                        </TableCell>
                        <TableCell align="right">{roll.rolled}</TableCell>
                        <TableCell align="right">{roll.claimAmount / 1e8}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[25, 50, 100]}
                component="span"
                className="faucet_table_pagination"
                count={faucetRolls && faucetRolls.data ? Number(faucetRolls.data.length) : 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
              />
            </TableContainer>
          </Grid>
          <Grid item xs={12}>
            <div
              style={{
                width: '100%',
                textAlign: 'center',
                zIndex: 50,
              }}
              className="spacing-top adspot-right"
            >
              <iframe
                key={rerender}
                title="A-ads advertisement"
                data-aa="1483982"
                src="//ad.a-ads.com/1483982?size=728x90"
                scrolling="no"
                style={{
                  width: '728px',
                  height: '90px',
                  border: '0px',
                  padding: 0,
                  overflow: 'hidden',
                }}
                allowtransparency="true"
              />
            </div>
          </Grid>

        </Grid>
      </Grid>
    </div>
  )
}

Faucet.propTypes = {
  faucetRolls: PropTypes.shape({
    data: PropTypes.arrayOf.isRequired,
  }).isRequired,
  faucetRecord: PropTypes.shape({
    data: PropTypes.arrayOf.isRequired,
  }).isRequired,
  faucetClaim: PropTypes.shape({
    data: PropTypes.arrayOf.isRequired,
  }).isRequired,
};

const validate = (formProps) => {
  const errors = {};
  if (!formProps.captchaResponse) {
    errors.captchaResponse = 'Please validate the captcha.';
  }

  return errors;
}

const selector = formValueSelector('claimFaucet');

const mapStateToProps = (state) => ({
  faucetRecord: state.faucetRecord,
  faucetClaim: state.faucetClaim,
  faucetRolls: state.faucetRolls,
  auth: state.auth,
  recaptchaValue: selector(state, 'captchaResponse'),
})

// export default connect(mapStateToProps)(Faucet);
export default connect(mapStateToProps, null)(reduxForm({ form: 'claimFaucet', validate })(Faucet));
