export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Quiz {
  questions: QuizQuestion[];
}

export interface Lesson {
  id: string;
  title: string;
  moduleTitle: string;
  objective: string;
  concepts: string[];
  relevance: string;
  quiz?: Quiz;
}

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export type Progress = {
  [lessonId: string]: boolean;
};