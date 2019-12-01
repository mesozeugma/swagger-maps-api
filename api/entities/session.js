'use strict';
const typeorm = require('typeorm');

module.exports = new typeorm.EntitySchema({
  name: 'Session',
  columns: {
    id: {
      primary: true,
      type: 'uuid',
      generated: 'uuid',
    },
    userId: {
      type: 'uuid',
    },
  },
  relations: {
    user: {
      target: 'User',
      type: 'many-to-one',
    },
  },
});
