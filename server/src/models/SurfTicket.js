module.exports = (sequelize, DataTypes) => {
  const modelDefinition = {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    code: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
  };

  // 2: The model options.
  const modelOptions = {
    freezeTableName: true,
  };

  // 3: Define the Domain model.
  const SurfTicketModel = sequelize.define('SurfTicket', modelDefinition, modelOptions);

  SurfTicketModel.associate = (model) => {
    SurfTicketModel.belongsTo(model.order, { as: 'order' });
    SurfTicketModel.belongsTo(model.user, { as: 'user' });
  };

  return SurfTicketModel;
};
