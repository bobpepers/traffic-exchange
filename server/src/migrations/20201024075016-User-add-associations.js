module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'jackpot',
    'winnerOneId',
    {
      type: Sequelize.BIGINT,
      references: {
        model: 'user',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },
  )
    .then(() => queryInterface.addColumn(
      'jackpot',
      'winnerTwoId',
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'user',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    ))
    .then(() => queryInterface.addColumn(
      'jackpot',
      'winnerThreeId',
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'user',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    ))
    .then(() => queryInterface.addColumn(
      'jackpot',
      'winnerFourId',
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'user',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    ))
    .then(() => queryInterface.addColumn(
      'jackpot',
      'winnerFiveId',
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'user',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    ))
    .then(() => queryInterface.addColumn(
      'jackpot',
      'winnerSixId',
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'user',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    ))
    .then(() => queryInterface.addColumn(
      'jackpot',
      'winnerSevenId',
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'user',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    ))
    .then(() => queryInterface.addColumn(
      'jackpot',
      'winnerEigthId',
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'user',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    ))
    .then(() => queryInterface.addColumn(
      'jackpot',
      'winnerNineId',
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'user',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    ))
    .then(() => queryInterface.addColumn(
      'jackpot',
      'winnerTenId',
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'user',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    ))
    .then(() => queryInterface.addColumn(
      'jackpot',
      'userId',
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'user',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    ))
    .then(() => queryInterface.addColumn(
      'bannerslot',
      'userId',
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'user',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    ))
    .then(() => queryInterface.addColumn(
      'activity',
      'spenderId',
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'user',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    ))
    .then(() => queryInterface.addColumn(
      'activity',
      'earnerId',
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'user',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    ))
    .then(() => queryInterface.addColumn(
      'webslot',
      'userId',
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'user',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    ))
    .then(() => queryInterface.addColumn(
      'SurfTicket',
      'userId',
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'user',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    ))
    .then(() => queryInterface.addColumn(
      'wallet',
      'userId',
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'user',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    )),

  down: (queryInterface, Sequelize) => queryInterface.removeColumn(
    'jackpot',
    'winnerOneId',
  )
    .then(() => queryInterface.removeColumn(
      'jackpot',
      'winnerTwoId',
    ))
    .then(() => queryInterface.removeColumn(
      'jackpot',
      'winnerThreeId',
    ))
    .then(() => queryInterface.removeColumn(
      'jackpot',
      'winnerFourId',
    ))
    .then(() => queryInterface.removeColumn(
      'jackpot',
      'winnerFiveId',
    ))
    .then(() => queryInterface.removeColumn(
      'jackpot',
      'winnerSixId',
    ))
    .then(() => queryInterface.removeColumn(
      'jackpot',
      'winnerSevenId',
    ))
    .then(() => queryInterface.removeColumn(
      'jackpot',
      'winnerEigthId',
    ))
    .then(() => queryInterface.removeColumn(
      'jackpot',
      'winnerNineId',
    ))
    .then(() => queryInterface.removeColumn(
      'jackpot',
      'winnerTenId',
    ))
    .then(() => queryInterface.removeColumn(
      'jackpot',
      'userId',
    ))
    .then(() => queryInterface.removeColumn(
      'bannerslot',
      'userId',
    ))
    .then(() => queryInterface.removeColumn(
      'activity',
      'spenderId',
    ))
    .then(() => queryInterface.removeColumn(
      'activity',
      'earnerId',
    ))
    .then(() => queryInterface.removeColumn(
      'webslot',
      'userId',
    ))
    .then(() => queryInterface.removeColumn(
      'SurfTicket',
      'userId',
    ))
    .then(() => queryInterface.removeColumn(
      'wallet',
      'userId',
    ))
  ,
};
