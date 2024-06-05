module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn(
      'activityArchive', // name of Target model
      'faucetRollId', // name of the key we're adding
      {
        type: DataTypes.BIGINT,
        references: {
          model: 'faucetRolls', // name of Source model
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.removeColumn('activityArchive', 'faucetRollId');
  },
};
