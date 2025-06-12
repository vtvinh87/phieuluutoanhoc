
import React from 'react';
import GameScreen from './components/GameScreen';
import { ThemeProvider, useTheme } from './contexts/ThemeContext'; // Ensure useTheme is exported if needed here, or just ThemeProvider

const AppContent: React.FC = () => {
  const { themeConfig } = useTheme(); // Get themeConfig to apply app container styles

  return (
    <div className={`min-h-screen w-full flex flex-col items-center justify-center p-4 ${themeConfig.appContainerBg}`}>
      <GameScreen />
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