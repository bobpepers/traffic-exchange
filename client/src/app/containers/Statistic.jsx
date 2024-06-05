import React, { useEffect, useState } from 'react';
import { Grid, Paper } from '@material-ui/core';
import { connect, useDispatch } from 'react-redux';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { BigNumber } from 'bignumber.js';
import { fetchUserRecentActivity } from '../actions/activity';

const CustomTooltip = ({ active, payload, label }) => {
  console.log(payload);
  console.log(active);
  console.log('payload');
  if (active && payload.length > 0) {
    return (
      <Paper elevation={3} style={{ padding: '10px' }}>
        <p className="label">{`${label}`}</p>
        <p className="label">{`Type : ${payload[0].payload.type}`}</p>
        <p className="label">{`Balance : ${payload[0].payload.balance}`}</p>
        <p className="label">{`Amount : ${payload[0].payload.amount}`}</p>
      </Paper>
    );
  }

  return null;
};

const Statistic = (props) => {
  const {
    recenUserActivity,
    user,
  } = props;
  const dispatch = useDispatch();
  const [recentStatisticMap, setRecentStatisticMap] = useState([]);
  useEffect(() => {
    dispatch(fetchUserRecentActivity());
  }, [dispatch]);
  useEffect(() => {
    const tempUserActivity = recenUserActivity.data.filter((userActivity) => {
      console.log('filter statistic');
      console.log(userActivity);
      if (!userActivity) {
        return false;
      }
      if (userActivity.type === 'withdrawRequested') {
        return false; // skip
      }
      if (userActivity.type === 'login') {
        return false; // skip
      }
      if (userActivity.type === 'register') {
        return false; // skip
      }
      if (userActivity.type === 'registerVerified') {
        return false; // skip
      }
      if (userActivity.type === 'resetpass') {
        return false; // skip
      }
      if (userActivity.type === 'resetpassComplete') {
        return false; // skip
      }
      if (userActivity.type === 'depositAccepted') {
        return false; // skip
      }
      if (userActivity.type === 'withdrawRejected') {
        return false; // skip
      }
      if (userActivity.type === 'withdrawAccepted') {
        return false; // skip
      }
      if (userActivity.type === 'logout') {
        return false; // skip
      }
      if (userActivity.type === 'surfStart') {
        return false; // skip
      }
      if (userActivity.type === 'newDomain') {
        return false; // skip
      }
      if (userActivity.type === 'createSurfOrder') {
        return false; // skip
      }
      if (userActivity.type === 'cancelSurfOrder') {
        return false; // skip
      }
      if (userActivity.type === 'createBannerOrder') {
        return false; // skip
      }
      if (userActivity.type === 'cancelBannerOrder') {
        return false; // skip
      }
      return true;
    }).reverse().map((userActivity) => {
      console.log(userActivity);
      if (userActivity.spender) {
        if (user.data.username === userActivity.spender.username) {
          return {
            type: userActivity.type,
            name: userActivity.createdAt,
            balance: new BigNumber(userActivity.spender_balance).dividedBy(1e8).toString(),
            amount: -Math.abs(new BigNumber(userActivity.amount).dividedBy(1e8).toString()),
          };
        }
      }
      if (userActivity.earner) {
        if (user.data.username === userActivity.earner.username) {
          return {
            type: userActivity.type,
            name: userActivity.createdAt,
            balance: new BigNumber(userActivity.earner_balance).dividedBy(1e8).toNumber(),
            amount: new BigNumber(userActivity.amount).dividedBy(1e8).toNumber(),
          };
        }
      }
      return false;
    });
    setRecentStatisticMap(tempUserActivity);
    console.log('recentStatisticMap');
    console.log(recentStatisticMap);
  }, [recenUserActivity]);

  return (
    <Grid container item xs={12}>
      <Grid
        item
        container
        xs={12}
        sm={4}
        md={4}
        className="glass"
        justify="center"
      >
        <span className="dashboardWalletItem">Earned</span>
        <span className="dashboardWalletItem">
          {props.wallet.earned / 1e8}
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
        <span className="dashboardWalletItem">Spend</span>
        <span className="dashboardWalletItem">
          {props.wallet.spend / 1e8}
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
        <span className="dashboardWalletItem">Difference</span>
        <span className="dashboardWalletItem">
          {(props.wallet.earned - props.wallet.spend) / 1e8}
          {' '}
          RUNES
        </span>
      </Grid>
      <Grid item xs={12}>
        <h2>Recent</h2>
      </Grid>
      <Grid item xs={12} style={{ height: '300px' }}>
        <ResponsiveContainer>
          <LineChart
            data={recentStatisticMap}
          >
            <XAxis dataKey="name" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line type="monotone" dataKey="balance" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="amount" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </Grid>
    </Grid>
  )
}
function mapStateToProps(state) {
  return {
    user: state.user,
    recenUserActivity: state.recentUserActivity,
  };
}

export default connect(mapStateToProps, null)(Statistic);
