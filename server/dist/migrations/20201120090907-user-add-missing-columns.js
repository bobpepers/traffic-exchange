'use strict';

module.exports = {
  up: async function up(queryInterface, DataTypes) {
    await queryInterface.addColumn('user', // name of Target model
    'banners_amount', // name of the key we're adding
    {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 4
    });

    await queryInterface.addColumn('user', // name of Target model
    'publishers_amount', // name of the key we're adding
    {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 4
    });
  },
  down: async function down(queryInterface, DataTypes) {
    await queryInterface.removeColumn('user', 'banners_amount');
    await queryInterface.removeColumn('user', 'publishers_amount');
  }
};