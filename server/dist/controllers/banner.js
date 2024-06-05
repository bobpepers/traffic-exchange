"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buyBannerslot = exports.fetchBannerOrders = exports.cancelBannerOrder = exports.createBannerOrder = exports.fetchBanners = exports.addBanner = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _parseDomain = require("parse-domain");

var _bignumber = require("bignumber.js");

var _bignumber2 = _interopRequireDefault(_bignumber);

var _models = require("../models");

var _models2 = _interopRequireDefault(_models);

var _generateRandomString = require("../helpers/generateRandomString");

var _url = require("../helpers/url");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sizeOf = require('image-size');
var metaget = require('metaget');

var _require = require('sequelize'),
    Sequelize = _require.Sequelize,
    Transaction = _require.Transaction,
    Op = _require.Op;

var fs = require('fs').promises;

var path = require('path');

var appRoot = path.resolve(process.cwd());
/**
 * Fetch PriceInfo
 */
var ensureDirectoryExistence = async function ensureDirectoryExistence(filePath) {
  var dirname = appRoot + "/uploads/banner/" + filePath;
  if (fs.existsSync("dirname")) {
    return true;
  }
  // ensureDirectoryExistence(dirname);
  try {
    await fs.mkdirSync(dirname);
  } catch (e) {
    console.log(e);
  }

  return true;
};

