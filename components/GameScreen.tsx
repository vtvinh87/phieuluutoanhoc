
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Question, IslandConfig, IslandStatus, IslandProgressState, GradeLevel, IslandStarRatingsState, IslandDifficulty, PreloadedQuestionsCache, Theme, AchievedAchievementsState, AchievedAchievement, ToastMessage, AchievementId, AllGradesStarRatingsState, ActiveTreasureChestsState, GameState as AppGameState } from '../types'; // Renamed GameState to AppGameState
import { 
  MAX_PLAYER_LIVES,
  API_KEY_ERROR_MESSAGE,
  QUESTION_GENERATION_ERROR_MESSAGE,
  HINT_LOADING_MESSAGE,
  HINT_UNAVAILABLE_MESSAGE,
  ISLAND_CONFIGS,
  QUESTIONS_PER_ISLAND,
  ISLANDS_PER_GRADE,
  GRADE_LEVEL_TEXT_MAP,
  ISLAND_DIFFICULTY_TEXT_MAP,
  CHOOSE_GRADE_TEXT,
  CHOOSE_ISLAND_TEXT,
  ISLAND_TEXT,
  QUESTION_TEXT,
  SCORE_TEXT,
  BACK_TO_MAP_TEXT,
  ISLAND_COMPLETE_TEXT,
  GRADE_COMPLETE_TEXT, 
  LOCKED_ISLAND_TEXT,
  ISLAND_PREPARING_MESSAGE,
  STARTING_ISLAND_TEXT,
  PLAY_AGAIN_TEXT,
  CHOOSE_ANOTHER_GRADE_TEXT,
  PLAY_THIS_GRADE_AGAIN_TEXT,
  NO_ISLANDS_FOR_GRADE_TEXT,
  START_ADVENTURE_TEXT,
  TRAVELLING_TO_ISLAND_TEXT,
  UPDATING_MAP_TEXT,
  RETURN_TO_GRADE_SELECTION_TEXT,
  NEXT_ISLAND_BUTTON_TEXT,
  REWARD_TEXT_EASY_PERFECT,
  REWARD_TEXT_MEDIUM_PERFECT,
  REWARD_TEXT_HARD_PERFECT,
  ISLAND_STAR_RATINGS_KEY_PREFIX,
  LOCAL_STORAGE_PREFIX,
  LAST_SELECTED_GRADE_KEY,
  ISLAND_PROGRESS_KEY_PREFIX,
  OVERALL_SCORE_KEY_PREFIX,
  HOVER_SOUND_URL,
  GRADE_SELECT_SOUND_URL,
  ISLAND_SELECT_SOUND_URL,
  ANSWER_SELECT_SOUND_URL,
  CHECK_ANSWER_SOUND_URL,
  CORRECT_ANSWER_SOUND_URL,
  INCORRECT_ANSWER_SOUND_URL,
  VICTORY_FANFARE_SOUND_URL,
  BUTTON_CLICK_SOUND_URL,
  SELECTED_THEME_KEY,
  DEFAULT_THEME,
  ACHIEVED_ACHIEVEMENTS_KEY,
  ACHIEVEMENT_UNLOCKED_TOAST_TITLE,
  VIEW_ACHIEVEMENTS_BUTTON_TEXT,
  ACHIEVEMENT_UNLOCKED_SOUND_URL,
  ALL_GRADES_STAR_RATINGS_KEY,
  ACTIVE_TREASURE_CHESTS_KEY,
  TREASURE_CHEST_SPAWN_CHANCE,
  TREASURE_OPEN_SOUND_URL,
  TREASURE_SPARKLE_SOUND_URL,
  TREASURE_CHEST_ICON_EMOJI,
  ACHIEVEMENT_BUTTON_ICON_URL, // Import the new constant
} from '../constants';
import { getMathHint, generateMathQuestionsForIslandSet, delay as apiDelay } from '../services/geminiService';
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
import TreasureChestModal from './TreasureChestModal'; // New Modal
import { ALL_ACHIEVEMENTS } from '../achievements';
import { LightbulbIcon, SparklesIcon, AlertTriangleIcon, XCircleIcon as LockIcon, StarIconFilled, StarIconOutline, SunIcon, MoonIcon, CheckIcon, HeartIconFilled, HeartIconBroken, TrophyIcon, CollectionIcon, GiftIcon } from './icons'; 
import { useTheme } from '../contexts/ThemeContext';
import { THEME_CONFIGS } from '../themes';
import { v4 as uuidv4 } from 'uuid';


interface TransitionDetails {
  message: string;
  duration?: number;
  onComplete: () => void;
}

