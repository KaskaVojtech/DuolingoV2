/**
 * Central loading of configuration from env variables (database, Redis, JWT, refresh token, Ollama, frontend URL).
 */
export default () => ({
  port: parseInt(process.env.PORT ?? '3001', 10),
  database: {
    host:     process.env.POSTGRES_HOST,
    port:     parseInt(process.env.POSTGRES_PORT ?? '5432', 10),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  },
  redis: {
    url: process.env.REDIS_URL,
  },
  jwt: {
    secret:     process.env.JWT_SECRET,
    expiresIn:  process.env.JWT_EXPIRES_IN ?? '15m',
  },
  refreshToken: {
    ttlSeconds: parseInt(process.env.REFRESH_TOKEN_TTL_SECONDS ?? '604800', 10),
  },
  frontend: {
    url: process.env.FRONTEND_URL ?? 'http://localhost:3000',
  },
  ollama: {
    url:       process.env.OLLAMA_URL ?? 'http://localhost:11434',
    model:     process.env.OLLAMA_MODEL ?? 'qwen2.5:0.5b',
    timeoutMs: parseInt(process.env.OLLAMA_TIMEOUT_MS ?? '90000', 10),
  },
});
