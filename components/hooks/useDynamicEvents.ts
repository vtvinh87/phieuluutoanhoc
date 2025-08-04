import React from 'react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  ActiveTreasureChestsState, ActiveMessageBottlesState, MessageInBottleContent, ShootingStarData,
  ActiveNPCInfo, StoredActiveNPCInfo, ActiveCollectibleState, GradeLevel
} from '../../types';
import {
  CHALLENGE_ACTION_TREASURE_CHEST_OPENED, CHALLENGE_ACTION_SHOOTING_STAR_COLLECTED, CHALLENGE_ACTION_NPC_INTERACTED
} from '../../types';
import {
  TREASURE_CHEST_SPAWN_CHANCE, TREASURE_SPARKLE_SOUND_URL, TREASURE_CHEST_POINTS_MESSAGE,
  MESSAGE_IN_BOTTLE_SPAWN_CHANCE, MESSAGES_IN_BOTTLE, BOTTLE_SPAWN_SOUND_URL, BOTTLE_OPEN_SOUND_URL,
  SHOOTING_STAR_SPAWN_INTERVAL_MIN_MS, SHOOTING_STAR_SPAWN_INTERVAL_MAX_MS, SHOOTING_STAR_ANIMATION_DURATION_MS,
  SHOOTING_STAR_REWARD_POINTS_MIN, SHOOTING_STAR_REWARD_POINTS_MAX, SHOOTING_STAR_CLICK_SUCCESS_MESSAGE,
  SHOOTING_STAR_APPEAR_SOUND_URL, SHOOTING_STAR_CLICK_SOUND_URL, SHOOTING_STAR_BASE_SIZE_PX, SHOOTING_STAR_MAX_ACTIVE_MS,
  FRIENDLY_NPC_SPAWN_CHANCE, FRIENDLY_NPCS, NPC_INTERACTIONS, NPC_SPAWN_SOUND_URL, NPC_INTERACTION_SOUND_URL,
  NPC_RIDDLE_SUCCESS_SOUND_URL, NPC_RIDDLE_FAIL_SOUND_URL, COLLECTIBLE_SPAWN_CHANCE, COLLECTIBLE_SPAWN_SOUND_URL,
  COLLECTIBLE_COLLECT_SOUND_URL, COLLECTIBLE_COLLECTION_TOAST_MESSAGE, ISLAND_CONFIGS, COLLECTIBLE_ITEMS,
  BUTTON_CLICK_SOUND_URL
} from '../../constants';
import {
  loadActiveTreasureChestsFromStorage, saveActiveTreasureChestsToStorage,
  loadActiveMessageBottlesFromStorage, saveActiveMessageBottlesToStorage,
  loadActiveNPCFromStorage, saveActiveNPCToStorage,
  loadActiveCollectibleFromStorage, saveActiveCollectibleToStorage,
  saveOverallScoreToStorage, saveCollectedItemsToStorage
} from '../../utils/storage';
import { GiftIcon, SparklesIcon, CollectionIcon } from '../icons';

interface UseDynamicEventsProps {
    playerProgress: {
        islandProgress: Record<string, 'locked' | 'unlocked' | 'completed'>;
        allGradesProgress: Record<GradeLevel, Record<string, 'locked' | 'unlocked' | 'completed'>>;
    };
    playerStats: {
        overallScore: number;
        setOverallScore: React.Dispatch<React.SetStateAction<number>>;
    };
    playerCollections: {
        checkAndAwardAchievements: (context?: any) => void;
        setCollectedItems: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
    };
    challenges: {
        updateDailyChallengeProgress: (actionType: string, value?: number) => void;
        updateWeeklyChallengeProgress: (actionType: string, value?: number) => void;
    };
    showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error', icon?: React.ReactNode) => void;
    playSound: (soundUrl: string, volume?: number) => void;
}

