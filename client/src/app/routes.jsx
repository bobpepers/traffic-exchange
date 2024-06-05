import React, { useEffect } from 'react';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import UserList from './components/users/UserList';
import Signin from './components/auth/Signin';
import LoginTFA from './components/auth/Login2FA';
import Signout from './components/auth/Signout';
import Signup from './components/auth/Signup';
import VerifyEmail from './components/auth/VerifyEmail';
import SignupVerify from './components/auth/SignupVerify';
import ResetPassword from './components/resetPassword/ResetPassword';
import ResetPasswordVerify from './components/resetPassword/ResetPasswordVerify';
import ResetPasswordNew from './components/resetPassword/ResetPasswordNew';

import Dashboard from './views/Dashboard';
import Surf from './views/Surf';
import Click from './views/Click';
import Home from './views/Home';
import Jackpot from './views/Jackpot';
import Admin from './views/admin/Admin';
import AdApproval from './views/AdApproval';
import withTracker from './hooks/withTracker';
import Faucet from './views/Faucet';

import requireAuth from './components/hoc/RequireAuth';
import requireNotAuth from './components/hoc/RequireNotAuth';

import toggleTheme from './helpers/toggleTheme';

const Routes = (props) => {
  const {
    theme,
  } = props;
  useEffect(() => {
    toggleTheme(theme);
  }, [theme]);

  return (
    <>
      <Route
        exact
        path="/"
        component={withTracker(Home)}
      />
      <Route
        path="/surf"
        component={requireAuth(withTracker(Surf))}
      />
      <Route
        path="/dashboard"
        component={requireAuth(withTracker(Dashboard))}
      />
      <Route
        path="/click"
        component={requireAuth(withTracker(Click))}
      />
      <Route
        path="/signin"
        component={requireNotAuth(withTracker(Signin))}
      />
      <Route
        path="/login/2fa"
        component={requireAuth(withTracker(LoginTFA))}
      />
      <Route
        exact
        path="/signup"
        component={requireNotAuth(withTracker(Signup))}
      />
      <Route
        path="/signout"
        component={Signout}
      />
      <Route
        path="/signup/verify-email"
        component={requireNotAuth(withTracker(SignupVerify))}
      />
      <Route
        path="/verify-email"
        component={requireNotAuth(withTracker(VerifyEmail))}
      />
      <Route
        exact
        path="/reset-password"
        component={requireNotAuth(withTracker(ResetPassword))}
      />
      <Route
        path="/reset-password/verify"
        component={withTracker(ResetPasswordVerify)}
      />
      <Route
        path="/reset-password/new"
        component={requireNotAuth(withTracker(ResetPasswordNew))}
      />
      <Route
        path="/users"
        component={requireAuth(withTracker(UserList))}
      />
      <Route
        path="/lottery"
        component={Jackpot}
      />
      <Route
        path="/admin"
        component={requireAuth(withTracker(Admin))}
      />
      <Route
        path="/faucet"
        component={withTracker(Faucet)}
      />
      <Route
        path="/ads"
        component={withTracker(AdApproval)}
      />
    </>
  )
}

Routes.propTypes = {
  theme: PropTypes.shape({
    theme: PropTypes.string.isRequired,
  }).isRequired,
};

const mapStateToProps = (state) => ({
  theme: state.theme,
})

export default connect(mapStateToProps, null)(Routes);
