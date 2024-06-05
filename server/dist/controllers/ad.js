'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.adComplete = exports.adStart = undefined;

var _lodash = require('lodash');

var _express = require('express');

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

var _url = require('../helpers/url');

var _generateRandomString = require('../helpers/generateRandomString');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var redis = require('redis');
var bluebird = require('bluebird');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

var redisScan = require('node-redis-scan');

var port = process.env.PORT || 8080;
var CONF = { db: 3 };
var pub = redis.createClient(CONF);
var sub = redis.createClient(CONF);
var scanner = new redisScan(pub);
var expired_subKey = '__keyevent@' + CONF.db + '__:expired';
var subKey = '__keyevent@' + CONF.db + '__:set';

var _require = require('sequelize'),
    Sequelize = _require.Sequelize,
    Transaction = _require.Transaction,
    Op = _require.Op;

var adStart = exports.adStart = async function adStart(req, res, next) {
  console.log(req.body);
  var url = new URL('http://' + req.body.hostname);
  var parseResult = await (0, _url.parseUrl)(url);
  var domain = parseResult.domain + '.' + (parseResult.topLevelDomains && parseResult.topLevelDomains.join("."));
  var tempSubdomain = parseResult.subDomains && parseResult.subDomains.length > 0 ? parseResult.subDomains.join('.') : null;
  var subdomain = tempSubdomain === "www" ? null : tempSubdomain;
  console.log(parseResult);

  var publisher = await _models2.default.publisher.findOne({
    where: {
      code: req.body.metaContent,
      subdomain: subdomain
    },
    include: [{
      model: _models2.default.domain,
      as: 'domain',
      where: {
        domain: domain
      }
    }, {
      model: _models2.default.adzone,
      as: 'adzone',
      where: {
        id: req.body.adZoneId
      }
    }, {
      model: _models2.default.user,
      as: 'user'
    }]
  });

  if (!publisher) {
    console.log('PUBLISHER_OR_DOMAIN_OR_ADZONE_NOT_FOUND');
    res.locals.error = 'PUBLISHER_OR_DOMAIN_OR_ADZONE_NOT_FOUND';
    return next();
  }

  console.log(publisher.adzone[0].size);

  var ads = await _models2.default.bannerOrder.findAll({
    limit: 100,
    where: {
      phase: 'active'
    },
    order: [['price', 'DESC']],
    include: [{
      model: _models2.default.banner,
      as: 'banner',
      where: {
        size: publisher.adzone[0].size
      },
      required: true,
      include: [{
        model: _models2.default.domain,
        as: 'domain'
      }, {
        model: _models2.default.user,
        as: 'user',
        required: true,
        where: {
          id: _defineProperty({}, Op.not, publisher.userId)
        }
      }]
    }]
  });

  if (!ads) {
    res.locals.error = 'NO_ORDERS_AVAILABLE';
    return next();
  }

  // console.log(publisher);
  // console.log(ads);
  // console.log('ads');
  var ticketCode = (0, _generateRandomString.generateRandomStringLowCase)(8);

  var ad = ads[Math.floor(Math.random() * ads.length)];

  console.log(ad.banner);
  console.log(ad);
  var banner = ad.banner;


  var bannerSize = banner.size.split("x");

  var bannerUrl = banner.protocol + '//' + (banner.subdomain !== '' ? banner.subdomain + '.' : '') + banner.domain.domain + (banner.path !== '/' ? '' + banner.path : '') + (banner.search !== '' ? banner.search : '');

  console.log(banner);
  console.log('banner');
  console.log(banner.id);
  var ticket = await _models2.default.bannerOrderTickets.create({
    id: ticketCode,
    bannerOrderId: ad.id
  });

  res.locals.ad = {
    url: bannerUrl,
    banner_path: ad.banner.banner_path,
    code: ticket.id,
    width: bannerSize[0],
    height: bannerSize[1],
    bannerId: req.body.adZoneId
  };
  return next();
};

