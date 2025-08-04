
import React, { useState, useMemo } from 'react';
import {
  Theme,
  ThemeConfig,
  ThemeAccessory,
  AccessoryType,
  PlayerOwnedAccessoriesState,
  PlayerActiveAccessoriesState,
} from '../types';
import {
  ACCESSORY_CUSTOMIZATION_MODAL_TITLE,
  CHOOSE_THEME_TO_CUSTOMIZE_TEXT,
  ACCESSORIES_FOR_THEME_TEXT,
  ACTIVATE_TEXT,
  DEACTIVATE_TEXT,
  NO_OWNED_COMPATIBLE_ACCESSORIES_TEXT,
  BUTTON_CLICK_SOUND_URL,
  HOVER_SOUND_URL,
  CLOSE_BUTTON_TEXT,
} from '../constants';
import { CogIcon, ChevronDownIcon } from './icons';
import { useTheme } from '../contexts/ThemeContext';

interface AccessoryCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  ownedAccessories: PlayerOwnedAccessoriesState;
  activeAccessories: PlayerActiveAccessoriesState;
  onUpdateActiveAccessories: (updatedActiveAccessories: PlayerActiveAccessoriesState) => void;
  allThemes: Record<Theme, ThemeConfig>; 
  allAccessoriesDetails: ThemeAccessory[]; 
  playSound: (soundUrl: string, volume?: number) => void;
}

