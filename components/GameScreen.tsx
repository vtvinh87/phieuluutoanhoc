
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Question, IslandConfig, IslandStatus, IslandProgressState, GradeLevel, IslandStarRatingsState } from '../types';
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
  CHOOSE_GRADE_TEXT,
  CHOOSE_ISLAND_TEXT,
  ISLAND_TEXT,
  QUESTION_TEXT,
  SCORE_TEXT,
  BACK_TO_MAP_TEXT,
  ISLAND_COMPLETE_TEXT,
  GRADE_COMPLETE_TEXT, 
  LOCKED_ISLAND_TEXT,
  ISLAND_LOADING_MESSAGE_DETAIL,
  ISLAND_PREPARING_MESSAGE,
  PLAY_AGAIN_TEXT,
  CHOOSE_ANOTHER_GRADE_TEXT,
  PLAY_THIS_GRADE_AGAIN_TEXT,
  NO_ISLANDS_FOR_GRADE_TEXT,
  START_ADVENTURE_TEXT,
  TRAVELLING_TO_ISLAND_TEXT,
  UPDATING_MAP_TEXT,
  RETURN_TO_GRADE_SELECTION_TEXT,
  NEXT_ISLAND_BUTTON_TEXT,
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
  BUTTON_CLICK_SOUND_URL
} from '../constants';
import { getMathHint, generateMathQuestion } from '../services/geminiService';
import QuestionDisplay from './QuestionDisplay';
import AnswerOption from './AnswerOption';
import FeedbackIndicator from './FeedbackIndicator';
import HintModal from './HintModal';
import LoadingSpinner from './LoadingSpinner';
import { LightbulbIcon, SparklesIcon, AlertTriangleIcon, XCircleIcon as LockIcon, StarIconFilled, StarIconOutline } from './icons';
import confetti from 'canvas-confetti';

type GameState = 'GradeSelection' | 'IslandMap' | 'IslandPlaying' | 'IslandComplete' | 'GradeComplete' | 'Transitioning' | 'Error';

interface TransitionDetails {
  message: string;
  duration?: number;
  onComplete: () => void;
}

