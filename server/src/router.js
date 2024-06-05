import passport from 'passport';
import {
  signin,
  signup,
  verifyEmail,
  resendVerification,
  destroySession,
  isUserBanned,
} from './controllers/auth';
import {
  adStart,
  adComplete,
} from './controllers/ad';
import {
  uploadAvatar,
} from './controllers/upload';
import {
  addPublisher,
  fetchPublishers,
  verifyPublisher,
  buyPublisherslot,
} from './controllers/publisher';
import {
  addAdZone,
  fetchAdzones,
  buyAdzoneslot,
} from './controllers/adzone';
import {
  addBanner,
  fetchBanners,
  createBannerOrder,
  cancelBannerOrder,
  fetchBannerOrders,
  buyBannerslot,
} from './controllers/banner';
import {
  insertIp,
  isIpBanned,
} from './controllers/ip';
import {
  fetchActivity,
  fetchRecentUserActivity,
} from './controllers/activity';
import {
  resetPassword,
  verifyResetPassword,
  resetPasswordNew,
} from './controllers/resetPassword';
import {
  // fetchUsers,
  fetchUserCount,
} from './controllers/users';
import {
  fetchDomains,
} from './controllers/domain';
import {
  fetchWebslots,
  createWebslot,
  deactivateWebslot,
  buyWebslot,
} from './controllers/webslot';
import {
  createReport,
} from './controllers/report';
import walletNotify from './controllers/walletNotify';
import {
  createWebslotOrder,
  cancelWebslotOrder,
  fetchSurfOrders,
} from './controllers/order';
import {
  fetchFaucetRecord,
  claimFaucet,
  fetchFaucetRolls,
} from './controllers/faucet';
import {
  isAdmin,
  fetchAdminWithdrawals,
  acceptWithdraw,
  rejectWithdraw,
  fetchAdminUserList,
  fetchAdminUser,
  fetchAdminReviewBanners,
  fetchAdminReviewPublishers,
  fetchAdminBanners,
  fetchAdminPublishers,
  acceptAdminReviewPublisher,
  rejectAdminReviewPublisher,
  acceptAdminReviewBanner,
  rejectAdminReviewBanner,
  banAdminBanner,
  banAdminPublisher,
  banAdminUser,
  banAdminDomain,
  fetchAdminDomains,
} from './controllers/admin';

import {
  surfComplete,
  surfStart,
} from './controllers/surf';

import {
  fetchWallet,
  withdraw,
} from './controllers/wallet';
import fetchJackpots from './controllers/jackpot';
import { fetchUser } from './controllers/user';

import passportService from './services/passport';
import {
  verifyMyCaptcha,
  isSurfCaptcha,
} from './helpers/recaptcha';
import {
  disabletfa,
  enabletfa,
  ensuretfa,
  unlocktfa,
  istfa,
} from './controllers/tfa';
import fetchPriceInfo from './controllers/price';

import storeIp from './helpers/storeIp';
import {
  rateLimiterMiddlewareUser,
  rateLimiterMiddlewareIp,
  rateLimiterMiddlewareFaucet,
} from './helpers/rateLimiter';

const isbot = require('isbot');

const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
  // destination: `${__dirname}./uploads`,
  destination: './uploads/temp',
  filename(_req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg" || file.mimetype === "image/gif") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .gif, .jpg and .jpeg format allowed!'));
    }
  },
});

const checkFileType = (file, cb) => {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb('Error: Images Only!');
};

const upload = multer({
  storage,
  limits: {
    fields: 5,
    fieldNameSize: 50, // TODO: Check if this size is enough
    fieldSize: 3145728, // TODO: Check if this size is enough
    fileSize: 3145728, // 3MB 3145728bytes max
  },
  filename(_req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg" || file.mimetype === "image/gif") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .gif, .jpg and .jpeg format allowed!'));
    }
  },
});

const rateLimit = require("express-rate-limit");

const { startSync } = require('./services/sync');

const UserController = require('./controllers/user');

const requireAuth = passport.authenticate('jwt', { session: true, failWithError: true });
const requireSignin = passport.authenticate('local', { session: true, failWithError: true });

const IsAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    console.log('isauthenticated');
    next();
  } else {
    res.status(401).send({
      error: 'Unauthorized',
    });
  }
};

