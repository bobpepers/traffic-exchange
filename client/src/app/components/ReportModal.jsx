import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ReportIcon from '@material-ui/icons/Report';
import {
  Modal,
  Backdrop,
  Fade,
  Tooltip,
  FormControl,
  TextField,
  Button,
  Grid,
} from '@material-ui/core';
import {
  reduxForm,
  Field,
  formValueSelector,
  change,
  reset,
} from 'redux-form';
import { connect, useDispatch } from 'react-redux';
import Captcha from './Captcha';
import { idleCreateReportAction, createReportAction } from '../actions/report';

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

const renderField = ({
  InputProps,
  disabled,
  value,
  input,
  type,
  placeholder,
  meta: {
    touched, error,
  },
}) => (
  <div className={`input-group ${touched && error ? 'has-error' : ''}`}>
    <FormControl
      variant="outlined"
      fullWidth
    >
      <TextField
        label={placeholder}
        type={type}
        value={value}
        disabled={!!disabled}
        variant="outlined"
        InputProps={InputProps}
        {...input}
      />
      { touched && error && <div className="form-error">{error}</div> }
    </FormControl>
  </div>
);

const renderTextField = ({
  input,
  type,
  placeholder,
  meta: {
    touched,
    error,
  },
}) => (
  <div className={`addWebsite-description-wrapper input-group ${touched && error ? 'has-error' : ''}`}>
    <TextField
      // id="outlined-multiline-static"
      label="Description"
      multiline
      style={{ width: '100%' }}
      rows={6}
      defaultValue=""
      inputProps={{
        maxLength: 400,
        // className: 'outlined-adornment-field',
      }}
      variant="outlined"
      {...input}
    />
    { touched && error && <div className="form-error">{error}</div> }
  </div>
);

const ReportModal = (props) => {
  const {
    open,
    handleOpen,
    handleClose,
    handleSubmit,
    webslotId,
    domainId,
    createReport,
  } = props;

  const classes = useStyles();
  const dispatch = useDispatch();
  const [descriptionLength, setDescriptionLength] = useState(0);

  const handleFormSubmit = async (formProps) => {
    await dispatch(createReportAction(formProps, webslotId, domainId));
  }

  const onBasicFieldChange = (event, newValue, previousValue, name) => {
    setDescriptionLength(newValue.length);
  }

  useEffect(() => {
    console.log(createReport);
    if (createReport.data) {
      handleClose();
      dispatch(idleCreateReportAction());
      dispatch(reset('report'));
    }
  }, [createReport]);

  return (
    <div>
      <Tooltip
        title="Report this domain as inappropriate"
        aria-label="show"
        onClick={handleOpen}
      >
        <p
          className="reportIcon"
        >
          <ReportIcon />
        </p>
      </Tooltip>
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
            <h2 id="transition-modal-title">
              Report this domain as inappropriate
            </h2>
            <div className="form-container index600 shadow-w signinContainer reportModalContainer content">
              <Grid
                container
                alignItems="center"
                justify="center"
              >
                <Grid item xs={12}>
                  <form onSubmit={handleSubmit(handleFormSubmit)}>
                    <Grid
                      container
                      direction="column"
                      spacing={3}
                    >
                      <Grid item>
                        <Field
                          name="reason"
                          component={renderField}
                          type="text"
                          placeholder="reason"
                        />
                      </Grid>
                      <Grid item>
                        <Field
                          name="description"
                          component={renderTextField}
                          type="description"
                          placeholder="Description"
                          onChange={onBasicFieldChange}
                        />
                        <div>
                          {descriptionLength}
                          {' '}
                          / 400
                        </div>
                      </Grid>
                      <Grid item>
                        <Field
                          component={Captcha}
                          change={change}
                          name="captchaResponse"
                        />
                      </Grid>
                      <Grid item>
                        <Button
                          variant="contained"
                          color="primary"
                          type="submit"
                          className="btn"
                          fullWidth
                          size="large"
                        >
                          Report
                        </Button>
                      </Grid>
                      <Grid item>
                        <Button
                          variant="contained"
                          color="secondary"
                          onClick={handleClose}
                          className="btn"
                          fullWidth
                          size="large"
                        >
                          Cancel
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </Grid>
              </Grid>
            </div>
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

const validate = (formProps) => {
  const errors = {};
  if (!formProps.reason) {
    errors.reason = 'Reason is required'
  }

  if (!formProps.description) {
    errors.description = 'Description is required'
  }

  if (!formProps.captchaResponse) {
    errors.captchaResponse = 'Please validate the captcha.';
  }

  return errors;
}
const selector = formValueSelector('report');

const mapStateToProps = (state) => ({
  errorMessage: state.auth.error,
  createReport: state.createReport,
  recaptchaValue: selector(state, 'captchaResponse'),
})

export default connect(mapStateToProps, null)(reduxForm({ form: 'report', validate })(ReportModal));
