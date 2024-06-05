import React, {
  useState,
  useEffect,
} from 'react';
import {
  Button,
  Modal,
  Backdrop,
  Fade,
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
import * as actions from '../actions';

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
    <InputLabel htmlFor="outlined-adornment-number">{label}</InputLabel>
    <OutlinedInput
      label={label}
      fullWidth
      id="outlined-adornment-number"
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
          // className: 'outlined-adornment-field',
          color: 'black',
        },
      }}
      {...input}
      {...custom}
    />
  </FormControl>
);

const Order = (props) => {
  const {
    errorMessage,
    createOrder,
    handleSubmit,
    pristine,
    submitting,
    createOrderPost,
    webslotData,
    idleOrder,
    price,
    amount,
    back,
  } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    idleOrder();
  }, [])

  useEffect(() => {
    if (createOrderPost.phase == 1) {
      setOpen(false);
    }
  }, [createOrderPost.phase]);

  const myHandleSubmit = (e) => {
    e.id = webslotData.id;
    createOrder(e);
    back();
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
    dispatch(change('order', 'total', total.dividedBy(1e8).toString()));
  }

  const backFromCreateSurfSlotOrder = () => {
    dispatch(reset('order'));
    idleOrder();
    back();
  }

  const url = (
    `${webslotData.protocol || ''

    }//${

      webslotData.subdomain && `${webslotData.subdomain}.` || ''

    }${webslotData.domain && webslotData.domain.domain || ''

    }${webslotData.path && webslotData.path || ''

    }${webslotData.search && webslotData.search || ''}`
  ).trim() || null;

  return (
    <Grid item xs={12}>
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => { backFromCreateSurfSlotOrder() }}
        >
          Back
        </Button>
      </Grid>
      <h2 className="text-center">
        Order (
        {url}
        )
      </h2>
      <p>
        Webslot id:
        {' '}
        {webslotData.id}
      </p>
      <div className={`signinContainer ${createOrderPost.phase == 0 ? 'show' : 'hidden'}`}>
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

            {/*
                  <Button variant="contained" color="primary" disabled={pristine || submitting} onClick={handleClose}>
                    Cancel
                  </Button>
                  */}
            <Grid item xs={12}>
              {createOrderPost.isFetching
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
    </Grid>
  );
}

function onSubmitSuccess(result, dispatch) {
  dispatch(reset('order'));
}

function validate(formProps) {
  const errors = {};
  if (!formProps.amount) {
    errors.amount = 'Please enter amount'
  }
  if (!formProps.price) {
    errors.price = 'Please enter price';
  }
  console.log(errors);
  return errors;
}

const selector = formValueSelector('order');

function mapStateToProps(state) {
  return {
    createOrderPost: state.createOrder,
    errorMessage: state.auth.error,
    recaptchaValue: selector(state, 'captchaResponse'),
    amount: selector(state, 'amount'),
    price: selector(state, 'price'),
    user: state.user.data,
  }
}

export default connect(mapStateToProps, actions)(reduxForm({ form: 'order', validate, onSubmitSuccess })(Order));
