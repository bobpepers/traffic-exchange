/* eslint-disable */
import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import auth from './auth';
import resetPassword from './resetPassword';
import user from './user';
import contact from './contact';
import chainInfo from "./chainInfo";
import website from "./website";
import online from "./online";
import registered from "./registered";
import volume from "./volume";
import startSurf from "./startSurf";
import completeSurf from "./completeSurf";
import createOrder from "./createOrder";
import createWithdraw from "./createWithdraw";
import tfa from "./tfa";
import order from "./order";
import removeWebslot from './removeWebslot';
import removeWebslotOrder from './removeWebslotOrder';
import theme from './changeTheme';
import price from './price';
import buyWebslot from './buyWebslot';
import buyBannerslot from './buyBannerslot';
import buyPublisherslot from './buyPublisherslot';

import jackpots from './jackpot';
import createWebslot from "./createWebslot";

import faucetRecord from "./faucetRecord";
import faucetClaim from "./faucetClaim";
import faucetRolls from "./faucetRolls";

import alert from "./alert";
import activity from "./activity";
import recentUserActivity from "./recentUserActivity";
import uploadAvatar from "./uploadAvatar";
import addPublisher from "./addPublisher";
import publishers from './publishers';
import verifyPublisher from './verifyPublisher';
import banners from './banner';
import addBanner from './addBanner';
import createBannerOrder from './createBannerOrder';


import adminWithdrawals from "./admin/adminWithdrawals";
import adminUserList from "./admin/adminUserList";
import adminUser from "./admin/adminUser";
import adminBanners from "./admin/adminBanners";
import adminPublishers from "./admin/adminPublishers";
import adminReviewPublishers from "./admin/adminReviewPublishers";
import adminReviewBanners from "./admin/adminReviewBanners";
import adminDomains from "./admin/adminDomains";
import removeBannerOrder from './removeBannerOrder';
import addAdzone from './addAdZone';
import bannerOrders from './bannerOrders';
import buyAdzoneslot from './buyAdzoneslot';
import createReport from './createReport';

const rootReducer = combineReducers({
  form,
  auth: auth,
  resetPass: resetPassword,
  user: user,
  contact: contact,
  chaininfo: chainInfo,
  website: website,
  online: online,
  registered: registered,
  volume: volume,
  startSurf: startSurf,
  completeSurf: completeSurf,
  createOrder: createOrder,
  createWithdraw: createWithdraw,
  tfa: tfa,
  order: order,
  removeWebslot: removeWebslot,
  removeWebslotOrder: removeWebslotOrder,
  theme: theme,
  price: price,
  buyWebslot: buyWebslot,
  jackpots: jackpots,
  createWebslot: createWebslot,  
  alert: alert,
  activity: activity,
  faucetRecord: faucetRecord,
  faucetClaim: faucetClaim,
  faucetRolls: faucetRolls,
  recentUserActivity: recentUserActivity,
  uploadAvatar: uploadAvatar,
  addPublisher: addPublisher,
  publishers: publishers,
  verifyPublisher: verifyPublisher,
  banners: banners,
  addBanner: addBanner,
  createBannerOrder: createBannerOrder,
  removeBannerOrder: removeBannerOrder,
  addAdzone: addAdzone,
  bannerOrders: bannerOrders,
  buyBannerslot: buyBannerslot,
  buyPublisherslot: buyPublisherslot,
  buyAdzoneslot: buyAdzoneslot,
  createReport: createReport,

  adminWithdrawals: adminWithdrawals,
  adminUserList: adminUserList,
  adminUser: adminUser,
  adminPublishers: adminPublishers,
  adminBanners: adminBanners,
  adminReviewBanners: adminReviewBanners,
  adminReviewPublishers: adminReviewPublishers,
  adminDomains: adminDomains,  
  
});

export default rootReducer;
