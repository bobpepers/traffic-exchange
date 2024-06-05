import React, { useState } from 'react';
import {
  reduxForm,
  Field,
  formValueSelector,
  change,
} from 'redux-form';
import { Grid } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import FormControl from '@material-ui/core/FormControl';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Captcha from '../Captcha';
import * as actions from '../../actions/auth';

const renderField = ({
  input, type, placeholder, meta: { touched, error },
}) => (
  <div className={`input-group ${touched && error ? 'has-error' : ''}`}>
    <FormControl
      variant="outlined"
      fullWidth
    >
      <TextField
        // className="outlined-email-field"
        label="E-mail"
        type={type}
        variant="outlined"
        inputProps={{ className: 'outlined-email-field' }}
        {...input}
      />
      { touched && error && <div className="form-error">{error}</div> }
    </FormControl>
  </div>
);

const Signin = (props) => {
  const {
    handleSubmit,
    signinUser,
  } = props;
  const [values, setValues] = useState({
    password: '',
    showPassword: false,
  });

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const renderPasswordField = (
    {
      input, type, placeholder, meta: { touched, error },
    },
  ) => (
    <div className={`input-group ${touched && error ? 'has-error' : ''}`}>
      <FormControl
      // className={clsx(classes.margin, classes.textField)}
        variant="outlined"
        fullWidth
      >
        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
        <OutlinedInput
          // id="outlined-adornment-password"
          inputProps={{ className: 'outlined-adornment-password' }}
          type={values.showPassword ? 'text' : 'password'}
          value={values.password}
          onChange={handleChange('password')}
          endAdornment={(
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {values.showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
              )}
          labelWidth={70}
          {...input}
        />
      </FormControl>
      { touched && error && <div className="form-error">{error}</div> }
    </div>

  );

  const handleFormSubmit = async (props) => {
    await signinUser(props);
  }

  return (
    <div className="form-container index600 shadow-w signinContainer content">
      <Grid container alignItems="center" justify="center">
        <Grid item xs={4}>
          <h2 className="textCenter">Sign in</h2>
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <Grid container direction="column" spacing={3}>
              <Grid item>
                <Field
                  name="email"
                  component={renderField}
                  type="text"
                  placeholder="Email"
                />
              </Grid>
              <Grid item>
                <Field
                  name="password"
                  component={renderPasswordField}
                  type="password"
                  placeholder="Password"
                />
              </Grid>
              <Grid item>
                <div className="password-forgot">
                  <Link className="shadow-w" to="/reset-password">I forgot my password</Link>
                </div>
                { props.errorMessage && props.errorMessage.signin && (
                  <div className="error-container signin-error">
                    { props.errorMessage.signin }
                  </div>
                )}
              </Grid>
              <Grid item>
                <Field component={Captcha} change={change} name="captchaResponse" />
              </Grid>
              <Grid item>
                <Button variant="contained" color="primary" type="submit" className="btn" fullWidth size="large">
                  Sign in
                </Button>
              </Grid>
              <Grid item>
                <div className="form-bottom">
                  <p>Don't have an account?</p>
                  <Link className="shadow-w" to="/signup">Click here to sign up</Link>
                </div>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </div>
  )
}

const validate = (formProps) => {
  const errors = {};
  if (!formProps.email) {
    errors.email = 'Email is required'
  }

  if (!formProps.password) {
    errors.password = 'Password is required'
  }

  if (!formProps.captchaResponse) {
    errors.captchaResponse = 'Please validate the captcha.';
  }

  return errors;
}
const selector = formValueSelector('signin');
const mapStateToProps = (state) => ({
  errorMessage: state.auth.error,
  recaptchaValue: selector(state, 'captchaResponse'),
})

export default connect(mapStateToProps, actions)(reduxForm({ form: 'signin', validate })(Signin));
