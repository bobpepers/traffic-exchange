import React, { useState, useEffect } from 'react';
import {
  Button,
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
import CloseIcon from '@material-ui/icons/Close';

import { disabletfa, idleDisabletfa } from '../../actions';

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

const DisableTfa = (props) => {
  const {
    errorMessage,
    disabletfa,
    handleSubmit,
    pristine,
    submitting,
    tfa,
    idleDisabletfa,
  } = props;
  const classes = useStyles();
  const [open, setOpen] = useState(false);

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
    idleDisabletfa();
  };

  const myHandleSubmit = (e) => {
    disabletfa(e);
  }

  console.log(errorMessage);

  return (
    <>
      <Grid container>
        <Grid item xs={12}>
          <h2>Disable</h2>
        </Grid>
        <div className="w-100 signinContainer">
          <form
            style={{ width: '100%' }}
            onSubmit={handleSubmit(myHandleSubmit)}
          >
            <Grid container spacing={3}>
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
                      fullWidth
                      variant="contained"
                      color="primary"
                      disabled={pristine || submitting}
                      type="submit"
                    >
                      Disable
                    </Button>
                  )}
              </Grid>
            </Grid>
          </form>
        </div>
      </Grid>
    </>
  );
}

const onSubmitSuccess = (result, dispatch) => {
  dispatch(reset('order'));
}

const validate = (formProps) => {
  const errors = {};
  if (!formProps.tfa) {
    errors.tfa = 'Please enter 2fa code'
  }
  console.log(errors);
  return errors;
}

const selector = formValueSelector('enable2fa');

const mapStateToProps = (state) => {
  console.log('Set2FA mapStateToProps');
  console.log(state);
  // console.log(state.createOrder);
  return {
    tfa: state.tfa,
    errorMessage: state.auth.error,
  }
}
const mapDispatchToProps = {
  disabletfa, // will be wrapped into a dispatch call
  idleDisabletfa, // will be wrapped into a dispatch call
};

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({ form: 'enable2fa', validate, onSubmitSuccess })(DisableTfa));
