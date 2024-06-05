module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.changeColumn('banner', 'review', {
      type: DataTypes.ENUM,
      values: [
        'pending',
        'rejected',
        'accepted',
      ],
      allowNull: false,
      defaultValue: 'pending',
    });
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.changeColumn('banner', 'review', {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    });
  },
};
