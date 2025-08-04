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

export enum UserView {
  STUDENT = 'student',
  PARENT = 'parent',
  TEACHER = 'teacher',
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
  // General UI elements - Refactored for modal positioning fix
  appContainerLayout: string;   // For padding
  appContainerVisuals: string;  // For background, blur, border, shadow, etc.
  // Special
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
    playerGems?: number; 
    completedDailyChallengesCount?: number;
    completedWeeklyChallengesCount?: number; // Added for weekly challenge achievements
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
  'EndlessLoading' | 
  'EndlessPlaying' |
  'EndlessSummary' |
  'Shop' |
  'AccessoryCustomization'; // Added AccessoryCustomization state

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

// --- Daily Challenge System Types ---
export enum DailyChallengeType {
  COMPLETE_ISLANDS = "COMPLETE_ISLANDS", 
  EARN_STARS = "EARN_STARS",          
  CORRECT_ANSWERS_IN_A_ROW = "CORRECT_ANSWERS_IN_A_ROW", 
  OPEN_TREASURE_CHESTS = "OPEN_TREASURE_CHESTS",
  COLLECT_SHOOTING_STARS = "COLLECT_SHOOTING_STARS",
  INTERACT_WITH_NPCS = "INTERACT_WITH_NPCS",
}

export interface DailyChallengeDefinition {
  id: string; 
  type: DailyChallengeType;
  descriptionTemplate: (targetValue: number) => string; 
  generateTargetValue: () => number; 
  rewardGems: number;
  actionTypeToTrack: string; 
  streakChallenge?: boolean; 
}

export interface DailyChallenge {
  id: string; 
  definitionId: string; 
  type: DailyChallengeType;
  description: string; 
  targetValue: number;
  currentValue: number;
  rewardGems: number;
  generatedDate: string; // YYYY-MM-DD format
  isCompleted: boolean;
  rewardClaimed: boolean;
  currentStreak?: number; 
}

export type ActiveDailyChallengeState = DailyChallenge | null;
export type PlayerGemsState = number;
export type CompletedDailyChallengesLogState = Record<string, { date: string, challengeId: string }>;


// --- Weekly Challenge System Types ---
export enum WeeklyChallengeType {
  WC_COMPLETE_ISLANDS_ANY_DIFFICULTY = "WC_COMPLETE_ISLANDS_ANY_DIFFICULTY",
  WC_EARN_TOTAL_STARS = "WC_EARN_TOTAL_STARS",
  WC_COMPLETE_DAILY_CHALLENGES = "WC_COMPLETE_DAILY_CHALLENGES",
  WC_UNLOCK_ACHIEVEMENTS = "WC_UNLOCK_ACHIEVEMENTS",
  WC_TOTAL_CORRECT_ANSWERS = "WC_TOTAL_CORRECT_ANSWERS",
}

export interface WeeklyChallengeDefinition {
  id: string;
  type: WeeklyChallengeType;
  descriptionTemplate: (targetValue: number) => string;
  generateTargetValue: () => number;
  rewardGems: number;
  actionTypeToTrack: string; // Can be a game event or a meta-event like daily challenge completion
}

export interface WeeklyChallenge {
  id: string; // Instance ID
  definitionId: string;
  type: WeeklyChallengeType;
  description: string;
  targetValue: number;
  currentValue: number;
  rewardGems: number;
  generatedDate: string; // YYYY-MM-DD format (Monday of the week)
  isCompleted: boolean;
  rewardClaimed: boolean;
}

export type ActiveWeeklyChallengeState = WeeklyChallenge | null;
export type CompletedWeeklyChallengesLogState = Record<string, { date: string, challengeId: string }>;


// Action types for tracking challenge progress
export const CHALLENGE_ACTION_ISLAND_COMPLETED = "ISLAND_COMPLETED";
export const CHALLENGE_ACTION_STAR_EARNED = "STAR_EARNED"; 
export const CHALLENGE_ACTION_CORRECT_ANSWER = "CORRECT_ANSWER";
export const CHALLENGE_ACTION_TREASURE_CHEST_OPENED = "TREASURE_CHEST_OPENED";
export const CHALLENGE_ACTION_SHOOTING_STAR_COLLECTED = "SHOOTING_STAR_COLLECTED";
export const CHALLENGE_ACTION_NPC_INTERACTED = "NPC_INTERACTED";
export const CHALLENGE_ACTION_DAILY_CHALLENGE_REWARD_CLAIMED = "DAILY_CHALLENGE_REWARD_CLAIMED"; // For weekly challenge tracking
export const CHALLENGE_ACTION_ACHIEVEMENT_UNLOCKED_INGAME = "ACHIEVEMENT_UNLOCKED_INGAME"; // For weekly challenge tracking


// --- Shop & Accessories Types ---
export enum AccessoryType {
  BACKGROUND_EFFECT = "BACKGROUND_EFFECT",
  CURSOR_TRAIL = "CURSOR_TRAIL",
  UI_ACCENT = "UI_ACCENT",
  SOUND_PACK_VARIATION = "SOUND_PACK_VARIATION"
}

// Specific config types for each accessory
export interface BackgroundEffectConfig {
  particleShape: 'star' | 'circle' | 'square' | 'image'; // Shape of particles
  particleImage?: string; // URL if shape is 'image'
  particleColor: string | string[]; // Single color or array for random selection
  count: number; // Number of particles
  speed?: number; // Movement speed factor
  size?: number; // Base size of particles
  sizeVariation?: number; // Random variation for size
  opacity?: number;
  wind?: number; // Horizontal movement influence
  gravity?: number; // Vertical movement influence
}

export interface CursorTrailConfig {
  trailColor: string | string[];
  trailLength: number; // Number of particles in trail
  fadeSpeed: number; // How quickly particles fade
  particleSize: number;
  shape?: 'circle' | 'star';
}

export interface UIAccentConfig {
  cssVariables: Record<string, string>; // e.g., { '--button-border-style': '2px dashed #FF00FF' }
}

export interface SoundPackVariationConfig {
  sounds: Record<string, string>; // Maps original sound URL (from constants) to new sound URL
}

export type ThemeAccessoryConfig =
  | BackgroundEffectConfig
  | CursorTrailConfig
  | UIAccentConfig
  | SoundPackVariationConfig;

export interface ThemeAccessory {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  price: number;
  appliesToTheme: Theme[] | 'all';
  type: AccessoryType;
  config: ThemeAccessoryConfig; // Use the union type
}

export type PlayerOwnedAccessoriesState = Record<string, boolean>;

// Structure: { [themeKey]: { [accessoryType]: accessoryId | null } }
export type PlayerActiveAccessoriesState = Partial<Record<Theme, Partial<Record<AccessoryType, string | null>>>>;

// --- Parent Dashboard Types ---
export interface ActivityLogEntry {
  timestamp: number;
  islandId: string;
  questionTopic: string;
  isCorrect: boolean;
  timeTaken: number; // in milliseconds
  difficulty: IslandDifficulty;
  hintUsed: boolean;
  attempts: number;
}
export type StudentActivityLogState = ActivityLogEntry[];

export enum GoalType {
  COMPLETE_ISLANDS = 'COMPLETE_ISLANDS',
  EARN_STARS = 'EARN_STARS',
}
export interface ParentGoal {
  id: string;
  type: GoalType;
  target: number;
  rewardGems: number;
  createdAt: number;
  isClaimed: boolean;
}
export type ParentGoalsState = ParentGoal[];

// --- Teacher Dashboard Types ---
export interface Assignment {
  id: string;
  islandId: string;
  islandName: string;
  grade: GradeLevel;
  assignedDate: number;
  dueDate: number;
}
export type StudentAssignmentsState = Assignment[];

export interface StudentProfileData {
  id: string;
  name: string;
  avatar: string; // emoji
  totalStars: number;
  islandsCompleted: number;
  skillScores: Record<string, { score: number, count: number }>;
  assignments: Assignment[];
}
