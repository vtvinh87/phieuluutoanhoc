import React from 'react';
import { CheckCircleIcon, XCircleIcon } from './icons';
import { useTheme } from '../contexts/ThemeContext';

interface FeedbackIndicatorProps {
  isCorrect: boolean | null;
  message?: string;
}

const FeedbackIndicator: React.FC<FeedbackIndicatorProps> = ({ isCorrect, message }) => {
  const { themeConfig } = useTheme();
  if (isCorrect === null) return null;

  const bgColorClass = isCorrect ? 'bg-[var(--correct-bg)]' : 'bg-[var(--incorrect-bg)]';
  const textColorClass = isCorrect ? 'text-[var(--correct-text)]' : 'text-[var(--incorrect-text)]';

  return (
    <div 
      className={`
        flex items-center p-4 rounded-lg shadow-lg
        ${bgColorClass} ${textColorClass} 
        transition-all duration-300 ease-in-out transform scale-100 animate-fadeIn
        ${themeConfig.frostedGlassOpacity && isCorrect ? themeConfig.frostedGlassOpacity.replace('bg-opacity-70', 'bg-opacity-90') : ''}
        ${themeConfig.frostedGlassOpacity && !isCorrect ? themeConfig.frostedGlassOpacity.replace('bg-opacity-70', 'bg-opacity-90') : ''}
        ${!isCorrect && isCorrect !== null ? 'animate-shake-error' : ''}
      `}
      role="alert"
    >
      {isCorrect ? <CheckCircleIcon className="w-8 h-8 mr-3" /> : <XCircleIcon className="w-8 h-8 mr-3" />}
      <span className="text-xl font-semibold">
        {message || (isCorrect ? 'Chính xác! Tuyệt vời!' : 'Chưa đúng rồi! Cố gắng lên!')}
      </span>
    </div>
  );
};

export default FeedbackIndicator;
