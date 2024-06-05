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
    earned: {
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
  var AdZoneModel = sequelize.define('adzone', modelDefinition, modelOptions);

  AdZoneModel.associate = function (model) {
    AdZoneModel.belongsTo(model.publisher, { as: 'publisher' });
    // AdZoneModel.hasMany(model.clickOrder, { as: 'clickorder' });
  };

  return AdZoneModel;
};