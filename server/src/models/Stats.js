// The Stats model.

module.exports = (sequelize, DataTypes) => {
// 1: The model schema.
  const modelDefinition = {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    click: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
    surf: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
    jackpot: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
    impression: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
  };

  // 2: The model options.
  const modelOptions = {
    freezeTableName: true,
  };

  // 3: Define the Stats model.
  const StatsModel = sequelize.define('stats', modelDefinition, modelOptions);
  return StatsModel;
};
