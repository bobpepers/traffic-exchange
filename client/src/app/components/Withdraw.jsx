import React, { useState, useEffect } from 'react';
import {
  Button,
  Modal,
  Backdrop,
  Fade,
  Grid,
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
import * as actions from '../actions';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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
    input, label, meta: { touched, error }, ...custom
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
      // onChange={calculateFee}
      errorText={touched && error}
      {...input}
      {...custom}
    />
    { touched && error && <div className="form-error">{error}</div> }
  </FormControl>
);

const renderTextField = (
  {
    input, label, meta: { touched, error }, ...custom
  },
) => (
  <FormControl variant="outlined" fullWidth>
    <InputLabel htmlFor="outlined-adornment-password">{label}</InputLabel>
    <OutlinedInput
      label={label}
      fullWidth
      id="outlined-adornment-password"
      type="text"
      labelWidth={70}
      hintText={label}
      floatingLabelText={label}
      errorText={touched && error}
      {...input}
      {...custom}
    />
    { touched && error && <div className="form-error">{error}</div> }
  </FormControl>
);

const Withdraw = (props) => {
  const {
    errorMessage,
    createWithdraw,
    handleSubmit,
    pristine,
    submitting,
    createWithdrawPost,
    webslotId,
    idleWithdraw,
    wallet,
  } = props;
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [fee, setFee] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (createWithdrawPost.phase == 1) {
      setTimeout(() => { setOpen(false); }, 2000);
    }
  }, [createWithdrawPost.phase]);

  useEffect(() => {
    idleWithdraw();
  }, []);

  const calculateFee = (e) => {
    setFee((((e.target.value * 1e8) / 100) * 5) / 1e8);
    setTotal(e.target.value - (((e.target.value * 1e8) / 100) * 5) / 1e8)
  };

  const handleClose = () => {
    idleWithdraw();
    setOpen(false);
  };

  const myHandleSubmit = (e) => {
    e.id = webslotId;
    createWithdraw(e);
  }

  return (
    <div className="form-container index600 shadow-w signinContainer content">
      <form onSubmit={handleSubmit(myHandleSubmit)}>
        <Grid container direction="column" spacing={3}>
          <Grid item>
            <Field
              name="amount"
              component={renderNumberField}
              label="Amount"
              onChange={(e) => calculateFee(e)}
            />
          </Grid>
          <Grid item>
            <Field
              name="address"
              component={renderTextField}
              label="Address"
            />
          </Grid>
          <Grid item>
            <p>
              Minimum Amount: 5 RUNES
            </p>
            <p>
              Available:
              {' '}
              {(wallet.available / 1e8)}
              {' '}
              RUNES
            </p>
            <p>
              Fee 5%:
              {' '}
              {fee}
              {' '}
              RUNES
            </p>
            <p>
              Total:
              {' '}
              {total}
              {' '}
              RUNES
            </p>
          </Grid>

          {createWithdrawPost.isFetching
            ? <CircularProgress disableShrink />
            : <Button variant="contained" fullWidth color="primary" disabled={pristine || submitting} type="submit">Withdraw</Button>}
        </Grid>
      </form>
    </div>
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
  if (!formProps.address) {
    errors.address = 'Please enter an address'
  }
  console.log(errors);
  return errors;
}

const selector = formValueSelector('withdraw');

function mapStateToProps(state) {
  return {
    createWithdrawPost: state.createWithdraw,
    errorMessage: state.form.withdraw ? state.form.withdraw.syncErrors : '',
    recaptchaValue: selector(state, 'captchaResponse'),
  }
}

export default connect(mapStateToProps, actions)(reduxForm({ form: 'withdraw', validate, onSubmitSuccess })(Withdraw));
