import React, {
  useEffect,
  useState,
} from 'react';
import PropTypes from 'prop-types';

import {
  Drawer,
  List,
  CssBaseline,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
} from '@material-ui/core';

import { connect, useDispatch } from 'react-redux';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

// import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import LiveTvIcon from '@material-ui/icons/LiveTv';
import PersonIcon from '@material-ui/icons/Person';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ReplyAllIcon from '@material-ui/icons/ReplyAll';
import SettingsIcon from '@material-ui/icons/Settings';
import DateRangeIcon from '@material-ui/icons/DateRange';
import CastIcon from '@material-ui/icons/Cast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBullhorn } from '@fortawesome/free-solid-svg-icons';
// import Construction from '../assets/images/construction.svg'

import StatisticContainer from '../containers/Statistic';
import WebSlotsContainer from '../containers/Webslots';
import WalletContainer from '../containers/Wallet';
import ProfileContainer from '../containers/Profile';
import { fetchUserData } from '../actions/user';
import * as actions from '../actions/auth';
import Deposit from '../components/Deposit';
import Withdraw from '../components/Withdraw';

import Settings from '../containers/Settings';

import MyActivityContainer from '../containers/MyActivity';
import AdvertisersContainer from '../containers/Advertisers';
import PublishersContainer from '../containers/Publishers';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
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
    padding: theme.spacing(3),
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

