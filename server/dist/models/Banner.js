'use strict';

module.exports = function (sequelize, DataTypes) {
  // 1: The model schema.
  var modelDefinition = {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    size: {
      type: DataTypes.ENUM,
      values: ['120x60', '120x600', '125x125', '160x600', '250x250', '300x250', '300x600', '320x50', '728x90', '970x90', '970x250'],
      allowNull: false,
      defaultValue: 'pending'
    },
    impressions: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    banned: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    review: {
      type: DataTypes.ENUM,
      values: ['pending', 'rejected', 'accepted'],
      allowNull: false,
      defaultValue: 'pending'
    },
    banner_path: {
      type: DataTypes.STRING,
      defaultValue: 'banner.png',
      allowNull: false
    },
    protocol: {
      type: DataTypes.STRING,
      allowNull: false
    },
    subdomain: {
      type: DataTypes.STRING
      // allowNull: false,
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false
    },
    search: {
      type: DataTypes.STRING,
      allowNull: true
    },
    spend: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    }
  };

  // 2: The model options.
  var modelOptions = {
    freezeTableName: true
  };

  // 3: Define the Wallet model.
  var BannerModel = sequelize.define('banner', modelDefinition, modelOptions);

  BannerModel.associate = function (model) {
    BannerModel.belongsTo(model.user, { as: 'user' });
    BannerModel.belongsTo(model.domain, { as: 'domain' });
    BannerModel.hasMany(model.bannerOrder, { as: 'bannerOrder' });
  };

  return BannerModel;
};