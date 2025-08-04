import { useState, useEffect, useCallback } from 'react';
import React from 'react';
import {
  IslandProgressState, IslandStarRatingsState, AllGradesStarRatingsState,
  IsEndlessUnlockedForGradeState, GradeLevel, IslandConfig, GoalType, ParentGoal
} from '../../types';
import {
  loadIslandProgressFromStorage, saveIslandProgressToStorage,
  loadIslandStarRatingsFromStorage, saveIslandStarRatingsToStorage,
  loadAllGradesStarRatingsFromStorage, saveAllGradesStarRatingsToStorage,
  loadIsEndlessUnlockedForGrade, saveIsEndlessUnlockedForGrade,
  loadIsFinalIslandUnlocked, saveIsFinalIslandUnlocked,
  loadStudentAssignments, saveStudentAssignments,
  loadParentGoals, saveParentGoals
} from '../../utils/storage';
import { ISLAND_CONFIGS, MAX_PLAYER_LIVES, FINAL_TREASURE_ISLAND_ID, GOAL_COMPLETED_TOAST_TEXT } from '../../constants';
import { GemIcon } from '../icons';

interface UsePlayerProgressProps {
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error', icon?: React.ReactNode) => void;
  setPlayerGems: React.Dispatch<React.SetStateAction<number>>;
}

