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
    
    document.body.className = `theme-${theme}`; // Apply theme class for specific styles like scrollbar

    // Set all theme configuration properties as CSS variables on :root
    for (const key in config) {
      if (Object.prototype.hasOwnProperty.call(config, key)) {
        const value = (config as any)[key];
        if (typeof value === 'string' && !key.toLowerCase().includes('url')) { // Exclude URLs from becoming CSS vars
          // Convert camelCase to kebab-case for CSS custom property names
          // e.g., primaryBg -> --primary-bg, accentColor -> --accent-color
          const cssVarName = `--${key.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`)}`;
          document.documentElement.style.setProperty(cssVarName, value);
        }
      }
    }
     // Ensure --font-family-theme is specifically set for body from the config
    if (config.fontFamily) {
        document.documentElement.style.setProperty('--font-family-theme', config.fontFamily);
        document.body.style.fontFamily = `var(--font-family-theme, 'Arial', sans-serif)`;
    } else {
        document.documentElement.style.removeProperty('--font-family-theme');
        document.body.style.fontFamily = `'Arial', sans-serif`; // Fallback
    }


  }, []);

  useEffect(() => {
    applyThemeToDocument(currentTheme);
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    const handleMediaQueryChange = () => applyThemeToDocument(currentTheme);
    mediaQuery.addEventListener('change', handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
    };
  }, [currentTheme, applyThemeToDocument]);

  const setTheme = (themeToSet: Theme) => {
    if (THEME_CONFIGS[themeToSet]) {
      localStorage.setItem(SELECTED_THEME_KEY, JSON.stringify(themeToSet));
      setCurrentTheme(themeToSet);
    } else {
      console.warn(`Attempted to set invalid theme: ${themeToSet}`);
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