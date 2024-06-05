import React, { Component } from 'react';
import { Grid } from '@material-ui/core';
import { withTranslation } from 'react-i18next';
import { GiMoneyStack } from 'react-icons/gi';
import LiveTvIcon from '@material-ui/icons/LiveTv';
// import MouseIcon from '@material-ui/icons/Mouse';
import theme from '../theme'

class Banner extends Component {
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
    	let FourStakeStyle; let
      StakingWorldStyle;
    if (this.state.hover) {
      if (this.state.hoverCat == 'FourStake') {
		  		FourStakeStyle = theme.hover.in;
		  	}
		  	if (this.state.hoverCat == 'StakingWorld') {
		  		StakingWorldStyle = theme.hover.in;
		  	}
    } else {
		  FourStakeStyle = theme.hover.out;
		  StakingWorldStyle = theme.hover.out;
    }
    return (
      <Grid container id="banner" className="index600 text-center spacing-top" direction="row" justify="center" alignItems="stretch">

        <Grid item xs={12} sm={12} md={6}>
          <LiveTvIcon style={{ fontSize: '128px' }} />
          <div className="single_slider pt-3 w-100 my-auto">
            <a className="button1 showpointer" href="/surf">
              Earn By Surfing
            </a>
          </div>
        </Grid>
        {/*
          <Grid item xs={4}>
            <MouseIcon style={{ fontSize: '60px' }} />
            <div className="single_slider pt-3 w-100 my-auto">
              <a className="button1 showpointer" href="/click">
                Earn By Clicking
              </a>
            </div>
          </Grid>
          */}

        <Grid item xs={12} sm={12} md={6}>
          <GiMoneyStack style={{ fontSize: '128px' }} />
          <div className="single_slider pt-3 w-100 my-auto">
            <a className="button1 showpointer" href="/dashboard">
              Spend RUNES
            </a>
          </div>
        </Grid>

      </Grid>
    );
  }
}

export default withTranslation()(Banner);
