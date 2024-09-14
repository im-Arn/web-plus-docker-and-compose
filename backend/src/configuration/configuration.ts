export default () => ({
  server: {
    port: parseInt(process.env.PORT, 10) || 3000,
  },
  database: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT, 10) || 5433,
    username: process.env.DATABASE_USERNAME || 'student',
    password: process.env.DATABASE_PASSWORD || 'student',
    name: process.env.DATABASE_NAME || 'kupipodariday',
  },
  jwt: {
    key: process.env.JWT_KEY || 'super-strong-secret',
    ttl: parseInt(process.env.JWT_EXPIRATION_TIME) || '36000',
  },
});
