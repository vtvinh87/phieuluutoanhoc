import { useState, useCallback, useEffect } from 'react';
import { getMathHint } from '../../services/geminiService';
import {
    API_KEY_ERROR_MESSAGE, HINT_UNAVAILABLE_MESSAGE, HINT_GENERATION_ERROR_MESSAGE,
    CHECK_ANSWER_SOUND_URL, CORRECT_ANSWER_SOUND_URL, INCORRECT_ANSWER_SOUND_URL,
    QUESTIONS_PER_ISLAND, QUESTIONS_PER_FINAL_ISLAND, MAX_PLAYER_LIVES,
    ISLAND_DIFFICULTY_TEXT_MAP, GRADE_LEVEL_TEXT_MAP, ENDLESS_MODE_LIVES,
    ENDLESS_QUESTIONS_BATCH_SIZE, ENDLESS_MODE_STREAK_TO_CHANGE_DIFFICULTY,
    ENDLESS_MODE_MAX_DIFFICULTY, ENDLESS_MODE_MIN_DIFFICULTY, FINAL_TREASURE_ISLAND_ID,
    BUTTON_CLICK_SOUND_URL
} from '../../constants';
import {
  DailyChallengeType, WeeklyChallengeType, CHALLENGE_ACTION_CORRECT_ANSWER,
  GradeLevel, IslandDifficulty, Question, IslandConfig, ActivityLogEntry
} from '../../types';
import { loadStudentActivityLog, saveStudentActivityLog } from '../../utils/storage';

// Define props structure
interface UseGameplayHandlersProps {
  gameFlow: any;
  playerStats: any;
  playerProgress: any;
  playerCollections: any;
  questionManager: any;
  challenges: any;
  playSound: (soundUrl: string, volume?: number) => void;
  unlockAudioContext: () => void;
  currentQuestion: Question | undefined;
}

