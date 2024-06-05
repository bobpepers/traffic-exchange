module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'bannerOrder', // name of Target model
      'bannerId', // name of the key we're adding
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'banner', // name of Source model
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.removeColumn('bannerOrder', 'bannerId');
  },
};
