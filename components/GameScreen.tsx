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
    CHOOSE_ISLAND_TEXT, LOCKED_ISLAND_TEXT, ISLAND_PREPARING_MESSAGE, STARTING_ISLAND_TEXT,
    CHOOSE_ANOTHER_GRADE_TEXT, NO_ISLANDS_FOR_GRADE_TEXT, START_ADVENTURE_TEXT,
    TRAVELLING_TO_ISLAND_TEXT, UPDATING_MAP_TEXT, RETURN_TO_GRADE_SELECTION_TEXT, 
    REWARD_TEXT_EASY_PERFECT, REWARD_TEXT_MEDIUM_PERFECT, REWARD_TEXT_HARD_PERFECT,
    HOVER_SOUND_URL, GRADE_SELECT_SOUND_URL, ISLAND_SELECT_SOUND_URL, ANSWER_SELECT_SOUND_URL,
    CHECK_ANSWER_SOUND_URL, CORRECT_ANSWER_SOUND_URL, INCORRECT_ANSWER_SOUND_URL, VICTORY_FANFARE_SOUND_URL,
    BUTTON_CLICK_SOUND_URL, SELECTED_THEME_KEY, DEFAULT_THEME, ACHIEVED_ACHIEVEMENTS_KEY,
    ACHIEVEMENT_UNLOCKED_TOAST_TITLE, VIEW_ACHIEVEMENTS_BUTTON_TEXT, ACHIEVEMENT_UNLOCKED_SOUND_URL,
    ALL_GRADES_STAR_RATINGS_KEY, ACTIVE_TREASURE_CHESTS_KEY, TREASURE_CHEST_SPAWN_CHANCE, TREASURE_OPEN_SOUND_URL,
    TREASURE_SPARKLE_SOUND_URL, ACHIEVEMENT_BUTTON_ICON_URL,
    MESSAGE_IN_BOTTLE_SPAWN_CHANCE, MESSAGES_IN_BOTTLE, ACTIVE_MESSAGE_BOTTLE_KEY,
    BOTTLE_SPAWN_SOUND_URL, BOTTLE_OPEN_SOUND_URL, SHOOTING_STAR_SPAWN_INTERVAL_MIN_MS,
    SHOOTING_STAR_SPAWN_INTERVAL_MAX_MS, SHOOTING_STAR_ANIMATION_DURATION_MS, SHOOTING_STAR_REWARD_POINTS_MIN,
    SHOOTING_STAR_REWARD_POINTS_MAX, SHOOTING_STAR_CLICK_SUCCESS_MESSAGE, SHOOTING_STAR_APPEAR_SOUND_URL,
    SHOOTING_STAR_CLICK_SOUND_URL, SHOOTING_STAR_EMOJI, SHOOTING_STAR_BASE_SIZE_PX, SHOOTING_STAR_MAX_ACTIVE_MS,
    FRIENDLY_NPC_SPAWN_CHANCE, FRIENDLY_NPCS, NPC_INTERACTIONS, ACTIVE_FRIENDLY_NPC_KEY, NPC_SPAWN_SOUND_URL,
    NPC_INTERACTION_SOUND_URL, NPC_RIDDLE_SUCCESS_SOUND_URL, NPC_RIDDLE_FAIL_SOUND_URL, COLLECTIBLE_ITEMS,
    COLLECTIBLE_SPAWN_CHANCE, ACTIVE_COLLECTIBLE_KEY, COLLECTED_ITEMS_KEY, COLLECTIBLE_SPAWN_SOUND_URL,
    COLLECTIBLE_COLLECT_SOUND_URL, COLLECTIBLE_COLLECTION_TOAST_MESSAGE, TREASURE_CHEST_POINTS_MESSAGE,
    ENDLESS_MODE_LIVES, ENDLESS_QUESTIONS_BATCH_SIZE, ENDLESS_MODE_GRADE_COMPLETE_MESSAGE,
    ENDLESS_MODE_UNLOCKED_MESSAGE, FINAL_ISLAND_UNLOCK_MESSAGE,
    FINAL_ISLAND_ACCESS_BUTTON_TEXT, FINAL_ISLAND_GRADE_TITLE, ENDLESS_UNLOCKED_KEY_PREFIX, FINAL_ISLAND_UNLOCKED_KEY,
    ENDLESS_MODE_START_SOUND_URL, FINAL_ISLAND_UNLOCK_SOUND_URL, FINAL_ISLAND_AMBIENT_SOUND_URL, FINAL_TREASURE_ISLAND_ID,
    FINAL_ISLAND_INTRO_MESSAGE, FINAL_ISLAND_CONGRATS_MESSAGE, 
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
    MANAGE_ACCESSORIES_BUTTON_TEXT, ENDLESS_MODE_STARTING_DIFFICULTY, ENDLESS_MODE_STREAK_TO_CHANGE_DIFFICULTY, ENDLESS_MODE_MAX_DIFFICULTY, ENDLESS_MODE_MIN_DIFFICULTY
} from '../constants';
import { getMathHint, generateMathQuestionsForIslandSet, generateEndlessMathQuestions, delay as apiDelay } from '../services/geminiService';
import { 
    loadLastSelectedGrade, saveLastSelectedGrade, loadIslandProgressFromStorage, saveIslandProgressToStorage, loadOverallScoreFromStorage,
    saveOverallScoreToStorage, loadIslandStarRatingsFromStorage, saveIslandStarRatingsToStorage, loadAllGradesStarRatingsFromStorage,
    saveAllGradesStarRatingsToStorage, loadAchievedAchievementsFromStorage, saveAchievedAchievementsToStorage, loadActiveTreasureChestsFromStorage,
    saveActiveTreasureChestsToStorage, loadActiveMessageBottlesFromStorage, saveActiveMessageBottlesToStorage, loadActiveNPCFromStorage,
    saveActiveNPCToStorage, loadActiveCollectibleFromStorage, saveActiveCollectibleToStorage, loadCollectedItemsFromStorage,
    saveCollectedItemsToStorage, loadIsEndlessUnlockedForGrade, saveIsEndlessUnlockedForGrade, loadIsFinalIslandUnlocked,
    saveIsFinalIslandUnlocked, loadActiveDailyChallenge, saveActiveDailyChallenge, loadPlayerGems, savePlayerGems,
    loadCompletedDailyChallengesLog, saveCompletedDailyChallengesLog, loadActiveWeeklyChallenge, saveActiveWeeklyChallenge,
    loadCompletedWeeklyChallengesLog, saveCompletedWeeklyChallengesLog, loadPlayerOwnedAccessoriesFromStorage, savePlayerOwnedAccessoriesToStorage,
    loadPlayerActiveAccessoriesFromStorage, savePlayerActiveAccessoriesToStorage, loadTheme
} from '../utils/storage';
import HintModal from './HintModal';
import LoadingSpinner from './LoadingSpinner';
import DifficultySelectionModal from './DifficultySelectionModal';
import ThemeSelectionScreen from './ThemeSelectionScreen';
import AchievementsScreen from './AchievementsScreen';
import ToastNotification from './ToastNotification';
import TreasureChestModal from './TreasureChestModal';
import MessageInBottleModal from './MessageInBottleModal';
import FriendlyNPCModal from './FriendlyNPCModal';
import DailyChallengeModal from './DailyChallengeModal';
import ShopScreen from './ShopScreen';
import AccessoryCustomizationModal from './AccessoryCustomizationModal';
import ActiveBackgroundEffects from './ActiveBackgroundEffects';
import CursorTrail from './CursorTrail';
import { ALL_ACHIEVEMENTS } from '../achievements';
import {
    SparklesIcon, KeyIcon, GemIcon, CalendarCheckIcon, TrophyIcon, GiftIcon, CollectionIcon
} from './icons';
import { useTheme } from '../contexts/ThemeContext';
import { THEME_CONFIGS } from '../themes';
import { v4 as uuidv4 } from 'uuid';
import {
    StartScreen, GradeSelectionScreen, IslandMapScreen, IslandPlayingScreen,
    EndlessPlayingScreen, IslandCompleteScreen, GradeCompleteScreen, EndlessSummaryScreen,
    TransitionScreen, ErrorScreen, IslandLoadingScreen, ApiKeyErrorScreen
} from './GameScreens';