var adComplete = exports.adComplete = async function adComplete(req, res, next) {
  var ip = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log(req.body);
  console.log('adComplete');

  await _models2.default.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE
  }, async function (t) {
    console.log('wtf');
    var ticket = await _models2.default.bannerOrderTickets.findOne({
      where: {
        id: req.body.code
      },
      include: [{
        model: _models2.default.bannerOrder,
        as: 'bannerOrder',
        where: {
          phase: "active"
        },
        include: [{
          model: _models2.default.banner,
          as: 'banner',
          include: [{
            model: _models2.default.user,
            as: 'user',
            include: [{
              model: _models2.default.wallet,
              as: 'wallet'
            }]
          }]
        }]
      }],
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    var ipUsedBanner = await pub.getAsync(req.body.metaContent + '-' + ticket.bannerOrder.banner.id + '-' + ip + ':');
    var murmurUsedBanner = await pub.getAsync(req.body.metaContent + '-' + ticket.bannerOrder.banner.id + '-' + req.body.murmur + ':');
    if (ipUsedBanner !== null || murmurUsedBanner !== null) {
      console.log('done!!!!!!!!!!!!!!!!');
      await ticket.destroy({
        transaction: t,
        lock: t.LOCK.UPDATE
      });
      res.locals.ad = {
        state: 'ALREADY_USED_24H'
      };
      await t.commit();
      return next();
    }
    console.log('Response from getfn2:-');
    console.log(ipUsedBanner);
    console.log(murmurUsedBanner);
    sub.subscribe(expired_subKey, function () {
      // pub.setex('surfVolume:', 999999999999999999, res.locals.lastStats.surf);86400
      pub.setex(req.body.metaContent + '-' + ticket.bannerOrder.banner.id + '-' + ip + ':', 86400, '1');
      pub.setex(req.body.metaContent + '-' + ticket.bannerOrder.banner.id + '-' + req.body.murmur + ':', 86400, '1');
    });

    if (!ticket) {
      throw new Error('TICKET_NOT_FOUND');
    }

    var publisher = await _models2.default.publisher.findOne({
      where: {
        code: req.body.metaContent
      },
      include: [{
        model: _models2.default.adzone,
        as: 'adzone',
        where: {
          id: req.body.adZoneId
        }
      }, {
        model: _models2.default.user,
        as: 'user',
        include: [{
          model: _models2.default.wallet,
          as: 'wallet'
        }]
      }],
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (!publisher) {
      throw new Error('PUBLISHER_NOT_FOUND');
    }

    var fee = ticket.bannerOrder.price / 100 * 2;
    var referralCut = fee / 100 * 15;

    var createActivity = await _models2.default.activity.create({
      earnerId: publisher.userId,
      earner_balance: publisher.user.wallet.available + publisher.user.wallet.locked + (ticket.bannerOrder.price - fee),
      spenderId: ticket.bannerOrder.banner.userId,
      spender_balance: ticket.bannerOrder.banner.user.wallet.available + ticket.bannerOrder.banner.user.wallet.locked - ticket.bannerOrder.price,
      type: 'uniqueImpression',
      bannerOrderId: ticket.bannerOrder.id,
      publisherId: publisher.id,
      amount: ticket.bannerOrder.price
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    await ticket.bannerOrder.increment({
      filled: +1
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    await ticket.bannerOrder.banner.increment({
      impressions: +1,
      spend: ticket.bannerOrder.price
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    var advertisersWallet = await ticket.bannerOrder.banner.user.wallet.decrement({
      locked: ticket.bannerOrder.price,
      spend: ticket.bannerOrder.price
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (ticket.bannerOrder.filled >= ticket.bannerOrder.amount) {
      await ticket.bannerOrder.update({
        phase: 'fulfilled'
      }, {
        transaction: t,
        lock: t.LOCK.UPDATE
      });
    }

    await publisher.increment({
      impressions: +1,
      earned: ticket.bannerOrder.price - fee
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    console.log(publisher);
    console.log('publisher');
    console.log('publisher');
    console.log('publisher');
    console.log('publisher');
    console.log('publisher');
    console.log('publisher');
    console.log('publisher');
    console.log('publisher');
    console.log('publisher');
    console.log('publisher');

    await publisher.adzone[0].increment({
      impressions: +1,
      earned: ticket.bannerOrder.price - fee
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    await publisher.user.wallet.increment({
      available: ticket.bannerOrder.price - fee,
      earned: ticket.bannerOrder.price - fee
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });
    // ticket.banner.update({
    //  filled:
    // }, {
    //  transaction: t,
    //  lock: t.LOCK.UPDATE,
    // });

    var isReferredUser1 = await _models2.default.Referrals.findOne({
      where: {
        referrerID: ticket.bannerOrder.banner.userId
      },
      include: [{
        model: _models2.default.user,
        as: 'userReferred',
        attributes: ['id', 'username'],
        include: [{
          model: _models2.default.wallet,
          as: 'wallet'
        }]
      }],
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    var isReferredUser2 = await _models2.default.Referrals.findOne({
      where: {
        referrerID: publisher.userId
      },
      include: [{
        model: _models2.default.user,
        as: 'userReferred',
        attributes: ['id', 'username'],
        include: [{
          model: _models2.default.wallet,
          as: 'wallet'
        }]
      }],
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (isReferredUser1) {
      console.log(isReferredUser1.userReferred.wallet);
      await isReferredUser1.increment({
        earned: referralCut
      }, {
        transaction: t,
        lock: t.LOCK.UPDATE
      });
      res.locals.referredWallet1 = await isReferredUser1.userReferred.wallet.increment({
        available: referralCut,
        earned: referralCut
      }, {
        transaction: t,
        lock: t.LOCK.UPDATE
      });

      var createReferredActivity1 = await _models2.default.activity.create({
        type: 'referralBonus',
        amount: referralCut,
        earnerId: res.locals.referredWallet1.userId,
        earner_balance: res.locals.referredWallet1.locked + res.locals.referredWallet1.available,
        spenderId: ticket.bannerOrder.banner.userId,
        bannerOrderId: ticket.bannerOrder.id
      }, {
        transaction: t,
        lock: t.LOCK.UPDATE
      });
      res.locals.referredActivity1 = await _models2.default.activity.findOne({
        where: {
          id: createReferredActivity1.id
        },
        attributes: ['createdAt', 'type', 'amount'],
        include: [{
          model: _models2.default.user,
          as: 'earner',
          required: false,
          attributes: ['username']
        }, {
          model: _models2.default.user,
          as: 'spender',
          required: false,
          attributes: ['username']
        }],
        transaction: t,
        lock: t.LOCK.UPDATE
      });
    }

    if (isReferredUser2) {
      await isReferredUser2.increment({
        earned: referralCut
      }, {
        transaction: t,
        lock: t.LOCK.UPDATE
      });
      res.locals.referredWallet2 = await isReferredUser2.userReferred.wallet.increment({
        available: referralCut,
        earned: referralCut
      }, {
        transaction: t,
        lock: t.LOCK.UPDATE
      });
      var createReferredActivity2 = await _models2.default.activity.create({
        type: 'referralBonus',
        amount: referralCut,
        earnerId: res.locals.referredWallet2.userId,
        earner_balance: res.locals.referredWallet2.locked + res.locals.referredWallet2.available,
        spenderId: ticket.bannerOrder.banner.userId,
        bannerOrderId: ticket.bannerOrder.id
      }, {
        transaction: t,
        lock: t.LOCK.UPDATE
      });
      res.locals.referredActivity2 = await _models2.default.activity.findOne({
        where: {
          id: createReferredActivity2.id
        },
        attributes: ['createdAt', 'type', 'amount'],
        include: [{
          model: _models2.default.user,
          as: 'earner',
          required: false,
          attributes: ['username']
        }, {
          model: _models2.default.user,
          as: 'spender',
          required: false,
          attributes: ['username']
        }],
        transaction: t,
        lock: t.LOCK.UPDATE
      });
    }

    res.locals.activity = await _models2.default.activity.findOne({
      where: {
        id: createActivity.id
      },
      attributes: ['createdAt', 'type', 'amount'],
      include: [{
        model: _models2.default.publisher,
        as: 'publisher',
        required: false,
        attributes: ['id'],
        include: [{
          model: _models2.default.domain,
          as: 'domain',
          required: false,
          attributes: ['domain']
        }]
      }, {
        model: _models2.default.user,
        as: 'earner',
        required: false,
        attributes: ['username']
      }, {
        model: _models2.default.user,
        as: 'spender',
        required: false,
        attributes: ['username']
      }, {
        model: _models2.default.bannerOrder,
        as: 'bannerOrder',
        required: false,
        attributes: ['price', 'amount', 'filled'],
        include: [{
          model: _models2.default.banner,
          as: 'banner',
          required: false,
          attributes: ['protocol', 'subdomain', 'path', 'search'],
          include: [{
            model: _models2.default.domain,
            as: 'domain',
            required: false,
            attributes: ['domain', 'views']
          }]
        }]
      }],
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    var jackpot = await _models2.default.jackpot.findOne({
      order: [['createdAt', 'DESC']],
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    var updatedJackpot = await jackpot.update({
      jackpot_amount: jackpot.jackpot_amount + fee / 2,
      total_tickets: jackpot.total_tickets + 2
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    var jackpotTicketsPublisher = await publisher.user.update({
      jackpot_tickets: publisher.user.jackpot_tickets + 1
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    var jackpotTicketsAdvertiser = await ticket.bannerOrder.banner.user.update({
      jackpot_tickets: ticket.bannerOrder.banner.user.jackpot_tickets + 1
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    var previousStats = await _models2.default.stats.findAll({
      limit: 1,
      order: [['createdAt', 'DESC']],
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    if (!previousStats) {
      throw new Error('STATS_NOT_FOUND');
    }

    var lastStats = await previousStats[0].update({
      impression: previousStats[0].impression + 1
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE
    });
    console.log(lastStats);
    console.log('lastStats');

    res.locals.advertiserWallet = advertisersWallet;
    res.locals.publisherWallet = publisher.user.wallet;
    res.locals.jackpot = updatedJackpot;
    res.locals.jackpotTicketsAdvertiser = jackpotTicketsAdvertiser.jackpot_tickets;
    res.locals.jackpotTicketsPublisher = jackpotTicketsPublisher.jackpot_tickets;
    res.locals.ad = 'true';
    res.locals.price = ticket.bannerOrder.price;
    res.locals.lastStats = lastStats;

    await ticket.destroy({
      transaction: t,
      lock: t.LOCK.UPDATE
    });

    t.afterCommit(function () {
      return next();
    });
  }).catch(function (err) {
    res.locals.error = err.message;
    return next();
  });
  next();
};