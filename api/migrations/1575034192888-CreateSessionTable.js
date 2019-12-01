'use strict';
const typeorm = require('typeorm');

exports.CreateSessionTable1575034192888 = class CreateSessionTable1575034192888 {
  async up(queryRunner) {
    await queryRunner.createTable(
      new typeorm.Table({
        name: 'session',
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
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'session',
      new typeorm.TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
      }),
    );
  }

  async down(queryRunner) {
    const sessionTable = await queryRunner.getTable('session');
    const userIdForeignKey = sessionTable.foreignKeys.find(
      fk => fk.columnNames.indexOf('userId') !== -1,
    );

    await queryRunner.dropForeignKey('session', userIdForeignKey);
    await queryRunner.dropTable('session');
  }
};