const Dashboard = (props) => {
  const {
    user,
  } = props;
  document.title = 'RunesX - Dashboard';
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const [openSubMenuWallet, setOpenSubMenuWallet] = useState(true);

  const [dashboardPath, setDashboardPath] = useState('wallet');

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleMenuClick = (e) => {
    if (e === 'wallet') {
      setOpenSubMenuWallet(true)
    }
    if (e !== 'wallet' && e !== 'deposit' && e !== 'withdraw') {
      setOpenSubMenuWallet(false)
    }
    if (e === 'wallet' && openSubMenuWallet === true && e !== 'deposit' && e !== 'withdraw' && dashboardPath !== 'deposit' && dashboardPath !== 'withdraw') {
      setOpenSubMenuWallet(false)
    }

    setDashboardPath(e);
  }
  useEffect(() => {}, [dashboardPath]);

  const dispatch = useDispatch();
  useEffect(() => dispatch(fetchUserData()), [dispatch]);
  useEffect(() => {
    console.log('props user');
    console.log(props.user);
  }, [user]);
  useEffect(() => {
    document.title = 'RunesX - Dashboard';
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
            key="wallet"
            value="wallet"
            className={`${dashboardPath === 'wallet' && 'sideMenuActive'} ${dashboardPath === 'deposit' && 'sideSubMenuActive'} ${dashboardPath === 'withdraw' && 'sideSubMenuActive'}`}
            onClick={() => handleMenuClick('wallet')}
          >
            <ListItemIcon>
              <AccountBalanceWalletIcon />
            </ListItemIcon>
            <ListItemText primary="Wallet" />
            {openSubMenuWallet ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={openSubMenuWallet} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem
                button
                className={`${classes.nested} ${dashboardPath === 'deposit' && 'sideMenuActive'}`}
                onClick={() => handleMenuClick('deposit')}
              >
                <ListItemIcon>
                  <ReplyAllIcon className="mirrorIcon" />
                </ListItemIcon>
                <ListItemText primary="Deposit" />
              </ListItem>
              <ListItem
                button
                className={`${classes.nested} ${dashboardPath === 'withdraw' && 'sideMenuActive'}`}
                onClick={() => handleMenuClick('withdraw')}
              >
                <ListItemIcon>
                  <ReplyAllIcon />
                </ListItemIcon>
                <ListItemText primary="Withdraw" />
              </ListItem>
            </List>
          </Collapse>
          <ListItem
            button
            key="surfSlots"
            className={dashboardPath === 'surfSlots' && 'sideMenuActive'}
            onClick={() => handleMenuClick('surfSlots')}
          >
            <ListItemIcon>
              <LiveTvIcon />
            </ListItemIcon>
            <ListItemText primary="Surf Slots" />
          </ListItem>
          <ListItem
            button
            key="publishers"
            className={dashboardPath === 'publishers' && 'sideMenuActive'}
            onClick={() => handleMenuClick('publishers')}
          >
            <ListItemIcon>
              <CastIcon />
            </ListItemIcon>
            <ListItemText primary="Publishers" />
          </ListItem>
          <ListItem
            button
            key="advertisers"
            className={dashboardPath === 'advertisers' && 'sideMenuActive'}
            onClick={() => handleMenuClick('advertisers')}
          >
            <ListItemIcon>
              <FontAwesomeIcon icon={faBullhorn} />
            </ListItemIcon>
            <ListItemText primary="Advertisers" />
            {/* <img width="35" src="/uploads/construction.svg" /> */}
          </ListItem>
          <ListItem
            button
            key="statistic"
            className={dashboardPath === 'statistic' && 'sideMenuActive'}
            onClick={() => handleMenuClick('statistic')}
          >
            <ListItemIcon>
              <ShowChartIcon />
            </ListItemIcon>
            <ListItemText primary="Statistic" />
          </ListItem>
          <ListItem
            button
            key="myActivity"
            className={dashboardPath === 'myActivity' && 'sideMenuActive'}
            onClick={() => handleMenuClick('myActivity')}
          >
            <ListItemIcon>
              <DateRangeIcon />
            </ListItemIcon>
            <ListItemText primary="My Activity" />
          </ListItem>
          <ListItem
            button
            key="profile"
            className={dashboardPath === 'profile' && 'sideMenuActive'}
            onClick={() => handleMenuClick('profile')}
          >
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItem>
          <ListItem
            button
            key="settings"
            className={dashboardPath === 'settings' && 'sideMenuActive'}
            onClick={() => handleMenuClick('settings')}
          >
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItem>
        </List>
        <Divider />
      </Drawer>

      <div className={classes.content}>
        {
          dashboardPath === 'wallet' && (
          <WalletContainer
            wallet={user && user.wallet ? user.wallet : {}}
            addresses={user && user.wallet ? user.wallet.addresses : []}
          />
          )
        }
        {
          dashboardPath === 'deposit' && (
            <Deposit
              addresses={user && user.wallet ? user.wallet.addresses : []}
            />
          )
        }
        {
          dashboardPath === 'withdraw' && (
            <Withdraw
              wallet={user && user.wallet ? user.wallet : {}}
            />
          )
        }
        {
          dashboardPath === 'statistic' && (
            <StatisticContainer
              wallet={user && user.wallet ? user.wallet : {}}
            />
          )
        }
        {
          dashboardPath === 'surfSlots' && (
            <div>
              <WebSlotsContainer
                user={user || []}
                webslots={user ? user.webslots : []}
              />
            </div>
          )
        }
        {
          dashboardPath === 'profile' && (
            <>
              <ProfileContainer
                user={user || []}
              />
            </>
          )
        }
        {
          dashboardPath === 'settings' && (
            <>
              <Settings />
            </>
          )
        }
        {
          dashboardPath === 'myActivity' && (
            <>
              <MyActivityContainer
                wallet={user && user.wallet ? user.wallet : {}}
              />
            </>
          )
        }
        {
          dashboardPath === 'publishers' && (
            <>
              <PublishersContainer />
            </>
          )
        }
        {
          dashboardPath === 'advertisers' && (
            <>
              <AdvertisersContainer />
            </>
          )
        }

      </div>
    </div>
  )
}

Dashboard.propTypes = {
  user: PropTypes.shape({
    wallet: PropTypes.arrayOf.isRequired,
    webslots: PropTypes.arrayOf.isRequired,
  }).isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user.data,
})

export default connect(mapStateToProps, actions)(Dashboard);
