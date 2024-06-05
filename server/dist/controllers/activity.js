'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchRecentUserActivity = exports.fetchActivity = undefined;

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _require = require('sequelize'),
    Sequelize = _require.Sequelize,
    Transaction = _require.Transaction,
    Op = _require.Op;

var fetchActivity = exports.fetchActivity = async function fetchActivity(req, res, next) {
  try {
    res.locals.activity = await _models2.default.activity.findAll({
      order: [['createdAt', 'DESC']],
      limit: 100,
      attributes: ['createdAt', 'type', 'amount'],
      include: [{
        model: _models2.default.publisher,
        as: 'publisher',
        required: false,
        attributes: ['id', 'subdomain'],
        include: [{
          model: _models2.default.domain,
          as: 'domain',
          required: false,
          attributes: ['domain']
        }]
      }, {
        model: _models2.default.bannerOrder,
        as: 'bannerOrder',
        required: false,
        attributes: ['price', 'amount', 'filled'],
        include: [{
          model: _models2.default.banner,
          as: 'banner',
          required: false,
          include: [{
            model: _models2.default.domain,
            as: 'domain',
            required: false
          }]
        }]
      }, {
        model: _models2.default.user,
        as: 'spender',
        required: false,
        attributes: ['username']
      }, {
        model: _models2.default.user,
        as: 'earner',
        required: false,
        attributes: ['username']
      }, {
        model: _models2.default.ip,
        as: 'ip',
        required: false,
        attributes: ['address']
      }, {
        model: _models2.default.domain,
        as: 'domainActivity',
        required: false,
        attributes: ['domain']
      }, {
        model: _models2.default.transaction,
        as: 'txActivity',
        required: false,
        attributes: ['txid']
      }, {
        model: _models2.default.order,
        as: 'order',
        required: false,
        attributes: ['price', 'amount', 'filled'],
        include: [{
          model: _models2.default.webslot,
          as: 'webslot',
          required: false,
          attributes: ['protocol', 'subdomain', 'path', 'search'],
          include: [{
            model: _models2.default.domain,
            as: 'domain',
            required: false,
            attributes: ['domain', 'views']
          }]
        }]
      }]
    });
    // console.log(res.locals.activity);
    next();
  } catch (error) {
    res.locals.error = error;
    next();
  }
};

var fetchRecentUserActivity = exports.fetchRecentUserActivity = async function fetchRecentUserActivity(req, res, next) {
  try {
    var activities = await _models2.default.activity.findAll({
      order: [['createdAt', 'DESC']],
      where: _defineProperty({}, Op.or, [{
        spenderId: req.user.id
      }, {
        earnerId: req.user.id
      }]),
      attributes: ['createdAt', 'type', 'amount', 'earner_balance', 'spender_balance',
      // 'earnerId',
      'spenderId'],
      include: [{
        model: _models2.default.ip,
        as: 'ip',
        required: false
      }, {
        model: _models2.default.publisher,
        as: 'publisher',
        required: false,
        attributes: ['id', 'subdomain'],
        include: [{
          model: _models2.default.domain,
          as: 'domain',
          required: false,
          attributes: ['domain']
        }]
      }, {
        model: _models2.default.user,
        as: 'spender',
        required: false,
        attributes: ['username']
      }, {
        model: _models2.default.user,
        as: 'earner',
        required: false,
        attributes: ['username']
      }, {
        model: _models2.default.ip,
        as: 'ip',
        required: false,
        attributes: ['address']
      }, {
        model: _models2.default.domain,
        as: 'domainActivity',
        required: false,
        attributes: ['domain']
      }, {
        model: _models2.default.transaction,
        as: 'txActivity',
        required: false,
        attributes: ['txid']
      }, {
        model: _models2.default.order,
        as: 'order',
        required: false,
        attributes: ['price', 'amount', 'filled'],
        include: [{
          model: _models2.default.webslot,
          as: 'webslot',
          required: false,
          attributes: ['protocol', 'subdomain', 'path', 'search'],
          include: [{
            model: _models2.default.domain,
            as: 'domain',
            required: false,
            attributes: ['domain', 'views']
          }]
        }]
      }]
    });
    res.locals.activity = activities.map(function (activity) {
      var tmpActivity = activity;
      if (tmpActivity.spenderId === req.user.id) {
        if (tmpActivity.type === "referralBonus") {
          return false;
        }
        if (tmpActivity.type === "surfStart" || tmpActivity.type === "surfComplete") {
          // delete tmpActivity.dataValues.earnerId;
          delete tmpActivity.dataValues.spenderId;
          delete tmpActivity.dataValues.ip;
          return tmpActivity;
        }
      }
      // delete tmpActivity.dataValues.spenderId;
      delete tmpActivity.dataValues.earnerId;
      return tmpActivity;
    });
    // console.log('res.locals.activity');
    // console.log(res.locals.activity);
    // console.log('res.locals.activity');
    // console.log(req.user.id);
    next();
  } catch (error) {
    res.locals.error = error;
    next();
  }
};