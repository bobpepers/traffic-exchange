import { noConflict } from 'lodash';
// import db from '../services/database';
import { generateVerificationToken } from '../helpers/generate';
import { generateRandomString } from '../helpers/generateRandomString';

import db from '../models';

const { Sequelize, Transaction, Op } = require('sequelize');

/**
 * Complete Surf
 */
export const surfComplete = async (req, res, next) => {
  const now = Math.floor(Date.now() / 1000);

  if (!req.body.verificationCode) {
    res.locals.error = "VERIFICATION_CODE_MISSING";
    next();
  }

  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const checkstats = await db.stats.findOne({
      where: {
        id: 1,
      },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    if (!checkstats) {
      await db.stats.create({
        id: 1,
      }, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
    }
    if (checkstats) {
      console.log('exists');
    }
    const ticket = await db.SurfTicket.findOne({
      where: {
        userId: req.user.id,
        code: req.body.verificationCode,
      },
      include: [
        {
          model: db.order,
          as: 'order',
          include: [
            {
              model: db.webslot,
              as: 'webslot',
              include: [
                {
                  model: db.domain,
                  as: 'domain',
                },
                {
                  model: db.user,
                  as: 'user',
                  attributes: [
                    'id',
                    'jackpot_tickets',
                    'surf_count',
                  ],
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
        {
          model: db.user,
          as: 'user',
          attributes: [
            'id',
            'jackpot_tickets',
            'surf_count',
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

    if (!ticket) {
      throw new Error('SURF_TICKET_NOT_FOUND');
    }

    if (ticket.createdAt > new Date(Date.now() - (1 * 60 * 1000))) {
      throw new Error('SURF_TOO_FAST');
    }

    const order = await ticket.order.update({
      filled: ticket.order.filled + 1,
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (order.filled >= order.amount) {
      await order.update({
        phase: 'fulfilled',
      }, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
    }

    const fee = ((order.price / 100) * 2);

    const userWallet1 = await ticket.user.wallet.update({
      available: ticket.user.wallet.available + ticket.order.price - fee,
      earned: ticket.user.wallet.earned + ticket.order.price - fee,
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    // const surfCounter = await ticket.user.update({
    //  surf_count: ticket.user.surf_count + 1,
    // }, {
    //  transaction: t,
    //  lock: t.LOCK.UPDATE,
    // });

    const userWallet2 = await ticket.order.webslot.user.wallet.update({
      locked: ticket.order.webslot.user.wallet.locked - ticket.order.price,
      spend: ticket.order.webslot.user.wallet.spend + ticket.order.price,
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    const webslot = await ticket.order.webslot.update({
      views: ticket.order.webslot.views + 1,
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    const domain = await ticket.order.webslot.domain.update({
      views: ticket.order.webslot.domain.views + 1,
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
      surf: previousStats[0].surf + 1,
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    const createActivity = await db.activity.create({
      type: 'surfComplete',
      amount: ticket.order.price,
      earnerId: ticket.user.id,
      earner_balance: (userWallet1.locked + userWallet1.available),
      spenderId: ticket.order.webslot.user.id,
      spender_balance: (userWallet2.locked + userWallet2.available),
      orderId: ticket.order.id,
      ipId: res.locals.ipId,
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    const activity = await db.activity.findOne({
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
          model: db.order,
          as: 'order',
          required: false,
          attributes: ['price', 'amount', 'filled'],
          include: [
            {
              model: db.webslot,
              as: 'webslot',
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

    const user1 = await ticket.user.update({
      jackpot_tickets: ticket.user.jackpot_tickets + 1,
      surf_count: ticket.user.surf_count + 1,
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    const user2 = await ticket.order.webslot.user.update({
      jackpot_tickets: ticket.order.webslot.user.jackpot_tickets + 1,
    }, {
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

    console.log(ticket);
    const isReferredUser1 = await db.Referrals.findOne({
      where: {
        referrerID: ticket.userId,
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
        referrerID: ticket.order.webslot.userId,
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

    const referralCut = ((fee / 100) * 15);
    console.log('before if referred');
    if (isReferredUser1) {
      console.log(isReferredUser1.userReferred.wallet);
      await isReferredUser1.update({
        earned: isReferredUser1.earned + referralCut,
      }, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      res.locals.referredWallet1 = await isReferredUser1.userReferred.wallet.update({
        available: isReferredUser1.userReferred.wallet.available + referralCut,
        earned: isReferredUser1.userReferred.wallet.earned + referralCut,
      }, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      const createReferredActivity1 = await db.activity.create({
        type: 'referralBonus',
        amount: referralCut,
        earnerId: res.locals.referredWallet1.userId,
        earner_balance: ((res.locals.referredWallet1.locked + res.locals.referredWallet1.available)),
        spenderId: ticket.userId,
        orderId: ticket.order.id,
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
      await isReferredUser2.update({
        earned: isReferredUser2.earned + referralCut,
      }, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      res.locals.referredWallet2 = await isReferredUser2.userReferred.wallet.update({
        available: isReferredUser2.userReferred.wallet.available + referralCut,
        earned: isReferredUser2.userReferred.wallet.earned + referralCut,
      }, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      const createReferredActivity2 = await db.activity.create({
        type: 'referralBonus',
        amount: referralCut,
        earnerId: res.locals.referredWallet2.userId,
        earner_balance: ((res.locals.referredWallet2.locked + res.locals.referredWallet2.available)),
        spenderId: ticket.order.webslot.userId,
        orderId: ticket.order.id,
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

    await ticket.destroy({
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    res.locals.surfcount = user1.surf_count;
    res.locals.jackpot = updatedJackpot;
    res.locals.order = order;
    res.locals.userWallet2 = userWallet2;
    res.locals.userId2 = ticket.order.webslot.user.id;
    res.locals.user2_jackpot_tickets = user2.jackpot_tickets;
    res.locals.userWallet1 = userWallet1;
    res.locals.userId1 = req.user.id;
    res.locals.user1_jackpot_tickets = user1.jackpot_tickets;
    res.locals.domain = domain;
    res.locals.webslot = webslot;
    res.locals.lastStats = lastStats;
    res.locals.activity = activity;
    t.afterCommit(() => {
      next();
      console.log('commited');
    });
  }).catch((err) => {
    console.log('surfcomplete error');
    console.log(err.message);
    res.locals.error = err.message;
    next();
  });
};

/**
 * Start a Surf
 */
export const surfStart = async (req, res, next) => {
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    console.log('const surf start');
    const existingTicket = await db.SurfTicket.findOne({
      where: {
        userId: req.user.id,
      },
      include: [
        {
          model: db.order,
          as: 'order',
          include: [
            {
              model: db.webslot,
              as: 'webslot',
              include: [
                {
                  model: db.domain,
                  as: 'domain',
                },
                {
                  model: db.user,
                  as: 'user',
                },
              ],
            },
          ],
        },
      ],
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    console.log('1');

    // console.log(existingTicket);
    if (existingTicket) {
      // console.log('existingTicket');
      // console.log(existingTicket);
      res.locals.surfTicket = {
        protocol: existingTicket.order.webslot.protocol,
        subdomain: existingTicket.order.webslot.subdomain,
        domain: existingTicket.order.webslot.domain.domain,
        path: existingTicket.order.webslot.path,
        search: existingTicket.order.webslot.search,
        verificationCode: existingTicket.code,
        user: existingTicket.order.webslot.user.username,
        user_avatar_path: existingTicket.order.webslot.user.avatar_path,
        price: existingTicket.order.price,
        description: existingTicket.order.webslot.description,
        domainId: existingTicket.order.webslot.domain.id,
        webslotId: existingTicket.order.webslot.id,
      };
    }

    if (!existingTicket) {
      // const verificationCode = generator(base, 8);
      const verificationCode = generateRandomString(8);

      // const verificationCode = await generateVerificationToken(1);
      // console.log('OUTPUT: ', verificationCode);
      console.log('3');

      const orders = await db.order.findAll({
        limit: 20,
        order: [['price', 'DESC']],
        where: {
          phase: 'active',
          [Op.and]: db.Sequelize.where(db.Sequelize.literal('amount-filled-(SELECT COUNT(*) FROM SurfTicket WHERE SurfTicket.orderId = order.id)'), '>', 0),
        },
        include: [
          {
            model: db.webslot,
            as: 'webslot',
            where: {
              [Op.not]: [
                { userId: req.user.id },
              ],
            },
            include: [
              {
                model: db.domain,
                as: 'domain',
                where: {
                  banned: 0,
                },
              },
              {
                model: db.user,
                as: 'user',
              },
            ],
          },
        ],
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      console.log('4');
      // console.log(orders);
      // console.log(orders.length);
      console.log('-----------------------Orders-------------------------');

      if (orders.length < 1) {
        throw new Error('NO_ORDERS_AVAILABLE');
      }

      const order = orders[Math.floor(Math.random() * orders.length)];

      // console.log('single ORDER ------------------');
      // console.log(order);
      console.log('5');
      await db.SurfTicket.create({
        userId: req.user.id,
        orderId: order.id,
        code: verificationCode,
      }, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      res.locals.surfcount = req.user.surf_count;
      console.log('res.locals.surfcount');
      console.log(res.locals.surfcount);

      const createActivity = await db.activity.create({
        earnerId: req.user.id,
        spenderId: order.webslot.userId,
        type: 'surfStart',
        orderId: order.id,
        ipId: res.locals.ipId,
      }, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

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
            model: db.order,
            as: 'order',
            required: false,
            attributes: ['price', 'amount', 'filled'],
            include: [
              {
                model: db.webslot,
                as: 'webslot',
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

      res.locals.surfTicket = {
        protocol: order.webslot.protocol,
        subdomain: order.webslot.subdomain,
        domain: order.webslot.domain.domain,
        path: order.webslot.path,
        search: order.webslot.search,
        verificationCode,
        user: order.webslot.user.username,
        user_avatar_path: order.webslot.user.avatar_path,
        price: order.price,
        description: order.webslot.description,
        domainId: order.webslot.domain.id,
        webslotId: order.webslot.id,
      };
    }
    t.afterCommit(() => {
      next();
    });
  }).catch((err) => {
    console.log('surfStart error');
    console.log(err.message);
    console.log(err.sql);
    res.locals.error = err.message;
    next();
  });
};
