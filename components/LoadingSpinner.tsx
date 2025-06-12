
import React from 'react';

const LoadingSpinner: React.FC<{ size?: string; text?: string }> = ({ 
  size = 'w-12 h-12', 
  text 
}) => {
  // spinnerColor is now a full class string like 'border-yellow-400' or 'border-teal-400'
  // It's set via CSS variable --spinner-color on :root
  return (
    <div className="flex flex-col items-center justify-center">
      <div 
        className={`animate-spin rounded-full ${size} border-t-6 border-b-6`} 
        style={{borderColor: 'transparent', borderTopColor: 'var(--spinner-border-color)', borderBottomColor: 'var(--spinner-border-color)'}}
      ></div>
      {text && <p className="mt-3 text-lg text-[var(--primary-text)] opacity-80">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;