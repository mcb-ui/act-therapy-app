import jwt from 'jsonwebtoken';
import { config } from './config.js';

export interface AuthTokenPayload {
  userId: string;
}

export const createAuthToken = (userId: string) =>
  jwt.sign({ userId }, config.jwtSecret, { expiresIn: '7d' });

export const verifyAuthToken = (token: string) =>
  jwt.verify(token, config.jwtSecret) as AuthTokenPayload;
