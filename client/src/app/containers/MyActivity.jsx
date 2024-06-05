import React, { useEffect, useState } from 'react';
import { Grid } from '@material-ui/core';
import { connect, useDispatch } from 'react-redux';
import { BigNumber } from 'bignumber.js';
import PropTypes from 'prop-types';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import { fetchUserRecentActivity } from '../actions/activity';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'date', numeric: false, disablePadding: true, label: 'Date',
  },
  {
    id: 'ip', numeric: true, disablePadding: false, label: 'IP Address',
  },
  {
    id: 'type', numeric: true, disablePadding: false, label: 'Operation',
  },
  {
    id: 'amount', numeric: true, disablePadding: false, label: 'Amount (RUNES)',
  },
  {
    id: 'balance', numeric: true, disablePadding: false, label: 'Balance (RUNES)',
  },
];

function EnhancedTableHead(props) {
  const {
    classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow className="blue-border-table">
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
      theme.palette.type === 'light'
        ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
        : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: '1 1 100%',
  },
}));

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

const MyActivity = (props) => {
  const {
    recenUserActivity,
    user,
  } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const [order, setOrder] = React.useState('desc');
  const [orderBy, setOrderBy] = React.useState('date');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [rows, setRows] = React.useState([]);

  useEffect(() => {
    dispatch(fetchUserRecentActivity());
  }, [dispatch]);
  useEffect(() => {
    const tempUserActivity = recenUserActivity.data.reverse().map((userActivity) => {
      console.log(userActivity);
      if (userActivity.spender) {
        if (user.data.username === userActivity.spender.username) {
          return {
            date: userActivity.createdAt,
            type: userActivity.type === 'surfStart' ? `${userActivity.earner.username} started watching your Surf Slot`
              : userActivity.type === 'surfComplete' ? `${userActivity.earner.username} completed watching your Surf Slot`
                : userActivity.type === 'createSurfOrder' ? 'You created a surf order'
                  : userActivity.type === 'cancelSurfOrder' ? 'You cacneled a surf order'
                    : userActivity.type === 'createBannerOrder' ? 'You created a banner order'
                      : userActivity.type === 'cancelBannerOrder' ? 'You canceled a banner order'
                        : userActivity.type,
            ip: userActivity.ip ? userActivity.ip.address : '',
            balance: new BigNumber(userActivity.spender_balance).dividedBy(1e8).toString() || '',
            amount: -Math.abs(new BigNumber(userActivity.amount).dividedBy(1e8).toString()) || '',
          };
        }
      }
      if (userActivity.earner) {
        if (user.data.username === userActivity.earner.username) {
          return {
            date: userActivity.createdAt,
            type: userActivity.type === 'surfStart' ? `You started Watching ${userActivity.spender.username}'s Surf Slot`
              : userActivity.type === 'surfComplete' ? `You completed Watching ${userActivity.spender.username}'s Surf Slot`
                : userActivity.type === 'jackpot' ? 'You won Jackpot'
                  : userActivity.type === 'login' ? 'You logged in'
                    : userActivity.type === 'logout' ? 'You logged out'
                      : userActivity.type,
            ip: userActivity.ip ? userActivity.ip.address : '',
            balance: new BigNumber(userActivity.earner_balance).dividedBy(1e8).toNumber() || '',
            amount: userActivity.type === 'referralBonus' ? new BigNumber(userActivity.amount).dividedBy(1e8).toNumber()
              : userActivity.type === 'faucetClaim' ? new BigNumber(userActivity.amount).dividedBy(1e8).toNumber()
                : new BigNumber(((userActivity.amount) - ((userActivity.amount / 100) * 2))).dividedBy(1e8).toNumber() || '',
          };
        }
      }
      return false;
    });
    setRows(tempUserActivity);
  }, [recenUserActivity]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.date);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  return (
    <Grid container item xs={12}>
      <Grid item xs={12}>
        <h2>Recent</h2>
      </Grid>
      <div className={`${classes.root} transactions`}>
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size="small"
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.name);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.date)}
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.date}
                      selected={isItemSelected}
                      className="blue-border-table"
                    >
                      <TableCell component="th" id={labelId} scope="row" padding="none" className="border-none">
                        {row.date}
                      </TableCell>
                      <TableCell align="right" className="border-none">
                        {row.ip}
                      </TableCell>
                      <TableCell align="right" className="border-none">
                        {row.type}
                      </TableCell>
                      <TableCell align="right" className="border-none">
                        {row.amount}
                      </TableCell>
                      <TableCell align="right" className="border-none">
                        {row.balance}
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
              <TableRow style={{ height: 33 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100, 250]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </div>
    </Grid>
  )
}
function mapStateToProps(state) {
  return {
    user: state.user,
    recenUserActivity: state.recentUserActivity,
  };
}

export default connect(mapStateToProps, null)(MyActivity);
