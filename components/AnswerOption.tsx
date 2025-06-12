
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface AnswerOptionProps {
  optionText: string;
  onClick: () => void;
  disabled: boolean;
  isSelected?: boolean;
  isCorrect?: boolean; 
  userAttemptShown?: boolean; 
  solutionRevealed?: boolean; 
}

const AnswerOption: React.FC<AnswerOptionProps> = ({ 
  optionText, 
  onClick, 
  disabled,
  isSelected,
  isCorrect,
  userAttemptShown,
  solutionRevealed
}) => {
  const { themeConfig } = useTheme();

  let bgColorClass = 'bg-[var(--button-answer-option-bg)] hover:opacity-80';
  let textColorClass = 'text-[var(--button-answer-option-text)]';
  let ringColorClass = 'ring-[var(--button-answer-option-ring)] focus:ring-[var(--button-answer-option-ring)]';
  let currentOpacity = 'opacity-100';


  if (userAttemptShown) {
    if (isSelected) {
      bgColorClass = isCorrect ? 'bg-[var(--correct-bg)]' : 'bg-[var(--incorrect-bg)]';
      textColorClass = isCorrect ? 'text-[var(--correct-text)]' : 'text-[var(--incorrect-text)]';
      ringColorClass = isCorrect ? 'ring-[var(--correct-ring)] focus:ring-[var(--correct-ring)]' : 'ring-[var(--incorrect-ring)] focus:ring-[var(--incorrect-ring)]';
    } else {
      if (solutionRevealed) {
        if (isCorrect) { 
          bgColorClass = 'bg-[var(--correct-bg)]'; 
          textColorClass = 'text-[var(--correct-text)]';
          ringColorClass = 'ring-[var(--correct-ring)] focus:ring-[var(--correct-ring)]';
        } else { 
          bgColorClass = 'bg-gray-500'; // Neutral for incorrect, unselected, revealed
          textColorClass = 'text-gray-300';
          ringColorClass = 'ring-gray-400 focus:ring-gray-400';
          currentOpacity = 'opacity-60';
        }
      } else {
         // Default button style, but slightly dimmed as it's not the selected one during an attempt
         bgColorClass = 'bg-[var(--button-answer-option-bg)]';
         textColorClass = 'text-[var(--button-answer-option-text)]';
         ringColorClass = 'ring-[var(--button-answer-option-ring)] focus:ring-[var(--button-answer-option-ring)]';
         currentOpacity = 'opacity-70';
      }
    }
  } else if (isSelected) {
    bgColorClass = 'bg-[var(--button-answer-option-selected-bg)] hover:opacity-90';
    textColorClass = 'text-[var(--button-answer-option-selected-text)]';
    ringColorClass = 'ring-[var(--button-answer-option-selected-ring)] focus:ring-[var(--button-answer-option-selected-ring)]';
  }
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full p-4 md:p-5 rounded-lg shadow-md transition-all duration-200 ease-in-out
        text-lg md:text-xl font-semibold focus:outline-none focus:ring-4 
        ${bgColorClass} ${textColorClass} ${ringColorClass} ${currentOpacity}
        ${disabled && !userAttemptShown ? 'opacity-60 cursor-not-allowed' : ''}
        ${!disabled ? 'transform hover:scale-105 active:scale-95 active:brightness-90' : ''}
      `}
    >
      {optionText}
    </button>
  );
};

export default AnswerOption;