import React, { useEffect, useState, useMemo } from 'react';
import GameScreen from './components/GameScreen';
import ParentDashboard from './components/ParentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { UserProvider, useUser } from './contexts/UserContext';
import { GAME_TITLE_TEXT, PLAYER_GEMS_KEY, BUTTON_CLICK_SOUND_URL, HOVER_SOUND_URL } from './constants';
import { GemIcon, UserCircleIcon } from './components/icons';
import { UserView } from './types';
import RoleSelectionScreen from './components/screens/RoleSelectionScreen';

const loadPlayerGemsFromStorage = (): number => {
  try {
    const savedItem = localStorage.getItem(PLAYER_GEMS_KEY);
    return savedItem ? JSON.parse(savedItem) : 10000; 
  } catch (error) {
    console.warn(`Error parsing ${PLAYER_GEMS_KEY} from localStorage, defaulting to 10000:`, error);
    return 10000;
  }
};

const AppContent: React.FC = () => {
  const { themeConfig, theme } = useTheme();
  const { view, setView } = useUser();
  const [playerGems, setPlayerGems] = useState<number>(() => loadPlayerGemsFromStorage());
  const [isRoleSelected, setIsRoleSelected] = useState(false);

  useEffect(() => {
    const handleGemsUpdate = (event: CustomEvent<{ gems: number }>) => {
      setPlayerGems(event.detail.gems);
    };
    window.addEventListener('gemsUpdated', handleGemsUpdate as EventListener);
    
    setPlayerGems(loadPlayerGemsFromStorage());

    return () => {
      window.removeEventListener('gemsUpdated', handleGemsUpdate as EventListener);
    };
  }, [theme, themeConfig]);
  
  const handleRoleSelect = (role: UserView) => {
    setView(role);
    setIsRoleSelected(true);
  };
  
  const playSoundSimple = (soundUrl: string, volume = 0.5) => {
    try {
      const audio = new Audio(soundUrl);
      audio.volume = volume;
      audio.play().catch(() => {});
    } catch (e) {}
  };

  const handleReturnToRoleSelection = () => {
    playSoundSimple(BUTTON_CLICK_SOUND_URL);
    setView(UserView.STUDENT); // Reset to default view for next selection
    setIsRoleSelected(false);
  };


  const renderMainContent = () => {
    switch(view) {
      case UserView.STUDENT:
        return <GameScreen />;
      case UserView.PARENT:
        return <ParentDashboard />;
      case UserView.TEACHER:
        return <TeacherDashboard />;
      default:
        return <GameScreen />; // Fallback to student view
    }
  }

  return (
    <div
      id="app-shell-wrapper"
      className="w-full min-h-screen relative 
                 lg:max-w-7xl lg:mx-auto lg:my-0 lg:shadow-2xl lg:border-x-2 lg:border-[var(--border-color)]"
    >
      <div
        className={`absolute inset-0 w-full h-full ${themeConfig.appContainerVisuals}`}
      />

      <div
        id="app-shell"
        className="w-full min-h-screen flex flex-col items-stretch text-[var(--primary-text)] relative z-10 overflow-x-hidden"
        style={{ fontFamily: 'var(--font-family-theme)' }}
      >
        {!isRoleSelected ? (
           <RoleSelectionScreen onSelectRole={handleRoleSelect} />
        ) : (
          <>
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
                {view !== UserView.STUDENT && (
                  <button
                    onClick={handleReturnToRoleSelection}
                    onMouseEnter={() => playSoundSimple(HOVER_SOUND_URL, 0.2)}
                    className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-lg bg-[var(--button-secondary-bg)] text-[var(--button-secondary-text)] shadow-md hover:opacity-90 transition-opacity"
                    aria-label="Đổi vai trò"
                  >
                    <UserCircleIcon className="w-5 h-5 sm:w-6 sm:h-6"/>
                    <span className="hidden sm:inline text-sm sm:text-base font-semibold">Đổi vai trò</span>
                  </button>
                )}
                {view === UserView.STUDENT && (
                  <div className="flex items-center gap-1 sm:gap-1.5 p-1.5 sm:p-2 rounded-lg bg-[var(--primary-bg)] shadow-inner border border-[var(--border-color)]">
                    <GemIcon className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400 animate-pulse" style={{filter: 'drop-shadow(0 0 3px gold)'}} />
                    <span className="font-bold text-sm sm:text-base md:text-lg text-[var(--accent-color)]">
                      {playerGems}
                    </span>
                  </div>
                )}
              </div>
            </header>

            <main
              id="app-main-content"
              className={`
                flex-grow w-full flex flex-col items-center justify-start 
                ${themeConfig.appContainerLayout}
                overflow-y-auto 
              `}
            >
              {renderMainContent()}
            </main>
          </>
        )}
      </div>
    </div>
  );
}

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </ThemeProvider>
  );
};

export default App;
