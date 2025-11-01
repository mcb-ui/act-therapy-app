import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get user values
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const values = await prisma.value.findMany({
      where: { userId: req.userId! },
      orderBy: { importance: 'desc' },
    });
    res.json(values);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch values' });
  }
});

// Create value
router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { category, description, importance, alignment } = req.body;

    const value = await prisma.value.create({
      data: {
        userId: req.userId!,
        category,
        description,
        importance,
        alignment,
      },
    });

    res.json(value);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create value' });
  }
});

// Update value
router.put('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { category, description, importance, alignment } = req.body;

    const value = await prisma.value.update({
      where: { id },
      data: { category, description, importance, alignment },
    });

    res.json(value);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update value' });
  }
});

// Delete value
router.delete('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    await prisma.value.delete({ where: { id } });
    res.json({ message: 'Value deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete value' });
  }
});

export default router;
