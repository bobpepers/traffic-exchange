module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn(
      'banner', // name of Target model
      'earned', // name of the key we're adding
      {
        type: DataTypes.BIGINT,
        defaultValue: 0,
        allowNull: false,
      },
    );
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.removeColumn('banner', 'earned');
  },
};
