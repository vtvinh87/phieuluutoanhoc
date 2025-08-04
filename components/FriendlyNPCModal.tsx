
import React from 'react';
import type { FriendlyNPC, NPCInteraction, ThemeConfig } from '../types';
import {
    FRIENDLY_NPC_MODAL_TITLE_PREFIX,
    FRIENDLY_NPC_RIDDLE_PROMPT,
    FRIENDLY_NPC_ANSWER_BUTTON_TEXT,
    CLOSE_BUTTON_TEXT,
    BUTTON_CLICK_SOUND_URL,
    HOVER_SOUND_URL
} from '../constants';
import { SparklesIcon, CheckCircleIcon, XCircleIcon } from './icons';
import { useTheme } from '../contexts/ThemeContext'; // Corrected import path

interface FriendlyNPCModalProps {
  isOpen: boolean;
  npcData: FriendlyNPC;
  interactionContent: NPCInteraction;
  islandName: string;
  onClose: () => void;
  playSound: (soundUrl: string, volume?: number) => void;
  themeConfig: ThemeConfig;
  onSubmitRiddle: () => void;
  riddleAnswerInput: string;
  onRiddleAnswerChange: (value: string) => void;
  riddlePhase: 'question' | 'feedback';
  isRiddleCorrect: boolean | null;
}

const FriendlyNPCModal: React.FC<FriendlyNPCModalProps> = ({
  isOpen,
  npcData,
  interactionContent,
  islandName,
  onClose,
  playSound,
  themeConfig,
  onSubmitRiddle,
  riddleAnswerInput,
  onRiddleAnswerChange,
  riddlePhase,
  isRiddleCorrect
}) => {
  if (!isOpen) return null;

  const modalTitle = `${FRIENDLY_NPC_MODAL_TITLE_PREFIX} ${npcData.name}`;

  const renderInteraction = () => {
    switch (interactionContent.type) {
      case 'fact':
      case 'encouragement':
        return (
          <p className="text-md md:text-lg text-[var(--secondary-text)] leading-relaxed text-center italic">
            "{interactionContent.text}"
          </p>
        );
      case 'riddle':
        if (riddlePhase === 'question') {
          return (
            <div className="w-full">
              <p className="text-md md:text-lg font-medium mb-3 text-center">{FRIENDLY_NPC_RIDDLE_PROMPT}</p>
              <p className="text-md md:text-lg text-[var(--secondary-text)] mb-3 text-center italic">
                "{interactionContent.text}"
              </p>
              <input
                type="text"
                value={riddleAnswerInput}
                onChange={(e) => onRiddleAnswerChange(e.target.value)}
                placeholder="Nhập câu trả lời của bạn..."
                className="w-full p-2.5 sm:p-3 rounded-lg border-2 border-[var(--border-color)] bg-[var(--secondary-bg)] text-[var(--secondary-text)] focus:ring-2 focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] outline-none my-3"
              />
              <button
                onClick={onSubmitRiddle}
                disabled={!riddleAnswerInput.trim()}
                onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)}
                className="w-full bg-[var(--button-primary-bg)] hover:opacity-90 text-[var(--button-primary-text)] font-bold py-2.5 sm:py-3 px-4 rounded-lg shadow-md text-base sm:text-lg disabled:opacity-60"
              >
                {FRIENDLY_NPC_ANSWER_BUTTON_TEXT}
              </button>
            </div>
          );
        } else { // Feedback phase
          return (
            <div className="text-center animate-fadeIn">
              {isRiddleCorrect ? (
                <CheckCircleIcon className="w-12 h-12 mx-auto text-[var(--correct-bg)] mb-2" />
              ) : (
                <XCircleIcon className="w-12 h-12 mx-auto text-[var(--incorrect-bg)] mb-2" />
              )}
              <p className={`text-lg sm:text-xl font-semibold mb-1 ${isRiddleCorrect ? 'text-[var(--correct-text)]' : 'text-[var(--incorrect-text)]'}`}>
                {isRiddleCorrect
                    ? `Tuyệt vời! Bạn nhận được ${interactionContent.points} điểm!`
                    : `Tiếc quá! Chưa đúng rồi.`}
              </p>
              {!isRiddleCorrect && (
                <p className="text-sm sm:text-base text-[var(--secondary-text)]">
                  Đáp án đúng là: {interactionContent.answer}
                </p>
              )}
            </div>
          );
        }
      default:
        return null;
    }
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center p-4 z-[60] overflow-y-auto transition-opacity duration-300 bg-[var(--modal-bg-backdrop)] animate-fadeIn`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="npc-modal-title"
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
          <img
            src={npcData.imageUrl}
            alt={npcData.name}
            className="w-24 h-24 sm:w-32 sm:h-32 mx-auto rounded-full object-cover mb-3 border-4 border-[var(--accent-color)] shadow-lg"
          />
          <h2 id="npc-modal-title" className="text-xl md:text-2xl font-bold text-[var(--modal-header-text)]">
            {modalTitle}
          </h2>
          <p className="text-sm text-[var(--secondary-text)] opacity-80 mt-1">
            Ghé thăm tại: <span className="font-semibold">{islandName}</span>
          </p>
        </header>

        <div className={`my-4 p-4 rounded-lg bg-[var(--secondary-bg)] ${themeConfig.frostedGlassOpacity || 'bg-opacity-50'} min-h-[100px] flex items-center justify-center`}>
          {renderInteraction()}
        </div>

        {(interactionContent.type !== 'riddle' || riddlePhase === 'feedback') && (
            <button
            onClick={() => { playSound(BUTTON_CLICK_SOUND_URL); onClose(); }}
            className="mt-6 w-full bg-[var(--button-primary-bg)] hover:opacity-90 text-[var(--button-primary-text)] font-bold py-3 px-4 rounded-lg shadow-md transition-colors duration-200 text-lg"
            >
            {CLOSE_BUTTON_TEXT}
            </button>
        )}
      </div>
    </div>
  );
};

export default FriendlyNPCModal;