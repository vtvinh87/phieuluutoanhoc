
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

export interface Question {
  id: string; 
  text: string; 
  targetGradeLevel: GradeLevel; // Renamed from gradeLevel to match IslandConfig
  topic: string; 
  type: QuestionType;
  options: string[];
  correctAnswer: string;
  image?: string;
  islandId?: string; // Optional: To associate question with a specific island
  islandName?: string; // Optional: Name of the island this question belongs to
}

export interface AnswerAttempt {
  isCorrect: boolean;
  isHintUsed?: boolean;
}

// New types for Island-based progression
export interface IslandConfig {
  islandId: string; // e.g., "island_01_start"
  islandNumber: number; // For sequential ordering and unlocking
  name: string; // e.g., "Đảo Khởi Đầu"
  description: string; // e.g., "Những bài toán đếm số và so sánh đơn giản."
  topics: string[]; // Topics for Gemini, e.g., ["đếm số từ 1 đến 10", "so sánh số phạm vi 10"]
  targetGradeLevel: GradeLevel; // Difficulty target for questions on this island
  mapIcon?: string; // Optional: for a visual map later, e.g., "🏝️" or "volcano.png"
  // mapPosition?: { x: number, y: number }; // For visual map - keep simple for now
}

export type IslandStatus = 'locked' | 'unlocked' | 'completed';

export type IslandProgressState = Record<string, IslandStatus>; // islandId: status
export type IslandStarRatingsState = Record<string, number>; // islandId: numberOfStars