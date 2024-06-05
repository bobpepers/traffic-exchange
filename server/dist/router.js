'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _auth = require('./controllers/auth');

var _ad = require('./controllers/ad');

var _upload = require('./controllers/upload');

var _publisher = require('./controllers/publisher');

var _adzone = require('./controllers/adzone');

var _banner = require('./controllers/banner');

var _ip = require('./controllers/ip');

var _activity = require('./controllers/activity');

var _resetPassword = require('./controllers/resetPassword');

var _users = require('./controllers/users');

var _domain = require('./controllers/domain');

var _webslot = require('./controllers/webslot');

var _report = require('./controllers/report');

var _walletNotify = require('./controllers/walletNotify');

var _walletNotify2 = _interopRequireDefault(_walletNotify);

var _order = require('./controllers/order');

var _faucet = require('./controllers/faucet');

var _admin = require('./controllers/admin');

var _surf = require('./controllers/surf');

var _wallet = require('./controllers/wallet');

var _jackpot = require('./controllers/jackpot');

var _jackpot2 = _interopRequireDefault(_jackpot);

var _user = require('./controllers/user');

var _passport3 = require('./services/passport');

var _passport4 = _interopRequireDefault(_passport3);

var _recaptcha = require('./helpers/recaptcha');

var _tfa = require('./controllers/tfa');

var _price = require('./controllers/price');

var _price2 = _interopRequireDefault(_price);

var _storeIp = require('./helpers/storeIp');

var _storeIp2 = _interopRequireDefault(_storeIp);

var _rateLimiter = require('./helpers/rateLimiter');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isbot = require('isbot');

var path = require('path');
var multer = require('multer');

var storage = multer.diskStorage({
  // destination: `${__dirname}./uploads`,
  destination: './uploads/temp',
  filename: function filename(_req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },

  fileFilter: function fileFilter(req, file, cb) {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg" || file.mimetype === "image/gif") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .gif, .jpg and .jpeg format allowed!'));
    }
  }
});

var checkFileType = function checkFileType(file, cb) {
  // Allowed ext
  var filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  var extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  var mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb('Error: Images Only!');
};

var upload = multer({
  storage: storage,
  limits: {
    fields: 5,
    fieldNameSize: 50, // TODO: Check if this size is enough
    fieldSize: 3145728, // TODO: Check if this size is enough
    fileSize: 3145728 // 3MB 3145728bytes max
  },
  filename: function filename(_req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },

  fileFilter: function fileFilter(req, file, cb) {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg" || file.mimetype === "image/gif") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .gif, .jpg and .jpeg format allowed!'));
    }
  }
});

var rateLimit = require("express-rate-limit");

var _require = require('./services/sync'),
    startSync = _require.startSync;

var UserController = require('./controllers/user');

var requireAuth = _passport2.default.authenticate('jwt', { session: true, failWithError: true });
var requireSignin = _passport2.default.authenticate('local', { session: true, failWithError: true });

var IsAuthenticated = function IsAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    console.log('isauthenticated');
    next();
  } else {
    res.status(401).send({
      error: 'Unauthorized'
    });
  }
};

