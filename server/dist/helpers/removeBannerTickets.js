'use strict';

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _require = require('sequelize'),
    Sequelize = _require.Sequelize,
    Transaction = _require.Transaction,
    Op = _require.Op;

var removeBannerTickets = async function removeBannerTickets(onlineUsers) {
  await _models2.default.sequelize.transaction({
    isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE
  }, async function (t) {
    var bannerOrderTickets = await _models2.default.bannerOrderTickets.destroy({
      transaction: t,
      lock: t.LOCK.UPDATE,
      where: {
        updatedAt: _defineProperty({}, Op.lte, new Date(Date.now() - 3 * 60 * 60 * 1000))
      }
    });
    t.afterCommit(function () {
      console.log('commited');
    });
  });
};

module.exports = {
  removeBannerTickets: removeBannerTickets
};