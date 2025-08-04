import { useState, useEffect, useCallback, useMemo } from 'react';
import { GameState, GradeLevel, IslandDifficulty, IslandConfig, Assignment } from '../../types';
import {
  API_KEY_ERROR_MESSAGE, ISLAND_CONFIGS, NO_ISLANDS_FOR_GRADE_TEXT,
  UPDATING_MAP_TEXT, TRAVELLING_TO_ISLAND_TEXT, GRADE_LEVEL_TEXT_MAP,
  STARTING_ISLAND_TEXT, FINAL_ISLAND_AMBIENT_SOUND_URL, BUTTON_CLICK_SOUND_URL, ISLAND_DIFFICULTY_TEXT_MAP
} from '../../constants';
import { loadLastSelectedGrade, saveLastSelectedGrade, loadStudentAssignments } from '../../utils/storage';
import { useTheme } from '../../contexts/ThemeContext';

interface TransitionDetails {
  message: string;
  duration?: number;
  onComplete: () => void;
}

// Define the shape of props this hook needs from other hooks
interface UseGameFlowProps {
  playerStats: any;
  playerProgress: any;
  playerCollections: any;
  challenges: any;
  questionManager: any;
  dynamicEvents: any;
  playSound: (soundUrl: string, volume?: number) => void;
  unlockAudioContext: () => void;
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error', icon?: React.ReactNode) => void;
}

