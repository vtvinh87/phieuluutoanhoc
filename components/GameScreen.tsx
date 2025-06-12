
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Question, IslandConfig, IslandStatus, IslandProgressState, GradeLevel, IslandStarRatingsState, IslandDifficulty, PreloadedQuestionsCache, Theme } from '../types';
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
  HOVER_SOUND_FILENAME, HOVER_SOUND_REMOTE_URL,
  GRADE_SELECT_SOUND_FILENAME, GRADE_SELECT_SOUND_REMOTE_URL,
  ISLAND_SELECT_SOUND_FILENAME, ISLAND_SELECT_SOUND_REMOTE_URL,
  ANSWER_SELECT_SOUND_FILENAME, ANSWER_SELECT_SOUND_REMOTE_URL,
  CHECK_ANSWER_SOUND_FILENAME, CHECK_ANSWER_SOUND_REMOTE_URL,
  CORRECT_ANSWER_SOUND_FILENAME, CORRECT_ANSWER_SOUND_REMOTE_URL,
  INCORRECT_ANSWER_SOUND_FILENAME, INCORRECT_ANSWER_SOUND_REMOTE_URL,
  VICTORY_FANFARE_SOUND_FILENAME, VICTORY_FANFARE_SOUND_REMOTE_URL,
  BUTTON_CLICK_SOUND_FILENAME, BUTTON_CLICK_SOUND_REMOTE_URL,
  SELECTED_THEME_KEY,
  DEFAULT_THEME,
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
import { LightbulbIcon, SparklesIcon, AlertTriangleIcon, XCircleIcon as LockIcon, StarIconFilled, StarIconOutline, SunIcon, MoonIcon, CheckIcon, HeartIconFilled, HeartIconBroken } from './icons'; 
import { useTheme } from '../contexts/ThemeContext';
import { THEME_CONFIGS } from '../themes';


type GameState = 'ThemeSelection' | 'GradeSelection' | 'IslandMap' | 'IslandPlaying' | 'IslandComplete' | 'GradeComplete' | 'Transitioning' | 'Error';

interface TransitionDetails {
  message: string;
  duration?: number;
  onComplete: () => void;
}

