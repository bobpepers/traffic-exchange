module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface
      .changeColumn('activity', 'type', {
        allowNull: false,
        type: DataTypes.ENUM(
          'login',
          'register',
          'registerVerified',
          'resetpass',
          'resetpassComplete',
          'logout',
          'surfStart',
          'surfComplete',
          'click',
          'depositAccepted',
          'depositComplete',
          'withdrawRequested',
          'withdrawAccepted',
          'withdrawComplete',
          'withdrawRejected',
          'createSurfOrder',
          'cancelSurfOrder',
          'createClickOrder',
          'cancelClickOrder',
          'jackpot',
          'buyTicket',
          'buyWebslot',
          'buyClickslot',
          'newDomain',
          'banned',
          'referralBonus',
          'faucetClaim',
        ),
      });
    await queryInterface
      .changeColumn('activityArchive', 'type', {
        allowNull: false,
        type: DataTypes.ENUM(
          'login',
          'register',
          'registerVerified',
          'resetpass',
          'resetpassComplete',
          'logout',
          'surfStart',
          'surfComplete',
          'click',
          'depositAccepted',
          'depositComplete',
          'withdrawRequested',
          'withdrawAccepted',
          'withdrawComplete',
          'withdrawRejected',
          'createSurfOrder',
          'cancelSurfOrder',
          'createClickOrder',
          'cancelClickOrder',
          'jackpot',
          'buyTicket',
          'buyWebslot',
          'buyClickslot',
          'newDomain',
          'banned',
          'referralBonus',
          'faucetClaim',
        ),
      });
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface
      .changeColumn('activity', 'type', {
        allowNull: false,
        type: DataTypes.ENUM(
          'login',
          'register',
          'registerVerified',
          'resetpass',
          'resetpassComplete',
          'logout',
          'surfStart',
          'surfComplete',
          'click',
          'depositAccepted',
          'depositComplete',
          'withdrawRequested',
          'withdrawAccepted',
          'withdrawComplete',
          'withdrawRejected',
          'createSurfOrder',
          'cancelSurfOrder',
          'createClickOrder',
          'cancelClickOrder',
          'jackpot',
          'buyTicket',
          'buyWebslot',
          'buyClickslot',
          'newDomain',
          'banned',
          'referralBonus',
        ),
      });
    await queryInterface
      .changeColumn('activityArchive', 'type', {
        allowNull: false,
        type: DataTypes.ENUM(
          'login',
          'register',
          'registerVerified',
          'resetpass',
          'resetpassComplete',
          'logout',
          'surfStart',
          'surfComplete',
          'click',
          'depositAccepted',
          'depositComplete',
          'withdrawRequested',
          'withdrawAccepted',
          'withdrawComplete',
          'withdrawRejected',
          'createSurfOrder',
          'cancelSurfOrder',
          'createClickOrder',
          'cancelClickOrder',
          'jackpot',
          'buyTicket',
          'buyWebslot',
          'buyClickslot',
          'newDomain',
          'banned',
          'referralBonus',
        ),
      });
  },
};
