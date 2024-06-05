import React, {
  useState,
  useEffect,
  useRef,
} from 'react';
import {
  connect,
  useDispatch,
} from 'react-redux';
import Iframe from 'react-iframe';
import PropTypes from 'prop-types';
// import { makeStyles } from '@material-ui/core/styles';
import {
  LinearProgress,
  Typography,
  Box,
  Modal,
  Button,
  Backdrop,
  Fade,
  Card,
  Grid,
  FormControl,
  TextField,
  OutlinedInput,
  CardContent,
  Tooltip,
} from '@material-ui/core';
import { usePageVisibility } from 'react-page-visibility';
import { makeStyles } from '@material-ui/core/styles';
import { useDetectAdBlock } from 'adblock-detect-react';
import {
  reduxForm,
  Field,
  formValueSelector,
  change,
} from 'redux-form';
import history from '../history';
import Captcha from '../components/Captcha';
import ReportModal from '../components/ReportModal';

import { completeSurfAction } from '../actions/surfComplete';
import { startSurfAction } from '../actions/surfStart';

const LinearProgressWithLabel = (props) => (
  <Box display="flex" alignItems="center">
    <Box width="100%" mr={1}>
      <LinearProgress variant="determinate" {...props} />
    </Box>
    <Box minWidth={35}>
      <Typography variant="body2" color="textSecondary">
        {`${Math.round(
          props.value,
        )}%`}
      </Typography>
    </Box>
  </Box>
)

LinearProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate and buffer variants.
   * Value between 0 and 100.
   */
  value: PropTypes.number.isRequired,
};

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
  root: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
}));

const renderField = ({
  input, type, placeholder, meta: { touched, error },
}) => (
  <div className={`input-group ${touched && error ? 'has-error' : ''}`}>
    <FormControl
      variant="outlined"
      fullWidth
    >
      <TextField
        fullWidth
        id="outlined-surfcount-field"
        type={type}
        value={placeholder}
      />
      { touched && error && <div className="form-error">{error}</div> }
    </FormControl>
  </div>
);

