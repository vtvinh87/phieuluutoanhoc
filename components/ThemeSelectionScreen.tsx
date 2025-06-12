import React from 'react';
import { Theme } from '../types';
import { THEME_CONFIGS, ThemeConfig } from '../themes';
import { HOVER_SOUND_URL } from '../constants';

interface ThemeSelectionScreenProps {
  onThemeSelect: (theme: Theme) => void;
}

// Renamed and redesigned for broader theme application
const ThemeOptionPanel: React.FC<{
  theme: Theme; // The specific theme this panel represents
  config: ThemeConfig; // The configuration for this theme
  onClick: () => void;
}> = ({ theme, config, onClick }) => {
  const playHoverSound = () => {
    try {
      const audio = new Audio(HOVER_SOUND_URL);
      audio.volume = 0.2;
      audio.play().catch(e => console.warn("Theme hover sound play error:", e));
    } catch (error) {
      console.warn("Theme hover sound init error:", error);
    }
  };

  // Text colors and shadows for theme names
  const titleColor = "text-white"; 
  const subtitleColor = "text-gray-200"; 
  const titleShadow = "shadow-[0_2px_8px_rgba(0,0,0,0.7)]"; // Enhanced shadow for better readability

  return (
    <div
      className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col items-center justify-center p-0 cursor-pointer relative overflow-hidden group transition-all duration-300 ease-in-out rounded-2xl md:rounded-3xl transform hover:scale-101 active:scale-98"
      style={{
        backgroundImage: `url('${config.backgroundUrl}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      onClick={onClick}
      onMouseEnter={playHoverSound}
      role="button"
      tabIndex={0}
      aria-label={`Chọn giao diện ${config.name}`}
    >
      {/* Glossy Overlay for a more polished look - adjusted for subtlety */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-black/10 via-black/5 to-transparent backdrop-filter group-hover:from-black/15 group-hover:via-black/10 transition-all duration-300 ease-in-out"></div>
      
      {/* Container for Text - with new styling */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center p-4 sm:p-6 bg-black/30 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20">
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

      {/* Subtle corner highlight effect for added visual flair */}
      <div className="absolute -top-2 -left-2 w-24 h-24 rounded-full bg-white/5 opacity-0 group-hover:opacity-60 transition-opacity duration-500 blur-xl group-hover:animate-pulse" style={{ animationDelay: '0.1s', animationDuration: '3s' }}></div>
      <div className="absolute -bottom-2 -right-2 w-32 h-32 rounded-full bg-white/3 opacity-0 group-hover:opacity-50 transition-opacity duration-500 blur-2xl group-hover:animate-pulse" style={{ animationDelay: '0.2s', animationDuration: '3s' }}></div>
    </div>
  );
};


const ThemeSelectionScreen: React.FC<ThemeSelectionScreenProps> = ({ onThemeSelect }) => {
  const neonThemeConfig = THEME_CONFIGS[Theme.NEON];
  const girlyThemeConfig = THEME_CONFIGS[Theme.GIRLY];
  // const frutigerAeroConfig = THEME_CONFIGS[Theme.FRUTIGER_AERO]; // If you plan to add it as a third option

  const handleSelect = (theme: Theme) => {
    onThemeSelect(theme);
  };
  
  return (
    <div className="flex flex-col md:flex-row w-screen h-screen items-stretch justify-center animate-fadeIn p-2 md:p-3 gap-2 md:gap-3"> 
      <ThemeOptionPanel
        theme={Theme.NEON}
        config={neonThemeConfig}
        onClick={() => handleSelect(Theme.NEON)}
      />

      <ThemeOptionPanel
        theme={Theme.GIRLY}
        config={girlyThemeConfig}
        onClick={() => handleSelect(Theme.GIRLY)}
      />
      
      {/* 
      // Example if you wanted to add Frutiger Aero as a selectable option:
      <ThemeOptionPanel
        theme={Theme.FRUTIGER_AERO}
        config={frutigerAeroConfig}
        onClick={() => handleSelect(Theme.FRUTIGER_AERO)}
      /> 
      */}
    </div>
  );
};

export default ThemeSelectionScreen;