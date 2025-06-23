// The problematic module declaration has been removed.

export enum GradeLevel {
  GRADE_1 = 1,
  GRADE_2 = 2,
  GRADE_3 = 3,
  GRADE_4 = 4,
  GRADE_5 = 5,
  FINAL = 99, // For the Final Treasure Island
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
  DEFAULT = 'default', 
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


export type PreloadedQuestionSet = Question[] | 'loading' | 'error' | 'pending';

export interface PreloadedIslandDifficulties {
  [IslandDifficulty.EASY]?: PreloadedQuestionSet;
  [IslandDifficulty.MEDIUM]?: PreloadedQuestionSet;
  [IslandDifficulty.HARD]?: PreloadedQuestionSet;
}

export type PreloadedQuestionsCache = {
  [islandId: string]: PreloadedIslandDifficulties | undefined;
};

export interface ThemeConfig {
  name: string;
  backgroundUrl: string; 
  backgroundUrlSideBySideLayout?: string; 
  backgroundUrlStackedLayout?: string;    
  localBackgroundUrlSideBySideLayout?: string; 
  localBackgroundUrlStackedLayout?: string;    
  primaryBg: string; 
  primaryText: string;
  secondaryBg: string; 
  secondaryText: string;
  accent: string;
  accentText: string;
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
  correctBg: string;
  correctText: string;
  correctRing: string;
  incorrectBg: string;
  incorrectText: string;
  incorrectRing: string;
  modalBgBackdrop: string; 
  modalContentBg: string;
  modalHeaderText: string;
  borderColor: string;
  ringColorFocus: string; 
  titleTextGradientFrom: string;
  titleTextGradientTo: string;
  islandButtonLockedBg: string;
  islandButtonUnlockedBg: string;
  islandButtonCompletedBg: string;
  islandButtonLockedText: string;
  islandButtonUnlockedText: string;
  islandButtonCompletedText: string;
  islandButtonRingColor: string;
  questionDisplayBg: string;
  questionDisplayText: string;
  questionDisplayImageBorder: string;
  spinnerColor: string; 
  appContainerBg: string; 
  frostedGlassOpacity?: string; 
  fontFamily: string; 
}

export type AchievementId = string;

// Context type for achievement conditions
export interface AchievementContext {
    selectedGrade: GradeLevel | null;
    islandProgress: IslandProgressState;
    islandStarRatings: IslandStarRatingsState;
    islandsForGrade: IslandConfig[];
    currentOverallScore?: number;
    allGradeIslandConfigs?: IslandConfig[];
    allGradesProgress?: Record<GradeLevel, IslandProgressState>;
    themeSwapped?: boolean;
    currentIslandDifficulty?: IslandDifficulty | null;
    hintUsedInLastIslandCompletion?: boolean;
    allGradesStarRatings?: AllGradesStarRatingsState;
    collectedItems?: CollectedItemsState;
    isEndlessUnlockedForGrade?: IsEndlessUnlockedForGradeState;
    isFinalIslandUnlocked?: boolean;
    // Add any other relevant state for achievements, like endless mode scores if needed later
    // endlessScore?: number; 
    // endlessQuestionsAnswered?: number;
}


export interface Achievement {
  id: AchievementId;
  name: string;
  description: (param?: string | number) => string; 
  icon: string; 
  gradeSpecific: boolean; 
  isGlobal?: boolean; 
  condition?: (context: AchievementContext) => boolean;
}

export interface AchievedAchievement {
  id: AchievementId;
  achievedAt: number; 
  gradeContext?: GradeLevel; 
}

export type AchievedAchievementsState = Record<AchievementId, AchievedAchievement>;


export interface HardModeIslandStats {
  completed: boolean;
  mastered: boolean; 
}
export interface HardModeGradeProgress {
  [islandId: string]: HardModeIslandStats;
}
export type HardModeProgressState = Record<GradeLevel, HardModeGradeProgress>;

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  icon?: React.ReactNode;
}

export type ActiveTreasureChestsState = Partial<Record<GradeLevel, Record<string, boolean>>>;

export interface FunQuiz {
  id: string;
  question: string;
  options?: string[]; 
  answer: string; 
  points: number;
  type: 'mc' | 'fill'; 
}

export type GameState = 
  'StartScreen' | // New initial state
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
  'FriendlyNPCInteraction' |
  'EndlessPlaying' |      // New state for Endless Mode
  'EndlessSummary';       // New state for Endless Mode summary

export type ActiveMessageBottlesState = Record<string, { grade: GradeLevel; messageId: string } | undefined>; 

export interface MessageInBottleContent {
  id: string;
  text: string;
  type: 'wish' | 'quote' | 'hint';
}

export interface ShootingStarData {
  id: string;
  startX: string; 
  startY: string; 
  endX: string;   
  endY: string;   
  duration: number; 
  size: number; 
  delay: number; 
  visible: boolean;
  clicked: boolean;
}

export interface FriendlyNPC {
  id: string;
  name: string;
  imageUrl: string;
}

export interface NPCInteraction {
  id: string;
  npcIds?: string[]; 
  type: 'fact' | 'encouragement' | 'riddle';
  text: string;
  answer?: string; 
  options?: string[]; 
  points: number; 
}

export interface ActiveNPCInfo {
  npc: FriendlyNPC;
  interaction: NPCInteraction;
  islandId: string;
  grade: GradeLevel; 
}

export type StoredActiveNPCInfo = {
  npcId: string;
  interactionId: string;
  islandId: string;
  grade: GradeLevel;
} | null;

export interface CollectibleItem {
  id: string; 
  name: string; 
  icon: string; 
  description: string; 
}

export type ActiveCollectibleState = Record<string, { grade: GradeLevel; collectibleId: string } | undefined>; 
export type CollectedItemsState = Record<string, boolean>; 

// Endless Mode Specific Types
export type IsEndlessUnlockedForGradeState = Partial<Record<GradeLevel, boolean>>;


// Final Island Specific Types
// No new specific type needed for isFinalIslandUnlocked, will be boolean.