import React, {
  useEffect,
  useState,
  // Fragment,
} from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  Grid,
  // Button,
} from '@material-ui/core';
import * as actions from '../actions/auth';
// import Contact from '../components/Contact';
// import Community from '../components/Community';
// import Exchanges from '../components/Exchanges';
// import Download from '../components/Download';
// import Banner from '../components/Banner';
// import Domains from '../containers/Domains';
import Activity from '../containers/Activity';
import Info from '../containers/Info';
import Volume from '../containers/Volume';
import Runebase from '../containers/Runebase';
import Exchanges from '../components/Exchanges';
import AdvertisersPublishers from '../components/AdvertisersPublishers';
// import Globe from '../containers/Globe';

const Home = () => {
  console.log('RunesX Home View');

  return (
    <div className="height100 content">
      <Grid container>
        <Info />
        <Volume />
        <Activity />
        {/* <Globe /> */}
        {/* <Domains /> */}
        {/* <Banner /> */}
        <AdvertisersPublishers />
        <Runebase />
        <div
          style={{
            width: '100%',
            textAlign: 'center',
            paddingBottom: '40px',
            zIndex: 50,
          }}
          className="spacing-top"
        >
          <iframe
            title="a-ads leaderboard 2"
            data-aa="1500077"
            src="//ad.a-ads.com/1500077?size=728x90"
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
          <Exchanges />
        </div>
      </Grid>
    </div>
  )
}

const mapStateToProps = (state) => ({ errorMessage: state.auth.error })

export default withRouter(connect(mapStateToProps, actions)(Home));
