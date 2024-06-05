import db from '../models';

import { validateUrl, parseUrl } from '../helpers/url';

const { Sequelize, Transaction, Op } = require('sequelize');

// Test this later
// const ipRegex = require('ip-regex');
// Is an IP address?
// ipRegex({exact: true}).test('unicorn 192.168.0.1');
// => false

export const createWebslot = async (req, res, next) => {
  const description = req.body.description || '';
  if (validateUrl(req.body.url) === false) {
    res.locals.error = 'INVALID_URL';
    next();
  }
  if (description > 400) {
    res.locals.error = 'DESCRIPTION_LENGTH_TOO_LONG';
    next();
  }
  const userWebslots = await db.webslot.findAll({
    where: {
      userId: req.user.id,
      active: 1,
    },
  });

  const tempUser = await db.user.findOne({
    where: {
      id: req.user.id,
    },
  });

  if (userWebslots.length >= tempUser.webslot_amount) {
    console.log('MAX_WEBSLOTS');
    res.locals.error = "MAX_WEBSLOTS";
    next();
  }

  const url = new URL(req.body.url);
  const parseResult = await parseUrl(req.body.url);

  const domain = `${parseResult.domain}.${parseResult.topLevelDomains.join(".")}`;
  const subdomain = parseResult.subDomains.join(".");

  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const result = await db.domain.findOrCreate({
      where: {
        domain,
      },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    console.log(result);
    console.log('add admoin');
    console.log(result[0].id);
    console.log(result[0]);
    if (result[1]) {
      const activity = await db.activity.create(
        {
          earnerId: req.user.id,
          type: 'newDomain',
          domainId: result[0].id,
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
            as: 'earner',
            required: false,
            attributes: ['username'],
          },
          {
            model: db.domain,
            as: 'domainActivity',
            required: false,
            attributes: ['domain'],
          },
        ],
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
    }

    const result2 = await db.DomainUser.findOrCreate({
      where: {
        userId: req.user.id,
        domainId: result[0].id,
      },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    const findWebslot = await db.webslot.findOne({
      where: {
        userId: req.user.id,
        domainId: result[0].id,
        protocol: url.protocol,
        subdomain,
        path: url.pathname,
        search: url.search,
      },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    if (findWebslot) {
      res.locals.webslot = await findWebslot.update({
        active: 1,
        description,
      }, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
    }
    if (!findWebslot) {
      res.locals.webslot = await db.webslot.create({
        userId: req.user.id,
        domainId: result[0].id,
        protocol: url.protocol,
        subdomain,
        path: url.pathname,
        search: url.search,
        description,
      }, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
    }
    res.locals.domain = result[0];
    t.afterCommit(() => {
      next();
    });
  }).catch((err) => {
    console.log(err);
    console.log('catch error add webslto');
    res.locals.error = err.message;
    next();
  });
};

export const deactivateWebslot = async (req, res, next) => {
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const webslot = await db.webslot.findOne(
      {
        where: {
          id: req.body.webslotId,
          userId: req.user.id,
        },
        include: [
          {
            model: db.order,
            as: 'order',
            where: {
              phase: 'active',
            },
            required: false,
          },
        ],
        lock: t.LOCK.UPDATE,
        transaction: t,
      },
    );
    if (!webslot) {
      throw new Error('WEBSLOT_NOT_FOUND');
    }
    if (webslot.order.length > 0) {
      throw new Error('HAS_ACTIVE_ORDERS');
    }
    res.locals.webslot = await webslot.update({
      active: false,
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    t.afterCommit(() => {
      console.log(res.locals.webslot);
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

export const fetchWebslots = (req, res, next) => {
  db.webslot.findAll({
    attributes: {
      exclude: [
        'domainId',
        'userId',
      ],
    },
    where: {
      active: true,
      userId: req.user.id,
      // [Op.or]: [
      //  {
      //    userId: req.user.id,
      //  },
      // ],
    },
    include: ['domain'],
  }).then((result) => {
    console.log(result);
    res.json(result);
  }).catch((error) => {
    console.log(error);
    res.status(403).json({ message: error });
  });
};

export const buyWebslot = async (req, res, next) => {
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    console.log('buy webslot');
    const user = await db.user.findOne({
      where: {
        id: req.user.id,
      },
      include: [
        {
          model: db.wallet,
          as: 'wallet',
        },
      ],
      lock: t.LOCK.UPDATE,
      transaction: t,
    });
    console.log(user);
    if (user.wallet.available < (5000 * 1e8)) {
      console.log('NOT_ENOUGH_FUNDS');
      throw new Error('NOT_ENOUGH_FUNDS');
    }
    res.locals.user = await user.update({
      webslot_amount: user.webslot_amount + 1,
      jackpot_tickets: user.jackpot_tickets + 250,
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    res.locals.wallet = await user.wallet.update({
      available: user.wallet.available - (5000 * 1e8),
      spend: user.wallet.spend + (5000 * 1e8),
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

    const jackpotFee = (((5000 * 1e8) / 100) * 1);
    res.locals.jackpot = await jackpot.update({
      jackpot_amount: jackpot.jackpot_amount + jackpotFee,
      total_tickets: jackpot.total_tickets + 250,
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    const activity = await db.activity.create(
      {
        spenderId: req.user.id,
        type: 'buyWebslot',
        amount: 500000000000,
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
