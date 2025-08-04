import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import {
  AchievedAchievementsState, AchievedAchievement, AchievementId,
  CollectedItemsState, PlayerOwnedAccessoriesState, PlayerActiveAccessoriesState,
  ThemeAccessory, AchievementContext, GradeLevel, IslandDifficulty
} from '../../types';
import {
  loadAchievedAchievementsFromStorage, saveAchievedAchievementsToStorage,
  loadCollectedItemsFromStorage, saveCollectedItemsToStorage,
  loadPlayerOwnedAccessoriesFromStorage, savePlayerOwnedAccessoriesToStorage,
  loadPlayerActiveAccessoriesFromStorage, savePlayerActiveAccessoriesToStorage
} from '../../utils/storage';
import { ALL_ACHIEVEMENTS } from '../../achievements';
import {
  ACHIEVEMENT_UNLOCKED_TOAST_TITLE, ACHIEVEMENT_UNLOCKED_SOUND_URL,
  ISLAND_CONFIGS, GEM_COLLECT_SOUND_URL, INCORRECT_ANSWER_SOUND_URL, BUTTON_CLICK_SOUND_URL
} from '../../constants';
import { TrophyIcon } from '../icons';

interface UsePlayerCollectionsProps {
  playerProgress: {
    selectedGrade: GradeLevel | null;
    islandProgress: any;
    islandStarRatings: any;
    islandsForGrade: any[];
    allGradesProgress: any;
    allGradesStarRatings: any;
    isEndlessUnlockedForGrade: any;
    isFinalIslandUnlocked: boolean;
  };
  playerStats: {
    overallScore: number;
    playerGems: number;
    setPlayerGems: React.Dispatch<React.SetStateAction<number>>;
  };
  showToast: (message: string, type?: any, icon?: any) => void;
  playSound: (url: string, volume?: number) => void;
}

