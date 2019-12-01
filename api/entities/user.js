'use strict';
const typeorm = require('typeorm');

module.exports = new typeorm.EntitySchema({
  name: 'User',
  columns: {
    id: {
      primary: true,
      type: 'uuid',
      generated: 'uuid',
    },
    username: {
      type: 'text',
      unique: true,
    },
    password: {
      type: 'text',
    },
    locationLongitude: {
      type: 'float',
    },
    locationLatitude: {
      type: 'float',
    },
  },
  relations: {
    sessions: {
      target: 'Session',
      type: 'one-to-many',
    },
  },
});
