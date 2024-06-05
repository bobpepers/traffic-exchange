import React from 'react';
import {
  reduxForm, Field, change, formValueSelector,
} from 'redux-form';
import { connect } from 'react-redux';
import { Grid } from '@material-ui/core';
import { withTranslation, useTranslation } from 'react-i18next';
import * as actions from '../actions/contact';
import Captcha from './Captcha';

const renderField = ({
  input, type, placeholder, meta: { touched, error },
}) => (
  <div className={`input-group ${touched && error ? 'has-error' : ''}`}>
    <input type={type} placeholder={placeholder} {...input} />
    { touched && error && <div className="form-error">{error}</div> }
  </div>
);
const textArea = ({
  input, type, placeholder, meta: { touched, error },
}) => (
  <div className={`input-group text-area ${touched && error ? 'has-error' : ''}`}>
    <textarea type={type} placeholder={placeholder} {...input} />
    { touched && error && <div className="form-error">{error}</div> }
  </div>
);

class Contact extends React.Component {
  constructor(props) {
    super(props);

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  handleFormSubmit(props) {
    this.props.contactSend(props);
  }

  render() {
    const { t } = this.props;
    const { handleSubmit } = this.props;
    return (
      <div id="contact">
        <div className="backgroundContact textBorder text-center">
          <Grid container justify="center">
            <Grid item lg={12} md={12} sm={12}>
              <h2>{t('workWithUs')}</h2>
              <h4>
                {t('workWithUsDescription')}
              </h4>
              <form onSubmit={handleSubmit(this.handleFormSubmit)}>

                {/* Name */}
                <Field name="name" component={renderField} type="text" placeholder={t('yourName')} />

                {/* Email */}
                <Field name="email" component={renderField} type="text" placeholder={t('yourEmail')} />

                {/* Message */}
                <Field name="message" component={textArea} type="text" placeholder={t('yourMessage')} />

                {/* Recaptcha */}
                <div className="row d-flex justify-content-center">
                  <Field component={Captcha} change={change} name="captchaResponse" />
                </div>

                {/* Server error message */}
                { this.props.errorMessage && this.props.errorMessage.contact
                      && (
                      <div className="error-container contact-error">
                        Oops!
                        { this.props.errorMessage.contact }
                      </div>
                      ) }

                {/* Send Button */}
                <button type="submit" className="btn workFormButton">
                  {t('sendMessage')}
                  {' '}
                </button>
              </form>
            </Grid>
          </Grid>
        </div>
      </div>
    );
  }
}

function validate(formProps) {
  const errors = {};
  // console.log(formProps);

  if (!formProps.name) {
    errors.name = 'Name is required'
  }

  if (!formProps.email) {
    errors.email = 'Email is required'
  }

  if (!formProps.message) {
    errors.message = 'Message is required'
  }

  if (!formProps.captchaResponse) {
    errors.captchaResponse = 'Please validate the captcha.';
  }

  return errors;
}

const selector = formValueSelector('contact');
function mapStateToProps(state) {
  return {
    errorMessage: state.auth.error,
    recaptchaValue: selector(state, 'captchaResponse'),
  }
}

Contact = reduxForm({ form: 'contact', validate })(Contact);

export default withTranslation()(connect(mapStateToProps, actions)(Contact));
