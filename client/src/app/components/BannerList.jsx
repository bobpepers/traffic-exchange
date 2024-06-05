import React, { useState, useEffect } from 'react';
import {
  Button,
  Modal,
  Backdrop,
  Fade,
  Grid,
  Tooltip,
  CircularProgress,
  Box,
} from '@material-ui/core';
import {
  connect,
  useDispatch,
} from 'react-redux';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import PropTypes from 'prop-types';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import WarningIcon from '@material-ui/icons/Warning';
import GavelIcon from '@material-ui/icons/Gavel';
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';

const useStyles = makeStyles({
  list: {
    margin: 'auto',
  },
});

const BannerList = (props) => {
  const {
    banners,
    createBannerOrder,
    changePathBannerOrderList,
  } = props;
  const classes = useStyles();
  const dispatch = useDispatch();

  // useEffect(() => {}, [banners.data]);

  useEffect(() => {
    console.log(banners.data);
    console.log('publishers log');
  }, [banners]);

  if (banners.isFetching) {
    return (
      <Grid container alignItems="center">
        <Grid item xs={12} align="center">
          <CircularProgress disableShrink />
        </Grid>
      </Grid>
    )
  }

  return (
    <Grid container>
      {banners.data ? banners.data.map((banner) => (
        <Box
          key={banner.id}
          component={Grid}
          item
          xs={5}
          className={`${classes.list}`}
        >
          <Box
            component={Grid}
            item
            xs={12}
            mb={3}
            className="borderPublisherList publisherListContainer"
          >
            <h3 className="text-center">
              {banner.domain.domain}
              {' '}
              #
              {banner.id}
            </h3>
            <p className="text-center">
              {banner.protocol}
              //
              {banner.subdomain && `${banner.subdomain}.`}
              {banner.domain.domain}
              {banner.path && `${banner.path}`}
              {banner.search && `${banner.search}`}
            </p>
            <Grid container spacing={0}>
              <Grid item xs={12} align="center">
                {banner.review === 'pending' && (
                <div>
                  <p className="text-center" style={{ color: '#ffa500' }}>
                    <HourglassEmptyIcon />
                    {' '}
                    Review Pending
                  </p>

                </div>
                )}
                <img src={`/uploads/banners/${banner.banner_path}`} alt="preview banner" />
                {banner.review === 'rejected' && (
                  <div>
                    <p className="text-center">Rejected</p>
                  </div>
                )}
                {banner.review === 'accepted' && (
                  <div>
                    <Grid container>
                      <Box
                        component={Grid}
                        item
                        xs={6}
                        mb={2}
                      >
                        <p className="text-center">Unqiue impressions</p>
                        <p className="text-center">{banner.impressions}</p>
                      </Box>
                      <Box
                        component={Grid}
                        item
                        xs={6}
                        mb={2}
                      >
                        <p className="text-center">Spend</p>
                        <p className="text-center">{banner.spend / 1e8}</p>
                      </Box>
                      <Box
                        component={Grid}
                        item
                        xs={12}
                        mb={2}
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          fullWidth
                          onClick={() => createBannerOrder(banner)}
                        >
                          <GavelIcon />
                          {' '}
                          Bid
                        </Button>
                      </Box>
                    </Grid>

                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={() => changePathBannerOrderList(banner)}
                    >
                      <LibraryBooksIcon />
                      {' '}
                      Orders (
                      {banner.bannerOrder.length}
                      )
                    </Button>
                  </div>
                )}
              </Grid>
            </Grid>
          </Box>
        </Box>

      )) : (
        <p>No Banners Found</p>
      )}

    </Grid>
  );
}

function mapStateToProps(state) {
  return {
    banners: state.banners,
    errorMessage: state.auth.error,
  }
}

export default connect(mapStateToProps, null)(BannerList);
