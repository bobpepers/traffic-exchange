import React from 'react';
import { connect } from 'react-redux';
import {
  Grid,
  Link,
} from '@material-ui/core';
import LanguageIcon from '@material-ui/icons/Language';
import SearchIcon from '@material-ui/icons/Search';
import ScrollAnimation from 'react-animate-on-scroll';
import { withTranslation } from 'react-i18next';
import runebaseloop from '../assets/images/runebaseloop.gif';
// import theme from '../theme';

const Runebase = (props) => {
  const { t } = props;

  return (
    <div className="w-100">
      <ScrollAnimation
        animateIn="zoomIn"
        animateOut="zoomOut"
        duration={1}
        delay={0}
        offset={300}
      >
        <Grid
          container
          item
          xs={12}
          alignItems="center"
          justify="center"
          className="shadow-w frame"
        >
          <Grid
            item
            xs={12}
            sm={3}
            className="index600"
          >
            <ScrollAnimation
              animateIn="zoomIn"
              animateOut="zoomOut"
              duration={2}
              delay={3}
            >
              <Link href="https://www.runebase.io">
                <img src={runebaseloop} alt="Runebase Logo" />
                <h2 className="textBorder w-100 textCenter margin-zero">Runebase</h2>
              </Link>
            </ScrollAnimation>
          </Grid>
          <Grid
            container
            item
            xs={12}
            sm={9}
            className="index600"
            align="center"
            direction="row"
            justify="center"
            alignItems="stretch"
          >
            <ScrollAnimation
              animateIn="zoomIn"
              animateOut="zoomOut"
              duration={2}
              delay={3}
            >
              <Grid item xs={12} className="spacing-top">
                <Link
                  href="https://www.runebase.io"
                  color="inherit"
                  style={{ textDecoration: 'none' }}
                >
                  <h3
                    className="margin-zero"
                  >
                    <LanguageIcon />
                    {' '}
                    Download RUNES Wallet
                  </h3>
                </Link>
              </Grid>
              <Grid item xs={12} className="spacing-top">
                <Link
                  href="https://explorer.runebase.io"
                  color="inherit"
                  style={{ textDecoration: 'none' }}
                >
                  <h3
                    className="margin-zero"
                  >
                    <SearchIcon />
                    {' '}
                    Runebase Explorer
                  </h3>
                </Link>
              </Grid>
              <Grid item xs={12} className="spacing-top">
                <Link
                  href="https://faucet.runebase.io"
                  color="inherit"
                  style={{ textDecoration: 'none' }}
                >
                  <h3
                    className="margin-zero"
                  >
                    <SearchIcon />
                    {' '}
                    Runebase Faucet
                  </h3>
                </Link>
              </Grid>
            </ScrollAnimation>
          </Grid>
        </Grid>
      </ScrollAnimation>
    </div>
  )
}

const mapStateToProps = (state) => ({
  registered: state.registered.people,
  online: state.online.people,
})

export default withTranslation()(connect(mapStateToProps)(Runebase));
