export default () => ({
  server: {
    port: parseInt(process.env.PORT, 10) || 3000,
  },
  // переименовываем переменные окружения для возможности подключения докер-контейнера postgres
  database: {
    host: process.env.POSTGRES_HOST || 'postgres',
    port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
    username: process.env.POSTGRES_USER || 'student',
    password: process.env.POSTGRES_PASSWORD || 'student',
    name: process.env.POSTGRES_DB || 'kupipodariday',
  },
  jwt: {
    key: process.env.JWT_KEY || 'super-strong-secret',
    ttl: parseInt(process.env.JWT_EXPIRATION_TIME) || '36000',
  },
});
