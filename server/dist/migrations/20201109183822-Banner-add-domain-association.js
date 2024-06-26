'use strict';

module.exports = {
  up: async function up(queryInterface, Sequelize) {
    await queryInterface.addColumn('banner', // name of Target model
    'domainId', // name of the key we're adding
    {
      type: Sequelize.BIGINT,
      references: {
        model: 'domain', // name of Source model
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },
  down: async function down(queryInterface, DataTypes) {
    await queryInterface.removeColumn('banner', 'domainId');
  }
};