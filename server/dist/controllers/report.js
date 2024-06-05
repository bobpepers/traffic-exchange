'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchReports = exports.createReport = undefined;

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _require = require('sequelize'),
    Sequelize = _require.Sequelize,
    Transaction = _require.Transaction,
    Op = _require.Op;

var createReport = exports.createReport = async function createReport(req, res, next) {
  var reason = req.body.reason || false;
  var description = req.body.description || false;
  var webslotId = req.body.webslotId || false;
  var domainId = req.body.domainId || false;
  var userId = req.user.id || false;
  console.log(req.user.id);
  console.log('req.user');
  if (!userId) {
    res.locals.error = 'USER_ID_NOT_FOUND';
    next();
  }
  if (!webslotId) {
    res.locals.error = 'WEBSLOT_ID_NOT_FOUND';
    next();
  }
  if (!domainId) {
    res.locals.error = 'DOMAIN_ID_NOT_FOUND';
    next();
  }
  if (!reason) {
    res.locals.error = 'REASON_NOT_FOUND';
    next();
  }
  if (!description) {
    res.locals.error = 'DESCRIPTION_NOT_FOUND';
    next();
  }
  if (description > 400) {
    res.locals.error = 'DESCRIPTION_LENGTH_TOO_LONG';
    next();
  }

  await _models2.default.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE
  }, async function (t) {
    var webslot = await _models2.default.webslot.findOne({
      where: {
        id: webslotId
      }
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (!webslot) {
      throw new Error('WEBSLOT_NOT_FOUND');
    }

    var domain = await _models2.default.domain.findOne({
      where: {
        id: domainId
      }
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (!domain) {
      throw new Error('DOMAIN_NOT_FOUND');
    }

    var report = await _models2.default.report.create({
      reason: reason,
      description: description,
      webslotId: webslotId,
      domainId: domainId,
      userId: userId
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (!report) {
      throw new Error('FAILED_CREATING_REPORT');
    }

    res.locals.report = report;

    t.afterCommit(function () {
      next();
    });
  }).catch(function (err) {
    res.locals.error = err.message;
    next();
  });
};

var fetchReports = exports.fetchReports = async function fetchReports(req, res, next) {
  console.log('123');
};