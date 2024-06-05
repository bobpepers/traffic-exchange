import React, { useEffect, useState } from 'react';
import { Grid } from '@material-ui/core';
import { connect, useDispatch } from 'react-redux';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { fetchBannerOrders } from '../actions/bannerOrder';
// import * as actions from '../actions/user';

const bannerOrderChart = (props) => {
  const { bannerOrders } = props;
  const dispatch = useDispatch();
  const [allOrders, setAllOrders] = useState([]);
  const [bannerSize, setBannerSize] = React.useState('all');
  useEffect(() => dispatch(fetchBannerOrders()), [dispatch]);
  useEffect(() => {
    // const tmp = props.order.data ? props.order.data.forEach((e) => e.amount -= e.filled) : []
    // const tmp = Object.keys(props.order.data).forEach((e) => e.amount -= e.filled);
    console.log(bannerOrders.data);
    console.log('bannerOrders.data');
    const tmp = bannerOrders.data ? bannerOrders.data.map((item) => ({
      amount: item.amount - item.filled,
      price: item.price / 1e8,
      size: item.banner.size,
    })) : [];
    setAllOrders(tmp);
    // setAllOrders(tmp);
    // console.log(allOrders);
  }, [bannerOrders.data]);

  const changeSizeChart = (event) => {
    const size = event.target.value;
    setBannerSize(size);
    let tmpChange;
    let filteredChange;
    if (bannerOrders.data) {
      if (size === 'all') {
        tmpChange = bannerOrders.data ? bannerOrders.data.map((item) => ({
          amount: item.amount - item.filled,
          price: item.price / 1e8,
          size: item.banner.size,
        })) : [];
        setAllOrders(tmpChange);
      } else {
        tmpChange = bannerOrders.data ? bannerOrders.data.map((item) => ({
          amount: item.amount - item.filled,
          price: item.price / 1e8,
          size: item.banner.size,
        })) : [];
        filteredChange = tmpChange.filter((el) => el.size === size);
        setAllOrders(filteredChange);
      }
    }
  }

  if (bannerOrders.isFetching) {
    return (
      <>
        <Grid item xs={12} className="glassHeader">
          <CircularProgress disableShrink />
        </Grid>
      </>
    );
  }

  if (!bannerOrders.isFetching && bannerOrders.data) {
    console.log(allOrders);
    console.log('all orders');
    return (
      <>
        <Grid item xs={12} className="glassHeader">
          <h3>OrderBook</h3>
        </Grid>
        <Grid item xs={12} className="form-container signinContainer content" style={{ paddingTop: '20px', paddingBottom: '20px' }}>
          <FormControl variant="outlined" style={{ width: '100%' }}>
            <InputLabel id="banner-orders-select-outlined-label">Size</InputLabel>
            <Select
              labelId="banner-orders-select-outlined-label"
              id="banner-orders-simple-select-outlined"
              value={bannerSize}
              onChange={changeSizeChart}
              label="Size"
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="120x60">120 x 60</MenuItem>
              <MenuItem value="120x600">120 x 600</MenuItem>
              <MenuItem value="125x125">125 x 125</MenuItem>
              <MenuItem value="160x600">160 x 600</MenuItem>
              <MenuItem value="250x250">250 x 250</MenuItem>
              <MenuItem value="300x250">300 x 250</MenuItem>
              <MenuItem value="300x600">300 x 600</MenuItem>
              <MenuItem value="320x50">320 x 50</MenuItem>
              <MenuItem value="728x90">728 x 90</MenuItem>
              <MenuItem value="970x90">970 x 90</MenuItem>
              <MenuItem value="970x250">970 x 250</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid container item xs={12} style={{ height: 450, marginBottom: 35 }}>
          <ResponsiveContainer>
            <ScatterChart
                // width={400}
              data={allOrders}
              height={400}
              margin={{
                top: 20, right: 20, bottom: 20, left: 20,
              }}
            >
              <CartesianGrid stroke="rgba(60, 67, 146, 0.4)" />
              <YAxis type="number" dataKey="amount" name="amount" unit=" unique impressions" stroke="azure" />
              <XAxis type="number" dataKey="price" name="price/impression" unit=" runes" stroke="azure" />
              <ZAxis type="text" dataKey="size" name="size" unit="px" stroke="azure" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter name="Banner Orders" data={allOrders} fill="#8884d8" />
            </ScatterChart>
          </ResponsiveContainer>
        </Grid>
      </>
    )
  }
  return (
    <>
      <Grid item xs={12} className="glassHeader">
        <p>init</p>
      </Grid>
    </>
  )
}

function mapStateToProps(state) {
  return {
    bannerOrders: state.bannerOrders,
  };
}

export default connect(mapStateToProps, null)(bannerOrderChart);
