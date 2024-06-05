'use strict';

module.exports = {
  up: async function up(queryInterface, DataTypes) {
    await queryInterface.renameColumn('banner', 'earned', 'spend');
  },
  down: async function down(queryInterface, DataTypes) {
    await queryInterface.renameColumn('banner', 'spend', 'earned');
  }
};