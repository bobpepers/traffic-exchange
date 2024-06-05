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
import { fetchBannerData } from '../actions/banner';

const useStyles = makeStyles({
  list: {
    margin: 'auto',
  },
});

const AdZoneList = (props) => {
  const {
    banners,
    createBannerOrder,
    changePathBannerOrderList,
    adZoneListData,
    changePathAdInfo,
  } = props;
  const classes = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {}, [banners.data]);
  useEffect(() => dispatch(fetchBannerData()), [dispatch]);
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
      <Grid xs={12}>
        <h2 className="text-center">
          {adZoneListData.domain.domain}
          {' '}
          #
          {adZoneListData.id}
        </h2>
      </Grid>
      {adZoneListData ? adZoneListData.adzone.map((adzone) => (
        <Box
          key={adzone.id}
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
              #
              {adzone.id}
            </h3>
            <Grid container spacing={0}>
              <Grid item xs={12} align="center">
                <p>Size</p>
                <p>{adzone.size}</p>
              </Grid>
              <Grid item xs={6} align="center">
                <p>Unique Impressions</p>
                <p>{adzone.impressions}</p>
              </Grid>
              <Grid item xs={6} align="center">
                <p>Total Earned</p>
                <p>{adzone.earned / 1e8}</p>
              </Grid>
              <Grid item xs={12} align="center">
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={() => changePathAdInfo(adzone)}
                >
                  Info
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>

      )) : (
        <p>No Banenrs Found</p>
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

export default connect(mapStateToProps, null)(AdZoneList);
