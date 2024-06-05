'use strict';

module.exports = function (sequelize, DataTypes) {
  var modelDefinition = {
    id: {
      type: DataTypes.STRING(8),
      allowNull: false,
      primaryKey: true
    }
  };

  // 2: The model options.
  var modelOptions = {
    freezeTableName: true
  };

  // 3: Define the Domain model.
  var BannerOrderTicketModel = sequelize.define('bannerOrderTickets', modelDefinition, modelOptions);

  BannerOrderTicketModel.associate = function (model) {
    BannerOrderTicketModel.belongsTo(model.bannerOrder, { as: 'bannerOrder' });
    // BannerOrderTicketModel.belongsTo(model.user, { as: 'user' });
  };

  return BannerOrderTicketModel;
};