import db from '../models';

const { Sequelize, Transaction, Op } = require('sequelize');
const { getInstance } = require('../services/rclient');

/**
 * isAdmin
 */
export const isAdmin = async (req, res, next) => {
  if (req.user.role !== 4) {
    console.log('unauthorized');
    res.status(401).send({
      error: 'Unauthorized',
    });
  } else {
    next();
  }
};

/**
 * Fetch admin withdrawals
 */
export const fetchAdminWithdrawals = async (req, res, next) => {
  console.log('fetchAdminWithdrawals');
  try {
    res.locals.withdrawals = await db.transaction.findAll({
      order: [['createdAt', 'DESC']],
      include: [{
        model: db.address,
        as: 'address',
        include: [{
          model: db.wallet,
          as: 'wallet',
          include: [{
            model: db.user,
            as: 'user',
          }],
        }],
      }],
      where: {
        type: 'send',
      },
    });
    console.log(res.locals.withdrawals);
    next();
  } catch (error) {
    res.locals.error = error;
    next();
  }
};

/**
 * Fetch admin withdrawals
 */
export const fetchAdminUserList = async (req, res, next) => {
  try {
    res.locals.userlist = await db.user.findAll({
      order: [['id', 'DESC']],
      attributes: ['id', 'username', 'email', 'banned'],
      include: [{
        model: db.wallet,
        as: 'wallet',
        include: [{
          model: db.address,
          as: 'addresses',
        }],
      }],
    });
    console.log('after find all');
    console.log(res.locals.userlist);
    next();
  } catch (error) {
    console.log(error);
    res.locals.error = error;
    next();
  }
};

/**
 * Fetch admin withdrawals
 */
export const fetchAdminUser = async (req, res, next) => {
  try {
    res.locals.user = await db.user.findOne({
      where: {
        id: req.body.id,
      },
      attributes: ['id', 'username', 'email', 'banned'],
      include: [
        {
          model: db.wallet,
          as: 'wallet',
          include: [{
            model: db.address,
            as: 'addresses',
          }],
        },
        {
          model: db.activity,
          // required: false,
          as: 'spender',
        },
        {
          model: db.activity,
          // required: false,
          as: 'earner',
        },
        {
          model: db.activityArchive,
          // required: false,
          as: 'archivedSpender',
        },
        {
          model: db.activityArchive,
          // required: false,
          as: 'archivedEarner',
        },

        {
          model: db.webslot,
          as: 'webslots',
          required: false,
          include: [
            {
              model: db.order,
              as: 'order',
              required: false,
            },
            {
              model: db.domain,
              as: 'domain',
              required: false,
            },
          ],
        },
      ],
    });
    next();
  } catch (error) {
    console.log(error);
    res.locals.error = error;
    next();
  }
};

/**
 * isAdmin
 */
export const acceptWithdraw = async (req, res, next) => {
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const transaction = await db.transaction.findOne({
      where: {
        id: req.body.id,
        phase: 'review',
      },
      include: [
        {
          model: db.address,
          as: 'address',
          include: [
            {
              model: db.wallet,
              as: 'wallet',
              include: [{
                model: db.user,
                as: 'user',
              }],
            },
          ],
        },
      ],
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    if (!transaction) {
      throw new Error('TRANSACTION_NOT_EXIST');
    }
    const amount = (((transaction.amount / 100) * 99) / 1e8);
    const response = await getInstance().sendToAddress(transaction.to_from, (amount.toFixed(8)).toString());
    res.locals.transaction = await transaction.update(
      {
        txid: response,
        phase: 'confirming',
      },
      {
        transaction: t,
        lock: t.LOCK.UPDATE,
      },
    );
    const activity = await db.activity.create(
      {
        spenderId: transaction.address.wallet.userId,
        type: 'withdrawAccepted',
        txId: transaction.id,
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
      console.log('complete');
      next();
    });
  }).catch((err) => {
    res.locals.error = err.message;
    next();
  });
};