interface TransitionDetails {
  message: string;
  duration?: number;
  onComplete: () => void;
}

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
  const [endlessDifficultyLevel, setEndlessDifficultyLevel] = useState(ENDLESS_MODE_STARTING_DIFFICULTY);
  const [endlessCorrectStreak, setEndlessCorrectStreak] = useState(0);
  const [endlessIncorrectStreak, setEndlessIncorrectStreak] = useState(0);
  const [preloadedEndlessBatch, setPreloadedEndlessBatch] = useState<Question[]>([]);
  const [isPreloadingEndlessBatch, setIsPreloadingEndlessBatch] = useState(false);

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


  const islandsForCurrentGrade = useMemo(() => {
    if (!selectedGrade) return [];
    return ISLAND_CONFIGS.filter(island => island.targetGradeLevel === selectedGrade).sort((a, b) => a.islandNumber - b.islandNumber);
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
    const savedTheme = loadTheme();
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
    if (gameState === 'IslandComplete' || gameState === 'GradeComplete' || gameState === 'EndlessSummary') setShowCustomFireworks(true);
    else if (showCustomFireworks) setShowCustomFireworks(false);
  }, [gameState, showCustomFireworks]);


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
    setPreloadedQuestionsCache({}); setTransitionDetails(null); setThemeChangedForAchievement(false); setShowTreasureModalForIslandId(null); setShowBottleModalForIslandId(null); setActiveNPCData(null); saveActiveNPCToStorage(null); setActiveCollectible({}); saveActiveCollectibleToStorage({}); setCurrentEndlessGrade(null); setEndlessModeLives(ENDLESS_MODE_LIVES); setEndlessModeScore(0); setEndlessQuestionsAnswered(0); setEndlessQuestionBatch([]); setCurrentEndlessQuestionIndex(0); setPreloadedEndlessBatch([]); setIsPreloadingEndlessBatch(false);
    setEndlessDifficultyLevel(ENDLESS_MODE_STARTING_DIFFICULTY);
    setEndlessCorrectStreak(0);
    setEndlessIncorrectStreak(0);
    resetStreakChallengesIfNeeded(true);
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

    const questionsPerThisIsland = islandConfig.targetGradeLevel === GradeLevel.FINAL ? QUESTIONS_PER_FINAL_ISLAND : QUESTIONS_PER_ISLAND;
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
    const gradeIslands = ISLAND_CONFIGS.filter(island => island.targetGradeLevel === grade && island.targetGradeLevel !== GradeLevel.FINAL);
    if (gradeIslands.length > 0) {
      if (Object.keys(islandProgress).length === 0) { const initialProgressForGrade: IslandProgressState = {}; gradeIslands.forEach((island) => { initialProgressForGrade[island.islandId] = island.islandNumber === 1 ? 'unlocked' : 'locked'; }); setIslandProgress(initialProgressForGrade); saveIslandProgressToStorage(grade, initialProgressForGrade); setAllGradesProgress(prev => ({...prev, [grade]: initialProgressForGrade})); }
      setGameState('IslandMap'); trySpawnTreasureChests(grade); trySpawnMessageBottle(); trySpawnFriendlyNPC(); trySpawnCollectible();
      setTimeout(() => checkAndAwardAchievements(), 100);
    } else { setGameState('Error'); setLoadingError(NO_ISLANDS_FOR_GRADE_TEXT); }
  };

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
            if (islandConfig.targetGradeLevel === GradeLevel.FINAL) {
                playSound(FINAL_ISLAND_AMBIENT_SOUND_URL, 0.5);
                const finalDifficulty = IslandDifficulty.HARD;
                const introMessage = islandConfig.islandNumber === 6 ? "Chào mừng Huyền Thoại! Hãy đối mặt thử thách cuối cùng!" : TRAVELLING_TO_ISLAND_TEXT(islandConfig.name);
                setTransitionDetails({ message: introMessage, duration: 2000, onComplete: () => fetchAndSetQuestionsForIsland(islandId, finalDifficulty) });
                setGameState('Transitioning');
            } else {
                setShowDifficultySelectionModalForIslandId(islandId);
            }
        }
    } else { playSound(INCORRECT_ANSWER_SOUND_URL, 0.3); showToast(LOCKED_ISLAND_TEXT, 'warning'); }
  };

  const handleDifficultySelected = (difficulty: IslandDifficulty) => {
    unlockAudioContext(); playSound(BUTTON_CLICK_SOUND_URL); if (!currentIslandId) return;
    const islandConfigToLoad = islandsForCurrentGrade.find(i => i.islandId === currentIslandId);
    if (!islandConfigToLoad) { setGameState('Error'); setLoadingError("Lỗi: Không tìm thấy đảo để tải sau khi chọn độ khó."); setShowDifficultySelectionModalForIslandId(null); return; }
    setShowDifficultySelectionModalForIslandId(null);

    const questionsToExpect = QUESTIONS_PER_ISLAND;
    const cachedData = preloadedQuestionsCache[currentIslandId]?.[difficulty];

    if (Array.isArray(cachedData) && cachedData.length === questionsToExpect) { _fetchAndSetQuestionsForStandardIsland(currentIslandId, difficulty); }
    else { setTransitionDetails({ message: TRAVELLING_TO_ISLAND_TEXT(islandConfigToLoad.name), duration: 1800, onComplete: () => _fetchAndSetQuestionsForStandardIsland(currentIslandId, difficulty) }); setGameState('Transitioning'); }
  };

  const _fetchAndSetQuestionsForStandardIsland = useCallback(async (islandIdToLoad: string, difficulty: IslandDifficulty) => {
    if (apiKeyMissing || !selectedGrade) { return; }
    const islandConfig = islandsForCurrentGrade.find(i => i.islandId === islandIdToLoad);
    if (!islandConfig) { return; }

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

    const questionsToComplete = currentIslandConfig?.targetGradeLevel === GradeLevel.FINAL ? QUESTIONS_PER_FINAL_ISLAND : QUESTIONS_PER_ISLAND;
    const nextQuestionLocalIndex = currentQuestionIndexInIsland + 1;

    if (nextQuestionLocalIndex < questionsToComplete) {
        setCurrentQuestionIndexInIsland(nextQuestionLocalIndex); 
        resetForNewQuestion();
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
      
      if (selectedGrade === GradeLevel.FINAL) {
          const finalIslands = islandsForCurrentGrade;
          const mainFinalIslands = finalIslands.filter(i => i.islandNumber <= 5);
          const ultimateIsland = finalIslands.find(i => i.islandNumber === 6);
          const areAllMainFinalsComplete = mainFinalIslands.every(isl => updatedProgressForGrade[isl.islandId] === 'completed');

          if (ultimateIsland && areAllMainFinalsComplete && updatedProgressForGrade[ultimateIsland.islandId] === 'locked') {
              updatedProgressForGrade[ultimateIsland.islandId] = 'unlocked';
              playSound(FINAL_ISLAND_UNLOCK_SOUND_URL, 0.7);
              showToast("Một hòn đảo huyền thoại đã xuất hiện!", 'success', <KeyIcon className="w-7 h-7" />);
          }
      }

      setIslandProgress(updatedProgressForGrade); saveIslandProgressToStorage(selectedGrade, updatedProgressForGrade); setAllGradesProgress(prev => ({...prev, [selectedGrade]: updatedProgressForGrade}));

      updateDailyChallengeProgress(CHALLENGE_ACTION_ISLAND_COMPLETED); updateWeeklyChallengeProgress(CHALLENGE_ACTION_ISLAND_COMPLETED);
      if (starsEarned > 0) { updateDailyChallengeProgress(CHALLENGE_ACTION_STAR_EARNED, starsEarned); updateWeeklyChallengeProgress(CHALLENGE_ACTION_STAR_EARNED, starsEarned); }

      setTimeout(() => checkAndAwardAchievements({ difficulty: selectedIslandDifficulty, hintUsed: hintUsedThisIslandRun }), 100);

      if (completedIslandId === FINAL_TREASURE_ISLAND_ID) { playSound(VICTORY_FANFARE_SOUND_URL, 0.8); setGameState('IslandComplete'); setPlayerGems(prev => { const newGems = prev + 1000; savePlayerGems(newGems); return newGems; }); return; }

      const allIslandsForGradeCompleted = islandsForCurrentGrade.every(island => updatedProgressForGrade[island.islandId] === 'completed');
      if(allIslandsForGradeCompleted && selectedGrade !== GradeLevel.FINAL && islandsForCurrentGrade.length >= ISLANDS_PER_GRADE) {
          if(audioUnlocked) playSound(VICTORY_FANFARE_SOUND_URL, 0.7); setGameState('GradeComplete');
          const allNormalGrades = (Object.values(GradeLevel).filter(g => typeof g === 'number' && g !== GradeLevel.FINAL) as GradeLevel[]);
          const allNormalGradesCompleted = allNormalGrades.every(g => { const gradeIslands = ISLAND_CONFIGS.filter(i => i.targetGradeLevel === g); const gradeProg = allGradesProgress[g] || {}; return gradeIslands.length > 0 && gradeIslands.every(i => gradeProg[i.islandId] === 'completed'); });
          if (allNormalGradesCompleted && !isFinalIslandUnlocked) { playSound(FINAL_ISLAND_UNLOCK_SOUND_URL, 0.7); showToast(FINAL_ISLAND_UNLOCK_MESSAGE, 'success', <KeyIcon className="w-7 h-7" />); }
      } else { if (audioUnlocked) playSound(VICTORY_FANFARE_SOUND_URL, 0.6); setGameState('IslandComplete'); }
    }
  }, [currentQuestionIndexInIsland, resetForNewQuestion, currentIslandId, selectedIslandDifficulty, islandsForCurrentGrade, islandProgress, selectedGrade, playerLives, islandStarRatings, playSound, audioUnlocked, checkAndAwardAchievements, allGradesProgress, allGradesStarRatings, hintUsedThisIslandRun, isFinalIslandUnlocked, showToast, updateDailyChallengeProgress, updateWeeklyChallengeProgress, resetStreakChallengesIfNeeded, currentIslandConfig]);

  const fetchNextEndlessBatch = useCallback(async (gradeToFetch: GradeLevel) => {
    if (apiKeyMissing) { setLoadingError(API_KEY_ERROR_MESSAGE); setGameState('Error'); return; }
    setGameState('EndlessLoading'); setLoadingError(null);
    try {
      const questions = await generateEndlessMathQuestions(gradeToFetch, endlessDifficultyLevel);
      if (questions && questions.length > 0) {
        setEndlessQuestionBatch(questions);
        setCurrentEndlessQuestionIndex(0);
        resetForNewQuestion();
        setGameState('EndlessPlaying');
      } else {
        setLoadingError(ENDLESS_MODE_ERROR_TEXT);
        setGameState('Error');
      }
    } catch (error) {
      setLoadingError(ENDLESS_MODE_ERROR_TEXT);
      setGameState('Error');
    }
  }, [apiKeyMissing, resetForNewQuestion, endlessDifficultyLevel]);

  const preloadNextEndlessBatch = useCallback(async (gradeToFetch: GradeLevel) => {
    if (apiKeyMissing || isPreloadingEndlessBatch || preloadedEndlessBatch.length > 0) {
        return;
    }
    setIsPreloadingEndlessBatch(true);
    try {
        const questions = await generateEndlessMathQuestions(gradeToFetch, endlessDifficultyLevel);
        if (questions && questions.length > 0) {
            setPreloadedEndlessBatch(questions);
        }
    } catch (error) {
        console.warn("Background preloading for endless mode failed:", error);
        // Fail silently. The regular fetch will handle user-facing errors if needed.
    } finally {
        setIsPreloadingEndlessBatch(false);
    }
  }, [apiKeyMissing, isPreloadingEndlessBatch, preloadedEndlessBatch.length, endlessDifficultyLevel]);

  const handleNextEndlessQuestion = useCallback(() => {
    resetForNewQuestion();
    if (currentEndlessQuestionIndex < endlessQuestionBatch.length - 1) {
      setCurrentEndlessQuestionIndex(prev => prev + 1);
    } else {
      // End of batch. Check for preloaded questions.
      if (preloadedEndlessBatch.length > 0) {
        // Seamless transition
        setEndlessQuestionBatch(preloadedEndlessBatch);
        setPreloadedEndlessBatch([]);
        setCurrentEndlessQuestionIndex(0);
      } else if (currentEndlessGrade !== null) {
        // Fallback to fetching with loading screen
        fetchNextEndlessBatch(currentEndlessGrade);
      } else {
        console.error("Endless Mode: `currentEndlessGrade` is null when trying to fetch the next batch.");
        setLoadingError(ENDLESS_MODE_ERROR_TEXT);
        setGameState('Error');
      }
    }
  }, [currentEndlessQuestionIndex, endlessQuestionBatch.length, fetchNextEndlessBatch, resetForNewQuestion, currentEndlessGrade, preloadedEndlessBatch]);

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
        const pointsEarned = hintButtonUsed ? 2 : 5;

        switch (gameState) {
            case 'EndlessPlaying':
                setEndlessModeScore(prev => prev + pointsEarned);
                setEndlessQuestionsAnswered(prev => prev + 1);
                setEndlessIncorrectStreak(0);
                
                const newStreak = endlessCorrectStreak + 1;
                setEndlessCorrectStreak(newStreak);
                if (newStreak > 0 && newStreak % ENDLESS_MODE_STREAK_TO_CHANGE_DIFFICULTY === 0) {
                    setEndlessDifficultyLevel(prev => {
                        const newDifficulty = Math.min(prev + 1, ENDLESS_MODE_MAX_DIFFICULTY);
                        if (newDifficulty !== prev) {
                            setPreloadedEndlessBatch([]);
                        }
                        return newDifficulty;
                    });
                }

                // Preload on the 3rd question of a 5-question batch (index 2)
                if (currentEndlessQuestionIndex === 2 && currentEndlessGrade) {
                    preloadNextEndlessBatch(currentEndlessGrade);
                }

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
                setEndlessCorrectStreak(0);

                const newIncorrectStreak = endlessIncorrectStreak + 1;
                setEndlessIncorrectStreak(newIncorrectStreak);
                if (newIncorrectStreak > 0 && newIncorrectStreak % ENDLESS_MODE_STREAK_TO_CHANGE_DIFFICULTY === 0) {
                    setEndlessDifficultyLevel(prev => {
                        const newDifficulty = Math.max(prev - 1, ENDLESS_MODE_MIN_DIFFICULTY);
                        if (newDifficulty !== prev) {
                           setPreloadedEndlessBatch([]);
                        }
                        return newDifficulty;
                    });
                }
                
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
      setSelectedAnswer, setUserAttemptShown, setPlayerLives,
      currentEndlessQuestionIndex, currentEndlessGrade, preloadNextEndlessBatch,
      endlessCorrectStreak, endlessIncorrectStreak
    ]);


  const handleBackToMap = () => {
    unlockAudioContext(); playSound(BUTTON_CLICK_SOUND_URL); resetStreakChallengesIfNeeded(true);
    if (gameState === 'EndlessSummary' && currentEndlessGrade) { handleGradeSelect(currentEndlessGrade, true); return; }
    if (!selectedGrade) { handleChooseAnotherGrade(); return; }
    if (showTreasureModalForIslandId) setShowTreasureModalForIslandId(null); if (showBottleModalForIslandId) setShowBottleModalForIslandId(null); if (showNPCModal) setShowNPCModal(false);
    const allGradeIslandsCompleted = islandsForCurrentGrade.every(island => islandProgress[island.islandId] === 'completed');
    setCurrentIslandId(null); setSelectedIslandDifficulty(null); setQuestionsForCurrentIsland([]); setCurrentQuestionIndexInIsland(0); resetForNewQuestion();
    setTransitionDetails({ message: UPDATING_MAP_TEXT, duration: 1000, onComplete: () => {
        if (allGradeIslandsCompleted && selectedGrade !== GradeLevel.FINAL && islandsForCurrentGrade.length >= ISLANDS_PER_GRADE) setGameState('GradeComplete');
        else setGameState('IslandMap');
        if (selectedGrade) { trySpawnTreasureChests(selectedGrade); trySpawnMessageBottle(); trySpawnFriendlyNPC(); trySpawnCollectible(); }
    }});
    setGameState('Transitioning');
  };

  const handlePlayIslandAgain = () => {
    unlockAudioContext(); playSound(BUTTON_CLICK_SOUND_URL);
    if (currentIslandId && selectedGrade && selectedIslandDifficulty && currentIslandConfig) {
        resetForNewIslandPlay();
        const startMsg = STARTING_ISLAND_TEXT(currentIslandConfig.name, ISLAND_DIFFICULTY_TEXT_MAP[selectedIslandDifficulty]); 
        setTransitionDetails({ message: startMsg, duration: 700, onComplete: () => setGameState('IslandPlaying') }); 
        setGameState('Transitioning');
    } else { handleBackToMap(); }
  };

  const handlePlayThisGradeAgain = () => {
    unlockAudioContext(); playSound(BUTTON_CLICK_SOUND_URL);
    if (selectedGrade) {
      saveOverallScoreToStorage(selectedGrade, 0); const initialProgressForGrade: IslandProgressState = {};
      ISLAND_CONFIGS.filter(i => i.targetGradeLevel === selectedGrade && i.targetGradeLevel !== GradeLevel.FINAL).forEach(island => { initialProgressForGrade[island.islandId] = island.islandNumber === 1 ? 'unlocked' : 'locked'; });
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
    if (gameState === 'Error' && loadingError === ENDLESS_MODE_ERROR_TEXT && currentEndlessGrade !== null) {
      fetchNextEndlessBatch(currentEndlessGrade);
    } else if (currentIslandId && selectedGrade && selectedIslandDifficulty) {
      setPreloadedQuestionsCache(prev => ({ ...prev, [currentIslandId]: { ...(prev[currentIslandId] || {}), [selectedIslandDifficulty]: 'pending' } }));
      setTransitionDetails(null);
      setLoadingError(null);
      _fetchAndSetQuestionsForStandardIsland(currentIslandId, selectedIslandDifficulty);
    } else if (selectedGrade) {
        const firstUnlockedIslandForGrade = islandsForCurrentGrade.find(i => islandProgress[i.islandId] === 'unlocked');
        if (firstUnlockedIslandForGrade) {
            setCurrentIslandId(firstUnlockedIslandForGrade.islandId);
            setLoadingError(null);
            if(gameState === 'Error') {
                setGameState('IslandMap');
                setShowDifficultySelectionModalForIslandId(firstUnlockedIslandForGrade.islandId);
            } else {
                setShowDifficultySelectionModalForIslandId(firstUnlockedIslandForGrade.islandId);
            }
        } else {
            setLoadingError(null);
            setGameState(islandsForCurrentGrade.length > 0 ? 'IslandMap' : 'GradeSelection');
        }
    } else {
        setLoadingError(null);
        setGameState('GradeSelection');
    }
  };


  const handleHintRequest = useCallback(async () => {
    unlockAudioContext(); playSound(BUTTON_CLICK_SOUND_URL);
    if (!currentQuestion || apiKeyMissing) { setHint(apiKeyMissing ? API_KEY_ERROR_MESSAGE : HINT_UNAVAILABLE_MESSAGE); setIsHintModalOpen(true); return; }
    setIsHintLoading(true); setIsHintModalOpen(true); setHintButtonUsed(true);
    if (gameState !== 'EndlessPlaying') setHintUsedThisIslandRun(true);
    try { const fetchedHint = await getMathHint(currentQuestion.text, currentQuestion.targetGradeLevel); setHint(fetchedHint); }
    catch (error) { setHint(HINT_GENERATION_ERROR_MESSAGE); } finally { setIsHintLoading(false); }
  }, [currentQuestion, apiKeyMissing, playSound, unlockAudioContext, gameState]);
  
  const handleThemeChange = (newTheme: Theme) => { unlockAudioContext(); playSound(BUTTON_CLICK_SOUND_URL); applyNewTheme(newTheme); setThemeChangedForAchievement(true); setTimeout(() => checkAndAwardAchievements(), 100); };
  const handleToggleAchievementsScreen = () => { unlockAudioContext(); playSound(BUTTON_CLICK_SOUND_URL); setShowAchievementsScreen(prev => !prev); }
  const handleToggleDailyChallengeModal = () => { unlockAudioContext(); playSound(BUTTON_CLICK_SOUND_URL); setShowDailyChallengeModal(prev => !prev); }

  const handleAccessFinalIsland = () => {
    if (!isFinalIslandUnlocked) return;
    playSound(BUTTON_CLICK_SOUND_URL);
    resetForNewGradeJourney(GradeLevel.FINAL);
    setSelectedGrade(GradeLevel.FINAL);
    saveLastSelectedGrade(GradeLevel.FINAL);
    
    const finalIslands = ISLAND_CONFIGS.filter(i => i.targetGradeLevel === GradeLevel.FINAL);
    if (finalIslands.length > 0) {
        const savedProgress = loadIslandProgressFromStorage(GradeLevel.FINAL);
        let finalProgress: IslandProgressState;

        if (Object.keys(savedProgress).length > 0) {
            finalProgress = { ...savedProgress };
            const mainFinalIslands = finalIslands.filter(i => i.islandNumber <= 5);
            const ultimateIsland = finalIslands.find(i => i.islandNumber === 6);
            const areMainFinalsComplete = mainFinalIslands.every(isl => finalProgress[isl.islandId] === 'completed');

            if (ultimateIsland && areMainFinalsComplete && finalProgress[ultimateIsland.islandId] === 'locked') {
                finalProgress[ultimateIsland.islandId] = 'unlocked';
                saveIslandProgressToStorage(GradeLevel.FINAL, finalProgress);
            }
        } else {
            finalProgress = {};
            finalIslands.forEach(island => {
                finalProgress[island.islandId] = island.islandNumber === 1 ? 'unlocked' : 'locked';
            });
            saveIslandProgressToStorage(GradeLevel.FINAL, finalProgress);
        }

        setIslandProgress(finalProgress);
        setIslandStarRatings(loadIslandStarRatingsFromStorage(GradeLevel.FINAL));
        setOverallScore(0); 
        setGameState('IslandMap');
        playSound(FINAL_ISLAND_AMBIENT_SOUND_URL, 0.4);
    } else {
        setGameState('Error');
        setLoadingError("Lỗi: Không tìm thấy cấu hình cho Thử Thách Tối Thượng.");
    }
};

  const handleStartEndlessMode = useCallback((grade: GradeLevel | null) => {
    if (!grade) {
      showToast("Vui lòng chọn một lớp để chơi Vô Tận.", "warning");
      return;
    }
    unlockAudioContext();
    playSound(ENDLESS_MODE_START_SOUND_URL, 0.6);
    setCurrentEndlessGrade(grade);
    setEndlessModeLives(ENDLESS_MODE_LIVES);
    setEndlessModeScore(0);
    setEndlessQuestionsAnswered(0);
    setEndlessDifficultyLevel(ENDLESS_MODE_STARTING_DIFFICULTY);
    setEndlessCorrectStreak(0);
    setEndlessIncorrectStreak(0);
    setEndlessQuestionBatch([]);
    setPreloadedEndlessBatch([]);
    setIsPreloadingEndlessBatch(false);
    setCurrentEndlessQuestionIndex(0);
    const startFetch = () => fetchNextEndlessBatch(grade);
    setTransitionDetails({ message: ENDLESS_MODE_LOADING_TEXT, onComplete: startFetch });
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

  const renderContent = () => {
      if (apiKeyMissing) {
        return <ApiKeyErrorScreen onReload={() => window.location.reload()} />;
      }
      if (gameState === 'Transitioning' && transitionDetails) {
        return <TransitionScreen message={transitionDetails.message} />;
      }
      if (isIslandLoading && !['IslandMap', 'IslandPlaying', 'EndlessPlaying'].includes(gameState)) {
        const message = gameState === 'EndlessLoading' ? ENDLESS_MODE_LOADING_TEXT : (islandLoadingProgressMessage || ISLAND_PREPARING_MESSAGE(currentIslandConfig?.name || "..."));
        return <IslandLoadingScreen message={message} />;
      }

      switch (gameState) {
        case 'StartScreen':
          return <StartScreen onStartAdventure={handleStartAdventure} playSound={playSound} />;

        case 'ThemeSelection':
          return <ThemeSelectionScreen onThemeSelect={(selectedTheme) => { handleThemeChange(selectedTheme); const lastGrade = loadLastSelectedGrade(); if (lastGrade !== null) handleGradeSelect(lastGrade, true); else setGameState('GradeSelection'); }} />;

        case 'Shop':
          return <ShopScreen playerGems={playerGems} accessories={SHOP_ACCESSORIES} ownedAccessories={playerOwnedAccessories} onBuyAccessory={handleBuyAccessory} onGoBack={() => { playSound(BUTTON_CLICK_SOUND_URL); setGameState('GradeSelection'); }} playSound={playSound} />;
        
        case 'AccessoryCustomization':
            return <AccessoryCustomizationModal isOpen={true} onClose={() => setGameState('GradeSelection')} ownedAccessories={playerOwnedAccessories} activeAccessories={playerActiveAccessories} onUpdateActiveAccessories={handleUpdateActiveAccessories} allThemes={THEME_CONFIGS} allAccessoriesDetails={SHOP_ACCESSORIES} playSound={playSound} />;

        case 'GradeSelection':
          return <GradeSelectionScreen onGradeSelect={handleGradeSelect} onThemeChange={handleThemeChange} onToggleAchievementsScreen={handleToggleAchievementsScreen} onToggleDailyChallengeModal={handleToggleDailyChallengeModal} onAccessFinalIsland={handleAccessFinalIsland} onGoToShop={handleGoToShop} onToggleAccessoryCustomizationModal={handleToggleAccessoryCustomizationModal} playSound={playSound} theme={theme} isFinalIslandUnlocked={isFinalIslandUnlocked} playerGems={playerGems} activeDailyChallenge={activeDailyChallenge} activeWeeklyChallenge={activeWeeklyChallenge} />;
        
        case 'IslandMap':
            if (!selectedGrade) return <ErrorScreen loadingError="Lỗi: Chưa chọn lớp học." handleReturnToGradeSelection={handleReturnToGradeSelection} handleRetryFetchIsland={handleRetryFetchIsland} />;
            return <IslandMapScreen selectedGrade={selectedGrade} islandsForCurrentGrade={islandsForCurrentGrade} islandProgress={islandProgress} overallScore={overallScore} isEndlessUnlockedForGrade={isEndlessUnlockedForGrade[selectedGrade] || false} onIslandSelect={handleIslandSelect} onChooseAnotherGrade={handleChooseAnotherGrade} onToggleAchievementsScreen={handleToggleAchievementsScreen} onToggleDailyChallengeModal={handleToggleDailyChallengeModal} onStartEndlessMode={() => handleStartEndlessMode(selectedGrade)} playSound={playSound} islandStarRatings={islandStarRatings} activeTreasureChests={activeTreasureChests[selectedGrade] || {}} activeMessageBottle={activeMessageBottle} activeNPCData={activeNPCData} activeCollectible={activeCollectible} shootingStar={shootingStar} onShootingStarClick={handleShootingStarClick} setShootingStar={setShootingStar} playerGems={playerGems} activeDailyChallenge={activeDailyChallenge} activeWeeklyChallenge={activeWeeklyChallenge} />;
       
        case 'IslandPlaying':
            if (!currentQuestion || !currentIslandConfig || !selectedGrade || selectedIslandDifficulty === null) return <IslandLoadingScreen message="Đang tải câu hỏi..." />;
            return <IslandPlayingScreen currentQuestion={currentQuestion} currentIslandConfig={currentIslandConfig} selectedIslandDifficulty={selectedIslandDifficulty} playerLives={playerLives} selectedAnswer={selectedAnswer} userAttemptShown={userAttemptShown} feedback={feedback} revealSolution={revealSolution} currentQuestionIndexInIsland={currentQuestionIndexInIsland} isHintModalOpen={isHintModalOpen} hintButtonUsed={hintButtonUsed} onAnswerSelect={(answer) => { setSelectedAnswer(answer); playSound(ANSWER_SELECT_SOUND_URL, 0.4); }} onAnswerSubmit={handleAnswerSubmit} onHintRequest={handleHintRequest} onBackToMap={handleBackToMap} playSound={playSound} />;
      
        case 'EndlessPlaying':
             if (!currentQuestion || currentEndlessGrade === null) return <IslandLoadingScreen message="Đang tải câu hỏi Vô tận..." />;
             return <EndlessPlayingScreen currentQuestion={currentQuestion} currentEndlessGrade={currentEndlessGrade} endlessModeLives={endlessModeLives} endlessModeScore={endlessModeScore} endlessQuestionsAnswered={endlessQuestionsAnswered} selectedAnswer={selectedAnswer} userAttemptShown={userAttemptShown} feedback={feedback} revealSolution={revealSolution} isHintModalOpen={isHintModalOpen} hintButtonUsed={hintButtonUsed} endlessDifficultyLevel={endlessDifficultyLevel} onAnswerSelect={(answer) => { setSelectedAnswer(answer); playSound(ANSWER_SELECT_SOUND_URL, 0.4); }} onAnswerSubmit={handleAnswerSubmit} onHintRequest={handleHintRequest} onBackToMap={handleBackToMap} playSound={playSound} />;
        
        case 'IslandComplete':
            if (!currentIslandConfig || selectedGrade === null || selectedIslandDifficulty === null || currentIslandId === null) return <ErrorScreen loadingError="Lỗi khi hiển thị kết quả." handleReturnToGradeSelection={handleReturnToGradeSelection} handleRetryFetchIsland={handleRetryFetchIsland} />;
            return <IslandCompleteScreen currentIslandConfig={currentIslandConfig} selectedGrade={selectedGrade} selectedIslandDifficulty={selectedIslandDifficulty} islandScore={islandScore} overallScore={overallScore} playerLives={playerLives} islandStarRatings={islandStarRatings} onBackToMap={handleBackToMap} onPlayIslandAgain={handlePlayIslandAgain} onNextIsland={() => { const currentIndex = islandsForCurrentGrade.findIndex(i => i.islandId === currentIslandId); const nextIsland = islandsForCurrentGrade[currentIndex + 1]; if(nextIsland) handleIslandSelect(nextIsland.islandId); }} islandsForCurrentGrade={islandsForCurrentGrade} currentIslandId={currentIslandId} islandProgress={islandProgress} playSound={playSound} showCustomFireworks={showCustomFireworks} audioUnlocked={audioUnlocked} />;

        case 'GradeComplete':
             if (selectedGrade === null) return <ErrorScreen loadingError="Lỗi khi hiển thị kết quả." handleReturnToGradeSelection={handleReturnToGradeSelection} handleRetryFetchIsland={handleRetryFetchIsland} />;
             return <GradeCompleteScreen selectedGrade={selectedGrade} overallScore={overallScore} isEndlessUnlockedForGrade={isEndlessUnlockedForGrade[selectedGrade] || false} onPlayThisGradeAgain={handlePlayThisGradeAgain} onChooseAnotherGrade={handleChooseAnotherGrade} onStartEndlessMode={() => handleStartEndlessMode(selectedGrade)} playSound={playSound} showCustomFireworks={showCustomFireworks} audioUnlocked={audioUnlocked} />;

        case 'EndlessSummary':
             if (currentEndlessGrade === null) return <ErrorScreen loadingError="Lỗi khi hiển thị kết quả." handleReturnToGradeSelection={handleReturnToGradeSelection} handleRetryFetchIsland={handleRetryFetchIsland} />;
             return <EndlessSummaryScreen currentEndlessGrade={currentEndlessGrade} endlessModeScore={endlessModeScore} endlessQuestionsAnswered={endlessQuestionsAnswered} onBackToMap={handleBackToMap} onPlayAgain={() => handleStartEndlessMode(currentEndlessGrade)} playSound={playSound} showCustomFireworks={showCustomFireworks} audioUnlocked={audioUnlocked} />;
        
        case 'Error':
          return <ErrorScreen loadingError={loadingError} handleReturnToGradeSelection={handleReturnToGradeSelection} handleRetryFetchIsland={handleRetryFetchIsland} />;
        
        default:
          return <div className="w-full h-full flex items-center justify-center text-center p-4"><LoadingSpinner text="Đang tải trò chơi..." /></div>;
      }
  };

  return (
    <>
      <ActiveBackgroundEffects
        playerActiveAccessories={playerActiveAccessories}
        currentTheme={theme}
        allAccessoriesDetails={SHOP_ACCESSORIES}
      />
      <CursorTrail
        playerActiveAccessories={playerActiveAccessories}
        currentTheme={theme}
        allAccessoriesDetails={SHOP_ACCESSORIES}
      />
      
      {renderContent()}

      {(() => { 
        const islandForDifficultyModal = showDifficultySelectionModalForIslandId ? islandsForCurrentGrade.find(i => i.islandId === showDifficultySelectionModalForIslandId) : null;
        if (showDifficultySelectionModalForIslandId && islandForDifficultyModal) { return ( <DifficultySelectionModal isOpen={true} islandName={islandForDifficultyModal.name} onClose={() => { unlockAudioContext(); playSound(BUTTON_CLICK_SOUND_URL); setShowDifficultySelectionModalForIslandId(null); if (selectedGrade) setGameState('IslandMap'); else setGameState('GradeSelection'); }} onSelectDifficulty={handleDifficultySelected} /> ); }
        if (showTreasureModalForIslandId && selectedGrade) { const islandConfigForTreasure = islandsForCurrentGrade.find(i => i.islandId === showTreasureModalForIslandId); return ( <TreasureChestModal isOpen={true} islandName={islandConfigForTreasure?.name || "Bí Ẩn"} onClose={(pointsAwarded: number) => { playSound(BUTTON_CLICK_SOUND_URL); if (selectedGrade && showTreasureModalForIslandId) handleTreasureChestOpened(selectedGrade, showTreasureModalForIslandId, pointsAwarded); }} playSound={playSound} themeConfig={themeConfig} /> ); }
        if (showBottleModalForIslandId && currentBottleMessageContent) { const islandConfigForBottle = ISLAND_CONFIGS.find(i => i.islandId === showBottleModalForIslandId); return ( <MessageInBottleModal isOpen={true} islandName={islandConfigForBottle?.name || "Một hòn đảo"} message={currentBottleMessageContent} onClose={handleMessageBottleClosed} playSound={playSound} themeConfig={themeConfig} /> ); }
        if (showNPCModal && activeNPCData) { const islandConfigForNPC = ISLAND_CONFIGS.find(i => i.islandId === activeNPCData.islandId); return ( <FriendlyNPCModal isOpen={true} npcData={activeNPCData.npc} interactionContent={activeNPCData.interaction} islandName={islandConfigForNPC?.name || "Nơi bí ẩn"} onClose={handleNPCModalClose} playSound={playSound} themeConfig={themeConfig} onSubmitRiddle={handleNPCRiddleSubmit} riddleAnswerInput={npcRiddleAnswer} onRiddleAnswerChange={setNpcRiddleAnswer} riddlePhase={npcRiddlePhase} isRiddleCorrect={isNpcRiddleCorrect} /> ); }
        return null;
      })()}

       <HintModal isOpen={isHintModalOpen} onClose={() => setIsHintModalOpen(false)} hint={hint} isLoading={isHintLoading} />
      {showAchievementsScreen && ( <AchievementsScreen achievedAchievements={achievedAchievements} onClose={handleToggleAchievementsScreen} playSound={playSound} currentGradeContext={selectedGrade} collectedItems={collectedItems} allCollectibles={COLLECTIBLE_ITEMS} /> )}
      {showDailyChallengeModal && ( <DailyChallengeModal isOpen={showDailyChallengeModal} dailyChallenge={activeDailyChallenge} weeklyChallenge={activeWeeklyChallenge} onClose={handleToggleDailyChallengeModal} onClaimDailyReward={handleClaimDailyChallengeReward} onClaimWeeklyReward={handleClaimWeeklyChallengeReward} playSound={playSound} timeUntilNextDailyRefresh={timeUntilNextDailyChallengeRefresh} timeUntilNextWeeklyRefresh={timeUntilNextWeeklyChallengeRefresh}/> )}
      <ToastNotification toast={currentToast} onDismiss={() => setCurrentToast(null)} />
    </>
  );
};

export default GameScreen;