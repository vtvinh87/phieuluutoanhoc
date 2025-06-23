
import { Achievement, GradeLevel, IslandConfig, IslandDifficulty, IslandProgressState, IslandStarRatingsState, AllGradesStarRatingsState, CollectedItemsState, AchievementContext } from './types';
import { ISLAND_CONFIGS, ISLANDS_PER_GRADE, COLLECTIBLE_ITEMS, GRADE_LEVEL_TEXT_MAP, FINAL_TREASURE_ISLAND_ID } from './constants';

const getIslandsForGrade = (grade: GradeLevel): IslandConfig[] => {
  if (grade === GradeLevel.FINAL) {
    return ISLAND_CONFIGS.filter(island => island.islandId === FINAL_TREASURE_ISLAND_ID);
  }
  return ISLAND_CONFIGS.filter(island => island.targetGradeLevel === grade && island.islandId !== FINAL_TREASURE_ISLAND_ID);
};

export const ALL_ACHIEVEMENTS: Achievement[] = [
  // --- Grade Specific Achievements ---
  ...(Object.values(GradeLevel).filter(g => typeof g === 'number' && g !== GradeLevel.FINAL) as GradeLevel[]).map(grade => ({
    id: `ACH_ISLAND_EXPLORER_G${grade}`,
    name: `Nhà Thám Hiểm Lớp ${GRADE_LEVEL_TEXT_MAP[grade]}`,
    description: () => `Hoàn thành 1 hòn đảo ở Lớp ${GRADE_LEVEL_TEXT_MAP[grade]}.`,
    icon: '🏝️',
    gradeSpecific: true,
    condition: (context: AchievementContext) => {
      const { selectedGrade, islandProgress } = context;
      if (selectedGrade !== grade || !islandProgress) return false;
      const islandsInGrade = getIslandsForGrade(grade);
      return islandsInGrade.some(island => islandProgress[island.islandId] === 'completed');
    }
  })),
  ...(Object.values(GradeLevel).filter(g => typeof g === 'number' && g !== GradeLevel.FINAL) as GradeLevel[]).map(grade => ({
    id: `ACH_ISLAND_CONQUEROR_G${grade}`,
    name: `Chinh Phục Gia Lớp ${GRADE_LEVEL_TEXT_MAP[grade]}`,
    description: () => `Hoàn thành 3 hòn đảo khác nhau ở Lớp ${GRADE_LEVEL_TEXT_MAP[grade]}.`,
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
  ...(Object.values(GradeLevel).filter(g => typeof g === 'number' && g !== GradeLevel.FINAL) as GradeLevel[]).map(grade => ({
    id: `ACH_GRADE_CHAMPION_G${grade}`,
    name: `Vô Địch Lớp ${GRADE_LEVEL_TEXT_MAP[grade]}`,
    description: () => `Hoàn thành tất cả các hòn đảo ở Lớp ${GRADE_LEVEL_TEXT_MAP[grade]}.`,
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
  ...(Object.values(GradeLevel).filter(g => typeof g === 'number' && g !== GradeLevel.FINAL) as GradeLevel[]).map(grade => ({
    id: `ACH_STAR_NOVICE_G${grade}`,
    name: `Ngôi Sao Hy Vọng Lớp ${GRADE_LEVEL_TEXT_MAP[grade]}`,
    description: () => `Đạt được tổng cộng 10 sao ở Lớp ${GRADE_LEVEL_TEXT_MAP[grade]}.`,
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
   ...(Object.values(GradeLevel).filter(g => typeof g === 'number' && g !== GradeLevel.FINAL) as GradeLevel[]).map(grade => ({
    id: `ACH_STAR_COLLECTOR_G${grade}`,
    name: `Sưu Tầm Sao Lớp ${GRADE_LEVEL_TEXT_MAP[grade]}`,
    description: () => `Đạt được tổng cộng 25 sao ở Lớp ${GRADE_LEVEL_TEXT_MAP[grade]}.`,
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
  ...(Object.values(GradeLevel).filter(g => typeof g === 'number' && g !== GradeLevel.FINAL) as GradeLevel[]).map(grade => ({
    id: `ACH_PERFECT_ISLAND_G${grade}`,
    name: `Hoàn Hảo Đầu Tiên Lớp ${GRADE_LEVEL_TEXT_MAP[grade]}`,
    description: () => `Đạt 5 sao cho một hòn đảo bất kỳ ở Lớp ${GRADE_LEVEL_TEXT_MAP[grade]}.`,
    icon: '✨',
    gradeSpecific: true,
    condition: (context: AchievementContext) => {
      const { selectedGrade, islandStarRatings } = context;
      if (selectedGrade !== grade || !islandStarRatings) return false;
      const islandsInGrade = getIslandsForGrade(grade);
      return islandsInGrade.some(island => islandStarRatings[island.islandId] === 5);
    }
  })),
  ...(Object.values(GradeLevel).filter(g => typeof g === 'number' && g !== GradeLevel.FINAL) as GradeLevel[]).map(grade => ({
    id: `ACH_MASTER_OF_ISLANDS_G${grade}`,
    name: `Bậc Thầy Hoàn Hảo Lớp ${GRADE_LEVEL_TEXT_MAP[grade]}`,
    description: () => `Đạt 5 sao cho 3 hòn đảo khác nhau ở Lớp ${GRADE_LEVEL_TEXT_MAP[grade]}.`,
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
  ...(Object.values(GradeLevel).filter(g => typeof g === 'number' && g !== GradeLevel.FINAL) as GradeLevel[]).map(grade => ({
    id: `ACH_TRUE_EXPLORER_G${grade}`,
    name: `Nhà Khám Phá Đích Thực Lớp ${GRADE_LEVEL_TEXT_MAP[grade]}`,
    description: () => `Mở khóa tất cả các hòn đảo ở Lớp ${GRADE_LEVEL_TEXT_MAP[grade]}.`,
    icon: '🗝️',
    gradeSpecific: true,
    condition: (context: AchievementContext) => {
      const { selectedGrade, islandProgress, islandsForGrade } = context; 
      if (selectedGrade !== grade || !islandProgress || !islandsForGrade ) return false;
      if (islandsForGrade.length === 0 || islandsForGrade.length < ISLANDS_PER_GRADE) return false;
      return islandsForGrade.every(island => islandProgress[island.islandId] === 'unlocked' || islandProgress[island.islandId] === 'completed');
    }
  })),
  ...(Object.values(GradeLevel).filter(g => typeof g === 'number' && g !== GradeLevel.FINAL) as GradeLevel[]).map(grade => ({
    id: `ACH_GRADE_PERFECTIONIST_G${grade}`,
    name: `Bậc Thầy Toàn Sao Lớp ${GRADE_LEVEL_TEXT_MAP[grade]}`,
    description: () => `Đạt 5 sao cho TẤT CẢ các hòn đảo ở Lớp ${GRADE_LEVEL_TEXT_MAP[grade]}.`,
    icon: '💯',
    gradeSpecific: true,
    condition: (context: AchievementContext) => {
      const { selectedGrade, islandStarRatings, islandsForGrade } = context;
      if (selectedGrade !== grade || !islandStarRatings || !islandsForGrade) return false;
      if (islandsForGrade.length === 0 || islandsForGrade.length < ISLANDS_PER_GRADE) return false;
      return islandsForGrade.every(island => islandStarRatings[island.islandId] === 5);
    }
  })),
  ...(Object.values(GradeLevel).filter(g => typeof g === 'number' && g !== GradeLevel.FINAL) as GradeLevel[]).map(grade => ({
    id: `ACH_HARD_MODE_WARRIOR_G${grade}`,
    name: `Chiến Binh Cấp Khó Lớp ${GRADE_LEVEL_TEXT_MAP[grade]}`,
    description: () => `Hoàn thành 1 hòn đảo ở Lớp ${GRADE_LEVEL_TEXT_MAP[grade]} với độ khó "Khó".`,
    icon: '🔥',
    gradeSpecific: true,
    condition: (context: AchievementContext) => {
      const { selectedGrade, currentIslandDifficulty } = context; 
      if (selectedGrade !== grade || !context.islandProgress) return false; 
      return currentIslandDifficulty === IslandDifficulty.HARD;
    }
  })),
  ...(Object.values(GradeLevel).filter(g => typeof g === 'number' && g !== GradeLevel.FINAL) as GradeLevel[]).map(grade => ({
    id: `ACH_NO_HINT_HERO_G${grade}`,
    name: `Anh Hùng Không Gợi Ý Lớp ${GRADE_LEVEL_TEXT_MAP[grade]}`,
    description: () => `Hoàn thành 1 hòn đảo ở Lớp ${GRADE_LEVEL_TEXT_MAP[grade]} mà không sử dụng gợi ý nào.`,
    icon: '🎯',
    gradeSpecific: true,
    condition: (context: AchievementContext) => {
        const { selectedGrade, hintUsedInLastIslandCompletion } = context; 
      if (selectedGrade !== grade) return false;
      return hintUsedInLastIslandCompletion === false; 
    }
  })),
  ...(Object.values(GradeLevel).filter(g => typeof g === 'number' && g !== GradeLevel.FINAL) as GradeLevel[]).map(grade => ({
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
  })),

  // --- Global Achievements ---
  {
    id: 'ACH_GRAND_CHAMPION',
    name: 'Nhà Vô Địch Vĩ Đại',
    description: () => 'Hoàn thành tất cả các hòn đảo của tất cả các lớp (trừ Đảo Kho Báu).',
    icon: '👑',
    gradeSpecific: false,
    isGlobal: true,
    condition: (context: AchievementContext) => {
      const { allGradesProgress, allGradeIslandConfigs } = context;
      if (!allGradesProgress || !allGradeIslandConfigs) return false;
      const normalGrades = Object.values(GradeLevel).filter(g => typeof g === 'number' && g !== GradeLevel.FINAL) as GradeLevel[];
      return normalGrades.every(grade => {
        const islandsInGrade = allGradeIslandConfigs.filter(i => i.targetGradeLevel === grade && i.islandId !== FINAL_TREASURE_ISLAND_ID);
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
    description: () => 'Đạt 5 sao cho tất cả các hòn đảo của tất cả các lớp (trừ Đảo Kho Báu).',
    icon: '🌌',
    gradeSpecific: false,
    isGlobal: true,
    condition: (context: AchievementContext) => {
      const { allGradesStarRatings, allGradeIslandConfigs } = context;
      if (!allGradesStarRatings || !allGradeIslandConfigs) return false;
       const normalGrades = Object.values(GradeLevel).filter(g => typeof g === 'number' && g !== GradeLevel.FINAL) as GradeLevel[];
      return normalGrades.every(grade => {
        const islandsInGrade = allGradeIslandConfigs.filter(i => i.targetGradeLevel === grade && i.islandId !== FINAL_TREASURE_ISLAND_ID);
         if (islandsInGrade.length === 0 || islandsInGrade.length < ISLANDS_PER_GRADE) return false;
        const gradeStars = allGradesStarRatings[grade];
        if (!gradeStars) return false;
        return islandsInGrade.every(island => gradeStars[island.islandId] === 5);
      });
    }
  },
  {
    id: 'ACH_THEME_CHANGER',
    name: 'Nhà Tạo Mốt',
    description: () => 'Thay đổi giao diện lần đầu tiên.',
    icon: '🎨',
    gradeSpecific: false,
    isGlobal: true,
    condition: (context: AchievementContext) => {
      return context.themeSwapped === true;
    }
  },
   {
    id: 'ACH_MASTER_COLLECTOR',
    name: 'Nhà Sưu Tầm Bậc Thầy',
    description: () => `Thu thập tất cả ${COLLECTIBLE_ITEMS.length} vật phẩm sưu tầm độc đáo.`,
    icon: '🏺',
    gradeSpecific: false,
    isGlobal: true,
    condition: (context: AchievementContext) => {
        const { collectedItems } = context;
        if (!collectedItems) return false;
        return COLLECTIBLE_ITEMS.every(item => collectedItems[item.id]);
    }
  },
  {
    id: 'ACH_ENDLESS_PIONEER',
    name: 'Người Tiên Phong Vô Tận',
    description: () => 'Mở khóa Chế độ Vô Tận cho một lớp học bất kỳ.',
    icon: '⏳',
    gradeSpecific: false,
    isGlobal: true,
    condition: (context: AchievementContext) => {
        const { isEndlessUnlockedForGrade } = context;
        if (!isEndlessUnlockedForGrade) return false;
        return Object.values(isEndlessUnlockedForGrade).some(unlocked => unlocked === true);
    }
  },
  {
    id: 'ACH_TREASURE_UNLOCKED',
    name: 'Truy Tìm Kho Báu',
    description: () => 'Mở khóa được Đảo Kho Báu Cuối Cùng.',
    icon: '🔑',
    gradeSpecific: false,
    isGlobal: true,
    condition: (context: AchievementContext) => {
        return context.isFinalIslandUnlocked === true;
    }
  },
  {
    id: 'ACH_FINAL_CONQUEROR',
    name: 'Chinh Phục Cuối Cùng',
    description: () => 'Hoàn thành Đảo Kho Báu Cuối Cùng.',
    icon: '💎',
    gradeSpecific: false, 
    isGlobal: true,
    condition: (context: AchievementContext) => {
        const { selectedGrade, islandProgress, allGradesProgress } = context;
        let finalIslandProgress: IslandProgressState | undefined;
        if (selectedGrade === GradeLevel.FINAL && islandProgress) finalIslandProgress = islandProgress;
        else if (allGradesProgress) finalIslandProgress = allGradesProgress[GradeLevel.FINAL];
        if (!finalIslandProgress) return false;
        return finalIslandProgress[FINAL_TREASURE_ISLAND_ID] === 'completed';
    }
  },
   {
    id: 'ACH_DAILY_CHALLENGER',
    name: 'Thử Thách Gia',
    description: () => 'Hoàn thành 1 thử thách hàng ngày.',
    icon: '📅',
    gradeSpecific: false,
    isGlobal: true,
    condition: (context: AchievementContext) => {
        return context.completedDailyChallengesCount !== undefined && context.completedDailyChallengesCount >= 1;
    }
  },
  {
    id: 'ACH_DAILY_STREAKER_5', // Renamed for clarity for 5 days
    name: 'Vận May 5 Ngày',
    description: () => 'Hoàn thành 5 thử thách hàng ngày (không nhất thiết liên tiếp).',
    icon: '🗓️', 
    gradeSpecific: false,
    isGlobal: true,
    condition: (context: AchievementContext) => {
        return context.completedDailyChallengesCount !== undefined && context.completedDailyChallengesCount >= 5;
    }
  },
  {
    id: 'ACH_DAILY_STREAKER_10', // Added 10 days
    name: 'Siêu Sao Thử Thách 10 Ngày',
    description: () => 'Hoàn thành 10 thử thách hàng ngày.',
    icon: '🌟🗓️', 
    gradeSpecific: false,
    isGlobal: true,
    condition: (context: AchievementContext) => {
        return context.completedDailyChallengesCount !== undefined && context.completedDailyChallengesCount >= 10;
    }
  },
  {
    id: 'ACH_GEM_HOARDER',
    name: 'Nhà Sưu Tầm Đá Quý',
    description: () => 'Tích lũy được 100 Đá Quý.',
    icon: '💍', 
    gradeSpecific: false,
    isGlobal: true,
    condition: (context: AchievementContext) => {
        return context.playerGems !== undefined && context.playerGems >= 100;
    }
  },
  {
    id: 'ACH_GEM_MILLIONAIRE', // New
    name: 'Triệu Phú Đá Quý',
    description: () => 'Tích lũy được 500 Đá Quý.',
    icon: '💎👑', 
    gradeSpecific: false,
    isGlobal: true,
    condition: (context: AchievementContext) => {
        return context.playerGems !== undefined && context.playerGems >= 500;
    }
  },
  {
    id: 'ACH_WEEKLY_WARRIOR', // New for weekly challenges
    name: 'Chiến Binh Tuần Hoàn',
    description: () => 'Hoàn thành 1 thử thách hàng tuần.',
    icon: '🛡️',
    gradeSpecific: false,
    isGlobal: true,
    condition: (context: AchievementContext) => {
      return context.completedWeeklyChallengesCount !== undefined && context.completedWeeklyChallengesCount >= 1;
    }
  },
  {
    id: 'ACH_WEEKLY_LEGEND', // New for weekly challenges
    name: 'Huyền Thoại Tuần Hoàn',
    description: () => 'Hoàn thành 4 thử thách hàng tuần (tức 1 tháng).',
    icon: '🏆🛡️',
    gradeSpecific: false,
    isGlobal: true,
    condition: (context: AchievementContext) => {
      return context.completedWeeklyChallengesCount !== undefined && context.completedWeeklyChallengesCount >= 4;
    }
  },
  {
    id: 'ACH_FIRST_TREASURE',
    name: 'Kho Báu Đầu Tiên',
    description: () => 'Mở chiếc rương báu đầu tiên của bạn.',
    icon: '🎁',
    gradeSpecific: false,
    isGlobal: true,
    condition: () => true, 
  },
  {
    id: 'ACH_MESSAGE_READER',
    name: 'Người Đọc Thông Điệp',
    description: () => 'Đọc thông điệp trong chai đầu tiên.',
    icon: '📜',
    gradeSpecific: false,
    isGlobal: true,
    condition: () => true, 
  },
  {
    id: 'ACH_LUCKY_STAR_CATCHER',
    name: 'Tay Bắt Sao',
    description: () => 'Bắt được một ngôi sao may mắn.',
    icon: '🌠',
    gradeSpecific: false,
    isGlobal: true,
    condition: () => true, 
  },
  {
    id: 'ACH_NPC_FRIEND',
    name: 'Bạn Của Muôn Loài',
    description: () => 'Tương tác với một nhân vật thân thiện lần đầu tiên.',
    icon: '🤝',
    gradeSpecific: false,
    isGlobal: true,
    condition: () => true, 
  },
];
