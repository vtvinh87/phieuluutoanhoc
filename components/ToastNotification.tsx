import React, { useEffect } from 'react';
import { ToastMessage } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { CheckCircleIcon, SparklesIcon, AlertTriangleIcon, LightbulbIcon as InfoIcon } from './icons';

interface ToastNotificationProps {
  toast: ToastMessage | null;
  onDismiss: () => void;
}

const ToastNotification: React.FC<ToastNotificationProps> = ({ toast, onDismiss }) => {
  const { themeConfig } = useTheme();

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onDismiss();
      }, 3500); // Auto-dismiss after 3.5 seconds
      return () => clearTimeout(timer);
    }
  }, [toast, onDismiss]);

  if (!toast) return null;

  let bgColor = 'bg-[var(--accent-color)]';
  let textColor = 'text-[var(--accent-text)]';
  let IconComponent = toast.icon || <SparklesIcon className="w-6 h-6 sm:w-7 sm:h-7" />; // Default icon

  switch (toast.type) {
    case 'success':
      bgColor = 'bg-gradient-to-r from-[var(--correct-bg)] to-[var(--accent-color)]'; // Use gradient for success
      textColor = 'text-[var(--correct-text)]'; // Ensure high contrast on gradient
      IconComponent = toast.icon || <CheckCircleIcon className="w-6 h-6 sm:w-7 sm:h-7" />;
      break;
    case 'error':
      bgColor = 'bg-[var(--incorrect-bg)]';
      textColor = 'text-[var(--incorrect-text)]';
      IconComponent = toast.icon || <AlertTriangleIcon className="w-6 h-6 sm:w-7 sm:h-7" />;
      break;
    case 'warning':
      bgColor = 'bg-yellow-500'; // Example, ideally from themeConfig if defined
      textColor = 'text-white';
      IconComponent = toast.icon || <AlertTriangleIcon className="w-6 h-6 sm:w-7 sm:h-7" />;
      break;
    case 'info':
      bgColor = 'bg-sky-500'; // Example, ideally from themeConfig if defined
      textColor = 'text-white';
      IconComponent = toast.icon || <InfoIcon className="w-6 h-6 sm:w-7 sm:h-7" />;
      break;
  }
  
  // Ensure text for success is bright enough on its gradient
  if (toast.type === 'success') {
    textColor = 'text-white'; // Override for success gradient
  }


  return (
    <div
      className={`
        fixed top-5 right-5 sm:top-6 sm:right-6 z-[100] 
        flex items-center gap-3 p-3 sm:p-4 rounded-xl shadow-2xl 
        ${bgColor} ${textColor} 
        transition-all duration-500 ease-in-out transform 
        animate-fadeInScale
        ${themeConfig.frostedGlassOpacity ? themeConfig.frostedGlassOpacity.replace('bg-opacity-70', 'bg-opacity-85') : ''}
        max-w-xs sm:max-w-sm border border-white/20
      `}
      role="alert"
      aria-live="assertive"
    >
      <div className="flex-shrink-0">{IconComponent}</div>
      <div className="flex-grow">
        <p className="font-semibold text-sm sm:text-base leading-snug">{toast.message}</p>
      </div>
      <button
        onClick={onDismiss}
        className={`${textColor} opacity-60 hover:opacity-100 transition-opacity ml-1 sm:ml-2 p-1 rounded-full hover:bg-black/10 active:bg-black/20`}
        aria-label="Đóng thông báo"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default ToastNotification;