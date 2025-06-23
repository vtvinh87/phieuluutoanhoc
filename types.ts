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
export type AllGradesStarRatingsState = Record<GradeLevel, IslandStarRatingsState>;


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
  backgroundUrl: string; // General fallback remote URL
  backgroundUrlSideBySideLayout?: string; // Specific remote URL for desktop/side-by-side
  backgroundUrlStackedLayout?: string;    // Specific remote URL for mobile/stacked
  localBackgroundUrlSideBySideLayout?: string; // Specific local path for desktop/side-by-side
  localBackgroundUrlStackedLayout?: string;    // Specific local path for mobile/stacked
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

// Achievement System Types
export type AchievementId = string; // Example: "ACH_ISLAND_EXPLORER_G1", "ACH_THEME_SWAPPER"

export interface Achievement {
  id: AchievementId;
  name: string;
  description: (param?: string | number) => string; // Function to allow dynamic descriptions
  icon: string; // Emoji or key for an SVG icon
  gradeSpecific: boolean; // True if this achievement is tied to a specific grade
  isGlobal?: boolean; // True if this is a global achievement not tied to any grade progression (e.g. theme swapper)
  condition?: (
    selectedGrade: GradeLevel | null,
    islandProgress: IslandProgressState, // For current grade
    islandStarRatings: IslandStarRatingsState, // For current grade
    islandsForGrade: IslandConfig[],
    currentOverallScore?: number,
    allGradeIslandConfigs?: IslandConfig[],
    allGradesProgress?: Record<GradeLevel, IslandProgressState>,
    themeSwapped?: boolean,
    // Optional context for island completion achievements
    currentIslandDifficulty?: IslandDifficulty | null,
    hintUsedInLastIslandCompletion?: boolean,
    allGradesStarRatings?: AllGradesStarRatingsState // For global star-based achievements
  ) => boolean;
}

export interface AchievedAchievement {
  id: AchievementId;
  achievedAt: number; // Timestamp
  gradeContext?: GradeLevel; // For displaying context if needed
}

export type AchievedAchievementsState = Record<AchievementId, AchievedAchievement>;


// Hard mode progress (if needed for future achievements)
export interface HardModeIslandStats {
  completed: boolean;
  mastered: boolean; // 5-starred on hard
}
export interface HardModeGradeProgress {
  [islandId: string]: HardModeIslandStats;
}
export type HardModeProgressState = Record<GradeLevel, HardModeGradeProgress>;

// Toast Notification
export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  icon?: React.ReactNode;
}

// Treasure Chest Feature
export type ActiveTreasureChestsState = Partial<Record<GradeLevel, Record<string, boolean>>>;

export interface FunQuiz {
  id: string;
  question: string;
  options?: string[]; // For multiple choice
  answer: string; // Correct option text for MC, or the direct answer for fill-in-the-blank
  points: number;
  type: 'mc' | 'fill'; // Type of quiz
}

export type GameState = 
  'ThemeSelection' | 
  'GradeSelection' | 
  'IslandMap' | 
  'IslandPlaying' | 
  'IslandComplete' | 
  'GradeComplete' | 
  'Transitioning' | 
  'Error' |
  'TreasureChestOpening' |
  'MessageInBottleReading' |
  'FriendlyNPCInteraction'; // New state for Friendly NPC modal

// Message in a Bottle
export type ActiveMessageBottlesState = Record<string, { grade: GradeLevel; messageId: string } | undefined>; // islandId -> { grade, messageId }

export interface MessageInBottleContent {
  id: string;
  text: string;
  type: 'wish' | 'quote' | 'hint';
}

// Shooting Star
export interface ShootingStarData {
  id: string;
  startX: string; // percentage string e.g., "0%"
  startY: string; // percentage string
  endX: string;   // percentage string
  endY: string;   // percentage string
  duration: number; // ms
  size: number; // px
  delay: number; // ms, for animation start
  visible: boolean;
  clicked: boolean;
}

// Friendly NPC
export interface FriendlyNPC {
  id: string;
  name: string;
  imageUrl: string;
}

export interface NPCInteraction {
  id: string;
  npcIds?: string[]; // Optional: if specific to an NPC or set of NPCs. If undefined, it's generic.
  type: 'fact' | 'encouragement' | 'riddle';
  text: string;
  answer?: string; // For riddles
  options?: string[]; // For MC riddles
  points: number; 
}

export interface ActiveNPCInfo {
  npc: FriendlyNPC;
  interaction: NPCInteraction;
  islandId: string;
  grade: GradeLevel; // Grade of the island where NPC spawned
}

export type StoredActiveNPCInfo = {
  npcId: string;
  interactionId: string;
  islandId: string;
  grade: GradeLevel;
} | null;
