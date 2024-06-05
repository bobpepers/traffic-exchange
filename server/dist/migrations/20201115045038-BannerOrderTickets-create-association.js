'use strict';

module.exports = {
  up: async function up(queryInterface, DataTypes) {
    await queryInterface.addColumn('bannerOrderTickets', // name of Target model
    'bannerOrderId', // name of the key we're adding
    {
      type: DataTypes.BIGINT,
      references: {
        model: 'bannerOrder', // name of Source model
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },
  down: async function down(queryInterface, DataTypes) {
    await queryInterface.removeColumn('bannerOrderTickets', 'bannerOrderId');
  }
};