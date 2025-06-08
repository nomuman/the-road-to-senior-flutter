import { z } from 'zod';

export const ModuleSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().nullable(),
  created_at: z.string().datetime(),
});

export type Module = z.infer<typeof ModuleSchema>;