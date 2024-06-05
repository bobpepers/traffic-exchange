import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/auth';

class Click extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="index600 height100">
        <h1>Click</h1>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { errorMessage: state.auth.error };
}

export default connect(mapStateToProps, actions)(Click);
