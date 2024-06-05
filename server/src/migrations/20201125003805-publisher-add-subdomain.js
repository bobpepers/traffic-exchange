module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn(
      'publisher', // name of Target model
      'subdomain', // name of the key we're adding
      {
        type: DataTypes.STRING,
        allowNull: true,
      },
    );
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.removeColumn('publisher', 'subdomain');
  },
};
