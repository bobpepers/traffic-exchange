import React, { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
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
  fetchAdminUserListData,
  banAdminUser,
} from '../../actions/admin';
import { rejectWithdrawal, acceptWithdrawal } from '../../actions/adminWithdraw';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const adminUserList = (props) => {
  const {
    adminUserList,
    setUser,
    setPath,
  } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  useEffect(() => dispatch(fetchAdminUserListData()), [dispatch]);
  useEffect(() => {}, [adminUserList]);

  const clickUserInfo = (id) => {
    setUser(id);
    setPath('user');
  }

  const ban = (id) => {
    dispatch(banAdminUser(id));
  }

  return (
    <div className="transactions">
      <TableContainer>
        <Table className={classes.table} size="small" aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>id</TableCell>
              <TableCell align="right">username</TableCell>
              <TableCell align="right">available</TableCell>
              <TableCell align="right">locked</TableCell>
              <TableCell align="right">total</TableCell>
              <TableCell align="right">banned</TableCell>
              <TableCell align="right">action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {adminUserList
            && adminUserList.data
            && adminUserList.data.map((user, i) => {
              console.log(user);
              return (
                <TableRow key={i}>
                  <TableCell component="th" scope="row">
                    {user.id}
                  </TableCell>
                  <TableCell align="right">{user.username}</TableCell>
                  <TableCell align="right">{user.wallet.available / 1e8}</TableCell>
                  <TableCell align="right">{user.wallet.locked / 1e8}</TableCell>
                  <TableCell align="right">{(user.wallet.available / 1e8) + (user.wallet.locked / 1e8)}</TableCell>
                  <TableCell align="right">
                    {user.banned
                      ? (
                        <Button
                          variant="contained"
                          color="primary"
                          size="large"
                          onClick={() => ban(user.id)}
                        >
                          Unban
                        </Button>
                      )
                      : (
                        <Button
                          variant="contained"
                          color="primary"
                          size="large"
                          onClick={() => ban(user.id)}
                        >
                          Ban
                        </Button>
                      )}
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      onClick={() => clickUserInfo(user.id)}
                    >
                      Info
                    </Button>
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
  console.log(state.adminUserList)
  return {
    adminUserList: state.adminUserList,
    user: state.user,
    errorMessage: state.auth.error,
  };
}

const mapDispatchToProps = (dispatch) => ({
  rejectWithdrawal: (x) => dispatch(rejectWithdrawal(x)),
  acceptWithdrawal: (x) => dispatch(acceptWithdrawal(x)),
});

export default connect(mapStateToProps, mapDispatchToProps)(adminUserList);
