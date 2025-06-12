
import React from 'react';
import { Question } from '../types';
import { useTheme } from '../contexts/ThemeContext';

interface QuestionDisplayProps {
  question: Question;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({ question }) => {
  const { themeConfig } = useTheme();
  return (
    <div className={`mb-6 p-6 bg-[var(--question-display-bg)] rounded-xl shadow-2xl transition-all duration-300 hover:shadow-green-400/50 ${themeConfig.frostedGlassOpacity || ''}`}>
      <p className="text-2xl md:text-3xl font-bold text-[var(--question-display-text)] leading-tight text-center">
        {question.text}
      </p>
      {question.image && (
        <div className="mt-4 flex justify-center">
          <img 
            src={question.image} 
            alt="Hình ảnh minh họa cho câu hỏi" 
            className="rounded-lg shadow-lg max-w-full h-auto md:max-w-md border-4 border-[var(--question-display-image-border)] transition-transform duration-300 hover:scale-105"
          />
        </div>
      )}
    </div>
  );
};

export default QuestionDisplay;
