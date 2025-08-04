import React from 'react';
import { UserView } from '../../types';
import { 
    GAME_TITLE_TEXT, 
    START_ADVENTURE_TEXT, 
    ROLE_SELECTION_SUBTITLE_TEXT,
    PARENT_ROLE_BUTTON_TEXT,
    TEACHER_ROLE_BUTTON_TEXT,
    HOVER_SOUND_URL,
    BUTTON_CLICK_SOUND_URL
} from '../../constants';
import { UsersIcon, BriefcaseIcon, UserCircleIcon } from '../icons';
import { useTheme } from '../../contexts/ThemeContext';

interface RoleSelectionScreenProps {
  onSelectRole: (role: UserView) => void;
}

const RoleSelectionScreen: React.FC<RoleSelectionScreenProps> = ({ onSelectRole }) => {
  const { themeConfig } = useTheme();

  const playSound = (soundUrl: string, volume: number = 0.5) => {
    try {
      const audio = new Audio(soundUrl);
      audio.volume = volume;
      audio.play().catch(() => {});
    } catch (error) {}
  };

  const handleSelect = (role: UserView) => {
    playSound(BUTTON_CLICK_SOUND_URL, 0.6);
    onSelectRole(role);
  };

  return (
    <div className="w-full h-full flex flex-grow flex-col items-center justify-center text-center animate-fadeInScale p-4">
      <div className={`max-w-md sm:max-w-lg md:max-w-xl p-6 sm:p-8 rounded-2xl shadow-2xl border ${themeConfig.frostedGlassOpacity || ''} border-[var(--border-color)] bg-[var(--secondary-bg)]`}>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--title-text-gradient-from)] to-[var(--title-text-gradient-to)] mb-4 md:mb-6">
          {GAME_TITLE_TEXT}
        </h1>
        
        {/* Student/Player primary button */}
        <button
          onClick={() => handleSelect(UserView.STUDENT)}
          onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)}
          className="w-full bg-gradient-to-r from-[var(--button-primary-bg)] to-[var(--accent-color)] hover:opacity-90 active:brightness-90 text-[var(--button-primary-text)] font-bold py-3 sm:py-4 px-8 sm:px-10 rounded-xl shadow-[var(--button-primary-shadow,theme(boxShadow.xl))] text-lg sm:text-xl md:text-2xl transition-all transform hover:scale-105 active:scale-95 mb-6"
        >
          {START_ADVENTURE_TEXT}
        </button>

        <p className="text-md text-[var(--primary-text)] opacity-80 mb-4">
            {ROLE_SELECTION_SUBTITLE_TEXT}
        </p>

        {/* Parent and Teacher secondary buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            onClick={() => handleSelect(UserView.PARENT)}
            onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[var(--button-secondary-bg)] text-[var(--button-secondary-text)] font-semibold shadow-md transition-transform transform hover:scale-105 active:scale-95"
          >
            <UsersIcon className="w-5 h-5" />
            <span>{PARENT_ROLE_BUTTON_TEXT}</span>
          </button>
          <button
            onClick={() => handleSelect(UserView.TEACHER)}
            onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-[var(--button-secondary-bg)] text-[var(--button-secondary-text)] font-semibold shadow-md transition-transform transform hover:scale-105 active:scale-95"
          >
            <BriefcaseIcon className="w-5 h-5" />
            <span>{TEACHER_ROLE_BUTTON_TEXT}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionScreen;
