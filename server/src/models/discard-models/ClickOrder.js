module.exports = (sequelize, DataTypes) => {
  const modelDefinition = {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    price: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    amount: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    filled: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
    phase: {
      type: DataTypes.ENUM,
      values: [
        'active',
        'canceled',
        'fulfilled',
      ],
      defaultValue: 'active',
    },
  };

  const modelOptions = {
    freezeTableName: true,
  };

  const ClickOrderModel = sequelize.define('clickOrder', modelDefinition, modelOptions);

  ClickOrderModel.associate = (model) => {
    ClickOrderModel.belongsTo(model.bannerslot, { as: 'bannerslot' });
  };

  return ClickOrderModel;
};
