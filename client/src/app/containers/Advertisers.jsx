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
import { idleVerifyPublisherAction, idleAddPublisherAction } from '../actions/publisher';
import AddBanner from '../components/AddBanner';
import VerifyPublisher from '../components/VerifyPublisher';
import BannerList from '../components/BannerList';
import CreateBannerOrder from '../components/CreateBannerOrder';
import BannerOrderList from '../components/BannerOrderList';
import BannerOrderChart from '../components/BannerOrderChart';
import BuyBannerSlotDialog from '../components/BuyBannerSlotDialog';
import { fetchBannerData } from '../actions/banner';

const AdvertiserContainer = (props) => {
  const {
    t,
    error,
    loading,
    addBanner,
    banners,
    verifyPublisher,
    user,
  } = props;

  const dispatch = useDispatch();
  const [advertisersPath, setadvertisersPath] = useState('bannerList');
  const [verifyPublisherData, setVerifyPublisherData] = useState([]);
  const [createBannerOrderData, setCreateBannerOrderData] = useState([]);
  const [bannerOrderBookData, setBannerOrderBookData] = useState([]);
  useEffect(() => dispatch(fetchBannerData()), [dispatch]);
  // useEffect(() => dispatch(idleAddPublisherAction()), [dispatch]);
  // useEffect(() => dispatch(idleVerifyPublisherAction()), [dispatch]);
  useEffect(() => {
    console.log('USE EFFECT ADD BANNER');
    if (addBanner.data) {
      setadvertisersPath('bannerList');
    }
  }, [addBanner.data]);

  useEffect(() => {
    if (banners.data) {
      banners.data.map((banner) => {
        if (banner.id === bannerOrderBookData.id) {
          setBannerOrderBookData(banner);
        }
        return true;
      })
    }
  }, [banners]);
  useEffect(() => {
  }, [banners.data]);

  useEffect(() => {
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }
  const handleClickVerifyPublisher = (publisher) => {
    setadvertisersPath('verifyPublisher');
    setVerifyPublisherData(publisher);
  }

  const handleClickCreateBannerOrder = (order) => {
    setadvertisersPath('createBannerOrder');
    setCreateBannerOrderData(order);
  }

  const handleClickChangePathBannerOrderList = (banner) => {
    setadvertisersPath('bannerOrderBook');
    setBannerOrderBookData(banner);
  }

  return (
    <div className="advertisers">
      {
        advertisersPath === 'bannerList' && (
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
                {user && user.banners_amount > banners.data.length
                  ? (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => { setadvertisersPath('addBanner') }}
                    >
                      Add Banner
                    </Button>
                  )
                  : (
                    <BuyBannerSlotDialog />
                  )}

                <div style={{ position: 'absolute', right: '20px', top: '20px' }}>
                  (
                  {' '}
                  {banners && banners.data ? banners.data.length : '0'}
                  {' '}
                  /
                  {' '}
                  {user ? user.banners_amount : '0'}
                  {' '}
                  )
                </div>
              </Grid>
            </Box>
            <Grid container>
              <Grid item xs={12}>
                <BannerList
                  verifyPublisher={(publisher) => handleClickVerifyPublisher(publisher)}
                  createBannerOrder={(order) => handleClickCreateBannerOrder(order)}
                  changePathBannerOrderList={(banner) => handleClickChangePathBannerOrderList(banner)}
                />
              </Grid>
              <Grid item xs={12}>
                <BannerOrderChart />
              </Grid>
            </Grid>
          </>
        )
      }
      {
        advertisersPath === 'addBanner' && (
          <>
            <Grid container>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => { setadvertisersPath('bannerList') }}
                >
                  Back
                </Button>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={12}>
                <AddBanner
                  addBanner={addBanner || []}
                />
              </Grid>
            </Grid>
          </>
        )
      }
      {
        advertisersPath === 'verifyBanner' && (
          <>
            <Grid container>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => { setadvertisersPath('bannerList') }}
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
        advertisersPath === 'createBannerOrder' && (
          <>
            <Grid container>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => { setadvertisersPath('bannerList') }}
                >
                  Back
                </Button>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={12}>
                <CreateBannerOrder
                  setadvertisersPath={(path) => setadvertisersPath(path)}
                  banner={createBannerOrderData}
                />
              </Grid>
            </Grid>
          </>
        )
      }
      {
        advertisersPath === 'bannerOrderBook' && (
          <>
            <Grid container>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => { setadvertisersPath('bannerList') }}
                >
                  Back
                </Button>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={12}>
                <BannerOrderList
                  bannerOrderBookData={bannerOrderBookData}
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
  addBanner: state.addBanner,
  banners: state.banners,
  verifyPublisher: state.verifyPublisher,
  errorMessage: state.auth.error,
})

export default connect(mapStateToProps)(withTranslation()(AdvertiserContainer));
