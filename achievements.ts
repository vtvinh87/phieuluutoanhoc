import { Achievement, GradeLevel, IslandConfig, IslandDifficulty, IslandProgressState, IslandStarRatingsState, AllGradesStarRatingsState } from './types';
import { ISLAND_CONFIGS, ISLANDS_PER_GRADE } from './constants'; 

const getIslandsForGrade = (grade: GradeLevel): IslandConfig[] => {
  return ISLAND_CONFIGS.filter(island => island.targetGradeLevel === grade);
};

export const ALL_ACHIEVEMENTS: Achievement[] = [
  // --- Grade Specific Achievements ---
  // Explorer: Complete 1 island in Grade X
  ...(Object.values(GradeLevel).filter(g => typeof g === 'number') as GradeLevel[]).map(grade => ({
    id: `ACH_ISLAND_EXPLORER_G${grade}`,
    name: `Nhà Thám Hiểm Lớp ${grade}`,
    description: () => `Hoàn thành 1 hòn đảo ở Lớp ${grade}.`,
    icon: '🏝️',
    gradeSpecific: true,
    condition: (selectedGrade, islandProgress) => {
      if (selectedGrade !== grade) return false;
      const islandsInGrade = getIslandsForGrade(grade);
      return islandsInGrade.some(island => islandProgress[island.islandId] === 'completed');
    }
  })),

  // Conqueror: Complete 3 islands in Grade X
  ...(Object.values(GradeLevel).filter(g => typeof g === 'number') as GradeLevel[]).map(grade => ({
    id: `ACH_ISLAND_CONQUEROR_G${grade}`,
    name: `Chinh Phục Gia Lớp ${grade}`,
    description: () => `Hoàn thành 3 hòn đảo khác nhau ở Lớp ${grade}.`,
    icon: '🗺️',
    gradeSpecific: true,
    condition: (selectedGrade, islandProgress) => {
      if (selectedGrade !== grade) return false;
      const islandsInGrade = getIslandsForGrade(grade);
      const completedCount = islandsInGrade.filter(island => islandProgress[island.islandId] === 'completed').length;
      return completedCount >= 3;
    }
  })),

  // Champion: Complete all islands in Grade X
  ...(Object.values(GradeLevel).filter(g => typeof g === 'number') as GradeLevel[]).map(grade => ({
    id: `ACH_GRADE_CHAMPION_G${grade}`,
    name: `Vô Địch Lớp ${grade}`,
    description: () => `Hoàn thành tất cả các hòn đảo ở Lớp ${grade}.`,
    icon: '🏆',
    gradeSpecific: true,
    condition: (selectedGrade, islandProgress) => {
      if (selectedGrade !== grade) return false;
      const islandsInGrade = getIslandsForGrade(grade);
      if (islandsInGrade.length === 0 || islandsInGrade.length < ISLANDS_PER_GRADE) return false;
      return islandsInGrade.every(island => islandProgress[island.islandId] === 'completed');
    }
  })),

  // Star Novice: Earn 10 stars in total in Grade X
  ...(Object.values(GradeLevel).filter(g => typeof g === 'number') as GradeLevel[]).map(grade => ({
    id: `ACH_STAR_NOVICE_G${grade}`,
    name: `Ngôi Sao Hy Vọng Lớp ${grade}`,
    description: () => `Đạt được tổng cộng 10 sao ở Lớp ${grade}.`,
    icon: '⭐',
    gradeSpecific: true,
    condition: (selectedGrade, _islandProgress, islandStarRatings) => {
      if (selectedGrade !== grade) return false;
      const islandsInGrade = getIslandsForGrade(grade);
      const totalStars = islandsInGrade.reduce((sum, island) => sum + (islandStarRatings[island.islandId] || 0), 0);
      return totalStars >= 10;
    }
  })),
  
  // Star Collector: Earn 25 stars in total in Grade X
   ...(Object.values(GradeLevel).filter(g => typeof g === 'number') as GradeLevel[]).map(grade => ({
    id: `ACH_STAR_COLLECTOR_G${grade}`,
    name: `Sưu Tầm Sao Lớp ${grade}`,
    description: () => `Đạt được tổng cộng 25 sao ở Lớp ${grade}.`,
    icon: '🌟',
    gradeSpecific: true,
    condition: (selectedGrade, _islandProgress, islandStarRatings) => {
      if (selectedGrade !== grade) return false;
      const islandsInGrade = getIslandsForGrade(grade);
      const totalStars = islandsInGrade.reduce((sum, island) => sum + (islandStarRatings[island.islandId] || 0), 0);
      return totalStars >= 25;
    }
  })),

  // Perfect Island: Get 5 stars on 1 island in Grade X
  ...(Object.values(GradeLevel).filter(g => typeof g === 'number') as GradeLevel[]).map(grade => ({
    id: `ACH_PERFECT_ISLAND_G${grade}`,
    name: `Hoàn Hảo Đầu Tiên Lớp ${grade}`,
    description: () => `Đạt 5 sao cho một hòn đảo bất kỳ ở Lớp ${grade}.`,
    icon: '✨',
    gradeSpecific: true,
    condition: (selectedGrade, _islandProgress, islandStarRatings) => {
      if (selectedGrade !== grade) return false;
      const islandsInGrade = getIslandsForGrade(grade);
      return islandsInGrade.some(island => islandStarRatings[island.islandId] === 5);
    }
  })),

  // Master of One: Get 5 stars on 3 different islands in Grade X
  ...(Object.values(GradeLevel).filter(g => typeof g === 'number') as GradeLevel[]).map(grade => ({
    id: `ACH_MASTER_OF_ISLANDS_G${grade}`,
    name: `Bậc Thầy Hoàn Hảo Lớp ${grade}`,
    description: () => `Đạt 5 sao cho 3 hòn đảo khác nhau ở Lớp ${grade}.`,
    icon: '🏅',
    gradeSpecific: true,
    condition: (selectedGrade, _islandProgress, islandStarRatings) => {
      if (selectedGrade !== grade) return false;
      const islandsInGrade = getIslandsForGrade(grade);
      const fiveStarIslandsCount = islandsInGrade.filter(island => islandStarRatings[island.islandId] === 5).length;
      return fiveStarIslandsCount >= 3;
    }
  })),

  // NEW: True Explorer: Unlock all islands in Grade X
  ...(Object.values(GradeLevel).filter(g => typeof g === 'number') as GradeLevel[]).map(grade => ({
    id: `ACH_TRUE_EXPLORER_G${grade}`,
    name: `Nhà Khám Phá Đích Thực Lớp ${grade}`,
    description: () => `Mở khóa tất cả các hòn đảo ở Lớp ${grade}.`,
    icon: '🗝️',
    gradeSpecific: true,
    condition: (selectedGrade, islandProgress, _isr, islandsForGrade) => {
      if (selectedGrade !== grade) return false;
      if (islandsForGrade.length === 0 || islandsForGrade.length < ISLANDS_PER_GRADE) return false;
      return islandsForGrade.every(island => islandProgress[island.islandId] === 'unlocked' || islandProgress[island.islandId] === 'completed');
    }
  })),

  // NEW: Grade Perfectionist: 5-star all islands in Grade X
  ...(Object.values(GradeLevel).filter(g => typeof g === 'number') as GradeLevel[]).map(grade => ({
    id: `ACH_GRADE_PERFECTIONIST_G${grade}`,
    name: `Bậc Thầy Toàn Sao Lớp ${grade}`,
    description: () => `Đạt 5 sao cho TẤT CẢ các hòn đảo ở Lớp ${grade}.`,
    icon: '💯',
    gradeSpecific: true,
    condition: (selectedGrade, _ip, islandStarRatings, islandsForGrade) => {
      if (selectedGrade !== grade) return false;
      if (islandsForGrade.length === 0 || islandsForGrade.length < ISLANDS_PER_GRADE) return false;
      return islandsForGrade.every(island => islandStarRatings[island.islandId] === 5);
    }
  })),
  
  // NEW: Hard Mode Warrior: Complete 1 island on Hard difficulty in Grade X
  ...(Object.values(GradeLevel).filter(g => typeof g === 'number') as GradeLevel[]).map(grade => ({
    id: `ACH_HARD_MODE_WARRIOR_G${grade}`,
    name: `Chiến Binh Cấp Khó Lớp ${grade}`,
    description: () => `Hoàn thành 1 hòn đảo ở Lớp ${grade} với độ khó "Khó".`,
    icon: '🔥',
    gradeSpecific: true,
    condition: (selectedGrade, islandProgress, _isr, _ifg, _cos, _agic, _agp, _ts, currentIslandDiff, _hui) => {
      // This achievement is checked when an island is completed.
      // We need to ensure the completed island is in the selectedGrade and was hard.
      if (selectedGrade !== grade || currentIslandDiff !== IslandDifficulty.HARD) return false;
      // The fact that the condition is checked implies an island was just completed.
      // We need to check if *any* island in this grade was completed on hard.
      // This specific condition is better checked directly using the context of the *just completed* island.
      // If this function is called upon completing an island, and that island was grade X and hard, then return true.
      return true; // The calling logic in GameScreen will ensure currentIslandDiff and selectedGrade match.
    }
  })),

  // NEW: No Hint Hero: Complete an island in Grade X without using hints
  ...(Object.values(GradeLevel).filter(g => typeof g === 'number') as GradeLevel[]).map(grade => ({
    id: `ACH_NO_HINT_HERO_G${grade}`,
    name: `Anh Hùng Không Cần Gợi Ý Lớp ${grade}`,
    description: () => `Hoàn thành 1 hòn đảo ở Lớp ${grade} mà không sử dụng gợi ý nào.`,
    icon: '🎯',
    gradeSpecific: true,
    condition: (selectedGrade, _ip, _isr, _ifg, _cos, _agic, _agp, _ts, _cid, hintUsed) => {
      // Checked upon island completion.
      if (selectedGrade !== grade || hintUsed === true) return false;
      return true; // If selectedGrade is correct and hintUsed is false.
    }
  })),

  // NEW: Grade High Scorer: Achieve 100 total points in Grade X
  ...(Object.values(GradeLevel).filter(g => typeof g === 'number') as GradeLevel[]).map(grade => ({
    id: `ACH_GRADE_HIGH_SCORER_G${grade}`,
    name: `Tay Chơi Điểm Cao Lớp ${grade}`,
    description: () => `Đạt tổng cộng 100 điểm ở Lớp ${grade}.`,
    icon: '💰',
    gradeSpecific: true,
    condition: (selectedGrade, _ip, _isr, _ifg, currentOverallScore) => {
      if (selectedGrade !== grade) return false;
      return currentOverallScore !== undefined && currentOverallScore >= 100;
    }
  })),

  // --- Global Achievements ---
  {
    id: 'ACH_FIRST_ISLAND_COMPLETED_ANY_GRADE',
    name: 'Bước Chân Đầu Tiên',
    description: () => 'Hoàn thành hòn đảo đầu tiên của bạn!',
    icon: '🌱',
    gradeSpecific: false,
    isGlobal: true,
    condition: (_sg, _ip, _isr, _ifg, _cos, _agic, allGradesProgress) => {
        if (!allGradesProgress) return false;
        for (const gradeKey in allGradesProgress) {
            const gradeProgress = allGradesProgress[gradeKey as unknown as GradeLevel];
            if (Object.values(gradeProgress).some(status => status === 'completed')) {
                return true;
            }
        }
        return false;
    }
  },
  {
    id: 'ACH_UNIVERSAL_EXPLORER',
    name: 'Nhà Khám Phá Tài Ba',
    description: () => 'Hoàn thành ít nhất 1 hòn đảo ở 3 Lớp học khác nhau.',
    icon: '🌍',
    gradeSpecific: false,
    isGlobal: true,
    condition: (_selectedGrade, _islandProgress, _islandStarRatings, _islandsForGrade, _overallScore, allGradeIslandConfigs, allGradesProgress) => {
        if (!allGradesProgress || !allGradeIslandConfigs) return false;
        
        const gradesWithCompletedIsland = new Set<GradeLevel>();
        
        for (const gradeStr in allGradesProgress) {
            const grade = parseInt(gradeStr) as GradeLevel;
            const progressForThisGrade = allGradesProgress[grade];
            const islandsInThisGrade = allGradeIslandConfigs.filter(i => i.targetGradeLevel === grade);

            if (islandsInThisGrade.some(island => progressForThisGrade[island.islandId] === 'completed')) {
                gradesWithCompletedIsland.add(grade);
            }
        }
        return gradesWithCompletedIsland.size >= 3;
    }
  },
  {
    id: 'ACH_THEME_SWAPPER',
    name: 'Người Thích Đổi Mới',
    description: () => 'Bạn đã khám phá và thay đổi giao diện của trò chơi!',
    icon: '🎨',
    gradeSpecific: false,
    isGlobal: true,
    condition: (_sg, _ip, _isr, _ifg, _os, _agic, _agp, themeSwapped) => {
      return themeSwapped === true;
    }
  },
  {
    id: 'ACH_TOTAL_ISLANDS_COMPLETED_5',
    name: 'Lữ Khách Chăm Chỉ',
    description: () => 'Hoàn thành tổng cộng 5 hòn đảo bất kỳ.',
    icon: '🎒',
    gradeSpecific: false,
    isGlobal: true,
    condition: (_sg, _ip, _isr, _ifg, _os, allGradeIslandConfigs, allGradesProgress) => {
        if (!allGradesProgress || !allGradeIslandConfigs) return false;
        let totalCompleted = 0;
         for (const gradeStr in allGradesProgress) {
            const progressForThisGrade = allGradesProgress[parseInt(gradeStr) as GradeLevel];
            totalCompleted += Object.values(progressForThisGrade).filter(status => status === 'completed').length;
        }
        return totalCompleted >= 5;
    }
  },
  {
    id: 'ACH_CONSISTENCY_ACE',
    name: 'Tay Chơi Kiên Định',
    description: () => 'Đạt 3 sao trở lên cho 5 hòn đảo khác nhau (bất kỳ lớp nào).',
    icon: '🧑‍🏫',
    gradeSpecific: false,
    isGlobal: true,
    condition: (_sg, _ip, _isr, _ifg, _cos, _agic, _agp, _ts, _cid, _hui, allGradesStarRatings) => {
      if (!allGradesStarRatings) return false;
      let islandsWithGoodRating = 0;
      for (const gradeKey in allGradesStarRatings) {
        const gradeStars = allGradesStarRatings[gradeKey as unknown as GradeLevel];
        for (const islandId in gradeStars) {
          if (gradeStars[islandId] >= 3) {
            islandsWithGoodRating++;
          }
        }
      }
      return islandsWithGoodRating >= 5;
    }
  },
];