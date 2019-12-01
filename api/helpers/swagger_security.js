'use strict';
const typeorm = require('typeorm');

module.exports = {
  swaggerSecurityHandlers: {
    ApiKeyAuth: async function(req, authOrSecDef, scopesOrApiKey, callback) {
      try {
        const sessionRepository = typeorm.getRepository('Session');
        const session = await sessionRepository.findOne(scopesOrApiKey, {
          relations: ['user'],
        });
        if (session) {
          req.session = session;
          callback();
        } else {
          callback(new Error('Api key missing or not registered'));
        }
      } catch (err) {
        callback(new Error('Api key missing or not registered'));
      }
    },
  },
};
