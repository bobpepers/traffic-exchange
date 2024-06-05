module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'adzone', // name of Target model
      'publisherId', // name of the key we're adding
      {
        type: Sequelize.BIGINT,
        references: {
          model: 'publisher', // name of Source model
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.removeColumn('adzone', 'publisherId');
  },
};

//
