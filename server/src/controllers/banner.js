import { parseDomain } from "parse-domain";
import BigNumber from "bignumber.js";
import db from '../models';
import { generateRandomStringLowCase } from '../helpers/generateRandomString';
import { validateUrl, parseUrl } from '../helpers/url';

const sizeOf = require('image-size');
const metaget = require('metaget');

const { Sequelize, Transaction, Op } = require('sequelize');
const fs = require('fs').promises;

const path = require('path');

const appRoot = path.resolve(process.cwd());
/**
 * Fetch PriceInfo
 */
const ensureDirectoryExistence = async (filePath) => {
  const dirname = `${appRoot}/uploads/banner/${filePath}`;
  if (fs.existsSync(`dirname`)) {
    return true;
  }
  // ensureDirectoryExistence(dirname);
  try {
    await fs.mkdirSync(dirname);
  } catch (e) {
    console.log(e);
  }

  return true;
};

export const addBanner = async (req, res, next) => {
  if (validateUrl(req.body.url) === false) {
    res.locals.error = 'INVALID_URL';
    return next();
  }
  const url = new URL(req.body.url);
  const parseResult = await parseUrl(req.body.url);
  const domain = `${parseResult.domain}.${parseResult.topLevelDomains.join(".")}`;
  const subdomain = parseResult.subDomains.join(".");

  const tempBannerPath = `${appRoot}/uploads/temp/${req.file.filename}`;
  const finalBannerPath = `${appRoot}/uploads/banners/${domain}/${req.user.username}/${req.file.filename}`;
  const dimensions = sizeOf(tempBannerPath);
  const dimensionString = `${dimensions.width}x${dimensions.height}`;
  console.log(req.file);
  console.log(dimensionString);
  console.log(dimensionString);
  console.log(dimensionString);
  console.log(dimensionString);
  console.log(dimensionString);
  console.log(dimensionString);
  console.log(dimensionString);

  const userBanners = await db.banner.findAll({
    where: {
      userId: req.user.id,
    },
  });

  if (userBanners.length >= req.user.banners_amount) {
    res.locals.error = "MAX_BANNER_ACCOUNT";
    return next();
  }

  if (!parseResult.topLevelDomains) {
    res.locals.error = 'TOP_LEVEL_DOMAIN_NOT_FOUND';
    return next();
  }

  if (
    dimensionString !== '120x60'
    && dimensionString !== '120x600'
    && dimensionString !== '125x125'
    && dimensionString !== '160x600'
    && dimensionString !== '250x250'
    && dimensionString !== '300x250'
    && dimensionString !== '300x600'
    && dimensionString !== '320x50'
    && dimensionString !== '728x90'
    && dimensionString !== '970x90'
    && dimensionString !== '970x250'
  ) {
    try {
      await fs.unlink(tempBannerPath);
    } catch (err) {
      res.locals.error = 'UNABLE_TO_REMOVE_TEMP_IMAGE';
      return next();
    }
    res.locals.error = 'INVALID_BANNER_DIMENSIONS';
    return next();
  }

  try {
    await fs.mkdir(`${appRoot}/uploads/banners/${domain}/${req.user.username}`, { recursive: true });
  } catch (err) {
    res.locals.error = 'FAILED_TO_CREATE_DIRECTORY';
    return next();
  }

  try {
    await fs.rename(tempBannerPath, finalBannerPath);
  } catch (err) {
    res.locals.error = 'MOVE_DIRECTORY_ERROR';
    return next();
  }

  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    let domainRecord;
    const tempDomain = await db.domain.findOne({
      where: {
        domain,
      },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!tempDomain) {
      domainRecord = await db.domain.create({
        domain,
      }, {
        transaction: t,
        lock: t.LOCK.UPDATE,
      });
      const activity = await db.activity.create(
        {
          earnerId: req.user.id,
          type: 'newDomain',
          domainId: domainRecord.id,
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

    if (tempDomain) {
      domainRecord = tempDomain;
    }

    const newBanner = await db.banner.create({
      size: dimensionString,
      banner_path: `${domain}/${req.user.username}/${req.file.filename}`,
      userId: req.user.id,
      domainId: domainRecord.id,
      protocol: url.protocol,
      subdomain,
      path: url.pathname,
      search: url.search,
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    res.locals.banner = await db.banner.findOne({
      where: {
        id: newBanner.id,
      },
      include: [
        {
          model: db.domain,
          as: 'domain',
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
  });
};

/**
 * Fetch PriceInfo
 */
export const fetchBanners = async (req, res, next) => {
  res.locals.banners = await db.banner.findAll({
    where: {
      userId: req.user.id,
    },
    include: [
      {
        model: db.domain,
        as: 'domain',
      },
      {
        model: db.bannerOrder,
        as: 'bannerOrder',
        required: false,
        where: {
          phase: 'active',
        },
      },
    ],
  });
  next();
};

const countDecimals = function (value) {
  if (Math.floor(value) === value) return 0;
  return value.toString().split(".")[1].length || 0;
};
/**
 * Fetch PriceInfo
 */
export const createBannerOrder = async (req, res, next) => {
  const price = Number(((new BigNumber(req.body.price)).times(1e8)).toFixed(0));
  const total = Number(((new BigNumber(req.body.price).times(1e8)).times(req.body.amount)).toFixed(0));
  const amount = Number(req.body.amount);
  if (!(amount % 1 === 0)) {
    res.locals.error = 'AMOUNT_NOT_DIVISIBLE_BY_1_IMPRESSION';
    return next();
  }
  console.log('typeof req.amount');
  console.log('typeof req.amount');
  console.log('typeof req.amount');
  console.log('typeof req.amount');
  console.log('typeof req.amount');
  console.log('typeof req.amount');
  console.log(typeof amount);
  if (amount < 0) {
    res.locals.error = 'NEGATIVE_AMOUNT_NOT_ALLOWED';
    return next();
  }
  if (Number(req.body.price) % 1 !== 0) {
    if (countDecimals(req.body.price) > 8) {
      res.locals.error = 'MAX_8_DECIMALS';
      return next();
    }
  }
  if (Number(price) < 1000) {
    res.locals.error = 'MIN_BID_PRICE_1000';
    return next();
  }

  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const banner = await db.banner.findOne({
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
              attributes: [
                'id',
                'available',
                'locked',
              ],
            },
          ],
        },
      ],
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    console.log('1');

    if (banner === null) {
      console.log('banner not found');
      throw new Error('BANNER_NOT_EXIST');
    }

    if (banner.user.wallet.available < total) {
      console.log('not enough funds');
      throw new Error('NOT_ENOUGH_FUNDS');
    }
    console.log('2');
    res.locals.wallet = await banner.user.wallet.update({
      available: banner.user.wallet.available - total,
      locked: banner.user.wallet.locked + total,
    }, {
      transaction: t,
    });
    console.log('3');

    res.locals.order = await db.bannerOrder.create({
      price: ((new BigNumber(req.body.price)).times(1e8)).toFixed(0),
      amount,
      bannerId: banner.id,
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    const createActivity = await db.activity.create({
      spenderId: req.user.id,
      type: 'createBannerOrder',
      bannerOrderId: res.locals.order.id,
      ipId: res.locals.ipId,
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    console.log('41');

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
          model: db.bannerOrder,
          as: 'bannerOrder',
          required: false,
          attributes: ['price', 'amount'],
        },
      ],
    });

    console.log(banner);
    t.afterCommit(() => next());
  }).catch((err) => {
    res.locals.error = err.message;
    return next();
  });
};

export const cancelBannerOrder = async (req, res, next) => {
  console.log('cancel banner order here');
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const order = await db.bannerOrder.findOne(
      {
        where: {
          id: req.body.orderId,
          phase: 'active',
        },
        include: [
          {
            model: db.banner,
            as: 'banner',
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
    console.log('cancel banner order here 2');
    if (!order) {
      console.log('ORDER NOT FOUND');
      throw new Error('ORDER_NOT_FOUND');
    }
    console.log('cancel banner order here 3');
    res.locals.order = await order.update({
      phase: 'canceled',
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    console.log('cancel banner order here 4');
    res.locals.wallet = await order.banner.user.wallet.update({
      available: order.banner.user.wallet.available + ((order.amount - order.filled) * order.price),
      locked: order.banner.user.wallet.locked - ((order.amount - order.filled) * order.price),
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    console.log('cancel banner order here 5');
    const createActivity = await db.activity.create({
      spenderId: res.locals.order.banner.userId,
      type: 'cancelBannerOrder',
      bannerOrderId: res.locals.order.id,
      ipId: res.locals.ipId,
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    console.log('cancel banner order here 6');
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
          model: db.bannerOrder,
          as: 'bannerOrder',
          required: false,
          attributes: ['price', 'amount', 'filled'],
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
  });
};

export const fetchBannerOrders = async (req, res, next) => {
  const orders = await db.bannerOrder.findAll({
    where: {
      phase: 'active',
    },
    include: [
      {
        model: db.banner,
        as: 'banner',
      },
    ],
  });
  res.json({ data: orders });
};

export const buyBannerslot = async (req, res, next) => {
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
    if (!user) {
      throw new Error('USER_NOT_FOUND');
    }
    if (user.wallet.available < (15000 * 1e8)) {
      console.log('NOT_ENOUGH_FUNDS');
      throw new Error('NOT_ENOUGH_FUNDS');
    }
    res.locals.user = await user.update({
      banners_amount: user.banners_amount + 1,
      jackpot_tickets: user.jackpot_tickets + 750,
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    res.locals.wallet = await user.wallet.update({
      available: user.wallet.available - (15000 * 1e8),
      spend: user.wallet.spend + (15000 * 1e8),
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
        type: 'buyBannerslot',
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
