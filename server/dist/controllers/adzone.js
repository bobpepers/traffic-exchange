'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buyAdzoneslot = exports.fetchAdzones = exports.addAdZone = undefined;

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

var _generateRandomString = require('../helpers/generateRandomString');

var _url = require('../helpers/url');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config(); // import { parseDomain } from "parse-domain";

var metaget = require('metaget');

var _require = require('sequelize'),
    Sequelize = _require.Sequelize,
    Transaction = _require.Transaction,
    Op = _require.Op;

/**
 * Add Adzone
 */


var addAdZone = exports.addAdZone = async function addAdZone(req, res, next) {
  console.log(req.body);
  console.log('add adzone');

  var publisher = await _models2.default.publisher.findOne({
    where: {
      id: req.body.publisherId,
      userId: req.user.id
    },
    include: [{
      model: _models2.default.adzone,
      as: 'adzone',
      required: false
    }]
  });

  if (!publisher) {
    res.locals.error = 'PUBLISHER_NOT_FOUND';
    return next();
  }

  if (publisher.adzone.length >= publisher.adzones_amount) {
    res.locals.error = "MAX_ADZONES";
    return next();
  }

  console.log(publisher);

  await _models2.default.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE
  }, async function (t) {
    res.locals.adzones = await _models2.default.adzone.create({
      size: req.body.adZoneResolution,
      publisherId: req.body.publisherId
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    console.log(res.locals.adzones);
    t.afterCommit(function () {
      next();
    });
  }).catch(function (err) {
    res.locals.error = err.message;
    next();
  });
};

/**
 * Verify Publisher
 */
var fetchAdzones = exports.fetchAdzones = async function fetchAdzones(req, res, next) {
  console.log('fetchAdzones');
  res.locals.adzones = await _models2.default.adzone.findAll({
    where: {
      userId: req.user.id
    },
    include: [{
      model: _models2.default.domain,
      as: 'domain'
    }]
  });
  next();
};

var buyAdzoneslot = exports.buyAdzoneslot = async function buyAdzoneslot(req, res, next) {
  await _models2.default.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE
  }, async function (t) {
    console.log('buy adzone');
    console.log(req.body);
    var publisher = await _models2.default.publisher.findOne({
      where: {
        id: req.body.id,
        userId: req.user.id
      },
      include: [{
        model: _models2.default.user,
        as: 'user',
        include: [{
          model: _models2.default.wallet,
          as: 'wallet'
        }]
      }],
      lock: t.LOCK.UPDATE,
      transaction: t
    });
    console.log(publisher);
    if (!publisher) {
      throw new Error('PUBLISHER_NOT_FOUND');
    }
    if (publisher.user.wallet.available < 15000 * 1e8) {
      console.log('NOT_ENOUGH_FUNDS');
      throw new Error('NOT_ENOUGH_FUNDS');
    }
    res.locals.user = await publisher.user.update({
      jackpot_tickets: publisher.user.jackpot_tickets + 750
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    res.locals.publisher = await publisher.update({
      adzones_amount: publisher.adzones_amount + 1
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    res.locals.wallet = await publisher.user.wallet.update({
      available: publisher.user.wallet.available - 15000 * 1e8,
      spend: publisher.user.wallet.spend + 15000 * 1e8
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
      type: 'buyAdzoneslot',
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