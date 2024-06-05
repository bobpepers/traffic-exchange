module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn(
      'Referrals', // name of Target model
      'earned', // name of the key we're adding
      {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
      },
    );
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.removeColumn('Referrals', 'earned');
  },
};

//
