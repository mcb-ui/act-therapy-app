import express from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import prisma from '../lib/prisma.js';

// Improvement #34: Use shared Prisma instance

const router = express.Router();

// Get user values
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const values = await prisma.value.findMany({
      where: { userId: req.userId! },
      orderBy: { importance: 'desc' },
    });
    res.json(values);
  } catch (error) {
    console.error('Failed to fetch values:', error);
    res.status(500).json({ error: 'Failed to fetch values' });
  }
});

// Create value
router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { category, description, importance, alignment } = req.body;

    if (!category || !description) {
      return res.status(400).json({ error: 'Category and description are required' });
    }

    const value = await prisma.value.create({
      data: {
        userId: req.userId!,
        category,
        description,
        importance: importance ?? 5,
        alignment: alignment ?? 5,
      },
    });

    res.json(value);
  } catch (error) {
    console.error('Failed to create value:', error);
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
    console.error('Failed to update value:', error);
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
    console.error('Failed to delete value:', error);
    res.status(500).json({ error: 'Failed to delete value' });
  }
});

export default router;
