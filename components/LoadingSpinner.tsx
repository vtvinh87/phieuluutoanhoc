
import React from 'react';

const LoadingSpinner: React.FC<{ size?: string; color?: string; text?: string }> = ({ 
  size = 'w-12 h-12', 
  color = 'border-yellow-400',
  text 
}) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`animate-spin rounded-full ${size} border-t-4 border-b-4 ${color}`}></div>
      {text && <p className="mt-3 text-lg text-yellow-300">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
