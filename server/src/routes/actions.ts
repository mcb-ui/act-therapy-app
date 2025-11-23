import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get user actions
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const actions = await prisma.action.findMany({
      where: { userId: req.userId! },
      orderBy: { createdAt: 'desc' },
    });
    res.json(actions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch actions' });
  }
});

// Create action
router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { valueId, title, description, dueDate } = req.body;

    const action = await prisma.action.create({
      data: {
        userId: req.userId!,
        valueId,
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : null,
      },
    });

    res.json(action);
  } catch (error) {
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
    res.status(500).json({ error: 'Failed to delete action' });
  }
});

export default router;
