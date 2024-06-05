'use strict';

module.exports = {
  up: async function up(queryInterface, DataTypes) {
    await queryInterface.changeColumn('banner', 'review', {
      type: DataTypes.ENUM,
      values: ['pending', 'rejected', 'accepted'],
      allowNull: false,
      defaultValue: 'pending'
    });
  },
  down: async function down(queryInterface, DataTypes) {
    await queryInterface.changeColumn('banner', 'review', {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    });
  }
};