export const usePlayerProgress = ({ showToast, setPlayerGems }: UsePlayerProgressProps) => {
  const [islandProgress, setIslandProgress] = useState<IslandProgressState>({});
  const [islandStarRatings, setIslandStarRatings] = useState<IslandStarRatingsState>({});
  
  const [allGradesProgress, setAllGradesProgress] = useState<Record<GradeLevel, IslandProgressState>>(() => {
    const initialProgress: Partial<Record<GradeLevel, IslandProgressState>> = {};
    (Object.values(GradeLevel).filter(g => typeof g === 'number') as GradeLevel[]).forEach(grade => {
        initialProgress[grade] = loadIslandProgressFromStorage(grade);
    });
    return initialProgress as Record<GradeLevel, IslandProgressState>;
  });

  const [allGradesStarRatings, setAllGradesStarRatings] = useState<AllGradesStarRatingsState>(() => loadAllGradesStarRatingsFromStorage());

  const [isEndlessUnlockedForGrade, setIsEndlessUnlockedForGrade] = useState<IsEndlessUnlockedForGradeState>(() => loadIsEndlessUnlockedForGrade());
  const [isFinalIslandUnlocked, setIsFinalIslandUnlocked] = useState<boolean>(() => loadIsFinalIslandUnlocked());

  const resetForNewGradeJourney = (grade: GradeLevel | null) => {
    if (grade !== null) {
      let loadedProgress = loadIslandProgressFromStorage(grade);

      // If no progress is saved for this grade, initialize it with the first island unlocked.
      if (Object.keys(loadedProgress).length === 0 && grade !== GradeLevel.FINAL) {
        const initialProgressForGrade: IslandProgressState = {};
        ISLAND_CONFIGS
          .filter(i => i.targetGradeLevel === grade)
          .forEach(island => {
            initialProgressForGrade[island.islandId] = island.islandNumber === 1 ? 'unlocked' : 'locked';
          });
        loadedProgress = initialProgressForGrade;
        saveIslandProgressToStorage(grade, loadedProgress); // Save this initial state.
        
        // Also update the main allGradesProgress state
        setAllGradesProgress(prev => ({...prev, [grade]: loadedProgress}));
      }

      setIslandProgress(loadedProgress);
      setIslandStarRatings(loadIslandStarRatingsFromStorage(grade));
    } else {
      setIslandProgress({});
      setIslandStarRatings({});
    }
  };
  
  const resetGradeProgress = (grade: GradeLevel) => {
      saveIslandStarRatingsToStorage(grade, {});
      const initialProgressForGrade: IslandProgressState = {};
      ISLAND_CONFIGS.filter(i => i.targetGradeLevel === grade).forEach(island => {
          initialProgressForGrade[island.islandId] = island.islandNumber === 1 ? 'unlocked' : 'locked';
      });
      saveIslandProgressToStorage(grade, initialProgressForGrade);
      setAllGradesProgress(prev => ({...prev, [grade]: initialProgressForGrade}));
      setAllGradesStarRatings(prev => {
          const updated = {...prev, [grade]: {}};
          saveAllGradesStarRatingsToStorage(updated);
          return updated;
      });
  };
  
  const checkGradeCompletion = (grade: GradeLevel, islandsForGrade: IslandConfig[], progress?: IslandProgressState): boolean => {
      const progressToCheck = progress || islandProgress;
      if (grade === GradeLevel.FINAL) {
          return progressToCheck[FINAL_TREASURE_ISLAND_ID] === 'completed';
      }
      return islandsForGrade.every(i => progressToCheck[i.islandId] === 'completed');
  };

  const completeIsland = useCallback((grade: GradeLevel, islandId: string, lives: number, hintUsed: boolean, islandsForGrade: IslandConfig[]): boolean => {
      let starsEarned = 0;
      if (lives === MAX_PLAYER_LIVES) starsEarned = 5;
      else if (lives >= MAX_PLAYER_LIVES - 1) starsEarned = 4;
      else if (lives > 0) starsEarned = 3;
      else starsEarned = 2; // Completed with 0 lives left

      // Update star ratings
      const updatedStarRatings = { ...islandStarRatings, [islandId]: Math.max(islandStarRatings[islandId] || 0, starsEarned) };
      setIslandStarRatings(updatedStarRatings);
      saveIslandStarRatingsToStorage(grade, updatedStarRatings);
      const updatedAllGradesStarRatings = { ...allGradesStarRatings, [grade]: updatedStarRatings };
      setAllGradesStarRatings(updatedAllGradesStarRatings);
      saveAllGradesStarRatingsToStorage(updatedAllGradesStarRatings);

      // Update island progress
      const updatedProgress = { ...islandProgress, [islandId]: 'completed' as const };
      const currentIndex = islandsForGrade.findIndex(i => i.islandId === islandId);
      if (currentIndex !== -1 && currentIndex < islandsForGrade.length - 1) {
          const nextIsland = islandsForGrade[currentIndex + 1];
          if (nextIsland && updatedProgress[nextIsland.islandId] === 'locked') {
              updatedProgress[nextIsland.islandId] = 'unlocked';
          }
      }
      
      if (grade === GradeLevel.FINAL) {
          const mainFinals = islandsForGrade.filter(i => i.islandNumber <= 5);
          const ultimateIsland = islandsForGrade.find(i => i.islandNumber === 6);
          if (ultimateIsland && mainFinals.every(isl => updatedProgress[isl.islandId] === 'completed')) {
              updatedProgress[ultimateIsland.islandId] = 'unlocked';
          }
      }

      setIslandProgress(updatedProgress);
      saveIslandProgressToStorage(grade, updatedProgress);
      const updatedAllGradesProgress = { ...allGradesProgress, [grade]: updatedProgress };
      setAllGradesProgress(updatedAllGradesProgress);

      // --- Handle Homework and Goals ---
      // 1. Check and complete homework
      const assignments = loadStudentAssignments();
      if (assignments.some(a => a.islandId === islandId)) {
          const updatedAssignments = assignments.filter(a => a.islandId !== islandId);
          saveStudentAssignments(updatedAssignments);
      }
      
      // 2. Check and reward parent goals
      const goals = loadParentGoals();
      let goalsUpdated = false;
      const totalStars = Object.values(updatedAllGradesStarRatings).flatMap(g => Object.values(g)).reduce((sum, s) => sum + s, 0);
      const totalIslands = Object.values(updatedAllGradesProgress).flatMap(g => Object.values(g)).filter(status => status === 'completed').length;
      
      goals.forEach(goal => {
          if (!goal.isClaimed) {
              const progress = goal.type === GoalType.EARN_STARS ? totalStars : totalIslands;
              if (progress >= goal.target) {
                  setPlayerGems(prev => prev + goal.rewardGems);
                  showToast(GOAL_COMPLETED_TOAST_TEXT(goal.rewardGems), 'success', React.createElement(GemIcon));
                  goal.isClaimed = true;
                  goalsUpdated = true;
              }
          }
      });
      if (goalsUpdated) {
          saveParentGoals(goals);
      }
      // --- End Handle ---

      const isGradeNowComplete = checkGradeCompletion(grade, islandsForGrade, updatedProgress);

      if (isGradeNowComplete && grade !== GradeLevel.FINAL) {
          setIsEndlessUnlockedForGrade(prev => {
              const updated = { ...prev, [grade]: true };
              saveIsEndlessUnlockedForGrade(updated);
              return updated;
          });
      }

      const normalGrades = Object.values(GradeLevel).filter(g => typeof g === 'number' && g !== GradeLevel.FINAL) as GradeLevel[];
      const allNormalGradesCompleted = normalGrades.every(g => {
        const gradeIslands = ISLAND_CONFIGS.filter(i => i.targetGradeLevel === g);
        const gradeProg = updatedAllGradesProgress[g] || {};
        return gradeIslands.length > 0 && gradeIslands.every(i => gradeProg[i.islandId] === 'completed');
      });

      if (allNormalGradesCompleted && !isFinalIslandUnlocked) {
        setIsFinalIslandUnlocked(true);
        saveIsFinalIslandUnlocked(true);
      }

      return isGradeNowComplete;
      
  }, [islandStarRatings, islandProgress, allGradesProgress, allGradesStarRatings, isFinalIslandUnlocked, showToast, setPlayerGems]);
  
  const initializeFinalIslandsProgress = () => {
    const finalIslands = ISLAND_CONFIGS.filter(i => i.targetGradeLevel === GradeLevel.FINAL);
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
  }


  return {
    islandProgress,
    setIslandProgress,
    islandStarRatings,
    setIslandStarRatings,
    allGradesProgress,
    allGradesStarRatings,
    isEndlessUnlockedForGrade,
    isFinalIslandUnlocked,
    resetForNewGradeJourney,
    resetGradeProgress,
    completeIsland,
    checkGradeCompletion,
    initializeFinalIslandsProgress
  };
};
