import React, {
  useState,
  useEffect,
} from 'react';
import {
  Button,
  Fade,
  TextField,
  Grid,
  Tooltip,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import {
  reduxForm,
  Field,
  formValueSelector,
} from 'redux-form';
import { useDropzone } from 'react-dropzone'
import { makeStyles } from '@material-ui/core/styles';
import {
  connect,
  useDispatch,
} from 'react-redux';
import PublishIcon from '@material-ui/icons/Publish';
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

const renderSelectField = (
  {
    input, label, meta: { touched, error }, children, ...custom
  },
) => (
  <>
    <Select
      errortext={touched ? error : ''}
      label={label}
      {...input}
      onChange={(value) => input.onChange(value)}
      inputProps={{
        className: 'outlined-adornment-field',
      }}
      {...custom}
    >
      {children}
    </Select>
    { touched && error && <div className="form-error">{error}</div> }
  </>

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
  formControl: {
    margin: theme.spacing(1),
    minWidth: '100%',
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

function DropzoneField(props) {
  const {
    input: { onChange },
  } = props;
  const [files, setFiles] = useState([]);
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    onDrop: (files) => {
      onChange(files);
      setFiles(files.map((file) => Object.assign(file, {
        preview: URL.createObjectURL(file),
      })));
    },
  });

  const thumbs = files.map((file) => (
    <div key={file.name}>
      <div>
        <img
          src={file.preview}
          alt="banner"
        />
      </div>
    </div>
  ));

  useEffect(() => () => {
    // Make sure to revoke the data uris to avoid memory leaks
    files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  return (
    <div>
      <div {...getRootProps()}>
        <input {...getInputProps()} />

        {props.input.value
          ? props.input.value.map((file) => (
            <Grid item align="center" className="uploadBannerBorder">
              <div className="uploadBannerIcon">
                {file.path}
              </div>
              <div>
                {thumbs}
              </div>
            </Grid>
          ))
          : (
            <Grid container justify="center">
              <Grid item align="center" className="uploadBannerBorder">
                <div className="uploadBannerIcon">
                  <PublishIcon />
                </div>
                <h3 className="text-center">Drag 'n drop your file here, or click to select file</h3>
                { props.meta.touched && props.meta.error && <div className="form-error">{props.meta.error}</div> }
              </Grid>
            </Grid>
          )}
      </div>
    </div>
  );
}

const AddBanner = (props) => {
  const {
    addBannerAction,
    addBanner,
    handleSubmit,
    pristine,
    submitting,
  } = props;
  const classes = useStyles();

  const myHandleSubmit = (e) => {
    console.log(e);
    addBannerAction(e);
  }

  return (
    <div className="signinContainer">
      <h2 className="text-center">Add Banner</h2>
      <form onSubmit={handleSubmit(myHandleSubmit)}>
        <Grid container direction="column" spacing={3}>
          <Grid item>
            <p className="text-center">
              Allowed file extensions: jpg, jpeg, png, gif
            </p>
            <p className="text-center">
              Max file size: 3mb
            </p>
          </Grid>
          <Grid item>
            <FormControl variant="outlined" style={{ width: '100%' }}>
              <InputLabel id="demo-simple-select-outlined-label">Resolution</InputLabel>
              <Field
                name="bannerResolution"
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
            <Field
              name="url"
              component={renderField}
              type="url"
              placeholder="Url"
            />
          </Grid>
          <Grid item>
            <Field name="banner" component={DropzoneField} />
            {addBanner && addBanner.error && addBanner.error}
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

function validate(formProps) {
  const errors = {};
  console.log(formProps);
  console.log('formprops');
  if (!formProps.bannerResolution) {
    errors.bannerResolution = 'Please select banner resolution'
  }

  if (!formProps.banner) {
    errors.banner = 'Banner Required';
  }

  if (!formProps.url) {
    errors.url = 'URL Required';
  }

  return errors;
}
const selector = formValueSelector('addBanner');

function mapStateToProps(state) {
  return {
    errorMessage: state.auth.error,
    recaptchaValue: selector(state, 'captchaResponse'),
    createWebslot: state.createWebslot,
  }
}

export default connect(mapStateToProps, actions)(reduxForm({ form: 'addBanner', validate })(AddBanner));
