
import React from 'react';
import { Achievement, AchievedAchievement, GradeLevel } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { GRADE_LEVEL_TEXT_MAP, ACHIEVED_ON_TEXT } from '../constants';
import { CheckCircleIcon, LockClosedIcon } from './icons';

interface AchievementItemProps {
  achievement: Achievement;
  achievedData: AchievedAchievement | undefined;
  currentGradeForFiltering?: GradeLevel | null;
}

const AchievementItem: React.FC<AchievementItemProps> = ({ achievement, achievedData, currentGradeForFiltering }) => {
  const { themeConfig } = useTheme();
  const isAchieved = !!achievedData;

  const descriptionText = typeof achievement.description === 'function'
    ? achievement.description(currentGradeForFiltering ? GRADE_LEVEL_TEXT_MAP[currentGradeForFiltering] : undefined)
    : achievement.description;

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const iconColor = isAchieved ? 'text-[var(--accent-color)]' : 'text-[var(--secondary-text)] opacity-60';
  const textColor = isAchieved ? 'text-[var(--primary-text)]' : 'text-[var(--secondary-text)] opacity-80';
  const titleColor = isAchieved ? 'text-[var(--accent-color)] font-semibold' : textColor;

  const bgColorClass = isAchieved
    ? `bg-[var(--secondary-bg)] shadow-md border-[var(--accent-color)]`
    : `bg-[var(--secondary-bg)] opacity-80 border-[var(--border-color)]`;

  return (
    <div
      className={`
        p-3 sm:p-4 rounded-xl border-2 flex items-start gap-3 sm:gap-4 transition-all duration-300 transform
        ${bgColorClass}
        ${isAchieved ? 'hover:shadow-lg hover:scale-[1.015]' : 'cursor-default'}
        ${themeConfig.frostedGlassOpacity || ''}
      `}
      aria-label={`${achievement.name}${isAchieved ? ' (Đã đạt được)' : ' (Chưa đạt được)'}`}
    >
      <div className={`flex-shrink-0 text-3xl sm:text-4xl ${iconColor} mt-1`}>
        {isAchieved ? achievement.icon : <LockClosedIcon className="w-8 h-8 sm:w-10 sm:h-10" />}
      </div>
      <div className="flex-grow">
        <h3 className={`text-md sm:text-lg font-bold ${titleColor} mb-0.5 sm:mb-1`}>{achievement.name}</h3>
        <p className={`text-xs sm:text-sm ${textColor} opacity-90 mb-1`}>{descriptionText}</p>
        {isAchieved && achievedData?.achievedAt && (
          <p className="text-xs sm:text-sm text-[var(--accent-color)] opacity-90 font-medium mt-1 flex items-center">
            <CheckCircleIcon className="w-4 h-4 mr-1.5" />
            {ACHIEVED_ON_TEXT} {formatDate(achievedData.achievedAt)}
          </p>
        )}
      </div>
    </div>
  );
};

export default AchievementItem;
