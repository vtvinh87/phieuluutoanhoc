
import { Achievement, GradeLevel, IslandConfig, IslandDifficulty, IslandProgressState, IslandStarRatingsState, AllGradesStarRatingsState, CollectedItemsState, AchievementContext } from './types';
import { ISLAND_CONFIGS, ISLANDS_PER_GRADE, COLLECTIBLE_ITEMS } from './constants';

const getIslandsForGrade = (grade: GradeLevel): IslandConfig[] => {
  return ISLAND_CONFIGS.filter(island => island.targetGradeLevel === grade);
};

export const ALL_ACHIEVEMENTS: Achievement[] = [
  // --- Grade Specific Achievements ---
  ...(Object.values(GradeLevel).filter(g => typeof g === 'number') as GradeLevel[]).map(grade => ({
    id: `ACH_ISLAND_EXPLORER_G${grade}`,
    name: `Nhà Thám Hiểm Lớp ${grade}`,
    description: () => `Hoàn thành 1 hòn đảo ở Lớp ${grade}.`,
    icon: '🏝️',
    gradeSpecific: true,
    condition: (context: AchievementContext) => {
      const { selectedGrade, islandProgress } = context;
      if (selectedGrade !== grade || !islandProgress) return false;
      const islandsInGrade = getIslandsForGrade(grade);
      return islandsInGrade.some(island => islandProgress[island.islandId] === 'completed');
    }
  })),
  ...(Object.values(GradeLevel).filter(g => typeof g === 'number') as GradeLevel[]).map(grade => ({
    id: `ACH_ISLAND_CONQUEROR_G${grade}`,
    name: `Chinh Phục Gia Lớp ${grade}`,
    description: () => `Hoàn thành 3 hòn đảo khác nhau ở Lớp ${grade}.`,
    icon: '🗺️',
    gradeSpecific: true,
    condition: (context: AchievementContext) => {
      const { selectedGrade, islandProgress } = context;
      if (selectedGrade !== grade || !islandProgress) return false;
      const islandsInGrade = getIslandsForGrade(grade);
      const completedCount = islandsInGrade.filter(island => islandProgress[island.islandId] === 'completed').length;
      return completedCount >= 3;
    }
  })),
  ...(Object.values(GradeLevel).filter(g => typeof g === 'number') as GradeLevel[]).map(grade => ({
    id: `ACH_GRADE_CHAMPION_G${grade}`,
    name: `Vô Địch Lớp ${grade}`,
    description: () => `Hoàn thành tất cả các hòn đảo ở Lớp ${grade}.`,
    icon: '🏆',
    gradeSpecific: true,
    condition: (context: AchievementContext) => {
      const { selectedGrade, islandProgress } = context;
      if (selectedGrade !== grade || !islandProgress) return false;
      const islandsInGrade = getIslandsForGrade(grade);
      if (islandsInGrade.length === 0 || islandsInGrade.length < ISLANDS_PER_GRADE) return false;
      return islandsInGrade.every(island => islandProgress[island.islandId] === 'completed');
    }
  })),
  ...(Object.values(GradeLevel).filter(g => typeof g === 'number') as GradeLevel[]).map(grade => ({
    id: `ACH_STAR_NOVICE_G${grade}`,
    name: `Ngôi Sao Hy Vọng Lớp ${grade}`,
    description: () => `Đạt được tổng cộng 10 sao ở Lớp ${grade}.`,
    icon: '⭐',
    gradeSpecific: true,
    condition: (context: AchievementContext) => {
      const { selectedGrade, islandStarRatings } = context;
      if (selectedGrade !== grade || !islandStarRatings) return false;
      const islandsInGrade = getIslandsForGrade(grade);
      const totalStars = islandsInGrade.reduce((sum, island) => sum + (islandStarRatings[island.islandId] || 0), 0);
      return totalStars >= 10;
    }
  })),
   ...(Object.values(GradeLevel).filter(g => typeof g === 'number') as GradeLevel[]).map(grade => ({
    id: `ACH_STAR_COLLECTOR_G${grade}`,
    name: `Sưu Tầm Sao Lớp ${grade}`,
    description: () => `Đạt được tổng cộng 25 sao ở Lớp ${grade}.`,
    icon: '🌟',
    gradeSpecific: true,
    condition: (context: AchievementContext) => {
      const { selectedGrade, islandStarRatings } = context;
      if (selectedGrade !== grade || !islandStarRatings) return false;
      const islandsInGrade = getIslandsForGrade(grade);
      const totalStars = islandsInGrade.reduce((sum, island) => sum + (islandStarRatings[island.islandId] || 0), 0);
      return totalStars >= 25;
    }
  })),
  ...(Object.values(GradeLevel).filter(g => typeof g === 'number') as GradeLevel[]).map(grade => ({
    id: `ACH_PERFECT_ISLAND_G${grade}`,
    name: `Hoàn Hảo Đầu Tiên Lớp ${grade}`,
    description: () => `Đạt 5 sao cho một hòn đảo bất kỳ ở Lớp ${grade}.`,
    icon: '✨',
    gradeSpecific: true,
    condition: (context: AchievementContext) => {
      const { selectedGrade, islandStarRatings } = context;
      if (selectedGrade !== grade || !islandStarRatings) return false;
      const islandsInGrade = getIslandsForGrade(grade);
      return islandsInGrade.some(island => islandStarRatings[island.islandId] === 5);
    }
  })),
  ...(Object.values(GradeLevel).filter(g => typeof g === 'number') as GradeLevel[]).map(grade => ({
    id: `ACH_MASTER_OF_ISLANDS_G${grade}`,
    name: `Bậc Thầy Hoàn Hảo Lớp ${grade}`,
    description: () => `Đạt 5 sao cho 3 hòn đảo khác nhau ở Lớp ${grade}.`,
    icon: '🏅',
    gradeSpecific: true,
    condition: (context: AchievementContext) => {
      const { selectedGrade, islandStarRatings } = context;
      if (selectedGrade !== grade || !islandStarRatings) return false;
      const islandsInGrade = getIslandsForGrade(grade);
      const fiveStarIslandsCount = islandsInGrade.filter(island => islandStarRatings[island.islandId] === 5).length;
      return fiveStarIslandsCount >= 3;
    }
  })),
  ...(Object.values(GradeLevel).filter(g => typeof g === 'number') as GradeLevel[]).map(grade => ({
    id: `ACH_TRUE_EXPLORER_G${grade}`,
    name: `Nhà Khám Phá Đích Thực Lớp ${grade}`,
    description: () => `Mở khóa tất cả các hòn đảo ở Lớp ${grade}.`,
    icon: '🗝️',
    gradeSpecific: true,
    condition: (context: AchievementContext) => {
      const { selectedGrade, islandProgress, islandsForGrade } = context;
      if (selectedGrade !== grade || !islandProgress || !islandsForGrade) return false;
      if (islandsForGrade.length === 0 || islandsForGrade.length < ISLANDS_PER_GRADE) return false;
      return islandsForGrade.every(island => islandProgress[island.islandId] === 'unlocked' || islandProgress[island.islandId] === 'completed');
    }
  })),
  ...(Object.values(GradeLevel).filter(g => typeof g === 'number') as GradeLevel[]).map(grade => ({
    id: `ACH_GRADE_PERFECTIONIST_G${grade}`,
    name: `Bậc Thầy Toàn Sao Lớp ${grade}`,
    description: () => `Đạt 5 sao cho TẤT CẢ các hòn đảo ở Lớp ${grade}.`,
    icon: '💯',
    gradeSpecific: true,
    condition: (context: AchievementContext) => {
      const { selectedGrade, islandStarRatings, islandsForGrade } = context;
      if (selectedGrade !== grade || !islandStarRatings || !islandsForGrade) return false;
      if (islandsForGrade.length === 0 || islandsForGrade.length < ISLANDS_PER_GRADE) return false;
      return islandsForGrade.every(island => islandStarRatings[island.islandId] === 5);
    }
  })),
  ...(Object.values(GradeLevel).filter(g => typeof g === 'number') as GradeLevel[]).map(grade => ({
    id: `ACH_HARD_MODE_WARRIOR_G${grade}`,
    name: `Chiến Binh Cấp Khó Lớp ${grade}`,
    description: () => `Hoàn thành 1 hòn đảo ở Lớp ${grade} với độ khó "Khó".`,
    icon: '🔥',
    gradeSpecific: true,
    condition: (context: AchievementContext) => {
      const { selectedGrade, currentIslandDifficulty } = context;
      if (selectedGrade !== grade || currentIslandDifficulty !== IslandDifficulty.HARD) return false;
      return true;
    }
  })),
  ...(Object.values(GradeLevel).filter(g => typeof g === 'number') as GradeLevel[]).map(grade => ({
    id: `ACH_NO_HINT_HERO_G${grade}`,
    name: `Anh Hùng Không Cần Gợi Ý Lớp ${grade}`,
    description: () => `Hoàn thành 1 hòn đảo ở Lớp ${grade} mà không sử dụng gợi ý nào.`,
    icon: '🎯',
    gradeSpecific: true,
    condition: (context: AchievementContext) => {
        const { selectedGrade, hintUsedInLastIslandCompletion } = context;
      if (selectedGrade !== grade || hintUsedInLastIslandCompletion === true) return false;
      return true;
    }
  })),
  ...(Object.values(GradeLevel).filter(g => typeof g === 'number') as GradeLevel[]).map(grade => ({
    id: `ACH_GRADE_HIGH_SCORER_G${grade}`,
    name: `Tay Chơi Điểm Cao Lớp ${grade}`,
    description: () => `Đạt tổng cộng 100 điểm ở Lớp ${grade}.`,
    icon: '💰',
    gradeSpecific: true,
    condition: (context: AchievementContext) => {
      const { selectedGrade, currentOverallScore } = context;
      if (selectedGrade !== grade) return false;
