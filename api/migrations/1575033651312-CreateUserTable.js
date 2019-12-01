'use strict';
const typeorm = require('typeorm');

exports.CreateUserTable1575033651312 = class CreateUserTable1575033651312 {
  async up(queryRunner) {
    await queryRunner.createTable(
      new typeorm.Table({
        name: 'user',
        columns: [
          {
            name: 'id',
            type: 'string',
            generationStrategy: 'uuid',
            isGenerated: true,
            isPrimary: true,
          },
          {
            name: 'username',
            type: 'string',
            isUnique: true,
          },
          {
            name: 'password',
            type: 'string',
          },
          {
            name: 'locationLongitude',
            type: 'float',
            isNullable: true,
          },
          {
            name: 'locationLatitude',
            type: 'float',
            isNullable: true,
          },
        ],
      }),
    );
  }

  async down(queryRunner) {
    await queryRunner.dropTable('user');
  }
};
