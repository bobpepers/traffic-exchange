'use strict';

module.exports = {
  up: async function up(queryInterface, DataTypes) {
    await queryInterface.changeColumn('bannerOrderTickets', 'bannerOrderId', {
      type: DataTypes.STRING(8),
      references: {
        model: 'bannerOrder', // name of Source model
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },
  down: async function down(queryInterface, DataTypes) {
    await queryInterface.changeColumn('bannerOrderTickets', 'bannerOrderId', {
      type: DataTypes.BIGINT,
      references: {
        model: 'bannerOrder', // name of Source model
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  }
};