const DEV_FALLBACK_SECRET = 'development-only-jwt-secret';

if (!process.env.JWT_SECRET) {
  console.warn(
    '⚠️  Using development fallback JWT secret. Set JWT_SECRET in server/.env for production or shared environments.'
  );
}

export const JWT_SECRET = process.env.JWT_SECRET || DEV_FALLBACK_SECRET;
