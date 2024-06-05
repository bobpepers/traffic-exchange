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
  fetchAdminDomains,
  banAdminDomain,
} from '../../actions/admin';
// import { rejectWithdrawal, acceptWithdrawal } from '../../actions/adminWithdraw';

const AdminDomains = (props) => {
  const {
    adminDomains,
  } = props;
  const dispatch = useDispatch();
  useEffect(() => dispatch(fetchAdminDomains()), [dispatch]);
  useEffect(() => {
    console.log('adminDomains');
    console.log(adminDomains);
  }, [adminDomains]);

  const ban = (id) => {
    dispatch(banAdminDomain(id));
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
              <TableCell align="right">views</TableCell>
              <TableCell align="right">banned</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {adminDomains
            && adminDomains.data
            && adminDomains.data.map((domain, i) => {
              console.log(domain);
              return (
                <TableRow key={i}>
                  <TableCell component="th" scope="row">
                    {domain.id}
                  </TableCell>
                  <TableCell align="right">{domain.domain}</TableCell>
                  <TableCell align="right">{domain.views}</TableCell>
                  <TableCell align="right">
                    {domain.banned
                      ? (
                        <Button
                          variant="contained"
                          color="primary"
                          size="large"
                          onClick={() => ban(domain.id)}
                        >
                          Unban
                        </Button>
                      )
                      : (
                        <Button
                          variant="contained"
                          color="primary"
                          size="large"
                          onClick={() => ban(domain.id)}
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
  console.log(state.adminDomains)
  return {
    adminDomains: state.adminDomains,
  };
}

export default connect(mapStateToProps, null)(AdminDomains);
