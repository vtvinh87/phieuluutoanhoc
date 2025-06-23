
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
    playerGems?: number; // Added for achievements related to gems
    completedDailyChallengesCount?: number; // Added for achievements
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
  'StartScreen' |
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
  'EndlessPlaying' |
  'EndlessSummary';

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

export type IsEndlessUnlockedForGradeState = Partial<Record<GradeLevel, boolean>>;

// Daily Challenge System Types
export enum DailyChallengeType {
  COMPLETE_ISLANDS = "COMPLETE_ISLANDS", // Complete X islands (any grade/difficulty)
  EARN_STARS = "EARN_STARS",           // Earn X stars in total
  CORRECT_ANSWERS_IN_A_ROW = "CORRECT_ANSWERS_IN_A_ROW", // Get X correct answers in a row (during one island play)
  OPEN_TREASURE_CHESTS = "OPEN_TREASURE_CHESTS",
  COLLECT_SHOOTING_STARS = "COLLECT_SHOOTING_STARS",
  INTERACT_WITH_NPCS = "INTERACT_WITH_NPCS",
}

// Defines a potential challenge template
export interface DailyChallengeDefinition {
  id: string; // Unique identifier for the challenge definition (e.g., "complete_3_islands")
  type: DailyChallengeType;
  descriptionTemplate: (targetValue: number) => string; // e.g., "Hoàn thành {targetValue} hòn đảo."
  generateTargetValue: () => number; // Function to generate a random target (e.g., 1 to 3 islands)
  rewardGems: number;
  actionTypeToTrack: string; // Used to link game events to challenge progress (e.g., "ISLAND_COMPLETED")
  streakChallenge?: boolean; // True if this is a streak-based challenge
}

// Represents an active or stored daily challenge instance
export interface DailyChallenge {
  id: string; // Instance ID, unique for this specific generated challenge (uuidv4)
  definitionId: string; // Links to DailyChallengeDefinition.id
  type: DailyChallengeType;
  description: string; // Generated from template
  targetValue: number;
  currentValue: number;
  rewardGems: number;
  generatedDate: string; // YYYY-MM-DD format
  isCompleted: boolean;
  rewardClaimed: boolean;
  currentStreak?: number; // For streak challenges
}

export type ActiveDailyChallengeState = DailyChallenge | null;
export type PlayerGemsState = number;
export type CompletedDailyChallengesLogState = Record<string, { date: string, challengeId: string }>; // Store YYYY-MM-DD -> {date, challengeId}
                                                                                                 // To track completion history for achievements. Key is the challenge instance ID.


// Action types for tracking challenge progress
export const CHALLENGE_ACTION_ISLAND_COMPLETED = "ISLAND_COMPLETED";
export const CHALLENGE_ACTION_STAR_EARNED = "STAR_EARNED"; // Could be total stars from an island completion
export const CHALLENGE_ACTION_CORRECT_ANSWER = "CORRECT_ANSWER";
export const CHALLENGE_ACTION_TREASURE_CHEST_OPENED = "TREASURE_CHEST_OPENED";
export const CHALLENGE_ACTION_SHOOTING_STAR_COLLECTED = "SHOOTING_STAR_COLLECTED";
export const CHALLENGE_ACTION_NPC_INTERACTED = "NPC_INTERACTED";
