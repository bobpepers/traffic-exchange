import React, { Component } from 'react';
import { Grid } from '@material-ui/core';
import { withTranslation } from 'react-i18next';
import ScrollAnimation from 'react-animate-on-scroll';
import Altmarkets from '../assets/images/Altmarkets.png';
import Txbit from '../assets/images/Txbit.png';
import Bololex from '../assets/images/bololex.png';

import theme from '../theme';

class Exchanges extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hover: false,
      hoverCat: '',
    };
    this.updateHoverState = this.updateHoverState.bind(this);
  }

  updateHoverState(hover, hoverCat) {
    this.setState({
      hover,
      hoverCat,
    })
  }

  render() {
    const { t } = this.props;
    let AltmarketsStyle;
    let TxbitStyle;
    let BololexStyle;
    if (this.state.hover) {
      if (this.state.hoverCat == 'Altmarkets') {
        AltmarketsStyle = theme.hover.in;
      }
      if (this.state.hoverCat == 'Txbit') {
        TxbitStyle = theme.hover.in;
      }
      if (this.state.hoverCat == 'BololexStyle') {
        BololexStyle = theme.hover.in;
      }
    } else {
      AltmarketsStyle = theme.hover.out;
      TxbitStyle = theme.hover.out;
      BololexStyle = theme.hover.out;
    }
    return (
      <ScrollAnimation
        animateIn="zoomIn"
        animateOut="zoomOut"
        duration={1}
        delay={0}
        offset={300}
      >
        <Grid container className="backgroundExchanges spacing-top" direction="row" justify="center" alignItems="stretch">
          <Grid item xs={12} className="shadow-w index600 glassHeaderActivity">
            <h3 className="textBorder w-100 textCenter">{t('tradeExchanges')}</h3>
          </Grid>
          <Grid item xl={6} lg={6} md={6} sm={12} xs={12} className="spacing-top">
            <div className="w-100 d-flex">
              <a style={AltmarketsStyle} onMouseLeave={() => this.updateHoverState(false, 'Altmarkets')} onMouseEnter={() => this.updateHoverState(true, 'Altmarkets')} className="mx-auto" href="https://altmarkets.io/trading/runesdoge">
                <img className="mx-auto" src={Altmarkets} height="128px" width="128px" alt="" />
              </a>
            </div>
            <div className="w-100 d-flex">
              <a style={AltmarketsStyle} onMouseLeave={() => this.updateHoverState(false, 'Altmarkets')} onMouseEnter={() => this.updateHoverState(true, 'Altmarkets')} className="mx-auto titleStyled textBorder" href="https://altmarkets.io/trading/runesdoge">
                Altmarkets
              </a>
            </div>
            <div className="w-100 d-flex">
              <a style={AltmarketsStyle} onMouseLeave={() => this.updateHoverState(false, 'Altmarkets')} onMouseEnter={() => this.updateHoverState(true, 'Altmarkets')} className="mx-auto textStyled textBorder" href="https://altmarkets.io/trading/runesdoge">
                {t('altmarketDescription')}
              </a>
            </div>
          </Grid>
          <Grid item xl={6} lg={6} md={6} sm={12} xs={12} className="spacing-top">
            <div className="w-100 d-flex">
              <a style={TxbitStyle} onMouseLeave={() => this.updateHoverState(false, 'Txbit')} onMouseEnter={() => this.updateHoverState(true, 'Txbit')} className="mx-auto" href="https://txbit.io/Trade/RUNES/BTC">
                <img className="mx-auto" src={Txbit} height="128px" width="128px" alt="" />
              </a>
            </div>
            <div className="w-100 d-flex">
              <a style={TxbitStyle} onMouseLeave={() => this.updateHoverState(false, 'Txbit')} onMouseEnter={() => this.updateHoverState(true, 'Txbit')} className="mx-auto titleStyled textBorder" href="https://txbit.io/Trade/RUNES/BTC">
                Txbit
              </a>
            </div>
            <div className="w-100 d-flex">
              <a style={TxbitStyle} onMouseLeave={() => this.updateHoverState(false, 'Txbit')} onMouseEnter={() => this.updateHoverState(true, 'Txbit')} className="mx-auto textStyled textBorder" href="https://txbit.io/Trade/RUNES/BTC">
                {t('txbitDescription')}
              </a>
            </div>
          </Grid>
          <Grid item xl={6} lg={6} md={6} sm={12} xs={12} className="spacing-top">
            <div className="w-100 d-flex">
              <a style={BololexStyle} onMouseLeave={() => this.updateHoverState(false, 'BololexStyle')} onMouseEnter={() => this.updateHoverState(true, 'BololexStyle')} className="mx-auto" href="https://bololex.com/trading/?symbol=RUNES-BTC">
                <img className="mx-auto" src={Bololex} height="128px" width="128px" alt="" />
              </a>
            </div>
            <div className="w-100 d-flex">
              <a style={BololexStyle} onMouseLeave={() => this.updateHoverState(false, 'BololexStyle')} onMouseEnter={() => this.updateHoverState(true, 'BololexStyle')} className="mx-auto titleStyled textBorder" href="https://bololex.com/trading/?symbol=RUNES-BTC">
                Bololex
              </a>
            </div>
            <div className="w-100 d-flex">
              <a style={BololexStyle} onMouseLeave={() => this.updateHoverState(false, 'BololexStyle')} onMouseEnter={() => this.updateHoverState(true, 'BololexStyle')} className="mx-auto textStyled textBorder" href="https://bololex.com/trading/?symbol=RUNES-BTC">
                Trade RUNES on Bololex
              </a>
            </div>
          </Grid>

        </Grid>
      </ScrollAnimation>
    );
  }
}

export default withTranslation()(Exchanges);