const router = (app, io, pub, sub, expired_subKey, volumeInfo, onlineUsers) => {
  app.post('/api/rpc/walletnotify',
    walletNotify,
    (req, res) => {
      console.log('afterWalletNotify');
      if (res.locals.error) {
        console.log('walletnotify...');
        console.log(res.locals.error);
      } else if (!res.locals.error && res.locals.transaction) {
        console.log(res.locals.transaction);
        console.log('wtf');
        if (res.locals.activity) {
          console.log('inside res');
          if (onlineUsers[res.locals.userId.toString()]) {
            onlineUsers[res.locals.userId.toString()].emit('insertTransaction', { transaction: res.locals.transaction });
          }
          io.emit('Activity', res.locals.activity);
        }
        console.log('end insert');
      }
      res.sendStatus(200);
    }); // Make sure this endpoint is only accessible by Runebase Node

  // app.get('/api', requireAuth, fetchUsers);

  app.get('/api/authenticated',
    (req, res, next) => {
      if (req.isAuthenticated()) {
        next();
      } else {
        res.json({ success: false });
      }
    },
    istfa);

  app.post('/api/signup',
    verifyMyCaptcha,
    insertIp,
    signup);

  app.post('/api/admin/withdraw/accept',
    IsAuthenticated,
    isAdmin,
    insertIp,
    acceptWithdraw,
    (req, res) => {
      if (res.locals.error) {
        console.log(res.locals.error);
        res.status(401).send({
          error: res.locals.error,
        });
      }
      if (res.locals.activity) {
        io.emit('Activity', res.locals.activity);
      }
      if (res.locals.transaction) {
        res.json({
          transaction: res.locals.transaction,
        });
      }
    });

  app.post('/api/admin/withdraw/reject',
    IsAuthenticated,
    isAdmin,
    insertIp,
    rejectWithdraw,
    (req, res) => {
      if (res.locals.error) {
        console.log(res.locals.error);
        res.status(401).send({
          error: res.locals.error,
        });
      }
      if (res.locals.activity) {
        io.emit('Activity', res.locals.activity);
      }
      if (res.locals.transaction) {
        res.json({
          transaction: res.locals.transaction,
        });
      }
    });

  app.get('/api/admin/withdrawals',
    IsAuthenticated,
    isAdmin,
    fetchAdminWithdrawals,
    (req, res) => {
      if (res.locals.error) {
        res.status(401).send({
          error: {
            message: res.locals.error,
            resend: false,
          },
        });
      }
      if (res.locals.withdrawals) {
        console.log(res.locals.withdrawals);
        res.json({
          withdrawals: res.locals.withdrawals,
        });
      }
    });

  app.get('/api/admin/publishers/all',
    IsAuthenticated,
    isAdmin,
    fetchAdminPublishers,
    (req, res) => {
      if (res.locals.error) {
        res.status(401).send({
          error: {
            message: res.locals.error,
            resend: false,
          },
        });
      }
      if (res.locals.publishers) {
        console.log(res.locals.publishers);
        res.json({
          publishers: res.locals.publishers,
        });
      }
    });

  app.get('/api/admin/publishers/review',
    IsAuthenticated,
    isAdmin,
    fetchAdminReviewPublishers,
    (req, res) => {
      if (res.locals.error) {
        res.status(401).send({
          error: {
            message: res.locals.error,
            resend: false,
          },
        });
      }
      if (res.locals.publishers) {
        console.log(res.locals.publishers);
        res.json({
          publishers: res.locals.publishers,
        });
      }
    });

  app.get('/api/admin/banners/all',
    IsAuthenticated,
    isAdmin,
    fetchAdminBanners,
    (req, res) => {
      if (res.locals.error) {
        res.status(401).send({
          error: {
            message: res.locals.error,
            resend: false,
          },
        });
      }
      if (res.locals.banners) {
        console.log(res.locals.banners);
        res.json({
          banners: res.locals.banners,
        });
      }
    });

  app.get('/api/admin/domains/all',
    IsAuthenticated,
    isAdmin,
    fetchAdminDomains,
    (req, res) => {
      if (res.locals.error) {
        res.status(401).send({
          error: {
            message: res.locals.error,
            resend: false,
          },
        });
      }
      if (res.locals.domains) {
        console.log(res.locals.domains);
        res.json({
          domains: res.locals.domains,
        });
      }
    });

  app.post('/api/soup/start',
    (req, res, next) => {
      if (isbot(req.get('user-agent'))) {
        res.status(401).send({
          error: 'BOT_NOT_ALLOWED',
        });
      } else {
        next();
      }
    },
    adStart,
    (req, res) => {
      if (res.locals.error) {
        res.status(401).send({
          error: {
            message: res.locals.error,
            resend: false,
          },
        });
      }
      if (res.locals.ad) {
        console.log(res.locals.ad);
        res.json({
          ad: res.locals.ad,
        });
      }
    });

  app.post('/api/soup/complete',
    (req, res, next) => {
      if (isbot(req.get('user-agent'))) {
        res.status(401).send({
          error: 'BOT_NOT_ALLOWED',
        });
      } else {
        next();
      }
    },
    adComplete,
    (req, res) => {
      // res.locals.jackpot = updatedJackpot;
      if (res.locals.error) {
        res.status(401).send({
          error: {
            message: res.locals.error,
          },
        });
      }
      if (res.locals.activity) {
        console.log(res.locals.activity);
        console.log('res.locals.activity');
        io.emit('Activity', res.locals.activity);
      }

      if (res.locals.jackpot) {
        io.emit('updateJackpot', {
          total_tickets: res.locals.jackpot.total_tickets,
          jackpot_amount: res.locals.jackpot.jackpot_amount,
        });
      }

      if (res.locals.advertiserWallet) {
        if (onlineUsers[res.locals.advertiserWallet.userId.toString()]) {
          onlineUsers[res.locals.advertiserWallet.userId.toString()].emit('updateUniqueImpression', {
            wallet: res.locals.advertiserWallet,
            jackpot_tickets: res.locals.jackpotTicketsAdvertiser,
          });
        }
        if (res.locals.referredActivity1) {
          console.log(res.locals.referredActivity1);
          console.log('referredActivity1');
          io.emit('Activity', res.locals.referredActivity1);
        }
      }
      if (res.locals.publisherWallet) {
        if (onlineUsers[res.locals.publisherWallet.userId.toString()]) {
          onlineUsers[res.locals.publisherWallet.userId.toString()].emit('updateUniqueImpression', {
            wallet: res.locals.publisherWallet,
            jackpot_tickets: res.locals.jackpotTicketsPublisher,
          });
        }
        if (res.locals.referredActivity2) {
          console.log(res.locals.referredActivity1);
          console.log('referredActivity1');
          io.emit('Activity', res.locals.referredActivity2);
        }
      }
      if (res.locals.lastStats) {
        console.log(res.locals.lastStats);
        sub.subscribe(expired_subKey, () => {
          pub.setex('impressionVolume:', 99999999999999, res.locals.lastStats.impression);
          pub.setex(`impression:${res.locals.lastStats.impression}`, 86400, res.locals.price);
        });
      }
      if (res.locals.ad) {
        console.log(res.locals.ad);
        res.json({
          ad: res.locals.ad,
        });
      }
    });

  app.get('/api/admin/banners/review',
    IsAuthenticated,
    isAdmin,
    fetchAdminReviewBanners,
    (req, res) => {
      if (res.locals.error) {
        res.status(401).send({
          error: {
            message: res.locals.error,
            resend: false,
          },
        });
      }
      if (res.locals.banners) {
        console.log(res.locals.banners);
        res.json({
          banners: res.locals.banners,
        });
      }
    });

  app.post('/api/admin/publishers/ban',
    IsAuthenticated,
    isAdmin,
    banAdminPublisher,
    (req, res) => {
      if (res.locals.error) {
        res.status(401).send({
          error: {
            message: res.locals.error,
            resend: false,
          },
        });
      }
      if (res.locals.publishers) {
        console.log(res.locals.publishers);
        res.json({
          publishers: res.locals.publishers,
        });
      }
    });

  app.post('/api/admin/banners/ban',
    IsAuthenticated,
    isAdmin,
    banAdminBanner,
    (req, res) => {
      if (res.locals.error) {
        res.status(401).send({
          error: {
            message: res.locals.error,
            resend: false,
          },
        });
      }
      if (res.locals.banners) {
        console.log(res.locals.banners);
        res.json({
          banners: res.locals.banners,
        });
      }
    });

  app.post('/api/admin/users/ban',
    IsAuthenticated,
    isAdmin,
    banAdminUser,
    (req, res) => {
      if (res.locals.error) {
        res.status(401).send({
          error: {
            message: res.locals.error,
            resend: false,
          },
        });
      }
      if (res.locals.users) {
        console.log(res.locals.users);
        res.json({
          users: res.locals.users,
        });
      }
    });

  app.post('/api/admin/domains/ban',
    IsAuthenticated,
    isAdmin,
    banAdminDomain,
    (req, res) => {
      if (res.locals.error) {
        res.status(401).send({
          error: {
            message: res.locals.error,
            resend: false,
          },
        });
      }
      if (res.locals.domains) {
        console.log(res.locals.domains);
        res.json({
          domains: res.locals.domains,
        });
      }
    });

  app.post('/api/admin/banners/review/accept',
    IsAuthenticated,
    isAdmin,
    acceptAdminReviewBanner,
    (req, res) => {
      if (res.locals.error) {
        res.status(401).send({
          error: {
            message: res.locals.error,
            resend: false,
          },
        });
      }
      if (res.locals.banners) {
        console.log(res.locals.banners);
        res.json({
          banners: res.locals.banners,
        });
      }
    });

  app.post('/api/admin/banners/review/reject',
    IsAuthenticated,
    isAdmin,
    rejectAdminReviewBanner,
    (req, res) => {
      if (res.locals.error) {
        res.status(401).send({
          error: {
            message: res.locals.error,
            resend: false,
          },
        });
      }
      if (res.locals.banners) {
        console.log(res.locals.banners);
        res.json({
          banners: res.locals.banners,
        });
      }
    });

  app.post('/api/admin/publishers/review/reject',
    IsAuthenticated,
    isAdmin,
    rejectAdminReviewPublisher,
    (req, res) => {
      if (res.locals.error) {
        res.status(401).send({
          error: {
            message: res.locals.error,
            resend: false,
          },
        });
      }
      if (res.locals.publishers) {
        console.log(res.locals.publishers);
        res.json({
          publishers: res.locals.publishers,
        });
      }
    });

  app.post('/api/admin/publishers/review/accept',
    IsAuthenticated,
    isAdmin,
    acceptAdminReviewPublisher,
    (req, res) => {
      if (res.locals.error) {
        res.status(401).send({
          error: res.locals.error,
        });
      }
      if (res.locals.publishers) {
        console.log(res.locals.publishers);
        res.json({
          publishers: res.locals.publishers,
        });
      }
    });

  app.get('/api/admin/userlist',
    IsAuthenticated,
    isAdmin,
    fetchAdminUserList,
    (req, res) => {
      if (res.locals.error) {
        res.status(401).send({
          error: {
            message: res.locals.error,
            resend: false,
          },
        });
      }
      if (res.locals.userlist) {
        console.log(res.locals.userlist);
        res.json({
          userlist: res.locals.userlist,
        });
      }
    });

  app.post('/api/admin/user',
    IsAuthenticated,
    isAdmin,
    fetchAdminUser,
    (req, res) => {
      if (res.locals.error) {
        res.status(401).send({
          error: {
            message: res.locals.error,
            resend: false,
          },
        });
      }
      if (res.locals.user) {
        console.log(res.locals.user);
        res.json({
          user: res.locals.user,
        });
      }
    });

  app.post('/api/signup/verify-email',
    insertIp,
    verifyEmail,
    (req, res) => {
      console.log(res.locals.error);
      if (res.locals.error === 'AUTH_TOKEN_EXPIRED') {
        res.status(401).send({
          error: {
            message: res.locals.error,
            resend: true,
          },
        });
      }
      if (res.locals.error) {
        res.status(401).send({
          error: {
            message: res.locals.error,
            resend: false,
          },
        });
      }
      if (res.locals.user) {
        res.json({
          firstname: res.locals.user.firstname,
          username: res.locals.user.username,
        });
      }
    });

  app.post('/api/resend-verify-code',
    resendVerification);

  app.post('/api/signin',
    (req, res, next) => {
      console.log('Click Login');
      next();
    },
    verifyMyCaptcha,
    insertIp,
    requireSignin,
    isUserBanned,
    signin,
    (err, req, res, next) => {
      if (req.authErr === 'EMAIL_NOT_VERIFIED') {
        req.session.destroy();
        res.status(401).send({
          error: req.authErr,
          email: res.locals.email,
        });
      } else if (req.authErr) {
        req.session.destroy();
        res.status(401).send({
          error: 'LOGIN_ERROR',
        });
      }
    },
    (req, res, next) => {
      if (res.locals.activity) {
        io.emit('Activity', res.locals.activity);
      }
      console.log('Login Successful');
      res.json({
        username: req.username,
      });
    });

  app.post('/api/reset-password',
    verifyMyCaptcha,
    resetPassword);

  app.post('/api/reset-password/verify',
    verifyResetPassword);

  app.post('/api/reset-password/new',
    resetPasswordNew);

  app.post('/api/2fa/enable',
    IsAuthenticated,
    isUserBanned,
    storeIp,
    ensuretfa,
    enabletfa);

  app.post('/api/2fa/disable',
    IsAuthenticated,
    storeIp,
    ensuretfa,
    disabletfa);

  app.post('/api/2fa/unlock',
    IsAuthenticated,
    isUserBanned,
    storeIp,
    unlocktfa);

  app.post('/api/publisher/add',
    IsAuthenticated,
    isUserBanned,
    storeIp,
    ensuretfa,
    addPublisher,
    (req, res) => {
      console.log('ADDED PUBLISHER');
      if (res.locals.error) {
        console.log(res.locals.error);
        res.status(401).send({
          error: res.locals.error,
        });
      }
      if (res.locals.activity) {
        io.emit('Activity', res.locals.activity);
      }
      if (res.locals.publisher) {
        res.json(res.locals.publisher);
      }
    });

  app.post('/api/publisher/adzone/add',
    IsAuthenticated,
    isUserBanned,
    storeIp,
    ensuretfa,
    addAdZone,
    (req, res) => {
      console.log('ADDED ADZONE');
      if (res.locals.error) {
        console.log(res.locals.error);
        res.status(401).send({
          error: res.locals.error,
        });
      }
      if (res.locals.activity) {
        io.emit('Activity', res.locals.activity);
      }
      if (res.locals.adzones) {
        res.json(res.locals.adzones);
      }
    });

  app.post('/api/publisher/verify',
    IsAuthenticated,
    isUserBanned,
    storeIp,
    ensuretfa,
    verifyPublisher,
    (req, res) => {
      console.log('ADDED PUBLISHER');
      if (res.locals.error) {
        console.log(res.locals.error);
        res.status(401).send({
          error: res.locals.error,
        });
      }
      if (res.locals.publishers) {
        res.json(res.locals.publishers);
      }
    });

  app.get('/api/banner/all',
    IsAuthenticated,
    isUserBanned,
    storeIp,
    ensuretfa,
    fetchBanners,
    (req, res) => {
      console.log('ADDED PUBLISHER');
      if (res.locals.error) {
        console.log(res.locals.error);
        res.status(401).send({
          error: res.locals.error,
        });
      }
      if (res.locals.banners) {
        console.log(res.locals.banners);
        console.log('banners');
        res.json(res.locals.banners);
      }
    });

  app.get('/api/publisher/all',
    IsAuthenticated,
    isUserBanned,
    storeIp,
    ensuretfa,
    fetchPublishers,
    (req, res) => {
      console.log('ADDED PUBLISHER');
      if (res.locals.error) {
        console.log(res.locals.error);
        res.status(401).send({
          error: res.locals.error,
        });
      }
      if (res.locals.publishers) {
        res.json(res.locals.publishers);
      }
    });

  app.post('/api/banner/add',
    IsAuthenticated,
    isUserBanned,
    storeIp,
    ensuretfa,
    upload.single('banner'),
    addBanner,
    (req, res) => {
      console.log('ADDED BANNER');
      if (res.locals.error) {
        console.log(res.locals.error);
        res.status(401).send({
          error: res.locals.error,
        });
      }
      if (res.locals.activity) {
        io.emit('Activity', res.locals.activity);
      }
      if (res.locals.banner) {
        res.json(res.locals.banner);
      }
    });

  app.post('/api/banner/order/cancel',
    IsAuthenticated,
    isUserBanned,
    storeIp,
    ensuretfa,
    cancelBannerOrder,
    (req, res) => {
      console.log(req.body);
      console.log('yow');
      if (res.locals.error) {
        res.status(401).send({
          error: res.locals.error,
        });
      }
      if (res.locals.activity) {
        io.emit('Activity', res.locals.activity);
      }
      if (res.locals.order) {
        res.json({
          order: res.locals.order,
          wallet: res.locals.wallet,
        });
      }
    });

  app.post('/api/upload/avatar',
    IsAuthenticated,
    isUserBanned,
    storeIp,
    ensuretfa,
    upload.single('avatar'),
    uploadAvatar,
    (req, res) => {
      console.log('UPLOADED AVATAR');
      if (res.locals.error) {
        console.log(res.locals.error);
        res.status(401).send({
          error: res.locals.error,
        });
      }
      if (res.locals.avatar) {
        res.json(res.locals.avatar);
      }
    });

  // app.post('/contact/send', verifyMyCaptcha, contactSend);
  app.post('/api/chaininfo/block',
    (req, res) => {
      startSync(io, onlineUsers);
    });

  app.get('/api/price',
    fetchPriceInfo,
    (req, res) => {
      if (res.locals.error) {
        console.log(res.locals.error);
        res.status(401).send({
          error: res.locals.error,
        });
      }
      if (res.locals.price) {
        res.json({
          price: res.locals.price,
        });
      }
    });

  app.get('/api/domains',
    fetchDomains);

  app.get('/api/jackpots',
    fetchJackpots,
    (req, res) => {
      if (res.locals.error) {
        res.status(401).send({
          error: res.locals.error,
        });
      }
      if (res.locals.jackpots) {
        res.json({
          jackpots: res.locals.jackpots,
        });
      }
    });

  app.get('/api/orders/surf',
    fetchSurfOrders);

  app.get('/api/orders/banner',
    fetchBannerOrders);

  app.get('/api/logout',
    insertIp,
    storeIp,
    destroySession,
    (req, res) => {
      io.emit('Activity', res.locals.activity);
      res.redirect("/");
    });

  app.get('/api/users/total',
    fetchUserCount);

  app.get('/api/webslots',
    IsAuthenticated,
    isUserBanned,
    ensuretfa,
    fetchWebslots);

  app.get('/api/faucetrecord',
    IsAuthenticated,
    isUserBanned,
    ensuretfa,
    fetchFaucetRecord,
    (req, res) => {
      console.log('FAUCET RECORD');
      console.log(res.locals.faucetRecord);
      if (res.locals.error) {
        res.status(401).send({
          error: res.locals.error,
        });
      }
      if (res.locals.faucetRecord) {
        res.json({
          faucetRecord: res.locals.faucetRecord,
        });
      }
    });

  app.get('/api/faucetrolls',
    IsAuthenticated,
    isUserBanned,
    ensuretfa,
    fetchFaucetRolls,
    (req, res) => {
      console.log('FAUCET RECORD');
      console.log(res.locals.faucetRolls);
      if (res.locals.error) {
        res.status(401).send({
          error: res.locals.error,
        });
      }
      if (res.locals.faucetRolls) {
        res.json({
          faucetRolls: res.locals.faucetRolls,
        });
      }
    });

  app.post('/api/faucetclaim',
    IsAuthenticated,
    isUserBanned,
    storeIp,
    ensuretfa,
    rateLimiterMiddlewareFaucet,
    verifyMyCaptcha,
    claimFaucet,
    (req, res) => {
      if (res.locals.error) {
        res.status(401).send({
          error: res.locals.error,
        });
      }
      if (res.locals.jackpot) {
        io.emit('updateJackpot', {
          total_tickets: res.locals.jackpot.total_tickets,
          jackpot_amount: res.locals.jackpot.jackpot_amount,
        });
      }
      if (res.locals.activity) {
        io.emit('Activity', res.locals.activity);
      }
      if (res.locals.faucetRecord && res.locals.wallet && res.locals.faucetRoll) {
        res.json({
          jackpot_tickets: res.locals.jackpot_tickets,
          wallet: res.locals.wallet,
          faucetRecord: res.locals.faucetRecord,
          faucetRoll: res.locals.faucetRoll,
        });
      }
    });

  app.get('/api/activity/all',
    fetchActivity,
    (req, res) => {
      if (res.locals.error) {
        res.status(401).send({
          error: res.locals.error,
        });
      }
      if (res.locals.activity) {
        res.json({
          activity: res.locals.activity,
        });
      }
    });

  app.get('/api/activity/user',
    IsAuthenticated,
    isUserBanned,
    storeIp,
    ensuretfa,
    fetchRecentUserActivity,
    (req, res) => {
      if (res.locals.error) {
        res.status(401).send({
          error: res.locals.error,
        });
      }
      if (res.locals.activity) {
        res.json({
          activity: res.locals.activity,
        });
      }
    });

  app.post('/api/webslot/buy',
    IsAuthenticated,
    isUserBanned,
    storeIp,
    ensuretfa,
    // rateLimiterMiddlewareIp,
    // rateLimiterMiddlewareUser,
    buyWebslot,
    (req, res) => {
      if (res.locals.error) {
        console.log(res.locals.error);
        res.status(401).send({
          error: res.locals.error,
        });
      }
      if (res.locals.activity) {
        io.emit('Activity', res.locals.activity);
      }
      if (res.locals.user && res.locals.wallet) {
        res.json({
          wallet: res.locals.wallet,
          webslot_amount: res.locals.user.webslot_amount,
          jackpot_tickets: res.locals.user.jackpot_tickets,
        });
      }
    });

  app.post('/api/banners/buy',
    IsAuthenticated,
    isUserBanned,
    storeIp,
    ensuretfa,
    // rateLimiterMiddlewareIp,
    // rateLimiterMiddlewareUser,
    buyBannerslot,
    (req, res) => {
      if (res.locals.error) {
        console.log(res.locals.error);
        res.status(401).send({
          error: res.locals.error,
        });
      }
      if (res.locals.activity) {
        io.emit('Activity', res.locals.activity);
      }
      if (res.locals.user && res.locals.wallet) {
        res.json({
          wallet: res.locals.wallet,
          banners_amount: res.locals.user.banners_amount,
          jackpot_tickets: res.locals.user.jackpot_tickets,
        });
      }
    });

  app.post('/api/publishers/buy',
    IsAuthenticated,
    isUserBanned,
    storeIp,
    ensuretfa,
    // rateLimiterMiddlewareIp,
    // rateLimiterMiddlewareUser,
    buyPublisherslot,
    (req, res) => {
      if (res.locals.error) {
        console.log(res.locals.error);
        res.status(401).send({
          error: res.locals.error,
        });
      }
      if (res.locals.activity) {
        io.emit('Activity', res.locals.activity);
      }
      if (res.locals.user && res.locals.wallet) {
        res.json({
          wallet: res.locals.wallet,
          publishers_amount: res.locals.user.publishers_amount,
          jackpot_tickets: res.locals.user.jackpot_tickets,
        });
      }
    });

  app.post('/api/adzone/buy',
    IsAuthenticated,
    isUserBanned,
    storeIp,
    ensuretfa,
    // rateLimiterMiddlewareIp,
    // rateLimiterMiddlewareUser,
    buyAdzoneslot,
    (req, res) => {
      if (res.locals.error) {
        console.log(res.locals.error);
        res.status(401).send({
          error: res.locals.error,
        });
      }
      if (res.locals.activity) {
        io.emit('Activity', res.locals.activity);
      }
      if (res.locals.user && res.locals.wallet) {
        res.json({
          wallet: res.locals.wallet,
          publisherId: res.locals.publisher.id,
          adzones_amount: res.locals.publisher.adzones_amount,
          jackpot_tickets: res.locals.user.jackpot_tickets,
        });
      }
    });

  app.post('/api/webslots/create',
    IsAuthenticated,
    isUserBanned,
    storeIp,
    ensuretfa,
    createWebslot,
    (req, res, next) => {
      if (req.authErr === 'INVALID_URL') {
        res.status(401).send({
          errorType: 'invalid_url',
          url: req.body.url,
        });
      }
      if (res.locals.error) {
        res.status(401).send({
          error: res.locals.error,
        });
      }
      if (res.locals.activity) {
        io.emit('Activity', res.locals.activity);
      }
      console.log(res.locals.webslot);
      console.log(res.locals.domain);
      console.log('sjj');
      if (res.locals.webslot) {
        res.json({
          webslot: res.locals.webslot,
          domain: res.locals.domain,
        });
      }
    });

  app.post('/api/report/create',
    IsAuthenticated,
    isUserBanned,
    storeIp,
    ensuretfa,
    verifyMyCaptcha,
    createReport,
    (req, res, next) => {
      if (req.authErr === 'INVALID_URL') {
        res.status(401).send({
          errorType: 'invalid_url',
          url: req.body.url,
        });
      }
      if (res.locals.error) {
        res.status(401).send({
          error: res.locals.error,
        });
      }

      if (res.locals.report) {
        res.json({
          report: res.locals.report,
        });
      }
    });

  app.post('/api/webslots/deactivate',
    IsAuthenticated,
    isUserBanned,
    storeIp,
    ensuretfa,
    deactivateWebslot,
    (req, res) => {
      if (res.locals.error) {
        console.log(res.locals.error);
        res.status(401).send({
          error: res.locals.error,
        });
      }
      if (res.locals.webslot) {
        res.json({
          webslot: res.locals.webslot,
        });
      }
    });

  app.post('/api/surf/complete',
    (req, res, next) => {
      if (isbot(req.get('user-agent'))) {
        res.status(401).send({
          error: 'BOT_NOT_ALLOWED',
        });
      } else {
        next();
      }
    },
    IsAuthenticated,
    isUserBanned,
    storeIp,
    ensuretfa,
    rateLimiterMiddlewareIp,
    rateLimiterMiddlewareUser,
    isSurfCaptcha,
    surfComplete,
    (req, res, next) => {
      console.log('surf complete');
      if (res.locals.error) {
        console.log(res.locals.error);
        res.status(401).send({
          error: res.locals.error,
        });
      } else {
        // console.log(res.locals.order);
        // console.log(res.locals.userWallet2);
        // console.log(res.locals.userWallet1);
        // console.log(res.locals.domain);
        // console.log(res.locals.webslot);

        // jackpot tickets for users.
        // res.locals.user2_jackpot_tickets
        // res.locals.user1_jackpot_tickets

        if (res.locals.activity) {
          io.emit('Activity', res.locals.activity);
        }

        if (res.locals.jackpot) {
          io.emit('updateJackpot', {
            total_tickets: res.locals.jackpot.total_tickets,
            jackpot_amount: res.locals.jackpot.jackpot_amount,
          });
        }

        if (res.locals.referredWallet1) {
          if (onlineUsers[res.locals.referredWallet1.userId.toString()]) {
            onlineUsers[res.locals.referredWallet1.userId.toString()].emit('updateWallet', {
              wallet: res.locals.referredWallet1,
            });
          }
          io.emit('Activity', res.locals.referredActivity1);
        }
        if (res.locals.referredWallet2) {
          if (onlineUsers[res.locals.referredWallet2.userId.toString()]) {
            onlineUsers[res.locals.referredWallet2.userId.toString()].emit('updateWallet', {
              wallet: res.locals.referredWallet2,
            });
          }
          io.emit('Activity', res.locals.referredActivity2);
        }

        if (onlineUsers[res.locals.userId2.toString()]) {
          onlineUsers[res.locals.userId2.toString()].emit('updateSurfComplete', {
            jackpot_tickets: res.locals.user2_jackpot_tickets,
            wallet: res.locals.userWallet2,
            order: res.locals.order,
            webslot: res.locals.webslot,
            domain: res.locals.domain,
          });
        }

        sub.subscribe(expired_subKey, () => {
          pub.setex('surfVolume:', 9999999999999999, res.locals.lastStats.surf);
          pub.setex(`surf:${res.locals.lastStats.surf}`, 86400, res.locals.order.price);
        });

        res.json({
          wallet: res.locals.userWallet1,
          jackpot_tickets: res.locals.user1_jackpot_tickets,
          surfcount: res.locals.surfcount,
        });
      }
    });

  app.get('/api/volume',
    (req, res, next) => {
      console.log(volumeInfo);
      console.log('volumeInfo');
      console.log('volumeInfo');
      console.log('volumeInfo');
      console.log('volumeInfo');
      console.log('volumeInfo');
      console.log('volumeInfo');
      console.log('volumeInfo');
      console.log('volumeInfo');
      res.json(volumeInfo);
    });

  app.get('/api/surf/start',
    (req, res, next) => {
      console.log(req.get('user-agent'));
      console.log(isbot(req.get('user-agent')));
      console.log('user-agent');
      if (isbot(req.get('user-agent'))) {
        res.status(401).send({
          error: 'BOT_NOT_ALLOWED',
        });
      } else {
        next();
      }
    },
    IsAuthenticated,
    storeIp,
    isUserBanned,
    ensuretfa,
    // rateLimiterMiddlewareIp,
    // rateLimiterMiddlewareUser,
    surfStart,
    (req, res) => {
      console.log('SURF STARTED');
      if (res.locals.error) {
        console.log(res.locals.error);
        res.status(401).send({
          error: res.locals.error,
        });
      }
      if (res.locals.activity) {
        console.log('emit activity');
        io.emit('Activity', res.locals.activity);
      }
      console.log(res.locals.surfTicket);
      console.log('respons with surfTicket');
      res.json(res.locals.surfTicket);
    });

  app.get('/api/user',
    IsAuthenticated,
    isUserBanned,
    storeIp,
    ensuretfa,
    fetchUser,
    (req, res, next) => {
      if (res.locals.error) {
        console.log(res.locals.error);
        res.status(401).send({
          error: res.locals.error,
        });
      }
      if (res.locals.user) {
        res.json(res.locals.user);
      }
    });

  // User Create Order
  app.post('/api/banners/order/create',
    IsAuthenticated,
    isUserBanned,
    storeIp,
    ensuretfa,
    createBannerOrder,
    (req, res) => {
      if (res.locals.error) {
        res.status(401).send({
          error: res.locals.error,
        });
      }
      if (res.locals.activity) {
        io.emit('Activity', res.locals.activity);
      }
      if (res.locals.order && res.locals.wallet) {
        res.json({
          order: res.locals.order,
          wallet: res.locals.wallet,
        });
      }
    });

  // User Create Order
  app.post('/api/webslot/order/create',
    IsAuthenticated,
    isUserBanned,
    storeIp,
    ensuretfa,
    createWebslotOrder,
    (req, res) => {
      if (res.locals.error) {
        res.status(401).send({
          error: res.locals.error,
        });
      }
      if (res.locals.activity) {
        io.emit('Activity', res.locals.activity);
      }
      if (res.locals.order && res.locals.wallet) {
        res.json({
          order: res.locals.order,
          wallet: res.locals.wallet,
        });
      }
    });

  app.post('/api/webslot/order/cancel',
    IsAuthenticated,
    isUserBanned,
    storeIp,
    ensuretfa,
    cancelWebslotOrder,
    (req, res) => {
      console.log(req.body);
      console.log('yow');
      if (res.locals.error) {
        res.status(401).send({
          error: res.locals.error,
        });
      }
      if (res.locals.activity) {
        io.emit('Activity', res.locals.activity);
      }
      if (res.locals.order) {
        res.json({
          order: res.locals.order,
        });
      }
    });

  // User Request Withdrawal
  app.post('/api/withdraw',
    IsAuthenticated,
    isUserBanned,
    storeIp,
    ensuretfa,
    withdraw,
    (req, res) => {
      if (res.locals.error) {
        console.log(res.locals.error);
        res.status(401).send({
          error: res.locals.error,
        });
      } else if (!res.locals.error && res.locals.wallet && res.locals.transaction) {
        res.locals.transaction.txid = null;
        res.locals.transaction.blockId = null;
        res.json({
          wallet: res.locals.wallet,
          transaction: res.locals.transaction,
        });
      }
    });
};

export default router;
