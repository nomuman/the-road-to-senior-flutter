import { z } from 'zod';

export const QuizQuestionSchema = z.object({
  question: z.string(),
  options: z.array(z.string()),
  correctAnswer: z.number().int(),
  explanation: z.string(),
});

export const QuizSchema = z.object({
  questions: z.array(QuizQuestionSchema),
});

export const LessonSchema = z.object({
  id: z.string().uuid(),
  module_id: z.string().uuid(),
  title: z.string(),
  module_title: z.string(),
  objective: z.string().nullable(),
  concepts: z.array(z.string()),
  relevance: z.string().nullable(),
  quiz_data: QuizSchema.nullable(), // SupabaseのJSONBに対応
  created_at: z.string().datetime(),
});

export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;
export type Quiz = z.infer<typeof QuizSchema>;
export type Lesson = z.infer<typeof LessonSchema>;