
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
    const savedItem = localStorage.getItem(SELECTED_THEME_KEY);
    if (savedItem) {
        try {
            // Attempt to parse as JSON. If it's already a valid JSON string (e.g., "\"girly\""), this will work.
            const parsedTheme = JSON.parse(savedItem);
            if (typeof parsedTheme === 'string' && THEME_CONFIGS[parsedTheme as Theme]) {
                return parsedTheme as Theme;
            }
        } catch (e) {
            // If JSON.parse fails, assume it's a raw string like "girly" (old format)
            if (THEME_CONFIGS[savedItem as Theme]) {
                // To migrate, save it back in the correct JSON format for the next load
                localStorage.setItem(SELECTED_THEME_KEY, JSON.stringify(savedItem as Theme));
                return savedItem as Theme;
            }
        }
    }
    // If nothing valid is found, or item doesn't exist, or it's corrupted beyond recognition
    // It's safer to remove potentially bad value and start fresh with default
    localStorage.removeItem(SELECTED_THEME_KEY); 
    return DEFAULT_THEME;
  });

  const applyThemeToDocument = useCallback((theme: Theme) => {
    const config = THEME_CONFIGS[theme];
    if (!config) return;

    // Determine responsive background URL
    const mediaQuery = window.matchMedia('(min-width: 768px)'); // Tailwind's md breakpoint
    let targetLocalPath: string | undefined;
    let targetRemotePath: string;

    if (mediaQuery.matches) { // Desktop / Side-by-side layout
      targetLocalPath = config.localBackgroundUrlSideBySideLayout;
      targetRemotePath = config.backgroundUrlSideBySideLayout || config.backgroundUrl;
    } else { // Mobile / Stacked layout
      targetLocalPath = config.localBackgroundUrlStackedLayout;
      targetRemotePath = config.backgroundUrlStackedLayout || config.backgroundUrl;
    }

    const setBodyBackground = (url: string) => {
      document.body.style.backgroundImage = `url('${url}')`;
    };

    if (targetLocalPath) {
      const img = new Image();
      img.onload = () => {
        setBodyBackground(targetLocalPath!);
      };
      img.onerror = () => {
        setBodyBackground(targetRemotePath);
      };
      img.src = targetLocalPath;
    } else {
      setBodyBackground(targetRemotePath);
    }

    // Update font family
    if (config.fontFamily) {
      document.documentElement.style.setProperty('--font-family-theme', config.fontFamily);
      document.body.style.fontFamily = 'var(--font-family-theme)';
    } else {
      document.documentElement.style.removeProperty('--font-family-theme');
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
    document.documentElement.style.setProperty('--spinner-border-color', config.spinnerColor);

    document.body.className = `theme-${theme}`;

  }, []);

  useEffect(() => {
    applyThemeToDocument(currentTheme);
    // Add listener for media query changes to re-apply background if layout preference changes
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    const handleMediaQueryChange = () => applyThemeToDocument(currentTheme);
    mediaQuery.addEventListener('change', handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
    };
  }, [currentTheme, applyThemeToDocument]);

  const setTheme = (theme: Theme) => {
    if (THEME_CONFIGS[theme]) {
      localStorage.setItem(SELECTED_THEME_KEY, JSON.stringify(theme)); // Use JSON.stringify
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
