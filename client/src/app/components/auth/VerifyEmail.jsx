import React, { Component } from 'react';
import { connect } from 'react-redux';
import qs from 'qs';
import * as actions from '../../actions/auth';

class VerifyEmail extends Component {
  constructor(props) {
    super(props);

    this.state = { resend: false };
  }

  componentWillMount() {
    const parsed = qs.parse(this.props.location.search.slice(1));
    const { email } = parsed;
    const { token } = parsed;
    console.log(parsed);
    console.log(email);
    console.log(token);

    this.user = {};
    this.user.email = parsed.email;
    this.user.token = parsed.token;

    this.props.verifyEmail({ email, token });
  }

  resendEmail(props) {
    this.setState({ resend: true });
    this.props.resendVerification(props);
  }

  render() {
    return (
      <div className="content index600 shadow-w">
        {
          this.props.errorMessage && this.props.errorMessage.verifyEmail
            && (
            <div>
              <h2 className="textCenter">Failed to verify account</h2>
              <h3 className="textCenter">
                { this.props.errorMessage.verifyEmail.message === 'INCORRECT_TOKEN' && 'Incorrect Token' }
                { this.props.errorMessage.verifyEmail.message === 'AUTH_TOKEN_ALREADY_USED' && 'Token Already Used' }
                { this.props.errorMessage.verifyEmail.message === 'AUTH_TOKEN_EXPIRED' && 'Token Expired' }
                { this.props.errorMessage.verifyEmail.message === 'USER_NOT_EXIST' && 'User Does\'nt Exist' }
              </h3>
            </div>
            )
        }
        {
          this.props.errorMessage
          && this.props.errorMessage.verifyEmail
          && this.props.errorMessage.verifyEmail.resend
          && !this.state.resend
          && (
            <p className="resend" onClick={this.resendEmail.bind(this, this.user)}>
              Resend verification code
            </p>
          )
        }
        {
          this.state.resend
            && (
            <p className="resended">
              Email verification code has been resended
            </p>
            )
        }
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { errorMessage: state.auth.error };
}

export default connect(mapStateToProps, actions)(VerifyEmail);
