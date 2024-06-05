import React, { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
// import { Link } from 'react-router-dom';
import {
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
  fetchAdminReviewPublishersData,
  acceptReviewPublisher,
  rejectReviewPublisher,
} from '../../actions/admin';
// import { rejectWithdrawal, acceptWithdrawal } from '../../actions/adminWithdraw';

const AdminReviewPublishers = (props) => {
  const {
    adminReviewPublishers,
  } = props;
  const dispatch = useDispatch();
  useEffect(() => dispatch(fetchAdminReviewPublishersData()), [dispatch]);
  useEffect(() => {
    console.log('adminReviewPublishers');
    console.log(adminReviewPublishers);
  }, [adminReviewPublishers]);

  const accept = (id) => {
    dispatch(acceptReviewPublisher(id));
  }

  const reject = (id) => {
    dispatch(rejectReviewPublisher(id))
  }

  return (
    <div className="content index600 height100 w-100 transactions transaction">
      <TableContainer>
        <Table
          size="small"
          aria-label="simple table"
        >
          <TableHead>
            <TableRow>
              <TableCell>id</TableCell>
              <TableCell align="right">domain</TableCell>
              <TableCell align="right">impressions</TableCell>
              <TableCell align="right">earned</TableCell>
              <TableCell align="right">banned</TableCell>
              <TableCell align="right">action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {adminReviewPublishers
            && adminReviewPublishers.data
            && adminReviewPublishers.data.map((publisher, i) => {
              console.log(publisher);
              return (
                <TableRow key={i}>
                  <TableCell component="th" scope="row">
                    {publisher.id}
                  </TableCell>
                  <TableCell align="right">
                    {publisher.subdomain && publisher.subdomain !== 'www' ? `${publisher.subdomain}.` : ''}
                    {publisher.domain.domain}
                  </TableCell>
                  <TableCell align="right">{publisher.impressions}</TableCell>
                  <TableCell align="right">...</TableCell>
                  <TableCell align="right">{publisher.banned}</TableCell>
                  <TableCell align="right">
                    {publisher.review === 'pending' && (
                    <>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => reject(publisher.id)}
                      >
                        Reject
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => accept(publisher.id)}
                      >
                        Accept
                      </Button>
                    </>
                    )}
                    {publisher.review === 'rejected' && (
                    <p>Rejected</p>
                    )}
                    {publisher.review === 'accepted' && (
                    <p>Accepted</p>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

function mapStateToProps(state) {
  console.log(state.adminReviewPublishers)
  return {
    adminReviewPublishers: state.adminReviewPublishers,
  };
}

export default connect(mapStateToProps, null)(AdminReviewPublishers);
