
import React from 'react';
import { Theme } from '../types';
import { THEME_CONFIGS } from '../themes';
import { HOVER_SOUND_URL } from '../constants';

interface ThemeSelectionScreenProps {
  onThemeSelect: (theme: Theme) => void;
}

const ThemeSelectionScreen: React.FC<ThemeSelectionScreenProps> = ({ onThemeSelect }) => {
  const neonThemeConfig = THEME_CONFIGS[Theme.NEON];
  const girlyThemeConfig = THEME_CONFIGS[Theme.GIRLY];

  const handleSelect = (theme: Theme) => {
    // Sound for click is handled by GameScreen's handleThemeChange, triggered by onThemeSelect
    onThemeSelect(theme);
  };
  
  const playHoverSound = () => {
    try {
        // Ensure audioUnlocked in GameScreen is true before playing, or handle independently
        // For simplicity, this component can have its own sound logic if GameScreen's isn't ready.
        const audio = new Audio(HOVER_SOUND_URL);
        audio.volume = 0.2;
        audio.play().catch(e => console.warn("ThemeSelection hover sound play error:", e));
    } catch (error) {
        console.warn("ThemeSelection hover sound init error:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-screen h-screen items-stretch justify-center animate-fadeIn">
      {/* Neon Theme Option */}
      <div
        className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col items-center justify-center p-8 cursor-pointer relative overflow-hidden group transition-all duration-300 ease-in-out"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('${neonThemeConfig.backgroundUrl}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        onClick={() => handleSelect(Theme.NEON)}
        onMouseEnter={playHoverSound}
        role="button"
        tabIndex={0}
        aria-label={`Chọn giao diện ${neonThemeConfig.name}`}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-20 transition-all duration-300 ease-in-out"></div>
        <h2 
            className="text-4xl md:text-6xl font-bold text-center z-10 transition-transform duration-300 group-hover:scale-110"
            style={{ 
                fontFamily: neonThemeConfig.fontFamily, 
                color: neonThemeConfig.titleTextGradientFrom,
                textShadow: `0 0 8px ${neonThemeConfig.accent}, 0 0 16px ${neonThemeConfig.accent}, 0 0 24px ${neonThemeConfig.accent}, 0 0 5px #fff, 0 0 10px #fff, 0 0 15px #fff`
            }}
        >
          {neonThemeConfig.name}
        </h2>
        <p className="mt-4 text-lg md:text-xl text-center z-10 opacity-90 group-hover:opacity-100 transition-opacity" style={{ fontFamily: neonThemeConfig.fontFamily, color: neonThemeConfig.primaryText }}>
            Nhấn để chọn
        </p>
      </div>

      {/* Divider for larger screens */}
      <div className="hidden md:block w-1 h-full bg-slate-500 opacity-50"></div>
      {/* Divider for smaller screens (horizontal) */}
      <div className="block md:hidden w-full h-1 bg-slate-500 opacity-50"></div>

      {/* Girly Theme Option */}
      <div
        className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col items-center justify-center p-8 cursor-pointer relative overflow-hidden group transition-all duration-300 ease-in-out"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1), rgba(255,255,255,0.1)), url('${girlyThemeConfig.backgroundUrl}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        onClick={() => handleSelect(Theme.GIRLY)}
        onMouseEnter={playHoverSound}
        role="button"
        tabIndex={0}
        aria-label={`Chọn giao diện ${girlyThemeConfig.name}`}
      >
        <div className="absolute inset-0 bg-pink-500 bg-opacity-10 group-hover:bg-opacity-0 transition-all duration-300 ease-in-out"></div>
        <h2 
            className="text-4xl md:text-6xl font-bold text-center z-10 transition-transform duration-300 group-hover:scale-110"
            style={{ 
                fontFamily: girlyThemeConfig.fontFamily, 
                color: girlyThemeConfig.titleTextGradientTo,
                textShadow: `2px 2px 3px rgba(0,0,0,0.2), 0 0 5px ${girlyThemeConfig.accentText}`
             }}
        >
          {girlyThemeConfig.name}
        </h2>
         <p className="mt-4 text-lg md:text-xl text-center z-10 opacity-90 group-hover:opacity-100 transition-opacity" style={{ fontFamily: girlyThemeConfig.fontFamily, color: girlyThemeConfig.primaryText }}>
            Nhấn để chọn
        </p>
      </div>
    </div>
  );
};

export default ThemeSelectionScreen;
