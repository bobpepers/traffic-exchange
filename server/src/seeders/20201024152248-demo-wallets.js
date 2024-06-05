module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('wallet', [
    {
      id: 1,
      available: 1000000000,
      locked: 0,
      earned: 0,
      spend: 0,
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },  
  ]),
  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('wallet', null, {}),
};
