import React, { useState, useEffect } from 'react';
import {
  reduxForm,
  Field,
  formValueSelector,
  change,
} from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import { Grid } from '@material-ui/core';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import FormControl from '@material-ui/core/FormControl';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import * as qs from 'query-string';
import * as actions from '../../actions/auth';
import Captcha from '../Captcha';

const useStyles = makeStyles((theme) => ({
  modal: {
    position: 'absolute',
    top: '10%',
    left: '10%',
    overflow: 'hidden',
    height: '100%',
    maxHeight: 500,
    display: 'block',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  content: {
    padding: 12,
    overflow: 'scroll',
    height: '100%',
    maxHeight: 500,
  },
}));

const renderField = ({
  InputProps,
  disabled,
  value,
  input,
  type,
  placeholder,
  meta: {
    touched,
    error,
  },
}) => (
  <div className={`input-group ${touched && error ? 'has-error' : ''}`}>
    <FormControl
      variant="outlined"
      fullWidth
    >
      <TextField
        label={placeholder}
        type={type}
        value={value}
        disabled={!!disabled}
        variant="outlined"
        InputProps={InputProps}
        {...input}
      />
      { touched && error && <div className="form-error">{error}</div> }
    </FormControl>
  </div>
);

const Checkbox = ({ input, meta: { touched, error } }) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div style={{ border: touched && error ? '1px solid red' : 'none' }}>
      <input type="checkbox" {...input} />
      <label>
        I agree to
        {' '}
        <a
          onClick={handleOpen}
          style={{
            color: '#0000EE',
            cursor: 'pointer',
          }}
        >
          Terms and conditions
        </a>
      </label>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <div className={classes.content}>
              <h2 id="transition-modal-title">Terms of Service</h2>
              <p id="transition-modal-description">Last updated: October 16, 2020</p>
              <p id="transition-modal-description">
                Please read these Terms and Conditions ("Terms", "Terms and Conditions") carefully before using the https://www.runesx.com website (the "Service") operated by RunesX.com ("us", "we", or "our").

                Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users and others who access or use the Service.

                By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service.
              </p>
              <h2 id="transition-modal-title">Accounts</h2>
              <p id="transition-modal-description">
                When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.

                You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password, whether your password is with our Service or a third-party service.

                You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
              </p>
              <h2 id="transition-modal-title">Links To Other Web Sites</h2>
              <p id="transition-modal-description">
                Our Service may contain links to third-party web sites or services that are not owned or controlled by RunesX.com

                RunesX.com has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third party web sites or services. You further acknowledge and agree that RunesX.com shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with use of or reliance on any such content, goods or services available on or through any such web sites or services.

                We strongly advise you to read the terms and conditions and privacy policies of any third-party web sites or services that you visit.
              </p>
              <h2 id="transition-modal-title">Termination</h2>
              <p id="transition-modal-description">
                We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.

                All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity and limitations of liability.

                We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.

                Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service.

                All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity and limitations of liability.
              </p>
              <h2 id="transition-modal-title">Governing Law</h2>
              <p id="transition-modal-description">
                These Terms shall be governed and construed in accordance with the laws of Belgium, without regard to its conflict of law provisions.

                Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect. These Terms constitute the entire agreement between us regarding our Service, and supersede and replace any prior agreements we might have between us regarding the Service.
              </p>
              <h2 id="transition-modal-title">
                Changes
              </h2>
              <p id="transition-modal-description">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.

                By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the Service.
              </p>
              <h2 id="transition-modal-title">Contact Us</h2>
              <p id="transition-modal-description">If you have any questions about these Terms, please contact us.</p>
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  )
}

