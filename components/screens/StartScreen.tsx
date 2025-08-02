import React from 'react';
import { GAME_TITLE_TEXT, START_ADVENTURE_TEXT, HOVER_SOUND_URL } from '../../constants';

interface ScreenWithAudioProps {
  playSound: (soundUrl: string, volume?: number) => void;
}
interface StartScreenProps extends ScreenWithAudioProps {
  onStartAdventure: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStartAdventure, playSound }) => (
  <div className="w-full h-full flex flex-col items-center justify-center text-center animate-fadeInScale p-4">
    <div className="max-w-md sm:max-w-lg md:max-w-xl">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--title-text-gradient-from)] to-[var(--title-text-gradient-to)] mb-4 md:mb-6">
        {GAME_TITLE_TEXT}
      </h1>
      <p className="text-md sm:text-lg md:text-xl text-[var(--primary-text)] opacity-90 mb-6 md:mb-10">
        Chào mừng bạn đến với cuộc phiêu lưu toán học kỳ thú! Sẵn sàng khám phá những hòn đảo bí ẩn và giải các câu đố hóc búa chưa?
      </p>
      <button
        onClick={onStartAdventure}
        onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)}
        className="bg-gradient-to-r from-[var(--button-primary-bg)] to-[var(--accent-color)] hover:opacity-90 active:brightness-90 text-[var(--button-primary-text)] font-bold py-3 sm:py-4 px-8 sm:px-10 rounded-xl shadow-[var(--button-primary-shadow,theme(boxShadow.xl))] text-lg sm:text-xl md:text-2xl transition-all transform hover:scale-105 active:scale-95"
      >
        {START_ADVENTURE_TEXT}
      </button>
    </div>
  </div>
);
