import React, {
  useState,
  useEffect,
} from 'react';
import {
  Button,
  Grid,
  Tooltip,
} from '@material-ui/core';
import {
  reduxForm,
  Field,
  formValueSelector,
  reset,
  change,
} from 'redux-form';
import { makeStyles } from '@material-ui/core/styles';
import { connect, useDispatch } from 'react-redux';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import CircularProgress from '@material-ui/core/CircularProgress';
import CloseIcon from '@material-ui/icons/Close';
import { BigNumber } from 'bignumber.js';
// import * as actions from '../actions';
import { createBannerOrderAction } from '../actions/createBannerOrder';

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

const renderNumberField = (
  {
    input, label, inputProps, meta: { touched, error }, ...custom
  },
) => (
  <FormControl variant="outlined" fullWidth>
    <InputLabel htmlFor="outlined-adornment-password">{label}</InputLabel>
    <OutlinedInput
      label={label}
      fullWidth
      id="outlined-adornment-password"
      inputProps={{
        className: 'outlined-adornment-field',
      }}
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

const renderNumberFieldDisabled = (
  {
    input, label, inputProps, meta: { touched, error }, ...custom
  },
) => (
  <FormControl variant="outlined" fullWidth>
    <InputLabel htmlFor="outlined-adornment-password">{label}</InputLabel>
    <OutlinedInput
      label={label}
      fullWidth
      id="outlined-adornment-password"
      type="number"
      labelWidth={70}
      hintText={label}
      floatingLabelText={label}
      errorText={touched && error}
      inputProps={{
        style: {
          color: 'black',
        },
      }}
      {...input}
      {...custom}
    />
  </FormControl>
);

const CreateBannerOrder = (props) => {
  const {
    errorMessage,
    createOrder,
    handleSubmit,
    pristine,
    submitting,
    createBannerOrder,
    webslotId,
    idleOrder,
    price,
    amount,
    banner,
    setadvertisersPath,
  } = props;
  const dispatch = useDispatch();
  const classes = useStyles();

  const myHandleSubmit = (e) => {
    e.id = banner.id;
    dispatch(createBannerOrderAction(e));
    setadvertisersPath('bannerList');
  }

  const calculateTotal = (e) => {
    let total = 0;
    const bigNumberAmount = amount ? new BigNumber(amount) : new BigNumber(0);
    const bigNumberPrice = price ? new BigNumber(price) : new BigNumber(0);
    if (e.target.name === 'price') {
      total = bigNumberAmount.times(new BigNumber(e.target.valueAsNumber).times(1e8));
    }
    if (e.target.name === 'amount') {
      total = bigNumberPrice.times(new BigNumber(e.target.valueAsNumber).times(1e8));
    }
    dispatch(change('createBannerOrder', 'total', total.dividedBy(1e8).toString()));
  }

  return (
    <div className="signinContainer">
      <p>
        banner id:
        {' '}
        {banner.id}
      </p>
      <p>
        banner url:
        {' '}
        {banner.protocol}
        //
        {banner.subdomain && `${banner.subdomain}.`}
        {banner.domain.domain}
        {banner.path && `${banner.path}`}
        {banner.search && `${banner.search}`}
      </p>
      <div className="text-center">
        <img src={`/uploads/banners/${banner.banner_path}`} alt="preview banner" />
      </div>
      <form onSubmit={handleSubmit(myHandleSubmit)}>
        <Grid container direction="column" spacing={3}>
          <Grid item>
            <Field
              name="price"
              component={renderNumberField}
              label="Price"
              onChange={calculateTotal}
            />
          </Grid>
          <Grid item xs={12}>
            <Field
              name="amount"
              component={renderNumberField}
              label="Amount"
              onChange={calculateTotal}
            />
          </Grid>

          <Grid item xs={12}>
            <Field
              name="total"
              component={renderNumberFieldDisabled}
              label="Total"
              disabled
            />
          </Grid>
          <Grid item xs={12}>
            <p>
              Available:
              {' '}
              {props.user
                          && props.user.wallet
                ? new BigNumber(props.user.wallet.available).dividedBy(1e8).toString()
                : 0}
            </p>
          </Grid>
          <Grid item xs={12}>
            {createBannerOrder.isFetching
              ? <CircularProgress disableShrink />
              : (
                <Button
                  variant="contained"
                  color="primary"
                  disabled={pristine || submitting}
                  type="submit"
                  fullWidth
                  size="large"
                >
                  Proceed
                </Button>
              )}
          </Grid>

          { errorMessage && errorMessage.price
                      && (
                      <div className="error-container signin-error">
                        { errorMessage.price }
                      </div>
                      )}
          { errorMessage && errorMessage.amount
                      && (
                      <div className="error-container signin-error">
                        { errorMessage.amount }
                      </div>
                      )}
        </Grid>

      </form>
    </div>
  );
}

function onSubmitSuccess(result, dispatch) {
  dispatch(reset('createBannerOrder'));
}

function validate(formProps) {
  const errors = {};
  if (!formProps.amount) {
    errors.amount = 'Please enter amount'
  }
  if (!formProps.price) {
    errors.price = 'Please enter price';
  }
  return errors;
}

const selector = formValueSelector('createBannerOrder');

function mapStateToProps(state) {
  return {
    createBannerOrder: state.createBannerOrder,
    errorMessage: state.auth.error,
    recaptchaValue: selector(state, 'captchaResponse'),
    amount: selector(state, 'amount'),
    price: selector(state, 'price'),
    user: state.user.data,
  }
}

export default connect(mapStateToProps, null)(reduxForm({ form: 'createBannerOrder', validate, onSubmitSuccess })(CreateBannerOrder));