var addBanner = exports.addBanner = async function addBanner(req, res, next) {
  if ((0, _url.validateUrl)(req.body.url) === false) {
    res.locals.error = 'INVALID_URL';
    return next();
  }
  var url = new URL(req.body.url);
  var parseResult = await (0, _url.parseUrl)(req.body.url);
  var domain = parseResult.domain + "." + parseResult.topLevelDomains.join(".");
  var subdomain = parseResult.subDomains.join(".");

  var tempBannerPath = appRoot + "/uploads/temp/" + req.file.filename;
  var finalBannerPath = appRoot + "/uploads/banners/" + domain + "/" + req.user.username + "/" + req.file.filename;
  var dimensions = sizeOf(tempBannerPath);
  var dimensionString = dimensions.width + "x" + dimensions.height;
  console.log(req.file);
  console.log(dimensionString);
  console.log(dimensionString);
  console.log(dimensionString);
  console.log(dimensionString);
  console.log(dimensionString);
  console.log(dimensionString);
  console.log(dimensionString);

  var userBanners = await _models2.default.banner.findAll({
    where: {
      userId: req.user.id
    }
  });

  if (userBanners.length >= req.user.banners_amount) {
    res.locals.error = "MAX_BANNER_ACCOUNT";
    return next();
  }

  if (!parseResult.topLevelDomains) {
    res.locals.error = 'TOP_LEVEL_DOMAIN_NOT_FOUND';
    return next();
  }

  if (dimensionString !== '120x60' && dimensionString !== '120x600' && dimensionString !== '125x125' && dimensionString !== '160x600' && dimensionString !== '250x250' && dimensionString !== '300x250' && dimensionString !== '300x600' && dimensionString !== '320x50' && dimensionString !== '728x90' && dimensionString !== '970x90' && dimensionString !== '970x250') {
    try {
      await fs.unlink(tempBannerPath);
    } catch (err) {
      res.locals.error = 'UNABLE_TO_REMOVE_TEMP_IMAGE';
      return next();
    }
    res.locals.error = 'INVALID_BANNER_DIMENSIONS';
    return next();
  }

  try {
    await fs.mkdir(appRoot + "/uploads/banners/" + domain + "/" + req.user.username, { recursive: true });
  } catch (err) {
    res.locals.error = 'FAILED_TO_CREATE_DIRECTORY';
    return next();
  }

  try {
    await fs.rename(tempBannerPath, finalBannerPath);
  } catch (err) {
    res.locals.error = 'MOVE_DIRECTORY_ERROR';
    return next();
  }

  await _models2.default.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE
  }, async function (t) {
    var domainRecord = void 0;
    var tempDomain = await _models2.default.domain.findOne({
      where: {
        domain: domain
      },
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (!tempDomain) {
      domainRecord = await _models2.default.domain.create({
        domain: domain
      }, {
        transaction: t,
        lock: t.LOCK.UPDATE
      });
      var activity = await _models2.default.activity.create({
        earnerId: req.user.id,
        type: 'newDomain',
        domainId: domainRecord.id
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
          as: 'earner',
          required: false,
          attributes: ['username']
        }, {
          model: _models2.default.domain,
          as: 'domainActivity',
          required: false,
          attributes: ['domain']
        }],
        transaction: t,
        lock: t.LOCK.UPDATE
      });
    }

    if (tempDomain) {
      domainRecord = tempDomain;
    }

    var newBanner = await _models2.default.banner.create({
      size: dimensionString,
      banner_path: domain + "/" + req.user.username + "/" + req.file.filename,
      userId: req.user.id,
      domainId: domainRecord.id,
      protocol: url.protocol,
      subdomain: subdomain,
      path: url.pathname,
      search: url.search
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    res.locals.banner = await _models2.default.banner.findOne({
      where: {
        id: newBanner.id
      },
      include: [{
        model: _models2.default.domain,
        as: 'domain'
      }],
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

/**
 * Fetch PriceInfo
 */
var fetchBanners = exports.fetchBanners = async function fetchBanners(req, res, next) {
  res.locals.banners = await _models2.default.banner.findAll({
    where: {
      userId: req.user.id
    },
    include: [{
      model: _models2.default.domain,
      as: 'domain'
    }, {
      model: _models2.default.bannerOrder,
      as: 'bannerOrder',
      required: false,
      where: {
        phase: 'active'
      }
    }]
  });
  next();
};

var countDecimals = function countDecimals(value) {
  if (Math.floor(value) === value) return 0;
  return value.toString().split(".")[1].length || 0;
};
/**
 * Fetch PriceInfo
 */
var createBannerOrder = exports.createBannerOrder = async function createBannerOrder(req, res, next) {
  var price = Number(new _bignumber2.default(req.body.price).times(1e8).toFixed(0));
  var total = Number(new _bignumber2.default(req.body.price).times(1e8).times(req.body.amount).toFixed(0));
  var amount = Number(req.body.amount);
  if (!(amount % 1 === 0)) {
    res.locals.error = 'AMOUNT_NOT_DIVISIBLE_BY_1_IMPRESSION';
    return next();
  }
  console.log('typeof req.amount');
  console.log('typeof req.amount');
  console.log('typeof req.amount');
  console.log('typeof req.amount');
  console.log('typeof req.amount');
  console.log('typeof req.amount');
  console.log(typeof amount === "undefined" ? "undefined" : _typeof(amount));
  if (amount < 0) {
    res.locals.error = 'NEGATIVE_AMOUNT_NOT_ALLOWED';
    return next();
  }
  if (Number(req.body.price) % 1 !== 0) {
    if (countDecimals(req.body.price) > 8) {
      res.locals.error = 'MAX_8_DECIMALS';
      return next();
    }
  }
  if (Number(price) < 1000) {
    res.locals.error = 'MIN_BID_PRICE_1000';
    return next();
  }

  await _models2.default.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE
  }, async function (t) {
    var banner = await _models2.default.banner.findOne({
      where: {
        userId: req.user.id,
        id: req.body.id
      },
      attributes: ['id'],
      include: [{
        model: _models2.default.user,
        as: 'user',
        attributes: ['id'],
        include: [{
          model: _models2.default.wallet,
          as: 'wallet',
          attributes: ['id', 'available', 'locked']
        }]
      }]
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });
    console.log('1');

    if (banner === null) {
      console.log('banner not found');
      throw new Error('BANNER_NOT_EXIST');
    }

    if (banner.user.wallet.available < total) {
      console.log('not enough funds');
      throw new Error('NOT_ENOUGH_FUNDS');
    }
    console.log('2');
    res.locals.wallet = await banner.user.wallet.update({
      available: banner.user.wallet.available - total,
      locked: banner.user.wallet.locked + total
    }, {
      transaction: t
    });
    console.log('3');

    res.locals.order = await _models2.default.bannerOrder.create({
      price: new _bignumber2.default(req.body.price).times(1e8).toFixed(0),
      amount: amount,
      bannerId: banner.id
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    var createActivity = await _models2.default.activity.create({
      spenderId: req.user.id,
      type: 'createBannerOrder',
      bannerOrderId: res.locals.order.id,
      ipId: res.locals.ipId
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });
    console.log('41');

    res.locals.activity = await _models2.default.activity.findOne({
      where: {
        id: createActivity.id
      },
      attributes: ['createdAt', 'type', 'amount'],
      include: [{
        model: _models2.default.user,
        as: 'spender',
        required: false,
        attributes: ['username']
      }, {
        model: _models2.default.bannerOrder,
        as: 'bannerOrder',
        required: false,
        attributes: ['price', 'amount']
      }]
    });

    console.log(banner);
    t.afterCommit(function () {
      return next();
    });
  }).catch(function (err) {
    res.locals.error = err.message;
    return next();
  });
};

var cancelBannerOrder = exports.cancelBannerOrder = async function cancelBannerOrder(req, res, next) {
  console.log('cancel banner order here');
  await _models2.default.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE
  }, async function (t) {
    var order = await _models2.default.bannerOrder.findOne({
      where: {
        id: req.body.orderId,
        phase: 'active'
      },
      include: [{
        model: _models2.default.banner,
        as: 'banner',
        where: {
          userId: req.user.id
        },
        include: [{
          model: _models2.default.user,
          as: 'user',
          include: [{
            model: _models2.default.wallet,
            as: 'wallet'
          }]
        }]
      }],
      transaction: t,
      lock: t.LOCK.UPDATE
    });
    console.log('cancel banner order here 2');
    if (!order) {
      console.log('ORDER NOT FOUND');
      throw new Error('ORDER_NOT_FOUND');
    }
    console.log('cancel banner order here 3');
    res.locals.order = await order.update({
      phase: 'canceled'
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });
    console.log('cancel banner order here 4');
    res.locals.wallet = await order.banner.user.wallet.update({
      available: order.banner.user.wallet.available + (order.amount - order.filled) * order.price,
      locked: order.banner.user.wallet.locked - (order.amount - order.filled) * order.price
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });
    console.log('cancel banner order here 5');
    var createActivity = await _models2.default.activity.create({
      spenderId: res.locals.order.banner.userId,
      type: 'cancelBannerOrder',
      bannerOrderId: res.locals.order.id,
      ipId: res.locals.ipId
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });
    console.log('cancel banner order here 6');
    res.locals.activity = await _models2.default.activity.findOne({
      where: {
        id: createActivity.id
      },
      attributes: ['createdAt', 'type', 'amount'],
      include: [{
        model: _models2.default.user,
        as: 'spender',
        required: false,
        attributes: ['username']
      }, {
        model: _models2.default.bannerOrder,
        as: 'bannerOrder',
        required: false,
        attributes: ['price', 'amount', 'filled']
      }],
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

var fetchBannerOrders = exports.fetchBannerOrders = async function fetchBannerOrders(req, res, next) {
  var orders = await _models2.default.bannerOrder.findAll({
    where: {
      phase: 'active'
    },
    include: [{
      model: _models2.default.banner,
      as: 'banner'
    }]
  });
  res.json({ data: orders });
};

var buyBannerslot = exports.buyBannerslot = async function buyBannerslot(req, res, next) {
  await _models2.default.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE
  }, async function (t) {
    console.log('buy webslot');
    var user = await _models2.default.user.findOne({
      where: {
        id: req.user.id
      },
      include: [{
        model: _models2.default.wallet,
        as: 'wallet'
      }],
      lock: t.LOCK.UPDATE,
      transaction: t
    });
    console.log(user);
    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }
    if (user.wallet.available < 15000 * 1e8) {
      console.log('NOT_ENOUGH_FUNDS');
      throw new Error('NOT_ENOUGH_FUNDS');
    }
    res.locals.user = await user.update({
      banners_amount: user.banners_amount + 1,
      jackpot_tickets: user.jackpot_tickets + 750
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    res.locals.wallet = await user.wallet.update({
      available: user.wallet.available - 15000 * 1e8,
      spend: user.wallet.spend + 15000 * 1e8
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    var jackpot = await _models2.default.jackpot.findOne({
      order: [['createdAt', 'DESC']]
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    var jackpotFee = 15000 * 1e8 / 100 * 1;

    res.locals.jackpot = await jackpot.update({
      jackpot_amount: jackpot.jackpot_amount + jackpotFee,
      total_tickets: jackpot.total_tickets + 750
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    var activity = await _models2.default.activity.create({
      spenderId: req.user.id,
      type: 'buyBannerslot',
      amount: 15000 * 1e8,
      spender_balance: res.locals.wallet.available + res.locals.wallet.locked,
      ipId: res.locals.ipId
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
      next();
    });
  }).catch(function (err) {
    res.locals.error = err.message;
    next();
  }).catch(function (err) {
    res.locals.error = err.message;
    next();
  });
};