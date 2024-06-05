import React, { useEffect, useState } from 'react';
import { Grid } from '@material-ui/core';
import { connect, useDispatch } from 'react-redux';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { fetchSurfOrders } from '../actions/order';
// import * as actions from '../actions/user';

const surfOrdersChart = (props) => {
  const dispatch = useDispatch();
  const [allOrders, setAllOrders] = useState([]);
  useEffect(() => dispatch(fetchSurfOrders()), [dispatch]);
  useEffect(() => {
    // const tmp = props.order.data ? props.order.data.forEach((e) => e.amount -= e.filled) : []
    // const tmp = Object.keys(props.order.data).forEach((e) => e.amount -= e.filled);

    const tmp = props.order.data ? props.order.data.map((item) => ({
      amount: item.amount - item.filled,
      price: item.price / 1e8,
    })) : [];
    setAllOrders(tmp);
    // setAllOrders(tmp);
    // console.log(allOrders);
  }, [props.order.data]);

  return (
    <>
      <Grid item xs={12} className="glassHeader">
        <h3>OrderBook</h3>
      </Grid>
      <Grid container item xs={12} style={{ height: 450, marginBottom: 35 }}>

        <ResponsiveContainer>
          <ScatterChart
              // width={400}
            height={400}
            margin={{
              top: 20, right: 20, bottom: 20, left: 20,
            }}
          >
            <CartesianGrid stroke="rgba(60, 67, 146, 0.4)" />
            <YAxis type="number" dataKey="amount" name="amount" unit=" views" stroke="azure" />
            <XAxis type="number" dataKey="price" name="price/view" unit=" runes" stroke="azure" />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
            <Scatter name="A school" data={allOrders} fill="#8884d8" />
          </ScatterChart>
        </ResponsiveContainer>
      </Grid>
    </>
  )
}

function mapStateToProps(state) {
  return {
    order: state.order,
  };
}

export default connect(mapStateToProps, fetchSurfOrders)(surfOrdersChart);
