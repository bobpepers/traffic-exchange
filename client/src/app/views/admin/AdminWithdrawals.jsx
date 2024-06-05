import React, { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
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
import { fetchAdminWithdrawalData } from '../../actions/admin';
import { fetchUserData } from '../../actions/user';
import { rejectWithdrawal, acceptWithdrawal } from '../../actions/adminWithdraw';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const AdminWithdrawals = (props) => {
  const {
    adminWithdrawals,
  } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  useEffect(() => dispatch(fetchAdminWithdrawalData()), [dispatch]);
  useEffect(() => {}, [adminWithdrawals]);

  const reject = (obj) => {
    console.log(`reject ${obj}`)
    props.rejectWithdrawal({ id: obj });
  };

  const accept = (obj) => {
    props.acceptWithdrawal({ id: obj });
  };

  return (
    <div className="w-100 transactions">
      <TableContainer>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>id</TableCell>
              <TableCell align="right">txid</TableCell>
              <TableCell align="right">amount</TableCell>
              <TableCell align="right">phase</TableCell>
              <TableCell align="right">to</TableCell>
              <TableCell align="right">user</TableCell>
              <TableCell align="right">action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {adminWithdrawals
            && adminWithdrawals.data
            && adminWithdrawals.data.map((withdraw, i) => {
              console.log(withdraw);
              return (
                <TableRow key={i}>
                  <TableCell component="th" scope="row">
                    {withdraw.id}
                  </TableCell>
                  <TableCell align="right">{withdraw.txid}</TableCell>
                  <TableCell align="right">{withdraw.amount / 1e8}</TableCell>
                  <TableCell align="right">{withdraw.phase}</TableCell>
                  <TableCell align="right">{withdraw.to_from}</TableCell>
                  <TableCell align="right">{withdraw.address.wallet.user.username}</TableCell>
                  <TableCell align="right">
                    {
                      withdraw.phase === 'review' && (
                        <>
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => reject(withdraw.id)}
                          >
                            Reject
                          </Button>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => accept(withdraw.id)}
                          >
                            Accept
                          </Button>
                        </>
                      )
                    }
                    {
                      withdraw.phase === 'confirming' && (
                        <p style={{ color: 'green' }}>Accepted</p>
                      )
                    }
                    {
                      withdraw.phase === 'confirmed' && (
                        <p style={{ color: 'green' }}>Accepted</p>
                      )
                    }
                    {
                      withdraw.phase === 'rejected' && (
                        <p style={{ color: 'red' }}>Rejected</p>
                      )
                    }
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
  console.log('......;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;adminWithdrawals mapStateToProps');
  console.log(state.adminWithdrawals);
  return {
    adminWithdrawals: state.adminWithdrawals,
    user: state.user,
    errorMessage: state.auth.error,
  };
}

const mapDispatchToProps = (dispatch) => ({
  rejectWithdrawal: (x) => dispatch(rejectWithdrawal(x)),
  acceptWithdrawal: (x) => dispatch(acceptWithdrawal(x)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminWithdrawals);
