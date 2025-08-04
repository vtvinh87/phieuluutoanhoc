
import { useState, useCallback } from 'react';
import { GradeLevel } from '../../types';
import {
  MAX_PLAYER_LIVES, ENDLESS_MODE_LIVES, ENDLESS_MODE_STARTING_DIFFICULTY
} from '../../constants';
import {
  loadOverallScoreFromStorage, saveOverallScoreToStorage,
  loadPlayerGems, savePlayerGems
} from '../../utils/storage';

export const usePlayerStats = () => {
  const [playerLives, setPlayerLives] = useState(MAX_PLAYER_LIVES);
  const [overallScore, setOverallScore] = useState(0);
  const [islandScore, setIslandScore] = useState(0);
  const [playerGems, setPlayerGems] = useState<number>(() => loadPlayerGems());

  // Endless Mode Stats
  const [currentEndlessGrade, setCurrentEndlessGrade] = useState<GradeLevel | null>(null);
  const [endlessModeLives, setEndlessModeLives] = useState(ENDLESS_MODE_LIVES);
  const [endlessModeScore, setEndlessModeScore] = useState(0);
  const [endlessQuestionsAnswered, setEndlessQuestionsAnswered] = useState(0);
  const [endlessDifficultyLevel, setEndlessDifficultyLevel] = useState(ENDLESS_MODE_STARTING_DIFFICULTY);
  const [endlessCorrectStreak, setEndlessCorrectStreak] = useState(0);
  const [endlessIncorrectStreak, setEndlessIncorrectStreak] = useState(0);

  const resetForNewIslandPlay = useCallback(() => {
    setPlayerLives(MAX_PLAYER_LIVES);
    setIslandScore(0);
  }, []);

  const resetForNewGradeJourney = useCallback((grade: GradeLevel | null) => {
    resetForNewIslandPlay();
    setOverallScore(grade !== null ? loadOverallScoreFromStorage(grade) : 0);
    // Reset endless stats
    setCurrentEndlessGrade(null);
    setEndlessModeLives(ENDLESS_MODE_LIVES);
    setEndlessModeScore(0);
    setEndlessQuestionsAnswered(0);
    setEndlessDifficultyLevel(ENDLESS_MODE_STARTING_DIFFICULTY);
    setEndlessCorrectStreak(0);
    setEndlessIncorrectStreak(0);
  }, [resetForNewIslandPlay]);

  const resetForNewEndlessMode = useCallback((grade: GradeLevel) => {
    setCurrentEndlessGrade(grade);
    setEndlessModeLives(ENDLESS_MODE_LIVES);
    setEndlessModeScore(0);
    setEndlessQuestionsAnswered(0);
    setEndlessDifficultyLevel(ENDLESS_MODE_STARTING_DIFFICULTY);
    setEndlessCorrectStreak(0);
    setEndlessIncorrectStreak(0);
  }, []);

  const updateIslandScore = useCallback((points: number, grade: GradeLevel | null) => {
    if (grade) {
      const newOverallScore = overallScore + points;
      setOverallScore(newOverallScore);
      saveOverallScoreToStorage(grade, newOverallScore);
    }
    setIslandScore(prev => prev + points);
  }, [overallScore]);

  const updateEndlessScore = useCallback((points: number) => {
    setEndlessModeScore(prev => prev + points);
    setEndlessQuestionsAnswered(prev => prev + 1);
  }, []);
  
  // Need to also handle saving gems
  const updatePlayerGems = (newGems: number) => {
      setPlayerGems(newGems);
      savePlayerGems(newGems);
  }

  return {
    playerLives, setPlayerLives,
    overallScore, setOverallScore,
    islandScore, setIslandScore,
    playerGems, setPlayerGems: updatePlayerGems,
    currentEndlessGrade,
    endlessModeLives, setEndlessModeLives,
    endlessModeScore, setEndlessModeScore,
    endlessQuestionsAnswered, setEndlessQuestionsAnswered,
    endlessDifficultyLevel, setEndlessDifficultyLevel,
    endlessCorrectStreak, setEndlessCorrectStreak,
    endlessIncorrectStreak, setEndlessIncorrectStreak,
    resetForNewIslandPlay,
    resetForNewGradeJourney,
    resetForNewEndlessMode,
    updateIslandScore,
    updateEndlessScore
  };
};