export const useGameFlow = ({
  playerStats,
  playerProgress,
  playerCollections,
  challenges,
  questionManager,
  dynamicEvents,
  playSound,
  unlockAudioContext,
  showToast,
}: UseGameFlowProps) => {
  const { setTheme } = useTheme();
  const [gameState, setGameState] = useState<GameState>('ThemeSelection');
  const [transitionDetails, setTransitionDetails] = useState<TransitionDetails | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel | null>(null);
  const [currentIslandId, setCurrentIslandId] = useState<string | null>(null);
  const [selectedIslandDifficulty, setSelectedIslandDifficulty] = useState<IslandDifficulty | null>(null);
  const [showDifficultySelectionModalForIslandId, setShowDifficultySelectionModalForIslandId] = useState<string | null>(null);
  const [showCustomFireworks, setShowCustomFireworks] = useState(false);
  const [studentAssignments, setStudentAssignments] = useState<Assignment[]>([]);

  const islandsForCurrentGrade = useMemo(() => {
    if (!selectedGrade) return [];
    return ISLAND_CONFIGS.filter(island => island.targetGradeLevel === selectedGrade).sort((a, b) => a.islandNumber - b.islandNumber);
  }, [selectedGrade]);
  
  const currentIslandConfig = useMemo(() => {
    if (!currentIslandId || !islandsForCurrentGrade) return null;
    return islandsForCurrentGrade.find(i => i.islandId === currentIslandId) || null;
  }, [currentIslandId, islandsForCurrentGrade]);


  // Effect for handling transitions
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
  
  // Effect for handling fireworks
  useEffect(() => {
    if (['IslandComplete', 'GradeComplete', 'EndlessSummary'].includes(gameState)) {
        setShowCustomFireworks(true);
    } else if (showCustomFireworks) {
        setShowCustomFireworks(false);
    }
  }, [gameState, showCustomFireworks]);

  const resetForNewGradeJourney = useCallback((grade: GradeLevel | null) => {
    setCurrentIslandId(null);
    setSelectedIslandDifficulty(null);
    setShowDifficultySelectionModalForIslandId(null);
    setTransitionDetails(null);

    playerStats.resetForNewGradeJourney(grade);
    playerProgress.resetForNewGradeJourney(grade);
    playerCollections.resetForNewGradeJourney();
    questionManager.resetForNewGradeJourney();
    dynamicEvents.resetForNewGradeJourney();
    challenges.resetStreakChallengesIfNeeded(true);
  }, [playerStats, playerProgress, playerCollections, questionManager, dynamicEvents, challenges]);

  const handleThemeSelected = (selectedTheme: any) => {
      unlockAudioContext();
      setTheme(selectedTheme);
      if (!process.env.API_KEY) {
        questionManager.setApiKeyMissing(true);
        setGameState('Error');
        questionManager.setLoadingError(API_KEY_ERROR_MESSAGE);
        return;
      }
      const lastGrade = loadLastSelectedGrade();
      if (lastGrade !== null) {
          handleGradeSelect(lastGrade, true);
      } else {
          setGameState('GradeSelection');
      }
  };

  const handleGradeSelect = (grade: GradeLevel, isAutoLoading = false) => {
    if (!isAutoLoading) {
      unlockAudioContext();
      playSound("https://cdn.pixabay.com/download/audio/2025/05/06/audio_f823c08739.mp3?filename=select-003-337609.mp3", 0.7);
    }
    resetForNewGradeJourney(grade);
    setSelectedGrade(grade);
    saveLastSelectedGrade(grade);
    setStudentAssignments(loadStudentAssignments());
    const gradeIslands = ISLAND_CONFIGS.filter(island => island.targetGradeLevel === grade);
    if (gradeIslands.length > 0) {
      setGameState('IslandMap');
      dynamicEvents.trySpawnTreasureChests(grade, gradeIslands);
      dynamicEvents.trySpawnMessageBottle();
      dynamicEvents.trySpawnFriendlyNPC(grade, gradeIslands);
      dynamicEvents.trySpawnCollectible();
      setTimeout(() => playerCollections.checkAndAwardAchievements(), 100);
    } else {
      setGameState('Error');
      questionManager.setLoadingError(NO_ISLANDS_FOR_GRADE_TEXT);
    }
  };
  
  const handleIslandSelect = (islandId: string) => {
    unlockAudioContext();
    const status = playerProgress.islandProgress[islandId];
    const islandConfig = islandsForCurrentGrade.find(i => i.islandId === islandId);
    if (!islandConfig || !(status === 'unlocked' || status === 'completed')) {
      playSound("https://cdn.pixabay.com/download/audio/2025/05/31/audio_e9d22d9131.mp3?filename=error-11-352286.mp3", 0.3);
      showToast("Hòn đảo này đã bị khoá. Hoàn thành các đảo trước để mở khoá!", 'warning');
      return;
    }
    
    playSound("https://cdn.pixabay.com/download/audio/2025/05/06/audio_f823c08739.mp3?filename=select-003-337609.mp3", 0.6);
    let eventHandled = false;
    
    if (dynamicEvents.activeCollectible[islandId]) {
      dynamicEvents.handleCollectibleInteraction(islandId);
      eventHandled = true; // Collectible takes priority
    } else if (dynamicEvents.activeNPCData?.islandId === islandId && selectedGrade === dynamicEvents.activeNPCData.grade) {
      dynamicEvents.handleNPCInteraction(islandId);
      eventHandled = true;
    } else if (status === 'completed' && dynamicEvents.activeMessageBottle[islandId]) {
      dynamicEvents.handleMessageBottleOpened(islandId);
      eventHandled = true;
    } else if (status === 'completed' && selectedGrade && dynamicEvents.activeTreasureChests[selectedGrade]?.[islandId]) {
      dynamicEvents.setShowTreasureModalForIslandId(islandId);
      eventHandled = true;
    }

    if (!eventHandled) {
      setCurrentIslandId(islandId);
      if (islandConfig.targetGradeLevel === GradeLevel.FINAL) {
        playSound(FINAL_ISLAND_AMBIENT_SOUND_URL, 0.5);
        const introMessage = islandConfig.islandNumber === 6 ? "Chào mừng Huyền Thoại! Hãy đối mặt thử thách cuối cùng!" : TRAVELLING_TO_ISLAND_TEXT(islandConfig.name);
        
        const startFetch = async () => {
            const difficulty = IslandDifficulty.HARD; // Final islands are always hard
            const result = await questionManager.fetchAndSetQuestionsForIsland(islandId, difficulty, selectedGrade, islandsForCurrentGrade);
            if (result === 'success') {
                setSelectedIslandDifficulty(difficulty);
                playerStats.resetForNewIslandPlay();
                challenges.resetStreakChallengesIfNeeded(false);
                setGameState('IslandPlaying');
            } else {
                setGameState('Error');
            }
        };

        setTransitionDetails({ message: introMessage, duration: 2000, onComplete: startFetch });
        setGameState('Transitioning');
      } else {
        setShowDifficultySelectionModalForIslandId(islandId);
      }
    }
  };

  const handleDifficultySelected = (difficulty: IslandDifficulty) => {
    unlockAudioContext();
    playSound(BUTTON_CLICK_SOUND_URL);
    if (!currentIslandId || !selectedGrade) return;

    const islandConfigToLoad = islandsForCurrentGrade.find(i => i.islandId === currentIslandId);
    if (!islandConfigToLoad) {
      setGameState('Error');
      questionManager.setLoadingError("Lỗi: Không tìm thấy đảo để tải.");
      setShowDifficultySelectionModalForIslandId(null);
      return;
    }
    setShowDifficultySelectionModalForIslandId(null);
    
    const startFetch = async () => {
        const result = await questionManager.fetchAndSetQuestionsForIsland(currentIslandId, difficulty, selectedGrade, islandsForCurrentGrade);
        if (result === 'success') {
            setSelectedIslandDifficulty(difficulty);
            playerStats.resetForNewIslandPlay();
            challenges.resetStreakChallengesIfNeeded(false);
            setGameState('IslandPlaying');
        } else {
            setGameState('Error');
        }
    };
    
    setTransitionDetails({
      message: TRAVELLING_TO_ISLAND_TEXT(islandConfigToLoad.name),
      duration: 1800,
      onComplete: startFetch
    });
    setGameState('Transitioning');
  };
  
  const handleStartEndlessMode = useCallback((grade: GradeLevel | null) => {
    if (!grade) {
      showToast("Vui lòng chọn một lớp để chơi Vô Tận.", "warning");
      return;
    }
    unlockAudioContext();
    playSound("https://cdn.pixabay.com/download/audio/2024/04/10/audio_606a246872.mp3?filename=energy-1-396956.mp3", 0.6);
    playerStats.resetForNewEndlessMode(grade);

    const startFetch = async () => {
        const result = await questionManager.fetchNextEndlessBatch(grade, playerStats.endlessDifficultyLevel);
        if (result === 'success') {
            setGameState('EndlessPlaying');
        } else {
            setGameState('Error');
        }
    };
    
    setTransitionDetails({ message: "Đang tải câu hỏi Vô tận...", onComplete: startFetch });
    setGameState('Transitioning');
  }, [unlockAudioContext, playSound, showToast, questionManager, playerStats]);

  const handleBackToMap = () => {
    unlockAudioContext();
    playSound(BUTTON_CLICK_SOUND_URL);
    challenges.resetStreakChallengesIfNeeded(true);
    if (gameState === 'EndlessSummary' && playerStats.currentEndlessGrade) {
      handleGradeSelect(playerStats.currentEndlessGrade, true);
      return;
    }
    if (!selectedGrade) {
      handleChooseAnotherGrade();
      return;
    }
    if (dynamicEvents.showTreasureModalForIslandId) dynamicEvents.setShowTreasureModalForIslandId(null);
    if (dynamicEvents.showBottleModalForIslandId) dynamicEvents.setShowBottleModalForIslandId(null);
    if (dynamicEvents.showNPCModal) dynamicEvents.setShowNPCModal(false);
    
    setCurrentIslandId(null);
    setSelectedIslandDifficulty(null);
    questionManager.setQuestionsForCurrentIsland([]);
    
    setTransitionDetails({
      message: UPDATING_MAP_TEXT,
      duration: 1000,
      onComplete: () => {
        const allGradeIslandsCompleted = islandsForCurrentGrade.every(island => playerProgress.islandProgress[island.islandId] === 'completed');
        if (allGradeIslandsCompleted && selectedGrade !== GradeLevel.FINAL) {
          setGameState('GradeComplete');
        } else {
          setGameState('IslandMap');
        }
        if (selectedGrade) {
          dynamicEvents.trySpawnTreasureChests(selectedGrade, islandsForCurrentGrade);
          dynamicEvents.trySpawnMessageBottle();
          dynamicEvents.trySpawnFriendlyNPC(selectedGrade, islandsForCurrentGrade);
          dynamicEvents.trySpawnCollectible();
          setStudentAssignments(loadStudentAssignments());
        }
      }
    });
    setGameState('Transitioning');
  };
  
  const handlePlayIslandAgain = () => {
    unlockAudioContext();
    playSound(BUTTON_CLICK_SOUND_URL);
    if (currentIslandId && selectedGrade && selectedIslandDifficulty && currentIslandConfig) {
      playerStats.resetForNewIslandPlay();
      challenges.resetStreakChallengesIfNeeded(false);
      const startMsg = STARTING_ISLAND_TEXT(currentIslandConfig.name, ISLAND_DIFFICULTY_TEXT_MAP[selectedIslandDifficulty]);
      setTransitionDetails({ message: startMsg, duration: 700, onComplete: () => setGameState('IslandPlaying') });
      setGameState('Transitioning');
    } else {
      handleBackToMap();
    }
  };
  
  const handlePlayThisGradeAgain = () => {
    unlockAudioContext();
    playSound(BUTTON_CLICK_SOUND_URL);
    if (selectedGrade) {
      playerProgress.resetGradeProgress(selectedGrade);
      dynamicEvents.resetGradeEvents(selectedGrade);
      handleGradeSelect(selectedGrade);
    }
  };

  const handleChooseAnotherGrade = () => {
    unlockAudioContext();
    playSound(BUTTON_CLICK_SOUND_URL);
    setSelectedGrade(null);
    saveLastSelectedGrade(null);
    resetForNewGradeJourney(null);
    setGameState('GradeSelection');
  };

  const handleReturnToGradeSelection = () => {
    unlockAudioContext();
    playSound(BUTTON_CLICK_SOUND_URL);
    setSelectedGrade(null);
    saveLastSelectedGrade(null);
    resetForNewGradeJourney(null);
    questionManager.setLoadingError(null);
    questionManager.setApiKeyMissing(false);
    setGameState('GradeSelection');
  };

  const handleRetryFetchIsland = () => {
    unlockAudioContext();
    playSound(BUTTON_CLICK_SOUND_URL);

    const performRetry = async () => {
        const endlessError = questionManager.loadingError === "Không thể tải câu hỏi cho Chế Độ Vô Tận.";
        if (endlessError && playerStats.currentEndlessGrade !== null) {
            const result = await questionManager.fetchNextEndlessBatch(playerStats.currentEndlessGrade, playerStats.endlessDifficultyLevel);
            if (result === 'success') setGameState('EndlessPlaying');
            else setGameState('Error');
        } else if (currentIslandId && selectedGrade && selectedIslandDifficulty) {
            const result = await questionManager.fetchAndSetQuestionsForIsland(currentIslandId, selectedIslandDifficulty, selectedGrade, islandsForCurrentGrade);
            if (result === 'success') setGameState('IslandPlaying');
            else setGameState('Error');
        } else {
            handleReturnToGradeSelection();
        }
    };

    questionManager.setLoadingError(null);
    setGameState('Transitioning');
    setTransitionDetails({
        message: 'Đang thử lại...',
        duration: 500,
        onComplete: performRetry
    });
  };

  const handleAccessFinalIsland = () => {
      if (!playerProgress.isFinalIslandUnlocked) return;
      playSound(BUTTON_CLICK_SOUND_URL);
      const finalGrade = GradeLevel.FINAL;
      resetForNewGradeJourney(finalGrade);
      setSelectedGrade(finalGrade);
      saveLastSelectedGrade(finalGrade);
      
      const finalIslands = ISLAND_CONFIGS.filter(i => i.targetGradeLevel === finalGrade);
      if (finalIslands.length > 0) {
          playerProgress.initializeFinalIslandsProgress();
          setGameState('IslandMap');
          playSound(FINAL_ISLAND_AMBIENT_SOUND_URL, 0.4);
      } else {
          setGameState('Error');
          questionManager.setLoadingError("Lỗi: Không tìm thấy cấu hình cho Thử Thách Tối Thượng.");
      }
  };
  
  const getDifficultySelectionModalProps = () => {
      const islandForModal = showDifficultySelectionModalForIslandId ? islandsForCurrentGrade.find(i => i.islandId === showDifficultySelectionModalForIslandId) : null;
      if (!islandForModal) return null;
      return {
          isOpen: true,
          islandName: islandForModal.name,
          onClose: () => {
              unlockAudioContext();
              playSound(BUTTON_CLICK_SOUND_URL);
              setShowDifficultySelectionModalForIslandId(null);
              setGameState(selectedGrade ? 'IslandMap' : 'GradeSelection');
          },
          onSelectDifficulty: handleDifficultySelected
      };
  };

  return {
    gameState, setGameState,
    transitionDetails, setTransitionDetails,
    selectedGrade, setSelectedGrade,
    currentIslandId, setCurrentIslandId,
    selectedIslandDifficulty, setSelectedIslandDifficulty,
    showDifficultySelectionModalForIslandId, setShowDifficultySelectionModalForIslandId,
    showCustomFireworks, setShowCustomFireworks,
    islandsForCurrentGrade, currentIslandConfig,
    studentAssignments,
    handleThemeSelected,
    handleGradeSelect,
    handleIslandSelect,
    handleDifficultySelected,
    handleStartEndlessMode,
    handleBackToMap,
    handlePlayIslandAgain,
    handlePlayThisGradeAgain,
    handleChooseAnotherGrade,
    handleReturnToGradeSelection,
    handleRetryFetchIsland,
    handleAccessFinalIsland,
    getDifficultySelectionModalProps,
  };
};