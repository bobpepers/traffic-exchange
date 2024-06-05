module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.removeColumn('adzone', 'code');
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn(
      'adzone', // name of Target model
      'code', // name of the key we're adding
      {
        type: DataTypes.STRING(24),
        allowNull: false,
      },
    );
  },
};
