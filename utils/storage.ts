import {
    GradeLevel, IslandProgressState, IslandStarRatingsState, AllGradesStarRatingsState, AchievedAchievementsState,
    ActiveTreasureChestsState, ActiveMessageBottlesState, StoredActiveNPCInfo, ActiveCollectibleState, CollectedItemsState,
    IsEndlessUnlockedForGradeState, ActiveDailyChallengeState, PlayerGemsState, CompletedDailyChallengesLogState,
    ActiveWeeklyChallengeState, CompletedWeeklyChallengesLogState, PlayerOwnedAccessoriesState, PlayerActiveAccessoriesState, Theme
} from '../types';
import {
    LAST_SELECTED_GRADE_KEY, ISLAND_PROGRESS_KEY_PREFIX, OVERALL_SCORE_KEY_PREFIX, ISLAND_STAR_RATINGS_KEY_PREFIX,
    ALL_GRADES_STAR_RATINGS_KEY, ACHIEVED_ACHIEVEMENTS_KEY, ACTIVE_TREASURE_CHESTS_KEY, ACTIVE_MESSAGE_BOTTLE_KEY,
    ACTIVE_FRIENDLY_NPC_KEY, ACTIVE_COLLECTIBLE_KEY, COLLECTED_ITEMS_KEY, ENDLESS_UNLOCKED_KEY_PREFIX,
    FINAL_ISLAND_UNLOCKED_KEY, ACTIVE_DAILY_CHALLENGE_KEY, PLAYER_GEMS_KEY, COMPLETED_DAILY_CHALLENGES_LOG_KEY,
    ACTIVE_WEEKLY_CHALLENGE_KEY, COMPLETED_WEEKLY_CHALLENGES_LOG_KEY, PLAYER_OWNED_ACCESSORIES_KEY, PLAYER_ACTIVE_ACCESSORIES_KEY,
    DEFAULT_THEME, SELECTED_THEME_KEY
} from '../constants';

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

export const dispatchGemsUpdate = (gems: number) => {
  const event = new CustomEvent('gemsUpdated', { detail: { gems } });
  window.dispatchEvent(event);
};


export const loadLastSelectedGrade = (): GradeLevel | null => loadItem(LAST_SELECTED_GRADE_KEY, null);
export const saveLastSelectedGrade = (grade: GradeLevel | null) => saveItem(LAST_SELECTED_GRADE_KEY, grade);
export const loadIslandProgressFromStorage = (grade: GradeLevel): IslandProgressState => loadItem(`${ISLAND_PROGRESS_KEY_PREFIX}${grade}`, {});
export const saveIslandProgressToStorage = (grade: GradeLevel, progress: IslandProgressState) => saveItem(`${ISLAND_PROGRESS_KEY_PREFIX}${grade}`, progress);
export const loadOverallScoreFromStorage = (grade: GradeLevel): number => loadItem(`${OVERALL_SCORE_KEY_PREFIX}${grade}`, 0);
export const saveOverallScoreToStorage = (grade: GradeLevel, score: number) => saveItem(`${OVERALL_SCORE_KEY_PREFIX}${grade}`, score);
export const loadIslandStarRatingsFromStorage = (grade: GradeLevel): IslandStarRatingsState => loadItem(`${ISLAND_STAR_RATINGS_KEY_PREFIX}${grade}`, {});
export const saveIslandStarRatingsToStorage = (grade: GradeLevel, ratings: IslandStarRatingsState) => saveItem(`${ISLAND_STAR_RATINGS_KEY_PREFIX}${grade}`, ratings);
export const loadAllGradesStarRatingsFromStorage = (): AllGradesStarRatingsState => {
  const defaultValue: Partial<AllGradesStarRatingsState> = {};
  (Object.values(GradeLevel).filter(g => typeof g === 'number') as GradeLevel[]).forEach(grade => {
      defaultValue[grade] = {};
  });
  return loadItem(ALL_GRADES_STAR_RATINGS_KEY, defaultValue as AllGradesStarRatingsState);
};
export const saveAllGradesStarRatingsToStorage = (ratings: AllGradesStarRatingsState) => saveItem(ALL_GRADES_STAR_RATINGS_KEY, ratings);
export const loadAchievedAchievementsFromStorage = (): AchievedAchievementsState => loadItem(ACHIEVED_ACHIEVEMENTS_KEY, {});
export const saveAchievedAchievementsToStorage = (achievements: AchievedAchievementsState) => saveItem(ACHIEVED_ACHIEVEMENTS_KEY, achievements);
export const loadActiveTreasureChestsFromStorage = (): ActiveTreasureChestsState => loadItem(ACTIVE_TREASURE_CHESTS_KEY, {});
export const saveActiveTreasureChestsToStorage = (chests: ActiveTreasureChestsState) => saveItem(ACTIVE_TREASURE_CHESTS_KEY, chests);
export const loadActiveMessageBottlesFromStorage = (): ActiveMessageBottlesState => loadItem(ACTIVE_MESSAGE_BOTTLE_KEY, {});
export const saveActiveMessageBottlesToStorage = (bottles: ActiveMessageBottlesState) => saveItem(ACTIVE_MESSAGE_BOTTLE_KEY, bottles);
export const loadActiveNPCFromStorage = (): StoredActiveNPCInfo | null => loadItem(ACTIVE_FRIENDLY_NPC_KEY, null);
export const saveActiveNPCToStorage = (npcInfo: StoredActiveNPCInfo | null) => saveItem(ACTIVE_FRIENDLY_NPC_KEY, npcInfo);
export const loadActiveCollectibleFromStorage = (): ActiveCollectibleState => loadItem(ACTIVE_COLLECTIBLE_KEY, {});
export const saveActiveCollectibleToStorage = (collectible: ActiveCollectibleState) => saveItem(ACTIVE_COLLECTIBLE_KEY, collectible);
export const loadCollectedItemsFromStorage = (): CollectedItemsState => loadItem(COLLECTED_ITEMS_KEY, {});
export const saveCollectedItemsToStorage = (items: CollectedItemsState) => saveItem(COLLECTED_ITEMS_KEY, items);

