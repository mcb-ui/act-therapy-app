const FALLBACK_DEV_JWT_SECRET = 'act-therapy-app-development-secret';

const parsePort = (value: string | undefined) => {
  const parsed = Number.parseInt(value ?? '5001', 10);

  if (Number.isNaN(parsed)) {
    throw new Error(`Invalid PORT value: ${value}`);
  }

  return parsed;
};

const normalizeOrigins = (value: string | undefined) =>
  value
    ?.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean) ?? [];

const nodeEnv = process.env.NODE_ENV?.trim() || 'development';
const isProduction = nodeEnv === 'production';
const configuredJwtSecret = process.env.JWT_SECRET?.trim();

if (isProduction && !configuredJwtSecret) {
  throw new Error('JWT_SECRET is required in production');
}

if (!configuredJwtSecret && !isProduction) {
  console.warn('JWT_SECRET is not set. Using a development fallback secret.');
}

export const config = {
  port: parsePort(process.env.PORT),
  nodeEnv,
  isProduction,
  jwtSecret: configuredJwtSecret || FALLBACK_DEV_JWT_SECRET,
  allowedOrigins: normalizeOrigins(process.env.CLIENT_ORIGIN),
} as const;
