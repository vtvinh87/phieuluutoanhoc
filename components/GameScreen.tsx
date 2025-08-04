import React, { useMemo } from 'react';
import { useTheme } from '../contexts/ThemeContext';

// Import Custom Hooks
import { useToast } from './hooks/useToast';
import { useAudio } from './hooks/useAudio';
import { usePlayerStats } from './hooks/usePlayerStats';
import { usePlayerProgress } from './hooks/usePlayerProgress';
import { usePlayerCollections } from './hooks/usePlayerCollections';
import { useChallenges } from './hooks/useChallenges';
import { useDynamicEvents } from './hooks/useDynamicEvents';
import { useQuestionManager } from './hooks/useQuestionManager';
import { useGameFlow } from './hooks/useGameFlow';
import { useGameplayHandlers } from './hooks/useGameplayHandlers';

// Import UI Components
import HintModal from './HintModal';
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
import {
    GradeSelectionScreen, IslandMapScreen, IslandPlayingScreen,
    EndlessPlayingScreen, IslandCompleteScreen, GradeCompleteScreen, EndlessSummaryScreen,
    TransitionScreen, ErrorScreen, IslandLoadingScreen, ApiKeyErrorScreen
} from './GameScreens';
import { ISLAND_CONFIGS, SHOP_ACCESSORIES, COLLECTIBLE_ITEMS } from '../constants';
import { THEME_CONFIGS } from '../themes';
import { IslandDifficulty } from '../types';

