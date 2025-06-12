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

export enum Theme {
  DEFAULT = 'default', // Will be overridden by FRUTIGER_AERO as the functional default
  NEON = 'neon',
  GIRLY = 'girly',
  FRUTIGER_AERO = 'frutiger_aero',
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

// Ensure PreloadedIslandDifficulties explicitly lists all difficulties
export interface PreloadedIslandDifficulties {
  [IslandDifficulty.EASY]?: PreloadedQuestionSet;
  [IslandDifficulty.MEDIUM]?: PreloadedQuestionSet;
  [IslandDifficulty.HARD]?: PreloadedQuestionSet;
}

export type PreloadedQuestionsCache = {
  [islandId: string]: PreloadedIslandDifficulties | undefined;
};

// This interface is defined in themes.ts but re-declared here for use in other files.
// It's generally better to define it once and import it.
// For the purpose of this exercise, keeping it in types.ts if it's broadly used.
export interface ThemeConfig {
  name: string;
  backgroundUrl: string;
  backgroundUrlSideBySideLayout?: string; // For desktop-like layout (panels next to each other)
  backgroundUrlStackedLayout?: string;    // For mobile-like layout (panels stacked)
  // Primary colors
  primaryBg: string; 
  primaryText: string;
  secondaryBg: string; 
  secondaryText: string;
  // Accent colors
  accent: string;
  accentText: string;
  // Button specific
  buttonPrimaryBg: string;
  buttonPrimaryText: string;
  buttonSecondaryBg: string; 
  buttonSecondaryText: string; 
  buttonAnswerOptionBg: string; 
  buttonAnswerOptionText: string;
  buttonAnswerOptionRing: string;
  buttonAnswerOptionSelectedBg: string;
  buttonAnswerOptionSelectedText: string;
  buttonAnswerOptionSelectedRing: string;
  // Feedback colors
  correctBg: string;
  correctText: string;
  correctRing: string;
  incorrectBg: string;
  incorrectText: string;
  incorrectRing: string;
  // Modal specific
  modalBgBackdrop: string; 
  modalContentBg: string;
  modalHeaderText: string;
  // Borders and Rings
  borderColor: string;
  ringColorFocus: string; 
  // Text for titles, headers
  titleTextGradientFrom: string;
  titleTextGradientTo: string;
  // Island Map Button Styles
  islandButtonLockedBg: string;
  islandButtonUnlockedBg: string;
  islandButtonCompletedBg: string;
  islandButtonLockedText: string;
  islandButtonUnlockedText: string;
  islandButtonCompletedText: string;
  islandButtonRingColor: string;
  // Question Display
  questionDisplayBg: string;
  questionDisplayText: string;
  questionDisplayImageBorder: string;
  // Spinner Color
  spinnerColor: string; 
  // General UI elements
  appContainerBg: string; 
  // Special
  frostedGlassOpacity?: string; 
  fontFamily: string; 
}