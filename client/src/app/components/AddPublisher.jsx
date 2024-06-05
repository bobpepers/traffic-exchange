import React, {
  useState,
  useEffect,
} from 'react';
import {
  Button,
  Modal,
  Backdrop,
  Fade,
  TextField,
  Grid,
  Fab,
  Tooltip,
  FormControl,
} from '@material-ui/core';
import Iframe from 'react-iframe';
import AddIcon from '@material-ui/icons/Add';
import {
  reduxForm,
  Field,
  formValueSelector,
  change,
  reset,
} from 'redux-form';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Captcha from './Captcha';
import * as actions from '../actions';

const renderField = ({
  input, type, placeholder, meta: { touched, error },
}) => (
  <div className={`input-group ${touched && error ? 'has-error' : ''}`}>
    <FormControl
      variant="outlined"
      fullWidth
    >
      <TextField
        id="outlined-username-field"
        label={placeholder}
        type={type}
        variant="outlined"
        inputProps={{
          className: 'outlined-adornment-field',
        }}
        {...input}
      />
      { touched && error && <div className="form-error">{error}</div> }
    </FormControl>
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

const AddPublisher = (props) => {
  const {
    errorMessage,
    addPublisherAction,
    addPublisher,
    handleSubmit,
    pristine,
    submitting,
    createWebslot,
    idleWebslot,
  } = props;

  const myHandleSubmit = (e) => {
    addPublisherAction(e);
  }

  return (
    <div className="signinContainer">
      <h2 className="text-center">Add Publisher</h2>
      <form onSubmit={handleSubmit(myHandleSubmit)}>
        <Grid container direction="column" spacing={3}>
          <Grid item>
            <Field
              name="url"
              component={renderField}
              type="url"
              placeholder="Url"
            />
            {addPublisher && addPublisher.error && addPublisher.error}
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              disabled={pristine || submitting}
              type="submit"
              fullWidth
              size="large"
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>

  );
}

function onSubmitSuccess(result, dispatch) {
  // console.log(result);
  // console.log(dispatch());

  // console.log('doneeeeeeeeee');
}

function validate(formProps) {
  const errors = {};
  if (!formProps.url) {
    errors.url = 'Url is required'
  }

  if (!formProps.captchaResponse) {
    errors.captchaResponse = 'Please validate the captcha.';
  }

  return errors;
}
const selector = formValueSelector('addPublisher');

function mapStateToProps(state) {
  return {
    errorMessage: state.auth.error,
    recaptchaValue: selector(state, 'captchaResponse'),
    createWebslot: state.createWebslot,
    urlValue: selector(state, 'url'),
  }
}

export default connect(mapStateToProps, actions)(reduxForm({ form: 'addPublisher', validate, onSubmitSuccess })(AddPublisher));
