module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('DomainUser', {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'user',
          key: 'id',
          as: 'domains',
        },
      },
      domainId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'domain',
          key: 'id',
          as: 'users',
        },
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
    await queryInterface.dropTable('DomainUser');
  },
};
