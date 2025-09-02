function getEnv(key: string): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Env variable ${key} is not set`);
  }

  return value || "";
}

function getEnvNumber(key: string): number {
  const value = process.env[key];
  const num = Number(value);

  if (isNaN(num)) {
    throw new Error(`Env variable ${key} must be a number`);
  }

  return num;
}

export const PORT = getEnvNumber("PORT");
export const CLIENT_ORIGIN_URL = getEnv("CLIENT_ORIGIN_URL");
export const DATABASE_URL = getEnv("DATABASE_URL");
export const ACCESS_TOKEN = getEnv("ACCESS_TOKEN");
export const REFRESH_TOKEN = getEnv("REFRESH_TOKEN");
export const ACCESS_TOKEN_EXPIRES = getEnvNumber("ACCESS_TOKEN_EXPIRES");
export const REFRESH_TOKEN_EXPIRES = getEnvNumber("REFRESH_TOKEN_EXPIRES");