export const useDynamicEvents = ({
  playerProgress,
  playerStats,
  playerCollections,
  challenges,
  showToast,
  playSound
}: UseDynamicEventsProps) => {

  const [activeTreasureChests, setActiveTreasureChests] = useState<ActiveTreasureChestsState>(() => loadActiveTreasureChestsFromStorage());
  const [showTreasureModalForIslandId, setShowTreasureModalForIslandId] = useState<string | null>(null);
  
  const [activeMessageBottle, setActiveMessageBottle] = useState<ActiveMessageBottlesState>(() => loadActiveMessageBottlesFromStorage());
  const [showBottleModalForIslandId, setShowBottleModalForIslandId] = useState<string | null>(null);
  const [currentBottleMessageContent, setCurrentBottleMessageContent] = useState<MessageInBottleContent | null>(null);
  
  const [shootingStar, setShootingStar] = useState<ShootingStarData | null>(null);
  const shootingStarTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const [activeNPCData, setActiveNPCData] = useState<ActiveNPCInfo | null>(null);
  const [showNPCModal, setShowNPCModal] = useState(false);
  const [npcRiddleAnswer, setNpcRiddleAnswer] = useState('');
  const [npcRiddlePhase, setNpcRiddlePhase] = useState<'question' | 'feedback'>('question');
  const [isNpcRiddleCorrect, setIsNpcRiddleCorrect] = useState<boolean | null>(null);

  const [activeCollectible, setActiveCollectible] = useState<ActiveCollectibleState>(() => loadActiveCollectibleFromStorage());

  useEffect(() => {
    const storedNPC = loadActiveNPCFromStorage();
    if (storedNPC) {
        const npc = FRIENDLY_NPCS.find(n => n.id === storedNPC.npcId);
        const interaction = NPC_INTERACTIONS.find(i => i.id === storedNPC.interactionId);
        if (npc && interaction) setActiveNPCData({ npc, interaction, islandId: storedNPC.islandId, grade: storedNPC.grade });
        else saveActiveNPCToStorage(null);
    }
  }, []);

  const trySpawnTreasureChests = useCallback((grade: GradeLevel, islandsForGrade: any[]) => {
    const completedIslandsInGrade = islandsForGrade.filter((island) => playerProgress.islandProgress[island.islandId] === 'completed');
    if (completedIslandsInGrade.length === 0) return;
    setActiveTreasureChests(prevChests => {
        let updatedGradeChests = { ...(prevChests[grade] || {}) }; let chestSpawnedThisTime = false;
        const existingChestInGrade = Object.keys(updatedGradeChests).find(islandId => updatedGradeChests[islandId]);
        if (existingChestInGrade) return prevChests;
        completedIslandsInGrade.forEach(island => { if ( !chestSpawnedThisTime && (!activeMessageBottle || !activeMessageBottle[island.islandId]) && (!activeNPCData || activeNPCData.islandId !== island.islandId || activeNPCData.grade !== grade) && (!activeCollectible || !activeCollectible[island.islandId]) && Math.random() < TREASURE_CHEST_SPAWN_CHANCE ) { updatedGradeChests[island.islandId] = true; chestSpawnedThisTime = true; playSound(TREASURE_SPARKLE_SOUND_URL, 0.3); } });
        if (chestSpawnedThisTime) { const newChestsState = { ...prevChests, [grade]: updatedGradeChests }; saveActiveTreasureChestsToStorage(newChestsState); return newChestsState; }
        return prevChests;
    });
  }, [playerProgress.islandProgress, playSound, activeMessageBottle, activeNPCData, activeCollectible]);

  const handleTreasureChestOpened = useCallback((grade: GradeLevel, islandId: string, pointsAwarded: number, setGameState: (s: any) => void) => {
    if (pointsAwarded > 0) {
      const newOverallScore = playerStats.overallScore + pointsAwarded;
      playerStats.setOverallScore(newOverallScore);
      saveOverallScoreToStorage(grade, newOverallScore);
      showToast(TREASURE_CHEST_POINTS_MESSAGE(pointsAwarded), 'info', React.createElement(GiftIcon, { className: "w-6 h-6" }));
    }
    setActiveTreasureChests(prevChests => {
      const updatedGradeChests = { ...(prevChests[grade] || {}) };
      delete updatedGradeChests[islandId];
      const newChestsState = { ...prevChests, [grade]: updatedGradeChests };
      saveActiveTreasureChestsToStorage(newChestsState);
      return newChestsState;
    });
    setShowTreasureModalForIslandId(null);
    setGameState('IslandMap');
    challenges.updateDailyChallengeProgress(CHALLENGE_ACTION_TREASURE_CHEST_OPENED);
    challenges.updateWeeklyChallengeProgress(CHALLENGE_ACTION_TREASURE_CHEST_OPENED);
  }, [playerStats.overallScore, showToast, challenges.updateDailyChallengeProgress, challenges.updateWeeklyChallengeProgress]);

  const trySpawnMessageBottle = useCallback(() => {
    if (Object.keys(activeMessageBottle).length > 0) return;
    const allCompletedIslands = ISLAND_CONFIGS.filter(island => {
      const gradeProgress = playerProgress.allGradesProgress[island.targetGradeLevel];
      return gradeProgress && gradeProgress[island.islandId] === 'completed' &&
             (!activeTreasureChests[island.targetGradeLevel] || !activeTreasureChests[island.targetGradeLevel]?.[island.islandId]) &&
             (!activeNPCData || activeNPCData.islandId !== island.islandId || activeNPCData.grade !== island.targetGradeLevel) &&
             (!activeCollectible || !activeCollectible[island.islandId]);
    });
    if (allCompletedIslands.length === 0) return;
    if (Math.random() < MESSAGE_IN_BOTTLE_SPAWN_CHANCE) {
      const randomIsland = allCompletedIslands[Math.floor(Math.random() * allCompletedIslands.length)];
      const randomMessage = MESSAGES_IN_BOTTLE[Math.floor(Math.random() * MESSAGES_IN_BOTTLE.length)];
      const newBottleState: ActiveMessageBottlesState = { [randomIsland.islandId]: { grade: randomIsland.targetGradeLevel, messageId: randomMessage.id } };
      setActiveMessageBottle(newBottleState);
      saveActiveMessageBottlesToStorage(newBottleState);
      playSound(BOTTLE_SPAWN_SOUND_URL, 0.4);
    }
  }, [playerProgress.allGradesProgress, activeMessageBottle, activeTreasureChests, playSound, activeNPCData, activeCollectible]);

  const handleMessageBottleOpened = useCallback((islandId: string) => {
    const bottleData = activeMessageBottle[islandId];
    if (bottleData) {
      const messageContent = MESSAGES_IN_BOTTLE.find(m => m.id === bottleData.messageId);
      setCurrentBottleMessageContent(messageContent || MESSAGES_IN_BOTTLE[0]);
      setShowBottleModalForIslandId(islandId);
      playSound(BOTTLE_OPEN_SOUND_URL, 0.5);
    }
  }, [activeMessageBottle, playSound]);

  const handleMessageBottleClosed = (setGameState: (s: any) => void) => {
    setShowBottleModalForIslandId(null);
    setActiveMessageBottle({});
    saveActiveMessageBottlesToStorage({});
    setGameState('IslandMap');
  };
  
  const spawnShootingStar = useCallback((gameState: any) => {
    if (shootingStar || gameState !== 'IslandMap') return;
    playSound(SHOOTING_STAR_APPEAR_SOUND_URL, 0.3);
    const id = uuidv4();
    const size = SHOOTING_STAR_BASE_SIZE_PX + Math.random() * 16 - 8;
    const duration = SHOOTING_STAR_ANIMATION_DURATION_MS + Math.random() * 1000 - 500;
    const delay = Math.random() * 500;
    const startsLeft = Math.random() < 0.5;
    const startY = (Math.random() * 60 + 5) + '%';
    const endY = (Math.random() * 60 + 5) + '%';
    const newStar: ShootingStarData = { id, startX: startsLeft ? "-10%" : "110%", startY, endX: startsLeft ? "110%" : "-10%", endY, duration, size, delay, visible: true, clicked: false };
    setShootingStar(newStar);
    setTimeout(() => {
      setShootingStar(prevStar => (prevStar && prevStar.id === id && !prevStar.clicked) ? null : prevStar);
    }, SHOOTING_STAR_MAX_ACTIVE_MS + delay);
  }, [shootingStar, playSound]);

  const handleShootingStarClick = useCallback((starId: string, selectedGrade: GradeLevel | null) => {
    if (shootingStar && shootingStar.id === starId && !shootingStar.clicked) {
      playSound(SHOOTING_STAR_CLICK_SOUND_URL, 0.6);
      setShootingStar(prev => prev ? { ...prev, clicked: true, visible: false } : null);
      if (selectedGrade) {
        const points = Math.floor(Math.random() * (SHOOTING_STAR_REWARD_POINTS_MAX - SHOOTING_STAR_REWARD_POINTS_MIN + 1)) + SHOOTING_STAR_REWARD_POINTS_MIN;
        const newOverallScore = playerStats.overallScore + points;
        playerStats.setOverallScore(newOverallScore);
        saveOverallScoreToStorage(selectedGrade, newOverallScore);
        showToast(SHOOTING_STAR_CLICK_SUCCESS_MESSAGE(points), 'success', React.createElement(SparklesIcon, { className: "w-6 h-6" }));
        challenges.updateDailyChallengeProgress(CHALLENGE_ACTION_SHOOTING_STAR_COLLECTED);
        challenges.updateWeeklyChallengeProgress(CHALLENGE_ACTION_SHOOTING_STAR_COLLECTED);
      }
    }
  }, [shootingStar, playerStats.overallScore, playSound, showToast, challenges.updateDailyChallengeProgress, challenges.updateWeeklyChallengeProgress]);

  const trySpawnFriendlyNPC = useCallback((grade: GradeLevel, islandsForGrade: any[]) => {
    if (activeNPCData || !grade) return;
    const eligibleIslandsForNPC = islandsForGrade.filter(island => {
        const islandState = playerProgress.islandProgress[island.islandId];
        return (islandState === 'completed' || islandState === 'unlocked') &&
               (!activeTreasureChests[grade] || !activeTreasureChests[grade]?.[island.islandId]) &&
               (!activeMessageBottle || !activeMessageBottle[island.islandId]) &&
               (!activeCollectible || !activeCollectible[island.islandId]);
    });
    if (eligibleIslandsForNPC.length === 0) return;
    if (Math.random() < FRIENDLY_NPC_SPAWN_CHANCE) {
        const randomIsland = eligibleIslandsForNPC[Math.floor(Math.random() * eligibleIslandsForNPC.length)];
        const randomNPCFromList = FRIENDLY_NPCS[Math.floor(Math.random() * FRIENDLY_NPCS.length)];
        let possibleInteractions = NPC_INTERACTIONS.filter(interaction => !interaction.npcIds || interaction.npcIds.includes(randomNPCFromList.id));
        if (possibleInteractions.length === 0) possibleInteractions = NPC_INTERACTIONS;
        if (possibleInteractions.length === 0) return;
        const randomInteraction = possibleInteractions[Math.floor(Math.random() * possibleInteractions.length)];
        const newNPCData: ActiveNPCInfo = { npc: randomNPCFromList, interaction: randomInteraction, islandId: randomIsland.islandId, grade: randomIsland.targetGradeLevel };
        setActiveNPCData(newNPCData);
        saveActiveNPCToStorage({ npcId: newNPCData.npc.id, interactionId: newNPCData.interaction.id, islandId: newNPCData.islandId, grade: newNPCData.grade });
        playSound(NPC_SPAWN_SOUND_URL, 0.4);
    }
  }, [playerProgress.islandProgress, activeNPCData, activeTreasureChests, activeMessageBottle, playSound, activeCollectible]);
  
  const handleNPCInteraction = (islandId: string) => {
    if (activeNPCData && activeNPCData.islandId === islandId) {
        playSound(NPC_INTERACTION_SOUND_URL, 0.5);
        setNpcRiddleAnswer('');
        setNpcRiddlePhase('question');
        setIsNpcRiddleCorrect(null);
        setShowNPCModal(true);
    }
  };

  const handleNPCRiddleSubmit = (selectedGrade: GradeLevel | null) => {
    if (!activeNPCData || activeNPCData.interaction.type !== 'riddle' || !activeNPCData.interaction.answer) return;
    const isCorrect = npcRiddleAnswer.trim().toLowerCase() === activeNPCData.interaction.answer.toLowerCase();
    setIsNpcRiddleCorrect(isCorrect);
    setNpcRiddlePhase('feedback');
    let pointsAwarded = 0;
    if (isCorrect) {
        playSound(NPC_RIDDLE_SUCCESS_SOUND_URL, 0.5);
        pointsAwarded = activeNPCData.interaction.points;
        showToast(`Tuyệt vời! Bạn giải đúng câu đố và nhận được ${pointsAwarded} điểm!`, 'success');
    } else {
        playSound(NPC_RIDDLE_FAIL_SOUND_URL, 0.4);
        showToast(`Tiếc quá! Đáp án đúng là: ${activeNPCData.interaction.answer}`, 'error');
    }
    if (pointsAwarded > 0 && selectedGrade) {
        const newOverallScore = playerStats.overallScore + pointsAwarded;
        playerStats.setOverallScore(newOverallScore);
        saveOverallScoreToStorage(selectedGrade, newOverallScore);
    }
  };

  const handleNPCModalClose = (selectedGrade: GradeLevel | null, setGameState: (s: any) => void) => {
    playSound(BUTTON_CLICK_SOUND_URL);
    if (activeNPCData && activeNPCData.interaction.type !== 'riddle' && selectedGrade) {
        const pointsAwarded = activeNPCData.interaction.points;
        if (pointsAwarded > 0) {
            const newOverallScore = playerStats.overallScore + pointsAwarded;
            playerStats.setOverallScore(newOverallScore);
            saveOverallScoreToStorage(selectedGrade, newOverallScore);
            showToast(`Bạn nhận được ${pointsAwarded} điểm từ ${activeNPCData.npc.name}!`, 'info');
        }
    }
    challenges.updateDailyChallengeProgress(CHALLENGE_ACTION_NPC_INTERACTED);
    challenges.updateWeeklyChallengeProgress(CHALLENGE_ACTION_NPC_INTERACTED);
    setShowNPCModal(false);
    setActiveNPCData(null);
    saveActiveNPCToStorage(null);
    setGameState('IslandMap');
  };

  const trySpawnCollectible = useCallback(() => {
    if (Object.keys(activeCollectible).length > 0) return;
    const allCompletedIslands = ISLAND_CONFIGS.filter(island => {
        const gradeProgress = playerProgress.allGradesProgress[island.targetGradeLevel];
        return gradeProgress && gradeProgress[island.islandId] === 'completed' &&
               (!activeTreasureChests[island.targetGradeLevel] || !activeTreasureChests[island.targetGradeLevel]?.[island.islandId]) &&
               (!activeNPCData || activeNPCData.islandId !== island.islandId || activeNPCData.grade !== island.targetGradeLevel) &&
               (!activeMessageBottle || !activeMessageBottle[island.islandId]);
    });
    if (allCompletedIslands.length === 0) return;
    if (Math.random() < COLLECTIBLE_SPAWN_CHANCE) {
        const randomIsland = allCompletedIslands[Math.floor(Math.random() * allCompletedIslands.length)];
        const randomCollectibleItem = COLLECTIBLE_ITEMS[Math.floor(Math.random() * COLLECTIBLE_ITEMS.length)];
        const newCollectibleState: ActiveCollectibleState = { [randomIsland.islandId]: { grade: randomIsland.targetGradeLevel, collectibleId: randomCollectibleItem.id } };
        setActiveCollectible(newCollectibleState);
        saveActiveCollectibleToStorage(newCollectibleState);
        playSound(COLLECTIBLE_SPAWN_SOUND_URL, 0.35);
    }
  }, [playerProgress.allGradesProgress, activeCollectible, activeTreasureChests, activeNPCData, activeMessageBottle, playSound]);

  const handleCollectibleInteraction = (islandId: string) => {
    const collectibleInfo = activeCollectible[islandId];
    if (collectibleInfo) {
      const item = COLLECTIBLE_ITEMS.find(c => c.id === collectibleInfo.collectibleId);
      if (item) {
        playSound(COLLECTIBLE_COLLECT_SOUND_URL, 0.5);
        showToast(COLLECTIBLE_COLLECTION_TOAST_MESSAGE(item.name), 'info', React.createElement(CollectionIcon, { className: "w-6 h-6" }));
        playerCollections.setCollectedItems(prev => {
          const updated = { ...prev, [item.id]: true };
          saveCollectedItemsToStorage(updated);
          return updated;
        });
      }
    }
    setActiveCollectible({});
    saveActiveCollectibleToStorage({});
    setTimeout(() => playerCollections.checkAndAwardAchievements(), 100);
  };
  
  const getTreasureChestModalProps = (grade: GradeLevel | null, islandId: string | null) => {
      if (!grade || !islandId) return null;
      const islandConfig = ISLAND_CONFIGS.find(i => i.islandId === islandId);
      return {
          isOpen: true,
          islandName: islandConfig?.name || "Bí Ẩn",
          onClose: (pointsAwarded: number) => handleTreasureChestOpened(grade, islandId, pointsAwarded, () => {}), // setGameState is handled in gameflow
          playSound,
      };
  };
  
  const getMessageInBottleModalProps = (setGameState: (s:any) => void) => {
      if (!showBottleModalForIslandId || !currentBottleMessageContent) return null;
      const islandConfig = ISLAND_CONFIGS.find(i => i.islandId === showBottleModalForIslandId);
      return {
          isOpen: true,
          islandName: islandConfig?.name || "Một hòn đảo",
          message: currentBottleMessageContent,
          onClose: () => handleMessageBottleClosed(setGameState),
          playSound,
      };
  };

  const getFriendlyNPCModalProps = (grade: GradeLevel | null, setGameState: (s:any) => void) => {
    if (!activeNPCData) return null;
      const islandConfig = ISLAND_CONFIGS.find(i => i.islandId === activeNPCData.islandId);
      return {
          isOpen: true,
          npcData: activeNPCData.npc,
          interactionContent: activeNPCData.interaction,
          islandName: islandConfig?.name || "Nơi bí ẩn",
          onClose: () => handleNPCModalClose(grade, setGameState),
          playSound,
          onSubmitRiddle: () => handleNPCRiddleSubmit(grade),
          riddleAnswerInput: npcRiddleAnswer,
          onRiddleAnswerChange: setNpcRiddleAnswer,
          riddlePhase: npcRiddlePhase,
          isRiddleCorrect: isNpcRiddleCorrect,
      };
  }

  const resetForNewGradeJourney = useCallback(() => {
    // Reset modal states
    setShowTreasureModalForIslandId(null);
    setShowBottleModalForIslandId(null);
    setCurrentBottleMessageContent(null);
    setShowNPCModal(false);

    // Reset NPC interaction state
    setNpcRiddleAnswer('');
    setNpcRiddlePhase('question');
    setIsNpcRiddleCorrect(null);
    
    // Reset shooting star
    setShootingStar(null);
    if (shootingStarTimerRef.current) {
      clearTimeout(shootingStarTimerRef.current);
      shootingStarTimerRef.current = null;
    }

    // Reset global, single-instance events so they can respawn on the next map view
    setActiveMessageBottle({});
    saveActiveMessageBottlesToStorage({});
    setActiveNPCData(null);
    saveActiveNPCToStorage(null);
    setActiveCollectible({});
    saveActiveCollectibleToStorage({});
  }, []);


  return {
    activeTreasureChests, showTreasureModalForIslandId, setShowTreasureModalForIslandId,
    activeMessageBottle, showBottleModalForIslandId, currentBottleMessageContent,
    shootingStar, setShootingStar, shootingStarTimerRef,
    activeNPCData, showNPCModal,
    activeCollectible,
    trySpawnTreasureChests, handleTreasureChestOpened,
    trySpawnMessageBottle, handleMessageBottleOpened, handleMessageBottleClosed,
    spawnShootingStar, handleShootingStarClick,
    trySpawnFriendlyNPC, handleNPCInteraction,
    trySpawnCollectible, handleCollectibleInteraction,
    getTreasureChestModalProps, getMessageInBottleModalProps, getFriendlyNPCModalProps,
    resetForNewGradeJourney,
  };
};