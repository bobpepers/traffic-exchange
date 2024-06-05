module.exports = (sequelize, DataTypes) => {
  const modelDefinition = {
    id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
      type: DataTypes.ENUM,
      values: [
        'login',
        'register',
        'registerVerified',
        'resetpass',
        'resetpassComplete',
        'logout',
        'surfStart',
        'surfComplete',
        'click',
        'depositAccepted',
        'depositComplete',
        'withdrawRequested',
        'withdrawAccepted',
        'withdrawComplete',
        'withdrawRejected',
        'createSurfOrder',
        'cancelSurfOrder',
        'createClickOrder',
        'cancelClickOrder',
        'jackpot',
        'buyTicket',
        'buyWebslot',
        'buyClickslot',
        'newDomain',
        'banned',
        'referralBonus',
        'faucetClaim',
        'createBannerOrder',
        'cancelBannerOrder',
        'uniqueImpression',
        'buyBannerslot',
        'buyPublisherslot',
        'buyAdzoneslot',
      ],
    },
    amount: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    spender_balance: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    earner_balance: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
  };

  // 2: The model options.
  const modelOptions = {
    freezeTableName: true,
  };

  // 3: Define the Domain model.
  const ActivityArchiveModel = sequelize.define('activityArchive', modelDefinition, modelOptions);

  ActivityArchiveModel.associate = (model) => {
    ActivityArchiveModel.belongsTo(model.publisher, {
      as: 'publisher',
    });
    ActivityArchiveModel.belongsTo(model.bannerOrder, {
      as: 'bannerOrder',
    });
    ActivityArchiveModel.belongsTo(model.ip, {
      as: 'ip',
    });
    ActivityArchiveModel.belongsTo(model.user, {
      as: 'archivedSpender',
      foreignKey: 'spenderId',
    });
    ActivityArchiveModel.belongsTo(model.user, {
      as: 'archivedEarner',
      foreignKey: 'earnerId',
    });
    ActivityArchiveModel.belongsTo(model.order, {
      as: 'order',
      foreignKey: 'orderId',
    });
    ActivityArchiveModel.belongsTo(model.domain, {
      as: 'domainActivity',
      foreignKey: 'domainId',
    });
    ActivityArchiveModel.belongsTo(model.transaction, {
      as: 'txActivity',
      foreignKey: 'txId',
    });
    ActivityArchiveModel.belongsTo(model.faucetRolls, {
      as: 'faucetRoll',
    });
  };

  return ActivityArchiveModel;
};
