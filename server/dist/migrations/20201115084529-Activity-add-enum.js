'use strict';

module.exports = {
  up: async function up(queryInterface, DataTypes) {
    await queryInterface.changeColumn('activity', 'type', {
      allowNull: false,
      type: DataTypes.ENUM('login', 'register', 'registerVerified', 'resetpass', 'resetpassComplete', 'logout', 'surfStart', 'surfComplete', 'click', 'depositAccepted', 'depositComplete', 'withdrawRequested', 'withdrawAccepted', 'withdrawComplete', 'withdrawRejected', 'createSurfOrder', 'cancelSurfOrder', 'createClickOrder', 'cancelClickOrder', 'jackpot', 'buyTicket', 'buyWebslot', 'buyClickslot', 'newDomain', 'banned', 'referralBonus', 'faucetClaim', 'createBannerOrder', 'cancelBannerOrder', 'uniqueImpression')
    });
    await queryInterface.changeColumn('activityArchive', 'type', {
      allowNull: false,
      type: DataTypes.ENUM('login', 'register', 'registerVerified', 'resetpass', 'resetpassComplete', 'logout', 'surfStart', 'surfComplete', 'click', 'depositAccepted', 'depositComplete', 'withdrawRequested', 'withdrawAccepted', 'withdrawComplete', 'withdrawRejected', 'createSurfOrder', 'cancelSurfOrder', 'createClickOrder', 'cancelClickOrder', 'jackpot', 'buyTicket', 'buyWebslot', 'buyClickslot', 'newDomain', 'banned', 'referralBonus', 'faucetClaim', 'createBannerOrder', 'cancelBannerOrder', 'uniqueImpression')
    });
  },
  down: async function down(queryInterface, DataTypes) {
    await queryInterface.changeColumn('activity', 'type', {
      allowNull: false,
      type: DataTypes.ENUM('login', 'register', 'registerVerified', 'resetpass', 'resetpassComplete', 'logout', 'surfStart', 'surfComplete', 'click', 'depositAccepted', 'depositComplete', 'withdrawRequested', 'withdrawAccepted', 'withdrawComplete', 'withdrawRejected', 'createSurfOrder', 'cancelSurfOrder', 'createClickOrder', 'cancelClickOrder', 'jackpot', 'buyTicket', 'buyWebslot', 'buyClickslot', 'newDomain', 'banned', 'referralBonus', 'faucetClaim', 'createBannerOrder', 'cancelBannerOrder')
    });
    await queryInterface.changeColumn('activityArchive', 'type', {
      allowNull: false,
      type: DataTypes.ENUM('login', 'register', 'registerVerified', 'resetpass', 'resetpassComplete', 'logout', 'surfStart', 'surfComplete', 'click', 'depositAccepted', 'depositComplete', 'withdrawRequested', 'withdrawAccepted', 'withdrawComplete', 'withdrawRejected', 'createSurfOrder', 'cancelSurfOrder', 'createClickOrder', 'cancelClickOrder', 'jackpot', 'buyTicket', 'buyWebslot', 'buyClickslot', 'newDomain', 'banned', 'referralBonus', 'faucetClaim', 'createBannerOrder', 'cancelBannerOrder')
    });
  }
};