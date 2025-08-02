import { Achievement, GradeLevel, IslandConfig, IslandDifficulty, IslandProgressState, IslandStarRatingsState, AllGradesStarRatingsState, CollectedItemsState, AchievementContext } from './types';
import { ISLAND_CONFIGS, ISLANDS_PER_GRADE, COLLECTIBLE_ITEMS, GRADE_LEVEL_TEXT_MAP, FINAL_TREASURE_ISLAND_ID } from './constants';

const getIslandsForGrade = (grade: GradeLevel, allConfigs: IslandConfig[]): IslandConfig[] => {
  if (grade === GradeLevel.FINAL) {
    return allConfigs.filter(island => island.targetGradeLevel === GradeLevel.FINAL);
  }
  return allConfigs.filter(island => island.targetGradeLevel === grade && island.islandId !== FINAL_TREASURE_ISLAND_ID);
};

export const ALL_ACHIEVEMENTS: Achievement[] = [
  // --- Grade Specific Achievements ---
  ...(Object.values(GradeLevel).filter(g => typeof g === 'number' && g !== GradeLevel.FINAL) as GradeLevel[]).flatMap(grade => [
    {
      id: `ACH_ISLAND_EXPLORER_G${grade}`,
      name: `Nhà Thám Hiểm Lớp ${GRADE_LEVEL_TEXT_MAP[grade]}`,
      description: () => `Hoàn thành 1 hòn đảo ở Lớp ${GRADE_LEVEL_TEXT_MAP[grade]}.`,
      icon: '🏝️',
      gradeSpecific: true,
      condition: (context: AchievementContext) => {
        const { selectedGrade, islandProgress } = context;
        if (selectedGrade !== grade || !islandProgress) return false;
        const islandsInGrade = getIslandsForGrade(grade, ISLAND_CONFIGS);
        return islandsInGrade.some(island => islandProgress[island.islandId] === 'completed');
      }
    },
    {
      id: `ACH_ISLAND_CONQUEROR_G${grade}`,
      name: `Chinh Phục Gia Lớp ${GRADE_LEVEL_TEXT_MAP[grade]}`,
      description: () => `Hoàn thành 3 hòn đảo khác nhau ở Lớp ${GRADE_LEVEL_TEXT_MAP[grade]}.`,
      icon: '🗺️',
      gradeSpecific: true,
      condition: (context: AchievementContext) => {
        const { selectedGrade, islandProgress } = context;
        if (selectedGrade !== grade || !islandProgress) return false;
        const islandsInGrade = getIslandsForGrade(grade, ISLAND_CONFIGS);
        const completedCount = islandsInGrade.filter(island => islandProgress[island.islandId] === 'completed').length;
        return completedCount >= 3;
      }
    },
    {
      id: `ACH_GRADE_CHAMPION_G${grade}`,
      name: `Vô Địch Lớp ${GRADE_LEVEL_TEXT_MAP[grade]}`,
      description: () => `Hoàn thành tất cả các hòn đảo ở Lớp ${GRADE_LEVEL_TEXT_MAP[grade]}.`,
      icon: '🏆',
      gradeSpecific: true,
      condition: (context: AchievementContext) => {
        const { selectedGrade, islandProgress } = context;
        if (selectedGrade !== grade || !islandProgress) return false;
        const islandsInGrade = getIslandsForGrade(grade, ISLAND_CONFIGS);
        if (islandsInGrade.length === 0 || islandsInGrade.length < ISLANDS_PER_GRADE) return false;
        return islandsInGrade.every(island => islandProgress[island.islandId] === 'completed');
      }
    },
    {
      id: `ACH_STAR_NOVICE_G${grade}`,
      name: `Ngôi Sao Hy Vọng Lớp ${GRADE_LEVEL_TEXT_MAP[grade]}`,
      description: () => `Đạt được tổng cộng 10 sao ở Lớp ${GRADE_LEVEL_TEXT_MAP[grade]}.`,
      icon: '⭐',
      gradeSpecific: true,
      condition: (context: AchievementContext) => {
        const { selectedGrade, islandStarRatings } = context;
        if (selectedGrade !== grade || !islandStarRatings) return false;
        const islandsInGrade = getIslandsForGrade(grade, ISLAND_CONFIGS);
        const totalStars = islandsInGrade.reduce((sum, island) => sum + (islandStarRatings[island.islandId] || 0), 0);
        return totalStars >= 10;
      }
    },
    {
      id: `ACH_STAR_COLLECTOR_G${grade}`,
      name: `Sưu Tầm Sao Lớp ${GRADE_LEVEL_TEXT_MAP[grade]}`,
      description: () => `Đạt được tổng cộng 25 sao ở Lớp ${GRADE_LEVEL_TEXT_MAP[grade]}.`,
      icon: '🌟',
      gradeSpecific: true,
      condition: (context: AchievementContext) => {
        const { selectedGrade, islandStarRatings } = context;
        if (selectedGrade !== grade || !islandStarRatings) return false;
        const islandsInGrade = getIslandsForGrade(grade, ISLAND_CONFIGS);
        const totalStars = islandsInGrade.reduce((sum, island) => sum + (islandStarRatings[island.islandId] || 0), 0);
        return totalStars >= 25;
      }
    },
    {
      id: `ACH_PERFECT_ISLAND_G${grade}`,
      name: `Hoàn Hảo Đầu Tiên Lớp ${GRADE_LEVEL_TEXT_MAP[grade]}`,
      description: () => `Đạt 5 sao cho một hòn đảo bất kỳ ở Lớp ${GRADE_LEVEL_TEXT_MAP[grade]}.`,
      icon: '✨',
      gradeSpecific: true,
      condition: (context: AchievementContext) => {
        const { selectedGrade, islandStarRatings } = context;
        if (selectedGrade !== grade || !islandStarRatings) return false;
        const islandsInGrade = getIslandsForGrade(grade, ISLAND_CONFIGS);
        return islandsInGrade.some(island => islandStarRatings[island.islandId] === 5);
      }
    },
    {
      id: `ACH_MASTER_OF_ISLANDS_G${grade}`,
      name: `Bậc Thầy Hoàn Hảo Lớp ${GRADE_LEVEL_TEXT_MAP[grade]}`,
      description: () => `Đạt 5 sao cho 3 hòn đảo khác nhau ở Lớp ${GRADE_LEVEL_TEXT_MAP[grade]}.`,
      icon: '🏅',
      gradeSpecific: true,
      condition: (context: AchievementContext) => {
        const { selectedGrade, islandStarRatings } = context;
        if (selectedGrade !== grade || !islandStarRatings) return false;
        const islandsInGrade = getIslandsForGrade(grade, ISLAND_CONFIGS);
        const fiveStarIslandsCount = islandsInGrade.filter(island => islandStarRatings[island.islandId] === 5).length;
        return fiveStarIslandsCount >= 3;
      }
    },
    {
      id: `ACH_TRUE_EXPLORER_G${grade}`,
      name: `Nhà Khám Phá Đích Thực Lớp ${GRADE_LEVEL_TEXT_MAP[grade]}`,
      description: () => `Mở khóa tất cả các hòn đảo ở Lớp ${GRADE_LEVEL_TEXT_MAP[grade]}.`,
      icon: '🗝️',
      gradeSpecific: true,
      condition: (context: AchievementContext) => {
        const { selectedGrade, islandProgress } = context;
        if (selectedGrade !== grade || !islandProgress) return false;
        const islandsInGrade = getIslandsForGrade(grade, ISLAND_CONFIGS);
        if (islandsInGrade.length === 0 || islandsInGrade.length < ISLANDS_PER_GRADE) return false;
        return islandsInGrade.every(island => islandProgress[island.islandId] === 'unlocked' || islandProgress[island.islandId] === 'completed');
      }
    },
    {
      id: `ACH_GRADE_PERFECTIONIST_G${grade}`,
      name: `Bậc Thầy Toàn Sao Lớp ${GRADE_LEVEL_TEXT_MAP[grade]}`,
      description: () => `Đạt 5 sao cho TẤT CẢ các hòn đảo ở Lớp ${GRADE_LEVEL_TEXT_MAP[grade]}.`,
      icon: '💯',
      gradeSpecific: true,
      condition: (context: AchievementContext) => {
        const { selectedGrade, islandStarRatings } = context;
        if (selectedGrade !== grade || !islandStarRatings) return false;
        const islandsInGrade = getIslandsForGrade(grade, ISLAND_CONFIGS);
        if (islandsInGrade.length === 0 || islandsInGrade.length < ISLANDS_PER_GRADE) return false;
        return islandsInGrade.every(island => islandStarRatings[island.islandId] === 5);
      }
    },
    {
      id: `ACH_HARD_MODE_WARRIOR_G${grade}`,
      name: `Chiến Binh Cấp Khó Lớp ${GRADE_LEVEL_TEXT_MAP[grade]}`,
      description: () => `Hoàn thành 1 hòn đảo ở Lớp ${GRADE_LEVEL_TEXT_MAP[grade]} với độ khó "Khó".`,
      icon: '🔥',
      gradeSpecific: true,
      condition: (context: AchievementContext) => {
        const { selectedGrade, islandProgress, currentIslandDifficulty } = context;
        // This condition is tricky because currentIslandDifficulty is set upon completion of an island.
        // We need to check if AN island of this grade was completed with HARD difficulty.
        // This usually implies this achievement is checked *after* an island completion.
        if (selectedGrade !== grade || !islandProgress) return false;
        return currentIslandDifficulty === IslandDifficulty.HARD; // Assumes this check is run right after an island completion
      }
    },
    {
      id: `ACH_NO_HINT_HERO_G${grade}`,
      name: `Anh Hùng Không Gợi Ý Lớp ${GRADE_LEVEL_TEXT_MAP[grade]}`,
      description: () => `Hoàn thành 1 hòn đảo ở Lớp ${GRADE_LEVEL_TEXT_MAP[grade]} mà không sử dụng gợi ý nào.`,
      icon: '🎯',
      gradeSpecific: true,
      condition: (context: AchievementContext) => {
        const { selectedGrade, hintUsedInLastIslandCompletion } = context;
        // Similar to hard mode, this is usually checked after island completion.
        if (selectedGrade !== grade) return false;
        return hintUsedInLastIslandCompletion === false;
      }
    },
    {
      id: `ACH_GRADE_HIGH_SCORER_G${grade}`,
      name: `Tay Chơi Điểm Cao Lớp ${GRADE_LEVEL_TEXT_MAP[grade]}`,
      description: () => `Đạt tổng cộng 100 điểm ở Lớp ${GRADE_LEVEL_TEXT_MAP[grade]}.`,
      icon: '💰',
      gradeSpecific: true,
      condition: (context: AchievementContext) => {
        const { selectedGrade, currentOverallScore } = context;
        if (selectedGrade !== grade || currentOverallScore === undefined) return false;
        return currentOverallScore >= 100;
      }
    },
  ]).flat(),

  // --- Global Achievements ---
  {
    id: 'ACH_THEME_CHANGER',
    name: 'Nhà Tạo Mốt',
    description: () => 'Thay đổi giao diện trò chơi lần đầu tiên.',
    icon: '🎨',
    gradeSpecific: false,
    isGlobal: true,
    condition: (context: AchievementContext) => !!context.themeSwapped,
  },
  {
    id: 'ACH_FIRST_TREASURE',
    name: 'Thợ Săn Kho Báu Tập Sự',
    description: () => 'Mở rương báu đầu tiên.',
    icon: '🎁',
    gradeSpecific: false,
    isGlobal: true,
    condition: (context: AchievementContext) => {
        // This requires tracking if a treasure chest was *ever* opened.
        // The current context doesn't directly track this.
        // Assuming it's awarded when a chest is opened and this achievement isn't yet achieved.
        // For now, can be triggered from GameScreen when a chest is opened.
        // Let's make it check if any island progress implies a chest *could* have been opened.
        // Better: GameScreen will call awardAchievement directly for event-based ones.
        // So, this can be a placeholder or GameScreen can award it. For simplicity, let's assume it's event-based.
        return false; // Will be awarded by GameScreen directly.
    }
  },
  {
    id: 'ACH_COLLECTOR_APPRENTICE',
    name: 'Nhà Sưu Tầm Nhí',
    description: () => `Thu thập 1 vật phẩm sưu tầm bất kỳ.`,
    icon: '🐚',
    gradeSpecific: false,
    isGlobal: true,
    condition: (context: AchievementContext) => {
      const { collectedItems } = context;
      return collectedItems ? Object.keys(collectedItems).length >= 1 : false;
    }
  },
  {
    id: 'ACH_COLLECTOR_MASTER',
    name: 'Bậc Thầy Sưu Tầm',
    description: () => `Thu thập tất cả ${COLLECTIBLE_ITEMS.length} vật phẩm sưu tầm.`,
    icon: '👑',
    gradeSpecific: false,
    isGlobal: true,
    condition: (context: AchievementContext) => {
      const { collectedItems } = context;
      if (!collectedItems) return false;
      return Object.keys(collectedItems).length >= COLLECTIBLE_ITEMS.length;
    }
  },
  {
    id: 'ACH_GRAND_CHAMPION',
    name: 'Nhà Vô Địch Vĩ Đại',
    description: () => 'Hoàn thành tất cả các hòn đảo của tất cả các lớp (Lớp 1-5).',
    icon: '🏅',
    gradeSpecific: false,
    isGlobal: true,
    condition: (context: AchievementContext) => {
      const { allGradesProgress, allGradeIslandConfigs } = context;
      if (!allGradesProgress || !allGradeIslandConfigs) return false;
      const normalGrades = Object.values(GradeLevel).filter(g => typeof g === 'number' && g !== GradeLevel.FINAL) as GradeLevel[];
      return normalGrades.every(grade => {
        const islandsInGrade = getIslandsForGrade(grade, allGradeIslandConfigs);
        if (islandsInGrade.length === 0 || islandsInGrade.length < ISLANDS_PER_GRADE) return false;
        const gradeProgress = allGradesProgress[grade];
        if (!gradeProgress) return false;
        return islandsInGrade.every(island => gradeProgress[island.islandId] === 'completed');
      });
    }
  },
  {
    id: 'ACH_STAR_GRANDMASTER',
    name: 'Bậc Thầy Ngàn Sao',
    description: () => 'Đạt 5 sao cho tất cả các hòn đảo của tất cả các lớp (Lớp 1-5).',
    icon: '🌌',
    gradeSpecific: false,
    isGlobal: true,
    condition: (context: AchievementContext) => {
      const { allGradesStarRatings, allGradeIslandConfigs } = context;
      if (!allGradesStarRatings || !allGradeIslandConfigs) return false;
      const normalGrades = Object.values(GradeLevel).filter(g => typeof g === 'number' && g !== GradeLevel.FINAL) as GradeLevel[];
      return normalGrades.every(grade => {
        const islandsInGrade = getIslandsForGrade(grade, allGradeIslandConfigs);
        if (islandsInGrade.length === 0 || islandsInGrade.length < ISLANDS_PER_GRADE) return false;
        const gradeStars = allGradesStarRatings[grade];
        if (!gradeStars) return false;
        return islandsInGrade.every(island => gradeStars[island.islandId] === 5);
      });
    }
  },
  {
    id: 'ACH_ENDLESS_INITIATE',
    name: 'Người Chơi Vô Tận',
    description: () => 'Bắt đầu Chế Độ Vô Tận lần đầu tiên.',
    icon: '♾️',
    gradeSpecific: false,
    isGlobal: true,
    condition: (context: AchievementContext) => {
        // This would likely be awarded directly when endless mode is first started.
        // The context might not be enough for this one unless we store a flag.
        return false; // GameScreen will award this.
    }
  },
  {
    id: 'ACH_ENDLESS_MARATHONER',
    name: 'Vận Động Viên Vô Tận',
    description: () => 'Trả lời đúng 20 câu hỏi trong một phiên Chế Độ Vô Tận.',
    icon: '🏃',
    gradeSpecific: false,
    isGlobal: true,
    condition: (context: AchievementContext) => {
        // Needs context for current endless session progress.
        return false; // GameScreen would award this based on endless session data.
    }
  },
  {
    id: 'ACH_FINAL_ISLAND_UNLOCKED',
    name: 'Người Mở Lối',
    description: () => 'Mở khóa Đảo Thử Thách Tối Thượng.',
    icon: '🔑',
    gradeSpecific: false,
    isGlobal: true,
    condition: (context: AchievementContext) => !!context.isFinalIslandUnlocked
  },
  {
    id: 'ACH_FINAL_CHALLENGER',
    name: 'Thử Thách Gia Tối Thượng',
    description: () => 'Hoàn thành tất cả 5 hòn đảo thử thách chính.',
    icon: '⚔️',
    gradeSpecific: false,
    isGlobal: true,
    condition: (context: AchievementContext) => {
        const { allGradesProgress, allGradeIslandConfigs } = context;
        if (!allGradesProgress || !allGradeIslandConfigs || !allGradesProgress[GradeLevel.FINAL]) return false;
        const finalProgress = allGradesProgress[GradeLevel.FINAL];
        const mainFinalIslands = allGradeIslandConfigs.filter(i => i.targetGradeLevel === GradeLevel.FINAL && i.islandNumber <= 5);
        if (mainFinalIslands.length < 5) return false;
        return mainFinalIslands.every(island => finalProgress[island.islandId] === 'completed');
    }
  },
  {
    id: 'ACH_TREASURE_LEGEND',
    name: 'Huyền Thoại Đảo Kho Báu',
    description: () => 'Hoàn thành Thánh Địa Trí Tuệ Tối Thượng.',
    icon: '👑💎',
    gradeSpecific: false,
    isGlobal: true,
    condition: (context: AchievementContext) => {
        const { allGradesProgress } = context;
        if (!allGradesProgress || !allGradesProgress[GradeLevel.FINAL]) return false;
        return allGradesProgress[GradeLevel.FINAL][FINAL_TREASURE_ISLAND_ID] === 'completed';
    }
  },
  {
    id: 'ACH_DAILY_CHALLENGE_ACE',
    name: 'Thử Thách Gia Hàng Ngày',
    description: () => 'Hoàn thành 1 Thử Thách Hàng Ngày.',
    icon: '📅',
    gradeSpecific: false,
    isGlobal: true,
    condition: (context: AchievementContext) => (context.completedDailyChallengesCount || 0) >= 1
  },
  {
    id: 'ACH_DAILY_CHALLENGE_VETERAN',
    name: 'Chiến Binh Thử Thách Ngày',
    description: () => 'Hoàn thành 7 Thử Thách Hàng Ngày.',
    icon: '🗓️',
    gradeSpecific: false,
    isGlobal: true,
    condition: (context: AchievementContext) => (context.completedDailyChallengesCount || 0) >= 7
  },
  {
    id: 'ACH_WEEKLY_CHALLENGE_CONQUEROR',
    name: 'Chinh Phục Thử Thách Tuần',
    description: () => 'Hoàn thành 1 Thử Thách Tuần.',
    icon: '🏆✨',
    gradeSpecific: false,
    isGlobal: true,
    condition: (context: AchievementContext) => (context.completedWeeklyChallengesCount || 0) >= 1
  },
  {
    id: 'ACH_GEM_SAVER',
    name: 'Nhà Tiết Kiệm Đá Quý',
    description: () => 'Tích lũy được 100 Đá Quý.',
    icon: '💎',
    gradeSpecific: false,
    isGlobal: true,
    condition: (context: AchievementContext) => (context.playerGems || 0) >= 100
  },
  {
    id: 'ACH_GEM_MAGNATE',
    name: 'Trùm Đá Quý',
    description: () => 'Tích lũy được 1000 Đá Quý.',
    icon: '💎💰',
    gradeSpecific: false,
    isGlobal: true,
    condition: (context: AchievementContext) => (context.playerGems || 0) >= 1000
  },
  // Add more global achievements here as needed
];