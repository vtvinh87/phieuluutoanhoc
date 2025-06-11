import React from 'react';
import { Question } from '../types';

interface QuestionDisplayProps {
  question: Question;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({ question }) => {
  return (
    <div className="mb-6 p-6 bg-green-700 bg-opacity-80 rounded-xl shadow-2xl transition-all duration-300 hover:shadow-green-400/50">
      <p className="text-2xl md:text-3xl font-bold text-yellow-300 leading-tight text-center">
        {question.text}
      </p>
      {question.image && (
        <div className="mt-4 flex justify-center">
          <img 
            src={question.image} 
            alt="Hình ảnh minh họa cho câu hỏi" 
            className="rounded-lg shadow-lg max-w-full h-auto md:max-w-md border-4 border-yellow-400 transition-transform duration-300 hover:scale-105"
          />
        </div>
      )}
      {/* Optional: Display topic or target grade if needed for debugging or UI */}
      {/* <p className="text-xs text-yellow-100 text-center mt-2">Chủ đề: {question.topic} (Mức độ: {question.targetGradeLevel})</p> */}
    </div>
  );
};

export default QuestionDisplay;