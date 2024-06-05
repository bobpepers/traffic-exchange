'use strict';

module.exports = function (sequelize, DataTypes) {
  var modelDefinition = {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    price: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    amount: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    filled: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    phase: {
      type: DataTypes.ENUM,
      values: ['active', 'canceled', 'fulfilled'],
      defaultValue: 'active'
    }
  };

  // 2: The model options.
  var modelOptions = {
    freezeTableName: true
  };

  // 3: Define the Wallet model.
  var BannerOrder = sequelize.define('bannerOrder', modelDefinition, modelOptions);

  BannerOrder.associate = function (model) {
    BannerOrder.belongsTo(model.banner, { as: 'banner' });
    BannerOrder.hasMany(model.activity, { as: 'activity' });
    BannerOrder.hasMany(model.activityArchive, { as: 'activityArchive' });
    BannerOrder.hasMany(model.bannerOrderTickets, { as: 'bannerOrderTickets' });
    // BannerOrder.hasMany(model.SurfTicket, { as: 'surfTicket' });
    // BannerOrder.hasMany(model.activity, { as: 'order' });
  };

  return BannerOrder;
};