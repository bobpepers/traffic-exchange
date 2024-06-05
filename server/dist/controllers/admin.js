'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchAdminDomains = exports.banAdminDomain = exports.banAdminUser = exports.banAdminPublisher = exports.banAdminBanner = exports.rejectAdminReviewBanner = exports.acceptAdminReviewBanner = exports.rejectAdminReviewPublisher = exports.acceptAdminReviewPublisher = exports.fetchAdminReviewBanners = exports.fetchAdminBanners = exports.fetchAdminReviewPublishers = exports.fetchAdminPublishers = exports.rejectWithdraw = exports.acceptWithdraw = exports.fetchAdminUser = exports.fetchAdminUserList = exports.fetchAdminWithdrawals = exports.isAdmin = undefined;

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _require = require('sequelize'),
    Sequelize = _require.Sequelize,
    Transaction = _require.Transaction,
    Op = _require.Op;

var _require2 = require('../services/rclient'),
    getInstance = _require2.getInstance;

/**
 * isAdmin
 */


var isAdmin = exports.isAdmin = async function isAdmin(req, res, next) {
  if (req.user.role !== 4) {
    console.log('unauthorized');
    res.status(401).send({
      error: 'Unauthorized'
    });
  } else {
    next();
  }
};

/**
 * Fetch admin withdrawals
 */
var fetchAdminWithdrawals = exports.fetchAdminWithdrawals = async function fetchAdminWithdrawals(req, res, next) {
  console.log('fetchAdminWithdrawals');
  try {
    res.locals.withdrawals = await _models2.default.transaction.findAll({
      order: [['createdAt', 'DESC']],
      include: [{
        model: _models2.default.address,
        as: 'address',
        include: [{
          model: _models2.default.wallet,
          as: 'wallet',
          include: [{
            model: _models2.default.user,
            as: 'user'
          }]
        }]
      }],
      where: {
        type: 'send'
      }
    });
    console.log(res.locals.withdrawals);
    next();
  } catch (error) {
    res.locals.error = error;
    next();
  }
};

/**
 * Fetch admin withdrawals
 */
var fetchAdminUserList = exports.fetchAdminUserList = async function fetchAdminUserList(req, res, next) {
  try {
    res.locals.userlist = await _models2.default.user.findAll({
      order: [['id', 'DESC']],
      attributes: ['id', 'username', 'email', 'banned'],
      include: [{
        model: _models2.default.wallet,
        as: 'wallet',
        include: [{
          model: _models2.default.address,
          as: 'addresses'
        }]
      }]
    });
    console.log('after find all');
    console.log(res.locals.userlist);
    next();
  } catch (error) {
    console.log(error);
    res.locals.error = error;
    next();
  }
};

/**
 * Fetch admin withdrawals
 */
var fetchAdminUser = exports.fetchAdminUser = async function fetchAdminUser(req, res, next) {
  try {
    res.locals.user = await _models2.default.user.findOne({
      where: {
        id: req.body.id
      },
      attributes: ['id', 'username', 'email', 'banned'],
      include: [{
        model: _models2.default.wallet,
        as: 'wallet',
        include: [{
          model: _models2.default.address,
          as: 'addresses'
        }]
      }, {
        model: _models2.default.activity,
        // required: false,
        as: 'spender'
      }, {
        model: _models2.default.activity,
        // required: false,
        as: 'earner'
      }, {
        model: _models2.default.activityArchive,
        // required: false,
        as: 'archivedSpender'
      }, {
        model: _models2.default.activityArchive,
        // required: false,
        as: 'archivedEarner'
      }, {
        model: _models2.default.webslot,
        as: 'webslots',
        required: false,
        include: [{
          model: _models2.default.order,
          as: 'order',
          required: false
        }, {
          model: _models2.default.domain,
          as: 'domain',
          required: false
        }]
      }]
    });
    next();
  } catch (error) {
    console.log(error);
    res.locals.error = error;
    next();
  }
};

/**
 * isAdmin
 */
var acceptWithdraw = exports.acceptWithdraw = async function acceptWithdraw(req, res, next) {
  await _models2.default.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE
  }, async function (t) {
    var transaction = await _models2.default.transaction.findOne({
      where: {
        id: req.body.id,
        phase: 'review'
      },
      include: [{
        model: _models2.default.address,
        as: 'address',
        include: [{
          model: _models2.default.wallet,
          as: 'wallet',
          include: [{
            model: _models2.default.user,
            as: 'user'
          }]
        }]
      }],
      transaction: t,
      lock: t.LOCK.UPDATE
    });
    if (!transaction) {
      throw new Error('TRANSACTION_NOT_EXIST');
    }
    var amount = transaction.amount / 100 * 99 / 1e8;
    var response = await getInstance().sendToAddress(transaction.to_from, amount.toFixed(8).toString());
    res.locals.transaction = await transaction.update({
      txid: response,
      phase: 'confirming'
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });
    var activity = await _models2.default.activity.create({
      spenderId: transaction.address.wallet.userId,
      type: 'withdrawAccepted',
      txId: transaction.id
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });
    res.locals.activity = await _models2.default.activity.findOne({
      where: {
        id: activity.id
      },
      attributes: ['createdAt', 'type'],
      include: [{
        model: _models2.default.user,
        as: 'spender',
        required: false,
        attributes: ['username']
      }],
      transaction: t,
      lock: t.LOCK.UPDATE
    });
    t.afterCommit(function () {
      console.log('complete');
      next();
    });
  }).catch(function (err) {
    res.locals.error = err.message;
    next();
  });
};

