module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.bulkInsert('user', [
    {
      id: 1,
      username: 'bago',
      email: 'email@email.com',
      password: 'x', // add hashed Password
      firstname: 'John',
      lastname: 'Doe',
      authtoken: 'xx', // add AuthToken
      authused: 1,
      authexpires: new Date(),
      resetpasstoken: null,
      resetpassused: null,
      resetpassexpires: null,
      role: 4,
      reputation: 50,
      banned: 0,
      webslot_amount: 2,
      bannerslot_amount: 1,
      tfa: false,
      tfa_secret: null,
      surf_count: 0,
      click_count: 0,
      jackpot_tickets: 900,
      lastClicked: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]),
  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('user', null, {}),
};
