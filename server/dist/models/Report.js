'use strict';

module.exports = function (sequelize, DataTypes) {
  var modelDefinition = {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  };

  // 2: The model options.
  var modelOptions = {
    freezeTableName: true
  };

  // 3: Define the Wallet model.
  var ReportModel = sequelize.define('report', modelDefinition, modelOptions);

  ReportModel.associate = function (model) {
    ReportModel.belongsTo(model.domain, { as: 'domain' });
    ReportModel.belongsTo(model.webslot, { as: 'webslot' });
    ReportModel.belongsTo(model.user, { as: 'user' });
  };

  return ReportModel;
};