var router = function router(app, io, pub, sub, expired_subKey, volumeInfo, onlineUsers) {
  app.post('/api/rpc/walletnotify', _walletNotify2.default, function (req, res) {
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

  app.get('/api/authenticated', function (req, res, next) {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.json({ success: false });
    }
  }, _tfa.istfa);

  app.post('/api/signup', _recaptcha.verifyMyCaptcha, _ip.insertIp, _auth.signup);

  app.post('/api/admin/withdraw/accept', IsAuthenticated, _admin.isAdmin, _ip.insertIp, _admin.acceptWithdraw, function (req, res) {
    if (res.locals.error) {
      console.log(res.locals.error);
      res.status(401).send({
        error: res.locals.error
      });
    }
    if (res.locals.activity) {
      io.emit('Activity', res.locals.activity);
    }
    if (res.locals.transaction) {
      res.json({
        transaction: res.locals.transaction
      });
    }
  });

  app.post('/api/admin/withdraw/reject', IsAuthenticated, _admin.isAdmin, _ip.insertIp, _admin.rejectWithdraw, function (req, res) {
    if (res.locals.error) {
      console.log(res.locals.error);
      res.status(401).send({
        error: res.locals.error
      });
    }
    if (res.locals.activity) {
      io.emit('Activity', res.locals.activity);
    }
    if (res.locals.transaction) {
      res.json({
        transaction: res.locals.transaction
      });
    }
  });

  app.get('/api/admin/withdrawals', IsAuthenticated, _admin.isAdmin, _admin.fetchAdminWithdrawals, function (req, res) {
    if (res.locals.error) {
      res.status(401).send({
        error: {
          message: res.locals.error,
          resend: false
        }
      });
    }
    if (res.locals.withdrawals) {
      console.log(res.locals.withdrawals);
      res.json({
        withdrawals: res.locals.withdrawals
      });
    }
  });

  app.get('/api/admin/publishers/all', IsAuthenticated, _admin.isAdmin, _admin.fetchAdminPublishers, function (req, res) {
    if (res.locals.error) {
      res.status(401).send({
        error: {
          message: res.locals.error,
          resend: false
        }
      });
    }
    if (res.locals.publishers) {
      console.log(res.locals.publishers);
      res.json({
        publishers: res.locals.publishers
      });
    }
  });

  app.get('/api/admin/publishers/review', IsAuthenticated, _admin.isAdmin, _admin.fetchAdminReviewPublishers, function (req, res) {
    if (res.locals.error) {
      res.status(401).send({
        error: {
          message: res.locals.error,
          resend: false
        }
      });
    }
    if (res.locals.publishers) {
      console.log(res.locals.publishers);
      res.json({
        publishers: res.locals.publishers
      });
    }
  });

  app.get('/api/admin/banners/all', IsAuthenticated, _admin.isAdmin, _admin.fetchAdminBanners, function (req, res) {
    if (res.locals.error) {
      res.status(401).send({
        error: {
          message: res.locals.error,
          resend: false
        }
      });
    }
    if (res.locals.banners) {
      console.log(res.locals.banners);
      res.json({
        banners: res.locals.banners
      });
    }
  });

  app.get('/api/admin/domains/all', IsAuthenticated, _admin.isAdmin, _admin.fetchAdminDomains, function (req, res) {
    if (res.locals.error) {
      res.status(401).send({
        error: {
          message: res.locals.error,
          resend: false
        }
      });
    }
    if (res.locals.domains) {
      console.log(res.locals.domains);
      res.json({
        domains: res.locals.domains
      });
    }
  });

  app.post('/api/soup/start', function (req, res, next) {
    if (isbot(req.get('user-agent'))) {
      res.status(401).send({
        error: 'BOT_NOT_ALLOWED'
      });
    } else {
      next();
    }
  }, _ad.adStart, function (req, res) {
    if (res.locals.error) {
      res.status(401).send({
        error: {
          message: res.locals.error,
          resend: false
        }
      });
    }
    if (res.locals.ad) {
      console.log(res.locals.ad);
      res.json({
        ad: res.locals.ad
      });
    }
  });

  app.post('/api/soup/complete', function (req, res, next) {
    if (isbot(req.get('user-agent'))) {
      res.status(401).send({
        error: 'BOT_NOT_ALLOWED'
      });
    } else {
      next();
    }
  }, _ad.adComplete, function (req, res) {
    // res.locals.jackpot = updatedJackpot;
    if (res.locals.error) {
      res.status(401).send({
        error: {
          message: res.locals.error
        }
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
        jackpot_amount: res.locals.jackpot.jackpot_amount
      });
    }

    if (res.locals.advertiserWallet) {
      if (onlineUsers[res.locals.advertiserWallet.userId.toString()]) {
        onlineUsers[res.locals.advertiserWallet.userId.toString()].emit('updateUniqueImpression', {
          wallet: res.locals.advertiserWallet,
          jackpot_tickets: res.locals.jackpotTicketsAdvertiser
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
          jackpot_tickets: res.locals.jackpotTicketsPublisher
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
      sub.subscribe(expired_subKey, function () {
        pub.setex('impressionVolume:', 99999999999999, res.locals.lastStats.impression);
        pub.setex('impression:' + res.locals.lastStats.impression, 86400, res.locals.price);
      });
    }
    if (res.locals.ad) {
      console.log(res.locals.ad);
      res.json({
        ad: res.locals.ad
      });
    }
  });

  app.get('/api/admin/banners/review', IsAuthenticated, _admin.isAdmin, _admin.fetchAdminReviewBanners, function (req, res) {
    if (res.locals.error) {
      res.status(401).send({
        error: {
          message: res.locals.error,
          resend: false
        }
      });
    }
    if (res.locals.banners) {
      console.log(res.locals.banners);
      res.json({
        banners: res.locals.banners
      });
    }
  });

  app.post('/api/admin/publishers/ban', IsAuthenticated, _admin.isAdmin, _admin.banAdminPublisher, function (req, res) {
    if (res.locals.error) {
      res.status(401).send({
        error: {
          message: res.locals.error,
          resend: false
        }
      });
    }
    if (res.locals.publishers) {
      console.log(res.locals.publishers);
      res.json({
        publishers: res.locals.publishers
      });
    }
  });

  app.post('/api/admin/banners/ban', IsAuthenticated, _admin.isAdmin, _admin.banAdminBanner, function (req, res) {
    if (res.locals.error) {
      res.status(401).send({
        error: {
          message: res.locals.error,
          resend: false
        }
      });
    }
    if (res.locals.banners) {
      console.log(res.locals.banners);
      res.json({
        banners: res.locals.banners
      });
    }
  });

  app.post('/api/admin/users/ban', IsAuthenticated, _admin.isAdmin, _admin.banAdminUser, function (req, res) {
    if (res.locals.error) {
      res.status(401).send({
        error: {
          message: res.locals.error,
          resend: false
        }
      });
    }
    if (res.locals.users) {
      console.log(res.locals.users);
      res.json({
        users: res.locals.users
      });
    }
  });

  app.post('/api/admin/domains/ban', IsAuthenticated, _admin.isAdmin, _admin.banAdminDomain, function (req, res) {
    if (res.locals.error) {
      res.status(401).send({
        error: {
          message: res.locals.error,
          resend: false
        }
      });
    }
    if (res.locals.domains) {
      console.log(res.locals.domains);
      res.json({
        domains: res.locals.domains
      });
    }
  });

  app.post('/api/admin/banners/review/accept', IsAuthenticated, _admin.isAdmin, _admin.acceptAdminReviewBanner, function (req, res) {
    if (res.locals.error) {
      res.status(401).send({
        error: {
          message: res.locals.error,
          resend: false
        }
      });
    }
    if (res.locals.banners) {
      console.log(res.locals.banners);
      res.json({
        banners: res.locals.banners
      });
    }
  });

  app.post('/api/admin/banners/review/reject', IsAuthenticated, _admin.isAdmin, _admin.rejectAdminReviewBanner, function (req, res) {
    if (res.locals.error) {
      res.status(401).send({
        error: {
          message: res.locals.error,
          resend: false
        }
      });
    }
    if (res.locals.banners) {
      console.log(res.locals.banners);
      res.json({
        banners: res.locals.banners
      });
    }
  });

  app.post('/api/admin/publishers/review/reject', IsAuthenticated, _admin.isAdmin, _admin.rejectAdminReviewPublisher, function (req, res) {
    if (res.locals.error) {
      res.status(401).send({
        error: {
          message: res.locals.error,
          resend: false
        }
      });
    }
    if (res.locals.publishers) {
      console.log(res.locals.publishers);
      res.json({
        publishers: res.locals.publishers
      });
    }
  });

  app.post('/api/admin/publishers/review/accept', IsAuthenticated, _admin.isAdmin, _admin.acceptAdminReviewPublisher, function (req, res) {
    if (res.locals.error) {
      res.status(401).send({
        error: res.locals.error
      });
    }
    if (res.locals.publishers) {
      console.log(res.locals.publishers);
      res.json({
        publishers: res.locals.publishers
      });
    }
  });

  app.get('/api/admin/userlist', IsAuthenticated, _admin.isAdmin, _admin.fetchAdminUserList, function (req, res) {
    if (res.locals.error) {
      res.status(401).send({
        error: {
          message: res.locals.error,
          resend: false
        }
      });
    }
    if (res.locals.userlist) {
      console.log(res.locals.userlist);
      res.json({
        userlist: res.locals.userlist
      });
    }
  });

  app.post('/api/admin/user', IsAuthenticated, _admin.isAdmin, _admin.fetchAdminUser, function (req, res) {
    if (res.locals.error) {
      res.status(401).send({
        error: {
          message: res.locals.error,
          resend: false
        }
      });
    }
    if (res.locals.user) {
      console.log(res.locals.user);
      res.json({
        user: res.locals.user
      });
    }
  });

  app.post('/api/signup/verify-email', _ip.insertIp, _auth.verifyEmail, function (req, res) {
    console.log(res.locals.error);
    if (res.locals.error === 'AUTH_TOKEN_EXPIRED') {
      res.status(401).send({
        error: {
          message: res.locals.error,
          resend: true
        }
      });
    }
    if (res.locals.error) {
      res.status(401).send({
        error: {
          message: res.locals.error,
          resend: false
        }
      });
    }
    if (res.locals.user) {
      res.json({
        firstname: res.locals.user.firstname,
        username: res.locals.user.username
      });
    }
  });

  app.post('/api/resend-verify-code', _auth.resendVerification);

  app.post('/api/signin', function (req, res, next) {
    console.log('Click Login');
    next();
  }, _recaptcha.verifyMyCaptcha, _ip.insertIp, requireSignin, _auth.isUserBanned, _auth.signin, function (err, req, res, next) {
    if (req.authErr === 'EMAIL_NOT_VERIFIED') {
      req.session.destroy();
      res.status(401).send({
        error: req.authErr,
        email: res.locals.email
      });
    } else if (req.authErr) {
      req.session.destroy();
      res.status(401).send({
        error: 'LOGIN_ERROR'
      });
    }
  }, function (req, res, next) {
    if (res.locals.activity) {
      io.emit('Activity', res.locals.activity);
    }
    console.log('Login Successful');
    res.json({
      username: req.username
    });
  });

  app.post('/api/reset-password', _recaptcha.verifyMyCaptcha, _resetPassword.resetPassword);

  app.post('/api/reset-password/verify', _resetPassword.verifyResetPassword);

  app.post('/api/reset-password/new', _resetPassword.resetPasswordNew);

  app.post('/api/2fa/enable', IsAuthenticated, _auth.isUserBanned, _storeIp2.default, _tfa.ensuretfa, _tfa.enabletfa);

  app.post('/api/2fa/disable', IsAuthenticated, _storeIp2.default, _tfa.ensuretfa, _tfa.disabletfa);

  app.post('/api/2fa/unlock', IsAuthenticated, _auth.isUserBanned, _storeIp2.default, _tfa.unlocktfa);

  app.post('/api/publisher/add', IsAuthenticated, _auth.isUserBanned, _storeIp2.default, _tfa.ensuretfa, _publisher.addPublisher, function (req, res) {
    console.log('ADDED PUBLISHER');
    if (res.locals.error) {
      console.log(res.locals.error);
      res.status(401).send({
        error: res.locals.error
      });
    }
    if (res.locals.activity) {
      io.emit('Activity', res.locals.activity);
    }
    if (res.locals.publisher) {
      res.json(res.locals.publisher);
    }
  });

  app.post('/api/publisher/adzone/add', IsAuthenticated, _auth.isUserBanned, _storeIp2.default, _tfa.ensuretfa, _adzone.addAdZone, function (req, res) {
    console.log('ADDED ADZONE');
    if (res.locals.error) {
      console.log(res.locals.error);
      res.status(401).send({
        error: res.locals.error
      });
    }
    if (res.locals.activity) {
      io.emit('Activity', res.locals.activity);
    }
    if (res.locals.adzones) {
      res.json(res.locals.adzones);
    }
  });

  app.post('/api/publisher/verify', IsAuthenticated, _auth.isUserBanned, _storeIp2.default, _tfa.ensuretfa, _publisher.verifyPublisher, function (req, res) {
    console.log('ADDED PUBLISHER');
    if (res.locals.error) {
      console.log(res.locals.error);
      res.status(401).send({
        error: res.locals.error
      });
    }
    if (res.locals.publishers) {
      res.json(res.locals.publishers);
    }
  });

  app.get('/api/banner/all', IsAuthenticated, _auth.isUserBanned, _storeIp2.default, _tfa.ensuretfa, _banner.fetchBanners, function (req, res) {
    console.log('ADDED PUBLISHER');
    if (res.locals.error) {
      console.log(res.locals.error);
      res.status(401).send({
        error: res.locals.error
      });
    }
    if (res.locals.banners) {
      console.log(res.locals.banners);
      console.log('banners');
      res.json(res.locals.banners);
    }
  });

  app.get('/api/publisher/all', IsAuthenticated, _auth.isUserBanned, _storeIp2.default, _tfa.ensuretfa, _publisher.fetchPublishers, function (req, res) {
    console.log('ADDED PUBLISHER');
    if (res.locals.error) {
      console.log(res.locals.error);
      res.status(401).send({
        error: res.locals.error
      });
    }
    if (res.locals.publishers) {
      res.json(res.locals.publishers);
    }
  });

  app.post('/api/banner/add', IsAuthenticated, _auth.isUserBanned, _storeIp2.default, _tfa.ensuretfa, upload.single('banner'), _banner.addBanner, function (req, res) {
    console.log('ADDED BANNER');
    if (res.locals.error) {
      console.log(res.locals.error);
      res.status(401).send({
        error: res.locals.error
      });
    }
    if (res.locals.activity) {
      io.emit('Activity', res.locals.activity);
    }
    if (res.locals.banner) {
      res.json(res.locals.banner);
    }
  });

  app.post('/api/banner/order/cancel', IsAuthenticated, _auth.isUserBanned, _storeIp2.default, _tfa.ensuretfa, _banner.cancelBannerOrder, function (req, res) {
    console.log(req.body);
    console.log('yow');
    if (res.locals.error) {
      res.status(401).send({
        error: res.locals.error
      });
    }
    if (res.locals.activity) {
      io.emit('Activity', res.locals.activity);
    }
    if (res.locals.order) {
      res.json({
        order: res.locals.order,
        wallet: res.locals.wallet
      });
    }
  });

  app.post('/api/upload/avatar', IsAuthenticated, _auth.isUserBanned, _storeIp2.default, _tfa.ensuretfa, upload.single('avatar'), _upload.uploadAvatar, function (req, res) {
    console.log('UPLOADED AVATAR');
    if (res.locals.error) {
      console.log(res.locals.error);
      res.status(401).send({
        error: res.locals.error
      });
    }
    if (res.locals.avatar) {
      res.json(res.locals.avatar);
    }
  });

  // app.post('/contact/send', verifyMyCaptcha, contactSend);
  app.post('/api/chaininfo/block', function (req, res) {
    startSync(io, onlineUsers);
  });

  app.get('/api/price', _price2.default, function (req, res) {
    if (res.locals.error) {
      console.log(res.locals.error);
      res.status(401).send({
        error: res.locals.error
      });
    }
    if (res.locals.price) {
      res.json({
        price: res.locals.price
      });
    }
  });

  app.get('/api/domains', _domain.fetchDomains);

  app.get('/api/jackpots', _jackpot2.default, function (req, res) {
    if (res.locals.error) {
      res.status(401).send({
        error: res.locals.error
      });
    }
    if (res.locals.jackpots) {
      res.json({
        jackpots: res.locals.jackpots
      });
    }
  });

  app.get('/api/orders/surf', _order.fetchSurfOrders);

  app.get('/api/orders/banner', _banner.fetchBannerOrders);

  app.get('/api/logout', _ip.insertIp, _storeIp2.default, _auth.destroySession, function (req, res) {
    io.emit('Activity', res.locals.activity);
    res.redirect("/");
  });

  app.get('/api/users/total', _users.fetchUserCount);

  app.get('/api/webslots', IsAuthenticated, _auth.isUserBanned, _tfa.ensuretfa, _webslot.fetchWebslots);

  app.get('/api/faucetrecord', IsAuthenticated, _auth.isUserBanned, _tfa.ensuretfa, _faucet.fetchFaucetRecord, function (req, res) {
    console.log('FAUCET RECORD');
    console.log(res.locals.faucetRecord);
    if (res.locals.error) {
      res.status(401).send({
        error: res.locals.error
      });
    }
    if (res.locals.faucetRecord) {
      res.json({
        faucetRecord: res.locals.faucetRecord
      });
    }
  });

  app.get('/api/faucetrolls', IsAuthenticated, _auth.isUserBanned, _tfa.ensuretfa, _faucet.fetchFaucetRolls, function (req, res) {
    console.log('FAUCET RECORD');
    console.log(res.locals.faucetRolls);
    if (res.locals.error) {
      res.status(401).send({
        error: res.locals.error
      });
    }
    if (res.locals.faucetRolls) {
      res.json({
        faucetRolls: res.locals.faucetRolls
      });
    }
  });

  app.post('/api/faucetclaim', IsAuthenticated, _auth.isUserBanned, _storeIp2.default, _tfa.ensuretfa, _rateLimiter.rateLimiterMiddlewareFaucet, _recaptcha.verifyMyCaptcha, _faucet.claimFaucet, function (req, res) {
    if (res.locals.error) {
      res.status(401).send({
        error: res.locals.error
      });
    }
    if (res.locals.jackpot) {
      io.emit('updateJackpot', {
        total_tickets: res.locals.jackpot.total_tickets,
        jackpot_amount: res.locals.jackpot.jackpot_amount
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
        faucetRoll: res.locals.faucetRoll
      });
    }
  });

  app.get('/api/activity/all', _activity.fetchActivity, function (req, res) {
    if (res.locals.error) {
      res.status(401).send({
        error: res.locals.error
      });
    }
    if (res.locals.activity) {
      res.json({
        activity: res.locals.activity
      });
    }
  });

  app.get('/api/activity/user', IsAuthenticated, _auth.isUserBanned, _storeIp2.default, _tfa.ensuretfa, _activity.fetchRecentUserActivity, function (req, res) {
    if (res.locals.error) {
      res.status(401).send({
        error: res.locals.error
      });
    }
    if (res.locals.activity) {
      res.json({
        activity: res.locals.activity
      });
    }
  });

  app.post('/api/webslot/buy', IsAuthenticated, _auth.isUserBanned, _storeIp2.default, _tfa.ensuretfa,
  // rateLimiterMiddlewareIp,
  // rateLimiterMiddlewareUser,
  _webslot.buyWebslot, function (req, res) {
    if (res.locals.error) {
      console.log(res.locals.error);
      res.status(401).send({
        error: res.locals.error
      });
    }
    if (res.locals.activity) {
      io.emit('Activity', res.locals.activity);
    }
    if (res.locals.user && res.locals.wallet) {
      res.json({
        wallet: res.locals.wallet,
        webslot_amount: res.locals.user.webslot_amount,
        jackpot_tickets: res.locals.user.jackpot_tickets
      });
    }
  });

  app.post('/api/banners/buy', IsAuthenticated, _auth.isUserBanned, _storeIp2.default, _tfa.ensuretfa,
  // rateLimiterMiddlewareIp,
  // rateLimiterMiddlewareUser,
  _banner.buyBannerslot, function (req, res) {
    if (res.locals.error) {
      console.log(res.locals.error);
      res.status(401).send({
        error: res.locals.error
      });
    }
    if (res.locals.activity) {
      io.emit('Activity', res.locals.activity);
    }
    if (res.locals.user && res.locals.wallet) {
      res.json({
        wallet: res.locals.wallet,
        banners_amount: res.locals.user.banners_amount,
        jackpot_tickets: res.locals.user.jackpot_tickets
      });
    }
  });

  app.post('/api/publishers/buy', IsAuthenticated, _auth.isUserBanned, _storeIp2.default, _tfa.ensuretfa,
  // rateLimiterMiddlewareIp,
  // rateLimiterMiddlewareUser,
  _publisher.buyPublisherslot, function (req, res) {
    if (res.locals.error) {
      console.log(res.locals.error);
      res.status(401).send({
        error: res.locals.error
      });
    }
    if (res.locals.activity) {
      io.emit('Activity', res.locals.activity);
    }
    if (res.locals.user && res.locals.wallet) {
      res.json({
        wallet: res.locals.wallet,
        publishers_amount: res.locals.user.publishers_amount,
        jackpot_tickets: res.locals.user.jackpot_tickets
      });
    }
  });

  app.post('/api/adzone/buy', IsAuthenticated, _auth.isUserBanned, _storeIp2.default, _tfa.ensuretfa,
  // rateLimiterMiddlewareIp,
  // rateLimiterMiddlewareUser,
  _adzone.buyAdzoneslot, function (req, res) {
    if (res.locals.error) {
      console.log(res.locals.error);
      res.status(401).send({
        error: res.locals.error
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
        jackpot_tickets: res.locals.user.jackpot_tickets
      });
    }
  });

  app.post('/api/webslots/create', IsAuthenticated, _auth.isUserBanned, _storeIp2.default, _tfa.ensuretfa, _webslot.createWebslot, function (req, res, next) {
    if (req.authErr === 'INVALID_URL') {
      res.status(401).send({
        errorType: 'invalid_url',
        url: req.body.url
      });
    }
    if (res.locals.error) {
      res.status(401).send({
        error: res.locals.error
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
        domain: res.locals.domain
      });
    }
  });

  app.post('/api/report/create', IsAuthenticated, _auth.isUserBanned, _storeIp2.default, _tfa.ensuretfa, _recaptcha.verifyMyCaptcha, _report.createReport, function (req, res, next) {
    if (req.authErr === 'INVALID_URL') {
      res.status(401).send({
        errorType: 'invalid_url',
        url: req.body.url
      });
    }
    if (res.locals.error) {
      res.status(401).send({
        error: res.locals.error
      });
    }

    if (res.locals.report) {
      res.json({
        report: res.locals.report
      });
    }
  });

  app.post('/api/webslots/deactivate', IsAuthenticated, _auth.isUserBanned, _storeIp2.default, _tfa.ensuretfa, _webslot.deactivateWebslot, function (req, res) {
    if (res.locals.error) {
      console.log(res.locals.error);
      res.status(401).send({
        error: res.locals.error
      });
    }
    if (res.locals.webslot) {
      res.json({
        webslot: res.locals.webslot
      });
    }
  });

  app.post('/api/surf/complete', function (req, res, next) {
    if (isbot(req.get('user-agent'))) {
      res.status(401).send({
        error: 'BOT_NOT_ALLOWED'
      });
    } else {
      next();
    }
  }, IsAuthenticated, _auth.isUserBanned, _storeIp2.default, _tfa.ensuretfa, _rateLimiter.rateLimiterMiddlewareIp, _rateLimiter.rateLimiterMiddlewareUser, _recaptcha.isSurfCaptcha, _surf.surfComplete, function (req, res, next) {
    console.log('surf complete');
    if (res.locals.error) {
      console.log(res.locals.error);
      res.status(401).send({
        error: res.locals.error
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
          jackpot_amount: res.locals.jackpot.jackpot_amount
        });
      }

      if (res.locals.referredWallet1) {
        if (onlineUsers[res.locals.referredWallet1.userId.toString()]) {
          onlineUsers[res.locals.referredWallet1.userId.toString()].emit('updateWallet', {
            wallet: res.locals.referredWallet1
          });
        }
        io.emit('Activity', res.locals.referredActivity1);
      }
      if (res.locals.referredWallet2) {
        if (onlineUsers[res.locals.referredWallet2.userId.toString()]) {
          onlineUsers[res.locals.referredWallet2.userId.toString()].emit('updateWallet', {
            wallet: res.locals.referredWallet2
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
          domain: res.locals.domain
        });
      }

      sub.subscribe(expired_subKey, function () {
        pub.setex('surfVolume:', 9999999999999999, res.locals.lastStats.surf);
        pub.setex('surf:' + res.locals.lastStats.surf, 86400, res.locals.order.price);
      });

      res.json({
        wallet: res.locals.userWallet1,
        jackpot_tickets: res.locals.user1_jackpot_tickets,
        surfcount: res.locals.surfcount
      });
    }
  });

  app.get('/api/volume', function (req, res, next) {
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

  app.get('/api/surf/start', function (req, res, next) {
    console.log(req.get('user-agent'));
    console.log(isbot(req.get('user-agent')));
    console.log('user-agent');
    if (isbot(req.get('user-agent'))) {
      res.status(401).send({
        error: 'BOT_NOT_ALLOWED'
      });
    } else {
      next();
    }
  }, IsAuthenticated, _storeIp2.default, _auth.isUserBanned, _tfa.ensuretfa,
  // rateLimiterMiddlewareIp,
  // rateLimiterMiddlewareUser,
  _surf.surfStart, function (req, res) {
    console.log('SURF STARTED');
    if (res.locals.error) {
      console.log(res.locals.error);
      res.status(401).send({
        error: res.locals.error
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

  app.get('/api/user', IsAuthenticated, _auth.isUserBanned, _storeIp2.default, _tfa.ensuretfa, _user.fetchUser, function (req, res, next) {
    if (res.locals.error) {
      console.log(res.locals.error);
      res.status(401).send({
        error: res.locals.error
      });
    }
    if (res.locals.user) {
      res.json(res.locals.user);
    }
  });

  // User Create Order
  app.post('/api/banners/order/create', IsAuthenticated, _auth.isUserBanned, _storeIp2.default, _tfa.ensuretfa, _banner.createBannerOrder, function (req, res) {
    if (res.locals.error) {
      res.status(401).send({
        error: res.locals.error
      });
    }
    if (res.locals.activity) {
      io.emit('Activity', res.locals.activity);
    }
    if (res.locals.order && res.locals.wallet) {
      res.json({
        order: res.locals.order,
        wallet: res.locals.wallet
      });
    }
  });

  // User Create Order
  app.post('/api/webslot/order/create', IsAuthenticated, _auth.isUserBanned, _storeIp2.default, _tfa.ensuretfa, _order.createWebslotOrder, function (req, res) {
    if (res.locals.error) {
      res.status(401).send({
        error: res.locals.error
      });
    }
    if (res.locals.activity) {
      io.emit('Activity', res.locals.activity);
    }
    if (res.locals.order && res.locals.wallet) {
      res.json({
        order: res.locals.order,
        wallet: res.locals.wallet
      });
    }
  });

  app.post('/api/webslot/order/cancel', IsAuthenticated, _auth.isUserBanned, _storeIp2.default, _tfa.ensuretfa, _order.cancelWebslotOrder, function (req, res) {
    console.log(req.body);
    console.log('yow');
    if (res.locals.error) {
      res.status(401).send({
        error: res.locals.error
      });
    }
    if (res.locals.activity) {
      io.emit('Activity', res.locals.activity);
    }
    if (res.locals.order) {
      res.json({
        order: res.locals.order
      });
    }
  });

  // User Request Withdrawal
  app.post('/api/withdraw', IsAuthenticated, _auth.isUserBanned, _storeIp2.default, _tfa.ensuretfa, _wallet.withdraw, function (req, res) {
    if (res.locals.error) {
      console.log(res.locals.error);
      res.status(401).send({
        error: res.locals.error
      });
    } else if (!res.locals.error && res.locals.wallet && res.locals.transaction) {
      res.locals.transaction.txid = null;
      res.locals.transaction.blockId = null;
      res.json({
        wallet: res.locals.wallet,
        transaction: res.locals.transaction
      });
    }
  });
};

exports.default = router;