module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('bannerOrderTickets', {
      id: {
        type: DataTypes.STRING(8),
        allowNull: false,
        primaryKey: true,
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
    await queryInterface.dropTable('bannerOrderTickets');
  },
};
