import React, { useState } from 'react';
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
  reduxForm, Field, formValueSelector, change, reset,
} from 'redux-form';
import { makeStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import BuyWebslotDialog from './BuyWebslotDialog';
import Captcha from './Captcha';
import * as actions from '../actions';

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

const CreateWebslot = (props) => {
  const {
    errorMessage, addWebslot, handleSubmit, pristine, submitting,
  } = props;
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [url, setUrl] = useState(true);
  const [hidden, setHidden] = useState(true);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const myHandleSubmit = (e) => {
    addWebslot(e);
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
        sm={4}
        md={4}
      >
        <Tooltip title="Add Website" aria-label="add">
          <Fab color="primary" className={classes.fab}>
            <AddIcon onClick={handleOpen} />
          </Fab>
        </Tooltip>

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
              <h2>Buy Extra Webslot</h2>
              <p>Cost: 5000 RUNES</p>
              <BuyWebslotDialog />

            </div>
          </Fade>
        </Modal>
      </div>
    </>
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
    errors.url = 'Email is required'
  }

  if (!formProps.captchaResponse) {
    errors.captchaResponse = 'Please validate the captcha.';
  }

  return errors;
}
const selector = formValueSelector('createWebslot');

function mapStateToProps(state) {
  console.log(state);
  console.log('state');

  return {
    errorMessage: state.auth.error,
    recaptchaValue: selector(state, 'captchaResponse'),
  }
}

export default connect(mapStateToProps, actions)(reduxForm({ form: 'createWebslot', validate, onSubmitSuccess })(CreateWebslot));
