'use strict';

module.exports = {
  up: async function up(queryInterface, Sequelize) {
    await queryInterface.addColumn('publisher', // name of Target model
    'userId', // name of the key we're adding
    {
      type: Sequelize.BIGINT,
      references: {
        model: 'user', // name of Source model
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    await queryInterface.addColumn('publisher', // name of Source model
    'domainId', // name of the key we're adding
    {
      type: Sequelize.BIGINT,
      references: {
        model: 'domain', // name of Target model
        key: 'id' // key in Target model that we're referencing
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },
  down: async function down(queryInterface, DataTypes) {
    await queryInterface.removeColumn('publisher', 'userId');
    await queryInterface.removeColumn('publisher', 'domainId');
  }
};

//