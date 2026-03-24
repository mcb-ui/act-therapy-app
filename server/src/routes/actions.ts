import express from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import prisma from '../lib/prisma.js';

// Improvement #34: Use shared Prisma instance

const router = express.Router();

// Get user actions
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const actions = await prisma.action.findMany({
      where: { userId: req.userId! },
      orderBy: { createdAt: 'desc' },
    });
    res.json(actions);
  } catch (error) {
    console.error('Failed to fetch actions:', error);
    res.status(500).json({ error: 'Failed to fetch actions' });
  }
});

// Create action
router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { valueId, title, description, dueDate } = req.body;

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const action = await prisma.action.create({
      data: {
        userId: req.userId!,
        valueId,
        title: title.trim(),
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });

    res.json(action);
  } catch (error) {
    console.error('Failed to create action:', error);
    res.status(500).json({ error: 'Failed to create action' });
  }
});

// Update action
router.put('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed, dueDate } = req.body;

    const action = await prisma.action.update({
      where: { id },
      data: { title, description, completed, dueDate: dueDate ? new Date(dueDate) : null },
    });

    res.json(action);
  } catch (error) {
    console.error('Failed to update action:', error);
    res.status(500).json({ error: 'Failed to update action' });
  }
});

// Delete action
router.delete('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    await prisma.action.delete({ where: { id } });
    res.json({ message: 'Action deleted' });
  } catch (error) {
    console.error('Failed to delete action:', error);
    res.status(500).json({ error: 'Failed to delete action' });
  }
});

export default router;
