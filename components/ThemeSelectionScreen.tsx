
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Theme } from '../types';
import { THEME_CONFIGS, ThemeConfig } from '../themes';
import { HOVER_SOUND_FILENAME, HOVER_SOUND_REMOTE_URL } from '../constants';

interface ThemeSelectionScreenProps {
  onThemeSelect: (theme: Theme) => void;
  playSound: (filename: string, remoteUrl: string, volume?: number) => void; // Added for click sound
}

interface ThemeOptionPanelProps {
  theme: Theme;
  config: ThemeConfig;
  onClick: () => void;
  // playSound prop is not needed here if hover sound is handled internally
}

const ThemeOptionPanel: React.FC<ThemeOptionPanelProps> = ({ theme, config, onClick }) => {
  const [currentBackgroundImageUrl, setCurrentBackgroundImageUrl] = useState(config.backgroundUrl);
  // Audio object ref for hover sound to manage its lifecycle if needed (e.g., stop on mouse out)
  const hoverAudioRef = useRef<HTMLAudioElement | null>(null);


  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)'); // Tailwind's md breakpoint

    const updateBackgroundImage = () => {
      let targetLocalPath: string | undefined;
      let targetRemotePath: string;

      if (mediaQuery.matches) { // Desktop / Side-by-side layout
        targetLocalPath = config.localBackgroundUrlSideBySideLayout;
        targetRemotePath = config.backgroundUrlSideBySideLayout || config.backgroundUrl;
      } else { // Mobile / Stacked layout
        targetLocalPath = config.localBackgroundUrlStackedLayout;
        targetRemotePath = config.backgroundUrlStackedLayout || config.backgroundUrl;
      }
      
      if (targetLocalPath) {
        const img = new Image();
        img.onload = () => {
          setCurrentBackgroundImageUrl(targetLocalPath!);
        };
        img.onerror = () => {
          setCurrentBackgroundImageUrl(targetRemotePath);
        };
        img.src = targetLocalPath;
      } else {
        setCurrentBackgroundImageUrl(targetRemotePath);
      }
    };

    updateBackgroundImage(); // Set initial image

    mediaQuery.addEventListener('change', updateBackgroundImage); // Update on resize
    return () => mediaQuery.removeEventListener('change', updateBackgroundImage);
  }, [config]);


  const playHoverSound = useCallback(() => {
    // Basic local/remote fallback for hover sound
    // This is a simplified version, not using GameScreen's cache for this specific UI interaction.
    const localPath = `/sounds/${HOVER_SOUND_FILENAME}`;
    let audio = new Audio(localPath);
    audio.volume = 0.2;

    audio.addEventListener('canplaythrough', () => {
        audio.play().catch(e => console.warn("Theme hover (local) sound play error:", e));
    }, { once: true });

    audio.addEventListener('error', () => {
        console.warn(`Local hover sound ${localPath} failed. Trying remote.`);
        audio = new Audio(HOVER_SOUND_REMOTE_URL);
        audio.volume = 0.2;
        audio.play().catch(e => console.warn("Theme hover (remote) sound play error:", e));
    }, { once: true });
    
    audio.load();
    hoverAudioRef.current = audio; // Store for potential future control (e.g., stop)
  }, []);

  const titleColor = "text-white"; 
  const titleShadow = "shadow-[0_2px_8px_rgba(0,0,0,0.7)]";

  return (
    <div
      className={`
        w-full h-1/2 
        md:w-9/20 md:max-w-lg md:h-[95vh]
        flex flex-col items-center justify-start pt-8 md:pt-16
        p-0 cursor-pointer relative overflow-hidden group 
        transition-all duration-300 ease-in-out 
        md:rounded-3xl
        transform hover:scale-101 active:scale-98 
      `}
      style={{
        backgroundImage: `url('${currentBackgroundImageUrl}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
      onClick={onClick}
      onMouseEnter={playHoverSound}
      role="button"
      tabIndex={0}
      aria-label={`Chọn giao diện ${config.name}`}
    >
      <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-black/60 via-black/40 to-black/20 group-hover:from-black/10 group-hover:via-black/5 group-hover:to-transparent backdrop-filter transition-all duration-300 ease-in-out"></div>
      
      <div className="relative z-10 flex flex-col items-center justify-center text-center p-2 max-w-[160px] sm:max-w-[200px] bg-black/40 backdrop-blur-lg rounded-xl shadow-xl border border-white/25">
        <h2 
          className={`text-base sm:text-lg font-bold ${titleColor} ${titleShadow} transition-transform duration-300 group-hover:scale-105`}
          style={{ fontFamily: config.fontFamily }}
        >
          {config.name}
        </h2>
      </div>

      <div className="absolute -top-2 -left-2 w-24 h-24 rounded-full bg-white/5 opacity-0 group-hover:opacity-60 transition-opacity duration-500 blur-xl group-hover:animate-pulse" style={{ animationDelay: '0.1s', animationDuration: '3s' }}></div>
      <div className="absolute -bottom-2 -right-2 w-32 h-32 rounded-full bg-white/3 opacity-0 group-hover:opacity-50 transition-opacity duration-500 blur-2xl group-hover:animate-pulse" style={{ animationDelay: '0.2s', animationDuration: '3s' }}></div>
    </div>
  );
};


const ThemeSelectionScreen: React.FC<ThemeSelectionScreenProps> = ({ onThemeSelect }) => {
  const neonThemeConfig = THEME_CONFIGS[Theme.NEON];
  const girlyThemeConfig = THEME_CONFIGS[Theme.GIRLY];

  const handleSelect = (theme: Theme) => {
    // The click sound for selecting a theme is handled by `handleThemeChange` in GameScreen,
    // which is called by the `onThemeSelect` prop. So, no separate playSound call needed here for the *click*.
    onThemeSelect(theme);
  };
  
  return (
    <div className="flex flex-col md:flex-row w-screen h-screen items-center justify-center md:gap-4 animate-fadeIn overflow-hidden"> 
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