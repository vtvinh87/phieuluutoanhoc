
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
    Question, IslandConfig, IslandStatus, IslandProgressState, GradeLevel, IslandStarRatingsState,
    PreloadedQuestionsCache, Theme, AchievedAchievementsState, AchievedAchievement, ToastMessage, AchievementId,
    AllGradesStarRatingsState, ActiveTreasureChestsState, GameState as AppGameState, ActiveMessageBottlesState,
    ShootingStarData, MessageInBottleContent, StoredActiveNPCInfo, ActiveNPCInfo, FriendlyNPC, NPCInteraction,
    CollectibleItem, ActiveCollectibleState, CollectedItemsState, AchievementContext, IsEndlessUnlockedForGradeState,
    DailyChallenge, ActiveDailyChallengeState, PlayerGemsState, DailyChallengeDefinition, CompletedDailyChallengesLogState, DailyChallengeType,
    WeeklyChallenge, ActiveWeeklyChallengeState, WeeklyChallengeDefinition, CompletedWeeklyChallengesLogState, WeeklyChallengeType,
    CHALLENGE_ACTION_ISLAND_COMPLETED, CHALLENGE_ACTION_STAR_EARNED, CHALLENGE_ACTION_CORRECT_ANSWER,
    CHALLENGE_ACTION_TREASURE_CHEST_OPENED, CHALLENGE_ACTION_SHOOTING_STAR_COLLECTED, CHALLENGE_ACTION_NPC_INTERACTED,
    CHALLENGE_ACTION_DAILY_CHALLENGE_REWARD_CLAIMED, CHALLENGE_ACTION_ACHIEVEMENT_UNLOCKED_INGAME, IslandDifficulty,
    ThemeAccessory, PlayerOwnedAccessoriesState, PlayerActiveAccessoriesState, AccessoryType, SoundPackVariationConfig
} from '../types';
import {
    GAME_TITLE_TEXT, MAX_PLAYER_LIVES, API_KEY_ERROR_MESSAGE, QUESTION_GENERATION_ERROR_MESSAGE,
    HINT_LOADING_MESSAGE, HINT_UNAVAILABLE_MESSAGE, HINT_GENERATION_ERROR_MESSAGE, ISLAND_CONFIGS,
    QUESTIONS_PER_ISLAND, QUESTIONS_PER_FINAL_ISLAND, ISLANDS_PER_GRADE, GRADE_LEVEL_TEXT_MAP, ISLAND_DIFFICULTY_TEXT_MAP, CHOOSE_GRADE_TEXT,
    CHOOSE_ISLAND_TEXT, ISLAND_TEXT, QUESTION_TEXT, SCORE_TEXT, BACK_TO_MAP_TEXT, ISLAND_COMPLETE_TEXT,
    GRADE_COMPLETE_TEXT, LOCKED_ISLAND_TEXT, ISLAND_PREPARING_MESSAGE, STARTING_ISLAND_TEXT, PLAY_AGAIN_TEXT,
    CHOOSE_ANOTHER_GRADE_TEXT, PLAY_THIS_GRADE_AGAIN_TEXT, NO_ISLANDS_FOR_GRADE_TEXT, START_ADVENTURE_TEXT,
    TRAVELLING_TO_ISLAND_TEXT, UPDATING_MAP_TEXT, RETURN_TO_GRADE_SELECTION_TEXT, NEXT_ISLAND_BUTTON_TEXT,
    REWARD_TEXT_EASY_PERFECT, REWARD_TEXT_MEDIUM_PERFECT, REWARD_TEXT_HARD_PERFECT, ISLAND_STAR_RATINGS_KEY_PREFIX,
    LOCAL_STORAGE_PREFIX, LAST_SELECTED_GRADE_KEY, ISLAND_PROGRESS_KEY_PREFIX, OVERALL_SCORE_KEY_PREFIX,
    HOVER_SOUND_URL, GRADE_SELECT_SOUND_URL, ISLAND_SELECT_SOUND_URL, ANSWER_SELECT_SOUND_URL,
    CHECK_ANSWER_SOUND_URL, CORRECT_ANSWER_SOUND_URL, INCORRECT_ANSWER_SOUND_URL, VICTORY_FANFARE_SOUND_URL,
    BUTTON_CLICK_SOUND_URL, SELECTED_THEME_KEY, DEFAULT_THEME, ACHIEVED_ACHIEVEMENTS_KEY,
    ACHIEVEMENT_UNLOCKED_TOAST_TITLE, VIEW_ACHIEVEMENTS_BUTTON_TEXT, ACHIEVEMENT_UNLOCKED_SOUND_URL,
    ALL_GRADES_STAR_RATINGS_KEY, ACTIVE_TREASURE_CHESTS_KEY, TREASURE_CHEST_SPAWN_CHANCE, TREASURE_OPEN_SOUND_URL,
    TREASURE_SPARKLE_SOUND_URL, TREASURE_CHEST_ICON_EMOJI, ACHIEVEMENT_BUTTON_ICON_URL,
    MESSAGE_IN_BOTTLE_SPAWN_CHANCE, MESSAGE_IN_BOTTLE_ICON_EMOJI, MESSAGES_IN_BOTTLE, ACTIVE_MESSAGE_BOTTLE_KEY,
    BOTTLE_SPAWN_SOUND_URL, BOTTLE_OPEN_SOUND_URL, SHOOTING_STAR_SPAWN_INTERVAL_MIN_MS,
    SHOOTING_STAR_SPAWN_INTERVAL_MAX_MS, SHOOTING_STAR_ANIMATION_DURATION_MS, SHOOTING_STAR_REWARD_POINTS_MIN,
    SHOOTING_STAR_REWARD_POINTS_MAX, SHOOTING_STAR_CLICK_SUCCESS_MESSAGE, SHOOTING_STAR_APPEAR_SOUND_URL,
    SHOOTING_STAR_CLICK_SOUND_URL, SHOOTING_STAR_EMOJI, SHOOTING_STAR_BASE_SIZE_PX, SHOOTING_STAR_MAX_ACTIVE_MS,
    FRIENDLY_NPC_SPAWN_CHANCE, FRIENDLY_NPCS, NPC_INTERACTIONS, ACTIVE_FRIENDLY_NPC_KEY, NPC_SPAWN_SOUND_URL,
    NPC_INTERACTION_SOUND_URL, NPC_RIDDLE_SUCCESS_SOUND_URL, NPC_RIDDLE_FAIL_SOUND_URL, COLLECTIBLE_ITEMS,
    COLLECTIBLE_SPAWN_CHANCE, ACTIVE_COLLECTIBLE_KEY, COLLECTED_ITEMS_KEY, COLLECTIBLE_SPAWN_SOUND_URL,
    COLLECTIBLE_COLLECT_SOUND_URL, COLLECTIBLE_COLLECTION_TOAST_MESSAGE, TREASURE_CHEST_POINTS_MESSAGE,
    ENDLESS_MODE_LIVES, ENDLESS_QUESTIONS_BATCH_SIZE, ENDLESS_MODE_DIFFICULTY, ENDLESS_MODE_GRADE_COMPLETE_MESSAGE,
    ENDLESS_MODE_SUMMARY_TITLE, ENDLESS_MODE_SCORE_TEXT, ENDLESS_MODE_QUESTIONS_ANSWERED_TEXT, PLAY_AGAIN_ENDLESS_TEXT,
    ENDLESS_MODE_BUTTON_TEXT, ENDLESS_MODE_UNLOCKED_MESSAGE, START_ENDLESS_MODE_TEXT, FINAL_ISLAND_UNLOCK_MESSAGE,
    FINAL_ISLAND_ACCESS_BUTTON_TEXT, FINAL_ISLAND_GRADE_TITLE, ENDLESS_UNLOCKED_KEY_PREFIX, FINAL_ISLAND_UNLOCKED_KEY,
    ENDLESS_MODE_START_SOUND_URL, FINAL_ISLAND_UNLOCK_SOUND_URL, FINAL_TREASURE_ISLAND_ID,
    FINAL_ISLAND_INTRO_MESSAGE, FINAL_ISLAND_CONGRATS_MESSAGE, FINAL_ISLAND_EPIC_DIFFICULTY_TEXT, FINAL_ISLAND_AMBIENT_SOUND_URL,
    FINAL_ISLAND_INTRO_DURATION_MS, FINAL_ISLAND_PLAYING_STYLE_CLASS, FINAL_ISLAND_LOADING_FIRST_CHALLENGE_TEXT, FINAL_ISLAND_LOADING_NEXT_CHALLENGE_TEXT,
    DAILY_CHALLENGE_DEFINITIONS, ACTIVE_DAILY_CHALLENGE_KEY, PLAYER_GEMS_KEY, DAILY_CHALLENGE_BUTTON_TEXT,
    DAILY_CHALLENGE_NEW_AVAILABLE_TEXT, PLAYER_GEMS_TEXT, DAILY_CHALLENGE_NEW_SOUND_URL,
    DAILY_CHALLENGE_PROGRESS_SOUND_URL, DAILY_CHALLENGE_COMPLETE_SOUND_URL, GEM_COLLECT_SOUND_URL,
    COMPLETED_DAILY_CHALLENGES_LOG_KEY, DAILY_CHALLENGE_SUCCESS_TOAST_TEXT,
    WEEKLY_CHALLENGE_DEFINITIONS, ACTIVE_WEEKLY_CHALLENGE_KEY, COMPLETED_WEEKLY_CHALLENGES_LOG_KEY,
    WEEKLY_CHALLENGE_NEW_AVAILABLE_TEXT, WEEKLY_CHALLENGE_SUCCESS_TOAST_TEXT, WEEKLY_CHALLENGE_NEW_SOUND_URL,
    WEEKLY_CHALLENGE_COMPLETE_SOUND_URL, WEEKLY_CHALLENGE_PROGRESS_SOUND_URL,
    ENDLESS_MODE_LOADING_TEXT, ENDLESS_MODE_ERROR_TEXT, ENDLESS_MODE_TITLE_TEXT,
    SHOP_ACCESSORIES, PLAYER_OWNED_ACCESSORIES_KEY, SHOP_TITLE_TEXT, SHOP_BACK_BUTTON_TEXT, PLAYER_ACTIVE_ACCESSORIES_KEY,
    MANAGE_ACCESSORIES_BUTTON_TEXT
} from '../constants';
import { getMathHint, generateMathQuestionsForIslandSet, generateSingleFinalIslandChallenge, generateEndlessMathQuestions, delay as apiDelay } from '../services/geminiService';
import QuestionDisplay from './QuestionDisplay';
import AnswerOption from './AnswerOption';
import FeedbackIndicator from './FeedbackIndicator';
import HintModal from './HintModal';
import LoadingSpinner from './LoadingSpinner';
import DifficultySelectionModal from './DifficultySelectionModal';
import ThemeSelectionScreen from './ThemeSelectionScreen';
import FireworksCanvas from './FireworksCanvas';
import AchievementsScreen from './AchievementsScreen';
import ToastNotification from './ToastNotification';
import TreasureChestModal from './TreasureChestModal';
import MessageInBottleModal from './MessageInBottleModal';
import ShootingStar from './ShootingStar';
import FriendlyNPCModal from './FriendlyNPCModal';
import DailyChallengeModal from './DailyChallengeModal';
import ShopScreen from './ShopScreen';
import AccessoryCustomizationModal from './AccessoryCustomizationModal';
import ActiveBackgroundEffects from './ActiveBackgroundEffects';
import CursorTrail from './CursorTrail';


import { ALL_ACHIEVEMENTS } from '../achievements';
import {
    LightbulbIcon, SparklesIcon, AlertTriangleIcon, XCircleIcon as LockIcon, StarIconFilled, StarIconOutline,
    SunIcon, MoonIcon, CheckIcon, HeartIconFilled, HeartIconBroken, TrophyIcon,
    GiftIcon, PlayIcon, RefreshIcon, StopIcon, KeyIcon, CalendarCheckIcon, GemIcon, CollectionIcon, MailIcon as MessageIcon,
    ShoppingBagIcon, CogIcon 
} from './icons';
import { useTheme } from '../contexts/ThemeContext';
import { THEME_CONFIGS } from '../themes';
import { v4 as uuidv4 } from 'uuid';


interface TransitionDetails {
  message: string;
  duration?: number;
  onComplete: () => void;
}

const loadItem = <T,>(key: string, defaultValue: T): T => {
  try {
    const savedItem = localStorage.getItem(key);
    return savedItem ? JSON.parse(savedItem) : defaultValue;
  } catch (error) {
    console.warn(`Error parsing item ${key} from localStorage:`, error);
    localStorage.removeItem(key);
    return defaultValue;
  }
};

