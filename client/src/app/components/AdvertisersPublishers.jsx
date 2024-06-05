import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import {
  Grid,
  Link,
} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullhorn } from '@fortawesome/free-solid-svg-icons';
import CastIcon from '@material-ui/icons/Cast';
import ScrollAnimation from 'react-animate-on-scroll';

const AdvertisersPublishers = (props) => {
  const { t } = props;

  return (
    <div className="margin-runebase-container content shadow-w">
      <Grid container>

        <Grid item xs={6}>
          <Grid container justify="center">
            <ScrollAnimation
              animateIn="bounceInLeft"
              animateOut="fadeOut"
              duration={2}
              delay={1}
            >
              <FontAwesomeIcon icon={faBullhorn} style={{ fontSize: '64px' }} />
            </ScrollAnimation>
          </Grid>
          <ScrollAnimation
            animateIn="bounceInLeft"
            animateOut="lightSpeedOutLeft"
            duration={2}
            delay={1}
          >
            <h3 className="text-center">Advertisers</h3>
          </ScrollAnimation>
          <ScrollAnimation
            animateIn="zoomInLeft"
            animateOut="zoomOutLeft"
            duration={2}
            delay={1}
          >
            <p className="text-center">
              Place banners of all possible sizes within our publisher network,
              expand your customer base and increase traffic
            </p>
          </ScrollAnimation>
        </Grid>

        <Grid item xs={6}>
          <Grid container justify="center">
            <ScrollAnimation
              animateIn="bounceInRight"
              animateOut="fadeOut"
              duration={2}
              delay={1}
            >
              <CastIcon style={{ fontSize: '64px' }} />
            </ScrollAnimation>
          </Grid>
          <ScrollAnimation
            animateIn="bounceInRight"
            animateOut="lightSpeedOutRight"
            duration={2}
            delay={1}
          >
            <h3 className="text-center">Publishers</h3>
          </ScrollAnimation>
          <ScrollAnimation
            animateIn="zoomInRight"
            animateOut="zoomOutRight"
            duration={2}
            delay={1}
          >
            <p className="text-center">
              Boost your revenue by placing relevant banner ads,
              Earn RUNES for daily unique impressions
            </p>
          </ScrollAnimation>
        </Grid>
      </Grid>
    </div>
  )
}

const mapStateToProps = (state) => ({
  registered: state.registered.people,
  online: state.online.people,
})

export default connect(mapStateToProps)(AdvertisersPublishers);
