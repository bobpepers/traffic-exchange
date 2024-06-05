import { rest } from 'lodash';
import { response } from 'express';
import db from '../models';
import { parseUrl } from '../helpers/url';
import { generateRandomStringLowCase } from '../helpers/generateRandomString';

const redis = require('redis');
const bluebird = require('bluebird');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const redisScan = require('node-redis-scan');

const port = process.env.PORT || 8080;
const CONF = { db: 3 };
const pub = redis.createClient(CONF);
const sub = redis.createClient(CONF);
const scanner = new redisScan(pub);
const expired_subKey = `__keyevent@${CONF.db}__:expired`;
const subKey = `__keyevent@${CONF.db}__:set`;

const { Sequelize, Transaction, Op } = require('sequelize');

export const adStart = async (req, res, next) => {
  console.log(req.body);
  const url = new URL(`http://${req.body.hostname}`);
  const parseResult = await parseUrl(url);
  const domain = `${parseResult.domain}.${parseResult.topLevelDomains && parseResult.topLevelDomains.join(".")}`;
  const tempSubdomain = parseResult.subDomains && parseResult.subDomains.length > 0 ? parseResult.subDomains.join('.') : null;
  const subdomain = tempSubdomain === "www" ? null : tempSubdomain;
  console.log(parseResult);

  const publisher = await db.publisher.findOne({
    where: {
      code: req.body.metaContent,
      subdomain,
    },
    include: [
      {
        model: db.domain,
        as: 'domain',
        where: {
          domain,
        },
      },
      {
        model: db.adzone,
        as: 'adzone',
        where: {
          id: req.body.adZoneId,
        },
      },
      {
        model: db.user,
        as: 'user',
      },
    ],
  });

  if (!publisher) {
    console.log('PUBLISHER_OR_DOMAIN_OR_ADZONE_NOT_FOUND');
    res.locals.error = 'PUBLISHER_OR_DOMAIN_OR_ADZONE_NOT_FOUND';
    return next();
  }

  console.log(publisher.adzone[0].size);

  const ads = await db.bannerOrder.findAll({
    limit: 100,
    where: {
      phase: 'active',
    },
    order: [
      ['price', 'DESC'],
    ],
    include: [
      {
        model: db.banner,
        as: 'banner',
        where: {
          size: publisher.adzone[0].size,
        },
        required: true,
        include: [
          {
            model: db.domain,
            as: 'domain',
          },
          {
            model: db.user,
            as: 'user',
            required: true,
            where: {
              id: {
                [Op.not]: publisher.userId,
              },
            },
          },
        ],
      },
    ],
  });

  if (!ads) {
    res.locals.error = 'NO_ORDERS_AVAILABLE';
    return next();
  }

  // console.log(publisher);
  // console.log(ads);
  // console.log('ads');
  const ticketCode = generateRandomStringLowCase(8);

  const ad = ads[Math.floor(Math.random() * ads.length)];

  console.log(ad.banner);
  console.log(ad);
  const { banner } = ad;

  const bannerSize = banner.size.split("x");

  const bannerUrl = `${banner.protocol}//${banner.subdomain !== '' ? `${banner.subdomain}.` : ''}${banner.domain.domain}${banner.path !== '/' ? `${banner.path}` : ''}${banner.search !== '' ? banner.search : ''}`;

  console.log(banner);
  console.log('banner');
  console.log(banner.id);
  const ticket = await db.bannerOrderTickets.create({
    id: ticketCode,
    bannerOrderId: ad.id,
  });

  res.locals.ad = {
    url: bannerUrl,
    banner_path: ad.banner.banner_path,
    code: ticket.id,
    width: bannerSize[0],
    height: bannerSize[1],
    bannerId: req.body.adZoneId,
  };
  return next();
};

