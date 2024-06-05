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
  MenuItem,
  InputLabel,
  Select,
} from '@material-ui/core';
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
import { connect, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import Captcha from './Captcha';
import * as actions from '../actions';
import { AddAdZoneAction } from '../actions/adZone'

const renderSelectField = (
  {
    input, label, meta: { touched, error }, children, ...custom
  },
) => (
  <>
    <Select
      errortext={touched ? error : ''}
      {...input}
      onChange={(value) => input.onChange(value)}
      {...custom}
    >
      {children}
    </Select>
    { touched && error && <div className="form-error">{error}</div> }
  </>

);

const AddAdZone = (props) => {
  const {
    handleSubmit,
    pristine,
    submitting,
    addAdzoneData,
  } = props;

  const dispatch = useDispatch();

  const myHandleSubmit = (e) => {
    e.publisherId = addAdzoneData.id;
    console.log(e);
    dispatch(AddAdZoneAction(e));
  }

  return (
    <div>
      <h2 className="text-center">Add Ad Zone</h2>
      <form onSubmit={handleSubmit(myHandleSubmit)}>
        <Grid container direction="column" spacing={3}>
          <Grid item>
            <FormControl variant="outlined" style={{ width: '100%' }}>
              <InputLabel id="demo-simple-select-outlined-label">Resolution</InputLabel>
              <Field
                name="adZoneResolution"
                component={renderSelectField}
                label="Banner resolution"
              >
                <MenuItem value="120x60">120 x 60</MenuItem>
                <MenuItem value="120x600">120 x 600</MenuItem>
                <MenuItem value="125x125">125 x 125</MenuItem>
                <MenuItem value="160x600">160 x 600 (best performance)</MenuItem>
                <MenuItem value="250x250">250 x 250</MenuItem>
                <MenuItem value="300x250">300 x 250</MenuItem>
                <MenuItem value="300x600">300 x 600</MenuItem>
                <MenuItem value="320x50">320 x 50</MenuItem>
                <MenuItem value="728x90">728 x 90 (best performance)</MenuItem>
                <MenuItem value="970x90">970 x 90</MenuItem>
                <MenuItem value="970x250">970 x 250</MenuItem>
              </Field>
            </FormControl>
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
              <AddIcon />
              {' '}
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
  if (!formProps.adZoneResolution) {
    errors.adZoneResolution = 'Please select Adzone resolution'
  }

  return errors;
}
const selector = formValueSelector('addAdzone');

function mapStateToProps(state) {
  return {
    recaptchaValue: selector(state, 'captchaResponse'),
    urlValue: selector(state, 'url'),
  }
}

export default connect(mapStateToProps, actions)(reduxForm({ form: 'addAdzone', validate, onSubmitSuccess })(AddAdZone));
