import db from '../models';

const { Sequelize, Transaction, Op } = require('sequelize');

export const createReport = async (req, res, next) => {
  const reason = req.body.reason || false;
  const description = req.body.description || false;
  const webslotId = req.body.webslotId || false;
  const domainId = req.body.domainId || false;
  const userId = req.user.id || false;
  console.log(req.user.id);
  console.log('req.user');
  if (!userId) {
    res.locals.error = 'USER_ID_NOT_FOUND';
    next();
  }
  if (!webslotId) {
    res.locals.error = 'WEBSLOT_ID_NOT_FOUND';
    next();
  }
  if (!domainId) {
    res.locals.error = 'DOMAIN_ID_NOT_FOUND';
    next();
  }
  if (!reason) {
    res.locals.error = 'REASON_NOT_FOUND';
    next();
  }
  if (!description) {
    res.locals.error = 'DESCRIPTION_NOT_FOUND';
    next();
  }
  if (description > 400) {
    res.locals.error = 'DESCRIPTION_LENGTH_TOO_LONG';
    next();
  }

  await db.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE,
  }, async (t) => {
    const webslot = await db.webslot.findOne({
      where: {
        id: webslotId,
      },
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!webslot) {
      throw new Error('WEBSLOT_NOT_FOUND');
    }

    const domain = await db.domain.findOne({
      where: {
        id: domainId,
      },
    }, {
      transaction: t,
      lock: t.LOCK.UPDATE,
    });

    if (!domain) {
      throw new Error('DOMAIN_NOT_FOUND');
    }

    const report = await db.report.create(
      {
        reason,
        description,
        webslotId,
        domainId,
        userId,
      },
      {
        transaction: t,
        lock: t.LOCK.UPDATE,
      },
    );

    if (!report) {
      throw new Error('FAILED_CREATING_REPORT');
    }

    res.locals.report = report;

    t.afterCommit(() => {
      next();
    });
  }).catch((err) => {
    res.locals.error = err.message;
    next();
  });
};

export const fetchReports = async (req, res, next) => {
  console.log('123');
};