/**
 * isAdmin
 */
export const rejectWithdraw = async (req, res, next) => {
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const transaction = await db.transaction.findOne({
      where: {
        id: req.body.id,
        phase: 'review',
      },
      include: [{
        model: db.address,
        as: 'address',
        include: [{
          model: db.wallet,
          as: 'wallet',
          include: [{
            model: db.user,
            as: 'user',
          }],
        }],
      }],
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!transaction) {
      throw new Error('TRANSACTION_NOT_EXIST');
    }

    const wallet = await db.wallet.findOne({
      where: {
        userId: transaction.address.wallet.userId,
      },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!wallet) {
      throw new Error('WALLET_NOT_EXIST');
    }

    const updatedWallet = await wallet.update({
      available: wallet.available + transaction.amount,
      locked: wallet.locked - transaction.amount,
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    res.locals.transaction = await transaction.update(
      {
        phase: 'rejected',
      },
      {
        transaction: t,
        lock: t.LOCK.UPDATE,
      },
    );

    const activity = await db.activity.create(
      {
        spenderId: transaction.address.wallet.userId,
        type: 'withdrawRejected',
        txId: res.locals.transaction.id,
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
      console.log('Withdrawal Rejected');
      next();
    });
  }).catch((err) => {
    res.locals.error = err.message;
    next();
  });
  console.log(req.body.id);
};

/**
 * Fetch admin publishers
 */
export const fetchAdminPublishers = async (req, res, next) => {
  try {
    res.locals.publishers = await db.publisher.findAll({
      include: [
        {
          model: db.domain,
          // required: false,
          as: 'domain',
        },
      ],
    });
    next();
  } catch (error) {
    console.log(error);
    res.locals.error = error;
    next();
  }
};

/**
 * Fetch admin publishers
 */
export const fetchAdminReviewPublishers = async (req, res, next) => {
  try {
    res.locals.publishers = await db.publisher.findAll({
      where: {
        verified: true,
        review: 'pending',
      },
      include: [
        {
          model: db.domain,
          // required: false,
          as: 'domain',
        },
      ],
    });
    next();
  } catch (error) {
    console.log(error);
    res.locals.error = error;
    next();
  }
};

/**
 * Fetch admin publishers
 */
export const fetchAdminBanners = async (req, res, next) => {
  try {
    res.locals.banners = await db.banner.findAll({
      include: [
        {
          model: db.domain,
          // required: false,
          as: 'domain',
        },
        {
          model: db.user,
          // required: false,
          as: 'user',
        },
      ],
    });
    next();
  } catch (error) {
    console.log(error);
    res.locals.error = error;
    next();
  }
};

export const fetchAdminReviewBanners = async (req, res, next) => {
  try {
    res.locals.banners = await db.banner.findAll({
      where: {
        review: 'pending',
      },
      include: [
        {
          model: db.domain,
          // required: false,
          as: 'domain',
        },
        {
          model: db.user,
          // required: false,
          as: 'user',
        },
      ],
    });
    next();
  } catch (error) {
    console.log(error);
    res.locals.error = error;
    next();
  }
};

export const acceptAdminReviewPublisher = async (req, res, next) => {
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const publisher = await db.publisher.findOne({
      where: {
        id: req.body.id,
      },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    res.locals.publishers = await publisher.update({
      review: 'accepted',
      adzones_amount: 11,
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    const adzone1 = await db.adzone.create({
      size: '120x60',
      publisherId: publisher.id,
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    const adzone2 = await db.adzone.create({
      size: '120x600',
      publisherId: publisher.id,
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    const adzone3 = await db.adzone.create({
      size: '125x125',
      publisherId: publisher.id,
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    const adzone4 = await db.adzone.create({
      size: '160x600',
      publisherId: publisher.id,
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    const adzone5 = await db.adzone.create({
      size: '250x250',
      publisherId: publisher.id,
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    const adzone6 = await db.adzone.create({
      size: '300x250',
      publisherId: publisher.id,
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    const adzone7 = await db.adzone.create({
      size: '300x600',
      publisherId: publisher.id,
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    const adzone8 = await db.adzone.create({
      size: '320x50',
      publisherId: publisher.id,
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    const adzone9 = await db.adzone.create({
      size: '728x90',
      publisherId: publisher.id,
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    const adzone10 = await db.adzone.create({
      size: '970x90',
      publisherId: publisher.id,
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    const adzone11 = await db.adzone.create({
      size: '970x250',
      publisherId: publisher.id,
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    t.afterCommit(() => {
      next();
    });
  }).catch((err) => {
    res.locals.error = err.message;
    next();
  });
};

export const rejectAdminReviewPublisher = async (req, res, next) => {
  try {
    const publisher = await db.publisher.findOne({
      where: {
        id: req.body.id,
      },
    });
    res.locals.publishers = await publisher.update({
      review: 'rejected',
    });
    next();
  } catch (error) {
    console.log(error);
    res.locals.error = error;
    next();
  }
};

export const acceptAdminReviewBanner = async (req, res, next) => {
  try {
    const banner = await db.banner.findOne({
      where: {
        id: req.body.id,
      },
    });
    res.locals.banners = await banner.update({
      review: 'accepted',
    });
    next();
  } catch (error) {
    console.log(error);
    res.locals.error = error;
    next();
  }
};

export const rejectAdminReviewBanner = async (req, res, next) => {
  try {
    console.log(req.body);
    console.log('req body');
    const banner = await db.banner.findOne({
      where: {
        id: req.body.id,
      },
    });
    res.locals.banners = await banner.update({
      review: 'rejected',
    });
    next();
  } catch (error) {
    console.log(error);
    res.locals.error = error;
    next();
  }
};

export const banAdminBanner = async (req, res, next) => {
  try {
    console.log(req.body);
    console.log('req body');
    const banner = await db.banner.findOne({
      where: {
        id: req.body.id,
      },
      include: [
        {
          model: db.domain,
          // required: false,
          as: 'domain',
        },
      ],
    });
    res.locals.banners = await banner.update({
      banned: !banner.banned,
    });
    next();
  } catch (error) {
    console.log(error);
    res.locals.error = error;
    next();
  }
};

export const banAdminPublisher = async (req, res, next) => {
  try {
    console.log(req.body);
    console.log('req body');
    const publisher = await db.publisher.findOne({
      where: {
        id: req.body.id,
      },
      include: [
        {
          model: db.domain,
          // required: false,
          as: 'domain',
        },
      ],
    });
    res.locals.publishers = await publisher.update({
      banned: !publisher.banned,
    });
    next();
  } catch (error) {
    console.log(error);
    res.locals.error = error;
    next();
  }
};

export const banAdminUser = async (req, res, next) => {
  try {
    console.log(req.body);
    console.log('req body');
    const user = await db.user.findOne({
      where: {
        id: req.body.id,
      },
      include: [{
        model: db.wallet,
        as: 'wallet',
        include: [{
          model: db.address,
          as: 'addresses',
        }],
      }],
    });
    res.locals.users = await user.update({
      banned: !user.banned,
    });
    next();
  } catch (error) {
    console.log(error);
    res.locals.error = error;
    next();
  }
};

export const banAdminDomain = async (req, res, next) => {
  try {
    console.log(req.body);
    console.log('req body');
    const domain = await db.domain.findOne({
      where: {
        id: req.body.id,
      },
    });
    res.locals.domains = await domain.update({
      banned: !domain.banned,
    });
    next();
  } catch (error) {
    console.log(error);
    res.locals.error = error;
    next();
  }
};

export const fetchAdminDomains = async (req, res, next) => {
  try {
    console.log(req.body);
    console.log('req body');
    res.locals.domains = await db.domain.findAll({});
    next();
  } catch (error) {
    console.log(error);
    res.locals.error = error;
    next();
  }
};
