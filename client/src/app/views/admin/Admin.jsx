import React, { useEffect, useState } from 'react';
import {
  Drawer,
  List,
  CssBaseline,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';

import { connect, useDispatch } from 'react-redux';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import LiveTvIcon from '@material-ui/icons/LiveTv';
import CastIcon from '@material-ui/icons/Cast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullhorn } from '@fortawesome/free-solid-svg-icons';

import { fetchUserData } from '../../actions/user';
import * as actions from '../../actions/auth';
import AdminUserList from './AdminUserList';
import AdminWithdrawals from './AdminWithdrawals';
import AdminBanners from './AdminBanners';
import AdminPublishers from './AdminPublishers';
import AdminReviewBanners from './AdminReviewBanners';
import AdminReviewPublishers from './AdminReviewPublishers';
import AdminUser from './AdminUser';
import AdminDomains from './AdminDomains';

// import * as actions from '../actions/user';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    margin: 0,
  },
  menuButton: {
    float: 'right',
  },
  hide: {
    display: 'none',
  },
  drawer: {
    marginTop: '50px',
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    marginTop: '50px',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    marginTop: '50px',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    // padding: theme.spacing(3),
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

const Admin = (props) => {
  const {
    user,
  } = props;
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const [openSubMenuWallet, setOpenSubMenuWallet] = useState(true);
  const [selectedUser, setSelectedUser] = useState(false);

  const [dashboardPath, setDashboardPath] = useState('users');

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleMenuClick = (e) => {
    setDashboardPath(e);
  }
  useEffect(() => {}, [dashboardPath]);

  const dispatch = useDispatch();
  useEffect(() => dispatch(fetchUserData()), [dispatch]);
  useEffect(() => {
    console.log('props user');
    console.log(props.user);
  }, [props.user]);
  useEffect(() => {
    document.title = 'RunesX - Admin Dashboard';
  }, []);

  return (
    <div className={`${classes.root} content dashboardContainer index600 height100`}>
      <CssBaseline />
      <Drawer
        variant="permanent"
        className={`sidebar ${clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}`}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <Divider />
        <List>
          <IconButton
            color="inherit"
            aria-label="close drawer"
            onClick={handleDrawerClose}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: !open,
            })}
          >
            <ChevronLeftIcon />
          </IconButton>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <ChevronRightIcon />
          </IconButton>
        </List>
        <List>
          <ListItem
            button
            key="users"
            className={dashboardPath === 'users' && 'sideMenuActive'}
            onClick={() => handleMenuClick('users')}
          >
            <ListItemIcon>
              <LiveTvIcon />
            </ListItemIcon>
            <ListItemText primary="Users" />
          </ListItem>
          <ListItem
            button
            key="withdrawals"
            className={dashboardPath === 'withdrawals' && 'sideMenuActive'}
            onClick={() => handleMenuClick('withdrawals')}
          >
            <ListItemIcon>
              <CastIcon />
            </ListItemIcon>
            <ListItemText primary="Withdrawals" />
          </ListItem>
          <ListItem
            button
            key="publishers"
            className={dashboardPath === 'publishers' && 'sideMenuActive'}
            onClick={() => handleMenuClick('publishers')}
          >
            <ListItemIcon>
              <LiveTvIcon />
            </ListItemIcon>
            <ListItemText primary="Publishers" />
          </ListItem>
          <ListItem
            button
            key="banners"
            className={dashboardPath === 'banners' && 'sideMenuActive'}
            onClick={() => handleMenuClick('banners')}
          >
            <ListItemIcon>
              <LiveTvIcon />
            </ListItemIcon>
            <ListItemText primary="Banners" />
          </ListItem>

          <ListItem
            button
            key="reviewPublishers"
            className={dashboardPath === 'reviewPublishers' && 'sideMenuActive'}
            onClick={() => handleMenuClick('reviewPublishers')}
          >
            <ListItemIcon>
              <FontAwesomeIcon icon={faBullhorn} />
            </ListItemIcon>
            <ListItemText primary="Review Publishers" />
          </ListItem>
          <ListItem
            button
            key="reviewBanners"
            className={dashboardPath === 'reviewBanners' && 'sideMenuActive'}
            onClick={() => handleMenuClick('reviewBanners')}
          >
            <ListItemIcon>
              <ShowChartIcon />
            </ListItemIcon>
            <ListItemText primary="Review Banners" />
          </ListItem>
          <ListItem
            button
            key="domains"
            className={dashboardPath === 'domains' && 'sideMenuActive'}
            onClick={() => handleMenuClick('domains')}
          >
            <ListItemIcon>
              <ShowChartIcon />
            </ListItemIcon>
            <ListItemText primary="Domains" />
          </ListItem>
        </List>
        <Divider />
      </Drawer>

      <div className={`${classes.content} w-100`}>
        {
          dashboardPath === 'users' && (
          <AdminUserList
            setUser={(id) => { setSelectedUser(id) }}
            setPath={(path) => { setDashboardPath(path) }}
          />
          )
        }
        {
          dashboardPath === 'user' && (
          <AdminUser
            selectedUser={selectedUser}
          />
          )
        }
        {
          dashboardPath === 'withdrawals' && (
          <AdminWithdrawals />
          )
        }
        {
          dashboardPath === 'publishers' && (
          <AdminPublishers />
          )
        }
        {
          dashboardPath === 'banners' && (
          <AdminBanners />
          )
        }
        {
          dashboardPath === 'reviewPublishers' && (
            <AdminReviewPublishers />
          )
        }
        {
          dashboardPath === 'reviewBanners' && (
            <AdminReviewBanners />
          )
        }
        {
          dashboardPath === 'domains' && (
            <AdminDomains />
          )
        }

      </div>
    </div>
  )
}

function mapStateToProps(state) {
  return {
    user: state.user.data,
    errorMessage: state.auth.error,
    // users: state.user.list,
  };
}

export default connect(mapStateToProps, actions)(Admin);