const Surf = (props) => {
  const {
    handleSubmit,
    signinUser,
    startSurf,
    completedSurf,
    user,
  } = props;

  const dispatch = useDispatch();
  const [progress, setProgress] = useState(0);
  const isVisible = usePageVisibility();
  const [open, setOpen] = useState(false);
  // const [scroll, setScroll] = useState('paper');
  const [step, setStep] = useState(1);
  const [seconds, setSeconds] = useState(0);
  const adBlockDetected = useDetectAdBlock();
  const [clicked, setClicked] = useState('');
  const classes = useStyles();
  const [openReportModal, setOpenReportModal] = useState(false);
  const [rerender, setRerender] = useState(0);

  useEffect(() => {
    document.title = 'RunesX - Surf';
  }, []);

  useEffect(() => {
    setRerender(rerender + 1);
    const s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = 'https://www.runesx.com/uploads/runesx.js';
    document.body.appendChild(s);

    return () => {
      document.body.removeChild(s);
      if (document.getElementById('runesx-25')) {
        document.getElementById('runesx-25').innerHTML = '';
      }
    };
  }, [step]);

  const applySmartyAds = () => {
    const s = document.createElement('script');
    s.type = 'text/javascript';
    s.src = 'https://www.runesx.com/uploads/runesx.js';
    document.body.appendChild(s);
  }

  const handleReportModalOpen = () => {
    setOpenReportModal(true);
  };

  const handleReportModalClose = () => {
    setOpenReportModal(false);
  };

  function refreshPage() {
    window.location.reload(false);
  }

  const startStep2 = async () => {
    await dispatch(startSurfAction());
    setProgress(0);
    setStep(2);
  }

  const handleFormSubmit = async (values, verificationCode, url) => {
    const { captchaResponse } = values;
    if (clicked === 'visit') {
      await dispatch(completeSurfAction(verificationCode, captchaResponse));
      const win = window.open(url, '_blank');
      if (win != null) {
        win.focus();
      }
      history.push('/');
    }
    if (clicked === 'stop') {
      console.log('clicked stop');
      await dispatch(completeSurfAction(verificationCode, captchaResponse));
      history.push('/');
    }
    if (clicked === 'next') {
      await dispatch(completeSurfAction(verificationCode, captchaResponse));
      await dispatch(startSurfAction());
      setOpen(false);
      setProgress(0);
      setSeconds(0);
      setStep(2);
    }
    // console.log(enabledCaptcha);
    // signinUser(props);
  }

  const descriptionElementRef = useRef(null);
  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  useEffect(() => {
    if (progress >= 100) {
      setOpen(true);
      setRerender(rerender + 1);
    }
  }, [progress]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (
        isVisible
        && step === 2
        && !startSurf.error
        && !startSurf.isFetching
        && !openReportModal
      ) {
        setProgress((prevProgress) => (prevProgress >= 100 ? 100 : prevProgress + 1));
      }
    }, 600);
    return () => clearInterval(interval);
  }, [
    isVisible,
    startSurf,
    startSurf.isFetching,
    step,
    openReportModal,
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (
        isVisible
        && step === 2
        && !startSurf.error
        && !startSurf.isFetching
        && !openReportModal
      ) {
        setSeconds((prevSeconds) => (prevSeconds >= 60 ? 60 : prevSeconds + 1));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [
    isVisible,
    startSurf,
    startSurf.isFetching,
    step,
    openReportModal,
  ]);

  if (adBlockDetected) {
    return (
      <div className="height100 surfContainer content text-center">
        <h2>It looks like you're using an ad blocker. That's okay. Who doesn't?</h2>
        <h2>But advertisement is the source of revenue for this website.</h2>
        <h2>Please disable adblocker to use the surf feature</h2>
        <Button
          variant="contained"
          color="primary"
          onClick={refreshPage}
          size="large"
          fullWidth
        >
          I understand, I have disabled my adblocker.
        </Button>
      </div>
    );
  }
  if (step === 1) {
    return (
      <div className="height100 surfContainer content">
        <h3 className="text-center">Before you start...</h3>
        <Grid container className="text-center" spacing={3}>
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            lg={6}
            xl={6}
          >
            <Card className={classes.root} variant="outlined">
              <CardContent>
                The following content is not part of the RunesX website
              </CardContent>
            </Card>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            lg={6}
            xl={6}
          >
            <Card className={classes.root} variant="outlined">
              <CardContent>
                Each Surf Takes 1 minute
              </CardContent>
            </Card>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            lg={6}
            xl={6}
          >
            <Card className={classes.root} variant="outlined">
              <CardContent>
                You get served a random surf of the 100 best paying offers
              </CardContent>
            </Card>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            lg={6}
            xl={6}
          >
            <Card className={classes.root} variant="outlined">
              <CardContent>
                You have to sovle a captcha every 10 surfs
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              onClick={startStep2}
              color="primary"
              size="large"
              fullWidth
            >
              I understand, let's go!
            </Button>
          </Grid>
          <Grid
            container
            item
            xs={12}
            justify="center"
          >
            <div id="smartyadLarge" />
          </Grid>
        </Grid>
      </div>
    );
  }
  // console.log('props.userprops.userprops.userprops.userprops.user');
  // console.log(props.startSurf.data);
  if (step === 2 && startSurf.isFetching) {
    return (
      <div className="content">Loading...</div>
    )
  }
  if (step === 2 && startSurf.error === 'NO_ORDERS_AVAILABLE') {
    return (
      <div>We're Sorry, there are currently no surfs available.</div>
    )
  }
  if (step === 2 && !startSurf.isFetching) {
    // console.log('props.startSurf.data');
    // console.log(props.startSurf.data.url);
    // console.log(props.startSurf.isFetching);
    // console.log(props.startSurf)
    // const url = props.startSurf.data.protocol + '://' + ''

    const url = `${startSurf.data.protocol
    }//${
      startSurf.data.subdomain !== '' ? `${startSurf.data.subdomain}.` : ''
    }${startSurf.data.domain
    }${
      startSurf.data.path !== '' ? `${startSurf.data.path}` : ''
    }${startSurf.data.search !== '' ? startSurf.data.search : ''}`;

    const { verificationCode } = startSurf.data;

    return (
      <>
        <div className="surfToolbar">
          <Grid container>
            <Grid
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justify="center"
              item
              xs={4}
              sm={4}
              md={2}
              lg={2}
              xl={2}
            >
              <Tooltip title="Time left" aria-label="show">
                <>
                  <p>
                    Time left
                  </p>
                  <p>
                    0:
                    {(`0${60 - seconds}`).slice(-2)}
                  </p>
                </>
              </Tooltip>
            </Grid>
            <Grid
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justify="center"
              item
              xs={4}
              sm={4}
              md={2}
              lg={2}
              xl={2}
            >
              <p className="text-center">
                <span className="span-text-surfToolBar">
                  Reward
                </span>
                <span className="span-text-surfToolBar">
                  {startSurf.data.price
                    && (((startSurf.data.price) - ((startSurf.data.price / 100) * 2)) / 1e8)}
                  {' '}
                  RUNES
                </span>
              </p>
            </Grid>
            <Grid
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justify="center"
              item
              xs={4}
              sm={4}
              md={2}
              lg={2}
              xl={2}
            >
              <div className="avatar-image-wrapper">
                <div className="avatar-image">
                  <img
                    src={`https://www.runesx.com/uploads/avatars/${startSurf.data.user_avatar_path}`}
                    alt="avatar"
                  />
                </div>
              </div>
              <p>{startSurf.data.user}</p>
            </Grid>
            <Grid
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justify="center"
              item
              xs={4}
              sm={4}
              md={2}
              lg={2}
              xl={2}
            >
              <ReportModal
                open={openReportModal}
                handleClose={handleReportModalClose}
                handleOpen={handleReportModalOpen}
                webslotId={startSurf.data.webslotId}
                domainId={startSurf.data.domainId}
              />
              <p>
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {url}
                </a>
              </p>
            </Grid>
            <Grid
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justify="center"
              item
              xs={4}
              sm={4}
              md={2}
              lg={2}
              xl={2}
              // justify="flex-end"
            >
              <div>
                <iframe
                  title="A-ads small 1"
                  data-aa="1499149"
                  src="//ad.a-ads.com/1499149?size=120x60"
                  scrolling="no"
                  style={{
                    width: '120px',
                    height: '60px',
                    border: '0px',
                    padding: '0',
                    overflow: 'hidden',
                  }}
                  allowtransparency="true"
                />
              </div>
            </Grid>
            <Grid
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justify="center"
              item
              xs={4}
              sm={4}
              md={2}
              lg={2}
              xl={2}
              // justify="flex-end"
            >
              <div>
                <div
                  className="_fa7cdd4c68507744"
                  data-options="min_cpm=0.03"
                  data-zone="6b2d9177c16840f38c5d21ea234067e1"
                  style={{
                    width: '120px',
                    height: '60px',
                    display: 'inline-block',
                    margin: '0 auto',
                  }}
                >
                  <div id="runesx-25" />
                </div>
              </div>

            </Grid>
          </Grid>
        </div>
        <div
          className="height100 content surfContent"
        >
          {progress >= 100 ? <span /> : <span />}
          <LinearProgress
            variant="determinate"
            value={progress}
          />

          <Iframe
            url={startSurf.data ? url : ''}
            width="100%"
            height="100%"
            id="myId"
            className="surfIframe"
            display="initial"
            position="absolute"
            sandbox="allow-same-origin allow-forms allow-scripts allow-modals"
          />
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            onRendered={applySmartyAds}
            className={classes.modal}
            open={open}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
          >
            <Fade in={open}>
              <div className={classes.paper}>
                <form
                  onSubmit={
                  handleSubmit(
                    (values) => handleFormSubmit(values, verificationCode, url),
                  )
                }
                >
                  <Grid container spacing={3}>
                    <Grid
                      container
                      item
                      xs={12}
                      justify="center"
                    >
                      <h2 className="text-center">
                        You just watched
                        {' '}
                        {startSurf.data.subdomain && startSurf.data.subdomain}
                        {startSurf.data.subdomain && '.'}
                        {startSurf.data.domain}
                      </h2>
                    </Grid>
                    <Grid
                      container
                      item
                      xs={12}
                      justify="center"
                    >
                      <p className="text-center">
                        {startSurf.data.description && startSurf.data.description}
                      </p>
                    </Grid>
                    <Grid
                      container
                      item
                      xs={12}
                      justify="center"
                    >
                      <p>
                        Reward:
                        {' '}
                        {startSurf.data.price
                          && (((startSurf.data.price) - ((startSurf.data.price / 100) * 2)) / 1e8)}
                        {' '}
                        RUNES
                      </p>
                    </Grid>
                    <Grid
                      container
                      item
                      xs={12}
                      justify="center"
                    >
                      <Field
                        name="surfCount"
                        component={renderField}
                        type="hidden"
                        placeholder={
                          user
                          && user.data
                          && user.data.surf_count
                        }
                      />
                    </Grid>
                    {user.data.surf_count % 10 === 0
                    && (
                    <Grid
                      container
                      item
                      xs={12}
                      justify="center"
                    >
                      <p>
                        Please solve this captcha to proof that you are human.
                      </p>
                    </Grid>
                    )}
                    {user.data.surf_count % 10 === 0
                    && (
                      <Grid
                        container
                        item
                        xs={12}
                        justify="center"
                      >
                        <Field
                          component={Captcha}
                          change={change}
                          name="captchaResponse"
                        />
                      </Grid>
                    )}

                    <Grid
                      container
                      item
                      xs={12}
                      justify="center"
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        className="btn"
                        size="large"
                        onClick={() => {
                          setClicked('next')
                        }}
                      >
                        Collect Reward & Next Surf
                      </Button>
                    </Grid>

                    <Grid
                      container
                      item
                      xs={6}
                      justify="center"
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        className="btn"
                        size="large"
                        onClick={() => {
                          setClicked('visit')
                        }}
                      >
                        Collect Reward & Visit Website
                      </Button>
                    </Grid>
                    <Grid
                      container
                      item
                      xs={6}
                      justify="center"
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        className="btn"
                        size="large"
                        onClick={() => {
                          setClicked('stop')
                        }}
                      >
                        Collect Reward & Stop Surfing
                      </Button>
                    </Grid>
                    <Grid
                      container
                      item
                      xs={12}
                      justify="center"
                    >
                      <div
                        className="_fa7cdd4c68507744"
                        data-options="min_cpm=0.05"
                        data-zone="bedc2ba6fc1841c2bf4102e026528010"
                        style={{
                          width: '300px',
                          height: '250px',
                          display: 'inline-block',
                          margin: '0 auto',
                        }}
                      >
                        <div
                          id="runesx-26"
                          style={{ marginTop: '20px' }}
                        />
                      </div>
                    </Grid>
                  </Grid>

                </form>
                {
                completedSurf.isFetching
                  ? 'loading....'
                  : ''
                }
                {completedSurf ? completedSurf.data.data : ''}

              </div>
            </Fade>
          </Modal>
        </div>
      </>
    );
  }
}

