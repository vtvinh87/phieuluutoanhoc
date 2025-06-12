
import React from 'react';
import LoadingSpinner from './LoadingSpinner';
import { LightbulbIcon, SparklesIcon } from './icons';
import { useTheme } from '../contexts/ThemeContext';

interface HintModalProps {
  isOpen: boolean;
  onClose: () => void;
  hint: string | null;
  isLoading: boolean;
}

const HintModal: React.FC<HintModalProps> = ({ isOpen, onClose, hint, isLoading }) => {
  const { themeConfig } = useTheme();
  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 flex items-center justify-center p-4 z-50 transition-opacity duration-300 bg-[var(--modal-bg-backdrop)]`}
      onClick={onClose}
    >
      <div 
        className={`p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-lg text-[var(--primary-text)] relative transform transition-all duration-300 scale-100 animate-slideUp ${themeConfig.frostedGlassOpacity || ''}`}
        style={{ background: themeConfig.modalContentBg }} // Allow gradient
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-3 right-3 text-[var(--primary-text)] hover:opacity-70 transition-colors"
          aria-label="Đóng gợi ý"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div className="flex items-center mb-4">
          <SparklesIcon className="w-10 h-10 text-[var(--modal-header-text)] mr-3" />
          <h2 className="text-2xl md:text-3xl font-bold text-[var(--modal-header-text)]">Gợi ý từ Thần Toán Học</h2>
        </div>

        {isLoading && <LoadingSpinner text="Thần Toán Học đang nghĩ gợi ý..." />}
        
        {!isLoading && hint && (
          <div className={`flex items-start text-lg md:text-xl leading-relaxed p-4 rounded-md bg-[var(--secondary-bg)] text-[var(--secondary-text)] ${themeConfig.frostedGlassOpacity || ''}`}>
            <LightbulbIcon className="w-12 h-12 text-[var(--accent-color)] mr-4 flex-shrink-0 mt-1" />
            <p>{hint}</p>
          </div>
        )}
        {!isLoading && !hint && (
            <p className="text-lg text-[var(--primary-text)] opacity-80">Không có gợi ý nào vào lúc này.</p>
        )}
        
        <button
          onClick={onClose}
          className="mt-6 w-full bg-[var(--button-primary-bg)] hover:opacity-90 text-[var(--button-primary-text)] font-bold py-3 px-4 rounded-lg shadow-md transition-colors duration-200 text-lg"
        >
          Đã hiểu!
        </button>
      </div>
    </div>
  );
};

export default HintModal;