export const loadIsEndlessUnlockedForGrade = (): IsEndlessUnlockedForGradeState => {
    const defaultUnlockedState: IsEndlessUnlockedForGradeState = {};
    (Object.values(GradeLevel).filter(g => typeof g === 'number' && g !== GradeLevel.FINAL) as GradeLevel[]).forEach(grade => {
        defaultUnlockedState[grade] = true; 
    });
    return loadItem(ENDLESS_UNLOCKED_KEY_PREFIX, defaultUnlockedState);
};
export const saveIsEndlessUnlockedForGrade = (state: IsEndlessUnlockedForGradeState) => saveItem(ENDLESS_UNLOCKED_KEY_PREFIX, state);

export const loadIsFinalIslandUnlocked = (): boolean => {
    return loadItem(FINAL_ISLAND_UNLOCKED_KEY, true); 
};
export const saveIsFinalIslandUnlocked = (unlocked: boolean) => saveItem(FINAL_ISLAND_UNLOCKED_KEY, unlocked);

export const loadActiveDailyChallenge = (): ActiveDailyChallengeState => loadItem(ACTIVE_DAILY_CHALLENGE_KEY, null);
export const saveActiveDailyChallenge = (challenge: ActiveDailyChallengeState) => saveItem(ACTIVE_DAILY_CHALLENGE_KEY, challenge);

export const loadPlayerGems = (): PlayerGemsState => loadItem(PLAYER_GEMS_KEY, 10000); 
export const savePlayerGems = (gems: PlayerGemsState) => {
  saveItem(PLAYER_GEMS_KEY, gems);
  dispatchGemsUpdate(gems); 
};

export const loadCompletedDailyChallengesLog = (): CompletedDailyChallengesLogState => loadItem(COMPLETED_DAILY_CHALLENGES_LOG_KEY, {});
export const saveCompletedDailyChallengesLog = (log: CompletedDailyChallengesLogState) => saveItem(COMPLETED_DAILY_CHALLENGES_LOG_KEY, log);

export const loadActiveWeeklyChallenge = (): ActiveWeeklyChallengeState => loadItem(ACTIVE_WEEKLY_CHALLENGE_KEY, null);
export const saveActiveWeeklyChallenge = (challenge: ActiveWeeklyChallengeState) => saveItem(ACTIVE_WEEKLY_CHALLENGE_KEY, challenge);
export const loadCompletedWeeklyChallengesLog = (): CompletedWeeklyChallengesLogState => loadItem(COMPLETED_WEEKLY_CHALLENGES_LOG_KEY, {});
export const saveCompletedWeeklyChallengesLog = (log: CompletedWeeklyChallengesLogState) => saveItem(COMPLETED_WEEKLY_CHALLENGES_LOG_KEY, log);

export const loadPlayerOwnedAccessoriesFromStorage = (): PlayerOwnedAccessoriesState => loadItem(PLAYER_OWNED_ACCESSORIES_KEY, {});
export const savePlayerOwnedAccessoriesToStorage = (accessories: PlayerOwnedAccessoriesState) => saveItem(PLAYER_OWNED_ACCESSORIES_KEY, accessories);

export const loadPlayerActiveAccessoriesFromStorage = (): PlayerActiveAccessoriesState => loadItem(PLAYER_ACTIVE_ACCESSORIES_KEY, {});
export const savePlayerActiveAccessoriesToStorage = (activeAccessories: PlayerActiveAccessoriesState) => saveItem(PLAYER_ACTIVE_ACCESSORIES_KEY, activeAccessories);

export const loadTheme = (): Theme => loadItem(SELECTED_THEME_KEY, DEFAULT_THEME);
export const saveTheme = (theme: Theme) => saveItem(SELECTED_THEME_KEY, theme);