export const adComplete = async (req, res, next) => {
  const ip = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log(req.body);
  console.log('adComplete');

  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    console.log('wtf');
    const ticket = await db.bannerOrderTickets.findOne({
      where: {
        id: req.body.code,
      },
      include: [
        {
          model: db.bannerOrder,
          as: 'bannerOrder',
          where: {
            phase: "active",
          },
          include: [
            {
              model: db.banner,
              as: 'banner',
              include: [
                {
                  model: db.user,
                  as: 'user',
                  include: [
                    {
                      model: db.wallet,
                      as: 'wallet',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    const ipUsedBanner = await pub.getAsync(`${req.body.metaContent}-${ticket.bannerOrder.banner.id}-${ip}:`);
    const murmurUsedBanner = await pub.getAsync(`${req.body.metaContent}-${ticket.bannerOrder.banner.id}-${req.body.murmur}:`);
    if (ipUsedBanner !== null || murmurUsedBanner !== null) {
      console.log('done!!!!!!!!!!!!!!!!');
      await ticket.destroy({
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      res.locals.ad = {
        state: 'ALREADY_USED_24H',
      };
      await t.commit();
      return next();
    }
    console.log('Response from getfn2:-');
    console.log(ipUsedBanner);
    console.log(murmurUsedBanner);
    sub.subscribe(expired_subKey, () => {
    // pub.setex('surfVolume:', 999999999999999999, res.locals.lastStats.surf);86400
      pub.setex(`${req.body.metaContent}-${ticket.bannerOrder.banner.id}-${ip}:`, 86400, '1');
      pub.setex(`${req.body.metaContent}-${ticket.bannerOrder.banner.id}-${req.body.murmur}:`, 86400, '1');
    });

    if (!ticket) {
      throw new Error('TICKET_NOT_FOUND');
    }

    const publisher = await db.publisher.findOne({
      where: {
        code: req.body.metaContent,
      },
      include: [
        {
          model: db.adzone,
          as: 'adzone',
          where: {
            id: req.body.adZoneId,
          },
        },
        {
          model: db.user,
          as: 'user',
          include: [
            {
              model: db.wallet,
              as: 'wallet',
            },
          ],
        },
      ],
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!publisher) {
      throw new Error('PUBLISHER_NOT_FOUND');
    }

    const fee = ((ticket.bannerOrder.price / 100) * 2);
    const referralCut = ((fee / 100) * 15);

    const createActivity = await db.activity.create({
      earnerId: publisher.userId,
      earner_balance: ((publisher.user.wallet.available + publisher.user.wallet.locked) + (ticket.bannerOrder.price - fee)),
      spenderId: ticket.bannerOrder.banner.userId,
      spender_balance: ((ticket.bannerOrder.banner.user.wallet.available + ticket.bannerOrder.banner.user.wallet.locked) - ticket.bannerOrder.price),
      type: 'uniqueImpression',
      bannerOrderId: ticket.bannerOrder.id,
      publisherId: publisher.id,
      amount: ticket.bannerOrder.price,
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    await ticket.bannerOrder.increment(
      {
        filled: +1,
      }, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      },
    );

    await ticket.bannerOrder.banner.increment(
      {
        impressions: +1,
        spend: ticket.bannerOrder.price,
      }, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      },
    );

    const advertisersWallet = await ticket.bannerOrder.banner.user.wallet.decrement(
      {
        locked: ticket.bannerOrder.price,
        spend: ticket.bannerOrder.price,
      }, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      },
    );

    if (ticket.bannerOrder.filled >= ticket.bannerOrder.amount) {
      await ticket.bannerOrder.update(
        {
          phase: 'fulfilled',
        }, {
          transaction: t,
          lock: t.LOCK.UPDATE,
        },
      );
    }

    await publisher.increment(
      {
        impressions: +1,
        earned: (ticket.bannerOrder.price - fee),
      }, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      },
    );

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

    await publisher.adzone[0].increment(
      {
        impressions: +1,
        earned: (ticket.bannerOrder.price - fee),
      }, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      },
    );

    await publisher.user.wallet.increment(
      {
        available: (ticket.bannerOrder.price - fee),
        earned: (ticket.bannerOrder.price - fee),
      }, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      },
    );
    // ticket.banner.update({
    //  filled:
    // }, {
    //  transaction: t,
    //  lock: t.LOCK.UPDATE,
    // });

    const isReferredUser1 = await db.Referrals.findOne({
      where: {
        referrerID: ticket.bannerOrder.banner.userId,
      },
      include: [
        {
          model: db.user,
          as: 'userReferred',
          attributes: [
            'id',
            'username',
          ],
          include: [
            {
              model: db.wallet,
              as: 'wallet',
            },
          ],
        },
      ],
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    const isReferredUser2 = await db.Referrals.findOne({
      where: {
        referrerID: publisher.userId,
      },
      include: [
        {
          model: db.user,
          as: 'userReferred',
          attributes: [
            'id',
            'username',
          ],
          include: [
            {
              model: db.wallet,
              as: 'wallet',
            },
          ],
        },
      ],
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (isReferredUser1) {
      console.log(isReferredUser1.userReferred.wallet);
      await isReferredUser1.increment({
        earned: referralCut,
      }, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      res.locals.referredWallet1 = await isReferredUser1.userReferred.wallet.increment({
        available: referralCut,
        earned: referralCut,
      }, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      const createReferredActivity1 = await db.activity.create({
        type: 'referralBonus',
        amount: referralCut,
        earnerId: res.locals.referredWallet1.userId,
        earner_balance: ((res.locals.referredWallet1.locked + res.locals.referredWallet1.available)),
        spenderId: ticket.bannerOrder.banner.userId,
        bannerOrderId: ticket.bannerOrder.id,
      }, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      res.locals.referredActivity1 = await db.activity.findOne({
        where: {
          id: createReferredActivity1.id,
        },
        attributes: [
          'createdAt',
          'type',
          'amount',
        ],
        include: [
          {
            model: db.user,
            as: 'earner',
            required: false,
            attributes: ['username'],
          },
          {
            model: db.user,
            as: 'spender',
            required: false,
            attributes: ['username'],
          },
        ],
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
    }

    if (isReferredUser2) {
      await isReferredUser2.increment({
        earned: referralCut,
      }, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      res.locals.referredWallet2 = await isReferredUser2.userReferred.wallet.increment({
        available: referralCut,
        earned: referralCut,
      }, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      const createReferredActivity2 = await db.activity.create({
        type: 'referralBonus',
        amount: referralCut,
        earnerId: res.locals.referredWallet2.userId,
        earner_balance: ((res.locals.referredWallet2.locked + res.locals.referredWallet2.available)),
        spenderId: ticket.bannerOrder.banner.userId,
        bannerOrderId: ticket.bannerOrder.id,
      }, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      res.locals.referredActivity2 = await db.activity.findOne({
        where: {
          id: createReferredActivity2.id,
        },
        attributes: [
          'createdAt',
          'type',
          'amount',
        ],
        include: [
          {
            model: db.user,
            as: 'earner',
            required: false,
            attributes: ['username'],
          },
          {
            model: db.user,
            as: 'spender',
            required: false,
            attributes: ['username'],
          },
        ],
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
    }

    res.locals.activity = await db.activity.findOne({
      where: {
        id: createActivity.id,
      },
      attributes: [
        'createdAt',
        'type',
        'amount',
      ],
      include: [
        {
          model: db.publisher,
          as: 'publisher',
          required: false,
          attributes: ['id'],
          include: [
            {
              model: db.domain,
              as: 'domain',
              required: false,
              attributes: ['domain'],
            },
          ],
        },
        {
          model: db.user,
          as: 'earner',
          required: false,
          attributes: ['username'],
        },
        {
          model: db.user,
          as: 'spender',
          required: false,
          attributes: ['username'],
        },
        {
          model: db.bannerOrder,
          as: 'bannerOrder',
          required: false,
          attributes: ['price', 'amount', 'filled'],
          include: [
            {
              model: db.banner,
              as: 'banner',
              required: false,
              attributes: ['protocol', 'subdomain', 'path', 'search'],
              include: [
                {
                  model: db.domain,
                  as: 'domain',
                  required: false,
                  attributes: ['domain', 'views'],
                },
              ],
            },
          ],
        },
      ],
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    const jackpot = await db.jackpot.findOne({
      order: [['createdAt', 'DESC']],
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    const updatedJackpot = await jackpot.update({
      jackpot_amount: jackpot.jackpot_amount + (fee / 2),
      total_tickets: jackpot.total_tickets + 2,
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    const jackpotTicketsPublisher = await publisher.user.update({
      jackpot_tickets: publisher.user.jackpot_tickets + 1,
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    const jackpotTicketsAdvertiser = await ticket.bannerOrder.banner.user.update({
      jackpot_tickets: ticket.bannerOrder.banner.user.jackpot_tickets + 1,
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    const previousStats = await db.stats.findAll({
      limit: 1,
      order: [['createdAt', 'DESC']],
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!previousStats) {
      throw new Error('STATS_NOT_FOUND');
    }

    const lastStats = await previousStats[0].update({
      impression: previousStats[0].impression + 1,
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
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
      lock: t.LOCK.UPDATE,
    });

    t.afterCommit(() => next());
  }).catch((err) => {
    res.locals.error = err.message;
    return next();
  });
  next();
};
