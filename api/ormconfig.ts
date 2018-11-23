import config from 'config';

const DB_CONFIG = config.get('db');

export = {
  name: 'default',
  type: 'mysql',
  ...DB_CONFIG,
  entities: ['src/entity/**/*.ts'],
  migrations: ['src/migration/**/*.ts'],
  subscribers: ['src/subscriber/**/*.ts'],
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'src/migration',
    subscribersDir: 'src/subscriber',
  },
};
