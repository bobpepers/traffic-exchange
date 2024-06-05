import React, { useState, useEffect } from 'react';
import {
  Button,
  Modal,
  Backdrop,
  Fade,
  TextField,
  Grid,
  Fab,
  Tooltip,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import {
  reduxForm,
  Field,
  formValueSelector,
  change,
  reset,
} from 'redux-form';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import QRCode from 'qrcode';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import Captcha from './Captcha';
import * as actions from '../actions';

let imagePath = '';

const renderField = ({
  input, type, placeholder, meta: { touched, error },
}) => (
  <div className={`input-group ${touched && error ? 'has-error' : ''}`}>
    <input type={type} placeholder={placeholder} {...input} />
    { touched && error && <div className="form-error">{error}</div> }
  </div>
);

const useStyles = makeStyles((theme) => ({
  modal: {
    position: 'fixed',
    top: '0',
    bottom: '0',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    overflowY: 'auto',
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    top: 0,
  },
}));

const Deposit = (props) => {
  const {
    errorMessage,
  } = props;
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [address, setAddress] = useState('');
  const [copySuccessful, setCopySuccessful] = useState(false);

  useEffect(() => {
    setAddress(props.addresses[0] ? props.addresses[0].address : '');
  }, [props.addresses[0]]) // pass `value` as a dependency

  useEffect(() => {
    if (props.addresses.length > 0) {
      QRCode.toDataURL(props.addresses[0].address, (err, imageUrl) => {
        if (err) {
          console.log('Could not generate QR code', err);
          return;
        }
        imagePath = imageUrl;
      });
    }
  }, [props.addresses]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${address}`);
    setCopySuccessful(true);
  };

  useEffect(() => {
    setTimeout(() => {
      setCopySuccessful(false);
    }, 10000);
  }, [copySuccessful]) // pass `value` as a dependency

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justify="center"
      item
      xs={12}
      className="height100"
    >
      <div>
        <Grid container>
          <Grid
            item
            xs={12}
            className="text-center"
            style={{ display: 'block' }}
          >
            <img src={imagePath} alt="Deposit QR Code" />
          </Grid>
          <Grid
            item
            xs={12}
          >
            <div>
              <p className="text-center">Runebase Address</p>
              <div className="borderAddress">
                <p className="text-center">
                  {address}
                </p>
                {
            copySuccessful
              ? (
                <p className="text-center" style={{ color: 'green' }}>
                  Copied!
                </p>
              ) : null
          }
                <Tooltip title="Copy Runebase Address" aria-label="show">
                  <Button
                      // className="borderAddress copyAddressButton"
                    variant="contained"
                    color="primary"
                    fullWidth
                      // style={{ padding: 0, float: 'right' }}
                    onClick={copyToClipboard}
                  >

                    <FileCopyIcon />
                    Copy
                  </Button>
                </Tooltip>
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    </Grid>
  );
}
const onSubmitSuccess = (result, dispatch) => {
  // console.log(result);
  // console.log(dispatch());

  // console.log('doneeeeeeeeee');
}

const validate = (formProps) => {
  const errors = {};
  if (!formProps.url) {
    errors.url = 'Email is required'
  }

  if (!formProps.captchaResponse) {
    errors.captchaResponse = 'Please validate the captcha.';
  }

  return errors;
}
const selector = formValueSelector('createWebslot');

const mapStateToProps = (state) => ({
  errorMessage: state.auth.error,
  recaptchaValue: selector(state, 'captchaResponse'),
})

export default connect(mapStateToProps, actions)(reduxForm({ form: 'createWebslot', validate, onSubmitSuccess })(Deposit));
