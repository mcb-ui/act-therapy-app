import express from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import { prisma } from '../lib/prisma.js';

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
    res.status(500).json({ error: 'Failed to fetch actions' });
  }
});

// Create action
router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { valueId, title, description, dueDate } = req.body;
    const normalizedValueId = valueId || null;

    if (normalizedValueId) {
      const linkedValue = await prisma.value.findFirst({
        where: {
          id: normalizedValueId,
          userId: req.userId!,
        },
      });

      if (!linkedValue) {
        return res.status(400).json({ error: 'Linked value not found' });
      }
    }

    const action = await prisma.action.create({
      data: {
        userId: req.userId!,
        valueId: normalizedValueId,
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
    const { title, description, completed, dueDate, valueId } = req.body;
    const normalizedValueId = valueId || null;
    const existingAction = await prisma.action.findFirst({
      where: {
        id,
        userId: req.userId!,
      },
    });

    if (!existingAction) {
      return res.status(404).json({ error: 'Action not found' });
    }

    if (normalizedValueId) {
      const linkedValue = await prisma.value.findFirst({
        where: {
          id: normalizedValueId,
          userId: req.userId!,
        },
      });

      if (!linkedValue) {
        return res.status(400).json({ error: 'Linked value not found' });
      }
    }

    const action = await prisma.action.update({
      where: { id },
      data: {
        title,
        description,
        completed,
        dueDate: dueDate ? new Date(dueDate) : null,
        valueId: normalizedValueId,
      },
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
    const existingAction = await prisma.action.findFirst({
      where: {
        id,
        userId: req.userId!,
      },
    });

    if (!existingAction) {
      return res.status(404).json({ error: 'Action not found' });
    }

    await prisma.action.delete({ where: { id } });
    res.json({ message: 'Action deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete action' });
  }
});

export default router;
