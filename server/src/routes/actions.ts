import express from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';
import { prisma } from '../lib/prisma.js';
import {
  handleRouteError,
  optionalDate,
  optionalString,
  requireString,
} from '../lib/validation.js';

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
    const normalizedValueId = optionalString(req.body.valueId, {
      maxLength: 120,
      fieldName: 'valueId',
    });
    const title = requireString(req.body.title, {
      minLength: 2,
      maxLength: 120,
      fieldName: 'title',
    });
    const description = optionalString(req.body.description, {
      maxLength: 1000,
      fieldName: 'description',
    });
    const dueDate = optionalDate(req.body.dueDate, 'dueDate');

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
    return handleRouteError(res, error, 'Failed to create action');
  }
});

// Update action
router.put('/:id', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const title = requireString(req.body.title, {
      minLength: 2,
      maxLength: 120,
      fieldName: 'title',
    });
    const description = optionalString(req.body.description, {
      maxLength: 1000,
      fieldName: 'description',
    });
    const normalizedValueId = optionalString(req.body.valueId, {
      maxLength: 120,
      fieldName: 'valueId',
    });
    const dueDate = optionalDate(req.body.dueDate, 'dueDate');
    const completed = Boolean(req.body.completed);
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
    return handleRouteError(res, error, 'Failed to update action');
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
    return handleRouteError(res, error, 'Failed to delete action');
  }
});

export default router;
