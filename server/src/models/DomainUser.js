module.exports = (sequelize, DataTypes) => {
  const modelDefinition = {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    domainId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  };

  // 2: The model options.
  const modelOptions = {
    freezeTableName: true,
  };

  // 3: Define the Domain model.
  const DomainUserModel = sequelize.define('DomainUser', modelDefinition, modelOptions);

  DomainUserModel.associate = (model) => {
    DomainUserModel.belongsTo(model.domain, {
      as: 'domain',
      foreignKey: 'domainId',
    });
    DomainUserModel.belongsTo(model.user, {
      as: 'user',
      foreignKey: 'userId',
    });
  };

  return DomainUserModel;
};
