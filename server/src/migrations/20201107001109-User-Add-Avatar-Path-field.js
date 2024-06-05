module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn(
      'user', // name of Target model
      'avatar_path', // name of the key we're adding
      {
        type: DataTypes.STRING,
        defaultValue: 'avatar.png',
        allowNull: false,
      },
    );
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.removeColumn('user', 'avatar_path');
  },
};
