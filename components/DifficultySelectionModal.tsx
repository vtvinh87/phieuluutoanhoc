
import React from 'react';
import { IslandDifficulty } from '../types';
import { ISLAND_DIFFICULTY_TEXT_MAP, CHOOSE_ISLAND_DIFFICULTY_TEXT, BUTTON_CLICK_SOUND_URL, HOVER_SOUND_URL } from '../constants';
import { useTheme } from '../contexts/ThemeContext';

interface DifficultySelectionModalProps {
  isOpen: boolean;
  islandName: string;
  onClose: () => void;
  onSelectDifficulty: (difficulty: IslandDifficulty) => void;
}

const DifficultySelectionModal: React.FC<DifficultySelectionModalProps> = ({
  isOpen,
  islandName,
  onClose,
  onSelectDifficulty,
}) => {
  const { themeConfig } = useTheme();
  if (!isOpen) return null;

  const playSoundLocal = (soundUrl: string, volume: number = 0.5) => {
    try {
        const audio = new Audio(soundUrl);
        audio.volume = volume;
        audio.play().catch(e => console.warn("Sound play error in modal:", e));
    } catch (error) {
        console.warn("Sound init error in modal:", error);
    }
  };

  const handleDifficultyClick = (difficulty: IslandDifficulty) => {
    playSoundLocal(BUTTON_CLICK_SOUND_URL, 0.6);
    onSelectDifficulty(difficulty);
  };

  const getDifficultyButtonColors = (difficulty: IslandDifficulty) => {
    switch (difficulty) {
      case IslandDifficulty.EASY:
        return 'bg-[var(--correct-bg)] hover:opacity-90 text-[var(--correct-text)] ring-[var(--correct-ring)]';
      case IslandDifficulty.MEDIUM:
        return 'bg-[var(--button-primary-bg)] hover:opacity-90 text-[var(--button-primary-text)] ring-[var(--ring-color-focus)]'; // Using primary button as medium
      case IslandDifficulty.HARD:
        return 'bg-[var(--incorrect-bg)] hover:opacity-90 text-[var(--incorrect-text)] ring-[var(--incorrect-ring)]';
      default:
        return 'bg-[var(--button-secondary-bg)] hover:opacity-90 text-[var(--button-secondary-text)] ring-[var(--border-color)]';
    }
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center p-4 z-50 transition-opacity duration-300 animate-fadeIn bg-[var(--modal-bg-backdrop)]`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="difficulty-modal-title"
    >
      <div
        className={`p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-2xl relative transform transition-all duration-300 scale-100 animate-slideUp
                   text-[var(--primary-text)]`} // Changed max-w-lg to max-w-2xl
        style={{ background: themeConfig.modalContentBg }} // Allow gradient
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => { playSoundLocal(BUTTON_CLICK_SOUND_URL); onClose(); }}
          className="absolute top-4 right-4 text-[var(--primary-text)] hover:opacity-70 active:opacity-50 transition-colors" // Adjusted position
          aria-label="Đóng lựa chọn độ khó"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2
          id="difficulty-modal-title"
          className="text-xl md:text-2xl font-bold text-[var(--modal-header-text)] mb-4 text-center leading-snug break-words" // Added break-words for safety
        >
          {CHOOSE_ISLAND_DIFFICULTY_TEXT(islandName)}
        </h2>
        <p className={`text-center text-[var(--primary-text)] opacity-80 mb-8 text-base md:text-md`}>
            Đảo: <span className="font-semibold break-words">{islandName}</span>
        </p>

        <div className="space-y-4">
          {(Object.values(IslandDifficulty) as IslandDifficulty[]).map((difficulty) => (
            <button
              key={difficulty}
              onClick={() => handleDifficultyClick(difficulty)}
              onMouseEnter={() => playSoundLocal(HOVER_SOUND_URL, 0.2)}
              className={`w-full p-4 rounded-lg shadow-md transition-all duration-200 ease-in-out
                          text-lg md:text-xl font-semibold focus:outline-none focus:ring-4 transform hover:scale-105 active:scale-95 active:brightness-90
                          ${getDifficultyButtonColors(difficulty)}
                        `}
            >
              {ISLAND_DIFFICULTY_TEXT_MAP[difficulty]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DifficultySelectionModal;
