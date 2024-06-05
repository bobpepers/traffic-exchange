module.exports = (sequelize, DataTypes) => {
  const modelDefinition = {
    id: {
      type: DataTypes.STRING(8),
      allowNull: false,
      primaryKey: true,
    },
  };

  // 2: The model options.
  const modelOptions = {
    freezeTableName: true,
  };

  // 3: Define the Domain model.
  const BannerOrderTicketModel = sequelize.define('bannerOrderTickets', modelDefinition, modelOptions);

  BannerOrderTicketModel.associate = (model) => {
    BannerOrderTicketModel.belongsTo(model.bannerOrder, { as: 'bannerOrder' });
    // BannerOrderTicketModel.belongsTo(model.user, { as: 'user' });
  };

  return BannerOrderTicketModel;
};
