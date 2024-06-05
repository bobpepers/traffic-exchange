module.exports = (sequelize, DataTypes) => {
  const modelDefinition = {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    referredById: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    referrerID: {
      type: DataTypes.BIGINT,
      allowNull: false,
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
  const ReferralsModel = sequelize.define('Referrals', modelDefinition, modelOptions);

  ReferralsModel.associate = (model) => {
    ReferralsModel.belongsTo(model.user, {
      as: 'userReferred',
      foreignKey: 'referredById',
    });
    ReferralsModel.belongsTo(model.user, {
      as: 'userReferrer',
      foreignKey: 'referrerID',
    });
  };

  return ReferralsModel;
};
