
import React, { useEffect, useState } from 'react'; // Added useState for local gem count example
import GameScreen from './components/GameScreen';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { GAME_TITLE_TEXT, PLAYER_GEMS_KEY } from './constants';
import { GemIcon } from './components/icons'; 

// Helper to load gems, similar to GameScreen's loadItem
const loadPlayerGemsFromStorage = (): number => {
  try {
    const savedItem = localStorage.getItem(PLAYER_GEMS_KEY);
    return savedItem ? JSON.parse(savedItem) : 0;
  } catch (error) {
    return 0;
  }
};


const AppContent: React.FC = () => {
  const { themeConfig, theme } = useTheme();
  // Example: Local state for gems, ideally this would come from a global state/context updated by GameScreen
  const [playerGems, setPlayerGems] = useState<number>(() => loadPlayerGemsFromStorage());

  useEffect(() => {
    // ThemeProvider now handles body style and CSS variables
    // Listen for gem updates from GameScreen (e.g., via custom event or global state)
    const handleGemsUpdate = (event: CustomEvent<{ gems: number }>) => {
      setPlayerGems(event.detail.gems);
    };
    window.addEventListener('gemsUpdated', handleGemsUpdate as EventListener);
    
    // Initial sync in case GameScreen loads/updates gems before this component's listener is active
    // This is a simplified approach. A robust solution would use React Context or a state management library.
    setPlayerGems(loadPlayerGemsFromStorage());


    return () => {
      window.removeEventListener('gemsUpdated', handleGemsUpdate as EventListener);
    };
  }, [theme, themeConfig]);

  return (
    // #app-shell is now the main responsive container
    <div
      id="app-shell"
      className={`
        w-full min-h-screen flex flex-col items-stretch 
        text-[var(--primary-text)] 
        ${themeConfig.appContainerBg} 
        overflow-x-hidden
        lg:max-w-7xl lg:mx-auto lg:my-0 lg:shadow-2xl lg:rounded-none lg:border-x-2 lg:border-[var(--border-color)] 
      `}
      style={{ fontFamily: 'var(--font-family-theme)' }}
    >
      <header
        id="app-header"
        className="
          w-full h-14 sm:h-16 md:h-[70px] shrink-0 sticky top-0 z-40 
          flex items-center justify-between 
          px-3 sm:px-4 md:px-6 
          shadow-lg transition-colors duration-300
        "
        style={{
          backgroundColor: 'var(--secondary-bg)',
          borderBottom: '1px solid var(--border-color)',
        }}
      >
        <div className="text-lg sm:text-xl md:text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-[var(--title-text-gradient-from)] to-[var(--title-text-gradient-to)] truncate">
          {GAME_TITLE_TEXT}
        </div>
        <div id="header-actions" className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <div className="flex items-center gap-1 sm:gap-1.5 p-1.5 sm:p-2 rounded-lg bg-[var(--primary-bg)] shadow-inner border border-[var(--border-color)]">
            <GemIcon className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 animate-pulse" style={{filter: 'drop-shadow(0 0 3px gold)'}} />
            <span className="font-bold text-sm sm:text-base md:text-lg text-[var(--accent-color)]">
              {playerGems}
            </span>
          </div>
        </div>
      </header>

      <main
        id="app-main-content"
        className="
          flex-grow w-full flex flex-col items-center justify-start 
          py-2 sm:py-3 md:py-4 
          px-2 sm:px-3 md:px-4 
          overflow-y-auto 
        "
      >
        <div
          id="screen-container"
          className={`
            w-full h-full flex-grow flex flex-col 
            p-2 sm:p-3 md:p-4 
            ${themeConfig.primaryBg} 
            ${themeConfig.frostedGlassOpacity || ''}
            rounded-xl md:rounded-2xl shadow-lg
            overflow-hidden 
          `}
        >
          <GameScreen />
        </div>
      </main>
    </div>
  );
}

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