export const useGameplayHandlers = ({
  gameFlow,
  playerStats,
  playerProgress,
  playerCollections,
  questionManager,
  challenges,
  playSound,
  unlockAudioContext,
  currentQuestion,
}: UseGameplayHandlersProps) => {

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean | null; message?: string }>({ isCorrect: null });
  const [isHintModalOpen, setIsHintModalOpen] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const [isHintLoading, setIsHintLoading] = useState(false);
  const [hintButtonUsed, setHintButtonUsed] = useState(false);
  const [hintUsedThisIslandRun, setHintUsedThisIslandRun] = useState(false);
  const [userAttemptShown, setUserAttemptShown] = useState(false);
  const [revealSolution, setRevealSolution] = useState(false);
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);
  const [currentQuestionAttempts, setCurrentQuestionAttempts] = useState<number>(1);
  
  useEffect(() => {
    if (currentQuestion) {
        setQuestionStartTime(Date.now());
    }
  }, [currentQuestion]);

  const resetForNewQuestion = useCallback(() => {
    setSelectedAnswer(null);
    setFeedback({ isCorrect: null });
    setHint(null);
    setHintButtonUsed(false);
    setUserAttemptShown(false);
    setRevealSolution(false);
    setCurrentQuestionAttempts(1);
  }, []);
  
  const resetForNewIslandPlay = useCallback(() => {
    resetForNewQuestion();
    setHintUsedThisIslandRun(false);
  }, [resetForNewQuestion]);

  const handleNextQuestionInIsland = useCallback(() => {
    if (!gameFlow.selectedGrade || !gameFlow.currentIslandId || gameFlow.selectedIslandDifficulty === null) return;
    
    challenges.resetStreakChallengesIfNeeded(false);

    const questionsToComplete = gameFlow.currentIslandConfig?.targetGradeLevel === GradeLevel.FINAL
      ? QUESTIONS_PER_FINAL_ISLAND
      : QUESTIONS_PER_ISLAND;
    
    const nextQuestionIndex = questionManager.currentQuestionIndexInIsland + 1;

    if (nextQuestionIndex < questionsToComplete) {
      questionManager.setCurrentQuestionIndexInIsland(nextQuestionIndex);
      resetForNewQuestion();
    } else {
      const isGradeNowComplete = playerProgress.completeIsland(
          gameFlow.selectedGrade, 
          gameFlow.currentIslandId, 
          playerStats.playerLives, 
          hintUsedThisIslandRun,
          gameFlow.islandsForCurrentGrade
      );
      playerStats.setPlayerLives(prev => Math.min(prev + 1, MAX_PLAYER_LIVES));
      gameFlow.setGameState(isGradeNowComplete ? 'GradeComplete' : 'IslandComplete');
    }
  }, [
    gameFlow.selectedGrade, gameFlow.currentIslandId, gameFlow.selectedIslandDifficulty,
    questionManager.currentQuestionIndexInIsland, gameFlow.currentIslandConfig,
    challenges.resetStreakChallengesIfNeeded, resetForNewQuestion,
    playerProgress.completeIsland, playerStats.setPlayerLives, gameFlow.setGameState,
    playerStats.playerLives, hintUsedThisIslandRun, gameFlow.islandsForCurrentGrade
  ]);

  const handleNextEndlessQuestion = useCallback(() => {
    resetForNewQuestion();
    if (questionManager.currentEndlessQuestionIndex < questionManager.endlessQuestionBatch.length - 1) {
      questionManager.setCurrentEndlessQuestionIndex(prev => prev + 1);
    } else {
      if (questionManager.preloadedEndlessBatch.length > 0) {
        questionManager.setEndlessQuestionBatch(questionManager.preloadedEndlessBatch);
        questionManager.setPreloadedEndlessBatch([]);
        questionManager.setCurrentEndlessQuestionIndex(0);
      } else if (playerStats.currentEndlessGrade !== null) {
        questionManager.fetchNextEndlessBatch(playerStats.currentEndlessGrade, playerStats.endlessDifficultyLevel);
      } else {
        gameFlow.setGameState('Error');
        questionManager.setLoadingError("Lỗi chế độ vô tận.");
      }
    }
  }, [
    resetForNewQuestion, questionManager, playerStats.currentEndlessGrade, playerStats.endlessDifficultyLevel, gameFlow
  ]);

  const handleAnswerSubmit = useCallback(() => {
    unlockAudioContext();
    if (!selectedAnswer || !currentQuestion) return;

    const logResolvedQuestion = (isCorrect: boolean) => {
        if (!currentQuestion) return;

        const difficultyLevelToEndlessDifficulty = (level: number): IslandDifficulty => {
            if (level <= 3) return IslandDifficulty.EASY;
            if (level <= 7) return IslandDifficulty.MEDIUM;
            return IslandDifficulty.HARD;
        };

        const difficulty = gameFlow.gameState === 'IslandPlaying' 
            ? gameFlow.selectedIslandDifficulty 
            : difficultyLevelToEndlessDifficulty(playerStats.endlessDifficultyLevel);

        const newLogEntry: ActivityLogEntry = {
            timestamp: Date.now(),
            islandId: currentQuestion.islandId,
            questionTopic: currentQuestion.topic,
            isCorrect,
            timeTaken: Date.now() - questionStartTime,
            difficulty: difficulty!,
            hintUsed: hintButtonUsed,
            attempts: currentQuestionAttempts,
        };
        const currentLog = loadStudentActivityLog();
        currentLog.push(newLogEntry);
        saveStudentActivityLog(currentLog);
        // Dispatch a custom event to notify dashboards of the update
        window.dispatchEvent(new CustomEvent('activityLogged'));
    };

    playSound(CHECK_ANSWER_SOUND_URL, 0.6);
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    setUserAttemptShown(true);

    if (challenges.activeDailyChallenge?.type === DailyChallengeType.CORRECT_ANSWERS_IN_A_ROW) {
      challenges.updateDailyChallengeProgress(CHALLENGE_ACTION_CORRECT_ANSWER, isCorrect ? 1 : 0);
    }
    if (isCorrect) {
        challenges.updateDailyChallengeProgress(CHALLENGE_ACTION_CORRECT_ANSWER);
        challenges.updateWeeklyChallengeProgress(CHALLENGE_ACTION_CORRECT_ANSWER);
    }
    
    if (isCorrect) {
      playSound(CORRECT_ANSWER_SOUND_URL, 0.5);
      setFeedback({ isCorrect: true, message: "Chính xác! Tuyệt vời!" });
      setRevealSolution(true);
      logResolvedQuestion(true);
      const pointsEarned = hintButtonUsed ? 2 : 5;

      if (gameFlow.gameState === 'EndlessPlaying') {
        playerStats.updateEndlessScore(pointsEarned);
        const newStreak = playerStats.endlessCorrectStreak + 1;
        playerStats.setEndlessCorrectStreak(newStreak);
        playerStats.setEndlessIncorrectStreak(0);
        if (newStreak > 0 && newStreak % ENDLESS_MODE_STREAK_TO_CHANGE_DIFFICULTY === 0) {
            const newLevel = Math.min(playerStats.endlessDifficultyLevel + 1, ENDLESS_MODE_MAX_DIFFICULTY);
            if (newLevel !== playerStats.endlessDifficultyLevel) {
                playerStats.setEndlessDifficultyLevel(newLevel);
                questionManager.setPreloadedEndlessBatch([]);
            }
        }
        
        if (questionManager.currentEndlessQuestionIndex === 2 && playerStats.currentEndlessGrade) {
          questionManager.preloadNextEndlessBatch(playerStats.currentEndlessGrade, playerStats.endlessDifficultyLevel);
        }
        setTimeout(() => handleNextEndlessQuestion(), 1500);

      } else { // IslandPlaying
        playerStats.updateIslandScore(pointsEarned, gameFlow.selectedGrade);

        if (questionManager.currentQuestionIndexInIsland === 0) {
            const currentIndex = gameFlow.islandsForCurrentGrade.findIndex((i: IslandConfig) => i.islandId === gameFlow.currentIslandId);
            if (currentIndex !== -1 && currentIndex < gameFlow.islandsForCurrentGrade.length - 1) {
                const nextIsland = gameFlow.islandsForCurrentGrade[currentIndex + 1];
                if (nextIsland && gameFlow.selectedGrade && gameFlow.selectedIslandDifficulty) {
                    questionManager.preloadIslandQuestions(nextIsland.islandId, gameFlow.selectedIslandDifficulty, gameFlow.selectedGrade, gameFlow.islandsForCurrentGrade);
                }
            }
        }
        
        setTimeout(() => handleNextQuestionInIsland(), 1500);
      }
    } else { // Incorrect answer
      playSound(INCORRECT_ANSWER_SOUND_URL, 0.4);
      
      if (gameFlow.gameState === 'EndlessPlaying') {
        playerStats.setEndlessCorrectStreak(0);
        const newIncorrectStreak = playerStats.endlessIncorrectStreak + 1;
        playerStats.setEndlessIncorrectStreak(newIncorrectStreak);
        if (newIncorrectStreak > 0 && newIncorrectStreak % ENDLESS_MODE_STREAK_TO_CHANGE_DIFFICULTY === 0) {
            const newLevel = Math.max(playerStats.endlessDifficultyLevel - 1, ENDLESS_MODE_MIN_DIFFICULTY);
             if (newLevel !== playerStats.endlessDifficultyLevel) {
                playerStats.setEndlessDifficultyLevel(newLevel);
                questionManager.setPreloadedEndlessBatch([]);
            }
        }

        const newLives = playerStats.endlessModeLives - 1;
        playerStats.setEndlessModeLives(newLives);
        if (newLives <= 0) {
          setRevealSolution(true);
          setFeedback({ isCorrect: false, message: `Hết lượt! Đáp án đúng là: ${currentQuestion.correctAnswer}.` });
          logResolvedQuestion(false);
          setTimeout(() => gameFlow.setGameState('EndlessSummary'), 3000);
        } else {
          setFeedback({ isCorrect: false, message: `Sai rồi! Bạn còn ${newLives} lượt thử.` });
          setTimeout(() => { setSelectedAnswer(null); setUserAttemptShown(false); setFeedback({ isCorrect: null }); setCurrentQuestionAttempts(prev => prev + 1); }, 1500);
        }
      } else { // IslandPlaying
        const newLives = playerStats.playerLives - 1;
        playerStats.setPlayerLives(newLives);
        if (newLives <= 0) {
          setRevealSolution(true);
          setFeedback({ isCorrect: false, message: `Hết lượt! Đáp án đúng là: ${currentQuestion.correctAnswer}.` });
          logResolvedQuestion(false);
          setTimeout(() => handleNextQuestionInIsland(), 3000);
        } else {
          setFeedback({ isCorrect: false, message: `Sai rồi! Bạn còn ${newLives} lượt thử.` });
          setTimeout(() => { setSelectedAnswer(null); setUserAttemptShown(false); setFeedback({ isCorrect: null }); setCurrentQuestionAttempts(prev => prev + 1); }, 1500);
        }
      }
    }
  }, [
    selectedAnswer, currentQuestion, gameFlow.gameState, unlockAudioContext, playSound,
    challenges, hintButtonUsed, playerStats, questionManager, questionStartTime, currentQuestionAttempts,
    handleNextQuestionInIsland, handleNextEndlessQuestion,
    gameFlow.islandsForCurrentGrade, gameFlow.currentIslandId, gameFlow.selectedGrade, gameFlow.selectedIslandDifficulty
  ]);

  const handleHintRequest = useCallback(async () => {
    unlockAudioContext();
    playSound(BUTTON_CLICK_SOUND_URL);
    const { apiKeyMissing } = questionManager;
    if (!currentQuestion || apiKeyMissing) {
      setHint(apiKeyMissing ? API_KEY_ERROR_MESSAGE : HINT_UNAVAILABLE_MESSAGE);
      setIsHintModalOpen(true);
      return;
    }
    setIsHintLoading(true);
    setIsHintModalOpen(true);
    setHintButtonUsed(true);
    if (gameFlow.gameState !== 'EndlessPlaying') setHintUsedThisIslandRun(true);
    try {
      const fetchedHint = await getMathHint(currentQuestion.text, currentQuestion.targetGradeLevel);
      setHint(fetchedHint);
    } catch (error) {
      setHint(HINT_GENERATION_ERROR_MESSAGE);
    } finally {
      setIsHintLoading(false);
    }
  }, [currentQuestion, questionManager.apiKeyMissing, unlockAudioContext, playSound, gameFlow.gameState]);

  // Props assemblers for screen components
  const getIslandPlayingScreenProps = () => ({
    currentQuestion: currentQuestion!,
    currentIslandConfig: gameFlow.currentIslandConfig!,
    selectedIslandDifficulty: gameFlow.selectedIslandDifficulty!,
    playerLives: playerStats.playerLives,
    selectedAnswer,
    userAttemptShown,
    feedback,
    revealSolution,
    currentQuestionIndexInIsland: questionManager.currentQuestionIndexInIsland,
    isHintModalOpen,
    hintButtonUsed,
    onAnswerSelect: (answer: string) => { setSelectedAnswer(answer); playSound("https://cdn.pixabay.com/download/audio/2025/02/25/audio_07b0c21a3b.mp3?filename=button-305770.mp3", 0.4); },
    onAnswerSubmit: handleAnswerSubmit,
    onHintRequest: handleHintRequest,
    onBackToMap: gameFlow.handleBackToMap,
    playSound
  });

  const getEndlessPlayingScreenProps = () => ({
    currentQuestion: currentQuestion!,
    currentEndlessGrade: playerStats.currentEndlessGrade!,
    endlessModeLives: playerStats.endlessModeLives,
    endlessModeScore: playerStats.endlessModeScore,
    endlessQuestionsAnswered: playerStats.endlessQuestionsAnswered,
    endlessDifficultyLevel: playerStats.endlessDifficultyLevel,
    selectedAnswer,
    userAttemptShown,
    feedback,
    revealSolution,
    isHintModalOpen,
    hintButtonUsed,
    onAnswerSelect: (answer: string) => { setSelectedAnswer(answer); playSound("https://cdn.pixabay.com/download/audio/2025/02/25/audio_07b0c21a3b.mp3?filename=button-305770.mp3", 0.4); },
    onAnswerSubmit: handleAnswerSubmit,
    onHintRequest: handleHintRequest,
    onBackToMap: gameFlow.handleBackToMap,
    playSound
  });


  return {
    isHintModalOpen,
    setIsHintModalOpen,
    hint,
    isHintLoading,
    resetForNewIslandPlay,
    getIslandPlayingScreenProps,
    getEndlessPlayingScreenProps
  };
};
