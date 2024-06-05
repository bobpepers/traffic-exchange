'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buyPublisherslot = exports.fetchPublishers = exports.verifyPublisher = exports.addPublisher = undefined;

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

var _generateRandomString = require('../helpers/generateRandomString');

var _url = require('../helpers/url');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; } // import { parseDomain } from "parse-domain";


require('dotenv').config();
var metaget = require('metaget');

var _require = require('sequelize'),
    Sequelize = _require.Sequelize,
    Transaction = _require.Transaction,
    Op = _require.Op;

/**
 * Add Publisher
 */


var addPublisher = exports.addPublisher = async function addPublisher(req, res, next) {
  if ((0, _url.validateUrl)(req.body.url) === false) {
    res.locals.error = 'INVALID_URL';
    return next();
  }

  var url = new URL(req.body.url);
  var parseResult = await (0, _url.parseUrl)(req.body.url);

  var userPublishers = await _models2.default.publisher.findAll({
    where: {
      userId: req.user.id
    }
  });

  if (userPublishers.length >= req.user.publishers_amount) {
    res.locals.error = "MAX_PUBLISHER_ACCOUNT";
    return next();
  }

  if (!parseResult.topLevelDomains) {
    res.locals.error = 'TOP_LEVEL_DOMAIN_NOT_FOUND';
    return next();
  }

  var domain = parseResult.domain + '.' + parseResult.topLevelDomains.join(".");
  console.log(parseResult);
  var tempSubdomain = parseResult.subDomains.length > 0 ? parseResult.subDomains.join('.') : null;
  var subdomain = tempSubdomain === "www" ? null : tempSubdomain;
  console.log(subdomain);

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
      if (tempDomain.banned) {
        throw new Error('DOMAIN_BANNED');
      }
      domainRecord = tempDomain;
    }

    var publisher = await _models2.default.publisher.findOne({
      where: _defineProperty({}, Op.and, [{ userId: req.user.id }, { domainId: domainRecord.id }, { subdomain: subdomain }]),

      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (publisher) {
      console.log('PUBLISHER_ALREADY_EXIST');
      throw new Error('PUBLISHER_ALREADY_EXIST');
    }
    var verificationCode = (0, _generateRandomString.generateRandomStringLowCase)(24);

    var newPublisher = await _models2.default.publisher.create({
      userId: req.user.id,
      domainId: domainRecord.id,
      code: verificationCode,
      subdomain: subdomain
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    res.locals.publisher = await _models2.default.publisher.findOne({
      where: {
        id: newPublisher.id
      },
      include: [{
        model: _models2.default.domain,
        as: 'domain'
      }],
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    console.log(res.locals.publisher);
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
var verifyPublisher = exports.verifyPublisher = async function verifyPublisher(req, res, next) {
  console.log('verify publisher start');
  var metaResponse = void 0;
  var publisher = await _models2.default.publisher.findOne({
    where: {
      userId: req.user.id,
      id: req.body.id
    },
    include: [{
      model: _models2.default.domain,
      as: 'domain'
    }]
  });
  if (!publisher) {
    res.locals.error = "PUBLISHER_NOT_FOUND";
    return next();
  }
  if (publisher.verified) {
    res.locals.error = "PUBLISHER_ALREADY_VERIFIED";
    return next();
  }

  console.log(publisher);
  if (!publisher.subdomain) {
    try {
      metaResponse = await metaget.fetch('http://www.' + publisher.domain.domain);
    } catch (ex) {
      console.log('Fail', ex);
    }
    if (!metaResponse.runesx) {
      try {
        metaResponse = await metaget.fetch('https://www.' + publisher.domain.domain);
      } catch (ex) {
        console.log('Fail', ex);
      }
    }
    if (!metaResponse.runesx) {
      try {
        metaResponse = await metaget.fetch('http://' + publisher.domain.domain);
      } catch (ex) {
        console.log('Fail', ex);
      }
    }
    if (!metaResponse.runesx) {
      try {
        metaResponse = await metaget.fetch('https://' + publisher.domain.domain);
      } catch (ex) {
        console.log('Fail', ex);
      }
    }
  } else {
    try {
      metaResponse = await metaget.fetch('http://' + publisher.subdomain + '.' + publisher.domain.domain);
    } catch (ex) {
      console.log('Fail', ex);
    }
    if (!metaResponse.runesx) {
      try {
        metaResponse = await metaget.fetch('https://' + publisher.subdomain + '.' + publisher.domain.domain);
      } catch (ex) {
        console.log('Fail', ex);
      }
    }
  }

  if (!metaResponse.runesx) {
    res.locals.error = "METATAG_NOT_FOUND";
    return next();
  }
  if (metaResponse.runesx !== publisher.code) {
    res.locals.error = "VERIFICATION_CODE_NOT_MATCH";
    return next();
  }
  if (metaResponse.runesx === publisher.code) {
    var updatedPublisher = await publisher.update({
      verified: true
    });
    res.locals.publishers = updatedPublisher;
    next();
  }
};

/**
 * Fetch PriceInfo
 */
var fetchPublishers = exports.fetchPublishers = async function fetchPublishers(req, res, next) {
  res.locals.publishers = await _models2.default.publisher.findAll({
    where: {
      userId: req.user.id
    },
    include: [{
      model: _models2.default.domain,
      as: 'domain'
    }, {
      model: _models2.default.adzone,
      as: 'adzone'
    }]
  });
  next();
};

var buyPublisherslot = exports.buyPublisherslot = async function buyPublisherslot(req, res, next) {
  await _models2.default.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE
  }, async function (t) {
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
    if (user.wallet.available < 15000 * 1e8) {
      console.log('NOT_ENOUGH_FUNDS');
      throw new Error('NOT_ENOUGH_FUNDS');
    }
    res.locals.user = await user.update({
      publishers_amount: user.publishers_amount + 1,
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
      type: 'buyPublisherslot',
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