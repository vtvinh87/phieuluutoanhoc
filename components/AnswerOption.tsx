
import React from 'react';

interface AnswerOptionProps {
  optionText: string;
  onClick: () => void;
  disabled: boolean;
  isSelected?: boolean;
  isCorrect?: boolean; // Intrinsic correctness of this option
  userAttemptShown?: boolean; // Has the user submitted an answer for the current question?
  solutionRevealed?: boolean; // Should the full solution (correct/incorrect for all) be shown?
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
  let bgColor = 'bg-blue-600 hover:bg-blue-700';
  let textColor = 'text-white';
  let ringColor = 'ring-blue-400 focus:ring-blue-400';

  if (userAttemptShown) {
    if (isSelected) {
      // This option was selected by the user
      bgColor = isCorrect ? 'bg-green-500' : 'bg-red-500';
      textColor = isCorrect ? 'text-white' : 'text-white';
      ringColor = isCorrect ? 'ring-green-300 focus:ring-green-300' : 'ring-red-300 focus:ring-red-300';
    } else {
      // This option was NOT selected.
      // Only change its style if we're revealing the full solution.
      if (solutionRevealed) {
        if (isCorrect) { // This unselected option IS the correct one
          bgColor = 'bg-green-500'; // Highlight it
          textColor = 'text-white';
          ringColor = 'ring-green-300 focus:ring-green-300';
        } else { // This unselected option is also incorrect
          bgColor = 'bg-gray-500 opacity-70'; 
          textColor = 'text-gray-300';
          ringColor = 'ring-gray-400 focus:ring-gray-400';
        }
      } else {
        // User attempt shown, but solution not fully revealed (i.e., retry possible for this question instance)
        // Keep unselected options as default, or slightly dimmed if preferred.
        // Default blue means they look active, which might be confusing if they are disabled.
        // Let's make them slightly less prominent if an attempt is shown but solution isn't revealed.
         bgColor = 'bg-blue-600 opacity-80'; // Slightly dimmed if user attempt shown but not selected
         ringColor = 'ring-blue-400 focus:ring-blue-400 opacity-80';
      }
    }
  } else if (isSelected) {
    // Standard selection highlight before submitting an answer
    bgColor = 'bg-yellow-500 hover:bg-yellow-600';
    textColor = 'text-black';
    ringColor = 'ring-yellow-300 focus:ring-yellow-300';
  }
  
  return (
    <button
      onClick={onClick}
      disabled={disabled} // Disabled state is now fully controlled by GameScreen
      className={`
        w-full p-4 md:p-5 rounded-lg shadow-md transition-all duration-200 ease-in-out
        text-lg md:text-xl font-semibold focus:outline-none focus:ring-4 ${ringColor}
        ${bgColor} ${textColor}
        ${disabled ? 'opacity-60 cursor-not-allowed' : 'transform hover:scale-105 active:scale-95'}
      `}
    >
      {optionText}
    </button>
  );
};

export default AnswerOption;
