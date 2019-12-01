'use strict';

const SwaggerExpress = require('swagger-express-mw');
const app = require('express')();
const typeorm = require('typeorm');
module.exports = app; // for testing
const swaggerSecurity = require('./api/helpers/swagger_security.js');

const config = {
  appRoot: __dirname,
  swaggerSecurityHandlers: swaggerSecurity.swaggerSecurityHandlers,
};

SwaggerExpress.create(config, async function(err, swaggerExpress) {
  if (err) {
    throw err;
  }

  // install middleware
  swaggerExpress.register(app);

  await typeorm.createConnection();

  var port = process.env.PORT || 10010;
  app.listen(port);

  if (swaggerExpress.runner.swagger.paths['/hello']) {
    console.log(
      'try this:\ncurl http://127.0.0.1:' + port + '/hello?name=Scott',
    );
  }
});
