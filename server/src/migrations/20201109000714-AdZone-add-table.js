module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('adzone', {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      size: {
        type: DataTypes.ENUM,
        values: [
          '120x60',
          '120x600',
          '125x125',
          '160x600',
          '250x250',
          '300x250',
          '300x600',
          '320x50',
          '728x90',
          '970x90',
          '970x250',
        ],
        allowNull: false,
        defaultValue: '120x60',
      },
      impressions: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
      },
      banned: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      review: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
    await queryInterface.dropTable('adzone');
  },
};
