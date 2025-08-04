import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  DailyChallenge, ActiveDailyChallengeState, DailyChallengeDefinition, CompletedDailyChallengesLogState, DailyChallengeType,
  WeeklyChallenge, ActiveWeeklyChallengeState, WeeklyChallengeDefinition, CompletedWeeklyChallengesLogState,
  CHALLENGE_ACTION_ISLAND_COMPLETED, CHALLENGE_ACTION_STAR_EARNED, CHALLENGE_ACTION_CORRECT_ANSWER,
  CHALLENGE_ACTION_TREASURE_CHEST_OPENED, CHALLENGE_ACTION_SHOOTING_STAR_COLLECTED, CHALLENGE_ACTION_NPC_INTERACTED,
  CHALLENGE_ACTION_DAILY_CHALLENGE_REWARD_CLAIMED
} from '../../types';
import {
  DAILY_CHALLENGE_DEFINITIONS, DAILY_CHALLENGE_NEW_AVAILABLE_TEXT,
  DAILY_CHALLENGE_NEW_SOUND_URL, DAILY_CHALLENGE_PROGRESS_SOUND_URL, DAILY_CHALLENGE_COMPLETE_SOUND_URL,
  GEM_COLLECT_SOUND_URL, DAILY_CHALLENGE_SUCCESS_TOAST_TEXT,
  WEEKLY_CHALLENGE_DEFINITIONS, WEEKLY_CHALLENGE_NEW_AVAILABLE_TEXT,
  WEEKLY_CHALLENGE_SUCCESS_TOAST_TEXT, WEEKLY_CHALLENGE_NEW_SOUND_URL, WEEKLY_CHALLENGE_COMPLETE_SOUND_URL,
  WEEKLY_CHALLENGE_PROGRESS_SOUND_URL, BUTTON_CLICK_SOUND_URL
} from '../../constants';
import {
  loadActiveDailyChallenge, saveActiveDailyChallenge, savePlayerGems,
  loadCompletedDailyChallengesLog, saveCompletedDailyChallengesLog,
  loadActiveWeeklyChallenge, saveActiveWeeklyChallenge,
  loadCompletedWeeklyChallengesLog, saveCompletedWeeklyChallengesLog
} from '../../utils/storage';
import { CalendarCheckIcon, GemIcon, CheckCircleIcon, TrophyIcon } from '../icons';

interface UseChallengesProps {
  playerStats: {
    setPlayerGems: React.Dispatch<React.SetStateAction<number>>;
  };
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error', icon?: React.ReactNode) => void;
  playSound: (soundUrl: string, volume?: number) => void;
}

