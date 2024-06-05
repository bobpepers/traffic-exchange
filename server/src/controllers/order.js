import db from '../models';

const { Sequelize, Transaction, Op } = require('sequelize');

const countDecimals = function (value) {
  if (Math.floor(value) === value) return 0;
  return value.toString().split(".")[1].length || 0;
};

/**
 * Create Order
 */
export const createWebslotOrder = async (req, res, next) => {
  const total = Number((((req.body.price * 1e8).toFixed(0)) * req.body.amount).toFixed(0));
  if (!(req.body.amount % 1 === 0)) {
    res.locals.error = 'AMOUNT_NOT_DIVISIBLE_BY_1_VIEW';
    return next();
  }

  if (req.body.amount < 0) {
    res.locals.error = 'NEGATIVE_AMOUNT_NOT_ALLOWED';
    return next();
  }

  if (req.body.price % 1 !== 0) {
    if (countDecimals(req.body.price) > 8) {
      res.locals.error = 'MAX_8_DECIMALS';
      return next();
    }
  }

  console.log('req.body.price');
  console.log(req.body.price);
  console.log((Number(req.body.price) * 1e8).toFixed(0));
  if (((req.body.price * 1e8).toFixed(0)) < 1000) {
    res.locals.error = 'MIN_BID_PRICE_1000';
    return next();
  }
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const webslot = await db.webslot.findOne({
      where: {
        userId: req.user.id,
        id: req.body.id,
      },
      attributes: ['id'],
      include: [
        {
          model: db.user,
          as: 'user',
          attributes: ['id'],
          include: [
            {
              model: db.wallet,
              as: 'wallet',
              attributes: ['id', 'available', 'locked'],
            },
          ],
        },
      ],
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (webslot === null) {
      throw new Error('WEBSLOT_NOT_EXIST');
    }

    if (webslot.user.wallet.available < total) {
      throw new Error('NOT_ENOUGH_FUNDS');
    }

    // webslot.user.wallet.available -= total;
    // webslot.user.wallet.locked += total;
    // await webslot.user.wallet.save({ transaction: t })

    res.locals.wallet = await webslot.user.wallet.update({
      available: webslot.user.wallet.available - total,
      locked: webslot.user.wallet.locked + total,
    }, {
      transaction: t,
    });

    res.locals.order = await db.order.create({
      price: Number(((req.body.price * 1e8).toFixed(0))),
      amount: req.body.amount,
      webslotId: webslot.id,
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    const createActivity = await db.activity.create({
      spenderId: req.user.id,
      type: 'createSurfOrder',
      orderId: res.locals.order.id,
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
          as: 'spender',
          required: false,
          attributes: ['username'],
        },
        {
          model: db.order,
          as: 'order',
          required: false,
          attributes: ['price', 'amount'],
        },
      ],
    });

    t.afterCommit(() => next());
  }).catch((err) => {
    res.locals.error = err.message;
    return next();
  });
};

/**
 * Cancel Order
 */

export const cancelWebslotOrder = async (req, res, next) => {
  console.log('cancel order here');
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const order = await db.order.findOne(
      {
        where: {
          id: req.body.orderId,
          phase: 'active',
        },
        include: [
          {
            model: db.SurfTicket,
            as: 'surfTicket',
          },
          {
            model: db.webslot,
            as: 'webslot',
            where: {
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
          },
        ],
        transaction: t,
        lock: t.LOCK.UPDATE,
      },
    );
    if (!order) {
      throw new Error('ORDER_NOT_FOUND');
    }

    res.locals.order = await order.update({
      phase: 'canceled',
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    console.log(`available: ${order.webslot.user.wallet.available}`);
    console.log(`amount: ${order.amount}`);
    console.log(`ticketlength: ${order.surfTicket.length}`);
    console.log(`price: ${order.price}`);

    console.log(order.webslot.user.wallet.available + ((order.amount - order.filled - order.surfTicket.length) * order.price));
    res.locals.wallet = await order.webslot.user.wallet.update({
      available: order.webslot.user.wallet.available + ((order.amount - order.filled - order.surfTicket.length) * order.price),
      locked: order.webslot.user.wallet.locked - ((order.amount - order.filled - order.surfTicket.length) * order.price),
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    const createActivity = await db.activity.create({
      spenderId: res.locals.order.webslot.userId,
      type: 'cancelSurfOrder',
      orderId: res.locals.order.id,
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
          as: 'spender',
          required: false,
          attributes: ['username'],
        },
        {
          model: db.order,
          as: 'order',
          required: false,
          attributes: ['price', 'amount', 'filled'],
        },
      ],
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    console.log(res.locals.order);

    t.afterCommit(() => {
      next();
    });
  }).catch((err) => {
    res.locals.error = err.message;
    next();
  });
};

export const fetchSurfOrders = async (req, res, next) => {
  const orders = await db.order.findAll({
    where: {
      phase: 'active',
    },
  });
  res.json({ data: orders });
};