const AccessoryCustomizationModal: React.FC<AccessoryCustomizationModalProps> = ({
  isOpen,
  onClose,
  ownedAccessories,
  activeAccessories,
  onUpdateActiveAccessories,
  allThemes,
  allAccessoriesDetails,
  playSound,
}) => {
  const { themeConfig: modalThemeConfig } = useTheme();
  const [selectedThemeKey, setSelectedThemeKey] = useState<Theme | null>(null);
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);

  const ownedCompatibleAccessoriesForSelectedTheme = useMemo(() => {
    if (!selectedThemeKey) return [];
    return allAccessoriesDetails.filter(
      (acc) =>
        ownedAccessories[acc.id] &&
        (acc.appliesToTheme === 'all' || acc.appliesToTheme.includes(selectedThemeKey))
    );
  }, [selectedThemeKey, ownedAccessories, allAccessoriesDetails]);

  const handleToggleAccessory = (accessoryToToggle: ThemeAccessory) => {
    if (!selectedThemeKey) return;
    playSound(BUTTON_CLICK_SOUND_URL, 0.4);

    // Create a deep copy to ensure modifications don't affect the original state directly
    // and trigger React's change detection properly.
    const newActiveAccessories = JSON.parse(JSON.stringify(activeAccessories)) as PlayerActiveAccessoriesState;

    if (!newActiveAccessories[selectedThemeKey]) {
      newActiveAccessories[selectedThemeKey] = {};
    }

    const currentThemeAccessories = newActiveAccessories[selectedThemeKey]!;
    const accessoryType = accessoryToToggle.type;

    if (currentThemeAccessories[accessoryType] === accessoryToToggle.id) {
      // Deactivate: set to null
      currentThemeAccessories[accessoryType] = null;
    } else {
      // Activate: set to the accessory's ID
      currentThemeAccessories[accessoryType] = accessoryToToggle.id;
    }
    onUpdateActiveAccessories(newActiveAccessories);
  };
  
  const themeOptions = Object.entries(allThemes)
     // Exclude 'default' theme from selectable options if other themes exist,
     // as 'default' usually acts as a fallback or has a specific purpose like Frutiger Aero.
     // If only 'default' exists (e.g. during initial setup or error), it should be selectable.
    .filter(([key]) => key !== Theme.DEFAULT || Object.keys(allThemes).length <= 1)
    .map(([key, config]) => ({ value: key as Theme, label: config.name }));


  const currentThemeLabel = selectedThemeKey ? allThemes[selectedThemeKey]?.name : CHOOSE_THEME_TO_CUSTOMIZE_TEXT;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-2 sm:p-4 z-[70] bg-[var(--modal-bg-backdrop)] animate-fadeIn overflow-y-auto"
      onClick={onClose} // Allow closing by clicking backdrop
      role="dialog"
      aria-modal="true"
      aria-labelledby="accessory-customization-modal-title"
    >
      <div
        className={`w-full max-w-xl h-[90vh] sm:h-[85vh] flex flex-col p-4 sm:p-6 rounded-xl shadow-2xl relative transform transition-all duration-300 scale-100 animate-slideUp text-[var(--primary-text)] border-2 border-[var(--border-color)] ${modalThemeConfig.frostedGlassOpacity || ''}`}
        style={{ background: modalThemeConfig.modalContentBg }}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal content
      >
        <button
          onClick={() => { playSound(BUTTON_CLICK_SOUND_URL, 0.5); onClose(); }}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-[var(--primary-text)] hover:opacity-70 active:opacity-50 transition-colors z-20"
          aria-label={CLOSE_BUTTON_TEXT}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-7 h-7 sm:w-8 sm:h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <header className="mb-4 sm:mb-5 text-center flex-shrink-0">
          <CogIcon className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-[var(--accent-color)] mb-1.5 sm:mb-2" />
          <h2 id="accessory-customization-modal-title" className="text-xl sm:text-2xl font-bold text-[var(--modal-header-text)]">
            {ACCESSORY_CUSTOMIZATION_MODAL_TITLE}
          </h2>
        </header>

        {/* Theme Selection Dropdown */}
        <div className="mb-4 sm:mb-5 relative z-10 flex-shrink-0">
          <button
            onClick={() => { playSound(BUTTON_CLICK_SOUND_URL, 0.3); setShowThemeDropdown(!showThemeDropdown); }}
            onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)}
            className="w-full flex justify-between items-center p-3 bg-[var(--button-secondary-bg)] text-[var(--button-secondary-text)] rounded-lg shadow-sm hover:opacity-95 active:brightness-95 font-semibold text-sm sm:text-base"
            aria-haspopup="listbox"
            aria-expanded={showThemeDropdown}
          >
            {currentThemeLabel}
            <ChevronDownIcon className={`w-5 h-5 transition-transform ${showThemeDropdown ? 'rotate-180' : ''}`} />
          </button>
          {showThemeDropdown && (
            <div className={`absolute top-full left-0 right-0 mt-1 bg-[var(--primary-bg)] border border-[var(--border-color)] rounded-lg shadow-xl max-h-48 sm:max-h-60 overflow-y-auto ${modalThemeConfig.frostedGlassOpacity || ''}`}>
              {themeOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => {
                    playSound(BUTTON_CLICK_SOUND_URL, 0.3);
                    setSelectedThemeKey(opt.value);
                    setShowThemeDropdown(false);
                  }}
                  onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)}
                  className={`w-full text-left p-3 hover:bg-[var(--secondary-bg)] hover:bg-opacity-70 text-sm sm:text-base transition-colors
                               ${selectedThemeKey === opt.value ? 'font-bold text-[var(--accent-color)]' : 'text-[var(--primary-text)]'}`}
                  role="option"
                  aria-selected={selectedThemeKey === opt.value}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Accessories List */}
        <div className="flex-grow overflow-y-auto pr-1 space-y-3 sm:space-y-4">
          {selectedThemeKey && (
            <>
              <h3 className="text-md sm:text-lg font-semibold text-[var(--primary-text)] sticky top-0 py-2 z-[5]"
                  style={{ background: modalThemeConfig.modalContentBg ? modalThemeConfig.modalContentBg.split(' ')[0] : 'var(--modal-content-bg)' }}
              >
                {ACCESSORIES_FOR_THEME_TEXT(allThemes[selectedThemeKey]?.name || selectedThemeKey)}
              </h3>
              {ownedCompatibleAccessoriesForSelectedTheme.length > 0 ? (
                ownedCompatibleAccessoriesForSelectedTheme.map((acc) => {
                  const isActive = activeAccessories[selectedThemeKey]?.[acc.type] === acc.id;
                  return (
                    <div
                      key={acc.id}
                      className={`p-3 rounded-lg border flex items-center justify-between gap-3
                                  ${isActive ? 'bg-[var(--correct-bg)] bg-opacity-20 border-[var(--correct-ring)]' : 'bg-[var(--secondary-bg)] bg-opacity-40 border-[var(--border-color)]'}
                                  ${modalThemeConfig.frostedGlassOpacity || ''}`}
                    >
                      <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
                        {acc.iconUrl ? (
                           <img src={acc.iconUrl} alt={acc.name} className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-md object-contain bg-white/10 p-0.5" />
                        ) : ( <CogIcon className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 text-[var(--accent-color)] opacity-70" /> )}
                        <div className="overflow-hidden">
                            <p className={`text-sm sm:text-md font-semibold truncate ${isActive ? 'text-[var(--correct-text)]' : 'text-[var(--primary-text)]'}`}>{acc.name}</p>
                            <p className="text-xs text-[var(--secondary-text)] opacity-80 truncate">{acc.type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleToggleAccessory(acc)}
                        onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.15)}
                        className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-md text-xs sm:text-sm font-semibold transition-colors flex-shrink-0
                                    ${isActive
                                      ? 'bg-[var(--incorrect-bg)] text-[var(--incorrect-text)] hover:opacity-90'
                                      : 'bg-[var(--correct-bg)] text-[var(--correct-text)] hover:opacity-90'
                                    }`}
                      >
                        {isActive ? DEACTIVATE_TEXT : ACTIVATE_TEXT}
                      </button>
                    </div>
                  );
                })
              ) : (
                <p className="text-center text-[var(--secondary-text)] opacity-70 py-6 sm:py-8 text-sm">
                  {NO_OWNED_COMPATIBLE_ACCESSORIES_TEXT}
                </p>
              )}
            </>
          )}
          {!selectedThemeKey && (
             <p className="text-center text-[var(--secondary-text)] opacity-70 py-10 text-sm">
                Vui lòng chọn một giao diện để xem các phụ kiện tương thích.
             </p>
          )}
        </div>

        <button
          onClick={() => { playSound(BUTTON_CLICK_SOUND_URL, 0.5); onClose(); }}
          onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)}
          className="mt-4 sm:mt-6 w-full bg-[var(--button-secondary-bg)] hover:opacity-90 active:brightness-95 text-[var(--button-secondary-text)] font-semibold py-3 px-4 rounded-lg shadow-md transition-colors duration-200 text-base sm:text-lg flex-shrink-0"
        >
          {CLOSE_BUTTON_TEXT}
        </button>
      </div>
    </div>
  );
};

export default AccessoryCustomizationModal;
