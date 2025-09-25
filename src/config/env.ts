import "dotenv/config";

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required env var: ${key}`);
  }
  return value;
}

export const config = {
  env: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 5000),

  // Database
  dbUrl: requireEnv("DATABASE_URL"),

  // Access Token
  jwtAccessSecret: requireEnv("JWT_ACCESS_SECRET"),
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? "15m",

  // Refresh Token
  jwtRefreshSecret: requireEnv("JWT_REFRESH_SECRET"),
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? "15d",

  // Bcrypt
  bcryptRounds: Number(process.env.BCRYPT_ROUNDS ?? 10),
};