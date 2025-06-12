
import React, { createContext, useState, useEffect, useCallback, ReactNode, useContext } from 'react';
import { Theme } from '../types';
import { THEME_CONFIGS, ThemeConfig } from '../themes';
import { DEFAULT_THEME, SELECTED_THEME_KEY } from '../constants';

interface ThemeContextType {
  theme: Theme;
  themeConfig: ThemeConfig;
  setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem(SELECTED_THEME_KEY) as Theme | null;
    return savedTheme && THEME_CONFIGS[savedTheme] ? savedTheme : DEFAULT_THEME;
  });

  const applyThemeToDocument = useCallback((theme: Theme) => {
    const config = THEME_CONFIGS[theme];
    if (!config) return;

    // Update body background image
    document.body.style.backgroundImage = `url('${config.backgroundUrl}')`;
    
    // Update font family
    if (config.fontFamily) {
      document.documentElement.style.setProperty('--font-family-theme', config.fontFamily);
      document.body.style.fontFamily = 'var(--font-family-theme)';
    } else {
      document.documentElement.style.removeProperty('--font-family-theme');
      // Set a fallback default font for the body if no theme font is specified
      document.body.style.fontFamily = "'Arial', sans-serif"; 
    }

    // Set CSS Variables on :root
    document.documentElement.style.setProperty('--primary-bg', config.primaryBg);
    document.documentElement.style.setProperty('--primary-text', config.primaryText);
    document.documentElement.style.setProperty('--secondary-bg', config.secondaryBg);
    document.documentElement.style.setProperty('--secondary-text', config.secondaryText);
    document.documentElement.style.setProperty('--accent-color', config.accent);
    document.documentElement.style.setProperty('--accent-text', config.accentText);
    
    document.documentElement.style.setProperty('--button-primary-bg', config.buttonPrimaryBg);
    document.documentElement.style.setProperty('--button-primary-text', config.buttonPrimaryText);
    document.documentElement.style.setProperty('--button-secondary-bg', config.buttonSecondaryBg);
    document.documentElement.style.setProperty('--button-secondary-text', config.buttonSecondaryText);
    document.documentElement.style.setProperty('--button-answer-option-bg', config.buttonAnswerOptionBg);
    document.documentElement.style.setProperty('--button-answer-option-text', config.buttonAnswerOptionText);
    document.documentElement.style.setProperty('--button-answer-option-ring', config.buttonAnswerOptionRing);
    document.documentElement.style.setProperty('--button-answer-option-selected-bg', config.buttonAnswerOptionSelectedBg);
    document.documentElement.style.setProperty('--button-answer-option-selected-text', config.buttonAnswerOptionSelectedText);
    document.documentElement.style.setProperty('--button-answer-option-selected-ring', config.buttonAnswerOptionSelectedRing);

    document.documentElement.style.setProperty('--correct-bg', config.correctBg);
    document.documentElement.style.setProperty('--correct-text', config.correctText);
    document.documentElement.style.setProperty('--correct-ring', config.correctRing);
    document.documentElement.style.setProperty('--incorrect-bg', config.incorrectBg);
    document.documentElement.style.setProperty('--incorrect-text', config.incorrectText);
    document.documentElement.style.setProperty('--incorrect-ring', config.incorrectRing);

    document.documentElement.style.setProperty('--modal-bg-backdrop', config.modalBgBackdrop);
    document.documentElement.style.setProperty('--modal-content-bg', config.modalContentBg);
    document.documentElement.style.setProperty('--modal-header-text', config.modalHeaderText);
    
    document.documentElement.style.setProperty('--border-color', config.borderColor);
    document.documentElement.style.setProperty('--ring-color-focus', config.ringColorFocus);

    document.documentElement.style.setProperty('--title-text-gradient-from', config.titleTextGradientFrom);
    document.documentElement.style.setProperty('--title-text-gradient-to', config.titleTextGradientTo);

    document.documentElement.style.setProperty('--island-locked-bg', config.islandButtonLockedBg);
    document.documentElement.style.setProperty('--island-unlocked-bg', config.islandButtonUnlockedBg);
    document.documentElement.style.setProperty('--island-completed-bg', config.islandButtonCompletedBg);
    document.documentElement.style.setProperty('--island-locked-text', config.islandButtonLockedText);
    document.documentElement.style.setProperty('--island-unlocked-text', config.islandButtonUnlockedText);
    document.documentElement.style.setProperty('--island-completed-text', config.islandButtonCompletedText);
    document.documentElement.style.setProperty('--island-button-ring-color', config.islandButtonRingColor);
    
    document.documentElement.style.setProperty('--question-display-bg', config.questionDisplayBg);
    document.documentElement.style.setProperty('--question-display-text', config.questionDisplayText);
    document.documentElement.style.setProperty('--question-display-image-border', config.questionDisplayImageBorder);
    document.documentElement.style.setProperty('--spinner-border-color', config.spinnerColor); // Updated to use direct color
    
    // Add a class to body for theme-specific global styles if needed (less critical with CSS vars on :root)
    document.body.className = `theme-${theme}`;

  }, []);

  useEffect(() => {
    applyThemeToDocument(currentTheme);
  }, [currentTheme, applyThemeToDocument]);

  const setTheme = (theme: Theme) => {
    if (THEME_CONFIGS[theme]) {
      localStorage.setItem(SELECTED_THEME_KEY, theme);
      setCurrentTheme(theme);
    } else {
      console.warn(`Attempted to set invalid theme: ${theme}`);
    }
  };
  
  const themeConfig = THEME_CONFIGS[currentTheme];

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, themeConfig, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};