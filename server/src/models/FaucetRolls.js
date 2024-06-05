module.exports = (sequelize, DataTypes) => {
  const modelDefinition = {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    serverseed: {
      type: DataTypes.STRING(24),
      allowNull: true,
      defaultValue: 0,
    },
    clientseed: {
      type: DataTypes.STRING(24),
      allowNull: false,
      defaultValue: 0,
    },
    nonce: {
      type: DataTypes.BIGINT,
      allowNull: true,
      defaultValue: 0,
    },
    rolled: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 0,
    },
    claimAmount: {
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
  const FaucetRollsModel = sequelize.define('faucetRolls', modelDefinition, modelOptions);

  FaucetRollsModel.associate = (model) => {
    FaucetRollsModel.belongsTo(model.faucet, { as: 'faucet' });
  };

  return FaucetRollsModel;
};
