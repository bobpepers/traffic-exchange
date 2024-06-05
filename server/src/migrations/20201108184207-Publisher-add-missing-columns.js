module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn(
      'publisher', // name of Target model
      'banned', // name of the key we're adding
      {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    );

    await queryInterface.addColumn(
      'publisher', // name of Target model
      'review', // name of the key we're adding
      {
        type: DataTypes.ENUM,
        values: [
          'pending',
          'rejected',
          'accepted',
        ],
        allowNull: false,
        defaultValue: 'pending',
      },
    );
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.removeColumn('publisher', 'banned');
    await queryInterface.removeColumn('publisher', 'review');
  },
};
