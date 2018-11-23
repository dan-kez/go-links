module.exports = {
  port: process.env.NODE_PORT || '3001',
  hostname: '0.0.0.0',
  db: {
    host: 'mysql',
    port: 3306,
    username: 'app',
    password: 'app',
    database: 'golinks',
  }
};
