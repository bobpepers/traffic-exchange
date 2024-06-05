module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.removeColumn('bannerOrderTickets', 'bannerOrderId');
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn(
      'bannerOrderTickets', // name of Target model
      'bannerOrderId', // name of the key we're adding
      {
        type: DataTypes.BIGINT,
        references: {
          model: 'bannerOrder', // name of Source model
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );
  },
};
// 20201113151755-BannerOrderTickets-change-association-column.js
