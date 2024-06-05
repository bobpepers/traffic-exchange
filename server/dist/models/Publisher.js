'use strict';

module.exports = function (sequelize, DataTypes) {
  var modelDefinition = {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    code: {
      type: DataTypes.STRING(24),
      allowNull: false,
      defaultValue: 0
    },
    impressions: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    earned: {
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
    adzones_amount: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 4
    },
    subdomain: {
      type: DataTypes.STRING,
      allowNull: true
    }
  };

  // 2: The model options.
  var modelOptions = {
    freezeTableName: true
  };

  // 3: Define the Wallet model.
  var PublisherModel = sequelize.define('publisher', modelDefinition, modelOptions);

  // 4: Wallet belongs to User

  PublisherModel.associate = function (model) {
    PublisherModel.hasMany(model.activity, { as: 'activity' });
    PublisherModel.hasMany(model.activityArchive, { as: 'activityArchive' });
    PublisherModel.belongsTo(model.user, { as: 'user' });
    PublisherModel.belongsTo(model.domain, { as: 'domain' });
    PublisherModel.hasMany(model.adzone, { as: 'adzone' });
  };

  // 5: Wallet has many addresses

  return PublisherModel;
};