
import React, { useState, useEffect } from 'react';
import { Theme } from '../types';
import { THEME_CONFIGS, ThemeConfig } from '../themes';
import { HOVER_SOUND_URL } from '../constants';

interface ThemeSelectionScreenProps {
  onThemeSelect: (theme: Theme) => void;
}

interface ThemeOptionPanelProps {
  theme: Theme;
  config: ThemeConfig;
  onClick: () => void;
  isSelected?: boolean; 
}

const ThemeOptionPanel: React.FC<ThemeOptionPanelProps> = ({ theme, config, onClick }) => {
  const [currentBackgroundImageUrl, setCurrentBackgroundImageUrl] = useState(config.backgroundUrl);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    const updateBackgroundImage = () => {
      let targetLocalPath: string | undefined;
      let targetRemotePath: string;

      if (mediaQuery.matches) {
        targetLocalPath = config.localBackgroundUrlSideBySideLayout;
        targetRemotePath = config.backgroundUrlSideBySideLayout || config.backgroundUrl;
      } else {
        targetLocalPath = config.localBackgroundUrlStackedLayout;
        targetRemotePath = config.backgroundUrlStackedLayout || config.backgroundUrl;
      }
      
      if (targetLocalPath) {
        const img = new Image();
        img.onload = () => setCurrentBackgroundImageUrl(targetLocalPath!);
        img.onerror = () => setCurrentBackgroundImageUrl(targetRemotePath);
        img.src = targetLocalPath;
      } else {
        setCurrentBackgroundImageUrl(targetRemotePath);
      }
    };
    updateBackgroundImage();
    mediaQuery.addEventListener('change', updateBackgroundImage);
    return () => mediaQuery.removeEventListener('change', updateBackgroundImage);
  }, [config]);

  const playHoverSound = () => {
    try {
      const audio = new Audio(HOVER_SOUND_URL);
      audio.volume = 0.15;
      audio.play().catch(e => console.warn("Theme hover sound play error:", e));
    } catch (error) { console.warn("Theme hover sound init error:", error); }
  };

  const isNeon = theme === Theme.NEON;
  const isGirly = theme === Theme.GIRLY;

  const panelWrapperBaseStyles = `
    w-full h-1/2 md:w-1/2 md:h-full 
    cursor-pointer relative overflow-hidden group 
    transition-all duration-500 ease-in-out 
    flex items-center justify-center 
    shadow-2xl hover:shadow-3xl 
    border-4 border-transparent hover:border-white/50
  `;
  const panelRoundedStyles = "rounded-none md:rounded-[36px]";

  // Added a fallback dark background (e.g., bg-slate-800) to the panel wrapper.
  // This helps if the image layer is transparent or fails to load.
  const panelFallbackBackground = "bg-slate-800"; 

  const innerCardBaseStyles = `
    relative z-20 flex flex-col items-center justify-center text-center 
    p-6 sm:p-8 
    transition-all duration-300 ease-out group-hover:scale-105
    rounded-2xl shadow-xl 
  `;

  let panelSpecificStyles = "";
  let innerCardSpecificStyles = "";
  let titleSpecificStyles = "text-2xl sm:text-3xl md:text-4xl font-bold transition-all duration-300 group-hover:tracking-wider";
  let taglineSpecificStyles = "text-sm sm:text-md opacity-80 mt-2";

  if (isNeon) {
    panelSpecificStyles = `border-cyan-400/30 hover:border-cyan-300/70`;
    innerCardSpecificStyles = `bg-black/70 backdrop-blur-xl border-2 border-cyan-500/70 shadow-cyan-500/40`;
    titleSpecificStyles += ` text-cyan-300 filter drop-shadow(0_0_10px_var(--tw-shadow-color)) shadow-cyan-400`;
    taglineSpecificStyles += ` text-purple-300`;
  } else if (isGirly) {
    panelSpecificStyles = `border-pink-300/30 hover:border-pink-200/70`;
    innerCardSpecificStyles = `bg-white/60 backdrop-blur-xl border-2 border-pink-300/70 shadow-pink-500/30`;
    titleSpecificStyles += ` text-pink-600`;
    taglineSpecificStyles += ` text-purple-500`;
  }

  return (
    <div
      className={`${panelWrapperBaseStyles} ${panelRoundedStyles} ${panelSpecificStyles} ${panelFallbackBackground}`}
      onClick={onClick}
      onMouseEnter={playHoverSound}
      role="button"
      tabIndex={0}
      aria-label={`Chọn giao diện ${config.name}`}
    >
      {/* 1. Dedicated Background Image Div */}
      <div
        className="absolute inset-0 w-full h-full -z-10 transition-transform duration-500 ease-in-out group-hover:scale-110"
        style={{
          backgroundImage: `url('${currentBackgroundImageUrl}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* 2. General Darkening Overlay */}
      <div className="absolute inset-0 w-full h-full bg-black/20 group-hover:bg-black/10 transition-opacity duration-300 z-0"></div>
      
      {/* 3. Decorative elements */}
      {isNeon && (
        <>
          <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-purple-600/20 via-transparent to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-500 blur-2xl z-10"></div>
          <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-cyan-500/15 via-transparent to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-500 blur-xl z-10"></div>
        </>
      )}
      {isGirly && (
         <>
          <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-pink-300/10 rounded-full filter blur-3xl opacity-0 group-hover:opacity-70 animate-pulse group-hover:animate-none transition-opacity duration-1000 z-10"></div>
          <div className="absolute -bottom-1/4 -right-1/4 w-3/5 h-3/5 bg-purple-300/05 rounded-full filter blur-3xl opacity-0 group-hover:opacity-70 animate-pulse group-hover:animate-none transition-opacity duration-1000 z-10" style={{animationDelay: '0.5s'}}></div>
        </>
      )}

      {/* 4. Inner Content Card (Title, Tagline) */}
      <div className={`${innerCardBaseStyles} ${innerCardSpecificStyles}`}>
        <h2 
          className={titleSpecificStyles}
          style={{ fontFamily: config.fontFamily }}
        >
          {config.name}
        </h2>
        {isNeon && <p className={taglineSpecificStyles}>Năng Lượng & Bí Ẩn</p>}
        {isGirly && <p className={taglineSpecificStyles}>Ngọt Ngào & Mộng Mơ</p>}
      </div>
    </div>
  );
};

const ThemeSelectionScreen: React.FC<ThemeSelectionScreenProps> = ({ onThemeSelect }) => {
  const neonThemeConfig = THEME_CONFIGS[Theme.NEON];
  const girlyThemeConfig = THEME_CONFIGS[Theme.GIRLY];

  const handleSelect = (theme: Theme) => {
    onThemeSelect(theme);
  };
  
  return (
    <div className="flex flex-col md:flex-row w-full h-full items-stretch justify-center md:gap-0 animate-fadeIn overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 p-0"> 
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
    </div>
  );
};

export default ThemeSelectionScreen;
