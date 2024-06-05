module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.removeColumn('bannerOrderTickets', 'code');
  },
  down: async (queryInterface, DataTypes) => {

  },
};
