'use strict';

module.exports = {
  up: async function up(queryInterface, Sequelize) {
    await queryInterface.addColumn('transaction', // name of Target model
    'blockId', // name of the key we're adding
    {
      type: Sequelize.BIGINT,
      references: {
        model: 'block', // name of Source model
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },
  down: async function down(queryInterface, DataTypes) {
    await queryInterface.removeColumn('transaction', 'blockId');
  }
};