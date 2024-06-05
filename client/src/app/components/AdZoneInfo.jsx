import React, { useState } from 'react';
import {
  Button,
  Paper,
  Box,
  Modal,
  Backdrop,
  Fade,
  Grid,
  Tooltip,
} from '@material-ui/core';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import CloseIcon from '@material-ui/icons/Close';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import DeleteIcon from '@material-ui/icons/Delete';
import * as actions from '../actions';
import RemoveWebslotOrderDialog from './RemoveWebslotOrderDialog';

const AdZoneInfo = (props) => {
  const {
    errorMessage,
    addWebslot,
    orders,
    verifyPublisher,
    verifyPublisherAction,
    adZoneInfoData,
  } = props;

  return (
    <>
      <Grid
        container
        justify="center"
      >
        <Box
          component={Grid}
          mt={3}
          item
          xs={6}
          className="borderPublisherList publisherListContainer"
        >
          <h3 className="text-center">
            AdZone Info #
            {adZoneInfoData.id}
          </h3>
          <p className="text-center">
            size:
            {' '}
            {adZoneInfoData.size}
          </p>
          <p className="text-center">Add following div to &lt;body&gt; on your website</p>
          <p className="text-center">
            &lt;div id="runesx-
            {adZoneInfoData.id}
            "&gt;&lt;/div&gt;
          </p>
          <p>
            example:
          </p>
          <Paper>
            &lt;body&gt;
            <br />
            ...
            <br />
            <br />
            &emsp;&lt;div id="runesx-
            {adZoneInfoData.id}
            "&gt;&lt;/div&gt;
            <br />
            <br />
            ...
            <br />
            &lt;/body&gt;
          </Paper>
        </Box>
      </Grid>
    </>
  );
}

function mapStateToProps(state) {
  return {
    publishers: state.publishers,
    errorMessage: state.auth.error,
  }
}

export default connect(mapStateToProps, actions)(AdZoneInfo);
