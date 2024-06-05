module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.renameColumn('banner', 'earned', 'spend');
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.renameColumn('banner', 'spend', 'earned');
  },
};
