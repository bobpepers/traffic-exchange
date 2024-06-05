module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn(
      'report', // name of Target model
      'userId', // name of the key we're adding
      {
        type: DataTypes.BIGINT,
        references: {
          model: 'user', // name of Source model
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );
    await queryInterface.addColumn(
      'report', // name of Target model
      'webslotId', // name of the key we're adding
      {
        type: DataTypes.BIGINT,
        references: {
          model: 'webslot', // name of Source model
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );
    await queryInterface.addColumn(
      'report', // name of Target model
      'domainId', // name of the key we're adding
      {
        type: DataTypes.BIGINT,
        references: {
          model: 'domain', // name of Source model
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    );
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.removeColumn('report', 'userId');
    await queryInterface.removeColumn('report', 'webslotId');
    await queryInterface.removeColumn('report', 'domainId');
  },
};