const saveItem = <T,>(key: string, value: T) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Error saving item ${key} to localStorage:`, error);
  }
};

const dispatchGemsUpdate = (gems: number) => {
  const event = new CustomEvent('gemsUpdated', { detail: { gems } });
  window.dispatchEvent(event);
};


const loadLastSelectedGrade = (): GradeLevel | null => loadItem(LAST_SELECTED_GRADE_KEY, null);
const saveLastSelectedGrade = (grade: GradeLevel | null) => saveItem(LAST_SELECTED_GRADE_KEY, grade);
const loadIslandProgressFromStorage = (grade: GradeLevel): IslandProgressState => loadItem(`${ISLAND_PROGRESS_KEY_PREFIX}${grade}`, {});
const saveIslandProgressToStorage = (grade: GradeLevel, progress: IslandProgressState) => saveItem(`${ISLAND_PROGRESS_KEY_PREFIX}${grade}`, progress);
const loadOverallScoreFromStorage = (grade: GradeLevel): number => loadItem(`${OVERALL_SCORE_KEY_PREFIX}${grade}`, 0);
const saveOverallScoreToStorage = (grade: GradeLevel, score: number) => saveItem(`${OVERALL_SCORE_KEY_PREFIX}${grade}`, score);
const loadIslandStarRatingsFromStorage = (grade: GradeLevel): IslandStarRatingsState => loadItem(`${ISLAND_STAR_RATINGS_KEY_PREFIX}${grade}`, {});
const saveIslandStarRatingsToStorage = (grade: GradeLevel, ratings: IslandStarRatingsState) => saveItem(`${ISLAND_STAR_RATINGS_KEY_PREFIX}${grade}`, ratings);
const loadAllGradesStarRatingsFromStorage = (): AllGradesStarRatingsState => {
  const defaultValue: Partial<AllGradesStarRatingsState> = {};
  (Object.values(GradeLevel).filter(g => typeof g === 'number') as GradeLevel[]).forEach(grade => {
      defaultValue[grade] = {};
  });
  return loadItem(ALL_GRADES_STAR_RATINGS_KEY, defaultValue as AllGradesStarRatingsState);
};
const saveAllGradesStarRatingsToStorage = (ratings: AllGradesStarRatingsState) => saveItem(ALL_GRADES_STAR_RATINGS_KEY, ratings);
const loadAchievedAchievementsFromStorage = (): AchievedAchievementsState => loadItem(ACHIEVED_ACHIEVEMENTS_KEY, {});
const saveAchievedAchievementsToStorage = (achievements: AchievedAchievementsState) => saveItem(ACHIEVED_ACHIEVEMENTS_KEY, achievements);
const loadActiveTreasureChestsFromStorage = (): ActiveTreasureChestsState => loadItem(ACTIVE_TREASURE_CHESTS_KEY, {});
const saveActiveTreasureChestsToStorage = (chests: ActiveTreasureChestsState) => saveItem(ACTIVE_TREASURE_CHESTS_KEY, chests);
const loadActiveMessageBottlesFromStorage = (): ActiveMessageBottlesState => loadItem(ACTIVE_MESSAGE_BOTTLE_KEY, {});
const saveActiveMessageBottlesToStorage = (bottles: ActiveMessageBottlesState) => saveItem(ACTIVE_MESSAGE_BOTTLE_KEY, bottles);
const loadActiveNPCFromStorage = (): StoredActiveNPCInfo | null => loadItem(ACTIVE_FRIENDLY_NPC_KEY, null);
const saveActiveNPCToStorage = (npcInfo: StoredActiveNPCInfo | null) => saveItem(ACTIVE_FRIENDLY_NPC_KEY, npcInfo);
const loadActiveCollectibleFromStorage = (): ActiveCollectibleState => loadItem(ACTIVE_COLLECTIBLE_KEY, {});
const saveActiveCollectibleToStorage = (collectible: ActiveCollectibleState) => saveItem(ACTIVE_COLLECTIBLE_KEY, collectible);
const loadCollectedItemsFromStorage = (): CollectedItemsState => loadItem(COLLECTED_ITEMS_KEY, {});
const saveCollectedItemsToStorage = (items: CollectedItemsState) => saveItem(COLLECTED_ITEMS_KEY, items);

const loadIsEndlessUnlockedForGrade = (): IsEndlessUnlockedForGradeState => {
    const defaultUnlockedState: IsEndlessUnlockedForGradeState = {};
    (Object.values(GradeLevel).filter(g => typeof g === 'number' && g !== GradeLevel.FINAL) as GradeLevel[]).forEach(grade => {
        defaultUnlockedState[grade] = true;
    });
    return loadItem(ENDLESS_UNLOCKED_KEY_PREFIX, defaultUnlockedState);
};
const saveIsEndlessUnlockedForGrade = (state: IsEndlessUnlockedForGradeState) => saveItem(ENDLESS_UNLOCKED_KEY_PREFIX, state);

const loadIsFinalIslandUnlocked = (): boolean => {
    return loadItem(FINAL_ISLAND_UNLOCKED_KEY, true);
};
const saveIsFinalIslandUnlocked = (unlocked: boolean) => saveItem(FINAL_ISLAND_UNLOCKED_KEY, unlocked);

const loadActiveDailyChallenge = (): ActiveDailyChallengeState => loadItem(ACTIVE_DAILY_CHALLENGE_KEY, null);
const saveActiveDailyChallenge = (challenge: ActiveDailyChallengeState) => saveItem(ACTIVE_DAILY_CHALLENGE_KEY, challenge);

const loadPlayerGems = (): PlayerGemsState => loadItem(PLAYER_GEMS_KEY, 10000); 
const savePlayerGems = (gems: PlayerGemsState) => {
  saveItem(PLAYER_GEMS_KEY, gems);
  dispatchGemsUpdate(gems); 
};

const loadCompletedDailyChallengesLog = (): CompletedDailyChallengesLogState => loadItem(COMPLETED_DAILY_CHALLENGES_LOG_KEY, {});
const saveCompletedDailyChallengesLog = (log: CompletedDailyChallengesLogState) => saveItem(COMPLETED_DAILY_CHALLENGES_LOG_KEY, log);

const loadActiveWeeklyChallenge = (): ActiveWeeklyChallengeState => loadItem(ACTIVE_WEEKLY_CHALLENGE_KEY, null);
const saveActiveWeeklyChallenge = (challenge: ActiveWeeklyChallengeState) => saveItem(ACTIVE_WEEKLY_CHALLENGE_KEY, challenge);
const loadCompletedWeeklyChallengesLog = (): CompletedWeeklyChallengesLogState => loadItem(COMPLETED_WEEKLY_CHALLENGES_LOG_KEY, {});
const saveCompletedWeeklyChallengesLog = (log: CompletedWeeklyChallengesLogState) => saveItem(COMPLETED_WEEKLY_CHALLENGES_LOG_KEY, log);

const loadPlayerOwnedAccessoriesFromStorage = (): PlayerOwnedAccessoriesState => loadItem(PLAYER_OWNED_ACCESSORIES_KEY, {});
const savePlayerOwnedAccessoriesToStorage = (accessories: PlayerOwnedAccessoriesState) => saveItem(PLAYER_OWNED_ACCESSORIES_KEY, accessories);

const loadPlayerActiveAccessoriesFromStorage = (): PlayerActiveAccessoriesState => loadItem(PLAYER_ACTIVE_ACCESSORIES_KEY, {});
const savePlayerActiveAccessoriesToStorage = (activeAccessories: PlayerActiveAccessoriesState) => saveItem(PLAYER_ACTIVE_ACCESSORIES_KEY, activeAccessories);


const GameScreen: React.FC = () => {
  const { theme, setTheme: applyNewTheme, themeConfig, playerActiveAccessories: activeAccessoriesFromTheme } = useTheme();

  const [gameState, setGameState] = useState<AppGameState>('StartScreen');
  const [transitionDetails, setTransitionDetails] = useState<TransitionDetails | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel | null>(null);
  const [islandProgress, setIslandProgress] = useState<IslandProgressState>({});
  const [islandStarRatings, setIslandStarRatings] = useState<IslandStarRatingsState>({});
  const [currentIslandId, setCurrentIslandId] = useState<string | null>(null);
  const [selectedIslandDifficulty, setSelectedIslandDifficulty] = useState<IslandDifficulty | null>(null);
  const [showDifficultySelectionModalForIslandId, setShowDifficultySelectionModalForIslandId] = useState<string | null>(null);
  const [questionsForCurrentIsland, setQuestionsForCurrentIsland] = useState<Question[]>([]);
  const [currentQuestionIndexInIsland, setCurrentQuestionIndexInIsland] = useState(0);
  const [isIslandLoading, setIsIslandLoading] = useState(false);
  const [islandLoadingProgressMessage, setIslandLoadingProgressMessage] = useState<string | null>(null);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean | null; message?: string }>({ isCorrect: null });
  const [playerLives, setPlayerLives] = useState(MAX_PLAYER_LIVES);
  const [overallScore, setOverallScore] = useState(0);
  const [islandScore, setIslandScore] = useState(0);
  const [isHintModalOpen, setIsHintModalOpen] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const [isHintLoading, setIsHintLoading] = useState(false);
  const [hintButtonUsed, setHintButtonUsed]  = useState(false);
  const [hintUsedThisIslandRun, setHintUsedThisIslandRun] = useState(false);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const [userAttemptShown, setUserAttemptShown] = useState(false);
  const [revealSolution, setRevealSolution] = useState(false);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const audioCache = useRef<Record<string, HTMLAudioElement>>({});
  const [preloadedQuestionsCache, setPreloadedQuestionsCache] = useState<PreloadedQuestionsCache>({});
  const [showCustomFireworks, setShowCustomFireworks] = useState(false);
  const [achievedAchievements, setAchievedAchievements] = useState<AchievedAchievementsState>(() => loadAchievedAchievementsFromStorage());
  const [showAchievementsScreen, setShowAchievementsScreen] = useState(false);
  const [currentToast, setCurrentToast] = useState<ToastMessage | null>(null);
  const [allGradesProgress, setAllGradesProgress] = useState<Record<GradeLevel, IslandProgressState>>(() => {
    const initialProgress: Partial<Record<GradeLevel, IslandProgressState>> = {};
    (Object.values(GradeLevel).filter(g => typeof g === 'number') as GradeLevel[]).forEach(grade => {
        initialProgress[grade] = loadIslandProgressFromStorage(grade);
    });
    return initialProgress as Record<GradeLevel, IslandProgressState>;
  });
  const [allGradesStarRatings, setAllGradesStarRatings] = useState<AllGradesStarRatingsState>(() => loadAllGradesStarRatingsFromStorage());
  const [themeChangedForAchievement, setThemeChangedForAchievement] = useState(false);
  const [activeTreasureChests, setActiveTreasureChests] = useState<ActiveTreasureChestsState>(() => loadActiveTreasureChestsFromStorage());
  const [showTreasureModalForIslandId, setShowTreasureModalForIslandId] = useState<string | null>(null);
  const [activeMessageBottle, setActiveMessageBottle] = useState<ActiveMessageBottlesState>(() => loadActiveMessageBottlesFromStorage());
  const [showBottleModalForIslandId, setShowBottleModalForIslandId] = useState<string | null>(null);
  const [currentBottleMessageContent, setCurrentBottleMessageContent] = useState<MessageInBottleContent | null>(null);
  const [shootingStar, setShootingStar] = useState<ShootingStarData | null>(null);
  const shootingStarTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [activeNPCData, setActiveNPCData] = useState<ActiveNPCInfo | null>(null);
  const [showNPCModal, setShowNPCModal] = useState(false);
  const [npcRiddleAnswer, setNpcRiddleAnswer] = useState('');
  const [npcRiddlePhase, setNpcRiddlePhase] = useState<'question' | 'feedback'>('question');
  const [isNpcRiddleCorrect, setIsNpcRiddleCorrect] = useState<boolean | null>(null);
  const [activeCollectible, setActiveCollectible] = useState<ActiveCollectibleState>(() => loadActiveCollectibleFromStorage());
  const [collectedItems, setCollectedItems] = useState<CollectedItemsState>(() => loadCollectedItemsFromStorage());

  const [isEndlessUnlockedForGrade, setIsEndlessUnlockedForGrade] = useState<IsEndlessUnlockedForGradeState>(() => loadIsEndlessUnlockedForGrade());
  const [isFinalIslandUnlocked, setIsFinalIslandUnlocked] = useState<boolean>(() => loadIsFinalIslandUnlocked());

  const [currentEndlessGrade, setCurrentEndlessGrade] = useState<GradeLevel | null>(null);
  const [endlessModeLives, setEndlessModeLives] = useState(ENDLESS_MODE_LIVES);
  const [endlessModeScore, setEndlessModeScore] = useState(0);
  const [endlessQuestionsAnswered, setEndlessQuestionsAnswered] = useState(0);
  const [endlessQuestionBatch, setEndlessQuestionBatch] = useState<Question[]>([]);
  const [currentEndlessQuestionIndex, setCurrentEndlessQuestionIndex] = useState(0);

  const [activeDailyChallenge, setActiveDailyChallenge] = useState<ActiveDailyChallengeState>(null);
  const [playerGems, setPlayerGems] = useState<PlayerGemsState>(() => loadPlayerGems());
  const [showDailyChallengeModal, setShowDailyChallengeModal] = useState(false);
  const [completedDailyChallengesLog, setCompletedDailyChallengesLog] = useState<CompletedDailyChallengesLogState>(() => loadCompletedDailyChallengesLog());
  const [timeUntilNextDailyChallengeRefresh, setTimeUntilNextDailyChallengeRefresh] = useState('');

  const [activeWeeklyChallenge, setActiveWeeklyChallenge] = useState<ActiveWeeklyChallengeState>(null);
  const [completedWeeklyChallengesLog, setCompletedWeeklyChallengesLog] = useState<CompletedWeeklyChallengesLogState>(() => loadCompletedWeeklyChallengesLog());
  const [timeUntilNextWeeklyChallengeRefresh, setTimeUntilNextWeeklyChallengeRefresh] = useState('');
  
  const [playerOwnedAccessories, setPlayerOwnedAccessories] = useState<PlayerOwnedAccessoriesState>(() => loadPlayerOwnedAccessoriesFromStorage());
  const [playerActiveAccessories, setPlayerActiveAccessories] = useState<PlayerActiveAccessoriesState>(() => loadPlayerActiveAccessoriesFromStorage());


  const [isLoadingNextFinalIslandQuestion, setIsLoadingNextFinalIslandQuestion] = useState(false);
  const [triggerConfettiEffect, setTriggerConfettiEffect] = useState(false);


  const islandsForCurrentGrade = useMemo(() => {
    if (!selectedGrade) return [];
    const configs = ISLAND_CONFIGS.filter(island => island.targetGradeLevel === selectedGrade);
    if (selectedGrade === GradeLevel.FINAL) return configs.filter(island => island.islandId === FINAL_TREASURE_ISLAND_ID);
    return configs.filter(island => island.islandId !== FINAL_TREASURE_ISLAND_ID).sort((a, b) => a.islandNumber - b.islandNumber);
  }, [selectedGrade]);

  const currentIslandConfig = useMemo(() => {
    if (!currentIslandId || !islandsForCurrentGrade) return null;
    return islandsForCurrentGrade.find(i => i.islandId === currentIslandId) || null;
  }, [currentIslandId, islandsForCurrentGrade]);

  const unlockAudioContext = useCallback(() => {
    if (!audioUnlocked) {
      setAudioUnlocked(true);
      const silentAudio = new Audio("data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA");
      silentAudio.volume = 0;
      silentAudio.play().catch(() => {});
    }
  }, [audioUnlocked]);

  const playSound = useCallback((soundUrl: string, volume: number = 0.5) => {
    if (!audioUnlocked) return;
    if (!soundUrl || soundUrl.startsWith("YOUR_") || soundUrl.endsWith("_HERE")) return;

    let finalSoundUrl = soundUrl;
    const currentThemeKey = theme; 
    const accessoriesForThisTheme = playerActiveAccessories[currentThemeKey];
    const soundPackAccessoryId = accessoriesForThisTheme?.[AccessoryType.SOUND_PACK_VARIATION];

    if (soundPackAccessoryId) {
      const soundPackAccessoryDetails = SHOP_ACCESSORIES.find(
        acc => acc.id === soundPackAccessoryId && acc.type === AccessoryType.SOUND_PACK_VARIATION
      );
      if (soundPackAccessoryDetails) {
        const soundConfig = soundPackAccessoryDetails.config as SoundPackVariationConfig;
        if (soundConfig.sounds && soundConfig.sounds[soundUrl]) {
          finalSoundUrl = soundConfig.sounds[soundUrl];
        }
      }
    }

    try {
      let audio = audioCache.current[finalSoundUrl];
      if (!audio) {
        audio = new Audio(finalSoundUrl);
        audio.volume = volume;
        audio.onerror = () => { delete audioCache.current[finalSoundUrl]; };
        audioCache.current[finalSoundUrl] = audio;
      }
      if (audio.readyState >= 2) {
        audio.currentTime = 0;
        audio.play().catch(_e => {});
      } else {
        const playWhenReady = () => {
            audio.currentTime = 0;
            audio.play().catch(_e => {});
            audio.removeEventListener('canplaythrough', playWhenReady);
        };
        audio.addEventListener('canplaythrough', playWhenReady);
        audio.load(); 
      }
    } catch (error) {
    }
  }, [audioUnlocked, audioCache, theme, playerActiveAccessories]);


  const showToast = useCallback((message: string, type: ToastMessage['type'] = 'success', icon?: React.ReactNode) => {
    setCurrentToast({ id: uuidv4(), message, type, icon });
  }, []);

  const isNewDay = (dateString: string): boolean => {
    if (!dateString) return true;
    const today = new Date().toDateString();
    const challengeDate = new Date(dateString).toDateString();
    return today !== challengeDate;
  };

  const generateNewDailyChallenge = useCallback((): DailyChallenge => {
    const availableDefinitions = DAILY_CHALLENGE_DEFINITIONS;
    const randomDefinition = availableDefinitions[Math.floor(Math.random() * availableDefinitions.length)];
    const targetValue = randomDefinition.generateTargetValue();
    return {
      id: uuidv4(),
      definitionId: randomDefinition.id,
      type: randomDefinition.type,
      description: randomDefinition.descriptionTemplate(targetValue),
      targetValue: targetValue,
      currentValue: 0,
      rewardGems: randomDefinition.rewardGems,
      generatedDate: new Date().toISOString().split('T')[0],
      isCompleted: false,
      rewardClaimed: false,
      currentStreak: randomDefinition.streakChallenge ? 0 : undefined,
    };
  }, []);

  const updateDailyChallengeProgress = useCallback((actionType: string, value: number = 1) => {
    setActiveDailyChallenge(prevChallenge => {
      if (!prevChallenge || prevChallenge.isCompleted) return prevChallenge;
      const definition = DAILY_CHALLENGE_DEFINITIONS.find(def => def.id === prevChallenge.definitionId);
      if (!definition || definition.actionTypeToTrack !== actionType) return prevChallenge;

      let newCurrentValue = prevChallenge.currentValue;
      let newStreak = prevChallenge.currentStreak;

      if (definition.streakChallenge) {
          if (actionType === CHALLENGE_ACTION_CORRECT_ANSWER) {
              if (value === 1) newStreak = (newStreak || 0) + 1;
              else newStreak = 0;
              newCurrentValue = Math.max(newCurrentValue, newStreak || 0);
          }
      } else { newCurrentValue += value; }

      newCurrentValue = Math.min(newCurrentValue, prevChallenge.targetValue);
      const isNowCompleted = newCurrentValue >= prevChallenge.targetValue;

      const updatedChallenge: DailyChallenge = { ...prevChallenge, currentValue: newCurrentValue, currentStreak: newStreak, isCompleted: isNowCompleted };

      if (isNowCompleted && !prevChallenge.isCompleted) { playSound(DAILY_CHALLENGE_COMPLETE_SOUND_URL, 0.6); showToast(DAILY_CHALLENGE_NEW_AVAILABLE_TEXT, 'info', <CalendarCheckIcon className="w-6 h-6"/>); }
      else if (newCurrentValue > prevChallenge.currentValue && !isNowCompleted) { playSound(DAILY_CHALLENGE_PROGRESS_SOUND_URL, 0.3); }

      saveActiveDailyChallenge(updatedChallenge); return updatedChallenge;
    });
  }, [playSound, showToast]);

  const resetStreakChallengesIfNeeded = useCallback((navigatingAwayFromIsland: boolean = false) => {
    setActiveDailyChallenge(prev => {
      if (prev && !prev.isCompleted) {
        const definition = DAILY_CHALLENGE_DEFINITIONS.find(def => def.id === prev.definitionId);
        if (definition?.streakChallenge && navigatingAwayFromIsland) {
          if (prev.currentStreak !== undefined && prev.currentStreak > 0) {
            const updated = { ...prev, currentStreak: 0 };
            saveActiveDailyChallenge(updated); return updated;
          }
        }
      }
      return prev;
    });
  }, []);

  useEffect(() => {
    const challenge = loadActiveDailyChallenge();
    if (!challenge || isNewDay(challenge.generatedDate)) {
      const newChallenge = generateNewDailyChallenge();
      setActiveDailyChallenge(newChallenge); saveActiveDailyChallenge(newChallenge);
      playSound(DAILY_CHALLENGE_NEW_SOUND_URL, 0.5); showToast(DAILY_CHALLENGE_NEW_AVAILABLE_TEXT, 'info', <CalendarCheckIcon className="w-6 h-6"/>);
    } else { setActiveDailyChallenge(challenge); }

    const calculateTimeUntilNextRefresh = () => {
        const now = new Date(); const tomorrow = new Date(now); tomorrow.setDate(now.getDate() + 1); tomorrow.setHours(0, 0, 0, 0);
        const diffMs = tomorrow.getTime() - now.getTime(); const diffHrs = Math.floor(diffMs / 3600000); const diffMins = Math.floor((diffMs % 3600000) / 60000);
        setTimeUntilNextDailyChallengeRefresh(`${diffHrs}h ${diffMins}m`);
    };
    calculateTimeUntilNextRefresh(); const timerId = setInterval(calculateTimeUntilNextRefresh, 60000);
    return () => clearInterval(timerId);
  }, [generateNewDailyChallenge, playSound, showToast]);

  const handleClaimDailyChallengeReward = () => {
    if (activeDailyChallenge && activeDailyChallenge.isCompleted && !activeDailyChallenge.rewardClaimed) {
      setPlayerGems(prevGems => { const newGems = prevGems + activeDailyChallenge.rewardGems; savePlayerGems(newGems); return newGems; });
      const claimedChallengeId = activeDailyChallenge.id;
      const claimedChallengeDate = activeDailyChallenge.generatedDate;

      setActiveDailyChallenge(prev => { if (!prev) return null; const updated = { ...prev, rewardClaimed: true }; saveActiveDailyChallenge(updated); return updated; });

      setCompletedDailyChallengesLog(prev => { const newLog = {...prev, [claimedChallengeId]: { date: claimedChallengeDate, challengeId: claimedChallengeId}}; saveCompletedDailyChallengesLog(newLog); return newLog; });

      playSound(GEM_COLLECT_SOUND_URL, 0.7); showToast(DAILY_CHALLENGE_SUCCESS_TOAST_TEXT(activeDailyChallenge.rewardGems), 'success', <GemIcon className="w-6 h-6"/>);

      updateWeeklyChallengeProgress(CHALLENGE_ACTION_DAILY_CHALLENGE_REWARD_CLAIMED);
    }
  };

  const getStartOfWeekDayString = (date: Date): string => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));
    return monday.toISOString().split('T')[0];
  };

  const isNewWeek = (challengeGeneratedDate: string): boolean => {
    if (!challengeGeneratedDate) return true;
    const currentWeekMonday = getStartOfWeekDayString(new Date());
    return challengeGeneratedDate < currentWeekMonday;
  };

  const generateNewWeeklyChallenge = useCallback((): WeeklyChallenge => {
    const availableDefinitions = WEEKLY_CHALLENGE_DEFINITIONS;
    const randomDefinition = availableDefinitions[Math.floor(Math.random() * availableDefinitions.length)];
    const targetValue = randomDefinition.generateTargetValue();
    return {
      id: uuidv4(),
      definitionId: randomDefinition.id,
      type: randomDefinition.type,
      description: randomDefinition.descriptionTemplate(targetValue),
      targetValue: targetValue,
      currentValue: 0,
      rewardGems: randomDefinition.rewardGems,
      generatedDate: getStartOfWeekDayString(new Date()),
      isCompleted: false,
      rewardClaimed: false,
    };
  }, []);

  const updateWeeklyChallengeProgress = useCallback((actionType: string, value: number = 1) => {
    setActiveWeeklyChallenge(prevChallenge => {
      if (!prevChallenge || prevChallenge.isCompleted) return prevChallenge;
      const definition = WEEKLY_CHALLENGE_DEFINITIONS.find(def => def.id === prevChallenge.definitionId);
      if (!definition || definition.actionTypeToTrack !== actionType) return prevChallenge;

      let newCurrentValue = prevChallenge.currentValue + value;
      newCurrentValue = Math.min(newCurrentValue, prevChallenge.targetValue);
      const isNowCompleted = newCurrentValue >= prevChallenge.targetValue;

      const updatedChallenge: WeeklyChallenge = { ...prevChallenge, currentValue: newCurrentValue, isCompleted: isNowCompleted };

      if (isNowCompleted && !prevChallenge.isCompleted) { playSound(WEEKLY_CHALLENGE_COMPLETE_SOUND_URL, 0.7); showToast(WEEKLY_CHALLENGE_NEW_AVAILABLE_TEXT, 'info', <TrophyIcon className="w-6 h-6"/>); }
      else if (newCurrentValue > prevChallenge.currentValue && !isNowCompleted) { playSound(WEEKLY_CHALLENGE_PROGRESS_SOUND_URL, 0.3); }

      saveActiveWeeklyChallenge(updatedChallenge); return updatedChallenge;
    });
  }, [playSound, showToast]);

  useEffect(() => {
    const challenge = loadActiveWeeklyChallenge();
    if (!challenge || isNewWeek(challenge.generatedDate)) {
      const newChallenge = generateNewWeeklyChallenge();
      setActiveWeeklyChallenge(newChallenge); saveActiveWeeklyChallenge(newChallenge);
      playSound(WEEKLY_CHALLENGE_NEW_SOUND_URL, 0.5); showToast(WEEKLY_CHALLENGE_NEW_AVAILABLE_TEXT, 'info', <TrophyIcon className="w-6 h-6"/>);
    } else { setActiveWeeklyChallenge(challenge); }

    const calculateTimeUntilNextWeeklyRefresh = () => {
        const now = new Date();
        const currentDay = now.getDay();
        const daysUntilMonday = (currentDay === 0) ? 1 : (8 - currentDay);
        const nextMonday = new Date(now);
        nextMonday.setDate(now.getDate() + daysUntilMonday);
        nextMonday.setHours(0, 0, 0, 0);

        const diffMs = nextMonday.getTime() - now.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHrs = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        setTimeUntilNextWeeklyChallengeRefresh(`${diffDays}d ${diffHrs}h ${diffMins}m`);
    };
    calculateTimeUntilNextWeeklyRefresh(); const timerId = setInterval(calculateTimeUntilNextWeeklyRefresh, 60000);
    return () => clearInterval(timerId);
  }, [generateNewWeeklyChallenge, playSound, showToast]);

  const handleClaimWeeklyChallengeReward = () => {
    if (activeWeeklyChallenge && activeWeeklyChallenge.isCompleted && !activeWeeklyChallenge.rewardClaimed) {
      setPlayerGems(prevGems => { const newGems = prevGems + activeWeeklyChallenge.rewardGems; savePlayerGems(newGems); return newGems; });
      const claimedChallengeId = activeWeeklyChallenge.id;
      const claimedChallengeDate = activeWeeklyChallenge.generatedDate;

      setActiveWeeklyChallenge(prev => { if (!prev) return null; const updated = { ...prev, rewardClaimed: true }; saveActiveWeeklyChallenge(updated); return updated; });

      setCompletedWeeklyChallengesLog(prev => { const newLog = {...prev, [claimedChallengeId]: { date: claimedChallengeDate, challengeId: claimedChallengeId}}; saveCompletedWeeklyChallengesLog(newLog); return newLog; });

      playSound(GEM_COLLECT_SOUND_URL, 0.8);
      showToast(WEEKLY_CHALLENGE_SUCCESS_TOAST_TEXT(activeWeeklyChallenge.rewardGems), 'success', <GemIcon className="w-7 h-7"/>);
    }
  };


 useEffect(() => {
    const savedTheme = loadItem(SELECTED_THEME_KEY, DEFAULT_THEME) as Theme;
    if (THEME_CONFIGS[savedTheme]) applyNewTheme(savedTheme); else applyNewTheme(DEFAULT_THEME);
    document.addEventListener('click', unlockAudioContext, { once: true });

    const storedNPC = loadActiveNPCFromStorage();
    if (storedNPC) {
        const npc = FRIENDLY_NPCS.find(n => n.id === storedNPC.npcId);
        const interaction = NPC_INTERACTIONS.find(i => i.id === storedNPC.interactionId);
        if (npc && interaction) setActiveNPCData({ npc, interaction, islandId: storedNPC.islandId, grade: storedNPC.grade });
        else saveActiveNPCToStorage(null);
    }

    setPlayerOwnedAccessories(loadPlayerOwnedAccessoriesFromStorage());
    setPlayerActiveAccessories(loadPlayerActiveAccessoriesFromStorage());


    return () => document.removeEventListener('click', unlockAudioContext);
  }, [unlockAudioContext, applyNewTheme]);


  useEffect(() => {
    if (gameState === 'Transitioning' && transitionDetails) {
      const timer = setTimeout(() => { const callback = transitionDetails.onComplete; setTransitionDetails(null); callback(); }, transitionDetails.duration || 1500);
      return () => clearTimeout(timer);
    }
  }, [gameState, transitionDetails]);

  useEffect(() => {
    if (gameState === 'IslandComplete' || gameState === 'GradeComplete' || gameState === 'EndlessSummary' || feedback.isCorrect === true) {
        setShowCustomFireworks(true);
    } else if (showCustomFireworks && !(feedback.isCorrect === true)) { // Only turn off if not for a correct answer
        setShowCustomFireworks(false);
    }
  }, [gameState, showCustomFireworks, feedback.isCorrect]);


  const currentQuestion = gameState === 'EndlessPlaying' && currentEndlessGrade && endlessQuestionBatch.length > 0
    ? endlessQuestionBatch[currentEndlessQuestionIndex]
    : questionsForCurrentIsland[currentQuestionIndexInIsland];


  const resetForNewQuestion = useCallback(() => { setSelectedAnswer(null); setFeedback({ isCorrect: null }); setHint(null); setHintButtonUsed(false); setUserAttemptShown(false); setRevealSolution(false); }, []);

  const resetForNewIslandPlay = useCallback(() => {
    resetForNewQuestion(); setCurrentQuestionIndexInIsland(0); setPlayerLives(MAX_PLAYER_LIVES); setIslandScore(0); setHintUsedThisIslandRun(false);
    setActiveDailyChallenge(prev => { if (prev && prev.type === DailyChallengeType.CORRECT_ANSWERS_IN_A_ROW && !prev.isCompleted) { const updated = {...prev, currentStreak: 0}; saveActiveDailyChallenge(updated); return updated; } return prev; });
  }, [resetForNewQuestion]);

  const resetForNewGradeJourney = useCallback((grade: GradeLevel | null) => {
    resetForNewIslandPlay(); setQuestionsForCurrentIsland([]); setCurrentIslandId(null); setSelectedIslandDifficulty(null); setShowDifficultySelectionModalForIslandId(null); setLoadingError(null);
    if (grade !== null) { setOverallScore(loadOverallScoreFromStorage(grade)); setIslandProgress(loadIslandProgressFromStorage(grade)); setIslandStarRatings(loadIslandStarRatingsFromStorage(grade)); }
    else { setOverallScore(0); setIslandProgress({}); setIslandStarRatings({}); }
    setPreloadedQuestionsCache({}); setTransitionDetails(null); setThemeChangedForAchievement(false); setShowTreasureModalForIslandId(null); setShowBottleModalForIslandId(null); setActiveNPCData(null); saveActiveNPCToStorage(null); setActiveCollectible({}); saveActiveCollectibleToStorage({}); setCurrentEndlessGrade(null); setEndlessModeLives(ENDLESS_MODE_LIVES); setEndlessModeScore(0); setEndlessQuestionsAnswered(0); setEndlessQuestionBatch([]); setCurrentEndlessQuestionIndex(0);
    resetStreakChallengesIfNeeded(true);
    setIsLoadingNextFinalIslandQuestion(false); 
  }, [resetForNewIslandPlay, resetStreakChallengesIfNeeded]);


  const awardAchievement = useCallback((achievementId: AchievementId) => {
    if (achievedAchievements[achievementId]) return;
    const newAchievementEntry: AchievedAchievement = { id: achievementId, achievedAt: Date.now(), gradeContext: selectedGrade || undefined };
    const achievementDef = ALL_ACHIEVEMENTS.find(a => a.id === achievementId);
    if (achievementDef) { playSound(ACHIEVEMENT_UNLOCKED_SOUND_URL, 0.6); showToast(`${ACHIEVEMENT_UNLOCKED_TOAST_TITLE} ${achievementDef.name}`, 'success', <TrophyIcon className="w-7 h-7" />); }
    setAchievedAchievements(prev => { const updated = { ...prev, [achievementId]: newAchievementEntry }; saveAchievedAchievementsToStorage(updated); return updated; });
    updateWeeklyChallengeProgress(CHALLENGE_ACTION_ACHIEVEMENT_UNLOCKED_INGAME);
  }, [achievedAchievements, selectedGrade, playSound, showToast, updateWeeklyChallengeProgress]);

 const checkAndAwardAchievements = useCallback((completionContext?: { difficulty: IslandDifficulty | null; hintUsed: boolean }) => {
    const progressForCurrentGrade = selectedGrade ? islandProgress : {};
    const starsForCurrentGrade = selectedGrade ? islandStarRatings : {};
    const currentAllGradesProg = {...allGradesProgress}; if(selectedGrade && islandProgress && Object.keys(islandProgress).length > 0) currentAllGradesProg[selectedGrade] = islandProgress;
    const currentAllGradesStars = {...allGradesStarRatings}; if(selectedGrade && islandStarRatings && Object.keys(islandStarRatings).length > 0) currentAllGradesStars[selectedGrade] = islandStarRatings;

    const achievementContext: AchievementContext = {
      selectedGrade, islandProgress: progressForCurrentGrade, islandStarRatings: starsForCurrentGrade, islandsForGrade: islandsForCurrentGrade, currentOverallScore: overallScore, allGradeIslandConfigs: ISLAND_CONFIGS, allGradesProgress: currentAllGradesProg, themeSwapped: themeChangedForAchievement, currentIslandDifficulty: completionContext?.difficulty, hintUsedInLastIslandCompletion: completionContext?.hintUsed, allGradesStarRatings: currentAllGradesStars, collectedItems, isEndlessUnlockedForGrade, isFinalIslandUnlocked, playerGems: playerGems, completedDailyChallengesCount: Object.keys(completedDailyChallengesLog).length, completedWeeklyChallengesCount: Object.keys(completedWeeklyChallengesLog).length,
    };
    ALL_ACHIEVEMENTS.forEach(achievement => { if (achievedAchievements[achievement.id]) return; if (achievement.condition && achievement.condition(achievementContext)) awardAchievement(achievement.id); });
  }, [achievedAchievements, selectedGrade, islandProgress, islandStarRatings, islandsForCurrentGrade, overallScore, awardAchievement, allGradesProgress, allGradesStarRatings, themeChangedForAchievement, collectedItems, isEndlessUnlockedForGrade, isFinalIslandUnlocked, playerGems, completedDailyChallengesLog, completedWeeklyChallengesLog]);


  useEffect(() => {
    const timeoutId = setTimeout(() => checkAndAwardAchievements(), 300);
    return () => clearTimeout(timeoutId);
  }, [islandProgress, islandStarRatings, overallScore, selectedGrade, themeChangedForAchievement, allGradesProgress, allGradesStarRatings, collectedItems, isEndlessUnlockedForGrade, isFinalIslandUnlocked, playerGems, completedDailyChallengesLog, completedWeeklyChallengesLog, checkAndAwardAchievements]);


  const _fetchAndProcessQuestionSet = useCallback(async (islandConfig: IslandConfig, difficulty: IslandDifficulty): Promise<Question[]> => {
    const questionsToFetch = islandConfig.targetGradeLevel === GradeLevel.FINAL ? QUESTIONS_PER_FINAL_ISLAND : QUESTIONS_PER_ISLAND;
    if (isIslandLoading && gameState !== 'IslandMap' && gameState !== 'IslandPlaying' && gameState !== 'EndlessPlaying') setIslandLoadingProgressMessage(ISLAND_PREPARING_MESSAGE(islandConfig.name));
    const fetchedQuestionSet = await generateMathQuestionsForIslandSet(islandConfig.targetGradeLevel, islandConfig.topics, islandConfig.name, islandConfig.islandId, difficulty);
    if (fetchedQuestionSet && fetchedQuestionSet.length === questionsToFetch) return fetchedQuestionSet;
    else { console.error(`_fetchAndProcessQuestionSet for ${islandConfig.name} (${difficulty}) resulted in an incomplete or null set from the service.`); throw new Error(QUESTION_GENERATION_ERROR_MESSAGE); }
  }, [isIslandLoading, gameState]);


  const fetchAndSetQuestionsForIsland = useCallback(async (islandIdToLoad: string, difficulty: IslandDifficulty) => {
    if (apiKeyMissing || !selectedGrade) { setGameState('Error'); setLoadingError(apiKeyMissing ? API_KEY_ERROR_MESSAGE : "Vui lòng chọn lớp trước."); setTransitionDetails(null); return; }
    const islandConfig = islandsForCurrentGrade.find(i => i.islandId === islandIdToLoad);
    if (!islandConfig) { setGameState('Error'); setLoadingError("Không tìm thấy cấu hình cho hòn đảo này."); setTransitionDetails(null); return; }

    if (islandConfig.targetGradeLevel === GradeLevel.FINAL) {
        console.error("fetchAndSetQuestionsForIsland called for Final Island. This should be handled by loadFinalIslandSequentially.");
        loadFinalIslandSequentially(islandConfig, IslandDifficulty.HARD); 
        return;
    }

    const questionsPerThisIsland = QUESTIONS_PER_ISLAND;
    const cachedData = preloadedQuestionsCache[islandIdToLoad]?.[difficulty];

    if (Array.isArray(cachedData)) {
        setQuestionsForCurrentIsland(cachedData); setCurrentIslandId(islandIdToLoad); setSelectedIslandDifficulty(difficulty); resetForNewIslandPlay();
        const startMsg = STARTING_ISLAND_TEXT(islandConfig.name, ISLAND_DIFFICULTY_TEXT_MAP[difficulty]);
        setTransitionDetails({ message: startMsg, duration: 700, onComplete: () => setGameState('IslandPlaying') });
        setGameState('Transitioning'); return;
    }
    setIsIslandLoading(true); setLoadingError(null); setIslandLoadingProgressMessage(ISLAND_PREPARING_MESSAGE(islandConfig.name)); setTransitionDetails(null);
    try {
        const fetchedQuestions = await _fetchAndProcessQuestionSet(islandConfig, difficulty);
        setPreloadedQuestionsCache(prev => ({ ...prev, [islandIdToLoad]: { ...(prev[islandIdToLoad] || {}), [difficulty]: fetchedQuestions } }));
        setQuestionsForCurrentIsland(fetchedQuestions); setCurrentIslandId(islandIdToLoad); setSelectedIslandDifficulty(difficulty); resetForNewIslandPlay(); setGameState('IslandPlaying');
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : QUESTION_GENERATION_ERROR_MESSAGE;
        console.error(`Error in fetchAndSetQuestionsForIsland for ${islandConfig.name} (${difficulty}):`, errorMessage);
        setLoadingError(errorMessage); setGameState('Error');
        setPreloadedQuestionsCache(prev => ({ ...prev, [islandIdToLoad]: { ...(prev[islandIdToLoad] || {}), [difficulty]: 'error' } }));
    } finally { setIsIslandLoading(false); }
  }, [apiKeyMissing, selectedGrade, islandsForCurrentGrade, resetForNewIslandPlay, preloadedQuestionsCache, _fetchAndProcessQuestionSet]);


  const backgroundPreloadIslandDifficulty = useCallback(async (islandConfig: IslandConfig, difficulty: IslandDifficulty, isNPlusOnePreloadContext: boolean = false) => {
    if (apiKeyMissing || !selectedGrade) return;
    const cacheKey = islandConfig.islandId; const currentCacheEntry = preloadedQuestionsCache[cacheKey]?.[difficulty];
    if (Array.isArray(currentCacheEntry) || currentCacheEntry === 'loading' || currentCacheEntry === 'error') return;
    setPreloadedQuestionsCache(prev => ({ ...prev, [cacheKey]: { ...(prev[cacheKey] || {}), [difficulty]: 'loading' } }));
    let attempts = 0; const maxAttempts = isNPlusOnePreloadContext ? 2 : 1;
    while (attempts < maxAttempts) {
        try {
            if (attempts > 0 && isNPlusOnePreloadContext) await apiDelay(5000); 
            else if (attempts === 0 && !isNPlusOnePreloadContext) await apiDelay(1000); 
            const fetchedQuestions = await _fetchAndProcessQuestionSet(islandConfig, difficulty);
            setPreloadedQuestionsCache(prev => ({ ...prev, [cacheKey]: { ...(prev[cacheKey] || {}), [difficulty]: fetchedQuestions } })); return;
        } catch (error) {
            attempts++; console.warn(`Background Preloading: ERROR (Attempt ${attempts}/${maxAttempts}) - ${islandConfig.name} (${difficulty}):`, error);
            if (attempts >= maxAttempts) { setPreloadedQuestionsCache(prev => ({ ...prev, [cacheKey]: { ...(prev[cacheKey] || {}), [difficulty]: 'error' } })); }
        }
    }
  }, [apiKeyMissing, selectedGrade, preloadedQuestionsCache, _fetchAndProcessQuestionSet]);


  useEffect(() => {
    if (gameState === 'IslandPlaying' && currentIslandId && selectedGrade && islandsForCurrentGrade.length > 0 && selectedIslandDifficulty && selectedGrade !== GradeLevel.FINAL) {
      const currentIndexInGrade = islandsForCurrentGrade.findIndex(island => island.islandId === currentIslandId);
      if (currentIndexInGrade !== -1 && currentIndexInGrade < islandsForCurrentGrade.length - 1) {
        const nextIslandConfig = islandsForCurrentGrade[currentIndexInGrade + 1];
        const timeoutId = setTimeout(() => {
          const cacheEntryForNextIslandSameDifficulty = preloadedQuestionsCache[nextIslandConfig.islandId]?.[selectedIslandDifficulty];
          if (!cacheEntryForNextIslandSameDifficulty || cacheEntryForNextIslandSameDifficulty === 'pending') backgroundPreloadIslandDifficulty(nextIslandConfig, selectedIslandDifficulty, true).catch(err => console.error(`Error in N+1 preload (same difficulty: ${selectedIslandDifficulty}) for ${nextIslandConfig.name}:`, err));
        }, 3500); 
        return () => clearTimeout(timeoutId);
      }
    }
  }, [gameState, currentIslandId, selectedGrade, islandsForCurrentGrade, selectedIslandDifficulty, preloadedQuestionsCache, backgroundPreloadIslandDifficulty]);

  const trySpawnTreasureChests = useCallback((grade: GradeLevel) => {
    const completedIslandsInGrade = islandsForCurrentGrade.filter( (island) => islandProgress[island.islandId] === 'completed' );
    if (completedIslandsInGrade.length === 0) return;
    setActiveTreasureChests(prevChests => {
        let updatedGradeChests = { ...(prevChests[grade] || {}) }; let chestSpawnedThisTime = false;
        const existingChestInGrade = Object.keys(updatedGradeChests).find(islandId => updatedGradeChests[islandId]);
        if (existingChestInGrade) return prevChests;
        completedIslandsInGrade.forEach(island => { if ( !chestSpawnedThisTime && (!activeMessageBottle || !activeMessageBottle[island.islandId]) && (!activeNPCData || activeNPCData.islandId !== island.islandId || activeNPCData.grade !== grade) && (!activeCollectible || !activeCollectible[island.islandId]) && Math.random() < TREASURE_CHEST_SPAWN_CHANCE ) { updatedGradeChests[island.islandId] = true; chestSpawnedThisTime = true; playSound(TREASURE_SPARKLE_SOUND_URL, 0.3); } });
        if (chestSpawnedThisTime) { const newChestsState = { ...prevChests, [grade]: updatedGradeChests }; saveActiveTreasureChestsToStorage(newChestsState); return newChestsState; }
        return prevChests;
    });
  }, [islandsForCurrentGrade, islandProgress, playSound, activeMessageBottle, activeNPCData, activeCollectible]);


  const handleTreasureChestOpened = useCallback((grade: GradeLevel, islandId: string, pointsAwarded: number) => {
    if (pointsAwarded > 0 && selectedGrade) { const newOverallScore = overallScore + pointsAwarded; setOverallScore(newOverallScore); saveOverallScoreToStorage(selectedGrade, newOverallScore); showToast(pointsAwarded > 0 ? TREASURE_CHEST_POINTS_MESSAGE(pointsAwarded) : "Tiếc quá, rương này không có điểm!", 'info', <GiftIcon className="w-6 h-6"/>); }
    setActiveTreasureChests(prevChests => { const updatedGradeChests = { ...(prevChests[grade] || {}) }; delete updatedGradeChests[islandId]; const newChestsState = { ...prevChests, [grade]: updatedGradeChests }; saveActiveTreasureChestsToStorage(newChestsState); return newChestsState; });
    setShowTreasureModalForIslandId(null); setGameState('IslandMap');
    updateDailyChallengeProgress(CHALLENGE_ACTION_TREASURE_CHEST_OPENED);
    updateWeeklyChallengeProgress(CHALLENGE_ACTION_TREASURE_CHEST_OPENED);
  }, [overallScore, selectedGrade, showToast, updateDailyChallengeProgress, updateWeeklyChallengeProgress, playSound]);

  const trySpawnMessageBottle = useCallback(() => {
    if (Object.keys(activeMessageBottle).length > 0) return;
    const allCompletedIslands = ISLAND_CONFIGS.filter(island => { const gradeProgress = allGradesProgress[island.targetGradeLevel]; return gradeProgress && gradeProgress[island.islandId] === 'completed' && (!activeTreasureChests[island.targetGradeLevel] || !activeTreasureChests[island.targetGradeLevel]?.[island.islandId]) && (!activeNPCData || activeNPCData.islandId !== island.islandId || activeNPCData.grade !== island.targetGradeLevel) && (!activeCollectible || !activeCollectible[island.islandId]); });
    if (allCompletedIslands.length === 0) return;
    if (Math.random() < MESSAGE_IN_BOTTLE_SPAWN_CHANCE) {
        const randomIsland = allCompletedIslands[Math.floor(Math.random() * allCompletedIslands.length)]; const randomMessage = MESSAGES_IN_BOTTLE[Math.floor(Math.random() * MESSAGES_IN_BOTTLE.length)];
        const newBottleState: ActiveMessageBottlesState = { [randomIsland.islandId]: { grade: randomIsland.targetGradeLevel, messageId: randomMessage.id } };
        setActiveMessageBottle(newBottleState); saveActiveMessageBottlesToStorage(newBottleState); playSound(BOTTLE_SPAWN_SOUND_URL, 0.4);
    }
  }, [allGradesProgress, activeMessageBottle, activeTreasureChests, playSound, activeNPCData, activeCollectible]);

  const handleMessageBottleOpened = useCallback((islandId: string) => {
    const bottleData = activeMessageBottle[islandId];
    if (bottleData) { const messageContent = MESSAGES_IN_BOTTLE.find(m => m.id === bottleData.messageId); setCurrentBottleMessageContent(messageContent || MESSAGES_IN_BOTTLE[0]); setShowBottleModalForIslandId(islandId); playSound(BOTTLE_OPEN_SOUND_URL, 0.5); }
  }, [activeMessageBottle, playSound]);

  const handleMessageBottleClosed = () => { setShowBottleModalForIslandId(null); setActiveMessageBottle({}); saveActiveMessageBottlesToStorage({}); setGameState('IslandMap'); };

  const spawnShootingStar = useCallback(() => {
    if (shootingStar || gameState !== 'IslandMap') return;
    playSound(SHOOTING_STAR_APPEAR_SOUND_URL, 0.3); const id = uuidv4(); const size = SHOOTING_STAR_BASE_SIZE_PX + Math.random() * 16 - 8; const duration = SHOOTING_STAR_ANIMATION_DURATION_MS + Math.random() * 1000 - 500; const delay = Math.random() * 500;
    const startsLeft = Math.random() < 0.5; const startY = (Math.random() * 60 + 5) + '%'; const endY = (Math.random() * 60 + 5) + '%';
    const newStar: ShootingStarData = { id, startX: startsLeft ? "-10%" : "110%", startY, endX: startsLeft ? "110%" : "-10%", endY, duration, size, delay, visible: true, clicked: false };
    setShootingStar(newStar);
    setTimeout(() => { setShootingStar(prevStar => (prevStar && prevStar.id === id && !prevStar.clicked) ? null : prevStar); }, SHOOTING_STAR_MAX_ACTIVE_MS + delay);
  }, [shootingStar, gameState, playSound]);

  useEffect(() => {
    if (gameState === 'IslandMap') {
      const scheduleNextStar = () => { if (shootingStarTimerRef.current) clearTimeout(shootingStarTimerRef.current); const interval = Math.random() * (SHOOTING_STAR_SPAWN_INTERVAL_MAX_MS - SHOOTING_STAR_SPAWN_INTERVAL_MIN_MS) + SHOOTING_STAR_SPAWN_INTERVAL_MIN_MS; shootingStarTimerRef.current = setTimeout(() => { spawnShootingStar(); scheduleNextStar(); }, interval); };
      scheduleNextStar();
    } else { if (shootingStarTimerRef.current) clearTimeout(shootingStarTimerRef.current); setShootingStar(null); }
    return () => { if (shootingStarTimerRef.current) clearTimeout(shootingStarTimerRef.current); };
  }, [gameState, spawnShootingStar]);


  const handleShootingStarClick = useCallback((starId: string) => {
    if (shootingStar && shootingStar.id === starId && !shootingStar.clicked) {
      playSound(SHOOTING_STAR_CLICK_SOUND_URL, 0.6); setShootingStar(prev => prev ? { ...prev, clicked: true, visible: false } : null);
      if (selectedGrade) {
        const points = Math.floor(Math.random() * (SHOOTING_STAR_REWARD_POINTS_MAX - SHOOTING_STAR_REWARD_POINTS_MIN + 1)) + SHOOTING_STAR_REWARD_POINTS_MIN;
        const newOverallScore = overallScore + points; setOverallScore(newOverallScore); saveOverallScoreToStorage(selectedGrade, newOverallScore);
        showToast(SHOOTING_STAR_CLICK_SUCCESS_MESSAGE(points), 'success', <SparklesIcon className="w-6 h-6" />);
        updateDailyChallengeProgress(CHALLENGE_ACTION_SHOOTING_STAR_COLLECTED);
        updateWeeklyChallengeProgress(CHALLENGE_ACTION_SHOOTING_STAR_COLLECTED);
      }
    }
  }, [shootingStar, selectedGrade, overallScore, playSound, showToast, updateDailyChallengeProgress, updateWeeklyChallengeProgress]);

  const trySpawnFriendlyNPC = useCallback(() => {
    if (activeNPCData || !selectedGrade) return;
    const eligibleIslandsForNPC = islandsForCurrentGrade.filter(island => { const islandState = islandProgress[island.islandId]; return (islandState === 'completed' || islandState === 'unlocked') && (!activeTreasureChests[selectedGrade] || !activeTreasureChests[selectedGrade]?.[island.islandId]) && (!activeMessageBottle || !activeMessageBottle[island.islandId]) && (!activeCollectible || !activeCollectible[island.islandId]); });
    if (eligibleIslandsForNPC.length === 0) return;
    if (Math.random() < FRIENDLY_NPC_SPAWN_CHANCE) {
        const randomIsland = eligibleIslandsForNPC[Math.floor(Math.random() * eligibleIslandsForNPC.length)]; const randomNPCFromList = FRIENDLY_NPCS[Math.floor(Math.random() * FRIENDLY_NPCS.length)];
        let possibleInteractions = NPC_INTERACTIONS.filter(interaction => !interaction.npcIds || interaction.npcIds.includes(randomNPCFromList.id));
        if (possibleInteractions.length === 0) possibleInteractions = NPC_INTERACTIONS; if (possibleInteractions.length === 0) return;
        const randomInteraction = possibleInteractions[Math.floor(Math.random() * possibleInteractions.length)];
        const newNPCData: ActiveNPCInfo = { npc: randomNPCFromList, interaction: randomInteraction, islandId: randomIsland.islandId, grade: randomIsland.targetGradeLevel };
        setActiveNPCData(newNPCData); saveActiveNPCToStorage({ npcId: newNPCData.npc.id, interactionId: newNPCData.interaction.id, islandId: newNPCData.islandId, grade: newNPCData.grade });
        playSound(NPC_SPAWN_SOUND_URL, 0.4);
    }
  }, [islandsForCurrentGrade, islandProgress, activeNPCData, activeTreasureChests, activeMessageBottle, playSound, selectedGrade, activeCollectible]);

  const handleNPCInteraction = (islandId: string) => { if (activeNPCData && activeNPCData.islandId === islandId) { playSound(NPC_INTERACTION_SOUND_URL, 0.5); setNpcRiddleAnswer(''); setNpcRiddlePhase('question'); setIsNpcRiddleCorrect(null); setShowNPCModal(true); } };

  const handleNPCRiddleSubmit = () => {
    if (!activeNPCData || activeNPCData.interaction.type !== 'riddle' || !activeNPCData.interaction.answer) return;
    const isCorrect = npcRiddleAnswer.trim().toLowerCase() === activeNPCData.interaction.answer.toLowerCase(); setIsNpcRiddleCorrect(isCorrect); setNpcRiddlePhase('feedback'); let pointsAwarded = 0;
    if (isCorrect) { playSound(NPC_RIDDLE_SUCCESS_SOUND_URL, 0.5); pointsAwarded = activeNPCData.interaction.points; showToast(`Tuyệt vời! Bạn giải đúng câu đố và nhận được ${pointsAwarded} điểm!`, 'success'); }
    else { playSound(NPC_RIDDLE_FAIL_SOUND_URL, 0.4); showToast(`Tiếc quá! Đáp án đúng là: ${activeNPCData.interaction.answer}`, 'error'); }
    if (pointsAwarded > 0 && selectedGrade) { const newOverallScore = overallScore + pointsAwarded; setOverallScore(newOverallScore); saveOverallScoreToStorage(selectedGrade, newOverallScore); }
  };

  const handleNPCModalClose = () => {
    playSound(BUTTON_CLICK_SOUND_URL);
    if (activeNPCData && activeNPCData.interaction.type !== 'riddle' && selectedGrade) {
        const pointsAwarded = activeNPCData.interaction.points; if (pointsAwarded > 0) { const newOverallScore = overallScore + pointsAwarded; setOverallScore(newOverallScore); saveOverallScoreToStorage(selectedGrade, newOverallScore); showToast(`Bạn nhận được ${pointsAwarded} điểm từ ${activeNPCData.npc.name}!`, 'info'); }
    }
    updateDailyChallengeProgress(CHALLENGE_ACTION_NPC_INTERACTED);
    updateWeeklyChallengeProgress(CHALLENGE_ACTION_NPC_INTERACTED);
    setShowNPCModal(false); setActiveNPCData(null); saveActiveNPCToStorage(null); setGameState('IslandMap');
  };

  const trySpawnCollectible = useCallback(() => {
    if (Object.keys(activeCollectible).length > 0) return;
    const allCompletedIslands = ISLAND_CONFIGS.filter(island => { const gradeProgress = allGradesProgress[island.targetGradeLevel]; return gradeProgress && gradeProgress[island.islandId] === 'completed' && (!activeTreasureChests[island.targetGradeLevel] || !activeTreasureChests[island.targetGradeLevel]?.[island.islandId]) && (!activeNPCData || activeNPCData.islandId !== island.islandId || activeNPCData.grade !== island.targetGradeLevel) && (!activeMessageBottle || !activeMessageBottle[island.islandId]); });
    if (allCompletedIslands.length === 0) return;
    if (Math.random() < COLLECTIBLE_SPAWN_CHANCE) {
        const randomIsland = allCompletedIslands[Math.floor(Math.random() * allCompletedIslands.length)]; const randomCollectibleItem = COLLECTIBLE_ITEMS[Math.floor(Math.random() * COLLECTIBLE_ITEMS.length)];
        const newCollectibleState: ActiveCollectibleState = { [randomIsland.islandId]: { grade: randomIsland.targetGradeLevel, collectibleId: randomCollectibleItem.id } };
        setActiveCollectible(newCollectibleState); saveActiveCollectibleToStorage(newCollectibleState); playSound(COLLECTIBLE_SPAWN_SOUND_URL, 0.35);
    }
  }, [allGradesProgress, activeCollectible, activeTreasureChests, activeNPCData, activeMessageBottle, playSound]);

  const handleStartAdventure = () => { unlockAudioContext(); playSound(BUTTON_CLICK_SOUND_URL); if (!process.env.API_KEY) { setApiKeyMissing(true); setGameState('Error'); setLoadingError(API_KEY_ERROR_MESSAGE); return; } setGameState('ThemeSelection'); };

  const handleGradeSelect = (grade: GradeLevel, isAutoLoading = false) => {
    if (!isAutoLoading) { unlockAudioContext(); playSound(GRADE_SELECT_SOUND_URL, 0.7); }
    resetForNewGradeJourney(grade); setSelectedGrade(grade); saveLastSelectedGrade(grade);
    const gradeIslands = ISLAND_CONFIGS.filter(island => island.targetGradeLevel === grade && island.islandId !== FINAL_TREASURE_ISLAND_ID);
    if (gradeIslands.length > 0) {
      if (Object.keys(islandProgress).length === 0) { const initialProgressForGrade: IslandProgressState = {}; gradeIslands.forEach((island) => { initialProgressForGrade[island.islandId] = island.islandNumber === 1 ? 'unlocked' : 'locked'; }); setIslandProgress(initialProgressForGrade); saveIslandProgressToStorage(grade, initialProgressForGrade); setAllGradesProgress(prev => ({...prev, [grade]: initialProgressForGrade})); }
      setGameState('IslandMap'); trySpawnTreasureChests(grade); trySpawnMessageBottle(); trySpawnFriendlyNPC(); trySpawnCollectible();
      setTimeout(() => checkAndAwardAchievements(), 100);
    } else if (grade === GradeLevel.FINAL && isFinalIslandUnlocked) {
        const finalIslandConfig = ISLAND_CONFIGS.find(i => i.islandId === FINAL_TREASURE_ISLAND_ID);
        if (finalIslandConfig) { setIslandProgress({ [FINAL_TREASURE_ISLAND_ID]: 'unlocked' }); setGameState('IslandMap'); playSound(FINAL_ISLAND_AMBIENT_SOUND_URL, 0.4); } else { setGameState('Error'); setLoadingError("Lỗi: Không tìm thấy cấu hình Đảo Cuối Cùng."); }
    } else { setGameState('Error'); setLoadingError(NO_ISLANDS_FOR_GRADE_TEXT); }
  };


  const loadFinalIslandSequentially = useCallback(async (islandConfig: IslandConfig, difficulty: IslandDifficulty) => {
    if (apiKeyMissing) { setGameState('Error'); setLoadingError(API_KEY_ERROR_MESSAGE); return; }
    setIsIslandLoading(true); setLoadingError(null);
    setIslandLoadingProgressMessage(FINAL_ISLAND_LOADING_FIRST_CHALLENGE_TEXT);
    setCurrentIslandId(islandConfig.islandId);
    setSelectedIslandDifficulty(difficulty); 
    try {
      const firstChallenge = await generateSingleFinalIslandChallenge(0, islandConfig, difficulty);
      if (firstChallenge) {
        const initialQuestions = Array(QUESTIONS_PER_FINAL_ISLAND).fill(null);
        initialQuestions[0] = firstChallenge;
        setQuestionsForCurrentIsland(initialQuestions);
        setCurrentQuestionIndexInIsland(0);
        resetForNewIslandPlay();
        setGameState('IslandPlaying');
        setIsIslandLoading(false);
        preloadRemainingFinalChallenges(1, islandConfig, difficulty);
      } else { throw new Error("Failed to load the first challenge for the Final Island."); }
    } catch (error) { const errorMessage = error instanceof Error ? error.message : QUESTION_GENERATION_ERROR_MESSAGE; setLoadingError(errorMessage); setGameState('Error'); setIsIslandLoading(false); }
  }, [apiKeyMissing, resetForNewIslandPlay]);

  const preloadRemainingFinalChallenges = useCallback(async (startIndex: number, islandConfig: IslandConfig, difficulty: IslandDifficulty) => {
    for (let i = startIndex; i < QUESTIONS_PER_FINAL_ISLAND; i++) {
        try {
            const challenge = await generateSingleFinalIslandChallenge(i, islandConfig, difficulty);
            if (challenge) { setQuestionsForCurrentIsland(prevQs => { const updatedQs = [...prevQs]; updatedQs[i] = challenge; return updatedQs; });
            } else { console.warn(`Failed to preload Final Island challenge index ${i}`); }
        } catch (error) { console.error(`Error preloading Final Island challenge index ${i}:`, error); }
    }
  }, []);

  useEffect(() => {
    if (gameState === 'IslandPlaying' && currentIslandConfig?.targetGradeLevel === GradeLevel.FINAL && isLoadingNextFinalIslandQuestion) {
      const targetIdx = currentQuestionIndexInIsland; 
      if (questionsForCurrentIsland[targetIdx]) { resetForNewQuestion(); setIsLoadingNextFinalIslandQuestion(false); }
    }
  }, [questionsForCurrentIsland, isLoadingNextFinalIslandQuestion, currentQuestionIndexInIsland, gameState, currentIslandConfig, resetForNewQuestion]);

  const handleIslandSelect = (islandId: string) => {
    unlockAudioContext(); const status = islandProgress[islandId]; const islandConfig = islandsForCurrentGrade.find(i => i.islandId === islandId);
    if (islandConfig && (status === 'unlocked' || status === 'completed')) {
        playSound(ISLAND_SELECT_SOUND_URL, 0.6); let eventHandled = false;
        if (activeCollectible[islandId]) {
            const collectibleInfo = activeCollectible[islandId];
            if (collectibleInfo) { const item = COLLECTIBLE_ITEMS.find(c => c.id === collectibleInfo.collectibleId); if (item) { playSound(COLLECTIBLE_COLLECT_SOUND_URL, 0.5); showToast(COLLECTIBLE_COLLECTION_TOAST_MESSAGE(item.name), 'info', <CollectionIcon className="w-6 h-6"/>); setCollectedItems(prev => { const updated = { ...prev, [item.id]: true }; saveCollectedItemsToStorage(updated); return updated; }); } }
            setActiveCollectible({}); saveActiveCollectibleToStorage({}); checkAndAwardAchievements();
        }
        if (activeNPCData && activeNPCData.islandId === islandId && selectedGrade && activeNPCData.grade === selectedGrade) { handleNPCInteraction(islandId); eventHandled = true; }
        else if (status === 'completed' && activeMessageBottle[islandId]) { handleMessageBottleOpened(islandId); eventHandled = true; }
        else if (status === 'completed' && selectedGrade && activeTreasureChests[selectedGrade]?.[islandId]) { setShowTreasureModalForIslandId(islandId); eventHandled = true; }

        if (!eventHandled) {
            setCurrentIslandId(islandId);
            if (islandId === FINAL_TREASURE_ISLAND_ID) {
                playSound(FINAL_ISLAND_AMBIENT_SOUND_URL, 0.5);
                setTransitionDetails({ message: FINAL_ISLAND_INTRO_MESSAGE, duration: FINAL_ISLAND_INTRO_DURATION_MS, onComplete: () => loadFinalIslandSequentially(islandConfig, IslandDifficulty.HARD) });
                setGameState('Transitioning');
            } else { setShowDifficultySelectionModalForIslandId(islandId); }
        }
    } else { playSound(INCORRECT_ANSWER_SOUND_URL, 0.3); showToast(LOCKED_ISLAND_TEXT, 'warning'); }
  };

  const handleDifficultySelected = (difficulty: IslandDifficulty) => {
    unlockAudioContext(); playSound(BUTTON_CLICK_SOUND_URL); if (!currentIslandId) return;
    const islandConfigToLoad = islandsForCurrentGrade.find(i => i.islandId === currentIslandId);
    if (!islandConfigToLoad) { setGameState('Error'); setLoadingError("Lỗi: Không tìm thấy đảo để tải sau khi chọn độ khó."); setShowDifficultySelectionModalForIslandId(null); return; }
    setShowDifficultySelectionModalForIslandId(null);

    if (islandConfigToLoad.targetGradeLevel === GradeLevel.FINAL) { console.error("handleDifficultySelected should not be called for Final Island."); loadFinalIslandSequentially(islandConfigToLoad, IslandDifficulty.HARD); return; }

    const questionsToExpect = QUESTIONS_PER_ISLAND;
    const cachedData = preloadedQuestionsCache[currentIslandId]?.[difficulty];

    if (Array.isArray(cachedData) && cachedData.length === questionsToExpect) { _fetchAndSetQuestionsForStandardIsland(currentIslandId, difficulty); }
    else { setTransitionDetails({ message: TRAVELLING_TO_ISLAND_TEXT(islandConfigToLoad.name), duration: 1800, onComplete: () => _fetchAndSetQuestionsForStandardIsland(currentIslandId, difficulty) }); setGameState('Transitioning'); }
  };

  const _fetchAndSetQuestionsForStandardIsland = useCallback(async (islandIdToLoad: string, difficulty: IslandDifficulty) => {
    if (apiKeyMissing || !selectedGrade) { return; }
    const islandConfig = islandsForCurrentGrade.find(i => i.islandId === islandIdToLoad);
    if (!islandConfig || islandConfig.targetGradeLevel === GradeLevel.FINAL) { return; }

    const cachedData = preloadedQuestionsCache[islandIdToLoad]?.[difficulty];
    if (Array.isArray(cachedData)) {
      setQuestionsForCurrentIsland(cachedData); setCurrentIslandId(islandIdToLoad); setSelectedIslandDifficulty(difficulty); resetForNewIslandPlay();
      const startMsg = STARTING_ISLAND_TEXT(islandConfig.name, ISLAND_DIFFICULTY_TEXT_MAP[difficulty]);
      setTransitionDetails({ message: startMsg, duration: 700, onComplete: () => setGameState('IslandPlaying') });
      setGameState('Transitioning'); return;
    }

    setIsIslandLoading(true); setLoadingError(null); setIslandLoadingProgressMessage(ISLAND_PREPARING_MESSAGE(islandConfig.name)); setTransitionDetails(null);
    try {
        const fetchedQuestions = await _fetchAndProcessQuestionSet(islandConfig, difficulty); 
        setPreloadedQuestionsCache(prev => ({ ...prev, [islandIdToLoad]: { ...(prev[islandIdToLoad] || {}), [difficulty]: fetchedQuestions } }));
        setQuestionsForCurrentIsland(fetchedQuestions); setCurrentIslandId(islandIdToLoad); setSelectedIslandDifficulty(difficulty); resetForNewIslandPlay(); setGameState('IslandPlaying');
    } catch (error) { const errorMessage = error instanceof Error ? error.message : QUESTION_GENERATION_ERROR_MESSAGE; setLoadingError(errorMessage); setGameState('Error'); }
    finally { setIsIslandLoading(false); }
  }, [apiKeyMissing, selectedGrade, islandsForCurrentGrade, resetForNewIslandPlay, preloadedQuestionsCache, _fetchAndProcessQuestionSet]);


  const handleNextQuestionInIsland = useCallback(() => {
    if (!selectedGrade || !currentIslandId || !selectedIslandDifficulty) return;
    resetStreakChallengesIfNeeded(false);

    const isFinalIsland = currentIslandConfig?.targetGradeLevel === GradeLevel.FINAL;
    const questionsToComplete = isFinalIsland ? QUESTIONS_PER_FINAL_ISLAND : QUESTIONS_PER_ISLAND;
    const nextQuestionLocalIndex = currentQuestionIndexInIsland + 1;

    if (nextQuestionLocalIndex < questionsToComplete) {
        if (isFinalIsland) {
            if (questionsForCurrentIsland[nextQuestionLocalIndex]) { setCurrentQuestionIndexInIsland(nextQuestionLocalIndex); resetForNewQuestion(); setIsLoadingNextFinalIslandQuestion(false); }
            else { setCurrentQuestionIndexInIsland(nextQuestionLocalIndex); setIsLoadingNextFinalIslandQuestion(true); }
        } else { setCurrentQuestionIndexInIsland(nextQuestionLocalIndex); resetForNewQuestion(); }
    } else {
      const completedIslandId = currentIslandId; let starsEarned = 0; const livesAtCompletion = playerLives;
      if (livesAtCompletion === MAX_PLAYER_LIVES) starsEarned = 5; else if (livesAtCompletion === MAX_PLAYER_LIVES - 1) starsEarned = 4; else if (livesAtCompletion === MAX_PLAYER_LIVES - 2 && livesAtCompletion > 0) starsEarned = 3; else if (livesAtCompletion === 0) starsEarned = 2; else starsEarned = 3;
      const updatedStarRatingsForGrade = { ...islandStarRatings, [completedIslandId]: Math.max(islandStarRatings[completedIslandId] || 0, starsEarned) };
      setIslandStarRatings(updatedStarRatingsForGrade); saveIslandStarRatingsToStorage(selectedGrade, updatedStarRatingsForGrade);
      setAllGradesStarRatings(prev => { const updatedAllStars = { ...prev, [selectedGrade]: updatedStarRatingsForGrade }; saveAllGradesStarRatingsToStorage(updatedAllStars); return updatedAllStars; });
      setPlayerLives(prevLives => Math.min(prevLives + 1, MAX_PLAYER_LIVES));
      const updatedProgressForGrade = { ...islandProgress, [completedIslandId]: 'completed' as IslandStatus };
      const currentIslandInGradeIndex = islandsForCurrentGrade.findIndex(i => i.islandId === completedIslandId);
      if (currentIslandInGradeIndex !== -1 && currentIslandInGradeIndex < islandsForCurrentGrade.length - 1) { const nextIslandInGrade = islandsForCurrentGrade[currentIslandInGradeIndex + 1]; if (nextIslandInGrade && updatedProgressForGrade[nextIslandInGrade.islandId] === 'locked') updatedProgressForGrade[nextIslandInGrade.islandId] = 'unlocked'; }
      setIslandProgress(updatedProgressForGrade); saveIslandProgressToStorage(selectedGrade, updatedProgressForGrade); setAllGradesProgress(prev => ({...prev, [selectedGrade]: updatedProgressForGrade}));

      updateDailyChallengeProgress(CHALLENGE_ACTION_ISLAND_COMPLETED); updateWeeklyChallengeProgress(CHALLENGE_ACTION_ISLAND_COMPLETED);
      if (starsEarned > 0) { updateDailyChallengeProgress(CHALLENGE_ACTION_STAR_EARNED, starsEarned); updateWeeklyChallengeProgress(CHALLENGE_ACTION_STAR_EARNED, starsEarned); }

      setTimeout(() => checkAndAwardAchievements({ difficulty: selectedIslandDifficulty, hintUsed: hintUsedThisIslandRun }), 100);

      if (selectedGrade === GradeLevel.FINAL && completedIslandId === FINAL_TREASURE_ISLAND_ID) { playSound(VICTORY_FANFARE_SOUND_URL, 0.8); setGameState('IslandComplete'); setPlayerGems(prev => { const newGems = prev + 1000; savePlayerGems(newGems); return newGems; }); return; }

      const allIslandsForGradeCompleted = islandsForCurrentGrade.every(island => updatedProgressForGrade[island.islandId] === 'completed');
      if(allIslandsForGradeCompleted && islandsForCurrentGrade.length >= ISLANDS_PER_GRADE && selectedGrade !== GradeLevel.FINAL) {
          if(audioUnlocked) playSound(VICTORY_FANFARE_SOUND_URL, 0.7); setGameState('GradeComplete');
          const allNormalGrades = (Object.values(GradeLevel).filter(g => typeof g === 'number' && g !== GradeLevel.FINAL) as GradeLevel[]);
          const allNormalGradesCompleted = allNormalGrades.every(g => { const gradeIslands = ISLAND_CONFIGS.filter(i => i.targetGradeLevel === g && i.islandId !== FINAL_TREASURE_ISLAND_ID); const gradeProg = allGradesProgress[g] || {}; return gradeIslands.length > 0 && gradeIslands.every(i => gradeProg[i.islandId] === 'completed'); });
          if (allNormalGradesCompleted && !isFinalIslandUnlocked) { playSound(FINAL_ISLAND_UNLOCK_SOUND_URL, 0.7); showToast(FINAL_ISLAND_UNLOCK_MESSAGE, 'success', <KeyIcon className="w-7 h-7" />); }
      } else { if (audioUnlocked) playSound(VICTORY_FANFARE_SOUND_URL, 0.6); setGameState('IslandComplete'); }
    }
  }, [currentQuestionIndexInIsland, resetForNewQuestion, currentIslandId, selectedIslandDifficulty, islandsForCurrentGrade, islandProgress, selectedGrade, playerLives, islandStarRatings, playSound, audioUnlocked, checkAndAwardAchievements, allGradesProgress, allGradesStarRatings, hintUsedThisIslandRun, isFinalIslandUnlocked, showToast, updateDailyChallengeProgress, updateWeeklyChallengeProgress, resetStreakChallengesIfNeeded, currentIslandConfig, questionsForCurrentIsland, setIsLoadingNextFinalIslandQuestion]);

  const fetchNextEndlessBatch = useCallback(async () => {
    if (apiKeyMissing || !currentEndlessGrade) { setLoadingError(apiKeyMissing ? API_KEY_ERROR_MESSAGE : "Vui lòng chọn lớp để chơi Vô Tận."); setGameState('Error'); return; }
    setGameState('EndlessLoading'); setLoadingError(null);
    try {
      const questions = await generateEndlessMathQuestions(currentEndlessGrade, ENDLESS_MODE_DIFFICULTY);
      if (questions && questions.length > 0) { setEndlessQuestionBatch(questions); setCurrentEndlessQuestionIndex(0); resetForNewQuestion(); setGameState('EndlessPlaying'); }
      else { setLoadingError(ENDLESS_MODE_ERROR_TEXT); setGameState('Error'); }
    } catch (error) { setLoadingError(ENDLESS_MODE_ERROR_TEXT); setGameState('Error'); }
  }, [apiKeyMissing, currentEndlessGrade, resetForNewQuestion]);

  const handleNextEndlessQuestion = useCallback(() => { resetForNewQuestion(); if (currentEndlessQuestionIndex < endlessQuestionBatch.length - 1) { setCurrentEndlessQuestionIndex(prev => prev + 1); } else { fetchNextEndlessBatch(); } }, [currentEndlessQuestionIndex, endlessQuestionBatch.length, fetchNextEndlessBatch, resetForNewQuestion]);

  const handleAnswerSubmit = useCallback(() => {
    unlockAudioContext();
    if (!selectedAnswer || !currentQuestion || (gameState === 'IslandPlaying' && !selectedGrade)) {
        return;
    }

    playSound(CHECK_ANSWER_SOUND_URL, 0.6);
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    setUserAttemptShown(true);

    if (activeDailyChallenge && activeDailyChallenge.type === DailyChallengeType.CORRECT_ANSWERS_IN_A_ROW && !activeDailyChallenge.isCompleted) {
        updateDailyChallengeProgress(CHALLENGE_ACTION_CORRECT_ANSWER, isCorrect ? 1 : 0);
    }
    if (activeWeeklyChallenge && activeWeeklyChallenge.type === WeeklyChallengeType.WC_TOTAL_CORRECT_ANSWERS && !activeWeeklyChallenge.isCompleted && isCorrect) {
        updateWeeklyChallengeProgress(CHALLENGE_ACTION_CORRECT_ANSWER);
    }

    if (isCorrect) {
        playSound(CORRECT_ANSWER_SOUND_URL, 0.5);
        setFeedback({ isCorrect: true, message: "Chính xác! Tuyệt vời!" });
        setRevealSolution(true);
        setTriggerConfettiEffect(true); // Trigger confetti
        const pointsEarned = hintButtonUsed ? 2 : 5;

        switch (gameState) {
            case 'EndlessPlaying':
                setEndlessModeScore(prev => prev + pointsEarned);
                setEndlessQuestionsAnswered(prev => prev + 1);
                setTimeout(() => handleNextEndlessQuestion(), 1500);
                break;
            case 'IslandPlaying':
                if (selectedGrade) { 
                    const newOverallScore = overallScore + pointsEarned;
                    setOverallScore(newOverallScore);
                    saveOverallScoreToStorage(selectedGrade, newOverallScore);
                    setIslandScore(prevIslandScore => prevIslandScore + pointsEarned);
                    setTimeout(() => handleNextQuestionInIsland(), 1500);
                }
                break;
        }
    } else { 
        playSound(INCORRECT_ANSWER_SOUND_URL, 0.4);
        
        switch (gameState) {
            case 'EndlessPlaying':
                const newEndlessLives = endlessModeLives - 1;
                setEndlessModeLives(newEndlessLives);
                if (newEndlessLives <= 0) {
                    setRevealSolution(true);
                    setFeedback({ isCorrect: false, message: `Hết lượt! Đáp án đúng là: ${currentQuestion.correctAnswer}.` });
                    setTimeout(() => setGameState('EndlessSummary'), 3000);
                } else {
                    setFeedback({ isCorrect: false, message: `Sai rồi! Bạn còn ${newEndlessLives} lượt thử.` });
                    setTimeout(() => { setSelectedAnswer(null); setUserAttemptShown(false); setFeedback({ isCorrect: null }); }, 1500);
                }
                break;
            case 'IslandPlaying':
                const newPlayerLives = playerLives - 1;
                setPlayerLives(newPlayerLives);
                if (newPlayerLives <= 0) {
                    setRevealSolution(true);
                    setFeedback({ isCorrect: false, message: `Hết lượt! Đáp án đúng là: ${currentQuestion.correctAnswer}.` });
                    setTimeout(() => handleNextQuestionInIsland(), 3000);
                } else {
                    setFeedback({ isCorrect: false, message: `Sai rồi! Bạn còn ${newPlayerLives} lượt thử.` });
                    setTimeout(() => { setSelectedAnswer(null); setUserAttemptShown(false); setFeedback({ isCorrect: null }); }, 1500);
                }
                break;
        }
    }
  }, [
      selectedAnswer, currentQuestion, playerLives, endlessModeLives, gameState, 
      handleNextQuestionInIsland, hintButtonUsed, overallScore, selectedGrade, 
      playSound, unlockAudioContext, updateDailyChallengeProgress, activeDailyChallenge, 
      updateWeeklyChallengeProgress, activeWeeklyChallenge, handleNextEndlessQuestion,
      setFeedback, setRevealSolution, setEndlessModeScore, setEndlessQuestionsAnswered,
      saveOverallScoreToStorage, setIslandScore, setEndlessModeLives, setGameState,
      setSelectedAnswer, setUserAttemptShown, setPlayerLives, setTriggerConfettiEffect
    ]);


  const handleBackToMap = () => {
    unlockAudioContext(); playSound(BUTTON_CLICK_SOUND_URL); resetStreakChallengesIfNeeded(true);
    if (gameState === 'EndlessSummary' && currentEndlessGrade) { handleGradeSelect(currentEndlessGrade, true); return; }
    if (!selectedGrade) { handleChooseAnotherGrade(); return; }
    if (showTreasureModalForIslandId) setShowTreasureModalForIslandId(null); if (showBottleModalForIslandId) setShowBottleModalForIslandId(null); if (showNPCModal) setShowNPCModal(false);
    setIsLoadingNextFinalIslandQuestion(false); 
    const allGradeIslandsCompleted = islandsForCurrentGrade.every(island => islandProgress[island.islandId] === 'completed');
    setCurrentIslandId(null); setSelectedIslandDifficulty(null); setQuestionsForCurrentIsland([]); setCurrentQuestionIndexInIsland(0); resetForNewQuestion();
    setTransitionDetails({ message: UPDATING_MAP_TEXT, duration: 1000, onComplete: () => {
        if (allGradeIslandsCompleted && islandsForCurrentGrade.length >= ISLANDS_PER_GRADE && selectedGrade !== GradeLevel.FINAL) setGameState('GradeComplete');
        else setGameState('IslandMap');
        if (selectedGrade) { trySpawnTreasureChests(selectedGrade); trySpawnMessageBottle(); trySpawnFriendlyNPC(); trySpawnCollectible(); }
    }});
    setGameState('Transitioning');
  };

  const handlePlayIslandAgain = () => {
    unlockAudioContext(); playSound(BUTTON_CLICK_SOUND_URL);
    if (currentIslandId && selectedGrade && selectedIslandDifficulty && currentIslandConfig) {
        resetForNewIslandPlay(); setIsLoadingNextFinalIslandQuestion(false);
        if (currentIslandConfig.targetGradeLevel === GradeLevel.FINAL) { loadFinalIslandSequentially(currentIslandConfig, IslandDifficulty.HARD); }
        else { const startMsg = STARTING_ISLAND_TEXT(currentIslandConfig.name, ISLAND_DIFFICULTY_TEXT_MAP[selectedIslandDifficulty]); setTransitionDetails({ message: startMsg, duration: 700, onComplete: () => setGameState('IslandPlaying') }); setGameState('Transitioning'); }
    } else { handleBackToMap(); }
  };

  const handlePlayThisGradeAgain = () => {
    unlockAudioContext(); playSound(BUTTON_CLICK_SOUND_URL);
    if (selectedGrade) {
      saveOverallScoreToStorage(selectedGrade, 0); const initialProgressForGrade: IslandProgressState = {};
      ISLAND_CONFIGS.filter(i => i.targetGradeLevel === selectedGrade && i.islandId !== FINAL_TREASURE_ISLAND_ID).forEach(island => { initialProgressForGrade[island.islandId] = island.islandNumber === 1 ? 'unlocked' : 'locked'; });
      saveIslandProgressToStorage(selectedGrade, initialProgressForGrade); saveIslandStarRatingsToStorage(selectedGrade, {}); setPreloadedQuestionsCache({});
      setAllGradesProgress(prev => ({...prev, [selectedGrade!]: initialProgressForGrade})); setAllGradesStarRatings(prev => { const updatedAllStars = {...prev, [selectedGrade!]: {}}; saveAllGradesStarRatingsToStorage(updatedAllStars); return updatedAllStars; });
      setActiveTreasureChests(prevChests => { const newChests = { ...prevChests }; if (selectedGrade) delete newChests[selectedGrade]; saveActiveTreasureChestsToStorage(newChests); return newChests; });
      setActiveMessageBottle(prevBottles => { const newBottles: ActiveMessageBottlesState = {}; Object.keys(prevBottles).forEach(islandId => { if (prevBottles[islandId]?.grade !== selectedGrade) newBottles[islandId] = prevBottles[islandId]; }); saveActiveMessageBottlesToStorage(newBottles); return newBottles; });
      if (activeNPCData && activeNPCData.grade === selectedGrade) { setActiveNPCData(null); saveActiveNPCToStorage(null); }
      const currentCollectibleIslandId = Object.keys(activeCollectible)[0]; if (currentCollectibleIslandId && activeCollectible[currentCollectibleIslandId]?.grade === selectedGrade) { setActiveCollectible({}); saveActiveCollectibleToStorage({}); }
      handleGradeSelect(selectedGrade);
    }
  };

  const handleChooseAnotherGrade = () => { unlockAudioContext(); playSound(BUTTON_CLICK_SOUND_URL); setSelectedGrade(null); saveLastSelectedGrade(null); resetForNewGradeJourney(null); setGameState('GradeSelection'); };
  const handleReturnToGradeSelection = () => { unlockAudioContext(); playSound(BUTTON_CLICK_SOUND_URL); setSelectedGrade(null); saveLastSelectedGrade(null); resetForNewGradeJourney(null); setLoadingError(null); setApiKeyMissing(false); setGameState('GradeSelection'); }

  const handleRetryFetchIsland = () => {
    unlockAudioContext(); playSound(BUTTON_CLICK_SOUND_URL);
    if (gameState === 'Error' && loadingError === ENDLESS_MODE_ERROR_TEXT && currentEndlessGrade) { fetchNextEndlessBatch(); }
    else if (currentIslandConfig && currentIslandConfig.targetGradeLevel === GradeLevel.FINAL && selectedIslandDifficulty) { loadFinalIslandSequentially(currentIslandConfig, selectedIslandDifficulty); }
    else if (currentIslandId && selectedGrade && selectedIslandDifficulty) { setPreloadedQuestionsCache(prev => ({ ...prev, [currentIslandId]: { ...(prev[currentIslandId] || {}), [selectedIslandDifficulty]: 'pending' } })); setTransitionDetails(null); setLoadingError(null); _fetchAndSetQuestionsForStandardIsland(currentIslandId, selectedIslandDifficulty); }
    else if (selectedGrade) {
        const firstUnlockedIslandForGrade = islandsForCurrentGrade.find(i => islandProgress[i.islandId] === 'unlocked');
        if (firstUnlockedIslandForGrade) { setCurrentIslandId(firstUnlockedIslandForGrade.islandId); setLoadingError(null); if(gameState === 'Error') { setGameState('IslandMap'); setShowDifficultySelectionModalForIslandId(firstUnlockedIslandForGrade.islandId); } else { setShowDifficultySelectionModalForIslandId(firstUnlockedIslandForGrade.islandId); } }
        else { setLoadingError(null); setGameState(islandsForCurrentGrade.length > 0 ? 'IslandMap' : 'GradeSelection'); }
    } else { setLoadingError(null); setGameState('GradeSelection'); }
  };


  const handleHintRequest = useCallback(async () => {
    unlockAudioContext(); playSound(BUTTON_CLICK_SOUND_URL);
    if (!currentQuestion || apiKeyMissing) { setHint(apiKeyMissing ? API_KEY_ERROR_MESSAGE : HINT_UNAVAILABLE_MESSAGE); setIsHintModalOpen(true); return; }
    setIsHintLoading(true); setIsHintModalOpen(true); setHintButtonUsed(true);
    if (gameState !== 'EndlessPlaying') setHintUsedThisIslandRun(true);
    try { const fetchedHint = await getMathHint(currentQuestion.text, currentQuestion.targetGradeLevel); setHint(fetchedHint); }
    catch (error) { setHint(HINT_GENERATION_ERROR_MESSAGE); } finally { setIsHintLoading(false); }
  }, [currentQuestion, apiKeyMissing, playSound, unlockAudioContext, gameState]);

  const renderStars = (islandId: string) => { const stars = islandStarRatings[islandId] || 0; const totalStars = 5; return ( <div className="flex justify-center items-center h-5 sm:h-6"> {Array.from({ length: totalStars }).map((_, i) => i < stars ? <StarIconFilled key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--accent-color)]" /> : <StarIconOutline key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--accent-color)] opacity-50" /> )} </div> ); };
  const handleThemeChange = (newTheme: Theme) => { unlockAudioContext(); playSound(BUTTON_CLICK_SOUND_URL); applyNewTheme(newTheme); setThemeChangedForAchievement(true); setTimeout(() => checkAndAwardAchievements(), 100); };
  const handleToggleAchievementsScreen = () => { unlockAudioContext(); playSound(BUTTON_CLICK_SOUND_URL); setShowAchievementsScreen(prev => !prev); }
  const handleToggleDailyChallengeModal = () => { unlockAudioContext(); playSound(BUTTON_CLICK_SOUND_URL); setShowDailyChallengeModal(prev => !prev); }

  const handleAccessFinalIsland = () => { if (!isFinalIslandUnlocked) return; playSound(BUTTON_CLICK_SOUND_URL); resetForNewGradeJourney(GradeLevel.FINAL); setSelectedGrade(GradeLevel.FINAL); saveLastSelectedGrade(GradeLevel.FINAL); const finalIslandConfig = ISLAND_CONFIGS.find(i => i.islandId === FINAL_TREASURE_ISLAND_ID); if (finalIslandConfig) { setIslandProgress({ [FINAL_TREASURE_ISLAND_ID]: 'unlocked'}); setIslandStarRatings({}); setOverallScore(0); setGameState('IslandMap'); playSound(FINAL_ISLAND_AMBIENT_SOUND_URL, 0.4); } else { setGameState('Error'); setLoadingError("Lỗi: Không tìm thấy cấu hình Đảo Kho Báu Cuối Cùng."); } };

  const handleStartEndlessMode = useCallback((grade: GradeLevel | null) => {
    if (!grade) { showToast("Vui lòng chọn một lớp để bắt đầu Chế Độ Vô Tận.", "warning"); return; }
    unlockAudioContext(); playSound(ENDLESS_MODE_START_SOUND_URL, 0.6);
    setCurrentEndlessGrade(grade); setEndlessModeLives(ENDLESS_MODE_LIVES); setEndlessModeScore(0);
    setEndlessQuestionsAnswered(0); setEndlessQuestionBatch([]); setCurrentEndlessQuestionIndex(0);
    setTransitionDetails({ message: ENDLESS_MODE_LOADING_TEXT, onComplete: fetchNextEndlessBatch });
    setGameState('Transitioning');
  }, [fetchNextEndlessBatch, playSound, unlockAudioContext, showToast]);

  const handleGoToShop = () => {
    playSound(BUTTON_CLICK_SOUND_URL);
    setGameState('Shop');
  };

  const handleBuyAccessory = (accessory: ThemeAccessory) => {
    if (playerGems >= accessory.price && !playerOwnedAccessories[accessory.id]) {
        setPlayerGems(prevGems => {
            const newGems = prevGems - accessory.price;
            savePlayerGems(newGems);
            return newGems;
        });
        setPlayerOwnedAccessories(prevOwned => {
            const newOwned = { ...prevOwned, [accessory.id]: true };
            savePlayerOwnedAccessoriesToStorage(newOwned);
            return newOwned;
        });
        playSound(GEM_COLLECT_SOUND_URL, 0.6); 
        showToast(`Bạn đã mua ${accessory.name}!`, 'success');
    } else if (playerOwnedAccessories[accessory.id]) {
        showToast(`Bạn đã sở hữu ${accessory.name} rồi!`, 'info');
    } else {
        showToast("Không đủ Đá Quý để mua vật phẩm này!", 'error');
        playSound(INCORRECT_ANSWER_SOUND_URL, 0.4);
    }
  };

  const handleToggleAccessoryCustomizationModal = () => {
    playSound(BUTTON_CLICK_SOUND_URL);
    setGameState('AccessoryCustomization');
  };

  const handleUpdateActiveAccessories = (updatedActiveAccessories: PlayerActiveAccessoriesState) => {
    setPlayerActiveAccessories(updatedActiveAccessories);
    savePlayerActiveAccessoriesToStorage(updatedActiveAccessories);
    window.dispatchEvent(new CustomEvent('activeAccessoriesUpdated'));
  };


  return (
    <>
      <ActiveBackgroundEffects
        playerActiveAccessories={playerActiveAccessories}
        currentTheme={theme}
        allAccessoriesDetails={SHOP_ACCESSORIES}
        triggerConfetti={triggerConfettiEffect}
        onConfettiComplete={() => setTriggerConfettiEffect(false)}
      />
      <CursorTrail
        playerActiveAccessories={playerActiveAccessories}
        currentTheme={theme}
        allAccessoriesDetails={SHOP_ACCESSORIES}
      />

      {gameState === 'StartScreen' && ( <div className="w-full h-full flex flex-col items-center justify-center text-center animate-fadeInScale p-4"> <div className="max-w-md sm:max-w-lg md:max-w-xl"> <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--title-text-gradient-from)] to-[var(--title-text-gradient-to)] mb-4 md:mb-6"> {GAME_TITLE_TEXT} </h1> <p className="text-md sm:text-lg md:text-xl text-[var(--primary-text)] opacity-90 mb-6 md:mb-10"> Chào mừng bạn đến với cuộc phiêu lưu toán học kỳ thú! Sẵn sàng khám phá những hòn đảo bí ẩn và giải các câu đố hóc búa chưa? </p> <button onClick={handleStartAdventure} onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)} className="bg-gradient-to-r from-[var(--button-primary-bg)] to-[var(--accent-color)] hover:opacity-90 active:brightness-90 text-[var(--button-primary-text)] font-bold py-3 sm:py-4 px-8 sm:px-10 rounded-xl shadow-xl text-lg sm:text-xl md:text-2xl transition-all transform hover:scale-105 active:scale-95"> {START_ADVENTURE_TEXT} </button> </div> </div> )}
      {gameState === 'ThemeSelection' && ( <ThemeSelectionScreen onThemeSelect={(selectedTheme) => { handleThemeChange(selectedTheme); const lastGrade = loadLastSelectedGrade(); if (lastGrade !== null) handleGradeSelect(lastGrade, true); else setGameState('GradeSelection'); }} /> )}
      {apiKeyMissing && gameState === 'Error' && loadingError === API_KEY_ERROR_MESSAGE && ( <div className="w-full h-full flex flex-col items-center justify-center text-center animate-fadeInScale p-4"> <div className="bg-[var(--incorrect-bg)] text-[var(--incorrect-text)] p-6 sm:p-8 rounded-lg shadow-xl max-w-md mx-auto"> <AlertTriangleIcon className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-[var(--accent-color)]" /> <h1 className="text-2xl sm:text-3xl font-bold mb-4">Lỗi Cấu Hình</h1> <p className="text-lg sm:text-xl mb-6">{API_KEY_ERROR_MESSAGE}</p> <button onClick={() => { unlockAudioContext(); playSound(BUTTON_CLICK_SOUND_URL); window.location.reload(); }} className="bg-[var(--button-primary-bg)] hover:opacity-80 active:brightness-90 text-[var(--button-primary-text)] font-bold py-3 px-6 rounded-lg text-base sm:text-lg"> Tải Lại Trang </button> </div> </div> )}
      {gameState === 'Transitioning' && transitionDetails && transitionDetails.message && ( <div className="flex flex-col items-center justify-center h-full min-h-[200px] sm:min-h-[300px]"> <LoadingSpinner text={transitionDetails.message} /> </div> )}
      {isIslandLoading && gameState !== 'IslandMap' && ( <div className="flex flex-col items-center justify-center h-full min-h-[200px] sm:min-h-[300px]"> <LoadingSpinner text={gameState === 'EndlessLoading' ? ENDLESS_MODE_LOADING_TEXT : (islandLoadingProgressMessage || ISLAND_PREPARING_MESSAGE(currentIslandConfig?.name || "..."))} /> </div> )}
      {gameState === 'Error' && ( <div className="w-full h-full flex flex-col items-center justify-center text-center animate-fadeInScale p-4"> <div className={`p-6 sm:p-8 rounded-lg shadow-xl max-w-md mx-auto bg-[var(--incorrect-bg)] text-[var(--incorrect-text)]`}> <AlertTriangleIcon className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-[var(--accent-color)]" /> <h1 className="text-2xl sm:text-3xl font-bold mb-4">Lỗi</h1> <p className="text-lg sm:text-xl mb-6">{loadingError || "Đã có lỗi xảy ra."}</p> <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4"> <button onClick={handleReturnToGradeSelection} className="bg-[var(--button-secondary-bg)] hover:opacity-80 active:brightness-90 text-[var(--button-secondary-text)] font-bold py-3 px-6 rounded-lg text-sm sm:text-base"> {RETURN_TO_GRADE_SELECTION_TEXT} </button> {loadingError !== NO_ISLANDS_FOR_GRADE_TEXT && loadingError !== API_KEY_ERROR_MESSAGE && ( <button onClick={handleRetryFetchIsland} className="bg-[var(--button-primary-bg)] hover:opacity-80 active:brightness-90 text-[var(--button-primary-text)] font-bold py-3 px-6 rounded-lg text-sm sm:text-base"> Thử Tải Lại </button> )} </div> </div> </div> )}
      
      {gameState === 'Shop' && (
        <ShopScreen
          playerGems={playerGems}
          accessories={SHOP_ACCESSORIES}
          ownedAccessories={playerOwnedAccessories}
          onBuyAccessory={handleBuyAccessory}
          onGoBack={() => { playSound(BUTTON_CLICK_SOUND_URL); setGameState('GradeSelection'); }}
          playSound={playSound}
        />
      )}
      
      {gameState === 'GradeSelection' && ( <> <div className="w-full h-full flex flex-col items-center justify-start animate-fadeInScale p-3 sm:p-4 md:p-6"> <div className="w-full max-w-lg md:max-w-xl mx-auto"> <div className="flex justify-between items-center mb-4 sm:mb-6"> <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--title-text-gradient-from)] to-[var(--title-text-gradient-to)] text-center flex-grow"> {CHOOSE_GRADE_TEXT} </h1> <div className="flex items-center gap-2 sm:gap-3"> <button onClick={handleGoToShop} onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)} className="p-2 sm:p-2.5 rounded-full bg-[var(--button-secondary-bg)] hover:opacity-90 active:brightness-90 shadow-md relative focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[var(--accent-color)]" aria-label="Cửa Hàng Phụ Kiện" > <ShoppingBagIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--accent-color)]" /> </button> <button onClick={handleToggleAccessoryCustomizationModal} onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)} className="p-2 sm:p-2.5 rounded-full bg-[var(--button-secondary-bg)] hover:opacity-90 active:brightness-90 shadow-md relative focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[var(--accent-color)]" aria-label={MANAGE_ACCESSORIES_BUTTON_TEXT} > <CogIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--accent-color)]" /> </button> <button onClick={handleToggleDailyChallengeModal} onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)} className="p-2 sm:p-2.5 rounded-full bg-[var(--button-secondary-bg)] hover:opacity-90 active:brightness-90 shadow-md relative focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[var(--accent-color)]" aria-label={DAILY_CHALLENGE_BUTTON_TEXT} > <CalendarCheckIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--accent-color)]" /> {((activeDailyChallenge && !activeDailyChallenge.isCompleted) || (activeWeeklyChallenge && !activeWeeklyChallenge.isCompleted)) && ( <span className="absolute top-0 right-0 block h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-red-500 ring-1 sm:ring-2 ring-white" /> )} {((activeDailyChallenge && activeDailyChallenge.isCompleted && !activeDailyChallenge.rewardClaimed) || (activeWeeklyChallenge && activeWeeklyChallenge.isCompleted && !activeWeeklyChallenge.rewardClaimed) ) && ( <span className="absolute top-0 right-0 block h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-green-500 ring-1 sm:ring-2 ring-white animate-pulse" /> )} </button> <button onClick={handleToggleAchievementsScreen} onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)} className="p-1.5 sm:p-2 rounded-full bg-[var(--button-secondary-bg)] hover:opacity-90 active:brightness-90 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-color)]" aria-label={VIEW_ACHIEVEMENTS_BUTTON_TEXT} > <img src={ACHIEVEMENT_BUTTON_ICON_URL} alt="Huy hiệu" className="w-6 h-6 sm:w-7 sm:h-7 animate-trophy-glow" /> </button> </div> </div> <div className="flex justify-center items-center mb-3 sm:mb-4 text-base sm:text-lg font-semibold text-[var(--primary-text)]"> <GemIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-1.5 sm:mr-2 text-yellow-400" /> {PLAYER_GEMS_TEXT}: {playerGems} </div> <div className="grid grid-cols-1 gap-3 sm:gap-4 mb-6 sm:mb-8"> {(Object.keys(GradeLevel).filter(key => !isNaN(Number(GradeLevel[key as keyof typeof GradeLevel])) && GradeLevel[key as keyof typeof GradeLevel] !== GradeLevel.FINAL) as (keyof typeof GradeLevel)[]).map((gradeKey) => { const gradeValue = GradeLevel[gradeKey]; return ( <button key={gradeValue} onClick={() => handleGradeSelect(gradeValue as GradeLevel)} onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)} className="p-3 sm:p-4 rounded-lg shadow-lg transition-transform transform hover:scale-105 active:scale-95 active:brightness-90 bg-[var(--button-primary-bg)] hover:opacity-90 text-[var(--button-primary-text)] font-bold text-xl sm:text-2xl"> {GRADE_LEVEL_TEXT_MAP[gradeValue as GradeLevel]} </button> ); })} {isFinalIslandUnlocked && ( <button onClick={handleAccessFinalIsland} onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)} className="mt-3 sm:mt-4 p-3 sm:p-4 rounded-lg shadow-lg transition-transform transform hover:scale-105 active:scale-95 active:brightness-90 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-white font-bold text-xl sm:text-2xl flex items-center justify-center gap-2 animate-pulse-glow" style={{ ['--island-button-ring-color' as any]: 'gold' }}> <KeyIcon className="w-7 h-7 sm:w-8 sm:h-8" /> {FINAL_ISLAND_ACCESS_BUTTON_TEXT} </button> )} </div> <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t-2 border-[var(--border-color)]"> <h2 className="text-xl sm:text-2xl font-bold text-[var(--primary-text)] mb-3 sm:mb-4 text-center">Chọn Giao Diện</h2> <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3"> {(Object.values(Theme).filter(t => t !== Theme.DEFAULT) as Theme[]).map(themeItem => ( <button key={themeItem} onClick={() => handleThemeChange(themeItem)} onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)} className={`p-2.5 sm:p-3 rounded-lg shadow-md transition-all transform hover:scale-105 active:scale-95 active:brightness-90 text-sm sm:text-lg font-semibold w-full flex items-center justify-center gap-1.5 sm:gap-2 border-2 ${theme === themeItem ? 'border-[var(--accent-color)] ring-2 sm:ring-4 ring-[var(--ring-color-focus)]' : 'border-transparent'} ${themeItem === Theme.NEON ? 'bg-[#0d1117] text-[#30c5ff]' : 'bg-[#fdf2f8] text-[#c026d3]'}`} > {themeItem === Theme.NEON ? <MoonIcon className="w-4 h-4 sm:w-5 sm:h-5"/> : <SunIcon className="w-4 h-4 sm:w-5 sm:h-5"/>} {THEME_CONFIGS[themeItem].name} {theme === themeItem && <CheckIcon className="w-4 h-4 sm:w-5 sm:h-5 ml-auto text-[var(--accent-color)]" />} </button> ))} </div> </div> </div> </div> </> )}
      {gameState === 'AccessoryCustomization' && (
        <AccessoryCustomizationModal
          isOpen={true}
          onClose={() => setGameState('GradeSelection')}
          ownedAccessories={playerOwnedAccessories}
          activeAccessories={playerActiveAccessories}
          onUpdateActiveAccessories={handleUpdateActiveAccessories}
          allThemes={THEME_CONFIGS}
          allAccessoriesDetails={SHOP_ACCESSORIES}
          playSound={playSound}
        />
      )}
      {(() => { 
        const islandForDifficultyModal = showDifficultySelectionModalForIslandId ? islandsForCurrentGrade.find(i => i.islandId === showDifficultySelectionModalForIslandId) : null;
        if (showDifficultySelectionModalForIslandId && islandForDifficultyModal) { return ( <DifficultySelectionModal isOpen={true} islandName={islandForDifficultyModal.name} onClose={() => { unlockAudioContext(); playSound(BUTTON_CLICK_SOUND_URL); setShowDifficultySelectionModalForIslandId(null); if (selectedGrade) setGameState('IslandMap'); else setGameState('GradeSelection'); }} onSelectDifficulty={handleDifficultySelected} /> ); }
        if (showTreasureModalForIslandId && selectedGrade) { const islandConfigForTreasure = islandsForCurrentGrade.find(i => i.islandId === showTreasureModalForIslandId); return ( <TreasureChestModal isOpen={true} islandName={islandConfigForTreasure?.name || "Bí Ẩn"} onClose={(pointsAwarded: number) => { playSound(BUTTON_CLICK_SOUND_URL); if (selectedGrade && showTreasureModalForIslandId) handleTreasureChestOpened(selectedGrade, showTreasureModalForIslandId, pointsAwarded); }} playSound={playSound} themeConfig={themeConfig} /> ); }
        if (showBottleModalForIslandId && currentBottleMessageContent) { const islandConfigForBottle = ISLAND_CONFIGS.find(i => i.islandId === showBottleModalForIslandId); return ( <MessageInBottleModal isOpen={true} islandName={islandConfigForBottle?.name || "Một hòn đảo"} message={currentBottleMessageContent} onClose={handleMessageBottleClosed} playSound={playSound} themeConfig={themeConfig} /> ); }
        if (showNPCModal && activeNPCData) { const islandConfigForNPC = ISLAND_CONFIGS.find(i => i.islandId === activeNPCData.islandId); return ( <FriendlyNPCModal isOpen={true} npcData={activeNPCData.npc} interactionContent={activeNPCData.interaction} islandName={islandConfigForNPC?.name || "Nơi bí ẩn"} onClose={handleNPCModalClose} playSound={playSound} themeConfig={themeConfig} onSubmitRiddle={handleNPCRiddleSubmit} riddleAnswerInput={npcRiddleAnswer} onRiddleAnswerChange={setNpcRiddleAnswer} riddlePhase={npcRiddlePhase} isRiddleCorrect={isNpcRiddleCorrect} /> ); }
        return null;
      })()}

      {gameState === 'IslandMap' && selectedGrade && ( <> <div className="w-full h-full flex flex-col animate-fadeInScale relative"> {shootingStar && shootingStar.visible && !shootingStar.clicked && ( <ShootingStar starData={shootingStar} onClick={() => handleShootingStarClick(shootingStar.id)} onDisappear={() => setShootingStar(prev => prev && prev.id === shootingStar.id ? null : prev)} emoji={SHOOTING_STAR_EMOJI} /> )} <div className="w-full h-full flex flex-col p-1 sm:p-2"> <div className="flex flex-col sm:flex-row justify-between items-center mb-3 sm:mb-4 gap-2"> <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--title-text-gradient-from)] to-[var(--title-text-gradient-to)] mb-1 sm:mb-0 text-center sm:text-left"> {selectedGrade === GradeLevel.FINAL ? FINAL_ISLAND_GRADE_TITLE : CHOOSE_ISLAND_TEXT} </h1> <div className="flex items-center justify-end flex-wrap gap-2 sm:gap-3"> <div className="flex items-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 rounded-full bg-[var(--secondary-bg)] shadow-md"> <GemIcon className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" /> <span className="text-xs sm:text-sm font-semibold text-[var(--primary-text)]">{playerGems}</span> </div> <button onClick={handleToggleDailyChallengeModal} onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)} className="p-2 sm:p-2.5 rounded-full bg-[var(--button-secondary-bg)] hover:opacity-90 active:brightness-90 shadow-md relative focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[var(--accent-color)]" aria-label={DAILY_CHALLENGE_BUTTON_TEXT} > <CalendarCheckIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--accent-color)]" /> {((activeDailyChallenge && !activeDailyChallenge.isCompleted) || (activeWeeklyChallenge && !activeWeeklyChallenge.isCompleted)) && ( <span className="absolute top-0 right-0 block h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-red-500 ring-1 sm:ring-2 ring-white" /> )} {((activeDailyChallenge && activeDailyChallenge.isCompleted && !activeDailyChallenge.rewardClaimed) || (activeWeeklyChallenge && activeWeeklyChallenge.isCompleted && !activeWeeklyChallenge.rewardClaimed) ) && ( <span className="absolute top-0 right-0 block h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-green-500 ring-1 sm:ring-2 ring-white animate-pulse" /> )} </button> <button onClick={handleChooseAnotherGrade} onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)} className="bg-[var(--button-secondary-bg)] hover:opacity-90 active:brightness-90 text-[var(--button-secondary-text)] font-semibold py-1.5 sm:py-2 px-2.5 sm:px-3 rounded-md sm:rounded-lg shadow-md text-xs sm:text-sm"> {CHOOSE_ANOTHER_GRADE_TEXT} </button> <button onClick={handleToggleAchievementsScreen} onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)} className="hover:opacity-90 active:brightness-90 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[var(--accent-color)] rounded-full p-0.5" aria-label={VIEW_ACHIEVEMENTS_BUTTON_TEXT} > <img src={ACHIEVEMENT_BUTTON_ICON_URL} alt="Huy hiệu" className="w-10 h-10 sm:w-12 sm:h-12 animate-trophy-glow" /> </button> </div> </div> {selectedGrade !== GradeLevel.FINAL && ( <div className="mb-3 sm:mb-4"> <div className="flex justify-between items-center text-xs sm:text-sm text-[var(--primary-text)] opacity-90 mb-0.5 sm:mb-1 px-1"> <span className="font-semibold">Tiến Độ Phiêu Lưu</span> <span className="font-semibold">{ (islandsForCurrentGrade.length > 0 ? (islandsForCurrentGrade.filter(island => islandProgress[island.islandId] === 'completed').length / islandsForCurrentGrade.length) * 100 : 0).toFixed(0) }%</span> </div> <div className="w-full bg-[var(--secondary-bg)] rounded-full h-2.5 sm:h-3 shadow-inner"> <div className="bg-[var(--accent-color)] h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${islandsForCurrentGrade.length > 0 ? (islandsForCurrentGrade.filter(island => islandProgress[island.islandId] === 'completed').length / islandsForCurrentGrade.length) * 100 : 0}%` }} ></div> </div> </div> )} <p className="text-center text-[var(--primary-text)] opacity-90 mb-2 sm:mb-3 text-lg sm:text-xl md:text-2xl"> {selectedGrade === GradeLevel.FINAL ? islandsForCurrentGrade[0]?.name : `Lớp: ${GRADE_LEVEL_TEXT_MAP[selectedGrade]}`} </p> <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 flex-grow overflow-y-auto py-1 sm:py-2"> {islandsForCurrentGrade.length === 0 && selectedGrade !== GradeLevel.FINAL ? (<p className="col-span-full text-center text-[var(--secondary-text)]">{NO_ISLANDS_FOR_GRADE_TEXT}</p>) : islandsForCurrentGrade.map((island) => { const status = islandProgress[island.islandId] || 'locked'; const isDisabled = status === 'locked'; let currentBgColor = 'bg-[var(--island-locked-bg)]'; let currentTextColor = 'text-[var(--island-locked-text)]'; if (status === 'completed') { currentBgColor = 'bg-[var(--island-completed-bg)]'; currentTextColor = 'text-[var(--island-completed-text)]'; } else if (status === 'unlocked') { currentBgColor = 'bg-[var(--island-unlocked-bg)]'; currentTextColor = 'text-[var(--island-unlocked-text)]'; } const isUnlockedAndNotCompleted = status === 'unlocked'; const hasTreasure = status === 'completed' && selectedGrade && activeTreasureChests[selectedGrade]?.[island.islandId]; const hasBottle = status === 'completed' && activeMessageBottle[island.islandId]; const hasNPC = (status === 'completed' || status === 'unlocked') && activeNPCData && activeNPCData.islandId === island.islandId && activeNPCData.grade === selectedGrade; const collectibleOnIsland = status === 'completed' && activeCollectible[island.islandId]; const collectibleIcon = collectibleOnIsland ? COLLECTIBLE_ITEMS.find(c => c.id === activeCollectible[island.islandId]?.collectibleId)?.icon : null; let topIcon = null; if (collectibleOnIsland && collectibleIcon) topIcon = collectibleIcon; else if (hasNPC && activeNPCData?.islandId === island.islandId) topIcon = <img src={activeNPCData.npc.imageUrl} alt={activeNPCData.npc.name} className="w-full h-full object-contain rounded-full" />; else if (hasTreasure) topIcon = TREASURE_CHEST_ICON_EMOJI; else if (hasBottle) topIcon = MESSAGE_IN_BOTTLE_ICON_EMOJI; const isFinalIslandButton = island.islandId === FINAL_TREASURE_ISLAND_ID; const pulseAnimation = isUnlockedAndNotCompleted || hasTreasure || hasBottle || hasNPC || collectibleOnIsland || isFinalIslandButton; let finalIslandSpecificStyles = isFinalIslandButton ? 'border-4 border-yellow-400 bg-gradient-to-br from-amber-400 via-orange-500 to-red-600 !text-white shadow-yellow-500/50 animate-pulse-glow' : ''; const ariaLabelParts = [island.name]; if (isDisabled) ariaLabelParts.push('(Đã khoá)'); if (collectibleOnIsland) ariaLabelParts.push(`(Có ${COLLECTIBLE_ITEMS.find(c=>c.id === activeCollectible[island.islandId]?.collectibleId)?.name || 'vật phẩm'})`); else if (hasNPC && activeNPCData?.islandId === island.islandId) ariaLabelParts.push(`(Có ${activeNPCData.npc.name}!)`); else if (hasTreasure) ariaLabelParts.push('(Có rương báu!)'); else if (hasBottle) ariaLabelParts.push('(Có thông điệp!)'); return ( <button key={island.islandId} onClick={() => !isDisabled && handleIslandSelect(island.islandId)} onMouseEnter={() => !isDisabled && playSound(HOVER_SOUND_URL, 0.2)} disabled={isDisabled} className={`p-3 sm:p-4 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 ${currentBgColor} ${currentTextColor} ${finalIslandSpecificStyles} min-h-[160px] sm:min-h-[180px] flex flex-col justify-between items-center text-center focus:outline-none focus:ring-4 ring-[var(--island-button-ring-color)] relative ${isDisabled ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90 active:scale-95 active:brightness-90'} ${pulseAnimation && !isFinalIslandButton ? 'animate-pulse-glow' : ''} ${(hasTreasure || hasBottle || hasNPC || collectibleOnIsland) && !isFinalIslandButton ? 'ring-4 ring-yellow-400 border-2 border-yellow-200' : ''} `} aria-label={ariaLabelParts.join(' ')} > {topIcon && ( <span className="absolute top-1 right-1 text-xl sm:text-2xl animate-bounce" style={{ filter: 'drop-shadow(0 0 3px gold)', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} > {topIcon} </span> )} <div className="flex-grow flex flex-col items-center justify-center"> <span className="text-2xl sm:text-3xl mb-1" aria-hidden="true">{island.mapIcon}</span> <h2 className="text-base sm:text-lg font-bold leading-tight">{island.name}</h2> <p className="text-xs sm:text-sm mt-1 px-1 opacity-90 line-clamp-2">{island.description}</p> </div> <div className="mt-1.5 sm:mt-2 h-5 sm:h-6"> {isDisabled && <LockIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--incorrect-bg)] opacity-70" />} {status === 'completed' && !topIcon ? <div className="animate-subtle-shine">{renderStars(island.islandId)}</div> : null} {((status === 'completed' || status === 'unlocked') && topIcon ) ? <div className="animate-subtle-shine">{renderStars(island.islandId)}</div> : null} {status === 'unlocked' && !topIcon ? <span className="text-xs opacity-80">(Chưa hoàn thành)</span> : null} </div> </button> ); })} </div> {selectedGrade !== GradeLevel.FINAL && ( <p className="text-center text-[var(--primary-text)] opacity-90 mt-3 sm:mt-4 text-xl sm:text-2xl font-bold">Tổng Điểm {GRADE_LEVEL_TEXT_MAP[selectedGrade]}: {overallScore}</p> )} {selectedGrade !== GradeLevel.FINAL && isEndlessUnlockedForGrade[selectedGrade] && ( <button onClick={() => handleStartEndlessMode(selectedGrade)} onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)} className="mt-4 sm:mt-6 w-full max-w-xs sm:max-w-sm mx-auto block bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg shadow-lg text-base sm:text-lg transition-transform transform hover:scale-105 flex items-center justify-center gap-2"> <PlayIcon className="w-5 h-5 sm:w-6 sm:h-6" /> {ENDLESS_MODE_BUTTON_TEXT} </button> )} </div> </div> </>)}
      {gameState === 'IslandComplete' && currentIslandConfig && selectedGrade && selectedIslandDifficulty && currentIslandId && ( <> {showCustomFireworks && <FireworksCanvas isActive={showCustomFireworks} playSound={playSound} audioUnlocked={audioUnlocked} />} <div className="w-full h-full flex flex-col items-center justify-center animate-fadeInScale p-4"> <div className={`text-center max-w-lg md:max-w-2xl mx-auto ${(selectedGrade === GradeLevel.FINAL && currentIslandId === FINAL_TREASURE_ISLAND_ID) ? 'bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-600 text-white' : 'bg-gradient-to-br from-[var(--correct-bg)] to-[var(--accent-color)] text-[var(--correct-text)]'} p-5 sm:p-6 md:p-8 rounded-xl relative z-10`}> {(() => { const starsAchievedForThisIsland = islandStarRatings[currentIslandId] || 0; const isPerfectRun = starsAchievedForThisIsland === 5; let specialCelebrationText = ""; if (isPerfectRun) { if (selectedIslandDifficulty === IslandDifficulty.HARD) specialCelebrationText = REWARD_TEXT_HARD_PERFECT; else if (selectedIslandDifficulty === IslandDifficulty.MEDIUM) specialCelebrationText = REWARD_TEXT_MEDIUM_PERFECT; } return specialCelebrationText && ( <div className="my-2 sm:my-3 flex items-center justify-center gap-2 animate-subtle-shine"> <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[var(--title-text-gradient-from)] drop-shadow-lg">{specialCelebrationText}</p> {isPerfectRun && <StarIconFilled className="w-10 h-10 sm:w-12 sm:h-12 text-[var(--title-text-gradient-from)] animate-pulse" style={{ animationDuration: '1s' }} />} </div> ); })()} <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-1 sm:mb-2">{(selectedGrade === GradeLevel.FINAL && currentIslandId === FINAL_TREASURE_ISLAND_ID) ? "CHIẾN THẮNG HUYỀN THOẠI!" : ISLAND_COMPLETE_TEXT}</h1> <p className="text-lg sm:text-xl md:text-2xl mb-1">{(selectedGrade === GradeLevel.FINAL && currentIslandId === FINAL_TREASURE_ISLAND_ID) ? FINAL_ISLAND_CONGRATS_MESSAGE : `${currentIslandConfig.name} (${ISLAND_DIFFICULTY_TEXT_MAP[selectedIslandDifficulty]})`}</p> <div className="flex justify-center my-1.5 sm:my-2 animate-subtle-shine"> {renderStars(currentIslandId)} </div> <p className="text-base sm:text-lg md:text-xl mb-1 sm:mb-2">{islandStarRatings[currentIslandId] === 5 && selectedIslandDifficulty === IslandDifficulty.EASY ? REWARD_TEXT_EASY_PERFECT : `Bạn đạt được: ${islandScore} điểm cho đảo này.`}</p> {!(selectedGrade === GradeLevel.FINAL && currentIslandId === FINAL_TREASURE_ISLAND_ID) && <p className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-4">Tổng điểm {GRADE_LEVEL_TEXT_MAP[selectedGrade]}: {overallScore}</p>} {(selectedGrade === GradeLevel.FINAL && currentIslandId === FINAL_TREASURE_ISLAND_ID) && <p className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-4">Bạn đã nhận được 1000 Đá Quý!</p>} <p className="text-base sm:text-lg md:text-xl mb-2 sm:mb-4">Bạn được thưởng +1 lượt thử! Hiện có: {playerLives}/{MAX_PLAYER_LIVES} lượt.</p> <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mt-4 sm:mt-6"> <button onClick={handleBackToMap} onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)} className="bg-[var(--button-secondary-bg)] hover:opacity-90 active:brightness-90 text-[var(--button-secondary-text)] font-bold py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg shadow-lg text-sm sm:text-base md:text-lg w-full sm:w-auto"> {BACK_TO_MAP_TEXT} </button> <button onClick={handlePlayIslandAgain} onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)} className="bg-[var(--button-primary-bg)] hover:opacity-90 active:brightness-90 text-[var(--button-primary-text)] font-bold py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg shadow-lg text-sm sm:text-base md:text-lg w-full sm:w-auto"> {PLAY_AGAIN_TEXT} </button> {(() => { const currentCompletedIslandIndex = islandsForCurrentGrade.findIndex(i => i.islandId === currentIslandId); const nextIsland = (currentCompletedIslandIndex !== -1 && currentCompletedIslandIndex < islandsForCurrentGrade.length - 1) ? islandsForCurrentGrade[currentCompletedIslandIndex + 1] : null; return (nextIsland && islandProgress[nextIsland.islandId] === 'unlocked' && !(selectedGrade === GradeLevel.FINAL && currentIslandId === FINAL_TREASURE_ISLAND_ID)) && ( <button onClick={() => { unlockAudioContext(); playSound(BUTTON_CLICK_SOUND_URL); handleIslandSelect(nextIsland.islandId); }} onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)} className="bg-[var(--button-primary-bg)] hover:opacity-90 active:brightness-90 text-[var(--button-primary-text)] font-bold py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg shadow-lg text-sm sm:text-base md:text-lg w-full sm:w-auto"> {NEXT_ISLAND_BUTTON_TEXT} </button> ); })()} </div> </div> </div> </> )}
      {gameState === 'GradeComplete' && selectedGrade && ( <> {showCustomFireworks && <FireworksCanvas isActive={showCustomFireworks} playSound={playSound} audioUnlocked={audioUnlocked}/>} <div className="w-full h-full flex flex-col items-center justify-center animate-fadeInScale p-4"> <div className={`text-center max-w-lg md:max-w-2xl mx-auto bg-gradient-to-r from-[var(--title-text-gradient-from)] via-[var(--accent-color)] to-[var(--title-text-gradient-to)] text-[var(--accent-text)] p-5 sm:p-6 md:p-8 rounded-xl relative z-10`}> <SparklesIcon className="w-16 h-16 sm:w-20 md:w-24 mx-auto mb-4 sm:mb-6 text-white animate-subtle-shine"/> <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4 animate-subtle-shine">{GRADE_COMPLETE_TEXT}</h1> <p className="text-lg sm:text-xl md:text-2xl mb-1 sm:mb-2">{GRADE_LEVEL_TEXT_MAP[selectedGrade]}</p> <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 sm:mb-8 drop-shadow-lg">{overallScore} <span className="text-xl sm:text-2xl md:text-3xl">điểm</span></p> <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4"> <button onClick={handlePlayThisGradeAgain} onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)} className="bg-[var(--correct-bg)] hover:opacity-90 active:brightness-90 text-[var(--correct-text)] font-bold py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg shadow-lg text-sm sm:text-base md:text-lg transition-transform transform hover:scale-105 w-full sm:w-auto"> {PLAY_THIS_GRADE_AGAIN_TEXT} </button> <button onClick={handleChooseAnotherGrade} onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)} className="bg-[var(--button-secondary-bg)] hover:opacity-90 active:brightness-90 text-[var(--button-secondary-text)] font-bold py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg shadow-lg text-sm sm:text-base md:text-lg transition-transform transform hover:scale-105 w-full sm:w-auto"> {CHOOSE_ANOTHER_GRADE_TEXT} </button> </div> {isEndlessUnlockedForGrade[selectedGrade] && ( <button onClick={() => handleStartEndlessMode(selectedGrade)} onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)} className="mt-4 sm:mt-6 w-full max-w-xs sm:max-w-sm mx-auto block bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg shadow-lg text-base sm:text-lg transition-transform transform hover:scale-105 flex items-center justify-center gap-2"> <PlayIcon className="w-5 h-5 sm:w-6 sm:h-6" /> {ENDLESS_MODE_BUTTON_TEXT} </button> )} </div> </div> </> )}
      {gameState === 'EndlessSummary' && currentEndlessGrade && ( <> {showCustomFireworks && <FireworksCanvas isActive={showCustomFireworks} playSound={playSound} audioUnlocked={audioUnlocked}/>} <div className="w-full h-full flex flex-col items-center justify-center animate-fadeInScale p-4"> <div className={`text-center max-w-md md:max-w-xl mx-auto bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-700 text-white p-5 sm:p-6 md:p-8 rounded-xl relative z-10`}> <TrophyIcon className="w-16 h-16 sm:w-20 mx-auto mb-3 sm:mb-4 animate-subtle-shine"/> <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3">{ENDLESS_MODE_SUMMARY_TITLE}</h1> <p className="text-base sm:text-lg md:text-xl mb-1">Lớp: {GRADE_LEVEL_TEXT_MAP[currentEndlessGrade]}</p> <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-1 sm:mb-2">{ENDLESS_MODE_SCORE_TEXT}: {endlessModeScore}</p> <p className="text-lg sm:text-xl md:text-2xl mb-4 sm:mb-6">{ENDLESS_MODE_QUESTIONS_ANSWERED_TEXT}: {endlessQuestionsAnswered}</p> <div className="flex flex-col sm:flex-row justify-center gap-2.5 sm:gap-3"> <button onClick={handleBackToMap} onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)} className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 sm:py-3 px-5 sm:px-6 rounded-lg shadow-lg text-sm sm:text-base w-full sm:w-auto"> {BACK_TO_MAP_TEXT} </button> <button onClick={() => handleStartEndlessMode(currentEndlessGrade)} onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)} className="bg-gradient-to-r from-orange-400 to-amber-500 hover:opacity-90 text-white font-bold py-2.5 sm:py-3 px-5 sm:px-6 rounded-lg shadow-lg text-sm sm:text-base w-full sm:w-auto"> {PLAY_AGAIN_ENDLESS_TEXT} </button> </div> </div> </div> </> )}
      {gameState === 'IslandPlaying' && currentQuestion && currentIslandConfig && selectedGrade && selectedIslandDifficulty && ( <> <div className={`w-full h-full flex flex-col animate-fadeInScale ${(currentIslandConfig.targetGradeLevel === GradeLevel.FINAL) ? FINAL_ISLAND_PLAYING_STYLE_CLASS : ''} p-1 sm:p-2`}> <header className={`w-full flex flex-col sm:flex-row justify-between items-center p-2 sm:p-3 mb-1 sm:mb-2 border-b-2 ${(currentIslandConfig.targetGradeLevel === GradeLevel.FINAL) ? 'border-yellow-400/30' : 'border-[var(--border-color)]'}`}> <div className="flex flex-col items-center sm:items-start mb-1 sm:mb-0"> <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[var(--title-text-gradient-from)] text-center sm:text-left">{(currentIslandConfig.targetGradeLevel === GradeLevel.FINAL) ? FINAL_ISLAND_GRADE_TITLE : `${currentIslandConfig.mapIcon} ${currentIslandConfig.name}`}</h1> <p className="text-sm sm:text-base text-[var(--primary-text)] opacity-80">{(currentIslandConfig.targetGradeLevel === GradeLevel.FINAL) ? FINAL_ISLAND_EPIC_DIFFICULTY_TEXT : ISLAND_DIFFICULTY_TEXT_MAP[selectedIslandDifficulty]}</p> </div> <div className="flex items-center gap-3"> <div className={`text-lg sm:text-xl md:text-2xl font-bold flex items-center ${playerLives <= 1 ? 'text-red-500 animate-pulse' : 'text-[var(--accent-color)]'}`}> {Array.from({ length: MAX_PLAYER_LIVES }).map((_, i) => ( i < playerLives ? <HeartIconFilled key={i} className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" /> : <HeartIconBroken key={i} className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 opacity-50" /> ))} </div> <button onClick={handleBackToMap} onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)} className="bg-[var(--button-secondary-bg)] hover:opacity-90 active:brightness-90 text-[var(--button-secondary-text)] font-semibold py-1.5 px-3 rounded-md text-xs sm:text-sm"> {StopIcon && <StopIcon className="w-4 h-4 mr-1 inline"/>}{BACK_TO_MAP_TEXT} </button> </div> </header> <div className="w-full bg-[var(--border-color)] rounded-full h-2 sm:h-2.5 mb-2 sm:mb-3"> <div className="bg-[var(--accent-color)] h-full rounded-full transition-all duration-300 ease-linear" style={{ width: `${ ( (currentIslandConfig.targetGradeLevel === GradeLevel.FINAL ? QUESTIONS_PER_FINAL_ISLAND : QUESTIONS_PER_ISLAND) > 0 ? ((currentQuestionIndexInIsland + 1) / (currentIslandConfig.targetGradeLevel === GradeLevel.FINAL ? QUESTIONS_PER_FINAL_ISLAND : QUESTIONS_PER_ISLAND)) * 100 : 0)}%` }} ></div> </div> { (currentIslandConfig.targetGradeLevel === GradeLevel.FINAL && isLoadingNextFinalIslandQuestion) ? (<div className="flex-grow flex flex-col items-center justify-center"> <LoadingSpinner text={FINAL_ISLAND_LOADING_NEXT_CHALLENGE_TEXT} /> </div>) : ( <> <div className="flex-grow flex flex-col justify-center"> <QuestionDisplay question={currentQuestion} /> </div> <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4 mb-2 sm:mb-3"> {currentQuestion.options.map((option, index) => ( <AnswerOption key={index} optionText={option} onClick={() => { setSelectedAnswer(option); playSound(ANSWER_SELECT_SOUND_URL, 0.4); }} disabled={userAttemptShown || (feedback.isCorrect === true || (playerLives === 0 && feedback.isCorrect === false && revealSolution))} isSelected={selectedAnswer === option} isCorrect={option === currentQuestion.correctAnswer} userAttemptShown={userAttemptShown} solutionRevealed={revealSolution} /> ))} </div> <FeedbackIndicator isCorrect={feedback.isCorrect} message={feedback.message} /> <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-1 sm:mt-2"> <button onClick={handleHintRequest} onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)} disabled={isHintModalOpen || hintButtonUsed || (feedback.isCorrect === true || (playerLives === 0 && feedback.isCorrect === false && revealSolution))} className={`flex-1 bg-[var(--button-secondary-bg)] text-[var(--button-secondary-text)] font-semibold py-2.5 sm:py-3 px-4 rounded-lg shadow-md flex items-center justify-center gap-2 text-sm sm:text-base transition-all duration-200 ${hintButtonUsed ? 'opacity-60 cursor-not-allowed' : 'hover:bg-opacity-80 active:scale-95'}`} > <LightbulbIcon className="w-4 h-4 sm:w-5 sm:h-5" /> Gợi Ý {hintButtonUsed && "(Đã dùng)"} </button> <button onClick={handleAnswerSubmit} onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)} disabled={!selectedAnswer || userAttemptShown || (feedback.isCorrect === true || (playerLives === 0 && feedback.isCorrect === false && revealSolution))} className={`flex-1 bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] font-bold py-2.5 sm:py-3 px-4 rounded-lg shadow-xl text-sm sm:text-base transition-all duration-200 ${(!selectedAnswer || userAttemptShown || (feedback.isCorrect === true || (playerLives === 0 && feedback.isCorrect === false && revealSolution))) ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-90 active:scale-95 active:brightness-90'}`} > {(feedback.isCorrect === true || (playerLives === 0 && feedback.isCorrect === false && revealSolution)) ? (feedback.isCorrect ? "Câu Tiếp Theo" : "Tiếp Tục") : "Kiểm Tra Đáp Án"} </button> </div> <HintModal isOpen={isHintModalOpen} onClose={() => setIsHintModalOpen(false)} hint={hint} isLoading={isHintLoading} /> </> )} </div> </> )}
      
      {!['StartScreen', 'ThemeSelection', 'GradeSelection', 'IslandMap', 'IslandPlaying', 'IslandComplete', 'GradeComplete', 'Transitioning', 'Error', 'Shop', 'AccessoryCustomization', 'EndlessSummary'].includes(gameState) &&
        !isIslandLoading && !apiKeyMissing && !(gameState === 'Transitioning' && transitionDetails) && (
        <div className="w-full h-full flex items-center justify-center text-center p-4">
          <LoadingSpinner text="Đang tải trò chơi..." />
        </div>
      )}

      {showAchievementsScreen && ( <AchievementsScreen achievedAchievements={achievedAchievements} onClose={handleToggleAchievementsScreen} playSound={playSound} currentGradeContext={selectedGrade} collectedItems={collectedItems} allCollectibles={COLLECTIBLE_ITEMS} /> )}
      {showDailyChallengeModal && ( <DailyChallengeModal isOpen={showDailyChallengeModal} dailyChallenge={activeDailyChallenge} weeklyChallenge={activeWeeklyChallenge} onClose={handleToggleDailyChallengeModal} onClaimDailyReward={handleClaimDailyChallengeReward} onClaimWeeklyReward={handleClaimWeeklyChallengeReward} playSound={playSound} timeUntilNextDailyRefresh={timeUntilNextDailyChallengeRefresh} timeUntilNextWeeklyRefresh={timeUntilNextWeeklyChallengeRefresh}/> )}
      <ToastNotification toast={currentToast} onDismiss={() => setCurrentToast(null)} />
    </>
  );
};

export default GameScreen;
