import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import {
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useForkRef,
} from '@material-ui/core';
import Moment from 'react-moment';
import Countdown from 'react-countdown';
import { BigNumber } from 'bignumber.js';
import PropTypes from 'prop-types';
import { fetchJackpots } from '../actions/jackpot';
import jackpot from '../reducers/jackpot';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const Jackpot = (props) => {
  const {
    jackpots,
    user,
  } = props;
  document.title = 'RunesX - Jackpot';
  const dispatch = useDispatch();
  const classes = useStyles();
  const [page, setPage] = useState(1);
  const [rerender, setRerender] = useState(1);

  useEffect(() => {
    dispatch(fetchJackpots());
  }, [dispatch]);
  useEffect(() => {}, [jackpots]);
  const handleChange = (event, value) => {
    setPage(value);
  };
  useEffect(() => {
    document.title = 'RunesX - Lottery';
  }, []);

  useEffect(() => {
  }, [user, jackpots]);

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
  }, []);

  const renderer = ({
    days, hours, minutes, seconds, completed,
  }) => (
    <>
      {days}
      {' '}
      days
      {' '}
      {hours}
      {' '}
      hours
      {' '}
      {minutes}
      {' '}
      minutes
      {' '}
      {seconds}
      {' '}
      seconds
    </>
  );

  return (
    <div className={`content index600 height100 ${classes.root}`}>
      <Grid
        container
        className="jackpot-wrapper"
        justify="center"
      >
        <Grid item xs={12}>
          <h2 className="dashboardWalletItem shadow-w">Lottery</h2>
        </Grid>
        <Grid item xs={12}>
          <p className="dashboardWalletItem shadow-w">
            Week #
            {
            jackpots
            && jackpots.data.length > 0
            && jackpots.data[page - 1].id
            }
          </p>
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={10}
          lg={8}
          xl={8}
        >
          <div className="pyramid">
            <div className="row">
              <div className="block gold">
                <div className="rank-cell">
                  1st
                </div>
                <div className="price-cell">
                  {
                  jackpots
                  && jackpots.data.length > 0
                  && new BigNumber(
                    jackpots.data[page - 1].jackpot_amount,
                  )
                    .dividedBy(100)
                    .times(24)
                    .dividedBy(1e8)
                    .toString()
                  }
                </div>
              </div>
            </div>
            <div className="row">
              <div className="block silver">
                <div className="rank-cell">
                  2nd
                </div>
                <div className="price-cell">
                  {
                  jackpots
                  && jackpots.data.length > 0
                  && new BigNumber(
                    jackpots.data[page - 1].jackpot_amount,
                  )
                    .dividedBy(100)
                    .times(19)
                    .dividedBy(1e8)
                    .toString()
                  }
                </div>
              </div>
              <div className="block silver">
                <div className="rank-cell">
                  3th
                </div>
                <div className="price-cell">
                  {
                  jackpots
                  && jackpots.data.length > 0
                  && new BigNumber(
                    jackpots.data[page - 1].jackpot_amount,
                  )
                    .dividedBy(100)
                    .times(14)
                    .dividedBy(1e8)
                    .toString()
                  }
                </div>
              </div>
            </div>
            <div className="row">
              <div className="block bronze">
                <div className="rank-cell">
                  4th
                </div>
                <div className="price-cell">
                  {
                  jackpots
                  && jackpots.data.length > 0
                  && new BigNumber(
                    jackpots.data[page - 1].jackpot_amount,
                  )
                    .dividedBy(100)
                    .times(10)
                    .dividedBy(1e8)
                    .toString()
                  }
                </div>
              </div>
              <div className="block bronze">
                <div className="rank-cell">
                  5th
                </div>
                <div className="price-cell">
                  {
                  jackpots
                  && jackpots.data.length > 0
                  && new BigNumber(
                    jackpots.data[page - 1].jackpot_amount,
                  )
                    .dividedBy(100)
                    .times(9)
                    .dividedBy(1e8)
                    .toString()
                  }
                </div>
              </div>
              <div className="block bronze">
                <div className="rank-cell">
                  6th
                </div>
                <div className="price-cell">
                  {
                  jackpots
                  && jackpots.data.length > 0
                  && new BigNumber(
                    jackpots.data[page - 1].jackpot_amount,
                  )
                    .dividedBy(100)
                    .times(8)
                    .dividedBy(1e8)
                    .toString()
                  }
                </div>
              </div>
            </div>
            <div className="row">
              <div className="block green_prize_rank">
                <div className="rank-cell">
                  7th
                </div>
                <div className="price-cell">
                  {
                  jackpots
                  && jackpots.data.length > 0
                  && new BigNumber(
                    jackpots.data[page - 1].jackpot_amount,
                  )
                    .dividedBy(100)
                    .times(6)
                    .dividedBy(1e8)
                    .toString()
                  }
                </div>
              </div>
              <div className="block green_prize_rank">
                <div className="rank-cell">
                  8th
                </div>
                <div className="price-cell">
                  {
                  jackpots
                  && jackpots.data.length > 0
                  && new BigNumber(
                    jackpots.data[page - 1].jackpot_amount,
                  )
                    .dividedBy(100)
                    .times(5)
                    .dividedBy(1e8)
                    .toString()
                  }
                </div>
              </div>
              <div className="block green_prize_rank">
                <div className="rank-cell">
                  9th
                </div>
                <div className="price-cell">
                  {
                  jackpots
                  && jackpots.data.length > 0
                  && new BigNumber(
                    jackpots.data[page - 1].jackpot_amount,
                  )
                    .dividedBy(100)
                    .times(3)
                    .dividedBy(1e8)
                    .toString()
                  }
                </div>
              </div>
              <div className="block green_prize_rank">
                <div className="rank-cell">
                  10th
                </div>
                <div className="price-cell">
                  {
                  jackpots
                  && jackpots.data.length > 0
                  && new BigNumber(
                    jackpots.data[page - 1].jackpot_amount,
                  )
                    .dividedBy(100)
                    .times(2)
                    .dividedBy(1e8)
                    .toString()
                  }
                </div>
              </div>
            </div>
          </div>
        </Grid>
        <Grid item xs={12} />
        <Grid item xs={4}>
          <p className="dashboardWalletItem shadow-w">
            Phase
          </p>
          <p className="dashboardWalletItem shadow-w">
            {
            jackpots
            && jackpots.data.length > 0
            && jackpots.data[page - 1].phase
            }
          </p>
        </Grid>

        {
                  jackpots
                  && jackpots.data.length > 0
                  && (page - 1) === 0
                  && (
                    <Grid item xs={4}>
                      <p className="dashboardWalletItem shadow-w">
                        Ends in
                      </p>
                      <p className="dashboardWalletItem shadow-w">
                        <Countdown
                          key={new Date(jackpots.data[page - 1].endsAt).valueOf()}
                          date={new Date(jackpots.data[page - 1].endsAt).valueOf()}
                          renderer={renderer}
                        />
                      </p>

                    </Grid>
                  )
            }
        {
                  jackpots
                  && jackpots.data.length > 0
                  && (page - 1) !== 0
                  && (
                    <Grid item xs={4}>
                      <p className="dashboardWalletItem shadow-w">
                        Ended
                      </p>
                      <p className="dashboardWalletItem shadow-w">
                        <Moment
                          interval={1000}
                          fromNow
                        >
                          {jackpots.data[page - 1].endsAt}
                        </Moment>
                      </p>

                    </Grid>
                  )
            }

        <Grid item xs={4}>
          <p className="dashboardWalletItem shadow-w">
            Pot
          </p>
          <p className="dashboardWalletItem shadow-w">
            {
            jackpots
            && jackpots.data.length > 0
            && (jackpots.data[page - 1].jackpot_amount / 1e8)
            }
            {' '}
            RUNES
          </p>
        </Grid>
        <Grid
          item
          xs={12}
          className="text-center"
        >
          <div
            className="adbit-display-ad"
            data-adspace-id="FF232F5F47"
          />
        </Grid>
        <Grid
          item
          container
          xs={12}
        >
          <Grid item xs={4}>
            <p className="dashboardWalletItem shadow-w">
              Total Tickets
            </p>
            <p className="dashboardWalletItem shadow-w">
              {
            jackpots
            && jackpots.data.length > 0
            && (jackpots.data[page - 1].total_tickets)
            }
            </p>
          </Grid>
          <Grid item xs={4}>
            <p className="dashboardWalletItem shadow-w">
              Your tickets
            </p>
            <p className="dashboardWalletItem shadow-w">
              {
            jackpots
            && page === 1
            && jackpots.data.length > 0
            && user
              && (user.jackpot_tickets)
            }
              {
            jackpots
            && page === 1
            && jackpots.data.length > 0
            && !user
              && '0'
            }
              {
            jackpots
            && page !== 1
            && jackpots.data.length > 0
              && 'done'
            }
            </p>
          </Grid>
          <Grid item xs={4}>
            <p className="dashboardWalletItem shadow-w">
              Win Chance
            </p>
            <p className="dashboardWalletItem shadow-w">
              {
            jackpots
            && page === 1
            && jackpots.data.length > 0
            && user
              && (`${((user.jackpot_tickets / jackpots.data[page - 1].total_tickets) * 100).toFixed(6)}%`)
            }
              {
              jackpots
              && page === 1
              && jackpots.data.length > 0
              && !user
                && '0%'
              }
              {
            jackpots
            && page !== 1
            && jackpots.data.length > 0
              && 'done'
            }
            </p>
          </Grid>
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
              <div id="runesx-1" />
            </div>
          </div>
        </Grid>
        <Grid item xs={12}>
          <h3 className="dashboardWalletItem shadow-w">
            Winners
          </h3>
        </Grid>
        <TableContainer>
          <Table className={classes.table} size="small" aria-label="a dense table">
            <TableHead className="faucet_table_header">
              <TableRow>
                <TableCell>Position</TableCell>
                <TableCell align="right">User</TableCell>
                <TableCell align="right">Tickets Used</TableCell>
                <TableCell align="right">Percentage</TableCell>
                <TableCell align="right">Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className="faucet_table_body">
              <TableRow key={1}>
                <TableCell component="th" scope="row">
                  #1
                </TableCell>
                <TableCell align="right">
                  {
                    jackpots
                    && jackpots.data.length > 0
                    && jackpots.data[page - 1]
                    && jackpots.data[page - 1].winner_one
                      ? jackpots.data[page - 1].winner_one.username
                      : 'Undecided'
                  }
                </TableCell>
                <TableCell align="right">
                  {
                    jackpots
                    && jackpots.data.length > 0
                    && jackpots.data[page - 1]
                    && jackpots.data[page - 1].winner_one
                      ? jackpots.data[page - 1].winner_one_tickets
                      : 'Undecided'
                  }
                </TableCell>
                <TableCell align="right">
                  24%
                </TableCell>
                <TableCell align="right">
                  {
                    jackpots
                    && jackpots.data.length > 0
                    && jackpots.data[page - 1]
                    && jackpots.data[page - 1].winner_one
                      ? `${new BigNumber(
                        jackpots.data[page - 1].jackpot_amount,
                      )
                        .dividedBy(100)
                        .times(24)
                        .dividedBy(1e8)
                        .toString()} RUNES`
                      : '0 RUNES'
                  }
                </TableCell>
              </TableRow>
              <TableRow key={2}>
                <TableCell component="th" scope="row">
                  #2
                </TableCell>
                <TableCell align="right">
                  {
                    jackpots
                    && jackpots.data.length > 0
                    && jackpots.data[page - 1]
                    && jackpots.data[page - 1].winner_two
                      ? jackpots.data[page - 1].winner_two.username
                      : 'Undecided'
                  }
                </TableCell>
                <TableCell align="right">
                  {
                    jackpots
                    && jackpots.data.length > 0
                    && jackpots.data[page - 1]
                    && jackpots.data[page - 1].winner_two
                      ? jackpots.data[page - 1].winner_two_tickets
                      : 'Undecided'
                  }
                </TableCell>
                <TableCell align="right">
                  19%
                </TableCell>
                <TableCell align="right">
                  {
                    jackpots
                    && jackpots.data.length > 0
                    && jackpots.data[page - 1]
                    && jackpots.data[page - 1].winner_two
                      ? `${new BigNumber(
                        jackpots.data[page - 1].jackpot_amount,
                      )
                        .dividedBy(100)
                        .times(19)
                        .dividedBy(1e8)
                        .toString()} RUNES`
                      : '0 RUNES'
                  }
                </TableCell>
              </TableRow>

              <TableRow key={3}>
                <TableCell component="th" scope="row">
                  #3
                </TableCell>
                <TableCell align="right">
                  {
                    jackpots
                    && jackpots.data.length > 0
                    && jackpots.data[page - 1]
                    && jackpots.data[page - 1].winner_three
                      ? jackpots.data[page - 1].winner_three.username
                      : 'Undecided'
                  }
                </TableCell>
                <TableCell align="right">
                  {
                    jackpots
                    && jackpots.data.length > 0
                    && jackpots.data[page - 1]
                    && jackpots.data[page - 1].winner_three
                      ? jackpots.data[page - 1].winner_three_tickets
                      : 'Undecided'
                  }
                </TableCell>
                <TableCell align="right">
                  14%
                </TableCell>
                <TableCell align="right">
                  {
                    jackpots
                    && jackpots.data.length > 0
                    && jackpots.data[page - 1]
                    && jackpots.data[page - 1].winner_three
                      ? `${new BigNumber(
                        jackpots.data[page - 1].jackpot_amount,
                      )
                        .dividedBy(100)
                        .times(14)
                        .dividedBy(1e8)
                        .toString()} RUNES`
                      : '0 RUNES'
                  }
                </TableCell>
              </TableRow>

              <TableRow key={4}>
                <TableCell component="th" scope="row">
                  #4
                </TableCell>
                <TableCell align="right">
                  {
                    jackpots
                    && jackpots.data.length > 0
                    && jackpots.data[page - 1]
                    && jackpots.data[page - 1].winner_four
                      ? jackpots.data[page - 1].winner_four.username
                      : 'Undecided'
                  }
                </TableCell>
                <TableCell align="right">
                  {
                    jackpots
                    && jackpots.data.length > 0
                    && jackpots.data[page - 1]
                    && jackpots.data[page - 1].winner_four
                      ? jackpots.data[page - 1].winner_four_tickets
                      : 'Undecided'
                  }
                </TableCell>
                <TableCell align="right">
                  10%
                </TableCell>
                <TableCell align="right">
                  {
                    jackpots
                    && jackpots.data.length > 0
                    && jackpots.data[page - 1]
                    && jackpots.data[page - 1].winner_four
                      ? `${new BigNumber(
                        jackpots.data[page - 1].jackpot_amount,
                      )
                        .dividedBy(100)
                        .times(10)
                        .dividedBy(1e8)
                        .toString()} RUNES`
                      : '0 RUNES'
                  }
                </TableCell>
              </TableRow>

              <TableRow key={5}>
                <TableCell component="th" scope="row">
                  #5
                </TableCell>
                <TableCell align="right">
                  {
                    jackpots
                    && jackpots.data.length > 0
                    && jackpots.data[page - 1]
                    && jackpots.data[page - 1].winner_five
                      ? jackpots.data[page - 1].winner_five.username
                      : 'Undecided'
                  }
                </TableCell>
                <TableCell align="right">
                  {
                    jackpots
                    && jackpots.data.length > 0
                    && jackpots.data[page - 1]
                    && jackpots.data[page - 1].winner_five
                      ? jackpots.data[page - 1].winner_five_tickets
                      : 'Undecided'
                  }
                </TableCell>
                <TableCell align="right">
                  9%
                </TableCell>
                <TableCell align="right">
                  {
                    jackpots
                    && jackpots.data.length > 0
                    && jackpots.data[page - 1]
                    && jackpots.data[page - 1].winner_five
                      ? `${new BigNumber(
                        jackpots.data[page - 1].jackpot_amount,
                      )
                        .dividedBy(100)
                        .times(9)
                        .dividedBy(1e8)
                        .toString()} RUNES`
                      : '0 RUNES'
                  }
                </TableCell>
              </TableRow>

              <TableRow key={6}>
                <TableCell component="th" scope="row">
                  #6
                </TableCell>
                <TableCell align="right">
                  {
                    jackpots
                    && jackpots.data.length > 0
                    && jackpots.data[page - 1]
                    && jackpots.data[page - 1].winner_six
                      ? jackpots.data[page - 1].winner_six.username
                      : 'Undecided'
                  }
                </TableCell>
                <TableCell align="right">
                  {
                    jackpots
                    && jackpots.data.length > 0
                    && jackpots.data[page - 1]
                    && jackpots.data[page - 1].winner_six
                      ? jackpots.data[page - 1].winner_six_tickets
                      : 'Undecided'
                  }
                </TableCell>
                <TableCell align="right">
                  8%
                </TableCell>
                <TableCell align="right">
                  {
                    jackpots
                    && jackpots.data.length > 0
                    && jackpots.data[page - 1]
                    && jackpots.data[page - 1].winner_six
                      ? `${new BigNumber(
                        jackpots.data[page - 1].jackpot_amount,
                      )
                        .dividedBy(100)
                        .times(8)
                        .dividedBy(1e8)
                        .toString()} RUNES`
                      : '0 RUNES'
                  }
                </TableCell>
              </TableRow>

              <TableRow key={7}>
                <TableCell component="th" scope="row">
                  #7
                </TableCell>
                <TableCell align="right">
                  {
                    jackpots
                    && jackpots.data.length > 0
                    && jackpots.data[page - 1]
                    && jackpots.data[page - 1].winner_seven
                      ? jackpots.data[page - 1].winner_seven.username
                      : 'Undecided'
                  }
                </TableCell>
                <TableCell align="right">
                  {
                    jackpots
                    && jackpots.data.length > 0
                    && jackpots.data[page - 1]
                    && jackpots.data[page - 1].winner_seven
                      ? jackpots.data[page - 1].winner_seven_tickets
                      : 'Undecided'
                  }
                </TableCell>
                <TableCell align="right">
                  6%
                </TableCell>
                <TableCell align="right">
                  {
                    jackpots
                    && jackpots.data.length > 0
                    && jackpots.data[page - 1]
                    && jackpots.data[page - 1].winner_seven
                      ? `${new BigNumber(
                        jackpots.data[page - 1].jackpot_amount,
                      )
                        .dividedBy(100)
                        .times(6)
                        .dividedBy(1e8)
                        .toString()} RUNES`
                      : '0 RUNES'
                  }
                </TableCell>
              </TableRow>

              <TableRow key={8}>
                <TableCell component="th" scope="row">
                  #8
                </TableCell>
                <TableCell align="right">
                  {
                    jackpots
                    && jackpots.data.length > 0
                    && jackpots.data[page - 1]
                    && jackpots.data[page - 1].winner_eigth
                      ? jackpots.data[page - 1].winner_eigth.username
                      : 'Undecided'
                  }
                </TableCell>
                <TableCell align="right">
                  {
                    jackpots
                    && jackpots.data.length > 0
                    && jackpots.data[page - 1]
                    && jackpots.data[page - 1].winner_eigth
                      ? jackpots.data[page - 1].winner_eigth_tickets
                      : 'Undecided'
                  }
                </TableCell>
                <TableCell align="right">
                  5%
                </TableCell>
                <TableCell align="right">
                  {
                    jackpots
                    && jackpots.data.length > 0
                    && jackpots.data[page - 1]
                    && jackpots.data[page - 1].winner_eigth
                      ? `${new BigNumber(
                        jackpots.data[page - 1].jackpot_amount,
                      )
                        .dividedBy(100)
                        .times(5)
                        .dividedBy(1e8)
                        .toString()} RUNES`
                      : '0 RUNES'
                  }
                </TableCell>
              </TableRow>

              <TableRow key={9}>
                <TableCell component="th" scope="row">
                  #9
                </TableCell>
                <TableCell align="right">
                  {
                    jackpots
                    && jackpots.data.length > 0
                    && jackpots.data[page - 1]
                    && jackpots.data[page - 1].winner_nine
                      ? jackpots.data[page - 1].winner_nine.username
                      : 'Undecided'
                  }
                </TableCell>
                <TableCell align="right">
                  {
                    jackpots
                    && jackpots.data.length > 0
                    && jackpots.data[page - 1]
                    && jackpots.data[page - 1].winner_nine
                      ? jackpots.data[page - 1].winner_nine_tickets
                      : 'Undecided'
                  }
                </TableCell>
                <TableCell align="right">
                  3%
                </TableCell>
                <TableCell align="right">
                  {
                    jackpots
                    && jackpots.data.length > 0
                    && jackpots.data[page - 1]
                    && jackpots.data[page - 1].winner_nine
                      ? `${new BigNumber(
                        jackpots.data[page - 1].jackpot_amount,
                      )
                        .dividedBy(100)
                        .times(3)
                        .dividedBy(1e8)
                        .toString()} RUNES`
                      : '0 RUNES'
                  }
                </TableCell>
              </TableRow>

              <TableRow key={10}>
                <TableCell component="th" scope="row">
                  #10
                </TableCell>
                <TableCell align="right">
                  {
                    jackpots
                    && jackpots.data.length > 0
                    && jackpots.data[page - 1]
                    && jackpots.data[page - 1].winner_ten
                      ? jackpots.data[page - 1].winner_ten.username
                      : 'Undecided'
                  }
                </TableCell>
                <TableCell align="right">
                  {
                    jackpots
                    && jackpots.data.length > 0
                    && jackpots.data[page - 1]
                    && jackpots.data[page - 1].winner_ten
                      ? jackpots.data[page - 1].winner_ten_tickets
                      : 'Undecided'
                  }
                </TableCell>
                <TableCell align="right">
                  2%
                </TableCell>
                <TableCell align="right">
                  {
                    jackpots
                    && jackpots.data.length > 0
                    && jackpots.data[page - 1]
                    && jackpots.data[page - 1].winner_ten
                      ? `${new BigNumber(
                        jackpots.data[page - 1].jackpot_amount,
                      )
                        .dividedBy(100)
                        .times(2)
                        .dividedBy(1e8)
                        .toString()} RUNES`
                      : '0 RUNES'
                  }
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
        {
        jackpots
        && jackpots.data.length > 0
        && page === 1
        && (
          <>
            <Grid item xs={12}>
              <h3 className="dashboardWalletItem shadow-w">
                Previous Week Winners
              </h3>
            </Grid>
            <TableContainer>
              <Table className={classes.table} size="small" aria-label="a dense table">
                <TableHead className="faucet_table_header">
                  <TableRow>
                    <TableCell>Position</TableCell>
                    <TableCell align="right">User</TableCell>
                    <TableCell align="right">Tickets Used</TableCell>
                    <TableCell align="right">Percentage</TableCell>
                    <TableCell align="right">Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody className="faucet_table_body">
                  <TableRow key={1}>
                    <TableCell component="th" scope="row">
                      #1
                    </TableCell>
                    <TableCell align="right">
                      {
                    jackpots.data[1].winner_one
                      ? jackpots.data[1].winner_one.username
                      : 'Undecided'
                  }
                    </TableCell>
                    <TableCell align="right">
                      {
                    jackpots.data[1].winner_one
                      ? jackpots.data[1].winner_one_tickets
                      : 'Undecided'
                  }
                    </TableCell>
                    <TableCell align="right">
                      24%
                    </TableCell>
                    <TableCell align="right">
                      {
                    jackpots.data[1].winner_one
                      ? `${new BigNumber(
                        jackpots.data[1].jackpot_amount,
                      )
                        .dividedBy(100)
                        .times(24)
                        .dividedBy(1e8)
                        .toString()} RUNES`
                      : '0 RUNES'
                  }
                    </TableCell>
                  </TableRow>
                  <TableRow key={2}>
                    <TableCell component="th" scope="row">
                      #2
                    </TableCell>
                    <TableCell align="right">
                      {
                    jackpots.data[1].winner_two
                      ? jackpots.data[1].winner_two.username
                      : 'Undecided'
                  }
                    </TableCell>
                    <TableCell align="right">
                      {
                    jackpots.data[1].winner_two
                      ? jackpots.data[1].winner_two_tickets
                      : 'Undecided'
                  }
                    </TableCell>
                    <TableCell align="right">
                      19%
                    </TableCell>
                    <TableCell align="right">
                      {
                    jackpots.data[1].winner_two
                      ? `${new BigNumber(
                        jackpots.data[1].jackpot_amount,
                      )
                        .dividedBy(100)
                        .times(19)
                        .dividedBy(1e8)
                        .toString()} RUNES`
                      : '0 RUNES'
                  }
                    </TableCell>
                  </TableRow>

                  <TableRow key={3}>
                    <TableCell component="th" scope="row">
                      #3
                    </TableCell>
                    <TableCell align="right">
                      {
                    jackpots.data[1].winner_three
                      ? jackpots.data[1].winner_three.username
                      : 'Undecided'
                  }
                    </TableCell>
                    <TableCell align="right">
                      {
                    jackpots.data[1].winner_three
                      ? jackpots.data[1].winner_three_tickets
                      : 'Undecided'
                  }
                    </TableCell>
                    <TableCell align="right">
                      14%
                    </TableCell>
                    <TableCell align="right">
                      {
                    jackpots.data[1].winner_three
                      ? `${new BigNumber(
                        jackpots.data[1].jackpot_amount,
                      )
                        .dividedBy(100)
                        .times(14)
                        .dividedBy(1e8)
                        .toString()} RUNES`
                      : '0 RUNES'
                  }
                    </TableCell>
                  </TableRow>

                  <TableRow key={4}>
                    <TableCell component="th" scope="row">
                      #4
                    </TableCell>
                    <TableCell align="right">
                      {
                    jackpots.data[1].winner_four
                      ? jackpots.data[1].winner_four.username
                      : 'Undecided'
                  }
                    </TableCell>
                    <TableCell align="right">
                      {
                    jackpots.data[1].winner_four
                      ? jackpots.data[1].winner_four_tickets
                      : 'Undecided'
                  }
                    </TableCell>
                    <TableCell align="right">
                      10%
                    </TableCell>
                    <TableCell align="right">
                      {
                    jackpots.data[1].winner_four
                      ? `${new BigNumber(
                        jackpots.data[1].jackpot_amount,
                      )
                        .dividedBy(100)
                        .times(10)
                        .dividedBy(1e8)
                        .toString()} RUNES`
                      : '0 RUNES'
                  }
                    </TableCell>
                  </TableRow>

                  <TableRow key={5}>
                    <TableCell component="th" scope="row">
                      #5
                    </TableCell>
                    <TableCell align="right">
                      {
                    jackpots.data[1].winner_five
                      ? jackpots.data[1].winner_five.username
                      : 'Undecided'
                  }
                    </TableCell>
                    <TableCell align="right">
                      {
                     jackpots.data[1].winner_five
                       ? jackpots.data[1].winner_five_tickets
                       : 'Undecided'
                  }
                    </TableCell>
                    <TableCell align="right">
                      9%
                    </TableCell>
                    <TableCell align="right">
                      {
                     jackpots.data[1].winner_five
                       ? `${new BigNumber(
                         jackpots.data[1].jackpot_amount,
                       )
                         .dividedBy(100)
                         .times(9)
                         .dividedBy(1e8)
                         .toString()} RUNES`
                       : '0 RUNES'
                  }
                    </TableCell>
                  </TableRow>

                  <TableRow key={6}>
                    <TableCell component="th" scope="row">
                      #6
                    </TableCell>
                    <TableCell align="right">
                      {
                     jackpots.data[1].winner_six
                       ? jackpots.data[1].winner_six.username
                       : 'Undecided'
                  }
                    </TableCell>
                    <TableCell align="right">
                      {
                     jackpots.data[1].winner_six
                       ? jackpots.data[1].winner_six_tickets
                       : 'Undecided'
                  }
                    </TableCell>
                    <TableCell align="right">
                      8%
                    </TableCell>
                    <TableCell align="right">
                      {
                    jackpots.data[1].winner_six
                      ? `${new BigNumber(
                        jackpots.data[1].jackpot_amount,
                      )
                        .dividedBy(100)
                        .times(8)
                        .dividedBy(1e8)
                        .toString()} RUNES`
                      : '0 RUNES'
                  }
                    </TableCell>
                  </TableRow>

                  <TableRow key={7}>
                    <TableCell component="th" scope="row">
                      #7
                    </TableCell>
                    <TableCell align="right">
                      {
                     jackpots.data[1].winner_seven
                       ? jackpots.data[1].winner_seven.username
                       : 'Undecided'
                  }
                    </TableCell>
                    <TableCell align="right">
                      {
                    jackpots.data[1].winner_seven
                      ? jackpots.data[1].winner_seven_tickets
                      : 'Undecided'
                  }
                    </TableCell>
                    <TableCell align="right">
                      6%
                    </TableCell>
                    <TableCell align="right">
                      {
                    jackpots.data[1].winner_seven
                      ? `${new BigNumber(
                        jackpots.data[1].jackpot_amount,
                      )
                        .dividedBy(100)
                        .times(6)
                        .dividedBy(1e8)
                        .toString()} RUNES`
                      : '0 RUNES'
                  }
                    </TableCell>
                  </TableRow>

                  <TableRow key={8}>
                    <TableCell component="th" scope="row">
                      #8
                    </TableCell>
                    <TableCell align="right">
                      {
                     jackpots.data[1].winner_eigth
                       ? jackpots.data[1].winner_eigth.username
                       : 'Undecided'
                  }
                    </TableCell>
                    <TableCell align="right">
                      {
                     jackpots.data[1].winner_eigth
                       ? jackpots.data[1].winner_eight_tickets
                       : 'Undecided'
                  }
                    </TableCell>
                    <TableCell align="right">
                      5%
                    </TableCell>
                    <TableCell align="right">
                      {
                     jackpots.data[1].winner_eigth
                       ? `${new BigNumber(
                         jackpots.data[1].jackpot_amount,
                       )
                         .dividedBy(100)
                         .times(5)
                         .dividedBy(1e8)
                         .toString()} RUNES`
                       : '0 RUNES'
                  }
                    </TableCell>
                  </TableRow>

                  <TableRow key={9}>
                    <TableCell component="th" scope="row">
                      #9
                    </TableCell>
                    <TableCell align="right">
                      {
                    jackpots.data[1].winner_nine
                      ? jackpots.data[1].winner_nine.username
                      : 'Undecided'
                  }
                    </TableCell>
                    <TableCell align="right">
                      {
                    jackpots.data[1].winner_nine
                      ? jackpots.data[1].winner_nine_tickets
                      : 'Undecided'
                  }
                    </TableCell>
                    <TableCell align="right">
                      3%
                    </TableCell>
                    <TableCell align="right">
                      {
                    jackpots.data[1].winner_nine
                      ? `${new BigNumber(
                        jackpots.data[1].jackpot_amount,
                      )
                        .dividedBy(100)
                        .times(3)
                        .dividedBy(1e8)
                        .toString()} RUNES`
                      : '0 RUNES'
                  }
                    </TableCell>
                  </TableRow>

                  <TableRow key={10}>
                    <TableCell component="th" scope="row">
                      #10
                    </TableCell>
                    <TableCell align="right">
                      {
                     jackpots.data[1].winner_ten
                       ? jackpots.data[1].winner_ten.username
                       : 'Undecided'
                  }
                    </TableCell>
                    <TableCell align="right">
                      {
                    jackpots.data[1].winner_ten
                      ? jackpots.data[1].winner_ten_tickets
                      : 'Undecided'
                  }
                    </TableCell>
                    <TableCell align="right">
                      2%
                    </TableCell>
                    <TableCell align="right">
                      {
                     jackpots.data[1].winner_ten
                       ? `${new BigNumber(
                         jackpots.data[1].jackpot_amount,
                       )
                         .dividedBy(100)
                         .times(2)
                         .dividedBy(1e8)
                         .toString()} RUNES`
                       : '0 RUNES'
                  }
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )
        }
        <Grid
          container
          item
          xs={12}
          justify="center"
        >
          <Pagination
            count={jackpots && jackpots.data.length > 0 && jackpots.data.length}
            color="primary"
            page={page}
            onChange={handleChange}
            style={{ color: 'white' }}
          />
        </Grid>
      </Grid>
    </div>
  )
}

Jackpot.propTypes = {
  jackpots: PropTypes.shape({
    data: PropTypes.arrayOf.isRequired,
  }).isRequired,
};

const mapStateToProps = (state) => ({
  jackpots: state.jackpots,
  user: state.user.data,
})

export default connect(mapStateToProps, null)(Jackpot);
