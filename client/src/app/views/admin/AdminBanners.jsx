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
  fetchAdminBannersData,
  banAdminBanner,
} from '../../actions/admin';
// import { rejectWithdrawal, acceptWithdrawal } from '../../actions/adminWithdraw';

const AdminBanners = (props) => {
  const {
    adminBanners,
  } = props;
  const dispatch = useDispatch();
  useEffect(() => dispatch(fetchAdminBannersData()), [dispatch]);
  useEffect(() => {
    console.log('adminBanners');
    console.log(adminBanners);
  }, [adminBanners]);

  const ban = (id) => {
    dispatch(banAdminBanner(id));
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
              <TableCell align="right">url</TableCell>
              <TableCell align="right">impressions</TableCell>
              <TableCell align="right">earned</TableCell>
              <TableCell align="right">review</TableCell>
              <TableCell align="right">banned</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {adminBanners
            && adminBanners.data
            && adminBanners.data.map((banner, i) => {
              console.log(banner);
              return (
                <TableRow key={i}>
                  <TableCell component="th" scope="row">
                    {banner.id}
                  </TableCell>
                  <TableCell align="right">{banner.domain.domain}</TableCell>
                  <TableCell align="right">
                    {banner.protocol}
                    //
                    {banner.subdomain && banner.subdomain !== 'wwww' ? `${banner.subdomain}.` : ''}
                    {banner.domain.domain}
                    {banner.path && banner.path}
                    {banner.search && banner.search}

                  </TableCell>
                  <TableCell align="right">{banner.impressions}</TableCell>
                  <TableCell align="right">...</TableCell>
                  <TableCell align="right">{banner.review}</TableCell>
                  <TableCell align="right">
                    {banner.banned
                      ? (
                        <Button
                          variant="contained"
                          color="primary"
                          size="large"
                          onClick={() => ban(banner.id)}
                        >
                          Unban
                        </Button>
                      )
                      : (
                        <Button
                          variant="contained"
                          color="primary"
                          size="large"
                          onClick={() => ban(banner.id)}
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
  console.log(state.adminBanners)
  return {
    adminBanners: state.adminBanners,
  };
}

export default connect(mapStateToProps, null)(AdminBanners);
