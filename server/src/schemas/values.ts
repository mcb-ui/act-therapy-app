import { z } from 'zod';

export const createValueSchema = {
  body: z.object({
    category: z.string().min(1),
    description: z.string().min(1),
    importance: z.number().int().min(1).max(10),
    alignment: z.number().int().min(0).max(10),
  }),
};

export const updateValueSchema = {
  params: z.object({
    id: z.string(),
  }),
  body: z
    .object({
      category: z.string().min(1).optional(),
      description: z.string().min(1).optional(),
      importance: z.number().int().min(1).max(10).optional(),
      alignment: z.number().int().min(0).max(10).optional(),
    })
    .refine((data) => {
      return (
        data.category !== undefined ||
        data.description !== undefined ||
        data.importance !== undefined ||
        data.alignment !== undefined
      );
    }, 'At least one field must be present'),
};