export const usePlayerCollections = ({
  playerProgress,
  playerStats,
  showToast,
  playSound,
}: UsePlayerCollectionsProps) => {

  const [achievedAchievements, setAchievedAchievements] = useState<AchievedAchievementsState>(() => loadAchievedAchievementsFromStorage());
  const [collectedItems, setCollectedItems] = useState<CollectedItemsState>(() => loadCollectedItemsFromStorage());
  const [playerOwnedAccessories, setPlayerOwnedAccessories] = useState<PlayerOwnedAccessoriesState>(() => loadPlayerOwnedAccessoriesFromStorage());
  const [playerActiveAccessories, setPlayerActiveAccessories] = useState<PlayerActiveAccessoriesState>(() => loadPlayerActiveAccessoriesFromStorage());
  
  const [showAchievementsScreen, setShowAchievementsScreen] = useState(false);
  const [showShopScreen, setShowShopScreen] = useState(false);
  const [showAccessoryCustomizationModal, setShowAccessoryCustomizationModal] = useState(false);
  const [themeChangedForAchievement, setThemeChangedForAchievement] = useState(false);

  const awardAchievement = useCallback((achievementId: AchievementId) => {
    if (achievedAchievements[achievementId]) return;
    const newAchievementEntry: AchievedAchievement = { id: achievementId, achievedAt: Date.now(), gradeContext: playerProgress.selectedGrade || undefined };
    const achievementDef = ALL_ACHIEVEMENTS.find(a => a.id === achievementId);
    if (achievementDef) {
      playSound(ACHIEVEMENT_UNLOCKED_SOUND_URL, 0.6);
      showToast(`${ACHIEVEMENT_UNLOCKED_TOAST_TITLE} ${achievementDef.name}`, 'success', React.createElement(TrophyIcon, { className: "w-7 h-7" }));
    }
    setAchievedAchievements(prev => {
      const updated = { ...prev, [achievementId]: newAchievementEntry };
      saveAchievedAchievementsToStorage(updated);
      return updated;
    });
    // Consider adding weekly challenge update here if needed
  }, [achievedAchievements, playerProgress.selectedGrade, playSound, showToast]);

  const checkAndAwardAchievements = useCallback((completionContext?: { difficulty: IslandDifficulty | null; hintUsed: boolean }) => {
    const achievementContext: AchievementContext = {
      selectedGrade: playerProgress.selectedGrade,
      islandProgress: playerProgress.islandProgress,
      islandStarRatings: playerProgress.islandStarRatings,
      islandsForGrade: playerProgress.islandsForGrade,
      currentOverallScore: playerStats.overallScore,
      allGradeIslandConfigs: ISLAND_CONFIGS,
      allGradesProgress: playerProgress.allGradesProgress,
      themeSwapped: themeChangedForAchievement,
      currentIslandDifficulty: completionContext?.difficulty,
      hintUsedInLastIslandCompletion: completionContext?.hintUsed,
      allGradesStarRatings: playerProgress.allGradesStarRatings,
      collectedItems,
      isEndlessUnlockedForGrade: playerProgress.isEndlessUnlockedForGrade,
      isFinalIslandUnlocked: playerProgress.isFinalIslandUnlocked,
      playerGems: playerStats.playerGems,
      // completedDailyChallengesCount and completedWeeklyChallengesCount need to be passed from the challenges hook if used here.
      // For now, these achievements can be handled within the challenges hook itself or passed in.
    };
    ALL_ACHIEVEMENTS.forEach(achievement => {
      if (!achievedAchievements[achievement.id] && achievement.condition && achievement.condition(achievementContext)) {
        awardAchievement(achievement.id);
      }
    });
  }, [
    achievedAchievements, awardAchievement, collectedItems, themeChangedForAchievement,
    playerProgress.selectedGrade, playerProgress.islandProgress, playerProgress.islandStarRatings,
    playerProgress.islandsForGrade, playerStats.overallScore, playerProgress.allGradesProgress,
    playerProgress.allGradesStarRatings, playerProgress.isEndlessUnlockedForGrade,
    playerProgress.isFinalIslandUnlocked, playerStats.playerGems
  ]);
  
  // This useEffect will now live here, isolated to collections logic
  useEffect(() => {
    const timeoutId = setTimeout(() => checkAndAwardAchievements(), 300);
    return () => clearTimeout(timeoutId);
  }, [
      playerProgress.islandProgress, playerProgress.islandStarRatings, playerStats.overallScore,
      playerProgress.selectedGrade, themeChangedForAchievement, playerProgress.allGradesProgress,
      playerProgress.allGradesStarRatings, collectedItems, playerProgress.isEndlessUnlockedForGrade,
      playerProgress.isFinalIslandUnlocked, playerStats.playerGems, checkAndAwardAchievements
  ]);

  const handleToggleAchievementsScreen = () => {
    playSound(BUTTON_CLICK_SOUND_URL);
    setShowAchievementsScreen(prev => !prev);
  };

  const handleGoToShop = (setGameState: (s: any) => void) => {
    playSound(BUTTON_CLICK_SOUND_URL);
    setGameState('Shop');
  };
  
  const handleBuyAccessory = (accessory: ThemeAccessory) => {
    if (playerStats.playerGems >= accessory.price && !playerOwnedAccessories[accessory.id]) {
      playerStats.setPlayerGems(prevGems => {
        const newGems = prevGems - accessory.price;
        // savePlayerGems(newGems); // this should be in playerStats hook
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

  const handleToggleAccessoryCustomizationModal = (setGameState: (s: any) => void) => {
    playSound(BUTTON_CLICK_SOUND_URL);
    setGameState('AccessoryCustomization');
  };

  const handleUpdateActiveAccessories = (updatedActiveAccessories: PlayerActiveAccessoriesState) => {
    setPlayerActiveAccessories(updatedActiveAccessories);
    savePlayerActiveAccessoriesToStorage(updatedActiveAccessories);
    window.dispatchEvent(new CustomEvent('activeAccessoriesUpdated'));
  };
  
  const resetForNewGradeJourney = () => {
      setThemeChangedForAchievement(false);
  }

  return {
    achievedAchievements,
    collectedItems, setCollectedItems,
    playerOwnedAccessories,
    playerActiveAccessories,
    showAchievementsScreen,
    showShopScreen,
    showAccessoryCustomizationModal,
    checkAndAwardAchievements,
    handleToggleAchievementsScreen,
    handleGoToShop,
    handleBuyAccessory,
    handleToggleAccessoryCustomizationModal,
    handleUpdateActiveAccessories,
    resetForNewGradeJourney
  };
};