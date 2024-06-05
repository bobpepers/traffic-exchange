'use strict';

module.exports = {
  up: async function up(queryInterface, DataTypes) {
    await queryInterface.dropTable('bannerOrderTickets');
  },
  down: async function down(queryInterface, DataTypes) {
    await queryInterface.createTable('bannerOrderTickets', {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      code: {
        type: DataTypes.STRING(8),
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    });
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
  }
};