const GameScreen: React.FC = () => {
  const { theme, setTheme: applyNewTheme, themeConfig } = useTheme();

  const [gameState, setGameState] = useState<AppGameState>('ThemeSelection'); 
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
  const [hintUsedThisIslandRun, setHintUsedThisIslandRun] = useState(false); // For achievements

  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const [userAttemptShown, setUserAttemptShown] = useState(false);
  const [revealSolution, setRevealSolution] = useState(false);

  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const audioCache = useRef<Record<string, HTMLAudioElement>>({});

  const [preloadedQuestionsCache, setPreloadedQuestionsCache] = useState<PreloadedQuestionsCache>({});
  const [showCustomFireworks, setShowCustomFireworks] = useState(false);

  // Achievement System State
  const [achievedAchievements, setAchievedAchievements] = useState<AchievedAchievementsState>({});
  const [showAchievementsScreen, setShowAchievementsScreen] = useState(false);
  const [currentToast, setCurrentToast] = useState<ToastMessage | null>(null);
  
  const [allGradesProgress, setAllGradesProgress] = useState<Record<GradeLevel, IslandProgressState>>(() => {
    const initialProgress: Partial<Record<GradeLevel, IslandProgressState>> = {};
    (Object.values(GradeLevel).filter(g => typeof g === 'number') as GradeLevel[]).forEach(grade => {
        initialProgress[grade] = {};
    });
    return initialProgress as Record<GradeLevel, IslandProgressState>;
  });

  const [allGradesStarRatings, setAllGradesStarRatings] = useState<AllGradesStarRatingsState>(() => {
    return {
      [GradeLevel.GRADE_1]: {},
      [GradeLevel.GRADE_2]: {},
      [GradeLevel.GRADE_3]: {},
      [GradeLevel.GRADE_4]: {},
      [GradeLevel.GRADE_5]: {},
    };
  });
  const [themeChangedForAchievement, setThemeChangedForAchievement] = useState(false);

  // Treasure Chest State
  const [activeTreasureChests, setActiveTreasureChests] = useState<ActiveTreasureChestsState>({});
  const [showTreasureModalForIslandId, setShowTreasureModalForIslandId] = useState<string | null>(null);


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

    try {
      let audio = audioCache.current[soundUrl];
      if (!audio) {
        audio = new Audio(soundUrl);
        audio.volume = volume;
        audio.onerror = () => { delete audioCache.current[soundUrl]; };
        audioCache.current[soundUrl] = audio;
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
    } catch (error) {}
  }, [audioUnlocked, audioCache]);


  // --- LocalStorage Load/Save Functions ---
  const loadItem = <T,>(key: string, defaultValue: T): T => {
    const savedItem = localStorage.getItem(key);
    return savedItem ? JSON.parse(savedItem) : defaultValue;
  };
  const saveItem = <T,>(key: string, value: T) => {
    localStorage.setItem(key, JSON.stringify(value));
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
    const defaultValue: AllGradesStarRatingsState = {
      [GradeLevel.GRADE_1]: {},
      [GradeLevel.GRADE_2]: {},
      [GradeLevel.GRADE_3]: {},
      [GradeLevel.GRADE_4]: {},
      [GradeLevel.GRADE_5]: {},
    };
    return loadItem(ALL_GRADES_STAR_RATINGS_KEY, defaultValue);
  };
  const saveAllGradesStarRatingsToStorage = (ratings: AllGradesStarRatingsState) => saveItem(ALL_GRADES_STAR_RATINGS_KEY, ratings);
  const loadAchievedAchievementsFromStorage = (): AchievedAchievementsState => loadItem(ACHIEVED_ACHIEVEMENTS_KEY, {});
  const saveAchievedAchievementsToStorage = (achievements: AchievedAchievementsState) => saveItem(ACHIEVED_ACHIEVEMENTS_KEY, achievements);
  const loadActiveTreasureChestsFromStorage = (): ActiveTreasureChestsState => loadItem(ACTIVE_TREASURE_CHESTS_KEY, {});
  const saveActiveTreasureChestsToStorage = (chests: ActiveTreasureChestsState) => saveItem(ACTIVE_TREASURE_CHESTS_KEY, chests);

 useEffect(() => {
    const savedTheme = localStorage.getItem(SELECTED_THEME_KEY) as Theme | null;
    if (savedTheme && THEME_CONFIGS[savedTheme]) {
      applyNewTheme(savedTheme);
    } else {
      applyNewTheme(DEFAULT_THEME);
    }
    document.addEventListener('click', unlockAudioContext, { once: true });
    setAchievedAchievements(loadAchievedAchievementsFromStorage());
    setActiveTreasureChests(loadActiveTreasureChestsFromStorage());

    // Load progress & star ratings for all grades for global achievements
    const allProgressLoaded: Record<GradeLevel, IslandProgressState> = {} as Record<GradeLevel, IslandProgressState>;
    const allStarsLoaded: Partial<AllGradesStarRatingsState> = {}; // Keep as partial for building
    (Object.values(GradeLevel).filter(g => typeof g === 'number') as GradeLevel[]).forEach(grade => {
        allProgressLoaded[grade] = loadIslandProgressFromStorage(grade);
        const individualGradeStars = loadIslandStarRatingsFromStorage(grade);
        allStarsLoaded[grade] = individualGradeStars || {}; 
    });
    setAllGradesProgress(allProgressLoaded);
    setAllGradesStarRatings(allStarsLoaded as AllGradesStarRatingsState);


    return () => document.removeEventListener('click', unlockAudioContext);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unlockAudioContext, applyNewTheme]); 


  const islandsForCurrentGrade = useMemo(() => {
    if (!selectedGrade) return [];
    return ISLAND_CONFIGS
      .filter(island => island.targetGradeLevel === selectedGrade)
      .sort((a, b) => a.islandNumber - b.islandNumber);
  }, [selectedGrade]);

  useEffect(() => {
    if (gameState === 'Transitioning' && transitionDetails) {
      const timer = setTimeout(() => {
        const callback = transitionDetails.onComplete;
        setTransitionDetails(null); 
        callback();
      }, transitionDetails.duration || 1500);
      return () => clearTimeout(timer);
    }
  }, [gameState, transitionDetails]);

  useEffect(() => {
    if (gameState === 'IslandComplete' || gameState === 'GradeComplete') {
      // Intentionally empty or handle fireworks logic
    } else {
      if (showCustomFireworks) {
        setShowCustomFireworks(false);
      }
    }
  }, [gameState, showCustomFireworks]);


  const currentIslandConfig = currentIslandId ? islandsForCurrentGrade.find(island => island.islandId === currentIslandId) : null;
  const currentQuestion = questionsForCurrentIsland[currentQuestionIndexInIsland];

  const resetForNewQuestion = useCallback(() => {
    setSelectedAnswer(null);
    setFeedback({ isCorrect: null });
    setHint(null);
    setHintButtonUsed(false);
    setUserAttemptShown(false);
    setRevealSolution(false);
  }, []);
  
  const resetForNewIslandPlay = useCallback(() => {
    resetForNewQuestion();
    setCurrentQuestionIndexInIsland(0); 
    setPlayerLives(MAX_PLAYER_LIVES);
    setIslandScore(0);
    setHintUsedThisIslandRun(false); 
  }, [resetForNewQuestion]);

  const resetForNewGradeJourney = useCallback(() => {
    resetForNewIslandPlay(); 
    setQuestionsForCurrentIsland([]);
    setCurrentIslandId(null);
    setSelectedIslandDifficulty(null);
    setShowDifficultySelectionModalForIslandId(null);
    setLoadingError(null);
    setOverallScore(0); 
    setIslandProgress({}); 
    setIslandStarRatings({});
    setPreloadedQuestionsCache({}); 
    setTransitionDetails(null); 
    setThemeChangedForAchievement(false); 
    setShowTreasureModalForIslandId(null); // Reset treasure modal too
  }, [resetForNewIslandPlay]);


  const showToast = (message: string, type: ToastMessage['type'] = 'success', icon?: React.ReactNode) => {
    setCurrentToast({ id: uuidv4(), message, type, icon });
  };

  const awardAchievement = useCallback((achievementId: AchievementId) => {
    if (achievedAchievements[achievementId]) return; 

    const newAchievementEntry: AchievedAchievement = {
      id: achievementId,
      achievedAt: Date.now(),
      gradeContext: selectedGrade || undefined
    };
    
    const achievementDef = ALL_ACHIEVEMENTS.find(a => a.id === achievementId);
    if (achievementDef) {
      playSound(ACHIEVEMENT_UNLOCKED_SOUND_URL, 0.6);
      showToast(`${ACHIEVEMENT_UNLOCKED_TOAST_TITLE} ${achievementDef.name}`, 'success', <TrophyIcon className="w-7 h-7" />);
    }

    setAchievedAchievements(prev => {
      const updated = { ...prev, [achievementId]: newAchievementEntry };
      saveAchievedAchievementsToStorage(updated);
      return updated;
    });
  }, [achievedAchievements, selectedGrade, playSound]);

  const checkAndAwardAchievements = useCallback((
    islandCompletionContext?: { difficulty: IslandDifficulty | null; hintUsed: boolean }
  ) => {
    ALL_ACHIEVEMENTS.forEach(achievement => {
      if (achievedAchievements[achievement.id]) return; 

      const progressForCurrentGrade = selectedGrade ? islandProgress : {};
      const starsForCurrentGrade = selectedGrade ? islandStarRatings : {};
      
      const currentAllGradesProg = {...allGradesProgress};
      if(selectedGrade && islandProgress && Object.keys(islandProgress).length > 0) {
        currentAllGradesProg[selectedGrade] = islandProgress;
      }
      const currentAllGradesStars = {...allGradesStarRatings};
      if(selectedGrade && islandStarRatings && Object.keys(islandStarRatings).length > 0){
        currentAllGradesStars[selectedGrade] = islandStarRatings;
      }
      
      const conditionMet = achievement.condition ? achievement.condition(
        selectedGrade,
        progressForCurrentGrade,
        starsForCurrentGrade,
        islandsForCurrentGrade,
        overallScore,
        ISLAND_CONFIGS, 
        currentAllGradesProg, 
        themeChangedForAchievement,
        islandCompletionContext?.difficulty,
        islandCompletionContext?.hintUsed,
        currentAllGradesStars
      ) : false;

      if (conditionMet) {
        awardAchievement(achievement.id);
      }
    });
  }, [achievedAchievements, selectedGrade, islandProgress, islandStarRatings, islandsForCurrentGrade, overallScore, awardAchievement, allGradesProgress, allGradesStarRatings, themeChangedForAchievement]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
        checkAndAwardAchievements();
    }, 200); 
    return () => clearTimeout(timeoutId);
  }, [islandProgress, islandStarRatings, overallScore, selectedGrade, themeChangedForAchievement, allGradesProgress, allGradesStarRatings, checkAndAwardAchievements]);


  const _fetchAndProcessQuestionSet = useCallback(async (islandConfig: IslandConfig, difficulty: IslandDifficulty): Promise<Question[]> => {
    if (isIslandLoading && gameState !== 'IslandMap' && gameState !== 'IslandPlaying') {
         setIslandLoadingProgressMessage(ISLAND_PREPARING_MESSAGE(islandConfig.name));
    }
    
    const fetchedQuestionSet = await generateMathQuestionsForIslandSet(
        islandConfig.targetGradeLevel,
        islandConfig.topics,
        islandConfig.name,
        islandConfig.islandId,
        difficulty
    );

    if (fetchedQuestionSet && fetchedQuestionSet.length === QUESTIONS_PER_ISLAND) {
        return fetchedQuestionSet;
    } else {
        console.error(`_fetchAndProcessQuestionSet for ${islandConfig.name} (${difficulty}) resulted in an incomplete or null set from the service.`);
        throw new Error(QUESTION_GENERATION_ERROR_MESSAGE); 
    }
  }, [isIslandLoading, gameState]);


  const fetchAndSetQuestionsForIsland = useCallback(async (islandIdToLoad: string, difficulty: IslandDifficulty) => {
    if (apiKeyMissing || !selectedGrade) {
        setGameState('Error');
        setLoadingError(apiKeyMissing ? API_KEY_ERROR_MESSAGE : "Vui lòng chọn lớp trước.");
        setTransitionDetails(null);
        return;
    }

    const islandConfig = islandsForCurrentGrade.find(i => i.islandId === islandIdToLoad);
    if (!islandConfig) {
        setGameState('Error');
        setLoadingError("Không tìm thấy cấu hình cho hòn đảo này.");
        setTransitionDetails(null);
        return;
    }
    
    const cachedData = preloadedQuestionsCache[islandIdToLoad]?.[difficulty];

    if (Array.isArray(cachedData)) { 
        setQuestionsForCurrentIsland(cachedData);
        setCurrentIslandId(islandIdToLoad);
        setSelectedIslandDifficulty(difficulty);
        resetForNewIslandPlay();
        setTransitionDetails({
             message: STARTING_ISLAND_TEXT(islandConfig.name, ISLAND_DIFFICULTY_TEXT_MAP[difficulty]),
             duration: 700,
             onComplete: () => setGameState('IslandPlaying')
        });
        setGameState('Transitioning');
        return;
    }

    setIsIslandLoading(true);
    setLoadingError(null);
    setIslandLoadingProgressMessage(ISLAND_PREPARING_MESSAGE(islandConfig.name)); 
    setTransitionDetails(null); 

    try {
        const fetchedQuestions = await _fetchAndProcessQuestionSet(islandConfig, difficulty);
        
        setPreloadedQuestionsCache(prev => ({
            ...prev,
            [islandIdToLoad]: {
                ...(prev[islandIdToLoad] || {}),
                [difficulty]: fetchedQuestions
            }
        }));
        setQuestionsForCurrentIsland(fetchedQuestions);
        setCurrentIslandId(islandIdToLoad);
        setSelectedIslandDifficulty(difficulty);
        resetForNewIslandPlay();
        setGameState('IslandPlaying');

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : QUESTION_GENERATION_ERROR_MESSAGE;
        console.error(`Error in fetchAndSetQuestionsForIsland for ${islandConfig.name} (${difficulty}):`, errorMessage);
        setLoadingError(errorMessage); 
        setGameState('Error');
        setPreloadedQuestionsCache(prev => ({
            ...prev,
            [islandIdToLoad]: {
                ...(prev[islandIdToLoad] || {}),
                [difficulty]: 'error'
            }
        }));
    } finally {
        setIsIslandLoading(false);
    }
  }, [apiKeyMissing, selectedGrade, islandsForCurrentGrade, resetForNewIslandPlay, preloadedQuestionsCache, _fetchAndProcessQuestionSet]);


  const backgroundPreloadIslandDifficulty = useCallback(async (
    islandConfig: IslandConfig, 
    difficulty: IslandDifficulty,
    isNPlusOnePreloadContext: boolean = false 
  ) => {
    if (apiKeyMissing || !selectedGrade) return;

    const cacheKey = islandConfig.islandId;
    const currentCacheEntry = preloadedQuestionsCache[cacheKey]?.[difficulty];
    if (Array.isArray(currentCacheEntry) || currentCacheEntry === 'loading' || currentCacheEntry === 'error') {
        return; 
    }

    setPreloadedQuestionsCache(prev => ({
        ...prev,
        [cacheKey]: {
            ...(prev[cacheKey] || {}),
            [difficulty]: 'loading'
        }
    }));

    let attempts = 0;
    const maxAttempts = isNPlusOnePreloadContext ? 2 : 1; 

    while (attempts < maxAttempts) {
        try {
            if (attempts > 0 && isNPlusOnePreloadContext) { 
                await apiDelay(3000); 
            } else if (attempts === 0 && !isNPlusOnePreloadContext) {
                 await apiDelay(500); 
            }
            
            const fetchedQuestions = await _fetchAndProcessQuestionSet(islandConfig, difficulty);
            
            setPreloadedQuestionsCache(prev => ({
                ...prev,
                [cacheKey]: {
                    ...(prev[cacheKey] || {}),
                    [difficulty]: fetchedQuestions
                }
            }));
            return; 
        } catch (error) {
            attempts++;
            console.warn(`Background Preloading: ERROR (Attempt ${attempts}/${maxAttempts}) - ${islandConfig.name} (${difficulty}):`, error);
            if (attempts >= maxAttempts) {
                setPreloadedQuestionsCache(prev => ({
                    ...prev,
                    [cacheKey]: {
                        ...(prev[cacheKey] || {}),
                        [difficulty]: 'error'
                    }
                }));
                if (isNPlusOnePreloadContext) {
                    console.error(`N+1 Preload for ${islandConfig.name} (${difficulty}) FAILED after all attempts. No further automatic attempts for this set.`);
                } else {
                     console.warn(`Standard preload for ${islandConfig.name} (${difficulty}) FAILED.`);
                }
            }
        }
    }
  }, [apiKeyMissing, selectedGrade, preloadedQuestionsCache, _fetchAndProcessQuestionSet]);


  useEffect(() => {
    if (gameState === 'IslandPlaying' && currentIslandId && selectedGrade && islandsForCurrentGrade.length > 0 && selectedIslandDifficulty) {
      const currentIndexInGrade = islandsForCurrentGrade.findIndex(island => island.islandId === currentIslandId);
      
      if (currentIndexInGrade !== -1 && currentIndexInGrade < islandsForCurrentGrade.length - 1) {
        const nextIslandConfig = islandsForCurrentGrade[currentIndexInGrade + 1];
        
        const timeoutId = setTimeout(() => {
          const cacheEntryForNextIslandSameDifficulty = preloadedQuestionsCache[nextIslandConfig.islandId]?.[selectedIslandDifficulty];
          
          if (!cacheEntryForNextIslandSameDifficulty || cacheEntryForNextIslandSameDifficulty === 'pending') {
            backgroundPreloadIslandDifficulty(nextIslandConfig, selectedIslandDifficulty, true) 
              .catch(err => console.error(`Error in N+1 preload (same difficulty: ${selectedIslandDifficulty}) for ${nextIslandConfig.name}:`, err));
          }
        }, 2000); 

        return () => clearTimeout(timeoutId); 
      }
    }
  }, [
    gameState, 
    currentIslandId, 
    selectedGrade, 
    islandsForCurrentGrade, 
    selectedIslandDifficulty,
    preloadedQuestionsCache, 
    backgroundPreloadIslandDifficulty
  ]);

  // Treasure Chest Logic
  const trySpawnTreasureChests = useCallback((grade: GradeLevel) => {
    const completedIslandsInGrade = islandsForCurrentGrade.filter(
      (island) => islandProgress[island.islandId] === 'completed'
    );

    if (completedIslandsInGrade.length === 0) return;

    setActiveTreasureChests(prevChests => {
        let updatedGradeChests = { ...(prevChests[grade] || {}) };
        let chestSpawnedThisTime = false;

        // Only allow one active chest per grade at a time for simplicity
        const existingChestInGrade = Object.keys(updatedGradeChests).find(islandId => updatedGradeChests[islandId]);
        if (existingChestInGrade) {
            return prevChests; // Do nothing if a chest already exists in this grade
        }

        completedIslandsInGrade.forEach(island => {
            if (!chestSpawnedThisTime && Math.random() < TREASURE_CHEST_SPAWN_CHANCE) {
                updatedGradeChests[island.islandId] = true;
                chestSpawnedThisTime = true;
                playSound(TREASURE_SPARKLE_SOUND_URL, 0.3);
            }
        });
        
        if (chestSpawnedThisTime) {
            const newChestsState = { ...prevChests, [grade]: updatedGradeChests };
            saveActiveTreasureChestsToStorage(newChestsState);
            return newChestsState;
        }
        return prevChests; // No changes
    });
  }, [islandsForCurrentGrade, islandProgress, playSound]);

  const handleTreasureChestOpened = useCallback((grade: GradeLevel, islandId: string, pointsAwarded: number) => {
    if (pointsAwarded > 0) {
        const newOverallScore = overallScore + pointsAwarded;
        setOverallScore(newOverallScore);
        saveOverallScoreToStorage(grade, newOverallScore);
        showToast(pointsAwarded > 0 ? `Bạn nhận được ${pointsAwarded} điểm từ rương báu!` : "Tiếc quá, rương này không có điểm!", 'info', <GiftIcon className="w-6 h-6"/>);
    }
    
    setActiveTreasureChests(prevChests => {
        const updatedGradeChests = { ...(prevChests[grade] || {}) };
        delete updatedGradeChests[islandId]; // Remove chest from this island
        const newChestsState = { ...prevChests, [grade]: updatedGradeChests };
        saveActiveTreasureChestsToStorage(newChestsState);
        return newChestsState;
    });
    setShowTreasureModalForIslandId(null);
    setGameState('IslandMap'); // Return to map after closing treasure modal
  }, [overallScore, playSound]);


  const handleGradeSelect = (grade: GradeLevel, isAutoLoading = false) => {
    if (!isAutoLoading) { 
        unlockAudioContext(); 
        playSound(GRADE_SELECT_SOUND_URL, 0.7);
    }
    resetForNewGradeJourney(); 
    setSelectedGrade(grade);
    saveLastSelectedGrade(grade); 

    const gradeIslands = ISLAND_CONFIGS
        .filter(island => island.targetGradeLevel === grade)
        .sort((a,b) => a.islandNumber - b.islandNumber);

    if (gradeIslands.length > 0) {
      const savedProgress = loadIslandProgressFromStorage(grade);
      const savedScore = loadOverallScoreFromStorage(grade);
      const savedStarRatings = loadIslandStarRatingsFromStorage(grade);

      if (Object.keys(savedProgress).length > 0) {
        setIslandProgress(savedProgress);
      } else {
        const initialProgress: IslandProgressState = {};
        gradeIslands.forEach((island) => {
          initialProgress[island.islandId] = island.islandNumber === 1 ? 'unlocked' : 'locked';
        });
        setIslandProgress(initialProgress);
        saveIslandProgressToStorage(grade, initialProgress); 
      }

      setOverallScore(savedScore); 
      setIslandStarRatings(savedStarRatings);
      
      setGameState('IslandMap'); 
      trySpawnTreasureChests(grade); // Attempt to spawn chests when entering map
      setTimeout(() => checkAndAwardAchievements(), 100);
      
    } else {
      setGameState('Error');
      setLoadingError(NO_ISLANDS_FOR_GRADE_TEXT);
    }
  };

  const handleIslandSelect = (islandId: string) => {
    unlockAudioContext(); 
    const status = islandProgress[islandId];
    const islandConfig = islandsForCurrentGrade.find(i => i.islandId === islandId);

    if (islandConfig && (status === 'unlocked' || status === 'completed')) {
        playSound(ISLAND_SELECT_SOUND_URL, 0.6);

        // Check for active treasure chest on completed island
        if (status === 'completed' && selectedGrade && activeTreasureChests[selectedGrade]?.[islandId]) {
            playSound(TREASURE_OPEN_SOUND_URL, 0.7);
            setShowTreasureModalForIslandId(islandId);
            // Game state will be handled by TreasureChestModal or its closing logic
            return;
        }
        
        setCurrentIslandId(islandId); 
        setShowDifficultySelectionModalForIslandId(islandId);
    } else {
        playSound(INCORRECT_ANSWER_SOUND_URL, 0.3);
        alert(LOCKED_ISLAND_TEXT); 
    }
  };

  const handleDifficultySelected = (difficulty: IslandDifficulty) => {
    unlockAudioContext();
    playSound(BUTTON_CLICK_SOUND_URL);
    if (!currentIslandId) return; 
    
    const islandConfigToLoad = islandsForCurrentGrade.find(i => i.islandId === currentIslandId);
    if (!islandConfigToLoad) {
        setGameState('Error');
        setLoadingError("Lỗi: Không tìm thấy đảo để tải sau khi chọn độ khó.");
        setShowDifficultySelectionModalForIslandId(null);
        return;
    }

    setShowDifficultySelectionModalForIslandId(null); 
    
    const cachedData = preloadedQuestionsCache[currentIslandId]?.[difficulty];
    if (Array.isArray(cachedData) && cachedData.length === QUESTIONS_PER_ISLAND) { 
        fetchAndSetQuestionsForIsland(currentIslandId, difficulty); 
    } else {
        setTransitionDetails({
            message: TRAVELLING_TO_ISLAND_TEXT(islandConfigToLoad.name),
            duration: 1800, 
            onComplete: () => fetchAndSetQuestionsForIsland(currentIslandId, difficulty)
        });
        setGameState('Transitioning');
    }
  };


  const handleNextQuestionInIsland = useCallback(() => {
    if (!selectedGrade || !currentIslandId || !selectedIslandDifficulty) return; 

    if (currentQuestionIndexInIsland < questionsForCurrentIsland.length - 1) {
      resetForNewQuestion(); 
      setCurrentQuestionIndexInIsland(prev => prev + 1);
    } else { 
      const completedIslandId = currentIslandId;
      let starsEarned = 0; 
      
      const livesAtCompletion = playerLives; 

      if (livesAtCompletion === MAX_PLAYER_LIVES) starsEarned = 5;
      else if (livesAtCompletion === MAX_PLAYER_LIVES - 1) starsEarned = 4;
      else if (livesAtCompletion === MAX_PLAYER_LIVES - 2 && livesAtCompletion > 0) starsEarned = 3; 
      else if (livesAtCompletion === 0) starsEarned = 2; // Should be 1 star if completed with 0 lives. Let's make it 2 for some reward.
      else starsEarned = 3; 


      const updatedStarRatingsForGrade = { ...islandStarRatings, [completedIslandId]: Math.max(islandStarRatings[completedIslandId] || 0, starsEarned) }; 
      setIslandStarRatings(updatedStarRatingsForGrade);
      saveIslandStarRatingsToStorage(selectedGrade, updatedStarRatingsForGrade);
      
      setAllGradesStarRatings(prev => {
        const updatedAllStars = {
            ...prev,
            [selectedGrade]: updatedStarRatingsForGrade
        };
        saveAllGradesStarRatingsToStorage(updatedAllStars);
        return updatedAllStars;
      });


      setPlayerLives(prevLives => Math.min(prevLives + 1, MAX_PLAYER_LIVES)); 
      
      const updatedProgressForGrade = { ...islandProgress, [completedIslandId]: 'completed' as IslandStatus };
      
      const currentIslandInGradeIndex = islandsForCurrentGrade.findIndex(i => i.islandId === completedIslandId);
      if (currentIslandInGradeIndex !== -1 && currentIslandInGradeIndex < islandsForCurrentGrade.length - 1) {
        const nextIslandInGrade = islandsForCurrentGrade[currentIslandInGradeIndex + 1];
        if (nextIslandInGrade && updatedProgressForGrade[nextIslandInGrade.islandId] === 'locked') { 
            updatedProgressForGrade[nextIslandInGrade.islandId] = 'unlocked';
        }
      }
      setIslandProgress(updatedProgressForGrade);
      saveIslandProgressToStorage(selectedGrade, updatedProgressForGrade); 
      
      setAllGradesProgress(prev => ({...prev, [selectedGrade]: updatedProgressForGrade}));

      setTimeout(() => checkAndAwardAchievements({ difficulty: selectedIslandDifficulty, hintUsed: hintUsedThisIslandRun }), 100);

      const allIslandsForGradeCompleted = islandsForCurrentGrade.every(island => updatedProgressForGrade[island.islandId] === 'completed');
      
      if(allIslandsForGradeCompleted && islandsForCurrentGrade.length >= ISLANDS_PER_GRADE) {
          if(audioUnlocked) playSound(VICTORY_FANFARE_SOUND_URL, 0.7); 
          setShowCustomFireworks(true); 
          setGameState('GradeComplete');
      } else {
          if (audioUnlocked) playSound(VICTORY_FANFARE_SOUND_URL, 0.6);
          setShowCustomFireworks(true); 
          setGameState('IslandComplete'); 
      }
    }
  }, [currentQuestionIndexInIsland, questionsForCurrentIsland.length, resetForNewQuestion, currentIslandId, selectedIslandDifficulty, islandsForCurrentGrade, islandProgress, selectedGrade, playerLives, islandStarRatings, playSound, audioUnlocked, checkAndAwardAchievements, allGradesProgress, allGradesStarRatings, hintUsedThisIslandRun]);

  const handleAnswerSubmit = useCallback(() => {
    unlockAudioContext();
    if (!selectedAnswer || !currentQuestion || !selectedGrade) return;
    playSound(CHECK_ANSWER_SOUND_URL, 0.6);
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    setUserAttemptShown(true); 

    if (isCorrect) {
      playSound(CORRECT_ANSWER_SOUND_URL, 0.5);
      setFeedback({ isCorrect: true, message: "Chính xác! Tuyệt vời!" });
      setRevealSolution(true); 
      const pointsEarned = hintButtonUsed ? 2 : 5; 
      const newOverallScore = overallScore + pointsEarned;
      setOverallScore(newOverallScore);
      saveOverallScoreToStorage(selectedGrade, newOverallScore); 
      setIslandScore(prevIslandScore => prevIslandScore + pointsEarned);
      setTimeout(() => {
        handleNextQuestionInIsland(); 
      }, 1500);
    } else {
      playSound(INCORRECT_ANSWER_SOUND_URL, 0.4);
      const newPlayerLives = playerLives - 1;
      
      if (newPlayerLives > 0) {
        setPlayerLives(newPlayerLives);
        setFeedback({ isCorrect: false, message: `Sai rồi! Bạn còn ${newPlayerLives} lượt thử.` });
        setRevealSolution(false); 
        setTimeout(() => {
            setSelectedAnswer(null); 
            setUserAttemptShown(false); 
            setFeedback({ isCorrect: null }); 
        }, 1500); 
      } else {
        setPlayerLives(0);
        setRevealSolution(true); 
        setFeedback({ isCorrect: false, message: `Hết lượt! Đáp án đúng là: ${currentQuestion.correctAnswer}.` });
        setTimeout(() => {
           handleNextQuestionInIsland(); 
        }, 3000); 
      }
    }
  }, [selectedAnswer, currentQuestion, playerLives, handleNextQuestionInIsland, hintButtonUsed, overallScore, selectedGrade, playSound, unlockAudioContext]);
  
  const handleBackToMap = () => {
    unlockAudioContext();
    playSound(BUTTON_CLICK_SOUND_URL);
    if (!selectedGrade) return;
    
    // Check if coming from treasure chest modal
    if (showTreasureModalForIslandId) {
        setShowTreasureModalForIslandId(null); // Ensure treasure modal is closed
    }

    const allGradeIslandsCompleted = islandsForCurrentGrade.every(island => islandProgress[island.islandId] === 'completed');
    
    setCurrentIslandId(null);
    setSelectedIslandDifficulty(null);
    setQuestionsForCurrentIsland([]);
    setCurrentQuestionIndexInIsland(0); 
    resetForNewQuestion();

    setTransitionDetails({
        message: UPDATING_MAP_TEXT,
        duration: 1000, 
        onComplete: () => {
            if (allGradeIslandsCompleted && islandsForCurrentGrade.length >= ISLANDS_PER_GRADE) {
                setGameState('GradeComplete');
            } else {
                setGameState('IslandMap');
            }
            if (selectedGrade) trySpawnTreasureChests(selectedGrade); // Try spawning chests when returning to map
        }
    });
    setGameState('Transitioning');
  };

  const handlePlayIslandAgain = () => {
    unlockAudioContext();
    playSound(BUTTON_CLICK_SOUND_URL);
    if (currentIslandId && selectedGrade && selectedIslandDifficulty && currentIslandConfig) {
      resetForNewIslandPlay(); 
      setTransitionDetails({
        message: STARTING_ISLAND_TEXT(currentIslandConfig.name, ISLAND_DIFFICULTY_TEXT_MAP[selectedIslandDifficulty]),
        duration: 700,
        onComplete: () => setGameState('IslandPlaying')
      });
      setGameState('Transitioning');
    } else {
      console.warn("Cannot play island again: missing island context.");
      handleBackToMap(); 
    }
  };
  
  const handlePlayThisGradeAgain = () => {
    unlockAudioContext();
    playSound(BUTTON_CLICK_SOUND_URL);
    if (selectedGrade) {
      saveOverallScoreToStorage(selectedGrade, 0);
      const initialProgressForGrade: IslandProgressState = {};
      islandsForCurrentGrade.forEach(island => {
        initialProgressForGrade[island.islandId] = island.islandNumber === 1 ? 'unlocked' : 'locked';
      });
      saveIslandProgressToStorage(selectedGrade, initialProgressForGrade);
      saveIslandStarRatingsToStorage(selectedGrade, {}); 
      setPreloadedQuestionsCache({}); 
      setAllGradesProgress(prev => ({...prev, [selectedGrade]: initialProgressForGrade})); 
      setAllGradesStarRatings(prev => { 
        const updatedAllStars = {...prev, [selectedGrade]: {}};
        saveAllGradesStarRatingsToStorage(updatedAllStars);
        return updatedAllStars;
      });
      // Also reset treasure chests for this grade
      setActiveTreasureChests(prevChests => {
        const newChests = { ...prevChests };
        if (selectedGrade) delete newChests[selectedGrade];
        saveActiveTreasureChestsToStorage(newChests);
        return newChests;
      });

      handleGradeSelect(selectedGrade); 
    }
  };

  const handleChooseAnotherGrade = () => {
    unlockAudioContext();
    playSound(BUTTON_CLICK_SOUND_URL);
    setSelectedGrade(null);
    saveLastSelectedGrade(null); 
    resetForNewGradeJourney();
    setGameState('GradeSelection');
  };

  const handleReturnToGradeSelection = () => {
      unlockAudioContext();
      playSound(BUTTON_CLICK_SOUND_URL);
      setSelectedGrade(null);
      saveLastSelectedGrade(null);
      resetForNewGradeJourney();
      setGameState('GradeSelection');
  }
  
  const handleRetryFetchIsland = () => {
    unlockAudioContext();
    playSound(BUTTON_CLICK_SOUND_URL);
    if (currentIslandId && selectedGrade && selectedIslandDifficulty) { 
        setPreloadedQuestionsCache(prev => ({
            ...prev,
            [currentIslandId]: {
                ...(prev[currentIslandId] || {}),
                [selectedIslandDifficulty]: 'pending' 
            }
        }));
        setTransitionDetails(null);
        fetchAndSetQuestionsForIsland(currentIslandId, selectedIslandDifficulty);
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
    unlockAudioContext();
    playSound(BUTTON_CLICK_SOUND_URL);
    if (!currentQuestion || apiKeyMissing) {
        setHint(apiKeyMissing ? API_KEY_ERROR_MESSAGE : HINT_UNAVAILABLE_MESSAGE);
        setIsHintModalOpen(true);
        return;
    }
    setIsHintLoading(true);
    setIsHintModalOpen(true);
    setHintButtonUsed(true); 
    setHintUsedThisIslandRun(true); 
    try {
      const fetchedHint = await getMathHint(currentQuestion.text, currentQuestion.targetGradeLevel);
      setHint(fetchedHint);
    } catch (error) {
      setHint(HINT_UNAVAILABLE_MESSAGE);
    } finally {
      setIsHintLoading(false);
    }
  }, [currentQuestion, apiKeyMissing, playSound, unlockAudioContext]);

  const renderStars = (islandId: string) => {
    const stars = islandStarRatings[islandId] || 0;
    const totalStars = 5;
    return (
      <div className="flex justify-center items-center h-6">
        {Array.from({ length: totalStars }).map((_, i) => 
          i < stars 
            ? <StarIconFilled key={i} className="w-5 h-5 text-[var(--accent-color)]" /> 
            : <StarIconOutline key={i} className="w-5 h-5 text-[var(--accent-color)] opacity-50" />
        )}
      </div>
    );
  };

  const handleThemeChange = (newTheme: Theme) => {
    unlockAudioContext();
    playSound(BUTTON_CLICK_SOUND_URL);
    applyNewTheme(newTheme);
    setThemeChangedForAchievement(true);
    setTimeout(() => checkAndAwardAchievements(), 100); 
  };

  const handleToggleAchievementsScreen = () => {
    unlockAudioContext();
    playSound(BUTTON_CLICK_SOUND_URL);
    setShowAchievementsScreen(prev => !prev);
  }


  if (gameState === 'ThemeSelection') {
    return (
      <ThemeSelectionScreen
        onThemeSelect={(selectedTheme) => {
          handleThemeChange(selectedTheme); 

          if (!process.env.API_KEY) {
            setApiKeyMissing(true);
            setGameState('Error');
            setLoadingError(API_KEY_ERROR_MESSAGE);
            return;
          }
          
          setGameState('GradeSelection');
        }}
      />
    );
  }


  if (apiKeyMissing && gameState === 'Error' && loadingError === API_KEY_ERROR_MESSAGE) {
     return (
       <div className="bg-[var(--incorrect-bg)] text-[var(--incorrect-text)] p-8 rounded-lg shadow-xl text-center max-w-lg mx-auto animate-fadeIn">
         <AlertTriangleIcon className="w-16 h-16 mx-auto mb-4 text-[var(--accent-color)]" />
         <h1 className="text-3xl font-bold mb-4">Lỗi Cấu Hình</h1>
         <p className="text-xl mb-6">{API_KEY_ERROR_MESSAGE}</p>
          <button
            onClick={() => { unlockAudioContext(); playSound(BUTTON_CLICK_SOUND_URL); window.location.reload(); }}
            className="bg-[var(--button-primary-bg)] hover:opacity-80 active:brightness-90 text-[var(--button-primary-text)] font-bold py-3 px-6 rounded-lg"
        >
            Tải Lại Trang
        </button>
       </div>
     );
  }
  
  if (gameState === 'Transitioning' && transitionDetails && transitionDetails.message) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[300px]">
        <LoadingSpinner text={transitionDetails.message} />
      </div>
    );
  }

  if (isIslandLoading) {
     return (
      <div className="flex flex-col items-center justify-center h-full min-h-[300px]">
        <LoadingSpinner 
          text={islandLoadingProgressMessage || ISLAND_PREPARING_MESSAGE(currentIslandConfig?.name || "...")} 
        />
      </div>
    );
  }
  
  if (gameState === 'Error') {
    return (
      <div className={`p-8 rounded-lg shadow-xl text-center max-w-lg mx-auto animate-fadeInScale bg-[var(--incorrect-bg)] text-[var(--incorrect-text)]`}>
        <AlertTriangleIcon className="w-16 h-16 mx-auto mb-4 text-[var(--accent-color)]" />
        <h1 className="text-3xl font-bold mb-4">Lỗi</h1>
        <p className="text-xl mb-6">{loadingError || "Đã có lỗi xảy ra."}</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => { unlockAudioContext(); playSound(BUTTON_CLICK_SOUND_URL); handleReturnToGradeSelection(); }}
              className="bg-[var(--button-secondary-bg)] hover:opacity-80 active:brightness-90 text-[var(--button-secondary-text)] font-bold py-3 px-6 rounded-lg"
            >
              {RETURN_TO_GRADE_SELECTION_TEXT}
            </button>
            {loadingError !== NO_ISLANDS_FOR_GRADE_TEXT && loadingError !== API_KEY_ERROR_MESSAGE && (
                 <button
                    onClick={handleRetryFetchIsland}
                    className="bg-[var(--button-primary-bg)] hover:opacity-80 active:brightness-90 text-[var(--button-primary-text)] font-bold py-3 px-6 rounded-lg"
                >
                    Thử Tải Lại
                </button>
            )}
        </div>
      </div>
    );
  }

  if (gameState === 'GradeSelection') {
    return (
      <>
      <div className="w-full animate-fadeInScale">
        <div className={`w-full max-w-xl mx-auto p-6 md:p-8 bg-[var(--primary-bg)] rounded-2xl shadow-2xl border-2 border-[var(--border-color)] ${themeConfig.frostedGlassOpacity || ''}`}>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--title-text-gradient-from)] to-[var(--title-text-gradient-to)] text-center flex-grow">
                {CHOOSE_GRADE_TEXT}
            </h1>
            <button
                onClick={handleToggleAchievementsScreen}
                onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)}
                className="p-2 rounded-full bg-[var(--button-secondary-bg)] hover:opacity-90 active:brightness-90 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-color)]"
                aria-label={VIEW_ACHIEVEMENTS_BUTTON_TEXT}
            >
                <img 
                  src={ACHIEVEMENT_BUTTON_ICON_URL} 
                  alt="Huy hiệu" 
                  className="w-7 h-7 animate-trophy-glow"
                />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 mb-8">
            {(Object.keys(GradeLevel).filter(key => !isNaN(Number(GradeLevel[key as keyof typeof GradeLevel]))) as (keyof typeof GradeLevel)[]).map((gradeKey) => {
              const gradeValue = GradeLevel[gradeKey];
              return (
                <button
                  key={gradeValue}
                  onClick={() => handleGradeSelect(gradeValue as GradeLevel)}
                  onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)}
                  className="p-4 rounded-lg shadow-lg transition-transform transform hover:scale-105 active:scale-95 active:brightness-90 bg-[var(--button-primary-bg)] hover:opacity-90 text-[var(--button-primary-text)] font-bold text-2xl"
                >
                  {GRADE_LEVEL_TEXT_MAP[gradeValue as GradeLevel]}
                </button>
              );
            })}
          </div>
          <div className="mt-8 pt-6 border-t-2 border-[var(--border-color)]">
            <h2 className="text-2xl font-bold text-[var(--primary-text)] mb-4 text-center">Chọn Giao Diện</h2>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              {(Object.values(Theme).filter(t => t !== Theme.DEFAULT) as Theme[]).map(themeItem => (
                  <button
                      key={themeItem}
                      onClick={() => handleThemeChange(themeItem)}
                      onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)}
                      className={`p-3 rounded-lg shadow-md transition-all transform hover:scale-105 active:scale-95 active:brightness-90 text-lg font-semibold w-full flex items-center justify-center gap-2 border-2
                                  ${theme === themeItem ? 'border-[var(--accent-color)] ring-4 ring-[var(--ring-color-focus)]' : 'border-transparent'}
                                  ${themeItem === Theme.NEON ? 'bg-[#0d1117] text-[#30c5ff]' : 'bg-[#fdf2f8] text-[#c026d3]'}`}
                  >
                      {themeItem === Theme.NEON ? <MoonIcon className="w-5 h-5"/> : <SunIcon className="w-5 h-5"/>}
                      {THEME_CONFIGS[themeItem].name}
                      {theme === themeItem && <CheckIcon className="w-5 h-5 ml-auto text-[var(--accent-color)]" />}
                  </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      {showAchievementsScreen && (
        <AchievementsScreen 
          achievedAchievements={achievedAchievements}
          onClose={handleToggleAchievementsScreen}
          playSound={playSound}
          currentGradeContext={selectedGrade}
        />
      )}
      <ToastNotification toast={currentToast} onDismiss={() => setCurrentToast(null)} />
      </>
    );
  }

  const islandForDifficultyModal = showDifficultySelectionModalForIslandId 
    ? islandsForCurrentGrade.find(i => i.islandId === showDifficultySelectionModalForIslandId)
    : null;

  if (showDifficultySelectionModalForIslandId && islandForDifficultyModal) {
    return (
      <>
        <DifficultySelectionModal
            isOpen={true}
            islandName={islandForDifficultyModal.name}
            onClose={() => {
                unlockAudioContext();
                playSound(BUTTON_CLICK_SOUND_URL);
                setShowDifficultySelectionModalForIslandId(null);
            }}
            onSelectDifficulty={handleDifficultySelected}
        />
        {showAchievementsScreen && (
            <AchievementsScreen 
            achievedAchievements={achievedAchievements}
            onClose={handleToggleAchievementsScreen}
            playSound={playSound}
            currentGradeContext={selectedGrade}
            />
        )}
        <ToastNotification toast={currentToast} onDismiss={() => setCurrentToast(null)} />
      </>
    );
  }

  if (showTreasureModalForIslandId && selectedGrade) {
    const islandConfigForTreasure = islandsForCurrentGrade.find(i => i.islandId === showTreasureModalForIslandId);
    return (
        <>
        <TreasureChestModal
            isOpen={true}
            islandName={islandConfigForTreasure?.name || "Bí Ẩn"}
            onClose={(pointsAwarded: number) => {
                playSound(BUTTON_CLICK_SOUND_URL);
                if (selectedGrade && showTreasureModalForIslandId) {
                    handleTreasureChestOpened(selectedGrade, showTreasureModalForIslandId, pointsAwarded);
                }
            }}
            playSound={playSound}
            themeConfig={themeConfig}
        />
         {showAchievementsScreen && (
            <AchievementsScreen 
            achievedAchievements={achievedAchievements}
            onClose={handleToggleAchievementsScreen}
            playSound={playSound}
            currentGradeContext={selectedGrade}
            />
        )}
        <ToastNotification toast={currentToast} onDismiss={() => setCurrentToast(null)} />
        </>
    );
  }


  if (gameState === 'IslandMap' && selectedGrade) {
    if (islandsForCurrentGrade.length === 0 || islandsForCurrentGrade.length < ISLANDS_PER_GRADE) { 
        return (
          <>
            <div className="w-full animate-fadeInScale">
             <div className={`p-8 rounded-lg shadow-xl text-center max-w-lg mx-auto bg-[var(--secondary-bg)] text-[var(--secondary-text)] ${themeConfig.frostedGlassOpacity || ''}`}>
                <AlertTriangleIcon className="w-16 h-16 mx-auto mb-4 text-[var(--accent-color)]" />
                <h1 className="text-3xl font-bold mb-4">Thông Báo Cấu Hình</h1>
                <p className="text-xl mb-6">
                  {islandsForCurrentGrade.length === 0 
                    ? NO_ISLANDS_FOR_GRADE_TEXT 
                    : `Lớp ${GRADE_LEVEL_TEXT_MAP[selectedGrade]} chưa có đủ ${ISLANDS_PER_GRADE} hòn đảo được thiết kế. Vui lòng kiểm tra lại file constants.ts.`
                  }
                </p>
                <button
                    onClick={handleChooseAnotherGrade}
                    className="bg-[var(--button-secondary-bg)] hover:opacity-90 active:brightness-90 text-[var(--button-secondary-text)] font-bold py-3 px-6 rounded-lg"
                >
                    {CHOOSE_ANOTHER_GRADE_TEXT}
                </button>
            </div>
          </div>
          {showAchievementsScreen && (
            <AchievementsScreen 
            achievedAchievements={achievedAchievements}
            onClose={handleToggleAchievementsScreen}
            playSound={playSound}
            currentGradeContext={selectedGrade}
            />
        )}
        <ToastNotification toast={currentToast} onDismiss={() => setCurrentToast(null)} />
        </>
        );
    }
    const completedIslandsCount = islandsForCurrentGrade.filter(island => islandProgress[island.islandId] === 'completed').length;
    const totalIslandsForGrade = islandsForCurrentGrade.length;
    const adventureProgressPercentage = totalIslandsForGrade > 0 ? (completedIslandsCount / totalIslandsForGrade) * 100 : 0;

    return (
      <>
      <div className="w-full animate-fadeInScale">
        <div className={`w-full max-w-4xl mx-auto p-6 md:p-8 bg-[var(--primary-bg)] rounded-2xl shadow-2xl border-2 border-[var(--border-color)] ${themeConfig.frostedGlassOpacity || ''}`}>
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
              <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--title-text-gradient-from)] to-[var(--title-text-gradient-to)] mb-2 sm:mb-0">
              {CHOOSE_ISLAND_TEXT}
              </h1>
              <div className="flex items-center gap-3">
                <button 
                    onClick={handleChooseAnotherGrade}
                    onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)}
                    className="bg-[var(--button-secondary-bg)] hover:opacity-90 active:brightness-90 text-[var(--button-secondary-text)] font-semibold py-2 px-4 rounded-lg shadow-md text-sm"
                >
                    {CHOOSE_ANOTHER_GRADE_TEXT}
                </button>
                 <button
                    onClick={handleToggleAchievementsScreen}
                    onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)}
                    className="hover:opacity-90 active:brightness-90 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[var(--accent-color)] rounded-full"
                    aria-label={VIEW_ACHIEVEMENTS_BUTTON_TEXT}
                >
                   <img 
                      src={ACHIEVEMENT_BUTTON_ICON_URL} 
                      alt="Huy hiệu" 
                      className="w-14 h-14 animate-trophy-glow" // Increased size, removed p-2, bg, shadow
                    />
                </button>
              </div>
          </div>
          
          <div className="mb-5">
            <div className="flex justify-between items-center text-md text-[var(--primary-text)] opacity-90 mb-1 px-1">
              <span className="font-semibold">Tiến Độ Phiêu Lưu</span>
              <span className="font-semibold">{adventureProgressPercentage.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-[var(--secondary-bg)] rounded-full h-3.5 shadow-inner">
              <div 
                className="bg-[var(--accent-color)] h-3.5 rounded-full transition-all duration-500 ease-out" 
                style={{ width: `${adventureProgressPercentage}%` }}
                aria-valuenow={adventureProgressPercentage}
                aria-valuemin={0}
                aria-valuemax={100}
              ></div>
            </div>
          </div>

          <p className="text-center text-[var(--primary-text)] opacity-90 mb-1 text-2xl">Lớp: {GRADE_LEVEL_TEXT_MAP[selectedGrade]}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {islandsForCurrentGrade.map((island) => {
              const status = islandProgress[island.islandId] || 'locked'; 
              const isDisabled = status === 'locked';
              let currentBgColor = 'bg-[var(--island-locked-bg)]';
              let currentTextColor = 'text-[var(--island-locked-text)]';

              if (status === 'completed') {
                  currentBgColor = 'bg-[var(--island-completed-bg)]';
                  currentTextColor = 'text-[var(--island-completed-text)]';
              } else if (status === 'unlocked') {
                  currentBgColor = 'bg-[var(--island-unlocked-bg)]';
                  currentTextColor = 'text-[var(--island-unlocked-text)]';
              }
              const isUnlockedAndNotCompleted = status === 'unlocked';
              const hasTreasure = status === 'completed' && selectedGrade && activeTreasureChests[selectedGrade]?.[island.islandId];
              
              return (
                <button
                  key={island.islandId}
                  onClick={() => !isDisabled && handleIslandSelect(island.islandId)}
                  onMouseEnter={() => !isDisabled && playSound(HOVER_SOUND_URL, 0.2)}
                  disabled={isDisabled}
                  className={`p-4 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 ${currentBgColor} ${currentTextColor} min-h-[180px] flex flex-col justify-between items-center text-center focus:outline-none focus:ring-4 ring-[var(--island-button-ring-color)] relative
                              ${isDisabled ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90 active:scale-95 active:brightness-90'}
                              ${isUnlockedAndNotCompleted && !hasTreasure ? 'animate-pulse-glow' : ''}
                              ${hasTreasure ? 'animate-pulse-glow ring-4 ring-yellow-400 border-2 border-yellow-200' : ''}
                            `}
                  aria-label={`${island.name}${isDisabled ? ' (Đã khoá)' : ''} ${hasTreasure ? '(Có rương báu!)' : ''}`}
                >
                  {hasTreasure && (
                    <span className="absolute top-1 right-1 text-2xl animate-bounce" style={{filter: 'drop-shadow(0 0 3px gold)'}}>{TREASURE_CHEST_ICON_EMOJI}</span>
                  )}
                  <div className="flex-grow flex flex-col items-center justify-center">
                    <span className="text-3xl mb-1" aria-hidden="true">{island.mapIcon}</span>
                    <h2 className="text-lg font-bold leading-tight">{island.name}</h2>
                    <p className="text-xs mt-1 px-1 opacity-90">{island.description}</p>
                  </div>
                  <div className="mt-2 h-6">
                      {isDisabled && <LockIcon className="w-6 h-6 text-[var(--incorrect-bg)] opacity-70" />}
                      {status === 'completed' && !hasTreasure ? <div className="animate-subtle-shine">{renderStars(island.islandId)}</div> : null}
                      {status === 'completed' && hasTreasure ? <div className="animate-subtle-shine">{renderStars(island.islandId)}</div> : null}

                  </div>
                </button>
              );
            })}
          </div>
          <p className="text-center text-[var(--primary-text)] opacity-90 mt-8 text-2xl font-bold">Tổng Điểm {GRADE_LEVEL_TEXT_MAP[selectedGrade]}: {overallScore}</p>
        </div>
      </div>
      {showAchievementsScreen && (
        <AchievementsScreen 
          achievedAchievements={achievedAchievements}
          onClose={handleToggleAchievementsScreen}
          playSound={playSound}
          currentGradeContext={selectedGrade}
        />
      )}
      <ToastNotification toast={currentToast} onDismiss={() => setCurrentToast(null)} />
      </>
    );
  }
  
  if (gameState === 'IslandComplete' && currentIslandConfig && selectedGrade && selectedIslandDifficulty && currentIslandId) {
    const currentCompletedIslandIndex = islandsForCurrentGrade.findIndex(i => i.islandId === currentIslandId);
    const nextIsland = (currentCompletedIslandIndex !== -1 && currentCompletedIslandIndex < islandsForCurrentGrade.length - 1)
                        ? islandsForCurrentGrade[currentCompletedIslandIndex + 1]
                        : null;
    const canGoToNextIsland = nextIsland && islandProgress[nextIsland.islandId] === 'unlocked';
    const starsAchievedForThisIsland = islandStarRatings[currentIslandId] || 0;
    const isPerfectRun = starsAchievedForThisIsland === 5;

    let specialCelebrationText = "";
    let showBigBlinkingStar = false;
    let perfectRunMessage = `Bạn đạt được: ${islandScore} điểm cho đảo này.`;


    if (isPerfectRun) {
        if (selectedIslandDifficulty === IslandDifficulty.HARD) {
            specialCelebrationText = REWARD_TEXT_HARD_PERFECT;
            showBigBlinkingStar = true;
        } else if (selectedIslandDifficulty === IslandDifficulty.MEDIUM) {
            specialCelebrationText = REWARD_TEXT_MEDIUM_PERFECT;
            showBigBlinkingStar = true;
        } else { 
            perfectRunMessage = REWARD_TEXT_EASY_PERFECT;
        }
    }

    return (
      <>
      <div className="w-full animate-fadeInScale">
        {showCustomFireworks && <FireworksCanvas isActive={showCustomFireworks} playSound={playSound} audioUnlocked={audioUnlocked} />}
        <div className={`p-8 md:p-12 rounded-xl shadow-2xl text-center max-w-2xl mx-auto bg-gradient-to-br from-[var(--correct-bg)] to-[var(--accent-color)] text-[var(--correct-text)] ${themeConfig.frostedGlassOpacity || ''} relative z-10`}>
          {specialCelebrationText && (
            <div className="my-3 flex items-center justify-center gap-2 animate-subtle-shine">
              <p className="text-4xl font-extrabold text-[var(--title-text-gradient-from)] drop-shadow-lg">{specialCelebrationText}</p>
              {showBigBlinkingStar && <StarIconFilled className="w-12 h-12 text-[var(--title-text-gradient-from)] animate-pulse" style={{ animationDuration: '1s' }} />}
            </div>
          )}
          <h1 className="text-4xl md:text-5xl font-bold mb-2">{ISLAND_COMPLETE_TEXT}</h1>
          <p className="text-2xl mb-1">{currentIslandConfig.name} ({ISLAND_DIFFICULTY_TEXT_MAP[selectedIslandDifficulty]})</p>
          
          <div className="flex justify-center my-2 animate-subtle-shine">
            {renderStars(currentIslandId)} 
          </div>
          <p className="text-xl mb-2">{perfectRunMessage}</p>

          <p className="text-3xl font-bold mb-4">Tổng điểm {GRADE_LEVEL_TEXT_MAP[selectedGrade]}: {overallScore}</p>
          <p className="text-xl mb-4">Bạn được thưởng +1 lượt thử! Hiện có: {playerLives}/{MAX_PLAYER_LIVES} lượt.</p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
              <button
                onClick={handleBackToMap}
                onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)}
                className="bg-[var(--button-secondary-bg)] hover:opacity-90 active:brightness-90 text-[var(--button-secondary-text)] font-bold py-3 px-8 rounded-lg shadow-lg text-lg"
              >
                {BACK_TO_MAP_TEXT}
              </button>
              <button
                onClick={handlePlayIslandAgain}
                onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)}
                className="bg-[var(--button-primary-bg)] hover:opacity-90 active:brightness-90 text-[var(--button-primary-text)] font-bold py-3 px-8 rounded-lg shadow-lg text-lg"
              >
                {PLAY_AGAIN_TEXT}
              </button>
              {canGoToNextIsland && nextIsland && (
                  <button
                      onClick={() => { 
                          unlockAudioContext(); 
                          playSound(BUTTON_CLICK_SOUND_URL); 
                          handleIslandSelect(nextIsland.islandId); 
                      }}
                      onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)}
                      className="bg-[var(--button-primary-bg)] hover:opacity-90 active:brightness-90 text-[var(--button-primary-text)] font-bold py-3 px-8 rounded-lg shadow-lg text-lg"
                  >
                      {NEXT_ISLAND_BUTTON_TEXT}
                  </button>
              )}
          </div>
        </div>
      </div>
      {showAchievementsScreen && (
        <AchievementsScreen 
          achievedAchievements={achievedAchievements}
          onClose={handleToggleAchievementsScreen}
          playSound={playSound}
          currentGradeContext={selectedGrade}
        />
      )}
      <ToastNotification toast={currentToast} onDismiss={() => setCurrentToast(null)} />
      </>
    );
  }
  
  if (gameState === 'GradeComplete' && selectedGrade) {
     return (
      <>
      <div className="w-full animate-fadeInScale">
      {showCustomFireworks && <FireworksCanvas isActive={showCustomFireworks} playSound={playSound} audioUnlocked={audioUnlocked}/>} 
        <div className={`p-8 md:p-12 rounded-xl shadow-2xl text-center max-w-2xl mx-auto bg-gradient-to-r from-[var(--title-text-gradient-from)] via-[var(--accent-color)] to-[var(--title-text-gradient-to)] text-[var(--accent-text)] ${themeConfig.frostedGlassOpacity || ''} relative z-10`}>
          <SparklesIcon className="w-24 h-24 mx-auto mb-6 text-white animate-subtle-shine"/>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-subtle-shine">{GRADE_COMPLETE_TEXT}</h1>
          <p className="text-2xl mb-2">{GRADE_LEVEL_TEXT_MAP[selectedGrade]}</p>
          <p className="text-5xl md:text-6xl font-extrabold text-white mb-8 drop-shadow-lg">{overallScore} <span className="text-3xl">điểm</span></p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
              onClick={handlePlayThisGradeAgain}
              onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)}
              className="bg-[var(--correct-bg)] hover:opacity-90 active:brightness-90 text-[var(--correct-text)] font-bold py-3 px-8 rounded-lg shadow-lg text-lg transition-transform transform hover:scale-105"
              >
              {PLAY_THIS_GRADE_AGAIN_TEXT}
              </button>
              <button
              onClick={handleChooseAnotherGrade}
              onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)}
              className="bg-[var(--button-secondary-bg)] hover:opacity-90 active:brightness-90 text-[var(--button-secondary-text)] font-bold py-3 px-8 rounded-lg shadow-lg text-lg transition-transform transform hover:scale-105"
              >
              {CHOOSE_ANOTHER_GRADE_TEXT}
              </button>
          </div>
        </div>
      </div>
      {showAchievementsScreen && (
        <AchievementsScreen 
          achievedAchievements={achievedAchievements}
          onClose={handleToggleAchievementsScreen}
          playSound={playSound}
          currentGradeContext={selectedGrade}
        />
      )}
      <ToastNotification toast={currentToast} onDismiss={() => setCurrentToast(null)} />
      </>
    );
  }
  
  if (gameState === 'IslandPlaying' && currentQuestion && currentIslandConfig && selectedGrade && selectedIslandDifficulty) {
    const isQuestionResolved = feedback.isCorrect === true || (playerLives === 0 && feedback.isCorrect === false && revealSolution);
    const canAttempt = !isQuestionResolved && !userAttemptShown;
    
    const mainCardExtraClasses = theme === Theme.GIRLY ? '' : (themeConfig.frostedGlassOpacity || '');
    const progressPercentage = questionsForCurrentIsland.length > 0 ? ((currentQuestionIndexInIsland + 1) / questionsForCurrentIsland.length) * 100 : 0;


    return (
      <>
      <div className="w-full animate-fadeInScale">
        <div className={`w-full max-w-3xl mx-auto p-4 md:p-6 bg-[var(--primary-bg)] rounded-2xl shadow-2xl border-2 border-[var(--border-color)] ${mainCardExtraClasses}`}>
          <header className="mb-6 text-center relative">
            <button 
              onClick={handleBackToMap}
              onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)}
              className="absolute top-0 left-0 mt-[-8px] ml-[-8px] md:mt-0 md:ml-0 bg-[var(--button-secondary-bg)] hover:opacity-90 active:brightness-90 text-[var(--button-secondary-text)] font-semibold py-2 px-3 rounded-lg shadow-md text-sm z-10"
              aria-label="Trở về bản đồ"
              disabled={userAttemptShown && !revealSolution && playerLives > 0} 
            >
              &larr; Bản Đồ
            </button>
            <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--title-text-gradient-from)] to-[var(--title-text-gradient-to)] drop-shadow-md pt-12 md:pt-8">
              {currentIslandConfig.mapIcon} {currentIslandConfig.name}
            </h1>
            <p className="text-[var(--primary-text)] opacity-80 text-md mt-1">{currentIslandConfig.description} ({ISLAND_DIFFICULTY_TEXT_MAP[selectedIslandDifficulty]})</p>
            
            <div className="mt-3 mb-2">
              <div className="flex justify-between items-center text-sm text-[var(--primary-text)] opacity-80 mb-1 px-1">
                <span>Tiến độ</span>
                <span>Câu {currentQuestionIndexInIsland + 1}/{questionsForCurrentIsland.length}</span>
              </div>
              <div className="w-full bg-[var(--secondary-bg)] rounded-full h-2.5 shadow-inner">
                <div 
                  className="bg-[var(--accent-color)] h-2.5 rounded-full transition-all duration-500 ease-out" 
                  style={{ width: `${progressPercentage}%` }}
                  aria-valuenow={progressPercentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  role="progressbar"
                  aria-label={`Tiến độ câu hỏi: ${progressPercentage.toFixed(0)}%`}
                ></div>
              </div>
            </div>

            <p className="text-[var(--primary-text)] opacity-90 text-lg">
              Lớp: {GRADE_LEVEL_TEXT_MAP[selectedGrade]}
            </p>
            <p className="text-[var(--primary-text)] text-xl font-semibold">
              Điểm Lớp: {overallScore} (Đảo: {islandScore})
            </p>
          </header>

          <QuestionDisplay question={currentQuestion} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
            {currentQuestion.options.map((option, index) => (
              <AnswerOption
                key={currentQuestion.id + "_" + index}
                optionText={option}
                onClick={() => { 
                  unlockAudioContext();
                  playSound(ANSWER_SELECT_SOUND_URL, 0.4); 
                  setSelectedAnswer(option); 
                }}
                disabled={!canAttempt || isQuestionResolved} 
                isSelected={selectedAnswer === option}
                isCorrect={option === currentQuestion.correctAnswer}
                userAttemptShown={userAttemptShown}
                solutionRevealed={revealSolution}
              />
            ))}
          </div>
          
          {userAttemptShown && feedback.isCorrect !== null && <FeedbackIndicator isCorrect={feedback.isCorrect} message={feedback.message} />}

          <div className="mt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <button
              onClick={handleHintRequest}
              onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)}
              disabled={isHintLoading || hintButtonUsed || !canAttempt || isQuestionResolved}
              className="flex items-center justify-center gap-2 bg-[var(--button-secondary-bg)] hover:opacity-90 active:brightness-90 text-[var(--button-secondary-text)] font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 w-full md:w-auto"
            >
              <LightbulbIcon className="w-6 h-6" />
              {isHintLoading ? HINT_LOADING_MESSAGE : (hint && !isHintLoading && hintButtonUsed ? 'Xem lại gợi ý' : 'Nhận Gợi Ý')}
            </button>

            <button
              onClick={handleAnswerSubmit}
              onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)}
              disabled={!selectedAnswer || !canAttempt || isQuestionResolved}
              className="bg-[var(--button-primary-bg)] hover:opacity-90 active:brightness-90 text-[var(--button-primary-text)] font-bold py-3 px-8 rounded-lg shadow-lg transition-all duration-200 text-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 w-full md:w-auto"
            >
              Kiểm Tra
            </button>
          </div>
          
          <div className="flex justify-center items-center gap-1 mt-4" aria-label={`Số lượt thử còn lại: ${playerLives}`}>
            {Array.from({ length: MAX_PLAYER_LIVES }).map((_, index) => (
              index < playerLives 
                ? <HeartIconFilled key={index} className="w-7 h-7 text-[var(--incorrect-bg)]" />
                : <HeartIconBroken key={index} className="w-7 h-7 text-gray-400 opacity-70" />
            ))}
          </div>

          <HintModal
            isOpen={isHintModalOpen}
            onClose={() => { 
              unlockAudioContext();
              playSound(BUTTON_CLICK_SOUND_URL); 
              setIsHintModalOpen(false); 
            }}
            hint={hint}
            isLoading={isHintLoading}
          />
        </div>
      </div>
      {showAchievementsScreen && (
        <AchievementsScreen 
          achievedAchievements={achievedAchievements}
          onClose={handleToggleAchievementsScreen}
          playSound={playSound}
          currentGradeContext={selectedGrade}
        />
      )}
      <ToastNotification toast={currentToast} onDismiss={() => setCurrentToast(null)} />
      </>
    );
  }

  return (
    <>
      <LoadingSpinner text="Đang chuẩn bị Đảo Kho Báu..." />
      {showAchievementsScreen && (
        <AchievementsScreen 
          achievedAchievements={achievedAchievements}
          onClose={handleToggleAchievementsScreen}
          playSound={playSound}
          currentGradeContext={selectedGrade}
        />
      )}
      <ToastNotification toast={currentToast} onDismiss={() => setCurrentToast(null)} />
    </>
  );
};

export default GameScreen;