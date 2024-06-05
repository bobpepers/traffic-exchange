module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn(
      'banner', // name of Target model
      'protocol', // name of the key we're adding
      {
        type: DataTypes.STRING,
        allowNull: false,
      },
    );

    await queryInterface.addColumn(
      'banner', // name of Target model
      'subdomain', // name of the key we're adding
      {
        type: DataTypes.STRING,
        allowNull: true,
      },
    );

    await queryInterface.addColumn(
      'banner', // name of Target model
      'path', // name of the key we're adding
      {
        type: DataTypes.STRING,
        allowNull: false,
      },
    );

    await queryInterface.addColumn(
      'banner', // name of Target model
      'search', // name of the key we're adding
      {
        type: DataTypes.STRING,
        allowNull: true,
      },
    );
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.removeColumn('banner', 'protocol');
    await queryInterface.removeColumn('banner', 'subdomain');
    await queryInterface.removeColumn('banner', 'path');
    await queryInterface.removeColumn('banner', 'search');
  },
};
