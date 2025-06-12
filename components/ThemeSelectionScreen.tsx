import React from 'react';
import { Theme } from '../types';
import { THEME_CONFIGS, ThemeConfig } from '../themes';
import { HOVER_SOUND_URL } from '../constants';

interface ThemeSelectionScreenProps {
  onThemeSelect: (theme: Theme) => void;
}

const ThemeSelectionScreen: React.FC<ThemeSelectionScreenProps> = ({ onThemeSelect }) => {
  const neonThemeConfig = THEME_CONFIGS[Theme.NEON];
  const girlyThemeConfig = THEME_CONFIGS[Theme.GIRLY];

  const handleSelect = (theme: Theme) => {
    onThemeSelect(theme);
  };
  
  const playHoverSound = () => {
    try {
        const audio = new Audio(HOVER_SOUND_URL);
        audio.volume = 0.2;
        audio.play().catch(e => console.warn("ThemeSelection hover sound play error:", e));
    } catch (error) {
        console.warn("ThemeSelection hover sound init error:", error);
    }
  };

  const FrutigerAeroPanel: React.FC<{
    theme: Theme;
    config: ThemeConfig; 
    onClick: () => void;
  }> = ({ theme, config, onClick }) => {
    
    // Text colors and shadows for theme names, using theme-specific fonts
    const titleColor = "text-white"; 
    const subtitleColor = "text-gray-200"; 
    const titleShadow = "shadow-[0_2px_4px_rgba(0,0,0,0.5)]";

    return (
      <div
        className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col items-center justify-center p-6 sm:p-8 cursor-pointer relative overflow-hidden group transition-all duration-300 ease-in-out rounded-2xl md:rounded-3xl transform group-hover:scale-102 active:scale-100" 
        style={{
          backgroundImage: `url('${config.backgroundUrl}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          // fontFamily is set on child elements to ensure it uses the specific theme's font
        }}
        onClick={onClick}
        onMouseEnter={playHoverSound}
        role="button"
        tabIndex={0}
        aria-label={`Chọn giao diện ${config.name}`}
      >
        {/* Glossy Overlay and Content Container */}
        <div className={`absolute inset-0 w-full h-full bg-gradient-to-br from-white/25 via-white/15 to-transparent backdrop-blur-sm group-hover:from-white/35 group-hover:via-white/20 transition-all duration-300 ease-in-out rounded-2xl md:rounded-3xl border-2 border-white/20 group-hover:border-white/40`}></div>
        
        <div className="relative z-10 flex flex-col items-center justify-center text-center">
           <h2 
              className={`text-4xl sm:text-5xl lg:text-6xl font-bold ${titleColor} ${titleShadow} transition-transform duration-300 group-hover:scale-105`}
              style={{ fontFamily: config.fontFamily }} // Apply specific theme font
          >
            {config.name}
          </h2>
          <p 
            className={`mt-3 sm:mt-4 text-md sm:text-lg ${subtitleColor} opacity-90 group-hover:opacity-100 transition-opacity duration-300`}
            style={{ fontFamily: config.fontFamily }} // Apply specific theme font
          > 
              Nhấn để chọn
          </p>
        </div>
         {/* Subtle corner highlight effect */}
        <div className="absolute -top-1 -left-1 w-20 h-20 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md group-hover:animate-pulse" style={{ animationDelay: '0.1s' }}></div>
        <div className="absolute -bottom-1 -right-1 w-24 h-24 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg group-hover:animate-pulse" style={{ animationDelay: '0.2s' }}></div>
      </div>
    );
  };

  return (
    // Outer container for ThemeSelectionScreen. Background is now handled by global theme.
    // Added padding and gap.
    <div className="flex flex-col md:flex-row w-screen h-screen items-stretch justify-center animate-fadeIn p-2 md:p-3 gap-2 md:gap-3"> 
      <FrutigerAeroPanel
        theme={Theme.NEON}
        config={neonThemeConfig}
        onClick={() => handleSelect(Theme.NEON)}
      />

      <FrutigerAeroPanel
        theme={Theme.GIRLY}
        config={girlyThemeConfig}
        onClick={() => handleSelect(Theme.GIRLY)}
      />
    </div>
  );
};

export default ThemeSelectionScreen;