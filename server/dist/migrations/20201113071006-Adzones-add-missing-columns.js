'use strict';

module.exports = {
  up: async function up(queryInterface, DataTypes) {
    await queryInterface.addColumn('adzone', // name of Target model
    'code', // name of the key we're adding
    {
      type: DataTypes.STRING(24),
      allowNull: false
    });

    await queryInterface.addColumn('adzone', // name of Target model
    'earned', // name of the key we're adding
    {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    });
  },
  down: async function down(queryInterface, DataTypes) {
    await queryInterface.removeColumn('adzone', 'earned');
    await queryInterface.removeColumn('adzone', 'code');
  }
};