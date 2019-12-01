'use strict';
const typeorm = require('typeorm');

module.exports = new typeorm.EntitySchema({
  name: 'Trip',
  columns: {
    id: {
      primary: true,
      type: 'uuid',
      generated: 'uuid',
    },
    name: {
      type: 'text',
      unique: true,
    },
    fromLongitude: {
      type: 'float',
    },
    fromLatitude: {
      type: 'float',
    },
    toLongitude: {
      type: 'float',
    },
    toLatitude: {
      type: 'float',
    },
  },
  relations: {
    user: {
      target: 'User',
      type: 'many-to-one',
    },
  },
});
