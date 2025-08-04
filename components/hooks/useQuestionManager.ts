import { useState, useCallback } from 'react';
import {
  Question, IslandConfig, PreloadedQuestionsCache, GradeLevel, IslandDifficulty
} from '../../types';
import {
  API_KEY_ERROR_MESSAGE, QUESTION_GENERATION_ERROR_MESSAGE, ISLAND_PREPARING_MESSAGE
} from '../../constants';
import { generateMathQuestionsForIslandSet, generateEndlessMathQuestions } from '../../services/geminiService';

interface UseQuestionManagerProps {
  playSound: (soundUrl: string, volume?: number) => void;
}

export const useQuestionManager = ({ playSound }: UseQuestionManagerProps) => {
  const [questionsForCurrentIsland, setQuestionsForCurrentIsland] = useState<Question[]>([]);
  const [currentQuestionIndexInIsland, setCurrentQuestionIndexInIsland] = useState(0);

  const [endlessQuestionBatch, setEndlessQuestionBatch] = useState<Question[]>([]);
  const [currentEndlessQuestionIndex, setCurrentEndlessQuestionIndex] = useState(0);
  const [preloadedEndlessBatch, setPreloadedEndlessBatch] = useState<Question[]>([]);
  const [isPreloadingEndlessBatch, setIsPreloadingEndlessBatch] = useState(false);

  const [preloadedQuestionsCache, setPreloadedQuestionsCache] = useState<PreloadedQuestionsCache>({});
  const [isIslandLoading, setIsIslandLoading] = useState(false);
  const [islandLoadingProgressMessage, setIslandLoadingProgressMessage] = useState<string>(ISLAND_PREPARING_MESSAGE("..."));
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [apiKeyMissing, setApiKeyMissing] = useState(!process.env.API_KEY);

  const resetForNewGradeJourney = useCallback(() => {
    setQuestionsForCurrentIsland([]);
    setCurrentQuestionIndexInIsland(0);
    setLoadingError(null);
    setPreloadedQuestionsCache({});
    setEndlessQuestionBatch([]);
    setCurrentEndlessQuestionIndex(0);
    setPreloadedEndlessBatch([]);
    setIsPreloadingEndlessBatch(false);
  }, []);

  const fetchAndSetQuestionsForIsland = useCallback(async (
    islandId: string,
    difficulty: IslandDifficulty,
    selectedGrade: GradeLevel,
    islandsForGrade: IslandConfig[]
  ): Promise<'success' | 'error'> => {
    if (apiKeyMissing) {
      setLoadingError(API_KEY_ERROR_MESSAGE);
      return 'error';
    }
    const islandConfig = islandsForGrade.find(i => i.islandId === islandId);
    if (!islandConfig) {
      setLoadingError("Không tìm thấy cấu hình đảo.");
      return 'error';
    }

    const cachedData = preloadedQuestionsCache[islandId]?.[difficulty];
    if (Array.isArray(cachedData)) {
      setQuestionsForCurrentIsland(cachedData);
      setCurrentQuestionIndexInIsland(0);
      return 'success'; 
    }

    setIsIslandLoading(true);
    setLoadingError(null);
    setIslandLoadingProgressMessage(ISLAND_PREPARING_MESSAGE(islandConfig.name));
    try {
      const fetchedQuestions = await generateMathQuestionsForIslandSet(islandConfig.targetGradeLevel, islandConfig.topics, islandConfig.name, islandConfig.islandId, difficulty);
      if (!fetchedQuestions || fetchedQuestions.length === 0) {
          throw new Error(QUESTION_GENERATION_ERROR_MESSAGE);
      }
      setPreloadedQuestionsCache(prev => ({ ...prev, [islandId]: { ...(prev[islandId] || {}), [difficulty]: fetchedQuestions } }));
      setQuestionsForCurrentIsland(fetchedQuestions);
      setCurrentQuestionIndexInIsland(0);
      return 'success';
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : QUESTION_GENERATION_ERROR_MESSAGE;
      setLoadingError(errorMessage);
      setPreloadedQuestionsCache(prev => ({ ...prev, [islandId]: { ...(prev[islandId] || {}), [difficulty]: 'error' } }));
      return 'error';
    } finally {
      setIsIslandLoading(false);
    }
  }, [apiKeyMissing, preloadedQuestionsCache]);

  const preloadIslandQuestions = useCallback(async (
    islandId: string,
    difficulty: IslandDifficulty,
    selectedGrade: GradeLevel,
    islandsForGrade: IslandConfig[]
  ) => {
    const cacheEntry = preloadedQuestionsCache[islandId]?.[difficulty];
    if (apiKeyMissing || cacheEntry === 'loading' || Array.isArray(cacheEntry)) {
      return;
    }
    const islandConfig = islandsForGrade.find(i => i.islandId === islandId);
    if (!islandConfig) {
      console.warn(`Preload failed: Could not find config for island ${islandId}`);
      return;
    }

    setPreloadedQuestionsCache(prev => ({ ...prev, [islandId]: { ...(prev[islandId] || {}), [difficulty]: 'loading' } }));
    
    try {
      const fetchedQuestions = await generateMathQuestionsForIslandSet(islandConfig.targetGradeLevel, islandConfig.topics, islandConfig.name, islandConfig.islandId, difficulty);
      if (fetchedQuestions && fetchedQuestions.length > 0) {
        setPreloadedQuestionsCache(prev => ({ ...prev, [islandId]: { ...(prev[islandId] || {}), [difficulty]: fetchedQuestions } }));
      } else {
        throw new Error("Preloaded questions came back empty.");
      }
    } catch (error) {
      console.warn(`Preloading questions for ${islandConfig.name} failed:`, error);
      setPreloadedQuestionsCache(prev => ({ ...prev, [islandId]: { ...(prev[islandId] || {}), [difficulty]: 'error' } }));
    }
  }, [apiKeyMissing, preloadedQuestionsCache]);
  
  const fetchNextEndlessBatch = useCallback(async (grade: GradeLevel, difficultyLevel: number): Promise<'success' | 'error'> => {
    if (apiKeyMissing) {
      setLoadingError(API_KEY_ERROR_MESSAGE);
      return 'error';
    }
    setIsIslandLoading(true);
    setLoadingError(null);
    try {
      const questions = await generateEndlessMathQuestions(grade, difficultyLevel);
      if (questions && questions.length > 0) {
        setEndlessQuestionBatch(questions);
        setCurrentEndlessQuestionIndex(0);
        return 'success';
      } else {
        throw new Error("Không thể tạo câu hỏi cho Chế Độ Vô Tận.");
      }
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Lỗi không xác định";
      setLoadingError(msg);
      return 'error';
    } finally {
      setIsIslandLoading(false);
    }
  }, [apiKeyMissing]);

  const preloadNextEndlessBatch = useCallback(async (grade: GradeLevel, difficultyLevel: number) => {
    if (apiKeyMissing || isPreloadingEndlessBatch || preloadedEndlessBatch.length > 0) return;
    setIsPreloadingEndlessBatch(true);
    try {
      const questions = await generateEndlessMathQuestions(grade, difficultyLevel);
      if (questions && questions.length > 0) {
        setPreloadedEndlessBatch(questions);
      }
    } catch (error) {
      console.warn("Lỗi tải trước câu hỏi vô tận:", error);
    } finally {
      setIsPreloadingEndlessBatch(false);
    }
  }, [apiKeyMissing, isPreloadingEndlessBatch, preloadedEndlessBatch.length]);


  return {
    questionsForCurrentIsland, setQuestionsForCurrentIsland,
    currentQuestionIndexInIsland, setCurrentQuestionIndexInIsland,
    endlessQuestionBatch, setEndlessQuestionBatch,
    currentEndlessQuestionIndex, setCurrentEndlessQuestionIndex,
    preloadedEndlessBatch, setPreloadedEndlessBatch,
    isPreloadingEndlessBatch,
    preloadedQuestionsCache, setPreloadedQuestionsCache,
    isIslandLoading,
    islandLoadingProgressMessage,
    loadingError, setLoadingError,
    apiKeyMissing, setApiKeyMissing,
    resetForNewGradeJourney,
    fetchAndSetQuestionsForIsland,
    preloadIslandQuestions,
    fetchNextEndlessBatch,
    preloadNextEndlessBatch
  };
};