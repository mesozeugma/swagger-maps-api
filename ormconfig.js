module.exports = {
  type: 'sqlite',
  database: process.env.API_DB_DATABASE || './data.sqlite',
  entities: [
    require('./api/entities/session'),
    require('./api/entities/trip'),
    require('./api/entities/user'),
  ],
  migrations: ['api/migrations/*.js'],
  migrationsRun: process.env.NODE_ENV !== 'production',
  cli: {
    migrationsDir: 'api/migrations',
  },
};