/**
 * isAdmin
 */
var rejectWithdraw = exports.rejectWithdraw = async function rejectWithdraw(req, res, next) {
  await _models2.default.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE
  }, async function (t) {
    var transaction = await _models2.default.transaction.findOne({
      where: {
        id: req.body.id,
        phase: 'review'
      },
      include: [{
        model: _models2.default.address,
        as: 'address',
        include: [{
          model: _models2.default.wallet,
          as: 'wallet',
          include: [{
            model: _models2.default.user,
            as: 'user'
          }]
        }]
      }],
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (!transaction) {
      throw new Error('TRANSACTION_NOT_EXIST');
    }

    var wallet = await _models2.default.wallet.findOne({
      where: {
        userId: transaction.address.wallet.userId
      },
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (!wallet) {
      throw new Error('WALLET_NOT_EXIST');
    }

    var updatedWallet = await wallet.update({
      available: wallet.available + transaction.amount,
      locked: wallet.locked - transaction.amount
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    res.locals.transaction = await transaction.update({
      phase: 'rejected'
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    var activity = await _models2.default.activity.create({
      spenderId: transaction.address.wallet.userId,
      type: 'withdrawRejected',
      txId: res.locals.transaction.id
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });
    res.locals.activity = await _models2.default.activity.findOne({
      where: {
        id: activity.id
      },
      attributes: ['createdAt', 'type'],
      include: [{
        model: _models2.default.user,
        as: 'spender',
        required: false,
        attributes: ['username']
      }],
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    t.afterCommit(function () {
      console.log('Withdrawal Rejected');
      next();
    });
  }).catch(function (err) {
    res.locals.error = err.message;
    next();
  });
  console.log(req.body.id);
};

/**
 * Fetch admin publishers
 */
var fetchAdminPublishers = exports.fetchAdminPublishers = async function fetchAdminPublishers(req, res, next) {
  try {
    res.locals.publishers = await _models2.default.publisher.findAll({
      include: [{
        model: _models2.default.domain,
        // required: false,
        as: 'domain'
      }]
    });
    next();
  } catch (error) {
    console.log(error);
    res.locals.error = error;
    next();
  }
};

/**
 * Fetch admin publishers
 */
var fetchAdminReviewPublishers = exports.fetchAdminReviewPublishers = async function fetchAdminReviewPublishers(req, res, next) {
  try {
    res.locals.publishers = await _models2.default.publisher.findAll({
      where: {
        verified: true,
        review: 'pending'
      },
      include: [{
        model: _models2.default.domain,
        // required: false,
        as: 'domain'
      }]
    });
    next();
  } catch (error) {
    console.log(error);
    res.locals.error = error;
    next();
  }
};

/**
 * Fetch admin publishers
 */
var fetchAdminBanners = exports.fetchAdminBanners = async function fetchAdminBanners(req, res, next) {
  try {
    res.locals.banners = await _models2.default.banner.findAll({
      include: [{
        model: _models2.default.domain,
        // required: false,
        as: 'domain'
      }, {
        model: _models2.default.user,
        // required: false,
        as: 'user'
      }]
    });
    next();
  } catch (error) {
    console.log(error);
    res.locals.error = error;
    next();
  }
};

var fetchAdminReviewBanners = exports.fetchAdminReviewBanners = async function fetchAdminReviewBanners(req, res, next) {
  try {
    res.locals.banners = await _models2.default.banner.findAll({
      where: {
        review: 'pending'
      },
      include: [{
        model: _models2.default.domain,
        // required: false,
        as: 'domain'
      }, {
        model: _models2.default.user,
        // required: false,
        as: 'user'
      }]
    });
    next();
  } catch (error) {
    console.log(error);
    res.locals.error = error;
    next();
  }
};

var acceptAdminReviewPublisher = exports.acceptAdminReviewPublisher = async function acceptAdminReviewPublisher(req, res, next) {
  await _models2.default.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE
  }, async function (t) {
    var publisher = await _models2.default.publisher.findOne({
      where: {
        id: req.body.id
      },
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    res.locals.publishers = await publisher.update({
      review: 'accepted',
      adzones_amount: 11
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    var adzone1 = await _models2.default.adzone.create({
      size: '120x60',
      publisherId: publisher.id
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    var adzone2 = await _models2.default.adzone.create({
      size: '120x600',
      publisherId: publisher.id
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    var adzone3 = await _models2.default.adzone.create({
      size: '125x125',
      publisherId: publisher.id
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    var adzone4 = await _models2.default.adzone.create({
      size: '160x600',
      publisherId: publisher.id
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    var adzone5 = await _models2.default.adzone.create({
      size: '250x250',
      publisherId: publisher.id
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    var adzone6 = await _models2.default.adzone.create({
      size: '300x250',
      publisherId: publisher.id
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    var adzone7 = await _models2.default.adzone.create({
      size: '300x600',
      publisherId: publisher.id
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    var adzone8 = await _models2.default.adzone.create({
      size: '320x50',
      publisherId: publisher.id
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    var adzone9 = await _models2.default.adzone.create({
      size: '728x90',
      publisherId: publisher.id
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    var adzone10 = await _models2.default.adzone.create({
      size: '970x90',
      publisherId: publisher.id
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    var adzone11 = await _models2.default.adzone.create({
      size: '970x250',
      publisherId: publisher.id
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    t.afterCommit(function () {
      next();
    });
  }).catch(function (err) {
    res.locals.error = err.message;
    next();
  });
};

var rejectAdminReviewPublisher = exports.rejectAdminReviewPublisher = async function rejectAdminReviewPublisher(req, res, next) {
  try {
    var publisher = await _models2.default.publisher.findOne({
      where: {
        id: req.body.id
      }
    });
    res.locals.publishers = await publisher.update({
      review: 'rejected'
    });
    next();
  } catch (error) {
    console.log(error);
    res.locals.error = error;
    next();
  }
};

var acceptAdminReviewBanner = exports.acceptAdminReviewBanner = async function acceptAdminReviewBanner(req, res, next) {
  try {
    var banner = await _models2.default.banner.findOne({
      where: {
        id: req.body.id
      }
    });
    res.locals.banners = await banner.update({
      review: 'accepted'
    });
    next();
  } catch (error) {
    console.log(error);
    res.locals.error = error;
    next();
  }
};

var rejectAdminReviewBanner = exports.rejectAdminReviewBanner = async function rejectAdminReviewBanner(req, res, next) {
  try {
    console.log(req.body);
    console.log('req body');
    var banner = await _models2.default.banner.findOne({
      where: {
        id: req.body.id
      }
    });
    res.locals.banners = await banner.update({
      review: 'rejected'
    });
    next();
  } catch (error) {
    console.log(error);
    res.locals.error = error;
    next();
  }
};

var banAdminBanner = exports.banAdminBanner = async function banAdminBanner(req, res, next) {
  try {
    console.log(req.body);
    console.log('req body');
    var banner = await _models2.default.banner.findOne({
      where: {
        id: req.body.id
      },
      include: [{
        model: _models2.default.domain,
        // required: false,
        as: 'domain'
      }]
    });
    res.locals.banners = await banner.update({
      banned: !banner.banned
    });
    next();
  } catch (error) {
    console.log(error);
    res.locals.error = error;
    next();
  }
};

var banAdminPublisher = exports.banAdminPublisher = async function banAdminPublisher(req, res, next) {
  try {
    console.log(req.body);
    console.log('req body');
    var publisher = await _models2.default.publisher.findOne({
      where: {
        id: req.body.id
      },
      include: [{
        model: _models2.default.domain,
        // required: false,
        as: 'domain'
      }]
    });
    res.locals.publishers = await publisher.update({
      banned: !publisher.banned
    });
    next();
  } catch (error) {
    console.log(error);
    res.locals.error = error;
    next();
  }
};

var banAdminUser = exports.banAdminUser = async function banAdminUser(req, res, next) {
  try {
    console.log(req.body);
    console.log('req body');
    var user = await _models2.default.user.findOne({
      where: {
        id: req.body.id
      },
      include: [{
        model: _models2.default.wallet,
        as: 'wallet',
        include: [{
          model: _models2.default.address,
          as: 'addresses'
        }]
      }]
    });
    res.locals.users = await user.update({
      banned: !user.banned
    });
    next();
  } catch (error) {
    console.log(error);
    res.locals.error = error;
    next();
  }
};

var banAdminDomain = exports.banAdminDomain = async function banAdminDomain(req, res, next) {
  try {
    console.log(req.body);
    console.log('req body');
    var domain = await _models2.default.domain.findOne({
      where: {
        id: req.body.id
      }
    });
    res.locals.domains = await domain.update({
      banned: !domain.banned
    });
    next();
  } catch (error) {
    console.log(error);
    res.locals.error = error;
    next();
  }
};

var fetchAdminDomains = exports.fetchAdminDomains = async function fetchAdminDomains(req, res, next) {
  try {
    console.log(req.body);
    console.log('req body');
    res.locals.domains = await _models2.default.domain.findAll({});
    next();
  } catch (error) {
    console.log(error);
    res.locals.error = error;
    next();
  }
};