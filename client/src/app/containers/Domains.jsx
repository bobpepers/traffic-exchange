import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Button } from '@material-ui/core';
import * as actions from '../actions/domain';

class WebsiteContainer extends Component {
  componentWillMount() {
    this.props.fetchWebsites();
  }

  renderWebsites() {
    const websites = this.props.websites || [];

    return websites.map((website, i) => {
      console.log('1');
      return (
        <Grid item xs={4} className="index600">
          <span className="dashboardWalletItem">{website.url}</span>
          <span className="dashboardWalletItem">{website.views}</span>
          <span className="dashboardWalletItem">{website.reputation}</span>
        </Grid>
      );
    })
  }

  render() {
    return (
      <Grid container item xs={12} className="shadow-w">
        <Grid item xs={12} className="glassHeader">
          <h3>Most Viewed Domains</h3>
        </Grid>
        { this.renderWebsites() }
      </Grid>
    )
  }
}

function mapStateToProps(state) {
  return { websites: state.website.items };
}

export default connect(mapStateToProps, actions)(WebsiteContainer);
