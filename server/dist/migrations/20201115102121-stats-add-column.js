'use strict';

module.exports = {
  up: async function up(queryInterface, DataTypes) {
    await queryInterface.addColumn('stats', // name of Target model
    'impression', // name of the key we're adding
    {
      type: DataTypes.BIGINT,
      defaultValue: 0,
      allowNull: false
    });
  },
  down: async function down(queryInterface, DataTypes) {
    await queryInterface.removeColumn('stats', 'impression');
  }
};