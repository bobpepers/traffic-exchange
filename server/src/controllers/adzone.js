// import { parseDomain } from "parse-domain";
import db from '../models';
import { generateRandomStringLowCase } from '../helpers/generateRandomString';
import { validateUrl, parseUrl } from '../helpers/url';

require('dotenv').config();
const metaget = require('metaget');

const { Sequelize, Transaction, Op } = require('sequelize');

/**
 * Add Adzone
 */
export const addAdZone = async (req, res, next) => {
  console.log(req.body);
  console.log('add adzone');

  const publisher = await db.publisher.findOne({
    where: {
      id: req.body.publisherId,
      userId: req.user.id,
    },
    include: [
      {
        model: db.adzone,
        as: 'adzone',
        required: false,
      },
    ],
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

  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    res.locals.adzones = await db.adzone.create({
      size: req.body.adZoneResolution,
      publisherId: req.body.publisherId,
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    console.log(res.locals.adzones);
    t.afterCommit(() => {
      next();
    });
  }).catch((err) => {
    res.locals.error = err.message;
    next();
  });
};

/**
 * Verify Publisher
 */
export const fetchAdzones = async (req, res, next) => {
  console.log('fetchAdzones');
  res.locals.adzones = await db.adzone.findAll({
    where: {
      userId: req.user.id,
    },
    include: [
      {
        model: db.domain,
        as: 'domain',
      },
    ],
  });
  next();
};

export const buyAdzoneslot = async (req, res, next) => {
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    console.log('buy adzone');
    console.log(req.body);
    const publisher = await db.publisher.findOne({
      where: {
        id: req.body.id,
        userId: req.user.id,
      },
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
      lock: t.LOCK.UPDATE,
      transaction: t,
    });
    console.log(publisher);
    if (!publisher) {
      throw new Error('PUBLISHER_NOT_FOUND');
    }
    if (publisher.user.wallet.available < (15000 * 1e8)) {
      console.log('NOT_ENOUGH_FUNDS');
      throw new Error('NOT_ENOUGH_FUNDS');
    }
    res.locals.user = await publisher.user.update({
      jackpot_tickets: publisher.user.jackpot_tickets + 750,
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    res.locals.publisher = await publisher.update({
      adzones_amount: publisher.adzones_amount + 1,
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    res.locals.wallet = await publisher.user.wallet.update({
      available: publisher.user.wallet.available - (15000 * 1e8),
      spend: publisher.user.wallet.spend + (15000 * 1e8),
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    const jackpot = await db.jackpot.findOne({
      order: [['createdAt', 'DESC']],
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    const jackpotFee = (((15000 * 1e8) / 100) * 1);

    res.locals.jackpot = await jackpot.update({
      jackpot_amount: jackpot.jackpot_amount + jackpotFee,
      total_tickets: jackpot.total_tickets + 750,
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    const activity = await db.activity.create(
      {
        spenderId: req.user.id,
        type: 'buyAdzoneslot',
        amount: (15000 * 1e8),
        spender_balance: res.locals.wallet.available + res.locals.wallet.locked,
        ipId: res.locals.ipId,
      },
      {
        transaction: t,
        lock: t.LOCK.UPDATE,
      },
    );
    res.locals.activity = await db.activity.findOne({
      where: {
        id: activity.id,
      },
      attributes: [
        'createdAt',
        'type',
      ],
      include: [
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

    t.afterCommit(() => {
      next();
    });
  }).catch((err) => {
    res.locals.error = err.message;
    next();
  }).catch((err) => {
    res.locals.error = err.message;
    next();
  });
};
