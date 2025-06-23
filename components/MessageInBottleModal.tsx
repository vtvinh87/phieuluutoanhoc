
import React from 'react';
import { MessageInBottleContent, ThemeConfig } from '../types';
import { CLOSE_BUTTON_TEXT, MESSAGE_IN_BOTTLE_MODAL_TITLE, BUTTON_CLICK_SOUND_URL } from '../constants';
import { MailIcon as MessageIcon, SparklesIcon } from './icons'; // Using MailIcon as MessageIcon

interface MessageInBottleModalProps {
  isOpen: boolean;
  islandName: string;
  message: MessageInBottleContent;
  onClose: () => void;
  playSound: (soundUrl: string, volume?: number) => void;
  themeConfig: ThemeConfig;
}

const MessageInBottleModal: React.FC<MessageInBottleModalProps> = ({
  isOpen,
  islandName,
  message,
  onClose,
  playSound,
  themeConfig,
}) => {
  if (!isOpen) return null;

  const getMessageIcon = () => {
    switch (message.type) {
      case 'wish':
        return <SparklesIcon className="w-10 h-10 text-[var(--accent-color)] mr-3" />;
      case 'quote':
        return <MessageIcon className="w-10 h-10 text-[var(--accent-color)] mr-3" />; // Using existing MailIcon
      case 'hint':
        return <SparklesIcon className="w-10 h-10 text-[var(--accent-color)] mr-3" />; // Or a specific hint icon
      default:
        return <MessageIcon className="w-10 h-10 text-[var(--accent-color)] mr-3" />;
    }
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center p-4 z-[60] transition-opacity duration-300 bg-[var(--modal-bg-backdrop)] animate-fadeIn`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="message-bottle-modal-title"
    >
      <div
        className={`p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-lg relative transform transition-all duration-300 scale-100 animate-slideUp text-[var(--primary-text)] border-2 border-[var(--border-color)] ${themeConfig.frostedGlassOpacity || ''}`}
        style={{ background: themeConfig.modalContentBg }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => { playSound(BUTTON_CLICK_SOUND_URL); onClose(); }}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-[var(--primary-text)] hover:opacity-70 active:opacity-50 transition-colors"
          aria-label={CLOSE_BUTTON_TEXT}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-7 h-7 sm:w-8 sm:h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <header className="text-center mb-4">
          <div className="inline-block p-3 bg-[var(--accent-color)] bg-opacity-20 rounded-full mb-2">
             {getMessageIcon()}
          </div>
          <h2 id="message-bottle-modal-title" className="text-xl md:text-2xl font-bold text-[var(--modal-header-text)]">
            {MESSAGE_IN_BOTTLE_MODAL_TITLE}
          </h2>
          <p className="text-sm text-[var(--secondary-text)] opacity-80 mt-1">
            Tìm thấy tại: <span className="font-semibold">{islandName}</span>
          </p>
        </header>
        
        <div className={`my-4 p-4 rounded-lg bg-[var(--secondary-bg)] ${themeConfig.frostedGlassOpacity || 'bg-opacity-50'}`}>
          <p className="text-md md:text-lg text-[var(--secondary-text)] leading-relaxed text-center italic">
            "{message.text}"
          </p>
        </div>

        <button
          onClick={() => { playSound(BUTTON_CLICK_SOUND_URL); onClose(); }}
          className="mt-6 w-full bg-[var(--button-primary-bg)] hover:opacity-90 text-[var(--button-primary-text)] font-bold py-3 px-4 rounded-lg shadow-md transition-colors duration-200 text-lg"
        >
          {CLOSE_BUTTON_TEXT}
        </button>
      </div>
    </div>
  );
};

export default MessageInBottleModal;