const GameScreen: React.FC = () => {
  const { theme, setTheme: applyNewTheme, themeConfig } = useTheme();

  const [gameState, setGameState] = useState<GameState>('ThemeSelection'); 
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

  const [apiKeyMissing, setApiKeyMissing] = useState(false);
  const [userAttemptShown, setUserAttemptShown] = useState(false);
  const [revealSolution, setRevealSolution] = useState(false);

  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const audioCache = useRef<Record<string, HTMLAudioElement>>({});

  const [preloadedQuestionsCache, setPreloadedQuestionsCache] = useState<PreloadedQuestionsCache>({});
  const [showCustomFireworks, setShowCustomFireworks] = useState(false);

  const unlockAudioContext = useCallback(() => {
    if (!audioUnlocked) {
      setAudioUnlocked(true);
      const silentAudio = new Audio("data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA");
      silentAudio.volume = 0;
      silentAudio.play().catch(() => {});
    }
  }, [audioUnlocked]);

  const playSound = useCallback((filename: string, remoteUrl: string, volume: number = 0.5) => {
    if (!audioUnlocked) return;
    if (!filename || !remoteUrl) {
        console.warn("playSound called with missing filename or remoteUrl");
        return;
    }

    const cachedAudio = audioCache.current[filename];
    if (cachedAudio && cachedAudio.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA) {
        cachedAudio.currentTime = 0;
        cachedAudio.volume = volume;
        cachedAudio.play().catch(e => console.error("Cached sound play error:", e, cachedAudio.src));
        return;
    } else if (cachedAudio) { // Cached but not ready
        delete audioCache.current[filename]; // Force reload
    }

    const localSoundPath = `/sounds/${filename}`;
    let audio: HTMLAudioElement | null = new Audio(localSoundPath);
    audio.volume = volume;

    const playAudioAndCache = (loadedAudio: HTMLAudioElement, source: string) => {
        loadedAudio.currentTime = 0;
        loadedAudio.play().catch(e => console.error(`${source} sound play error:`, e, loadedAudio.src));
        audioCache.current[filename] = loadedAudio;
    };

    const tryRemote = () => {
        if (!audio) return; // Should not happen if error leads here
        console.warn(`Local sound ${localSoundPath} failed. Trying remote: ${remoteUrl}`);
        
        // Clean up the failed local audio object before creating a new one
        audio.src = ''; // Detach src
        audio.load(); // Abort current load if any
        
        audio = new Audio(remoteUrl);
        audio.volume = volume;

        audio.addEventListener('canplaythrough', () => {
            if (!audio) return;
            playAudioAndCache(audio, 'Remote');
        }, { once: true });

        audio.addEventListener('error', () => {
            console.error(`Remote sound ${remoteUrl} also failed to load.`);
            delete audioCache.current[filename];
            audio = null; // Release
        }, { once: true });
        audio.load();
    };

    audio.addEventListener('canplaythrough', () => {
        if (!audio) return;
        playAudioAndCache(audio, 'Local');
    }, { once: true });

    audio.addEventListener('error', () => {
        if (!audio) return; 
        tryRemote();
    }, { once: true });

    audio.load();

}, [audioUnlocked, audioCache]);


  const loadLastSelectedGrade = (): GradeLevel | null => {
    const savedGrade = localStorage.getItem(LAST_SELECTED_GRADE_KEY);
    return savedGrade ? parseInt(savedGrade) as GradeLevel : null;
  };
  const saveLastSelectedGrade = (grade: GradeLevel | null) => {
    if (grade) localStorage.setItem(LAST_SELECTED_GRADE_KEY, grade.toString());
    else localStorage.removeItem(LAST_SELECTED_GRADE_KEY);
  };
  const loadIslandProgressFromStorage = (grade: GradeLevel): IslandProgressState | null => {
    const savedProgress = localStorage.getItem(`${ISLAND_PROGRESS_KEY_PREFIX}${grade}`);
    return savedProgress ? JSON.parse(savedProgress) : null;
  };
  const saveIslandProgressToStorage = (grade: GradeLevel, progress: IslandProgressState) => {
    localStorage.setItem(`${ISLAND_PROGRESS_KEY_PREFIX}${grade}`, JSON.stringify(progress));
  };
  const loadOverallScoreFromStorage = (grade: GradeLevel): number | null => {
    const savedScore = localStorage.getItem(`${OVERALL_SCORE_KEY_PREFIX}${grade}`);
    return savedScore ? parseInt(savedScore) : null;
  };
  const saveOverallScoreToStorage = (grade: GradeLevel, score: number) => {
    localStorage.setItem(`${OVERALL_SCORE_KEY_PREFIX}${grade}`, score.toString());
  };
  const loadIslandStarRatingsFromStorage = (grade: GradeLevel): IslandStarRatingsState | null => {
    const savedRatings = localStorage.getItem(`${ISLAND_STAR_RATINGS_KEY_PREFIX}${grade}`);
    return savedRatings ? JSON.parse(savedRatings) : null;
  };
  const saveIslandStarRatingsToStorage = (grade: GradeLevel, ratings: IslandStarRatingsState) => {
    localStorage.setItem(`${ISLAND_STAR_RATINGS_KEY_PREFIX}${grade}`, JSON.stringify(ratings));
  };

 useEffect(() => {
    const savedTheme = localStorage.getItem(SELECTED_THEME_KEY) as Theme | null;
    if (savedTheme && THEME_CONFIGS[savedTheme]) {
      applyNewTheme(savedTheme);
    } else {
      applyNewTheme(DEFAULT_THEME);
    }
    document.addEventListener('click', unlockAudioContext, { once: true });
    document.addEventListener('touchstart', unlockAudioContext, { once: true });
    return () => {
        document.removeEventListener('click', unlockAudioContext);
        document.removeEventListener('touchstart', unlockAudioContext);
    }
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

  // Effect for custom fireworks: Keep them on for completion screens, turn off otherwise.
  useEffect(() => {
    if (gameState === 'IslandComplete' || gameState === 'GradeComplete') {
      // If fireworks are intended for these states (set by the logic transitioning TO them),
      // this effect doesn't need to do anything to keep them on.
      // If `showCustomFireworks` is already true, it will remain true.
    } else {
      // If we are NOT on a completion screen, ensure fireworks are turned off.
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
  }, [resetForNewIslandPlay]);


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
    // N+1 Preloading: Preload the *same difficulty* for the *next* island
    if (gameState === 'IslandPlaying' && currentIslandId && selectedGrade && islandsForCurrentGrade.length > 0 && selectedIslandDifficulty) {
      const currentIndexInGrade = islandsForCurrentGrade.findIndex(island => island.islandId === currentIslandId);
      
      if (currentIndexInGrade !== -1 && currentIndexInGrade < islandsForCurrentGrade.length - 1) {
        const nextIslandConfig = islandsForCurrentGrade[currentIndexInGrade + 1];
        
        // Delay the N+1 preload slightly to prioritize current island experience
        const timeoutId = setTimeout(() => {
          const cacheEntryForNextIslandSameDifficulty = preloadedQuestionsCache[nextIslandConfig.islandId]?.[selectedIslandDifficulty];
          
          if (!cacheEntryForNextIslandSameDifficulty || cacheEntryForNextIslandSameDifficulty === 'pending') {
            backgroundPreloadIslandDifficulty(nextIslandConfig, selectedIslandDifficulty, true) 
              .catch(err => console.error(`Error in N+1 preload (same difficulty: ${selectedIslandDifficulty}) for ${nextIslandConfig.name}:`, err));
          }
        }, 2000); // 2-second delay

        return () => clearTimeout(timeoutId); // Cleanup timeout on unmount or if dependencies change
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


  const handleGradeSelect = (grade: GradeLevel, isAutoLoading = false) => {
    if (!isAutoLoading) { 
        unlockAudioContext(); 
        playSound(GRADE_SELECT_SOUND_FILENAME, GRADE_SELECT_SOUND_REMOTE_URL, 0.7);
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

      if (savedProgress) {
        setIslandProgress(savedProgress);
      } else {
        const initialProgress: IslandProgressState = {};
        gradeIslands.forEach((island) => {
          initialProgress[island.islandId] = island.islandNumber === 1 ? 'unlocked' : 'locked';
        });
        setIslandProgress(initialProgress);
        saveIslandProgressToStorage(grade, initialProgress); 
      }

      if (savedScore !== null) setOverallScore(savedScore);
      else { setOverallScore(0); saveOverallScoreToStorage(grade, 0); }

      if (savedStarRatings) setIslandStarRatings(savedStarRatings);
      else { setIslandStarRatings({}); saveIslandStarRatingsToStorage(grade, {}); }
      
      setGameState('IslandMap'); 
      
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
        playSound(ISLAND_SELECT_SOUND_FILENAME, ISLAND_SELECT_SOUND_REMOTE_URL, 0.6);
        setCurrentIslandId(islandId); 
        setShowDifficultySelectionModalForIslandId(islandId);
    } else {
        playSound(INCORRECT_ANSWER_SOUND_FILENAME, INCORRECT_ANSWER_SOUND_REMOTE_URL, 0.3);
        alert(LOCKED_ISLAND_TEXT); 
    }
  };

  const handleDifficultySelected = (difficulty: IslandDifficulty) => {
    unlockAudioContext();
    playSound(BUTTON_CLICK_SOUND_FILENAME, BUTTON_CLICK_SOUND_REMOTE_URL);
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
    if (!selectedGrade || !currentIslandId) return; 

    if (currentQuestionIndexInIsland < questionsForCurrentIsland.length - 1) {
      resetForNewQuestion(); 
      setCurrentQuestionIndexInIsland(prev => prev + 1);
    } else { // Island is complete
      const completedIslandId = currentIslandId;
      let starsEarned = 0; 
      
      const livesAtCompletion = playerLives; 

      if (livesAtCompletion === MAX_PLAYER_LIVES) starsEarned = 5;
      else if (livesAtCompletion === MAX_PLAYER_LIVES - 1) starsEarned = 4;
      else if (livesAtCompletion === MAX_PLAYER_LIVES - 2 && livesAtCompletion > 0) starsEarned = 3; 
      else if (livesAtCompletion === 0) starsEarned = 2; 
      else starsEarned = 3; 


      const updatedStarRatings = { ...islandStarRatings, [completedIslandId]: Math.max(islandStarRatings[completedIslandId] || 0, starsEarned) }; 
      setIslandStarRatings(updatedStarRatings);
      saveIslandStarRatingsToStorage(selectedGrade, updatedStarRatings);

      setPlayerLives(prevLives => Math.min(prevLives + 1, MAX_PLAYER_LIVES)); 
      
      const updatedProgress = { ...islandProgress, [completedIslandId]: 'completed' as IslandStatus };
      
      const currentIslandInGradeIndex = islandsForCurrentGrade.findIndex(i => i.islandId === completedIslandId);
      if (currentIslandInGradeIndex !== -1 && currentIslandInGradeIndex < islandsForCurrentGrade.length - 1) {
        const nextIslandInGrade = islandsForCurrentGrade[currentIslandInGradeIndex + 1];
        if (nextIslandInGrade) {
            updatedProgress[nextIslandInGrade.islandId] = 'unlocked';
        }
      }
      setIslandProgress(updatedProgress);
      saveIslandProgressToStorage(selectedGrade, updatedProgress); 
      
      const allIslandsForGradeCompleted = islandsForCurrentGrade.every(island => updatedProgress[island.islandId] === 'completed');
      
      if(allIslandsForGradeCompleted && islandsForCurrentGrade.length >= ISLANDS_PER_GRADE) {
          if(audioUnlocked) playSound(VICTORY_FANFARE_SOUND_FILENAME, VICTORY_FANFARE_SOUND_REMOTE_URL, 0.7); 
          setShowCustomFireworks(true); 
          setGameState('GradeComplete');
      } else {
          if (audioUnlocked) playSound(VICTORY_FANFARE_SOUND_FILENAME, VICTORY_FANFARE_SOUND_REMOTE_URL, 0.6);
          setShowCustomFireworks(true); 
          setGameState('IslandComplete'); 
      }
    }
  }, [currentQuestionIndexInIsland, questionsForCurrentIsland.length, resetForNewQuestion, currentIslandId, islandsForCurrentGrade, islandProgress, selectedGrade, playerLives, islandStarRatings, playSound, audioUnlocked]);

  const handleAnswerSubmit = useCallback(() => {
    unlockAudioContext();
    if (!selectedAnswer || !currentQuestion || !selectedGrade) return;
    playSound(CHECK_ANSWER_SOUND_FILENAME, CHECK_ANSWER_SOUND_REMOTE_URL, 0.6);
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    setUserAttemptShown(true); 

    if (isCorrect) {
      playSound(CORRECT_ANSWER_SOUND_FILENAME, CORRECT_ANSWER_SOUND_REMOTE_URL, 0.5);
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
      playSound(INCORRECT_ANSWER_SOUND_FILENAME, INCORRECT_ANSWER_SOUND_REMOTE_URL, 0.4);
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
    playSound(BUTTON_CLICK_SOUND_FILENAME, BUTTON_CLICK_SOUND_REMOTE_URL);
    if (!selectedGrade) return;
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
        }
    });
    setGameState('Transitioning');
  };

  const handlePlayIslandAgain = () => {
    unlockAudioContext();
    playSound(BUTTON_CLICK_SOUND_FILENAME, BUTTON_CLICK_SOUND_REMOTE_URL);
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
    playSound(BUTTON_CLICK_SOUND_FILENAME, BUTTON_CLICK_SOUND_REMOTE_URL);
    if (selectedGrade) {
      saveOverallScoreToStorage(selectedGrade, 0);
      const initialProgressForGrade: IslandProgressState = {};
      islandsForCurrentGrade.forEach(island => {
        initialProgressForGrade[island.islandId] = island.islandNumber === 1 ? 'unlocked' : 'locked';
      });
      saveIslandProgressToStorage(selectedGrade, initialProgressForGrade);
      saveIslandStarRatingsToStorage(selectedGrade, {}); 
      setPreloadedQuestionsCache({}); 
      handleGradeSelect(selectedGrade); 
    }
  };

  const handleChooseAnotherGrade = () => {
    unlockAudioContext();
    playSound(BUTTON_CLICK_SOUND_FILENAME, BUTTON_CLICK_SOUND_REMOTE_URL);
    setSelectedGrade(null);
    saveLastSelectedGrade(null); 
    resetForNewGradeJourney();
    setGameState('GradeSelection');
  };

  const handleReturnToGradeSelection = () => {
      unlockAudioContext();
      playSound(BUTTON_CLICK_SOUND_FILENAME, BUTTON_CLICK_SOUND_REMOTE_URL);
      setSelectedGrade(null);
      saveLastSelectedGrade(null);
      resetForNewGradeJourney();
      setGameState('GradeSelection');
  }
  
  const handleRetryFetchIsland = () => {
    unlockAudioContext();
    playSound(BUTTON_CLICK_SOUND_FILENAME, BUTTON_CLICK_SOUND_REMOTE_URL);
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
    playSound(BUTTON_CLICK_SOUND_FILENAME, BUTTON_CLICK_SOUND_REMOTE_URL);
    if (!currentQuestion || apiKeyMissing) {
        setHint(apiKeyMissing ? API_KEY_ERROR_MESSAGE : HINT_UNAVAILABLE_MESSAGE);
        setIsHintModalOpen(true);
        return;
    }
    setIsHintLoading(true);
    setIsHintModalOpen(true);
    setHintButtonUsed(true); 
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
    playSound(BUTTON_CLICK_SOUND_FILENAME, BUTTON_CLICK_SOUND_REMOTE_URL);
    applyNewTheme(newTheme);
  };


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
          
          // Always go to GradeSelection after selecting a theme
          setGameState('GradeSelection');
        }}
        playSound={playSound}
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
            onClick={() => { unlockAudioContext(); playSound(BUTTON_CLICK_SOUND_FILENAME, BUTTON_CLICK_SOUND_REMOTE_URL); window.location.reload(); }}
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
              onClick={() => { unlockAudioContext(); playSound(BUTTON_CLICK_SOUND_FILENAME, BUTTON_CLICK_SOUND_REMOTE_URL); handleReturnToGradeSelection(); }}
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
      <div className="w-full animate-fadeInScale">
        <div className={`w-full max-w-xl mx-auto p-6 md:p-8 bg-[var(--primary-bg)] rounded-2xl shadow-2xl border-2 border-[var(--border-color)] ${themeConfig.frostedGlassOpacity || ''}`}>
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--title-text-gradient-from)] to-[var(--title-text-gradient-to)] mb-8 text-center">
            {CHOOSE_GRADE_TEXT}
          </h1>
          <div className="grid grid-cols-1 gap-4 mb-8">
            {(Object.keys(GradeLevel).filter(key => !isNaN(Number(GradeLevel[key as keyof typeof GradeLevel]))) as (keyof typeof GradeLevel)[]).map((gradeKey) => {
              const gradeValue = GradeLevel[gradeKey];
              return (
                <button
                  key={gradeValue}
                  onClick={() => handleGradeSelect(gradeValue as GradeLevel)}
                  onMouseEnter={() => playSound(HOVER_SOUND_FILENAME, HOVER_SOUND_REMOTE_URL, 0.2)}
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
                      onMouseEnter={() => playSound(HOVER_SOUND_FILENAME, HOVER_SOUND_REMOTE_URL, 0.2)}
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
    );
  }

  const islandForDifficultyModal = showDifficultySelectionModalForIslandId 
    ? islandsForCurrentGrade.find(i => i.islandId === showDifficultySelectionModalForIslandId)
    : null;

  if (showDifficultySelectionModalForIslandId && islandForDifficultyModal) {
    return (
        <DifficultySelectionModal
            isOpen={true}
            islandName={islandForDifficultyModal.name}
            onClose={() => {
                unlockAudioContext();
                playSound(BUTTON_CLICK_SOUND_FILENAME, BUTTON_CLICK_SOUND_REMOTE_URL);
                setShowDifficultySelectionModalForIslandId(null);
            }}
            onSelectDifficulty={handleDifficultySelected}
            playSound={playSound}
        />
    );
  }


  if (gameState === 'IslandMap' && selectedGrade) {
    if (islandsForCurrentGrade.length === 0 || islandsForCurrentGrade.length < ISLANDS_PER_GRADE) { 
        return (
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
        );
    }
    const completedIslandsCount = islandsForCurrentGrade.filter(island => islandProgress[island.islandId] === 'completed').length;
    const totalIslandsForGrade = islandsForCurrentGrade.length;
    const adventureProgressPercentage = totalIslandsForGrade > 0 ? (completedIslandsCount / totalIslandsForGrade) * 100 : 0;

    return (
      <div className="w-full animate-fadeInScale">
        <div className={`w-full max-w-4xl mx-auto p-6 md:p-8 bg-[var(--primary-bg)] rounded-2xl shadow-2xl border-2 border-[var(--border-color)] ${themeConfig.frostedGlassOpacity || ''}`}>
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
              <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--title-text-gradient-from)] to-[var(--title-text-gradient-to)] mb-2 sm:mb-0">
              {CHOOSE_ISLAND_TEXT}
              </h1>
              <button 
                  onClick={handleChooseAnotherGrade}
                  onMouseEnter={() => playSound(HOVER_SOUND_FILENAME, HOVER_SOUND_REMOTE_URL, 0.2)}
                  className="bg-[var(--button-secondary-bg)] hover:opacity-90 active:brightness-90 text-[var(--button-secondary-text)] font-semibold py-2 px-4 rounded-lg shadow-md text-sm"
              >
                  {CHOOSE_ANOTHER_GRADE_TEXT}
              </button>
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
              
              return (
                <button
                  key={island.islandId}
                  onClick={() => !isDisabled && handleIslandSelect(island.islandId)}
                  onMouseEnter={() => !isDisabled && playSound(HOVER_SOUND_FILENAME, HOVER_SOUND_REMOTE_URL, 0.2)}
                  disabled={isDisabled}
                  className={`p-4 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 ${currentBgColor} ${currentTextColor} min-h-[180px] flex flex-col justify-between items-center text-center focus:outline-none focus:ring-4 ring-[var(--island-button-ring-color)] 
                              ${isDisabled ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90 active:scale-95 active:brightness-90'}
                              ${isUnlockedAndNotCompleted ? 'animate-pulse-glow' : ''}
                            `}
                  aria-label={`${island.name}${isDisabled ? ' (Đã khoá)' : ''}`}
                >
                  <div className="flex-grow flex flex-col items-center justify-center">
                    <span className="text-3xl mb-1" aria-hidden="true">{island.mapIcon}</span>
                    <h2 className="text-lg font-bold leading-tight">{island.name}</h2>
                    <p className="text-xs mt-1 px-1 opacity-90">{island.description}</p>
                  </div>
                  <div className="mt-2 h-6">
                      {isDisabled && <LockIcon className="w-6 h-6 text-[var(--incorrect-bg)] opacity-70" />}
                      {status === 'completed' ? <div className="animate-subtle-shine">{renderStars(island.islandId)}</div> : null}
                  </div>
                </button>
              );
            })}
          </div>
          <p className="text-center text-[var(--primary-text)] opacity-90 mt-8 text-2xl font-bold">Tổng Điểm {GRADE_LEVEL_TEXT_MAP[selectedGrade]}: {overallScore}</p>
        </div>
      </div>
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
                onMouseEnter={() => playSound(HOVER_SOUND_FILENAME, HOVER_SOUND_REMOTE_URL, 0.2)}
                className="bg-[var(--button-secondary-bg)] hover:opacity-90 active:brightness-90 text-[var(--button-secondary-text)] font-bold py-3 px-8 rounded-lg shadow-lg text-lg"
              >
                {BACK_TO_MAP_TEXT}
              </button>
              <button
                onClick={handlePlayIslandAgain}
                onMouseEnter={() => playSound(HOVER_SOUND_FILENAME, HOVER_SOUND_REMOTE_URL, 0.2)}
                className="bg-[var(--button-primary-bg)] hover:opacity-90 active:brightness-90 text-[var(--button-primary-text)] font-bold py-3 px-8 rounded-lg shadow-lg text-lg"
              >
                {PLAY_AGAIN_TEXT}
              </button>
              {canGoToNextIsland && nextIsland && (
                  <button
                      onClick={() => { 
                          unlockAudioContext(); 
                          playSound(BUTTON_CLICK_SOUND_FILENAME, BUTTON_CLICK_SOUND_REMOTE_URL); 
                          handleIslandSelect(nextIsland.islandId); 
                      }}
                      onMouseEnter={() => playSound(HOVER_SOUND_FILENAME, HOVER_SOUND_REMOTE_URL, 0.2)}
                      className="bg-[var(--button-primary-bg)] hover:opacity-90 active:brightness-90 text-[var(--button-primary-text)] font-bold py-3 px-8 rounded-lg shadow-lg text-lg"
                  >
                      {NEXT_ISLAND_BUTTON_TEXT}
                  </button>
              )}
          </div>
        </div>
      </div>
    );
  }
  
  if (gameState === 'GradeComplete' && selectedGrade) {
     return (
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
              onMouseEnter={() => playSound(HOVER_SOUND_FILENAME, HOVER_SOUND_REMOTE_URL, 0.2)}
              className="bg-[var(--correct-bg)] hover:opacity-90 active:brightness-90 text-[var(--correct-text)] font-bold py-3 px-8 rounded-lg shadow-lg text-lg transition-transform transform hover:scale-105"
              >
              {PLAY_THIS_GRADE_AGAIN_TEXT}
              </button>
              <button
              onClick={handleChooseAnotherGrade}
              onMouseEnter={() => playSound(HOVER_SOUND_FILENAME, HOVER_SOUND_REMOTE_URL, 0.2)}
              className="bg-[var(--button-secondary-bg)] hover:opacity-90 active:brightness-90 text-[var(--button-secondary-text)] font-bold py-3 px-8 rounded-lg shadow-lg text-lg transition-transform transform hover:scale-105"
              >
              {CHOOSE_ANOTHER_GRADE_TEXT}
              </button>
          </div>
        </div>
      </div>
    );
  }
  
  if (gameState === 'IslandPlaying' && currentQuestion && currentIslandConfig && selectedGrade && selectedIslandDifficulty) {
    const isQuestionResolved = feedback.isCorrect === true || (playerLives === 0 && feedback.isCorrect === false && revealSolution);
    const canAttempt = !isQuestionResolved && !userAttemptShown;
    
    const mainCardExtraClasses = theme === Theme.GIRLY ? '' : (themeConfig.frostedGlassOpacity || '');
    const progressPercentage = questionsForCurrentIsland.length > 0 ? ((currentQuestionIndexInIsland + 1) / questionsForCurrentIsland.length) * 100 : 0;


    return (
      <div className="w-full animate-fadeInScale">
        <div className={`w-full max-w-3xl mx-auto p-4 md:p-6 bg-[var(--primary-bg)] rounded-2xl shadow-2xl border-2 border-[var(--border-color)] ${mainCardExtraClasses}`}>
          <header className="mb-6 text-center relative">
            <button 
              onClick={handleBackToMap}
              onMouseEnter={() => playSound(HOVER_SOUND_FILENAME, HOVER_SOUND_REMOTE_URL, 0.2)}
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
                  playSound(ANSWER_SELECT_SOUND_FILENAME, ANSWER_SELECT_SOUND_REMOTE_URL, 0.4); 
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
              onMouseEnter={() => playSound(HOVER_SOUND_FILENAME, HOVER_SOUND_REMOTE_URL, 0.2)}
              disabled={isHintLoading || hintButtonUsed || !canAttempt || isQuestionResolved}
              className="flex items-center justify-center gap-2 bg-[var(--button-secondary-bg)] hover:opacity-90 active:brightness-90 text-[var(--button-secondary-text)] font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 w-full md:w-auto"
            >
              <LightbulbIcon className="w-6 h-6" />
              {isHintLoading ? HINT_LOADING_MESSAGE : (hint && !isHintLoading && hintButtonUsed ? 'Xem lại gợi ý' : 'Nhận Gợi Ý')}
            </button>

            <button
              onClick={handleAnswerSubmit}
              onMouseEnter={() => playSound(HOVER_SOUND_FILENAME, HOVER_SOUND_REMOTE_URL, 0.2)}
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
              playSound(BUTTON_CLICK_SOUND_FILENAME, BUTTON_CLICK_SOUND_REMOTE_URL); 
              setIsHintModalOpen(false); 
            }}
            hint={hint}
            isLoading={isHintLoading}
          />
        </div>
      </div>
    );
  }

  return <LoadingSpinner text="Đang chuẩn bị Đảo Kho Báu..." />;
};

export default GameScreen;
