import React, {
  useEffect,
  useState,
  useRef,
} from 'react';
import {
  connect,
  useDispatch,
} from 'react-redux';
import {
  Grid,
  Button,
  Tooltip,
  Box,
} from '@material-ui/core';
import { withTranslation } from 'react-i18next';
// import actions from 'redux-form/lib/actions';
import AddIcon from '@material-ui/icons/Add';
import { idleVerifyPublisherAction, idleAddPublisherAction } from '../actions/publisher';
import AddPublisher from '../components/AddPublisher';
import VerifyPublisher from '../components/VerifyPublisher';
import PublisherList from '../components/PublisherList';
import AddAdZone from '../components/AddAdZone';
import AdZoneInfo from '../components/AdZoneInfo';
import AdZoneList from '../components/AdZoneList';
import BuyPublisherSlotDialog from '../components/BuyPublisherSlotDialog';

const PublishersContainer = (props) => {
  const {
    t,
    error,
    loading,
    addPublisher,
    publishers,
    verifyPublisher,
    addAdzone,
    user,
  } = props;

  const dispatch = useDispatch();
  const [publishersPath, setPublishersPath] = useState('publisherList');
  const [verifyPublisherData, setVerifyPublisherData] = useState([]);
  const [addAdzoneData, setAddAdzoneData] = useState([]);
  const [adZoneListData, setAdZoneListData] = useState([]);
  const [adZoneInfoData, setAdZoneInfoData] = useState([]);

  // useEffect(() => dispatch(idleAddPublisherAction()), [dispatch]);
  // useEffect(() => dispatch(idleVerifyPublisherAction()), [dispatch]);
  useEffect(() => {
    console.log('USE EFFECT VERIFY PUBLISHER');
    if (verifyPublisher.data) {
      setPublishersPath('publisherList');
    }
  }, [verifyPublisher.data]);
  useEffect(() => {
    console.log('USE EFFECT ADD PUBLISHER');
    console.log(addPublisher);
    if (addPublisher.data) {
      setPublishersPath('verifyPublisher');
      setVerifyPublisherData(addPublisher.data);
    }
  }, [addPublisher.data]);

  useEffect(() => {}, [publishers.data]);
  useEffect(() => {
    console.log('USE EFFECT ADD ADZONE');
    if (addAdzone.data) {
      console.log('5555555555555555555');
      console.log(addAdzone);
      setAdZoneInfoData(addAdzone.data)
      setPublishersPath('adZoneInfo');
    }
  }, [addAdzone.data]);

  if (loading) {
    return <div>Loading...</div>;
  }
  const handleClickVerifyPublisher = (publisher) => {
    setPublishersPath('verifyPublisher');
    setVerifyPublisherData(publisher);
  }

  const handleClickChangePathAdZone = (adzone) => {
    setPublishersPath('addAdZone');
    setAddAdzoneData(adzone);
  }

  const handleClickChangePathAdZoneList = (publisher) => {
    setPublishersPath('adZoneList');
    setAdZoneListData(publisher);
  }

  const handleClickChangePathAdInfo = (adzone) => {
    setPublishersPath('adZoneInfo');
    setAdZoneInfoData(adzone);
  }

  return (
    <div className="advertisers">
      {
        publishersPath === 'publisherList' && (
          <>
            <Box
              component={Grid}
              mb={3}
              container
              spacing={3}
            >
              <Grid
                item
                xs={12}
                align="center"
              >
                {user && user.publishers_amount > publishers.data.length
                  ? (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => { setPublishersPath('addPublisher') }}
                    >
                      <AddIcon />
                      {' '}
                      Add Publisher
                    </Button>
                  )
                  : (
                    <BuyPublisherSlotDialog />
                  )}

                <div style={{ position: 'absolute', right: '20px', top: '20px' }}>
                  (
                  {' '}
                  {publishers && publishers.data ? publishers.data.length : '0'}
                  {' '}
                  /
                  {' '}
                  {user && user.publishers_amount}
                  {' '}
                  )
                </div>
              </Grid>
            </Box>
            <Grid container>
              <Grid item xs={12}>
                <PublisherList
                  addAdZone={(adzone) => handleClickChangePathAdZone(adzone)}
                  verifyPublisher={(publisher) => handleClickVerifyPublisher(publisher)}
                  changePathAdzone={(adzone) => handleClickChangePathAdZoneList(adzone)}
                />
              </Grid>
            </Grid>
          </>
        )
      }
      {
        publishersPath === 'addPublisher' && (
          <>
            <Grid container>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => { setPublishersPath('publisherList') }}
                >
                  Back
                </Button>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={12}>
                <AddPublisher
                  addPublisher={addPublisher || []}
                />
              </Grid>
            </Grid>
          </>
        )
      }
      {
        publishersPath === 'verifyPublisher' && (
          <>
            <Grid container>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => { setPublishersPath('publisherList') }}
                >
                  Back
                </Button>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={12}>
                <VerifyPublisher
                  verifyPublisher={verifyPublisherData || []}
                />
              </Grid>
            </Grid>
          </>
        )
      }
      {
        publishersPath === 'addAdZone' && (
          <>
            <Grid container>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => { setPublishersPath('publisherList') }}
                >
                  Back
                </Button>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={12}>
                <AddAdZone
                  addAdzoneData={addAdzoneData || []}
                />
              </Grid>
            </Grid>
          </>
        )
      }
      {
        publishersPath === 'adZoneList' && (
          <>
            <Box
              component={Grid}
              mb={3}
              container
              spacing={3}
            >
              <Grid
                item
                xs={12}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => { setPublishersPath('publisherList') }}
                >
                  Back
                </Button>
              </Grid>
            </Box>
            <Grid container>
              <Grid item xs={12}>
                <AdZoneList
                  adZoneListData={adZoneListData || []}
                  changePathAdInfo={(publisher) => handleClickChangePathAdInfo(publisher)}
                />
              </Grid>
            </Grid>
          </>
        )
      }
      {
        publishersPath === 'adZoneInfo' && (
          <>
            <Box
              component={Grid}
              mb={3}
              container
              spacing={3}
            >
              <Grid
                item
                xs={12}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => { setPublishersPath('publisherList') }}
                >
                  Back
                </Button>
              </Grid>
            </Box>
            <Grid container>
              <Grid item xs={12}>
                <AdZoneInfo
                  adZoneInfoData={adZoneInfoData}
                />
              </Grid>
            </Grid>
          </>
        )
      }
    </div>
  )
}

const mapStateToProps = (state) => ({
  user: state.user.data,
  publishers: state.publishers,
  addPublisher: state.addPublisher,
  verifyPublisher: state.verifyPublisher,
  errorMessage: state.auth.error,
  addAdzone: state.addAdzone,
})

export default connect(mapStateToProps)(withTranslation()(PublishersContainer));
