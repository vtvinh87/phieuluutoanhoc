
import React from 'react';
import { CheckCircleIcon, XCircleIcon } from './icons';

interface FeedbackIndicatorProps {
  isCorrect: boolean | null;
  message?: string;
}

const FeedbackIndicator: React.FC<FeedbackIndicatorProps> = ({ isCorrect, message }) => {
  if (isCorrect === null) return null;

  return (
    <div 
      className={`
        flex items-center p-4 my-4 rounded-lg shadow-lg
        ${isCorrect ? 'bg-green-500' : 'bg-red-500'} 
        text-white transition-all duration-300 ease-in-out transform scale-100 animate-fadeIn
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