export const useChallenges = ({ playerStats, showToast, playSound }: UseChallengesProps) => {
  const [activeDailyChallenge, setActiveDailyChallenge] = useState<ActiveDailyChallengeState>(null);
  const [completedDailyChallengesLog, setCompletedDailyChallengesLog] = useState<CompletedDailyChallengesLogState>(() => loadCompletedDailyChallengesLog());
  const [timeUntilNextDailyChallengeRefresh, setTimeUntilNextDailyChallengeRefresh] = useState('');
  const [showDailyChallengeModal, setShowDailyChallengeModal] = useState(false);

  const [activeWeeklyChallenge, setActiveWeeklyChallenge] = useState<ActiveWeeklyChallengeState>(null);
  const [completedWeeklyChallengesLog, setCompletedWeeklyChallengesLog] = useState<CompletedWeeklyChallengesLogState>(() => loadCompletedWeeklyChallengesLog());
  const [timeUntilNextWeeklyChallengeRefresh, setTimeUntilNextWeeklyChallengeRefresh] = useState('');

  // --- Daily Challenge Logic ---

  const isNewDay = (dateString: string): boolean => {
    if (!dateString) return true;
    const today = new Date().toDateString();
    const challengeDate = new Date(dateString).toDateString();
    return today !== challengeDate;
  };

  const generateNewDailyChallenge = useCallback((): DailyChallenge => {
    const availableDefinitions = DAILY_CHALLENGE_DEFINITIONS;
    const randomDefinition = availableDefinitions[Math.floor(Math.random() * availableDefinitions.length)];
    const targetValue = randomDefinition.generateTargetValue();
    return {
      id: uuidv4(),
      definitionId: randomDefinition.id,
      type: randomDefinition.type,
      description: randomDefinition.descriptionTemplate(targetValue),
      targetValue: targetValue,
      currentValue: 0,
      rewardGems: randomDefinition.rewardGems,
      generatedDate: new Date().toISOString().split('T')[0],
      isCompleted: false,
      rewardClaimed: false,
      currentStreak: randomDefinition.streakChallenge ? 0 : undefined,
    };
  }, []);

  const updateWeeklyChallengeProgress = useCallback((actionType: string, value: number = 1) => {
    setActiveWeeklyChallenge(prevChallenge => {
      if (!prevChallenge || prevChallenge.isCompleted) return prevChallenge;
      const definition = WEEKLY_CHALLENGE_DEFINITIONS.find(def => def.id === prevChallenge.definitionId);
      if (!definition || definition.actionTypeToTrack !== actionType) return prevChallenge;

      let newCurrentValue = prevChallenge.currentValue + value;
      newCurrentValue = Math.min(newCurrentValue, prevChallenge.targetValue);
      const isNowCompleted = newCurrentValue >= prevChallenge.targetValue;

      const updatedChallenge: WeeklyChallenge = { ...prevChallenge, currentValue: newCurrentValue, isCompleted: isNowCompleted };

      if (isNowCompleted && !prevChallenge.isCompleted) { playSound(WEEKLY_CHALLENGE_COMPLETE_SOUND_URL, 0.7); showToast(WEEKLY_CHALLENGE_NEW_AVAILABLE_TEXT, 'info', React.createElement(TrophyIcon, { className: "w-6 h-6" })); }
      else if (newCurrentValue > prevChallenge.currentValue && !isNowCompleted) { playSound(WEEKLY_CHALLENGE_PROGRESS_SOUND_URL, 0.3); }

      saveActiveWeeklyChallenge(updatedChallenge); return updatedChallenge;
    });
  }, [playSound, showToast]);

  const updateDailyChallengeProgress = useCallback((actionType: string, value: number = 1) => {
    setActiveDailyChallenge(prevChallenge => {
      if (!prevChallenge || prevChallenge.isCompleted) return prevChallenge;
      const definition = DAILY_CHALLENGE_DEFINITIONS.find(def => def.id === prevChallenge.definitionId);
      if (!definition || definition.actionTypeToTrack !== actionType) return prevChallenge;

      let newCurrentValue = prevChallenge.currentValue;
      let newStreak = prevChallenge.currentStreak;

      if (definition.streakChallenge) {
          if (actionType === CHALLENGE_ACTION_CORRECT_ANSWER) {
              if (value === 1) newStreak = (newStreak || 0) + 1;
              else newStreak = 0;
              newCurrentValue = Math.max(newCurrentValue, newStreak || 0);
          }
      } else { newCurrentValue += value; }

      newCurrentValue = Math.min(newCurrentValue, prevChallenge.targetValue);
      const isNowCompleted = newCurrentValue >= prevChallenge.targetValue;

      const updatedChallenge: DailyChallenge = { ...prevChallenge, currentValue: newCurrentValue, currentStreak: newStreak, isCompleted: isNowCompleted };

      if (isNowCompleted && !prevChallenge.isCompleted) { playSound(DAILY_CHALLENGE_COMPLETE_SOUND_URL, 0.6); showToast(DAILY_CHALLENGE_NEW_AVAILABLE_TEXT, 'info', React.createElement(CalendarCheckIcon, { className: "w-6 h-6" })); }
      else if (newCurrentValue > prevChallenge.currentValue && !isNowCompleted) { playSound(DAILY_CHALLENGE_PROGRESS_SOUND_URL, 0.3); }

      saveActiveDailyChallenge(updatedChallenge); return updatedChallenge;
    });
  }, [playSound, showToast]);

  const resetStreakChallengesIfNeeded = useCallback((navigatingAwayFromIsland: boolean = false) => {
    setActiveDailyChallenge(prev => {
      if (prev && !prev.isCompleted) {
        const definition = DAILY_CHALLENGE_DEFINITIONS.find(def => def.id === prev.definitionId);
        if (definition?.streakChallenge && navigatingAwayFromIsland) {
          if (prev.currentStreak !== undefined && prev.currentStreak > 0) {
            const updated = { ...prev, currentStreak: 0 };
            saveActiveDailyChallenge(updated); return updated;
          }
        }
      }
      return prev;
    });
  }, []);

  useEffect(() => {
    const challenge = loadActiveDailyChallenge();
    if (!challenge || isNewDay(challenge.generatedDate)) {
      const newChallenge = generateNewDailyChallenge();
      setActiveDailyChallenge(newChallenge); saveActiveDailyChallenge(newChallenge);
      playSound(DAILY_CHALLENGE_NEW_SOUND_URL, 0.5); showToast(DAILY_CHALLENGE_NEW_AVAILABLE_TEXT, 'info', React.createElement(CalendarCheckIcon, { className: "w-6 h-6" }));
    } else { setActiveDailyChallenge(challenge); }

    const calculateTimeUntilNextRefresh = () => {
        const now = new Date(); const tomorrow = new Date(now); tomorrow.setDate(now.getDate() + 1); tomorrow.setHours(0, 0, 0, 0);
        const diffMs = tomorrow.getTime() - now.getTime(); const diffHrs = Math.floor(diffMs / 3600000); const diffMins = Math.floor((diffMs % 3600000) / 60000);
        setTimeUntilNextDailyChallengeRefresh(`${diffHrs}h ${diffMins}m`);
    };
    calculateTimeUntilNextRefresh(); const timerId = setInterval(calculateTimeUntilNextRefresh, 60000);
    return () => clearInterval(timerId);
  }, [generateNewDailyChallenge, playSound, showToast]);

  const handleClaimDailyChallengeReward = () => {
    if (activeDailyChallenge && activeDailyChallenge.isCompleted && !activeDailyChallenge.rewardClaimed) {
      playerStats.setPlayerGems(prevGems => { const newGems = prevGems + activeDailyChallenge.rewardGems; savePlayerGems(newGems); return newGems; });
      const claimedChallengeId = activeDailyChallenge.id;
      const claimedChallengeDate = activeDailyChallenge.generatedDate;

      setActiveDailyChallenge(prev => { if (!prev) return null; const updated = { ...prev, rewardClaimed: true }; saveActiveDailyChallenge(updated); return updated; });

      setCompletedDailyChallengesLog(prev => { const newLog = {...prev, [claimedChallengeId]: { date: claimedChallengeDate, challengeId: claimedChallengeId}}; saveCompletedDailyChallengesLog(newLog); return newLog; });

      playSound(GEM_COLLECT_SOUND_URL, 0.7); showToast(DAILY_CHALLENGE_SUCCESS_TOAST_TEXT(activeDailyChallenge.rewardGems), 'success', React.createElement(GemIcon, { className: "w-6 h-6" }));

      updateWeeklyChallengeProgress(CHALLENGE_ACTION_DAILY_CHALLENGE_REWARD_CLAIMED);
    }
  };

  // --- Weekly Challenge Logic ---
  
  const getStartOfWeekDayString = (date: Date): string => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));
    return monday.toISOString().split('T')[0];
  };

  const isNewWeek = (challengeGeneratedDate: string): boolean => {
    if (!challengeGeneratedDate) return true;
    const currentWeekMonday = getStartOfWeekDayString(new Date());
    return challengeGeneratedDate < currentWeekMonday;
  };

  const generateNewWeeklyChallenge = useCallback((): WeeklyChallenge => {
    const availableDefinitions = WEEKLY_CHALLENGE_DEFINITIONS;
    const randomDefinition = availableDefinitions[Math.floor(Math.random() * availableDefinitions.length)];
    const targetValue = randomDefinition.generateTargetValue();
    return {
      id: uuidv4(),
      definitionId: randomDefinition.id,
      type: randomDefinition.type,
      description: randomDefinition.descriptionTemplate(targetValue),
      targetValue: targetValue,
      currentValue: 0,
      rewardGems: randomDefinition.rewardGems,
      generatedDate: getStartOfWeekDayString(new Date()),
      isCompleted: false,
      rewardClaimed: false,
    };
  }, []);

  useEffect(() => {
    const challenge = loadActiveWeeklyChallenge();
    if (!challenge || isNewWeek(challenge.generatedDate)) {
      const newChallenge = generateNewWeeklyChallenge();
      setActiveWeeklyChallenge(newChallenge); saveActiveWeeklyChallenge(newChallenge);
      playSound(WEEKLY_CHALLENGE_NEW_SOUND_URL, 0.5); showToast(WEEKLY_CHALLENGE_NEW_AVAILABLE_TEXT, 'info', React.createElement(TrophyIcon, { className: "w-6 h-6" }));
    } else { setActiveWeeklyChallenge(challenge); }

    const calculateTimeUntilNextWeeklyRefresh = () => {
        const now = new Date();
        const currentDay = now.getDay();
        const daysUntilMonday = (currentDay === 0) ? 1 : (8 - currentDay);
        const nextMonday = new Date(now);
        nextMonday.setDate(now.getDate() + daysUntilMonday);
        nextMonday.setHours(0, 0, 0, 0);

        const diffMs = nextMonday.getTime() - now.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHrs = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        setTimeUntilNextWeeklyChallengeRefresh(`${diffDays}d ${diffHrs}h ${diffMins}m`);
    };
    calculateTimeUntilNextWeeklyRefresh(); const timerId = setInterval(calculateTimeUntilNextWeeklyRefresh, 60000);
    return () => clearInterval(timerId);
  }, [generateNewWeeklyChallenge, playSound, showToast]);

  const handleClaimWeeklyChallengeReward = () => {
    if (activeWeeklyChallenge && activeWeeklyChallenge.isCompleted && !activeWeeklyChallenge.rewardClaimed) {
      playerStats.setPlayerGems(prevGems => { const newGems = prevGems + activeWeeklyChallenge.rewardGems; savePlayerGems(newGems); return newGems; });
      const claimedChallengeId = activeWeeklyChallenge.id;
      const claimedChallengeDate = activeWeeklyChallenge.generatedDate;

      setActiveWeeklyChallenge(prev => { if (!prev) return null; const updated = { ...prev, rewardClaimed: true }; saveActiveWeeklyChallenge(updated); return updated; });

      setCompletedWeeklyChallengesLog(prev => { const newLog = {...prev, [claimedChallengeId]: { date: claimedChallengeDate, challengeId: claimedChallengeId}}; saveCompletedWeeklyChallengesLog(newLog); return newLog; });

      playSound(GEM_COLLECT_SOUND_URL, 0.8);
      showToast(WEEKLY_CHALLENGE_SUCCESS_TOAST_TEXT(activeWeeklyChallenge.rewardGems), 'success', React.createElement(GemIcon, { className: "w-7 h-7" }));
    }
  };

  const handleToggleDailyChallengeModal = () => {
      playSound(BUTTON_CLICK_SOUND_URL);
      setShowDailyChallengeModal(prev => !prev);
  }
  
  const getDailyChallengeModalProps = () => ({
    isOpen: showDailyChallengeModal,
    dailyChallenge: activeDailyChallenge,
    weeklyChallenge: activeWeeklyChallenge,
    onClose: handleToggleDailyChallengeModal,
    onClaimDailyReward: handleClaimDailyChallengeReward,
    onClaimWeeklyReward: handleClaimWeeklyChallengeReward,
    playSound,
    timeUntilNextDailyRefresh: timeUntilNextDailyChallengeRefresh,
    timeUntilNextWeeklyRefresh: timeUntilNextWeeklyChallengeRefresh,
  });


  return {
    activeDailyChallenge,
    completedDailyChallengesLog,
    activeWeeklyChallenge,
    completedWeeklyChallengesLog,
    showDailyChallengeModal,
    updateDailyChallengeProgress,
    updateWeeklyChallengeProgress,
    resetStreakChallengesIfNeeded,
    handleToggleDailyChallengeModal,
    getDailyChallengeModalProps
  };
};