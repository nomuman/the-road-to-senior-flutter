import { z } from 'zod';

export const UserProgressSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  lesson_id: z.string().uuid(),
  is_completed: z.boolean(),
  quiz_score: z.number().int().nullable(),
  completed_at: z.string().datetime().nullable(),
  created_at: z.string().datetime(),
});

export type UserProgress = z.infer<typeof UserProgressSchema>;