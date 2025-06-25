
import React from 'react';
import { Question } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface QuestionDisplayProps {
  question: Question;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({ question }) => {
  const { themeConfig } = useTheme();
  return (
    <div className={`mb-4 sm:mb-6 p-3 sm:p-4 md:p-6 bg-[var(--question-display-bg)] rounded-lg sm:rounded-xl shadow-xl sm:shadow-2xl transition-all duration-300 hover:shadow-green-400/50 ${themeConfig.frostedGlassOpacity || ''}`}>
      <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-[var(--question-display-text)] leading-tight text-center">
        {question.text}
      </p>
      {question.image && (
        <div className="mt-3 sm:mt-4 flex justify-center">
          <img 
            src={question.image} 
            alt="Hình ảnh minh họa cho câu hỏi" 
            className="rounded-md sm:rounded-lg shadow-md sm:shadow-lg max-w-full h-auto max-h-[150px] sm:max-h-[200px] md:max-h-[250px] lg:max-h-[300px] border-2 sm:border-4 border-[var(--question-display-image-border)] transition-transform duration-300 hover:scale-105"
          />
        </div>
      )}
    </div>
  );
};

export default QuestionDisplay;