const Signup = (props) => {
  const {
    handleSubmit,
    signupUser,
    location: {
      search,
    },
    initialize,
  } = props;
  const parsed = qs.parse(search);
  const { referredby } = parsed;

  useEffect(() => {
    if (referredby) {
      localStorage.setItem('referredby', referredby);
      initialize({ referredby: localStorage.getItem('referredby') });
    } else {
      initialize({ referredby: ' ' });
    }
  }, []);

  const [values, setValues] = useState({
    password: '',
    rePassword: '',
    showPassword: false,
    showRePassword: false,
  });

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleClickShowRePassword = () => {
    setValues({ ...values, showRePassword: !values.showRePassword });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const renderPasswordField = (
    {
      input,
      type,
      placeholder,
      meta: {
        touched,
        error,
      },
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
          id="outlined-adornment-password"
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

  const renderRePasswordField = (
    {
      input,
      type,
      placeholder,
      meta: {
        touched,
        error,
      },
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
          id="outlined-adornment-password"
          type={values.showRePassword ? 'text' : 'password'}
          value={values.rePassword}
          onChange={handleChange('password')}
          endAdornment={(
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowRePassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                {values.showRePassword ? <Visibility /> : <VisibilityOff />}
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

  const handleFormSubmit = async (formProps) => {
    await signupUser(formProps);
  }

  return (
    <div className="form-container index600 shadow-w signinContainer content">
      <Grid container alignItems="center" justify="center">
        <Grid item xs={4}>
          <h2 className="textCenter">Sign up</h2>
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <Grid container direction="column" spacing={3}>
              <Grid item>
                <Field
                  name="username"
                  component={renderField}
                  type="text"
                  placeholder="Username"
                />
              </Grid>
              <Grid item>
                <Field
                  name="firstname"
                  component={renderField}
                  type="text"
                  placeholder="First name"
                />
              </Grid>
              <Grid item>
                <Field
                  name="lastname"
                  component={renderField}
                  type="text"
                  placeholder="Last name"
                />
              </Grid>
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
                <Field
                  name="repassword"
                  component={renderRePasswordField}
                  type="password"
                  placeholder="Repeat Password"
                />
              </Grid>
              <Grid item>
                <Field
                  name="referredby"
                  component={renderField}
                  type="text"
                  placeholder="Referred By"
                  disabled
                  InputProps={{
                    className: 'Mui-disabled',
                  }}
                />
              </Grid>
              <Grid item>
                <Field
                  name="termsAndConditions"
                  component={Checkbox}
                />
              </Grid>
              <Grid item>
                <Field
                  component={Captcha}
                  change={change}
                  name="captchaResponse"
                />
                <div>
                  { props.errorMessage && props.errorMessage.signup
                && (
                <div className="error-container">
                  { props.errorMessage.signup }
                </div>
                ) }
                </div>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  className="btn"
                  fullWidth
                  size="large"
                >
                  Sign up
                </Button>
              </Grid>
              <Grid item>
                <div className="form-bottom">
                  <p>Already signed up?</p>
                  <Link className="shadow-w" to="/signin">Click here to sign in</Link>
                </div>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </div>
  )
}

const validate = (props) => {
  const errors = {};
  const fields = ['firstname', 'lastname', 'email', 'password', 'repassword', 'username'];

  fields.forEach((f) => {
    if (!(f in props)) {
      errors[f] = `${f} is required`;
    }
  });

  if (props.username && props.username.length < 3) {
    errors.username = 'minimum of 4 characters';
  }

  if (props.firstname && props.firstname.length < 2) {
    errors.firstname = 'minimum of 3 characters';
  }

  if (props.firstname && props.firstname.length > 20) {
    errors.firstname = 'maximum of 20 characters';
  }

  if (props.lastname && props.lastname.length < 2) {
    errors.lastname = 'minimum of 3 characters';
  }

  if (props.lastname && props.lastname.length > 20) {
    errors.lastname = 'maximum of 20 characters';
  }

  if (props.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,8}$/i.test(props.email)) {
    errors.email = 'please provide valid email';
  }

  if (props.password && props.password.length < 6) {
    errors.password = 'minimum 6 characters';
  }

  if (props.password !== props.repassword) {
    errors.repassword = "passwords doesn't match";
  }

  if (!props.captchaResponse) {
    errors.captchaResponse = 'Please validate the captcha.';
  }

  if (!props.termsAndConditions) {
    errors.termsAndConditions = 'You must agree to Terms and conditions';
  }

  return errors;
};
const selector = formValueSelector('signin');

function mapStateToProps(state) {
  return {
    errorMessage: state.auth.error,
    recaptchaValue: selector(state, 'captchaResponse'),
    initialValues: {
      referredby: '',
    },
  };
}

export default connect(mapStateToProps, actions)(reduxForm({ form: 'signup', validate })(Signup));