function validate(formProps) {
  const errors = {};
  const validateCount = formProps.surfCount % 10 === 0;
  console.log(validateCount);
  // console.log('validatevalidatevalidatevalidatevalidatevalidatevalidatevalidatevalidatevalidatevalidatevalidatevalidatevalidatevalidatevalidatevalidatevalidatevalidatevalidatevalidate');
  // console.log(formProps);
  // console.log(verificationCode);
  // console.log(url);
  // if (formProps.surfCount % 10 === 0) {
  //  if (!formProps.captchaResponse) {
  //    console.log('captcha error');
  //    errors.captchaResponse = 'Please validate the captcha.';
  //  }
  // }

  if (!formProps.captchaResponse) {
    if (!validateCount) {
      //  console.log('captcha error');
      errors.captchaResponse = 'Please validate the captcha.';
    }
  }

  if (!formProps.captchaResponse) {
    if (formProps.surfCount % 10 === 0) {
      console.log(formProps.captchaResponse);
      console.log('captcha error');
      errors.captchaResponse = 'Please validate the captcha.';
    }
  }

  return errors;
}

const selector = formValueSelector('surfComplete');

const mapStateToProps = (state) => ({
  completedSurf: state.completeSurf,
  startSurf: state.startSurf,
  user: state.user,
  errorMessage: state.auth.error,
  recaptchaValue: selector(state, 'captchaResponse'),
})

const mapDispatchToProps = (dispatch) => ({
  completeSurf: (msg) => {
    dispatch(completeSurfAction(msg));
  },
});

// export default connect(mapStateToProps, mapDispatchToProps)(Surf);
export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({ form: 'surfComplete', validate })(Surf));
