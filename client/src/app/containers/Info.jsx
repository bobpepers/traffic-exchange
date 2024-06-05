import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Grid } from '@material-ui/core';
import { IoIosPeople, IoMdGitNetwork } from 'react-icons/io';
import ScrollAnimation from 'react-animate-on-scroll';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import { getRequestRegister } from '../actions/registered';
import Logo from '../assets/images/logo';

const InfoContainer = (props) => {
  const {
    registered,
    online,
  } = props;
  const dispatch = useDispatch();
  const [rerender, setRerender] = useState(1);
  useEffect(() => {
    setRerender(rerender + 1);
    const s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = 'https://www.runesx.com/uploads/runesx.js';
    document.body.appendChild(s);

    return () => {
      document.body.removeChild(s);
    };
  }, []);

  useEffect(() => dispatch(getRequestRegister()), [dispatch]);

  return (
    <Grid
      container
      item
      xs={12}
      className="shadow-w spacing-top"
      alignItems="center"
      justify="center"
    >
      <Grid
        item
        xs={4}
        className="index600"
      >
        <ScrollAnimation
          animateIn="slideInLeft"
          animateOut="slideOutLeft"
          duration={2}
          delay={0}
          offset={0}
        >
          <IoIosPeople style={{ width: '100%', fontSize: '60px' }} />
          <span className="dashboardWalletItem">Registered</span>
          <span className="dashboardWalletItem">{registered || <CircularProgress disableShrink />}</span>
        </ScrollAnimation>
      </Grid>
      <Grid
        item
        xs={4}
        className="index600"
        align="center"
      >
        <ScrollAnimation
          animateIn="zoomInDown"
          animateOut="zoomOutUp"
          duration={2}
          delay={0}
          offset={0}
        >
          <Logo />
        </ScrollAnimation>
      </Grid>
      <Grid
        item
        xs={4}
        className="index600"
      >
        <ScrollAnimation
          animateIn="slideInRight"
          animateOut="slideOutRight"
          duration={2}
          delay={0}
          offset={0}
        >
          <IoMdGitNetwork style={{ width: '100%', fontSize: '60px' }} />
          <span className="dashboardWalletItem">Online</span>
          <span className="dashboardWalletItem">
            {online || <CircularProgress disableShrink />}
          </span>
        </ScrollAnimation>
      </Grid>
      <Grid
        item
        xs={12}
        className="index600"
        align="center"
      >
        <div className="shadow-w nopointer row justify-content-center">
          <div className="position-relative align-self-center osdlwrapper">
            <ScrollAnimation
              animateIn="bounceIn"
              animateOut="bounceOut"
              duration={2}
              delay={0}
              offset={0}
            >
              <h2 className="position-relative">RunesX Beta</h2>
            </ScrollAnimation>
            <ScrollAnimation
              animateIn="bounceIn"
              animateOut="bounceOut"
              duration={2}
              delay={0}
              offset={0}
            >
              <h3 className="position-relative">Boost your websites traffic</h3>
            </ScrollAnimation>
            <ScrollAnimation
              animateIn="bounceIn"
              animateOut="bounceOut"
              duration={2}
              delay={0}
              offset={0}
            >
              <p className="position-relative">Manual Traffic Exchange</p>
            </ScrollAnimation>
            <ScrollAnimation
              animateIn="bounceIn"
              animateOut="bounceOut"
              duration={2}
              delay={0}
              offset={0}
            >
              <p className="position-relative">Traditional Banner Advertising</p>
            </ScrollAnimation>
          </div>
        </div>
      </Grid>
      <Grid
        container
        item
        xs={12}
        justify="center"
      >
        <div
          id="runesx-1"
          key={rerender}
        />
      </Grid>
    </Grid>
  )
}

InfoContainer.propTypes = {
  registered: PropTypes.number.isRequired,
  online: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  registered: state.registered.people,
  online: state.online.people,
})

export default connect(mapStateToProps)(InfoContainer);
