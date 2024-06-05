module.exports = (sequelize, DataTypes) => {
  const modelDefinition = {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    earned: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
  };

  // 2: The model options.
  const modelOptions = {
    freezeTableName: true,
  };

  // 3: Define the Domain model.
  const FaucetModel = sequelize.define('faucet', modelDefinition, modelOptions);

  FaucetModel.associate = (model) => {
    FaucetModel.hasMany(model.faucetRolls, { as: 'faucetRolls' });
  };

  return FaucetModel;
};