const GameScreen: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('GradeSelection');
  const [transitionDetails, setTransitionDetails] = useState<TransitionDetails | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel | null>(null);
  const [islandProgress, setIslandProgress] = useState<IslandProgressState>({});
  const [islandStarRatings, setIslandStarRatings] = useState<IslandStarRatingsState>({});
  const [currentIslandId, setCurrentIslandId] = useState<string | null>(null);
  
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

  const [preloadedIslandQuestions, setPreloadedIslandQuestions] = useState<Record<string, Question[]>>({});

  const unlockAudioContext = useCallback(() => {
    if (!audioUnlocked) {
      setAudioUnlocked(true);
    }
  }, [audioUnlocked]);

  const playSound = useCallback((soundUrl: string, volume: number = 0.5) => {
    if (!audioUnlocked) {
      return;
    }
    if (!soundUrl || soundUrl.startsWith("YOUR_") || soundUrl.endsWith("_HERE")) {
        return;
    }

    try {
      let audio = audioCache.current[soundUrl];
      if (!audio) {
        audio = new Audio(soundUrl);
        audio.volume = volume;
        audio.onerror = null; 
        audio.onerror = (_e) => {
          // console.error(`Error loading audio source: ${soundUrl}`, e);
        };
        audioCache.current[soundUrl] = audio;
      }
      audio.currentTime = 0; 
      audio.play().catch(_e => {}); // console.warn(`Audio play() promise rejected for ${soundUrl}:`, e));
    } catch (error) {
      // console.warn(`General error playing sound ${soundUrl}:`, error);
    }
  }, [audioUnlocked, audioCache]);


  // localStorage Helpers
  const loadLastSelectedGrade = (): GradeLevel | null => {
    const savedGrade = localStorage.getItem(LAST_SELECTED_GRADE_KEY);
    return savedGrade ? parseInt(savedGrade) as GradeLevel : null;
  };
  const saveLastSelectedGrade = (grade: GradeLevel | null) => {
    if (grade) {
      localStorage.setItem(LAST_SELECTED_GRADE_KEY, grade.toString());
    } else {
      localStorage.removeItem(LAST_SELECTED_GRADE_KEY);
    }
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
    if (!process.env.API_KEY) {
      setApiKeyMissing(true);
      setGameState('Error');
      setLoadingError(API_KEY_ERROR_MESSAGE);
      return; 
    }

    const lastGrade = loadLastSelectedGrade();
    if (lastGrade) {
      handleGradeSelect(lastGrade, true); 
    } else {
      setGameState('GradeSelection'); 
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 


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
        callback();
      }, transitionDetails.duration || 1500);
      return () => clearTimeout(timer);
    }
  }, [gameState, transitionDetails]);

  useEffect(() => {
    let animationInterval: number | undefined;
    if (gameState === 'IslandComplete') {
      if(audioUnlocked) playSound(VICTORY_FANFARE_SOUND_URL, 0.6);
      const duration = 2 * 1000; 
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      animationInterval = window.setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
          return clearInterval(animationInterval);
        }
        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);
    }
    return () => {
      if (animationInterval) {
        clearInterval(animationInterval);
      }
    };
  }, [gameState, playSound, audioUnlocked]);


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
    setPlayerLives(MAX_PLAYER_LIVES);
    setIslandScore(0);
  }, [resetForNewQuestion]);

  const resetForNewGradeJourney = useCallback(() => {
    resetForNewIslandPlay(); 
    setQuestionsForCurrentIsland([]);
    setCurrentQuestionIndexInIsland(0);
    setCurrentIslandId(null);
    setLoadingError(null);
    setOverallScore(0); 
    setIslandProgress({}); 
    setIslandStarRatings({});
    setTransitionDetails(null); 
    setPreloadedIslandQuestions({});
  }, [resetForNewIslandPlay]);

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

      if (savedScore !== null) {
        setOverallScore(savedScore);
      } else {
        setOverallScore(0);
        saveOverallScoreToStorage(grade, 0); 
      }

      if (savedStarRatings) {
        setIslandStarRatings(savedStarRatings);
      } else {
        setIslandStarRatings({});
        saveIslandStarRatingsToStorage(grade, {});
      }
      
      setGameState('IslandMap'); 
      
    } else {
      setGameState('Error');
      setLoadingError(NO_ISLANDS_FOR_GRADE_TEXT);
    }
  };

  const initiatePreloadForNextIsland = useCallback(async (currentLoadedIslandId: string) => {
    if (!selectedGrade || apiKeyMissing) {
        return;
    }

    const currentIslandIndex = islandsForCurrentGrade.findIndex(i => i.islandId === currentLoadedIslandId);
    if (currentIslandIndex === -1) {
        return; 
    }
    if (currentIslandIndex >= islandsForCurrentGrade.length - 1) {
        return;
    }

    const nextIslandToPreload = islandsForCurrentGrade[currentIslandIndex + 1];
    if (!nextIslandToPreload) {
        return;
    }
    if (preloadedIslandQuestions[nextIslandToPreload.islandId]) {
        return;
    }
    
    const questionPromises: Promise<Question | null>[] = [];
    for (let i = 0; i < QUESTIONS_PER_ISLAND; i++) {
        questionPromises.push(
            generateMathQuestion(
                nextIslandToPreload.targetGradeLevel,
                nextIslandToPreload.topics,
                nextIslandToPreload.name 
            ).then(q => q ? { ...q, islandId: nextIslandToPreload.islandId, islandName: nextIslandToPreload.name } : null)
        );
    }

    try {
        const results = await Promise.all(questionPromises);
        const successfullyFetchedQuestions = results.filter(q => q !== null) as Question[];

        if (successfullyFetchedQuestions.length === QUESTIONS_PER_ISLAND) {
             setPreloadedIslandQuestions(prev => ({
                ...prev,
                [nextIslandToPreload.islandId]: successfullyFetchedQuestions
            }));
        } else {
            // Silently fail preload if not all questions are fetched. Game will fetch normally later.
        }
    } catch (error) {
        // Silently fail preload on critical error. Game will fetch normally later.
    }
  }, [selectedGrade, islandsForCurrentGrade, preloadedIslandQuestions, apiKeyMissing]);


  const fetchQuestionsForIsland = useCallback(async (islandIdToLoad: string) => {
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

    if (preloadedIslandQuestions[islandIdToLoad]) {
        setQuestionsForCurrentIsland(preloadedIslandQuestions[islandIdToLoad]);
        setCurrentIslandId(islandIdToLoad);
        resetForNewIslandPlay();
        setGameState('IslandPlaying');
        setIsIslandLoading(false); 
        setIslandLoadingProgressMessage(null); 
        
        setPreloadedIslandQuestions(prev => {
            const newPreloaded = { ...prev };
            delete newPreloaded[islandIdToLoad];
            return newPreloaded;
        });
        initiatePreloadForNextIsland(islandIdToLoad); 
        return;
    }
    
    setIsIslandLoading(true); 
    setLoadingError(null);
    setIslandLoadingProgressMessage(ISLAND_PREPARING_MESSAGE(islandConfig.name)); 
    setTransitionDetails(null); 
    const fetchedQuestions: Question[] = [];

    try {
      for (let i = 0; i < QUESTIONS_PER_ISLAND; i++) {
        setIslandLoadingProgressMessage(ISLAND_LOADING_MESSAGE_DETAIL(islandConfig.name, i + 1, QUESTIONS_PER_ISLAND));
        const newQuestion = await generateMathQuestion(islandConfig.targetGradeLevel, islandConfig.topics, islandConfig.name);
        if (newQuestion) {
          fetchedQuestions.push({...newQuestion, islandId: islandConfig.islandId, islandName: islandConfig.name });
        } else {
          throw new Error(`${QUESTION_GENERATION_ERROR_MESSAGE} (Câu hỏi ${i + 1} cho ${islandConfig.name})`);
        }
      }
      
      if (fetchedQuestions.length === QUESTIONS_PER_ISLAND) {
          setQuestionsForCurrentIsland(fetchedQuestions);
          setCurrentIslandId(islandIdToLoad); 
          resetForNewIslandPlay(); 
          setGameState('IslandPlaying');
          initiatePreloadForNextIsland(islandIdToLoad); 
      } else {
        throw new Error(`Không thể tải đủ ${QUESTIONS_PER_ISLAND} câu hỏi cho ${islandConfig.name}.`);
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : QUESTION_GENERATION_ERROR_MESSAGE;
      setLoadingError(errorMessage);
      setGameState('Error');
    } finally {
      setIsIslandLoading(false);
      setIslandLoadingProgressMessage(null);
    }
  }, [apiKeyMissing, selectedGrade, islandsForCurrentGrade, resetForNewIslandPlay, preloadedIslandQuestions, initiatePreloadForNextIsland]);

  const handleIslandSelect = (islandId: string) => {
    unlockAudioContext(); 
    const status = islandProgress[islandId];
    const islandConfig = islandsForCurrentGrade.find(i => i.islandId === islandId);

    if (islandConfig && (status === 'unlocked' || status === 'completed')) {
        playSound(ISLAND_SELECT_SOUND_URL, 0.6);
        setQuestionsForCurrentIsland([]); 
        setCurrentQuestionIndexInIsland(0); 
        setLoadingError(null);
        
        setTransitionDetails({
            message: TRAVELLING_TO_ISLAND_TEXT(islandConfig.name),
            duration: 1800, 
            onComplete: () => fetchQuestionsForIsland(islandId)
        });
        setGameState('Transitioning');
    } else {
        playSound(INCORRECT_ANSWER_SOUND_URL, 0.3);
        alert(LOCKED_ISLAND_TEXT); 
    }
  };

  const restartCurrentIsland = () => {
    unlockAudioContext();
    playSound(BUTTON_CLICK_SOUND_URL);
    setPlayerLives(MAX_PLAYER_LIVES);
    setCurrentQuestionIndexInIsland(0);
    setIslandScore(0); 
    resetForNewQuestion(); 
    setFeedback({ isCorrect: null, message: `Bắt đầu lại ${currentIslandConfig?.name || 'hòn đảo'}!`});
  };

  const handleNextQuestionInIsland = useCallback(() => {
    if (!selectedGrade || !currentIslandId) return; 

    if (currentQuestionIndexInIsland < questionsForCurrentIsland.length - 1) {
      resetForNewQuestion(); 
      setCurrentQuestionIndexInIsland(prev => prev + 1);
    } else {
      const completedIslandId = currentIslandId;
      let starsEarned = 0;
      if (playerLives === MAX_PLAYER_LIVES) starsEarned = 5;
      else if (playerLives === MAX_PLAYER_LIVES - 1) starsEarned = 4;
      else if (playerLives >= MAX_PLAYER_LIVES - 2) starsEarned = 3;
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
          setGameState('GradeComplete');
      } else {
          setGameState('IslandComplete');
      }
    }
  }, [currentQuestionIndexInIsland, questionsForCurrentIsland.length, resetForNewQuestion, currentIslandId, islandsForCurrentGrade, islandProgress, selectedGrade, playerLives, islandStarRatings]);

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
    const allGradeIslandsCompleted = islandsForCurrentGrade.every(island => islandProgress[island.islandId] === 'completed');
    
    setCurrentIslandId(null);
    setQuestionsForCurrentIsland([]);
    setCurrentQuestionIndexInIsland(0);
    resetForNewQuestion();

    setTransitionDetails({
        message: UPDATING_MAP_TEXT,
        duration: 1000, 
        onComplete: () => {
            setTransitionDetails(null); 
            if (allGradeIslandsCompleted && islandsForCurrentGrade.length >= ISLANDS_PER_GRADE) {
                setGameState('GradeComplete');
            } else {
                setGameState('IslandMap');
            }
        }
    });
    setGameState('Transitioning');
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
    if (currentIslandId && selectedGrade) { 
        fetchQuestionsForIsland(currentIslandId);
    } else if (selectedGrade) { 
        const firstUnlockedIslandForGrade = islandsForCurrentGrade.find(i => islandProgress[i.islandId] === 'unlocked');
        if (firstUnlockedIslandForGrade) {
            fetchQuestionsForIsland(firstUnlockedIslandForGrade.islandId);
        } else {
            setGameState(islandsForCurrentGrade.length > 0 ? 'IslandMap' : 'GradeSelection');
        }
    } else { 
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
            ? <StarIconFilled key={i} className="w-5 h-5 text-yellow-400" /> 
            : <StarIconOutline key={i} className="w-5 h-5 text-yellow-400 opacity-50" />
        )}
      </div>
    );
  };

  // --- RENDER LOGIC ---

  if (apiKeyMissing && gameState === 'Error' && loadingError === API_KEY_ERROR_MESSAGE) {
     return (
       <div className="bg-red-800 text-white p-8 rounded-lg shadow-xl text-center max-w-lg mx-auto animate-fadeIn">
         <AlertTriangleIcon className="w-16 h-16 mx-auto mb-4 text-yellow-300" />
         <h1 className="text-3xl font-bold mb-4">Lỗi Cấu Hình</h1>
         <p className="text-xl mb-6">{API_KEY_ERROR_MESSAGE}</p>
          <button
            onClick={() => { unlockAudioContext(); playSound(BUTTON_CLICK_SOUND_URL); window.location.reload(); }}
            className="bg-yellow-500 hover:bg-yellow-600 text-red-900 font-bold py-3 px-6 rounded-lg"
        >
            Tải Lại Trang
        </button>
       </div>
     );
  }
  
  if (gameState === 'Transitioning' && transitionDetails) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[300px]">
        <LoadingSpinner text={transitionDetails.message} size="w-20 h-20" />
      </div>
    );
  }

  if (isIslandLoading) { 
     return (
      <div className="flex flex-col items-center justify-center h-full min-h-[300px]">
        <LoadingSpinner text={islandLoadingProgressMessage || `Đang tải hòn đảo...`} size="w-20 h-20" />
      </div>
    );
  }
  
  if (gameState === 'Error') {
    return (
      <div className="bg-red-800 text-white p-8 rounded-lg shadow-xl text-center max-w-lg mx-auto animate-fadeIn">
        <AlertTriangleIcon className="w-16 h-16 mx-auto mb-4 text-yellow-300" />
        <h1 className="text-3xl font-bold mb-4">Lỗi</h1>
        <p className="text-xl mb-6">{loadingError || "Đã có lỗi xảy ra."}</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => { unlockAudioContext(); playSound(BUTTON_CLICK_SOUND_URL); handleChooseAnotherGrade(); }}
              className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-6 rounded-lg"
            >
              {RETURN_TO_GRADE_SELECTION_TEXT}
            </button>
            {loadingError !== NO_ISLANDS_FOR_GRADE_TEXT && loadingError !== API_KEY_ERROR_MESSAGE && (
                 <button
                    onClick={handleRetryFetchIsland}
                    className="bg-yellow-500 hover:bg-yellow-600 text-red-900 font-bold py-3 px-6 rounded-lg"
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
      <div className="w-full max-w-xl mx-auto p-6 md:p-8 bg-sky-700 bg-opacity-80 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-sky-400">
        <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 mb-8 text-center">
          {CHOOSE_GRADE_TEXT}
        </h1>
        <div className="grid grid-cols-1 gap-4">
          {(Object.keys(GradeLevel).filter(key => !isNaN(Number(GradeLevel[key as keyof typeof GradeLevel]))) as (keyof typeof GradeLevel)[]).map((gradeKey) => {
            const gradeValue = GradeLevel[gradeKey];
            return (
              <button
                key={gradeValue}
                onClick={() => handleGradeSelect(gradeValue as GradeLevel)}
                onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)}
                className="p-4 rounded-lg shadow-lg transition-transform transform hover:scale-105 bg-yellow-500 hover:bg-yellow-600 text-gray-800 font-bold text-2xl"
              >
                {GRADE_LEVEL_TEXT_MAP[gradeValue as GradeLevel]}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (gameState === 'IslandMap' && selectedGrade) {
    if (islandsForCurrentGrade.length === 0 || islandsForCurrentGrade.length < ISLANDS_PER_GRADE) { 
        return (
             <div className="bg-yellow-700 text-white p-8 rounded-lg shadow-xl text-center max-w-lg mx-auto animate-fadeIn">
                <AlertTriangleIcon className="w-16 h-16 mx-auto mb-4 text-sky-200" />
                <h1 className="text-3xl font-bold mb-4">Thông Báo Cấu Hình</h1>
                <p className="text-xl mb-6">
                  {islandsForCurrentGrade.length === 0 
                    ? NO_ISLANDS_FOR_GRADE_TEXT 
                    : `Lớp ${GRADE_LEVEL_TEXT_MAP[selectedGrade]} chưa có đủ ${ISLANDS_PER_GRADE} hòn đảo được thiết kế. Vui lòng kiểm tra lại file constants.ts.`
                  }
                </p>
                <button
                    onClick={handleChooseAnotherGrade}
                    className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-6 rounded-lg"
                >
                    {CHOOSE_ANOTHER_GRADE_TEXT}
                </button>
            </div>
        );
    }
    return (
      <div className="w-full max-w-4xl mx-auto p-6 md:p-8 bg-sky-700 bg-opacity-80 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-sky-400">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500">
            {CHOOSE_ISLAND_TEXT}
            </h1>
            <button 
                onClick={handleChooseAnotherGrade}
                onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md text-sm"
            >
                {CHOOSE_ANOTHER_GRADE_TEXT}
            </button>
        </div>
         <p className="text-center text-yellow-100 mb-1 text-2xl">Lớp: {GRADE_LEVEL_TEXT_MAP[selectedGrade]}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {islandsForCurrentGrade.map((island) => {
            const status = islandProgress[island.islandId] || 'locked'; 
            const isDisabled = status === 'locked';
            let bgColor = 'bg-gray-500 hover:bg-gray-600';
             let textColor = 'text-gray-300';
            let ringColor = 'ring-gray-700';

            if (status === 'completed') {
                bgColor = 'bg-green-600 hover:bg-green-700';
                textColor = 'text-white';
                ringColor = 'ring-green-400';
            } else if (status === 'unlocked') {
                bgColor = 'bg-yellow-500 hover:bg-yellow-600';
                textColor = 'text-gray-800';
                ringColor = 'ring-yellow-300';
            }
            
            return (
              <button
                key={island.islandId}
                onClick={() => !isDisabled && handleIslandSelect(island.islandId)}
                onMouseEnter={() => !isDisabled && playSound(HOVER_SOUND_URL, 0.2)}
                disabled={isDisabled}
                className={`p-4 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 ${bgColor} ${textColor} min-h-[180px] flex flex-col justify-between items-center text-center focus:outline-none focus:ring-4 ${ringColor} ${isDisabled ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                <div className="flex-grow flex flex-col items-center justify-center">
                  <span className="text-3xl mb-1">{island.mapIcon}</span>
                  <h2 className="text-lg font-bold leading-tight">{island.name}</h2>
                  <p className="text-xs mt-1 px-1 opacity-90">{island.description}</p>
                </div>
                <div className="mt-2 h-6">
                    {isDisabled && <LockIcon className="w-6 h-6 text-red-200" />}
                    {status === 'completed' ? renderStars(island.islandId) : null}
                </div>
              </button>
            );
          })}
        </div>
         <p className="text-center text-yellow-200 mt-8 text-2xl font-bold">Tổng Điểm {GRADE_LEVEL_TEXT_MAP[selectedGrade]}: {overallScore}</p>
      </div>
    );
  }
  
  if (gameState === 'IslandComplete' && currentIslandConfig && selectedGrade) {
    const currentCompletedIslandIndex = islandsForCurrentGrade.findIndex(i => i.islandId === currentIslandId);
    const nextIsland = (currentCompletedIslandIndex !== -1 && currentCompletedIslandIndex < islandsForCurrentGrade.length - 1)
                        ? islandsForCurrentGrade[currentCompletedIslandIndex + 1]
                        : null;
    const canGoToNextIsland = nextIsland && islandProgress[nextIsland.islandId] === 'unlocked';
    const starsAchieved = islandStarRatings[currentIslandConfig.islandId] || 0;

    return (
      <div className="bg-gradient-to-br from-green-500 to-teal-600 text-white p-8 md:p-12 rounded-xl shadow-2xl text-center max-w-2xl mx-auto animate-fadeIn">
        <div className="flex justify-center mb-4">
           {renderStars(currentIslandConfig.islandId)}
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{ISLAND_COMPLETE_TEXT}</h1>
        <p className="text-2xl mb-2">{currentIslandConfig.name}</p>
         <p className="text-xl mb-2">Bạn đạt được: {starsAchieved} sao!</p>
        <p className="text-3xl font-bold mb-4">Điểm đảo này: {islandScore}</p>
        <p className="text-3xl font-bold mb-8">Tổng điểm {GRADE_LEVEL_TEXT_MAP[selectedGrade]}: {overallScore}</p>
        <p className="text-xl mb-4">Bạn được thưởng +1 lượt thử! Hiện có: {playerLives}/{MAX_PLAYER_LIVES} lượt.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
            <button
            onClick={handleBackToMap}
            onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)}
            className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg text-lg"
            >
            {BACK_TO_MAP_TEXT}
            </button>
            {canGoToNextIsland && nextIsland && (
                 <button
                    onClick={() => { unlockAudioContext(); playSound(ISLAND_SELECT_SOUND_URL, 0.6); handleIslandSelect(nextIsland.islandId); }}
                    onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-green-900 font-bold py-3 px-8 rounded-lg shadow-lg text-lg"
                >
                    {NEXT_ISLAND_BUTTON_TEXT}
                </button>
            )}
        </div>
      </div>
    );
  }
  
  if (gameState === 'GradeComplete' && selectedGrade) {
     return (
      <div className="bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-600 text-gray-800 p-8 md:p-12 rounded-xl shadow-2xl text-center max-w-2xl mx-auto animate-fadeIn">
        <SparklesIcon className="w-24 h-24 mx-auto mb-6 text-white"/>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{GRADE_COMPLETE_TEXT}</h1>
        <p className="text-2xl mb-2">{GRADE_LEVEL_TEXT_MAP[selectedGrade]}</p>
        <p className="text-5xl md:text-6xl font-extrabold text-white mb-8 drop-shadow-lg">{overallScore} <span className="text-3xl">điểm</span></p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
            onClick={handlePlayThisGradeAgain}
            onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg text-lg transition-transform transform hover:scale-105"
            >
            {PLAY_THIS_GRADE_AGAIN_TEXT}
            </button>
            <button
            onClick={handleChooseAnotherGrade}
            onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)}
            className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg text-lg transition-transform transform hover:scale-105"
            >
            {CHOOSE_ANOTHER_GRADE_TEXT}
            </button>
        </div>
      </div>
    );
  }
  
  if (gameState === 'IslandPlaying' && currentQuestion && currentIslandConfig && selectedGrade) {
    const isQuestionResolved = feedback.isCorrect === true || (playerLives === 0 && feedback.isCorrect === false && revealSolution);
    const canAttempt = !isQuestionResolved && !userAttemptShown;

    return (
      <div className="w-full max-w-3xl mx-auto p-4 md:p-6 bg-green-800 bg-opacity-70 backdrop-blur-md rounded-2xl shadow-2xl border-2 border-yellow-500">
        <header className="mb-6 text-center relative">
          <button 
            onClick={handleBackToMap}
            onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)}
            className="absolute top-0 left-0 mt-[-8px] ml-[-8px] md:mt-0 md:ml-0 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-3 rounded-lg shadow-md text-sm z-10"
            aria-label="Trở về bản đồ"
            disabled={userAttemptShown && !revealSolution && playerLives > 0} 
          >
            &larr; Bản Đồ
          </button>
          <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 drop-shadow-md pt-12 md:pt-8">
            {currentIslandConfig.mapIcon} {currentIslandConfig.name}
          </h1>
          <p className="text-yellow-200 text-md mt-1">{currentIslandConfig.description}</p>
          <p className="text-yellow-200 text-lg mt-2">
            {GRADE_LEVEL_TEXT_MAP[selectedGrade]} - {QUESTION_TEXT} {currentQuestionIndexInIsland + 1} / {questionsForCurrentIsland.length}
          </p>
          <p className="text-yellow-100 text-xl font-semibold">
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
            className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 w-full md:w-auto"
          >
            <LightbulbIcon className="w-6 h-6" />
            {isHintLoading ? HINT_LOADING_MESSAGE : (hint && !isHintLoading && hintButtonUsed ? 'Xem lại gợi ý' : 'Nhận Gợi Ý')}
          </button>

          <button
            onClick={handleAnswerSubmit}
            onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)}
            disabled={!selectedAnswer || !canAttempt || isQuestionResolved}
            className="bg-yellow-500 hover:bg-yellow-600 text-green-900 font-bold py-3 px-8 rounded-lg shadow-lg transition-all duration-200 text-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 w-full md:w-auto"
          >
            Kiểm Tra
          </button>
        </div>
        <p className="text-center text-yellow-300 mt-4 text-sm">Số lượt thử còn lại: {playerLives} / {MAX_PLAYER_LIVES}</p>

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
    );
  }

  return <LoadingSpinner text="Đang chuẩn bị Đảo Kho Báu..." />;
};

export default GameScreen;
