import express from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import { createAuthToken } from '../lib/auth.js';
import { handleRouteError, normalizeEmail, requireString } from '../lib/validation.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const password = requireString(req.body.password, {
      minLength: 8,
      maxLength: 128,
      fieldName: 'password',
    });
    const name = requireString(req.body.name, {
      minLength: 2,
      maxLength: 80,
      fieldName: 'name',
    });

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    // Generate token
    const token = createAuthToken(user.id);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    return handleRouteError(res, error, 'Registration failed');
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const password = requireString(req.body.password, {
      minLength: 1,
      maxLength: 128,
      fieldName: 'password',
    });

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = createAuthToken(user.id);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    return handleRouteError(res, error, 'Login failed');
  }
});

router.get('/me', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId! },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({ user });
  } catch (error) {
    return handleRouteError(res, error, 'Failed to fetch user');
  }
});

export default router;
