module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('stats', {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      click: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
      },
      surf: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
      },
      jackpot: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    });
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.dropTable('stats');
  },
};
