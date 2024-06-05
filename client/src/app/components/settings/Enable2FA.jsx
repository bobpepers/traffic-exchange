import React, { useState, useEffect } from 'react';
import {
  Button,
  Modal,
  Backdrop,
  Fade,
  Grid,
  Paper,
} from '@material-ui/core';
import {
  reduxForm,
  Field,
  formValueSelector,
  reset,
} from 'redux-form';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import CircularProgress from '@material-ui/core/CircularProgress';
import CloseIcon from '@material-ui/icons/Close';

import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { enabletfa, idleEnabletfa } from '../../actions';

const options = {
  issuer: 'Pony Foo',
  // name: `Pony Foo (${ user.email })`,
  length: 64,
}
const { base32, otpauth_url } = speakeasy.generateSecret(options);

let imagePath = '';

QRCode.toDataURL(otpauth_url, (err, imageUrl) => {
  if (err) {
    console.log('Could not generate QR code', err);
    return;
  }
  imagePath = imageUrl;
});

const useStyles = makeStyles((theme) => ({
  modal: {
    position: 'fixed !important',
    height: 'calc(100vh - 80px) !important',
    top: '60px !important',
    bottom: '30px !important',
    overflowY: 'auto',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const renderNumberField = (
  {
    input,
    label,
    meta: { touched, error },
    ...custom
  },
) => (
  <FormControl variant="outlined" fullWidth>
    <InputLabel htmlFor="outlined-adornment-tfa">{label}</InputLabel>
    <OutlinedInput
      label={label}
      fullWidth
      id="outlined-adornment-tfa"
      inputProps={{ className: 'outlined-adornment-tfa' }}
      type="number"
      labelWidth={70}
      hintText={label}
      floatingLabelText={label}
      errorText={touched && error}
      {...input}
      {...custom}
    />
  </FormControl>
);

const Set2FA = (props) => {
  const {
    errorMessage,
    enabletfa,
    handleSubmit,
    pristine,
    submitting,
    tfa,
    idleEnabletfa,
  } = props;
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  console.log(imagePath);
  console.log(base32);
  console.log(otpauth_url);

  useEffect(() => {
    if (tfa.phase === 1) {
      setTimeout(() => { setOpen(false); }, 2000);
    }
    if (tfa.phase === 2) {
      setTimeout(() => { setOpen(false); }, 2000);
    }
  }, [tfa.phase]);

  const handleOpen = () => {
    setOpen(true);
    idleEnabletfa();
  };

  const handleClose = () => {
    idleEnabletfa();
    setOpen(false);
  };

  const myHandleSubmit = (e) => {
    e.secret = base32;
    enabletfa(e);
  }

  console.log(errorMessage);
  console.log('ImagePath');
  console.log(imagePath);
  console.log('phase');

  return (
    <Grid container>
      <Grid container item xs={12}>
        <h2 className="text-center w-100">Enable 2FA</h2>
      </Grid>
      <form
        style={{ width: '100%' }}
        onSubmit={handleSubmit(myHandleSubmit)}
      >
        <Grid container spacing={3} className="signinContainer">
          <Grid container item justify="center">
            <img src={imagePath} alt="2FA QR Code" />
          </Grid>
          <Grid item xs={12}>
            <p className="text-center">Secret:</p>
            <p className="wordbreak text-center">
              {base32}
            </p>
          </Grid>
          <Grid item xs={12}>
            <Field name="tfa" component={renderNumberField} label="2FA" />
          </Grid>

          <Grid item xs={12}>
            { errorMessage && errorMessage.tfa
                    && (
                      <div className="error-container signin-error">
                        Oops!
                          { errorMessage.tfa }
                      </div>
                    )}

            {tfa.isFetching
              ? <CircularProgress disableShrink />
              : (
                <Button
                  variant="contained"
                  color="primary"
                  disabled={pristine || submitting}
                  type="submit"
                  fullWidth
                >
                  Enable
                </Button>
              )}
          </Grid>
        </Grid>
      </form>

    </Grid>
  );
}

function onSubmitSuccess(result, dispatch) {
  dispatch(reset('order'));
}

function validate(formProps) {
  const errors = {};
  if (!formProps.tfa) {
    errors.tfa = 'Please enter 2fa code'
  }
  if (!formProps.price) {
    errors.price = 'Please enter price';
  }
  console.log(errors);
  return errors;
}

const selector = formValueSelector('enable2fa');

function mapStateToProps(state) {
  console.log('Set2FA mapStateToProps');
  console.log(state);
  // console.log(state.createOrder);
  return {
    tfa: state.tfa,
    errorMessage: state.auth.error,
  }
}
const mapDispatchToProps = {
  enabletfa, // will be wrapped into a dispatch call
  idleEnabletfa, // will be wrapped into a dispatch call
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({ form: 'enable2fa', validate, onSubmitSuccess })(Set2FA));
