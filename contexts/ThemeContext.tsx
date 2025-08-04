import React, { createContext, useState, useEffect, useCallback, ReactNode, useContext } from 'react';
import { Theme, PlayerActiveAccessoriesState, AccessoryType, UIAccentConfig, ThemeAccessory, ThemeConfig } from '../types';
import { THEME_CONFIGS } from '../themes';
import { DEFAULT_THEME, SELECTED_THEME_KEY, PLAYER_ACTIVE_ACCESSORIES_KEY, SHOP_ACCESSORIES } from '../constants';

interface ThemeContextType {
  theme: Theme;
  themeConfig: ThemeConfig;
  setTheme: (theme: Theme) => void;
  playerActiveAccessories: PlayerActiveAccessoriesState; // Expose for potential direct use by other components
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const loadPlayerActiveAccessoriesFromStorage = (): PlayerActiveAccessoriesState => {
  try {
    const savedItem = localStorage.getItem(PLAYER_ACTIVE_ACCESSORIES_KEY);
    return savedItem ? JSON.parse(savedItem) : {};
  } catch (error) {
    console.warn(`Error parsing ${PLAYER_ACTIVE_ACCESSORIES_KEY} from localStorage:`, error);
    return {};
  }
};

// Store previously applied accessory CSS variables to clear them when an accessory is deactivated or theme changes
let lastAppliedAccessoryCssVariables: Record<string, string> = {};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    const savedItem = localStorage.getItem(SELECTED_THEME_KEY);
    if (savedItem) {
        try {
            const parsedTheme = JSON.parse(savedItem);
            if (typeof parsedTheme === 'string' && THEME_CONFIGS[parsedTheme as Theme]) {
                return parsedTheme as Theme;
            }
        } catch (e) {
            if (THEME_CONFIGS[savedItem as Theme]) {
                localStorage.setItem(SELECTED_THEME_KEY, JSON.stringify(savedItem as Theme));
                return savedItem as Theme;
            }
        }
    }
    localStorage.removeItem(SELECTED_THEME_KEY); 
    return DEFAULT_THEME;
  });

  const [activeAccessories, setActiveAccessories] = useState<PlayerActiveAccessoriesState>(loadPlayerActiveAccessoriesFromStorage);

  useEffect(() => {
    const handleActiveAccessoriesUpdate = () => {
      setActiveAccessories(loadPlayerActiveAccessoriesFromStorage());
    };
    window.addEventListener('activeAccessoriesUpdated', handleActiveAccessoriesUpdate);
    // Also listen to storage events for cross-tab synchronization if needed
    window.addEventListener('storage', (event) => {
      if (event.key === PLAYER_ACTIVE_ACCESSORIES_KEY) {
        handleActiveAccessoriesUpdate();
      }
    });
    return () => {
      window.removeEventListener('activeAccessoriesUpdated', handleActiveAccessoriesUpdate);
      window.removeEventListener('storage', (event) => {
        if (event.key === PLAYER_ACTIVE_ACCESSORIES_KEY) {
          handleActiveAccessoriesUpdate();
        }
      });
    };
  }, []);


  const applyThemeToDocument = useCallback((theme: Theme, currentActiveAccessories: PlayerActiveAccessoriesState) => {
    const config = THEME_CONFIGS[theme];
    if (!config) return;

    const mediaQuery = window.matchMedia('(min-width: 768px)');
    let targetLocalPath: string | undefined;
    let targetRemotePath: string;

    if (mediaQuery.matches) {
      targetLocalPath = config.localBackgroundUrlSideBySideLayout;
      targetRemotePath = config.backgroundUrlSideBySideLayout || config.backgroundUrl;
    } else {
      targetLocalPath = config.localBackgroundUrlStackedLayout;
      targetRemotePath = config.backgroundUrlStackedLayout || config.backgroundUrl;
    }

    const setBodyBackground = (url: string) => {
      document.body.style.backgroundImage = `url('${url}')`;
    };

    if (targetLocalPath) {
      const img = new Image();
      img.onload = () => setBodyBackground(targetLocalPath!);
      img.onerror = () => setBodyBackground(targetRemotePath);
      img.src = targetLocalPath;
    } else {
      setBodyBackground(targetRemotePath);
    }
    
    document.body.className = `theme-${theme}`;

    // Clear previously applied accessory CSS variables
    Object.keys(lastAppliedAccessoryCssVariables).forEach(cssVarName => {
      document.documentElement.style.removeProperty(cssVarName);
    });
    lastAppliedAccessoryCssVariables = {};

    // Set all base theme configuration properties as CSS variables
    for (const key in config) {
      if (Object.prototype.hasOwnProperty.call(config, key)) {
        const value = (config as any)[key];
        if (typeof value === 'string' && !key.toLowerCase().includes('url')) {
          const cssVarName = `--${key.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`)}`;
          document.documentElement.style.setProperty(cssVarName, value);
        }
      }
    }
    
    // Apply UI_ACCENT accessory CSS variables
    const themeActiveAccessories = currentActiveAccessories[theme];
    const activeUIAccentId = themeActiveAccessories?.[AccessoryType.UI_ACCENT];
    
    if (activeUIAccentId) {
      const accessoryDetails = SHOP_ACCESSORIES.find(acc => acc.id === activeUIAccentId && acc.type === AccessoryType.UI_ACCENT) as ThemeAccessory | undefined;
      if (accessoryDetails && accessoryDetails.config) {
        const uiAccentConfig = accessoryDetails.config as UIAccentConfig;
        if (uiAccentConfig.cssVariables) {
          for (const cssVarName in uiAccentConfig.cssVariables) {
            if (Object.prototype.hasOwnProperty.call(uiAccentConfig.cssVariables, cssVarName)) {
              const value = uiAccentConfig.cssVariables[cssVarName];
              document.documentElement.style.setProperty(cssVarName, value);
              lastAppliedAccessoryCssVariables[cssVarName] = value; // Store for cleanup
            }
          }
        }
      }
    }

    if (config.fontFamily) {
        document.documentElement.style.setProperty('--font-family-theme', config.fontFamily);
        document.body.style.fontFamily = `var(--font-family-theme, 'Arial', sans-serif)`;
    } else {
        document.documentElement.style.removeProperty('--font-family-theme');
        document.body.style.fontFamily = `'Arial', sans-serif`;
    }
  }, []);

  useEffect(() => {
    applyThemeToDocument(currentTheme, activeAccessories);
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    const handleMediaQueryChange = () => applyThemeToDocument(currentTheme, activeAccessories);
    mediaQuery.addEventListener('change', handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
    };
  }, [currentTheme, activeAccessories, applyThemeToDocument]);

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
    <ThemeContext.Provider value={{ theme: currentTheme, themeConfig, setTheme, playerActiveAccessories: activeAccessories }}>
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
