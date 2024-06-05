import React, {
  Component,
  // Fragment,
} from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {
  Grid,
  // Button,
} from '@material-ui/core';
import * as actions from '../actions/auth';

class Ads extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }

  componentDidMount() {
    this.myRef = React.createRef();
  }

  render() {
    return (
      <div className="height100 content">
        <Grid container>
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
              title="A-ads advertisement"
              data-aa="1483982"
              src="//ad.a-ads.com/1483982?size=728x90"
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
            <iframe
              title="A-ads small 1"
              data-aa="1499149"
              src="//ad.a-ads.com/1499149?size=120x60"
              scrolling="no"
              style={{
                width: '120px',
                height: '60px',
                border: '0px',
                padding: '0',
                overflow: 'hidden',
              }}
              allowtransparency="true"
            />
          </div>
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
          </div>
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
              title="A-ads tower 1"
              data-aa="1500080"
              src="//ad.a-ads.com/1500080?size=160x600"
              scrolling="no"
              style={{
                width: '160px',
                height: '600px',
                border: '0px',
                padding: 0,
                overflow: 'hidden',
              }}
              allowtransparency="true"
            />

          </div>
        </Grid>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { errorMessage: state.auth.error };
}

export default withRouter(connect(mapStateToProps, actions)(Ads));
