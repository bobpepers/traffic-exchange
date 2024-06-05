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
      errorText={touched && error}
      {...input}
      {...custom}
    />
  </FormControl>
);

const Order = (props) => {
  const {
    errorMessage, createOrder, handleSubmit, pristine, submitting, createOrderPost, webslotId, idleOrder,
  } = props;
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // This effect uses the `value` variable,
    // so it "depends on" `value`.
    if (createOrderPost.phase == 1) {
      setTimeout(() => { setOpen(false); }, 2000);
    }
  }, [createOrderPost.phase]) // pass `value` as a dependency

  const handleOpen = () => {
    setOpen(true);
    idleOrder();
  };

  const handleClose = () => {
    idleOrder();
    setOpen(false);
  };

  const myHandleSubmit = (e) => {
    e.id = webslotId;
    createOrder(e);
  }

  return (
    <>
      <Grid
        container
        direction="column"
        alignItems="center"
        justify="center"
        item
        xs={12}
      >
        <Button variant="contained" color="primary" onClick={handleOpen}>
          Bid
        </Button>

      </Grid>
      <div>
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
              <h2>Order</h2>
              <p>
                Webslot id:
                {' '}
                {props.webslotId}
              </p>
              <div className={createOrderPost.phase == 1 ? 'show' : 'hidden'}>
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
                  <circle className="path circle" fill="none" stroke="#73AF55" strokeWidth="6" strokeMiterlimit="10" cx="65.1" cy="65.1" r="62.1" />
                  <polyline className="path check" fill="none" stroke="#73AF55" strokeWidth="6" strokeLinecap="round" strokeMiterlimit="10" points="100.2,40.2 51.5,88.8 29.8,67.5 " />
                </svg>
              </div>
              <div className={createOrderPost.phase == 2 ? 'show' : 'hidden'}>
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130.2 130.2">
                  <circle className="path circle" fill="none" stroke="#D06079" strokeWidth="6" strokeMiterlimit="10" cx="65.1" cy="65.1" r="62.1" />
                  <line className="path line" fill="none" stroke="#D06079" strokeWidth="6" strokeLinecap="round" strokeMiterlimit="10" x1="34.4" y1="37.9" x2="95.8" y2="92.3" />
                  <line className="path line" fill="none" stroke="#D06079" strokeWidth="6" strokeLinecap="round" strokeMiterlimit="10" x1="95.8" y1="38" x2="34.4" y2="92.2" />
                </svg>
              </div>
              <div className={createOrderPost.phase == 0 ? 'show' : 'hidden'}>
                <form onSubmit={handleSubmit(myHandleSubmit)}>
                  <Grid container>
                    <Grid item xs={12}>
                      <Field name="price" component={renderNumberField} label="Price" />
                    </Grid>
                    <Grid item xs={12}>
                      <Field name="amount" component={renderNumberField} label="Amount" />
                    </Grid>

                    <Grid item xs={12}>
                      <Field name="total" component={renderNumberField} label="Total" disabled />
                    </Grid>
                  </Grid>

                  { errorMessage && errorMessage.price
                                && (
                                <div className="error-container signin-error">
                                  Oops!
                                    { errorMessage.price }
                                </div>
                                ) }
                  { errorMessage && errorMessage.amount
                                && (
                                <div className="error-container signin-error">
                                  Oops!
                                    { errorMessage.amount }
                                </div>
                                ) }

                  <Button variant="contained" color="primary" disabled={pristine || submitting} onClick={handleClose}>
                    Cancel
                  </Button>
                  {createOrderPost.isFetching
                    ? <CircularProgress disableShrink />
                    : <Button variant="contained" color="primary" disabled={pristine || submitting} type="submit">Proceed</Button>}

                </form>
              </div>
            </div>
          </Fade>
        </Modal>
      </div>
    </>
  );
}

function onSubmitSuccess(result, dispatch) {
  dispatch(reset('order'));
}

function wait(ms) {
  const start = new Date().getTime();
  let end = start;
  while (end < start + ms) {
    end = new Date().getTime();
  }
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
  }
}

export default connect(mapStateToProps, actions)(reduxForm({ form: 'order', validate, onSubmitSuccess })(Order));
