'use strict';
const typeorm = require('typeorm');

exports.CreateTripTable1575034192900 = class CreateTripTable1575034192900 {
  async up(queryRunner) {
    await queryRunner.createTable(
      new typeorm.Table({
        name: 'trip',
        columns: [
          {
            name: 'id',
            type: 'string',
            generationStrategy: 'uuid',
            isGenerated: true,
            isPrimary: true,
          },
          {
            name: 'userId',
            type: 'string',
          },
          {
            name: 'name',
            type: 'string',
            isUnique: true,
          },
          {
            name: 'fromLongitude',
            type: 'float',
          },
          {
            name: 'fromLatitude',
            type: 'float',
          },
          {
            name: 'toLongitude',
            type: 'float',
          },
          {
            name: 'toLatitude',
            type: 'float',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'trip',
      new typeorm.TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
      }),
    );
  }

  async down(queryRunner) {
    const sessionTable = await queryRunner.getTable('trip');
    const userIdForeignKey = sessionTable.foreignKeys.find(
      fk => fk.columnNames.indexOf('userId') !== -1,
    );

    await queryRunner.dropForeignKey('trip', userIdForeignKey);
    await queryRunner.dropTable('trip');
  }
};
