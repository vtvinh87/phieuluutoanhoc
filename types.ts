// The problematic module declaration has been removed.

export enum GradeLevel {
  GRADE_1 = 1,
  GRADE_2 = 2,
  GRADE_3 = 3,
  GRADE_4 = 4,
  GRADE_5 = 5,
}

export enum QuestionType {
  MULTIPLE_CHOICE = "multiple_choice",
}

export enum IslandDifficulty {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
}

export interface Question {
  id: string; 
  text: string; 
  targetGradeLevel: GradeLevel; 
  topic: string; 
  type: QuestionType;
  options: string[];
  correctAnswer: string;
  image?: string;
  islandId: string; 
  islandName: string; 
}

export interface AnswerAttempt {
  isCorrect: boolean;
  isHintUsed?: boolean;
}

export interface IslandConfig {
  islandId: string; 
  islandNumber: number; 
  name: string; 
  description: string; 
  topics: string[]; 
  targetGradeLevel: GradeLevel; 
  mapIcon?: string; 
}

export type IslandStatus = 'locked' | 'unlocked' | 'completed';

export type IslandProgressState = Record<string, IslandStatus>; 
export type IslandStarRatingsState = Record<string, number>; 

// For enhanced preloading
export type PreloadedQuestionSet = Question[] | 'loading' | 'error' | 'pending';
export interface PreloadedIslandDifficulties {
  [IslandDifficulty.EASY]?: PreloadedQuestionSet;
  [IslandDifficulty.MEDIUM]?: PreloadedQuestionSet;
  [IslandDifficulty.HARD]?: PreloadedQuestionSet;
}
export type PreloadedQuestionsCache = Record<string, PreloadedIslandDifficulties>;