const GameScreen: React.FC = () => {
  const { theme, setTheme, themeConfig } = useTheme();

  // --- Initialize All Hooks ---

  const { currentToast, showToast, dismissToast } = useToast();
  const { playSound, unlockAudioContext, audioUnlocked } = useAudio();
  
  const playerStats = usePlayerStats();
  const playerProgress = usePlayerProgress({ showToast, setPlayerGems: playerStats.setPlayerGems });
  
  // These hooks have dependencies on each other, so we need to structure them carefully.
  const playerCollections = usePlayerCollections({ 
    playerProgress: {
      ...playerProgress,
      // These will be updated by gameFlow but need to be passed for context
      selectedGrade: null, // Initial value
      islandsForGrade: [], // Initial value
    }, 
    playerStats, 
    showToast, 
    playSound 
  });
  
  const challenges = useChallenges({ playerStats, showToast, playSound });
  
  const dynamicEvents = useDynamicEvents({
    playerProgress,
    playerStats,
    playerCollections,
    challenges,
    showToast,
    playSound
  });

  const questionManager = useQuestionManager({ playSound });

  const gameFlow = useGameFlow({
    playerStats,
    playerProgress,
    playerCollections,
    challenges,
    questionManager,
    dynamicEvents,
    playSound,
    unlockAudioContext,
    showToast
  });

  const currentQuestion = useMemo(() => {
    if (gameFlow.gameState === 'EndlessPlaying' && playerStats.currentEndlessGrade && questionManager.endlessQuestionBatch.length > 0) {
        return questionManager.endlessQuestionBatch[questionManager.currentEndlessQuestionIndex];
    }
    if ((gameFlow.gameState === 'IslandPlaying' || gameFlow.gameState === 'IslandComplete') && questionManager.questionsForCurrentIsland.length > 0) {
        return questionManager.questionsForCurrentIsland[questionManager.currentQuestionIndexInIsland];
    }
    return undefined;
  }, [
      gameFlow.gameState, 
      playerStats.currentEndlessGrade, 
      questionManager.endlessQuestionBatch, 
      questionManager.currentEndlessQuestionIndex, 
      questionManager.questionsForCurrentIsland, 
      questionManager.currentQuestionIndexInIsland
  ]);

  const gameplayHandlers = useGameplayHandlers({
    gameFlow,
    playerStats,
    playerProgress,
    playerCollections,
    questionManager,
    challenges,
    playSound,
    unlockAudioContext,
    currentQuestion
  });
  
  // --- Wrapper functions to inject state reset logic ---
  
  const handleDifficultySelectedWrapper = (difficulty: IslandDifficulty) => {
    gameplayHandlers.resetForNewIslandPlay();
    gameFlow.handleDifficultySelected(difficulty);
  };
  
  const handlePlayIslandAgainWrapper = () => {
    gameplayHandlers.resetForNewIslandPlay();
    gameFlow.handlePlayIslandAgain();
  };

  const handleNextIslandWrapper = () => {
      const currentIndex = gameFlow.islandsForCurrentGrade.findIndex(i => i.islandId === gameFlow.currentIslandId);
      const nextIsland = gameFlow.islandsForCurrentGrade[currentIndex + 1];
      if (nextIsland) {
          gameplayHandlers.resetForNewIslandPlay();
          gameFlow.handleIslandSelect(nextIsland.islandId);
      }
  };


  // Destructure for readability in render logic
  const { gameState, setGameState, transitionDetails, selectedGrade, currentIslandId, showDifficultySelectionModalForIslandId, islandsForCurrentGrade, currentIslandConfig, studentAssignments } = gameFlow;
  const { loadingError, apiKeyMissing, isIslandLoading, islandLoadingProgressMessage } = questionManager;
  const { showTreasureModalForIslandId, showBottleModalForIslandId, currentBottleMessageContent, showNPCModal, activeNPCData, shootingStar } = dynamicEvents;
  const { showAchievementsScreen, showShopScreen, showAccessoryCustomizationModal } = playerCollections;
  const { showDailyChallengeModal } = challenges;
  const { isHintModalOpen, hint, isHintLoading } = gameplayHandlers;

  const renderContent = () => {
      if (apiKeyMissing) {
        return <ApiKeyErrorScreen onReload={() => window.location.reload()} />;
      }
      if (gameState === 'Transitioning' && transitionDetails) {
        return <TransitionScreen message={transitionDetails.message} />;
      }
      if (isIslandLoading && !['IslandMap', 'IslandPlaying', 'EndlessPlaying'].includes(gameState)) {
        return <IslandLoadingScreen message={islandLoadingProgressMessage} />;
      }

      switch (gameState) {
        case 'ThemeSelection':
          return <ThemeSelectionScreen onThemeSelect={gameFlow.handleThemeSelected} />;
        
        case 'Shop':
          return <ShopScreen 
                    playerGems={playerStats.playerGems} 
                    accessories={SHOP_ACCESSORIES} 
                    ownedAccessories={playerCollections.playerOwnedAccessories} 
                    onBuyAccessory={playerCollections.handleBuyAccessory} 
                    onGoBack={gameFlow.handleReturnToGradeSelection} 
                    playSound={playSound} 
                 />;
        
        case 'AccessoryCustomization':
            return <AccessoryCustomizationModal 
                      isOpen={true} 
                      onClose={gameFlow.handleReturnToGradeSelection} 
                      ownedAccessories={playerCollections.playerOwnedAccessories} 
                      activeAccessories={playerCollections.playerActiveAccessories} 
                      onUpdateActiveAccessories={playerCollections.handleUpdateActiveAccessories} 
                      allThemes={THEME_CONFIGS} 
                      allAccessoriesDetails={SHOP_ACCESSORIES} 
                      playSound={playSound} 
                  />;

        case 'GradeSelection':
          return <GradeSelectionScreen 
                    onGradeSelect={gameFlow.handleGradeSelect} 
                    onThemeChange={setTheme} 
                    onToggleAchievementsScreen={playerCollections.handleToggleAchievementsScreen}
                    onToggleDailyChallengeModal={challenges.handleToggleDailyChallengeModal}
                    onAccessFinalIsland={gameFlow.handleAccessFinalIsland} 
                    onGoToShop={() => playerCollections.handleGoToShop(setGameState)}
                    onToggleAccessoryCustomizationModal={() => playerCollections.handleToggleAccessoryCustomizationModal(setGameState)}
                    playSound={playSound} 
                    theme={theme} 
                    isFinalIslandUnlocked={playerProgress.isFinalIslandUnlocked} 
                    playerGems={playerStats.playerGems} 
                    activeDailyChallenge={challenges.activeDailyChallenge} 
                    activeWeeklyChallenge={challenges.activeWeeklyChallenge} 
                  />;
        
        case 'IslandMap':
            if (!selectedGrade) return <ErrorScreen loadingError="Lỗi: Chưa chọn lớp học." handleReturnToGradeSelection={gameFlow.handleReturnToGradeSelection} handleRetryFetchIsland={gameFlow.handleRetryFetchIsland} />;
            return <IslandMapScreen 
                    selectedGrade={selectedGrade} 
                    islandsForCurrentGrade={islandsForCurrentGrade} 
                    islandProgress={playerProgress.islandProgress} 
                    overallScore={playerStats.overallScore} 
                    isEndlessUnlockedForGrade={playerProgress.isEndlessUnlockedForGrade[selectedGrade] || false} 
                    onIslandSelect={gameFlow.handleIslandSelect} 
                    onChooseAnotherGrade={gameFlow.handleChooseAnotherGrade} 
                    onToggleAchievementsScreen={playerCollections.handleToggleAchievementsScreen} 
                    onToggleDailyChallengeModal={challenges.handleToggleDailyChallengeModal}
                    onStartEndlessMode={() => gameFlow.handleStartEndlessMode(selectedGrade)} 
                    playSound={playSound} 
                    islandStarRatings={playerProgress.islandStarRatings} 
                    activeTreasureChests={dynamicEvents.activeTreasureChests[selectedGrade] || {}} 
                    activeMessageBottle={dynamicEvents.activeMessageBottle} 
                    activeNPCData={dynamicEvents.activeNPCData} 
                    activeCollectible={dynamicEvents.activeCollectible} 
                    shootingStar={shootingStar} 
                    onShootingStarClick={(id: string) => dynamicEvents.handleShootingStarClick(id, selectedGrade)} 
                    setShootingStar={dynamicEvents.setShootingStar} 
                    playerGems={playerStats.playerGems} 
                    activeDailyChallenge={challenges.activeDailyChallenge} 
                    activeWeeklyChallenge={challenges.activeWeeklyChallenge}
                    studentAssignments={studentAssignments}
                  />;
       
        case 'IslandPlaying':
            if (!currentQuestion || !currentIslandConfig || !selectedGrade || gameFlow.selectedIslandDifficulty === null) return <IslandLoadingScreen message="Đang tải câu hỏi..." />;
            return <IslandPlayingScreen {...gameplayHandlers.getIslandPlayingScreenProps()} />;
      
        case 'EndlessPlaying':
             if (!currentQuestion || playerStats.currentEndlessGrade === null) return <IslandLoadingScreen message="Đang tải câu hỏi Vô tận..." />;
             return <EndlessPlayingScreen {...gameplayHandlers.getEndlessPlayingScreenProps()} />;
        
        case 'IslandComplete':
            if (!currentIslandConfig || selectedGrade === null || gameFlow.selectedIslandDifficulty === null || currentIslandId === null) return <ErrorScreen loadingError="Lỗi khi hiển thị kết quả." handleReturnToGradeSelection={gameFlow.handleReturnToGradeSelection} handleRetryFetchIsland={gameFlow.handleRetryFetchIsland} />;
            return <IslandCompleteScreen 
                      currentIslandConfig={currentIslandConfig}
                      selectedGrade={selectedGrade}
                      selectedIslandDifficulty={gameFlow.selectedIslandDifficulty}
                      islandScore={playerStats.islandScore}
                      overallScore={playerStats.overallScore}
                      playerLives={playerStats.playerLives}
                      islandStarRatings={playerProgress.islandStarRatings}
                      onBackToMap={gameFlow.handleBackToMap}
                      onPlayIslandAgain={handlePlayIslandAgainWrapper}
                      onNextIsland={handleNextIslandWrapper}
                      islandsForCurrentGrade={islandsForCurrentGrade}
                      currentIslandId={currentIslandId}
                      islandProgress={playerProgress.islandProgress}
                      playSound={playSound}
                      showCustomFireworks={gameFlow.showCustomFireworks}
                      audioUnlocked={audioUnlocked}
                    />;

        case 'GradeComplete':
             if (selectedGrade === null) return <ErrorScreen loadingError="Lỗi khi hiển thị kết quả." handleReturnToGradeSelection={gameFlow.handleReturnToGradeSelection} handleRetryFetchIsland={gameFlow.handleRetryFetchIsland} />;
             return <GradeCompleteScreen 
                      selectedGrade={selectedGrade}
                      overallScore={playerStats.overallScore}
                      isEndlessUnlockedForGrade={playerProgress.isEndlessUnlockedForGrade[selectedGrade] || false}
                      onPlayThisGradeAgain={gameFlow.handlePlayThisGradeAgain}
                      onChooseAnotherGrade={gameFlow.handleChooseAnotherGrade}
                      onStartEndlessMode={() => gameFlow.handleStartEndlessMode(selectedGrade)}
                      playSound={playSound}
                      showCustomFireworks={gameFlow.showCustomFireworks}
                      audioUnlocked={audioUnlocked}
                    />;

        case 'EndlessSummary':
             if (playerStats.currentEndlessGrade === null) return <ErrorScreen loadingError="Lỗi khi hiển thị kết quả." handleReturnToGradeSelection={gameFlow.handleReturnToGradeSelection} handleRetryFetchIsland={gameFlow.handleRetryFetchIsland} />;
             return <EndlessSummaryScreen 
                      currentEndlessGrade={playerStats.currentEndlessGrade}
                      endlessModeScore={playerStats.endlessModeScore}
                      endlessQuestionsAnswered={playerStats.endlessQuestionsAnswered}
                      onBackToMap={gameFlow.handleBackToMap}
                      onPlayAgain={() => gameFlow.handleStartEndlessMode(playerStats.currentEndlessGrade)}
                      playSound={playSound}
                      showCustomFireworks={gameFlow.showCustomFireworks}
                      audioUnlocked={audioUnlocked}
                    />;
        
        case 'Error':
          return <ErrorScreen loadingError={loadingError} handleReturnToGradeSelection={gameFlow.handleReturnToGradeSelection} handleRetryFetchIsland={gameFlow.handleRetryFetchIsland} />;
        
        default:
          return <IslandLoadingScreen message="Đang tải trò chơi..." />;
      }
  };

  return (
    <>
      <ActiveBackgroundEffects
        playerActiveAccessories={playerCollections.playerActiveAccessories}
        currentTheme={theme}
        allAccessoriesDetails={SHOP_ACCESSORIES}
      />
      <CursorTrail
        playerActiveAccessories={playerCollections.playerActiveAccessories}
        currentTheme={theme}
        allAccessoriesDetails={SHOP_ACCESSORIES}
      />
      
      <div
        id="screen-container"
        className={`
          w-full h-full flex-grow flex flex-col 
          p-2 sm:p-3 md:p-4 
          ${themeConfig.primaryBg} 
          ${themeConfig.frostedGlassOpacity || ''}
          rounded-xl md:rounded-2xl shadow-lg
          overflow-hidden 
        `}
      >
        {renderContent()}
      </div>

      {showDifficultySelectionModalForIslandId && gameFlow.getDifficultySelectionModalProps() && (
        <DifficultySelectionModal {...gameFlow.getDifficultySelectionModalProps()} onSelectDifficulty={handleDifficultySelectedWrapper} />
      )}
      
      {showTreasureModalForIslandId && selectedGrade && dynamicEvents.getTreasureChestModalProps(selectedGrade, showTreasureModalForIslandId) && (
        <TreasureChestModal {...dynamicEvents.getTreasureChestModalProps(selectedGrade, showTreasureModalForIslandId)!} themeConfig={themeConfig} onChestActuallyOpened={() => dynamicEvents.handleTreasureChestOpened(selectedGrade, showTreasureModalForIslandId, 0, setGameState)} />
      )}

      {showBottleModalForIslandId && currentBottleMessageContent && dynamicEvents.getMessageInBottleModalProps(setGameState) && (
        <MessageInBottleModal {...dynamicEvents.getMessageInBottleModalProps(setGameState)!} themeConfig={themeConfig} />
      )}
      
      {showNPCModal && activeNPCData && dynamicEvents.getFriendlyNPCModalProps(selectedGrade, setGameState) && (
        <FriendlyNPCModal {...dynamicEvents.getFriendlyNPCModalProps(selectedGrade, setGameState)!} themeConfig={themeConfig} />
      )}

      <HintModal isOpen={isHintModalOpen} onClose={() => gameplayHandlers.setIsHintModalOpen(false)} hint={hint} isLoading={isHintLoading} />
      
      {showAchievementsScreen && ( 
        <AchievementsScreen 
          achievedAchievements={playerCollections.achievedAchievements} 
          onClose={playerCollections.handleToggleAchievementsScreen} 
          playSound={playSound} 
          currentGradeContext={selectedGrade} 
          collectedItems={playerCollections.collectedItems} 
          allCollectibles={COLLECTIBLE_ITEMS} 
        /> 
      )}

      {showDailyChallengeModal && challenges.getDailyChallengeModalProps() && ( 
        <DailyChallengeModal {...challenges.getDailyChallengeModalProps()} />
      )}

      <ToastNotification toast={currentToast} onDismiss={dismissToast} />
    </>
  );
};

export default GameScreen;