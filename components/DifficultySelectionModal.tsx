
import React from 'react';
import { IslandDifficulty, GradeLevel } from '../types';
import { ISLAND_DIFFICULTY_TEXT_MAP, CHOOSE_ISLAND_DIFFICULTY_TEXT, BUTTON_CLICK_SOUND_URL, HOVER_SOUND_URL } from '../constants';

interface DifficultySelectionModalProps {
  isOpen: boolean;
  islandName: string;
  onClose: () => void;
  onSelectDifficulty: (difficulty: IslandDifficulty) => void;
  // playSound might be passed if GameScreen manages all sounds, or handled internally
}

const DifficultySelectionModal: React.FC<DifficultySelectionModalProps> = ({
  isOpen,
  islandName,
  onClose,
  onSelectDifficulty,
}) => {
  if (!isOpen) return null;

  // Simplified playSound for this component, assuming audio context is unlocked globally
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

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity duration-300 animate-fadeIn"
      onClick={onClose} // Allow closing by clicking outside
      role="dialog"
      aria-modal="true"
      aria-labelledby="difficulty-modal-title"
    >
      <div
        className="bg-gradient-to-br from-sky-600 via-blue-700 to-indigo-800 p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-md text-white relative transform transition-all duration-300 scale-100 animate-slideUp"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal content
      >
        <button
          onClick={() => { playSoundLocal(BUTTON_CLICK_SOUND_URL); onClose(); }}
          className="absolute top-3 right-3 text-gray-300 hover:text-white transition-colors"
          aria-label="Đóng lựa chọn độ khó"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 id="difficulty-modal-title" className="text-2xl md:text-3xl font-bold text-yellow-300 mb-3 text-center">
          {CHOOSE_ISLAND_DIFFICULTY_TEXT(islandName)}
        </h2>
        <p className="text-center text-yellow-100 mb-6 text-lg">Đảo: <span className="font-semibold">{islandName}</span></p>

        <div className="space-y-4">
          {(Object.values(IslandDifficulty) as IslandDifficulty[]).map((difficulty) => (
            <button
              key={difficulty}
              onClick={() => handleDifficultyClick(difficulty)}
              onMouseEnter={() => playSoundLocal(HOVER_SOUND_URL, 0.2)}
              className={`w-full p-4 rounded-lg shadow-md transition-all duration-200 ease-in-out
                          text-xl font-semibold focus:outline-none focus:ring-4 transform hover:scale-105 active:scale-95
                          ${difficulty === IslandDifficulty.EASY ? 'bg-green-500 hover:bg-green-600 text-white ring-green-300' : ''}
                          ${difficulty === IslandDifficulty.MEDIUM ? 'bg-yellow-500 hover:bg-yellow-600 text-gray-800 ring-yellow-300' : ''}
                          ${difficulty === IslandDifficulty.HARD ? 'bg-red-500 hover:bg-red-600 text-white ring-red-300' : ''}
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
