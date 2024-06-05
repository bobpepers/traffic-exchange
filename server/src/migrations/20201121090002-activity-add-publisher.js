module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'activityArchive', // name of Target model
      'publisherId', // name of the key we're adding
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'publisher', // name of Source model
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );
    await queryInterface.addColumn(
      'activity', // name of Target model
      'publisherId', // name of the key we're adding
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'publisher', // name of Source model
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.removeColumn('activityArchive', 'publisherId');
    await queryInterface.removeColumn('activity', 'publisherId');
  },
};
