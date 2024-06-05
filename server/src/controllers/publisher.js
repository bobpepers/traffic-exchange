// import { parseDomain } from "parse-domain";
import db from '../models';
import { generateRandomStringLowCase } from '../helpers/generateRandomString';
import { validateUrl, parseUrl } from '../helpers/url';

require('dotenv').config();
const metaget = require('metaget');

const { Sequelize, Transaction, Op } = require('sequelize');

/**
 * Add Publisher
 */
export const addPublisher = async (req, res, next) => {
  if (validateUrl(req.body.url) === false) {
    res.locals.error = 'INVALID_URL';
    return next();
  }

  const url = new URL(req.body.url);
  const parseResult = await parseUrl(req.body.url);

  const userPublishers = await db.publisher.findAll({
    where: {
      userId: req.user.id,
    },
  });

  if (userPublishers.length >= req.user.publishers_amount) {
    res.locals.error = "MAX_PUBLISHER_ACCOUNT";
    return next();
  }

  if (!parseResult.topLevelDomains) {
    res.locals.error = 'TOP_LEVEL_DOMAIN_NOT_FOUND';
    return next();
  }

  const domain = `${parseResult.domain}.${parseResult.topLevelDomains.join(".")}`;
  console.log(parseResult);
  const tempSubdomain = parseResult.subDomains.length > 0 ? parseResult.subDomains.join('.') : null;
  const subdomain = tempSubdomain === "www" ? null : tempSubdomain;
  console.log(subdomain);

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
      if (tempDomain.banned) {
        throw new Error('DOMAIN_BANNED');
      }
      domainRecord = tempDomain;
    }

    const publisher = await db.publisher.findOne(
      {
        where: {
          [Op.and]: [
            { userId: req.user.id },
            { domainId: domainRecord.id },
            { subdomain },
          ],
        },

        transaction: t,
        lock: t.LOCK.UPDATE,
      },
    );

    if (publisher) {
      console.log('PUBLISHER_ALREADY_EXIST');
      throw new Error('PUBLISHER_ALREADY_EXIST');
    }
    const verificationCode = generateRandomStringLowCase(24);

    const newPublisher = await db.publisher.create({
      userId: req.user.id,
      domainId: domainRecord.id,
      code: verificationCode,
      subdomain,
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    res.locals.publisher = await db.publisher.findOne({
      where: {
        id: newPublisher.id,
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

    console.log(res.locals.publisher);
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
export const verifyPublisher = async (req, res, next) => {
  console.log('verify publisher start');
  let metaResponse;
  const publisher = await db.publisher.findOne({
    where: {
      userId: req.user.id,
      id: req.body.id,
    },
    include: [
      {
        model: db.domain,
        as: 'domain',
      },
    ],
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
      metaResponse = await metaget.fetch(`http://www.${publisher.domain.domain}`);
    } catch (ex) {
      console.log('Fail', ex);
    }
    if (!metaResponse.runesx) {
      try {
        metaResponse = await metaget.fetch(`https://www.${publisher.domain.domain}`);
      } catch (ex) {
        console.log('Fail', ex);
      }
    }
    if (!metaResponse.runesx) {
      try {
        metaResponse = await metaget.fetch(`http://${publisher.domain.domain}`);
      } catch (ex) {
        console.log('Fail', ex);
      }
    }
    if (!metaResponse.runesx) {
      try {
        metaResponse = await metaget.fetch(`https://${publisher.domain.domain}`);
      } catch (ex) {
        console.log('Fail', ex);
      }
    }
  } else {
    try {
      metaResponse = await metaget.fetch(`http://${publisher.subdomain}.${publisher.domain.domain}`);
    } catch (ex) {
      console.log('Fail', ex);
    }
    if (!metaResponse.runesx) {
      try {
        metaResponse = await metaget.fetch(`https://${publisher.subdomain}.${publisher.domain.domain}`);
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
    const updatedPublisher = await publisher.update({
      verified: true,
    });
    res.locals.publishers = updatedPublisher;
    next();
  }
};

/**
 * Fetch PriceInfo
 */
export const fetchPublishers = async (req, res, next) => {
  res.locals.publishers = await db.publisher.findAll({
    where: {
      userId: req.user.id,
    },
    include: [
      {
        model: db.domain,
        as: 'domain',
      },
      {
        model: db.adzone,
        as: 'adzone',
      },
    ],
  });
  next();
};

export const buyPublisherslot = async (req, res, next) => {
  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
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
    if (user.wallet.available < (15000 * 1e8)) {
      console.log('NOT_ENOUGH_FUNDS');
      throw new Error('NOT_ENOUGH_FUNDS');
    }
    res.locals.user = await user.update({
      publishers_amount: user.publishers_amount + 1,
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
        type: 'buyPublisherslot',
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
