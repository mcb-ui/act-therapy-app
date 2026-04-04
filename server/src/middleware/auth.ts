import { Request, Response, NextFunction } from 'express';
import { verifyAuthToken } from '../lib/auth.js';

export interface AuthRequest extends Request {
  userId?: string;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'A valid Bearer token is required' });
    }

    const token = authHeader.slice('Bearer '.length).trim();
    const decoded = verifyAuthToken(token);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
