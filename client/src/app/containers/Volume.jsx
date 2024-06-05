import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Grid } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import ScrollAnimation from 'react-animate-on-scroll';
import PropTypes from 'prop-types';
import { getVolume } from '../actions/volume';

const VolumeContainer = (props) => {
  const { volume } = props;
  const dispatch = useDispatch();
  useEffect(() => dispatch(getVolume()), [dispatch]);
  useEffect(() => {
    console.log('volume');
    console.log(volume);
  }, [volume]);

  return (
    <Grid
      container
      item
      xs={12}
      className="shadow-w"
    >
      <Grid
        item
        xs={6}
        sm={6}
        md={3}
        className="index600 spacing-top"
      >
        <ScrollAnimation
          animateIn="slideInLeft"
          animateOut="slideOutLeft"
          duration={2}
          delay={1}
          offset={0}
        >
          <span className="dashboardWalletItem">24h Surfs</span>
          <span className="dashboardWalletItem">{volume.surf24 ? volume.surf24 : <CircularProgress disableShrink />}</span>
        </ScrollAnimation>
      </Grid>
      {/*
      <Grid item xs={4} className="index600">
        <span className="dashboardWalletItem">24h Clicks</span>
        <span className="dashboardWalletItem">{props.volume.click24 ? props.volume.click24 : 'Loading...'}</span>
      </Grid>
      */}

      <Grid
        item
        xs={6}
        sm={6}
        md={3}
        className="index600 spacing-top"
      >
        <ScrollAnimation
          animateIn="zoomIn"
          animateOut="zoomOut"
          duration={2}
          delay={1}
          offset={0}
        >
          <span className="dashboardWalletItem">24h Surf Volume</span>
          <span className="dashboardWalletItem">{volume.surfVolume24 ? `${(volume.clickVolume24 + volume.surfVolume24) / 1e8} RUNES` : <CircularProgress disableShrink />}</span>
        </ScrollAnimation>
      </Grid>
      <Grid
        item
        xs={6}
        sm={6}
        md={3}
        className="index600 spacing-top"
      >
        <ScrollAnimation
          animateIn="zoomIn"
          animateOut="zoomOut"
          duration={2}
          delay={1}
          offset={0}
        >
          <span className="dashboardWalletItem">Surfs Served</span>
          <span className="dashboardWalletItem">{volume.surf ? volume.surf : <CircularProgress disableShrink />}</span>
        </ScrollAnimation>
      </Grid>
      {/*
      <Grid item xs={4} className="index600">
        <span className="dashboardWalletItem">Clicks Served</span>
        <span className="dashboardWalletItem">{props.volume.click ? props.volume.click : 'loading...'}</span>
      </Grid>
      */}

      <Grid
        item
        xs={6}
        sm={6}
        md={3}
        className="index600 spacing-top"
      >
        <ScrollAnimation
          animateIn="slideInRight"
          animateOut="slideOutRight"
          duration={2}
          delay={1}
          offset={0}
        >
          <span className="dashboardWalletItem">Lotteries Served</span>
          <span className="dashboardWalletItem">{volume.jackpot ? volume.jackpot : <CircularProgress disableShrink />}</span>
        </ScrollAnimation>
      </Grid>
      <Grid
        item
        xs={6}
        sm={6}
        md={3}
        className="index600 spacing-top"
      >
        <ScrollAnimation
          animateIn="slideInLeft"
          animateOut="slideOutLeft"
          duration={2}
          delay={1}
          offset={0}
        >
          <span className="dashboardWalletItem">24h Unique impressions</span>
          <span className="dashboardWalletItem">{volume.impression24 ? volume.impression24 : <CircularProgress disableShrink />}</span>
        </ScrollAnimation>
      </Grid>
      <Grid
        item
        xs={6}
        sm={6}
        md={3}
        className="index600 spacing-top"
      >
        <ScrollAnimation
          animateIn="zoomIn"
          animateOut="zoomOut"
          duration={2}
          delay={1}
          offset={0}
        >
          <span className="dashboardWalletItem">24h impression volume</span>
          <span className="dashboardWalletItem">{volume.impressionVolume24 ? `${volume.impressionVolume24 / 1e8} RUNES` : <CircularProgress disableShrink />}</span>
        </ScrollAnimation>
      </Grid>
      <Grid
        item
        xs={6}
        sm={6}
        md={3}
        className="index600 spacing-top"
      >
        <ScrollAnimation
          animateIn="zoomIn"
          animateOut="zoomOut"
          duration={2}
          delay={1}
          offset={0}
        >
          <span className="dashboardWalletItem">Unique impressions Served</span>
          <span className="dashboardWalletItem">{volume.impression ? volume.impression : <CircularProgress disableShrink />}</span>
        </ScrollAnimation>
      </Grid>
      <Grid
        item
        xs={6}
        sm={6}
        md={3}
        className="index600 spacing-top"
      >
        <ScrollAnimation
          animateIn="slideInRight"
          animateOut="slideOutRight"
          duration={2}
          delay={1}
          offset={0}
        >
          <span className="dashboardWalletItem">24h Total volume</span>
          <span className="dashboardWalletItem">{volume.impressionVolume24 ? `${(volume.impressionVolume24 + volume.surfVolume24) / 1e8} RUNES` : <CircularProgress disableShrink />}</span>
        </ScrollAnimation>
      </Grid>
    </Grid>
  )
}

VolumeContainer.propTypes = {
  volume: PropTypes.shape({
    impressionVolume24: PropTypes.number.isRequired,
    impression: PropTypes.number.isRequired,
    impression24: PropTypes.number.isRequired,
    jackpot: PropTypes.number.isRequired,
    surf: PropTypes.number.isRequired,
    surfVolume24: PropTypes.number.isRequired,
    surf24: PropTypes.number.isRequired,
  }).isRequired,
};

const mapStateToProps = (state) => ({
  volume: state.volume.volume,
})

export default connect(mapStateToProps)(VolumeContainer);
