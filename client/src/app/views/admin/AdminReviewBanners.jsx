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
import {
  fetchAdminReviewBannersData,
  rejectReviewBanner,
  acceptReviewBanner,
} from '../../actions/admin';
// import { rejectWithdrawal, acceptWithdrawal } from '../../actions/adminWithdraw';

const AdminReviewBanners = (props) => {
  const {
    adminReviewBanners,
  } = props;
  const dispatch = useDispatch();
  useEffect(() => dispatch(fetchAdminReviewBannersData()), [dispatch]);
  useEffect(() => {
    console.log('adminReviewBanners');
    console.log(adminReviewBanners);
  }, [adminReviewBanners]);

  const accept = (id) => {
    dispatch(acceptReviewBanner(id));
  }

  const reject = (id) => {
    dispatch(rejectReviewBanner(id))
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
              <TableCell align="right">user</TableCell>
              <TableCell align="right">domain</TableCell>
              <TableCell align="right">url</TableCell>
              <TableCell align="right">impressions</TableCell>
              <TableCell align="right">spend</TableCell>
              <TableCell align="right">banner</TableCell>
              <TableCell align="right">action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {adminReviewBanners
            && adminReviewBanners.data
            && adminReviewBanners.data.map((banner, i) => {
              console.log(banner);
              return (
                <TableRow key={i}>
                  <TableCell component="th" scope="row">
                    {banner.id}
                  </TableCell>
                  <TableCell align="right">
                    {banner.user.username}
                  </TableCell>
                  <TableCell align="right">
                    {banner.domain.domain}
                  </TableCell>
                  <TableCell align="right">
                    {banner.protocol}
                    //
                    {banner.subdomain && banner.subdomain !== 'www' ? `${banner.subdomain}.` : ''}
                    {banner.domain.domain}
                    {banner.path && banner.path}
                    {banner.search && banner.search}
                  </TableCell>
                  <TableCell align="right">
                    {banner.impressions}
                  </TableCell>
                  <TableCell align="right">...</TableCell>
                  <TableCell align="right">
                    <img src={`/uploads/banners/${banner.banner_path}`} alt="banner" />
                  </TableCell>
                  <TableCell align="right">
                    {banner.review === 'pending' && (
                    <>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => reject(banner.id)}
                      >
                        Reject
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => accept(banner.id)}
                      >
                        Accept
                      </Button>
                    </>
                    )}
                    {banner.review === 'rejected' && (
                    <p>Rejected</p>
                    )}
                    {banner.review === 'accepted' && (
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
  console.log(state.adminReviewBanners)
  return {
    adminReviewBanners: state.adminReviewBanners,
  };
}

export default connect(mapStateToProps, null)(AdminReviewBanners);
