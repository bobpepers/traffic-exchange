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
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
  fetchAdminPublishersData,
  banAdminPublisher,
} from '../../actions/admin';
// import { rejectWithdrawal, acceptWithdrawal } from '../../actions/adminWithdraw';

const AdminPublishers = (props) => {
  const {
    adminPublishers,
  } = props;
  const dispatch = useDispatch();
  useEffect(() => dispatch(fetchAdminPublishersData()), [dispatch]);
  useEffect(() => {
    console.log('adminPublishers');
    console.log(adminPublishers);
  }, [adminPublishers]);

  const ban = (id) => {
    dispatch(banAdminPublisher(id));
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
              <TableCell align="right">verified</TableCell>
              <TableCell align="right">review</TableCell>
              <TableCell align="right">banned</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {adminPublishers
            && adminPublishers.data
            && adminPublishers.data.map((publisher, i) => {
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
                  <TableCell align="right">{publisher.verified ? 'verified' : 'unverified'}</TableCell>
                  <TableCell align="right">{publisher.review}</TableCell>
                  <TableCell align="right">
                    {publisher.banned
                      ? (
                        <Button
                          variant="contained"
                          color="primary"
                          size="large"
                          onClick={() => ban(publisher.id)}
                        >
                          Unban
                        </Button>
                      )
                      : (
                        <Button
                          variant="contained"
                          color="primary"
                          size="large"
                          onClick={() => ban(publisher.id)}
                        >
                          Ban
                        </Button>
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
  console.log(state.adminPublishers)
  return {
    adminPublishers: state.adminPublishers,
  };
}

export default connect(mapStateToProps, null)(AdminPublishers);
