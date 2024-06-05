import React, { useEffect } from 'react';
import {
  Button,
  Grid,
  Tooltip,
  CircularProgress,
  Box,
} from '@material-ui/core';
import {
  connect,
  useDispatch,
} from 'react-redux';
import PropTypes from 'prop-types';
import CloseIcon from '@material-ui/icons/Close';
import { lighten, makeStyles } from '@material-ui/core/styles';
import WarningIcon from '@material-ui/icons/Warning';
import AddIcon from '@material-ui/icons/Add';
import HourglassEmptyIcon from '@material-ui/icons/HourglassEmpty';
import InfoIcon from '@material-ui/icons/Info';
import BallotIcon from '@material-ui/icons/Ballot';
import { fetchPublisherData } from '../actions/publisher';
import * as actions from '../actions';
import BuyAdZoneslotDialog from './BuyAdZoneslotDialog';

const useStyles = makeStyles({
  list: {
    margin: 'auto',
  },
});

const PublisherList = (props) => {
  const {
    errorMessage,
    addWebslot,
    orders,
    publishers,
    verifyPublisher,
    addAdZone,
    changePathAdzone,
  } = props;
  const classes = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {}, [publishers.data]);
  useEffect(() => dispatch(fetchPublisherData()), [dispatch]);
  useEffect(() => {
    console.log(publishers.data);
    console.log('publishers log');
  }, [publishers]);

  if (publishers.isFetching) {
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
      {publishers.data ? publishers.data.map((publisher) => (
        <Box
          key={publisher.id}
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
              {publisher.subdomain && `${publisher.subdomain}.`}
              {publisher.domain.domain}
            </h3>
            <Grid
              container
              spacing={0}
            >
              <Grid
                item
                xs={12}
                container
              >
                {publisher.verified && publisher.review === 'accepted'
                   && (
                   <>
                     <Grid item xs={6} align="center">
                       <p>Unique Impressions</p>
                       <p>{publisher.impressions}</p>
                     </Grid>
                     <Grid item xs={6} align="center">
                       <p>Total Earned</p>
                       <p>{publisher.earned / 1e8}</p>
                     </Grid>
                     <Box
                       component={Grid}
                       item
                       xs={12}
                       mb={2}
                     >
                       { publisher.adzone.length >= publisher.adzones_amount
                         ? (
                           <BuyAdZoneslotDialog
                             selectedPublisher={publisher}
                           />
                         )
                         : (
                           <Button
                             variant="contained"
                             color="primary"
                             fullWidth
                             onClick={() => addAdZone(publisher)}
                           >
                             <AddIcon />
                             {' '}
                             Add AdZone
                           </Button>
                         )}
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
                         onClick={() => changePathAdzone(publisher)}
                       >
                         <BallotIcon />
                         {' '}
                         AdZones (
                         {publisher.adzone.length}
                         {' '}
                         /
                         {' '}
                         {publisher.adzones_amount}
                         )
                       </Button>
                     </Box>
                     <Box
                       component={Grid}
                       item
                       xs={12}
                     >
                       <Button
                         variant="contained"
                         color="primary"
                         fullWidth
                         onClick={() => verifyPublisher(publisher)}
                       >
                         <InfoIcon />
                         {' '}
                         Info
                       </Button>
                     </Box>
                   </>
                   ) }
                {publisher.verified && publisher.review === 'pending'
                    && (
                      <div>
                        <p className="text-center" style={{ color: '#ffa500' }}>
                          <HourglassEmptyIcon />
                          {' '}
                          Review Pending
                        </p>

                      </div>
                    )}
                {!publisher.verified
                    && (
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={() => verifyPublisher(publisher)}
                    >
                      <WarningIcon />
                      {' '}
                      Verify Publisher
                    </Button>
                    )}
              </Grid>
            </Grid>
          </Box>
        </Box>

      )) : (
        <p>No Publishers Found</p>
      )}

    </Grid>
  );
}

function mapStateToProps(state) {
  return {
    publishers: state.publishers,
    errorMessage: state.auth.error,
  }
}

export default connect(mapStateToProps, actions)(PublisherList);
