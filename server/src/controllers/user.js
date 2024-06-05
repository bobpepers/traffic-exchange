import db from '../models';

const { Sequelize, Transaction, Op } = require('sequelize');
/**
 * Fetch Wallet
 */
export const fetchUser = async (req, res, next) => {
  console.log(req.user.id);
  console.log('begin fetch user');
  res.locals.user = await db.user.findOne({
    where: {
      id: req.user.id,
    },
    attributes: {
      exclude: [
        'password',
        'id',
        'email',
        'firstname',
        'lastname',
        'authtoken',
        'authused',
        'authexpires',
        'resetpasstoken',
        'resetpassused',
        'resetpassexpires',
        'createdAt',
        'updatedAt',
      ],
    },
    include: [
      {
        model: db.Referrals,
        required: false,
        as: 'referredBy',
        attributes: ['earned'],
        include: [
          {
            model: db.user,
            required: false,
            as: 'userReferrer',
            attributes: ['username'],
          },
        ],
      },
      {
        model: db.wallet,
        as: 'wallet',
        attributes: {
          exclude: [
            'userId',
            'createdAt',
            'id',
          ],
        },
        include: [
          {
            model: db.address,
            as: 'addresses',
            include: [
              {
                model: db.transaction,
                as: 'transactions',
              },
            ],
          },
        ],
      },
      {
        model: db.webslot,
        as: 'webslots',
        required: false,
        where: {
          active: true,
        },
        attributes: {
          exclude: [
            'userId',
          ],
        },
        include: [
          {
            model: db.domain,
            as: 'domain',
            attributes: {
              exclude: [
                'userId',
                'createdAt',
                'id',
              ],
            },
          },
          {
            model: db.order,
            as: 'order',
            where: {
              phase: 'active',
            },
            required: false,
            include: [
              {
                model: db.SurfTicket,
                as: 'surfTicket',
                attributes: {
                  exclude: [
                    'code',
                  ],
                },
              },
            ],
          },
        ],
      },
      {
        model: db.domain,
        as: 'domains',
        through: { attributes: [] },
        attributes: {
          exclude: [
            'id',
          ],
        },
      },

    ],
  });
  console.log(res.locals.user);
  console.log('end user controller');
  next();
};

/**
 * Fetch Wallet
 */
export const dbsync = async (req, res, next) => {
  db.sequelize.sync().then(() => {
    res.status(201).json({ message: 'Tables Created' });
  });
};
