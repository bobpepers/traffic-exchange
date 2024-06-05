import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as qs from 'query-string';
import Button from '@material-ui/core/Button';
import history from '../../history';
import * as actions from '../../actions/auth';

class SignupVerify extends Component {
  constructor(props) {
    super(props);

    this.state = { resend: false };
  }

  componentWillMount() {
    const parsed = qs.parse(this.props.location.search);
    this.email = parsed.email;

    if (!this.email) {
      history.push('/signup');
    }
  }

  resendEmail(props) {
    this.setState({ resend: true });
    this.props.resendVerification(props);
  }

  render() {
    return (
      <div className="content index600 shadow-w textCenter content">
        <h2 className="textCenter">Activate account</h2>
        <h3 className="textCenter">
          Please confirm the verification code we've just emailed you at
          <br />
          <u>{ this.email && this.email }</u>
        </h3>
        {
          !this.state.resend
            ? <Button variant="contained" color="primary" type="submit" className="btn" size="large" className="resend" onClick={this.resendEmail.bind(this, { email: this.email })}>Resend email verification code</Button>
            : <p className="resended textCenter">Email verification code has been resent</p>
        }
        {
          this.props.errorMessage && this.props.errorMessage.signupResend
            && <div className="error-container">{ this.props.errorMessage.signupResend }</div>
        }
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { errorMessage: state.auth.error, signup: state.auth.signup };
}

export default connect(mapStateToProps, actions)(SignupVerify);
