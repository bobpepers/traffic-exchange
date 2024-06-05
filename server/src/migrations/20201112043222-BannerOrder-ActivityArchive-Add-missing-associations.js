module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'activityArchive', // name of Target model
      'bannerOrderId', // name of the key we're adding
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'bannerOrder', // name of Source model
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.removeColumn('activityArchive', 'bannerOrderId');
  },
};
