import React, {
  useState,
  useEffect,
} from 'react';
import {
  Button,
  TextField,
  Grid,
  Fab,
  Tooltip,
  FormControl,
} from '@material-ui/core';
import Iframe from 'react-iframe';
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

const renderField = ({
  input, type, placeholder, meta: { touched, error },
}) => (
  <div className={`input-group ${touched && error ? 'has-error' : ''}`}>
    <FormControl
      variant="outlined"
      fullWidth
    >
      <TextField
        inputProps={{
          maxLength: 400,
          className: 'outlined-adornment-field',
        }}
        label={placeholder}
        type={type}
        variant="outlined"
        {...input}
      />
      { touched && error && <div className="form-error">{error}</div> }
    </FormControl>
  </div>
);

const renderTextField = ({
  input, type, placeholder, meta: { touched, error },
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
        className: 'outlined-adornment-field',
      }}
      variant="outlined"
      {...input}
    />
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

const CreateWebslot = (props) => {
  const {
    errorMessage,
    addWebslot,
    handleSubmit,
    pristine,
    submitting,
    createWebslot,
    idleWebslot,
    back,
  } = props;
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [descriptionLength, setDescriptionLength] = React.useState(0);
  const [url, setUrl] = useState(true);
  const [hidden, setHidden] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    if (createWebslot.phase == 1) {
      setTimeout(() => { setOpen(false); }, 2000);
    }
  }, [createWebslot.phase]);

  useEffect(() => {
    idleWebslot();
  }, [])

  const myHandleSubmit = (e) => {
    addWebslot(e);
    back();
  }

  const onBasicFieldChange = (event, newValue, previousValue, name) => {
    console.log(newValue.length);
    setDescriptionLength(newValue.length);
  }

  const backFromCreateSurfSlot = () => {
    dispatch(reset('createWebslot'));
    idleWebslot();
    back();
  }
  return (
    <Grid item xs={12}>
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => { backFromCreateSurfSlot() }}
        >
          Back
        </Button>
      </Grid>

      <h2 className="text-center">Add Surf Slot</h2>
      <div className={`signinContainer ${createWebslot.phase == 0 ? 'show' : 'hidden'}`}>
        <form
          onSubmit={handleSubmit(myHandleSubmit)}
        >
          <Grid
            container
            direction="column"
            spacing={3}
          >
            <Grid item>
              <Field
                name="url"
                component={renderField}
                type="url"
                placeholder="Url"
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
            <Grid item>
              <p>Preview:</p>
              <Iframe
                url={props.urlValue}
                width="100%"
                height="600px"
                id="myId"
                className="surfIframe"
                display="initial"
                sandbox="allow-same-origin allow-forms allow-scripts allow-popups allow-popups-to-escape-sandbox allow-modals"
              />
              <p>Common Issues why your website won't load:</p>
              <p>- Your website needs a SSL certificate (https)</p>
              <p>- Your website headers has invalid settings: X_FRAME_OPTIONS</p>
            </Grid>
          </Grid>
        </form>
      </div>
    </Grid>
  );
}
function onSubmitSuccess(result, dispatch) {
  dispatch(reset('createWebslot'));
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
const selector = formValueSelector('createWebslot');

function mapStateToProps(state) {
  return {
    errorMessage: state.auth.error,
    recaptchaValue: selector(state, 'captchaResponse'),
    createWebslot: state.createWebslot,
    urlValue: selector(state, 'url'),
  }
}

export default connect(mapStateToProps, actions)(reduxForm({ form: 'createWebslot', validate, onSubmitSuccess })(CreateWebslot));
