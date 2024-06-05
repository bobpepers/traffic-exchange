module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn(
      'publisher', // name of Target model
      'adzones_amount', // name of the key we're adding
      {
        type: DataTypes.SMALLINT,
        allowNull: false,
        defaultValue: 4,
      },
    );
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.removeColumn('publisher', 'adzones_amount');
  },
};
