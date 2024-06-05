'use strict';

module.exports = {
  up: async function up(queryInterface, DataTypes) {
    await queryInterface.removeColumn('bannerOrderTickets', 'code');
  },
  down: async function down(queryInterface, DataTypes) {}
};