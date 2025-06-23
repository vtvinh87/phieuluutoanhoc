
import React, { useState, useMemo } from 'react';
import { Achievement, AchievedAchievementsState, GradeLevel, CollectibleItem, CollectedItemsState } from '../types';
import { ALL_ACHIEVEMENTS } from '../achievements';
import { useTheme } from '../contexts/ThemeContext';
import AchievementItem from './AchievementItem';
import {
  ACHIEVEMENTS_SCREEN_TITLE,
  NO_ACHIEVEMENTS_YET_TEXT,
  GRADE_LEVEL_TEXT_MAP,
  FILTER_ALL_ACHIEVEMENTS_TEXT,
  FILTER_GRADE_ACHIEVEMENTS_TEXT,
  FILTER_GLOBAL_ACHIEVEMENTS_TEXT,
  CLOSE_BUTTON_TEXT,
  BUTTON_CLICK_SOUND_URL,
  HOVER_SOUND_URL,
  COLLECTIBLES_TAB_TEXT,
  ACHIEVEMENTS_TAB_TEXT,
  NO_COLLECTIBLES_YET_TEXT,
  COLLECTIBLE_UNCOLLECTED_NAME,
  COLLECTIBLE_UNCOLLECTED_ICON,
} from '../constants';
import { CollectionIcon, ChevronDownIcon, TrophyIcon as AchievementIcon } from './icons'; // Renamed TrophyIcon

interface AchievementsScreenProps {
  achievedAchievements: AchievedAchievementsState;
  onClose: () => void;
  playSound: (soundUrl: string, volume?: number) => void;
  currentGradeContext: GradeLevel | null;
  collectedItems: CollectedItemsState;
  allCollectibles: CollectibleItem[];
}

type FilterType = 'all' | GradeLevel | 'global';
type ActiveTab = 'achievements' | 'collectibles';

const AchievementsScreen: React.FC<AchievementsScreenProps> = ({
  achievedAchievements,
  onClose,
  playSound,
  currentGradeContext,
  collectedItems,
  allCollectibles
}) => {
  const { themeConfig } = useTheme();
  const [activeFilter, setActiveFilter] = useState<FilterType>(currentGradeContext || 'all');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('achievements');

  const filteredAchievements = useMemo(() => {
    let achievementsToDisplay = [...ALL_ACHIEVEMENTS];

    if (activeFilter === 'global') {
      achievementsToDisplay = achievementsToDisplay.filter(ach => ach.isGlobal);
    } else if (activeFilter !== 'all') {
      achievementsToDisplay = achievementsToDisplay.filter(ach =>
        (ach.gradeSpecific && ach.id.includes(`_G${activeFilter}`)) || (ach.isGlobal && !ach.gradeSpecific)
      );
    }

    return achievementsToDisplay.sort((a, b) => {
      const achievedA = !!achievedAchievements[a.id];
      const achievedB = !!achievedAchievements[b.id];
      if (achievedA && !achievedB) return -1;
      if (!achievedA && achievedB) return 1;
      if (!achievedA && !achievedB) return a.name.localeCompare(b.name);
      if (achievedA && achievedB) {
         return (achievedAchievements[b.id]?.achievedAt || 0) - (achievedAchievements[a.id]?.achievedAt || 0);
      }
      return 0;
    });
  }, [activeFilter, achievedAchievements]);

  const totalAchievements = ALL_ACHIEVEMENTS.length;
  const achievedCount = Object.keys(achievedAchievements).length;
  const achievementProgressPercentage = totalAchievements > 0 ? (achievedCount / totalAchievements) * 100 : 0;

  const totalCollectibles = allCollectibles.length;
  const collectedCount = Object.keys(collectedItems).length;
  const collectionProgressPercentage = totalCollectibles > 0 ? (collectedCount / totalCollectibles) * 100 : 0;


  const filterOptions: {label: string; value: FilterType}[] = [
    { label: FILTER_ALL_ACHIEVEMENTS_TEXT, value: 'all'},
    ...(Object.values(GradeLevel).filter(g => typeof g === 'number' && g !== GradeLevel.FINAL) as GradeLevel[]).map(g => ({
        label: FILTER_GRADE_ACHIEVEMENTS_TEXT(g),
        value: g
    })),
    { label: FILTER_GLOBAL_ACHIEVEMENTS_TEXT, value: 'global'}
  ];

  const currentFilterLabel = filterOptions.find(opt => opt.value === activeFilter)?.label || FILTER_ALL_ACHIEVEMENTS_TEXT;

  const renderAchievementsTab = () => (
    <>
      <div className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-[var(--secondary-text)] opacity-90 px-2 mb-3 sm:mb-4">
        <p>Đã đạt: {achievedCount} / {totalAchievements} huy hiệu ({achievementProgressPercentage.toFixed(0)}%)</p>
        <div className="w-full bg-[var(--primary-bg)] bg-opacity-50 rounded-full h-2 sm:h-2.5 mt-1 shadow-inner overflow-hidden">
          <div
            className="bg-[var(--accent-color)] h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${achievementProgressPercentage}%` }}
          ></div>
        </div>
      </div>
      <div className="mb-3 sm:mb-4 relative z-10">
        <button
          onClick={() => { playSound(BUTTON_CLICK_SOUND_URL, 0.4); setShowFilterDropdown(!showFilterDropdown);}}
          onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)}
          className="w-full flex justify-between items-center p-2.5 sm:p-3 bg-[var(--button-secondary-bg)] text-[var(--button-secondary-text)] rounded-lg shadow-sm hover:opacity-95 active:brightness-95 font-semibold text-sm sm:text-base"
          aria-haspopup="listbox"
          aria-expanded={showFilterDropdown}
        >
          {currentFilterLabel}
          <ChevronDownIcon className={`w-5 h-5 transition-transform ${showFilterDropdown ? 'rotate-180' : ''}`} />
        </button>
        {showFilterDropdown && (
          <div className={`absolute top-full left-0 right-0 mt-1 bg-[var(--primary-bg)] border border-[var(--border-color)] rounded-lg shadow-xl max-h-48 sm:max-h-60 overflow-y-auto ${themeConfig.frostedGlassOpacity || ''}`}>
            {filterOptions.map(opt => (
              <button
                key={opt.value.toString()}
                onClick={() => {
                  playSound(BUTTON_CLICK_SOUND_URL, 0.4);
                  setActiveFilter(opt.value);
                  setShowFilterDropdown(false);
                }}
                onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)}
                className={`w-full text-left p-2.5 sm:p-3 hover:bg-[var(--secondary-bg)] hover:bg-opacity-70 text-sm sm:text-base transition-colors
                             ${activeFilter === opt.value ? 'font-bold text-[var(--accent-color)]' : 'text-[var(--primary-text)]'}`}
                role="option"
                aria-selected={activeFilter === opt.value}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="flex-grow overflow-y-auto space-y-2.5 sm:space-y-3 pr-0.5 sm:pr-1">
        {filteredAchievements.length > 0 ? (
          filteredAchievements.map(ach => (
            <AchievementItem
              key={ach.id}
              achievement={ach}
              achievedData={achievedAchievements[ach.id]}
              currentGradeForFiltering={typeof activeFilter === 'number' ? activeFilter : undefined}
            />
          ))
        ) : (
          <p className="text-center text-[var(--secondary-text)] opacity-80 py-10 text-sm sm:text-base">{NO_ACHIEVEMENTS_YET_TEXT}</p>
        )}
      </div>
    </>
  );

  const renderCollectiblesTab = () => (
    <>
        <div className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-[var(--secondary-text)] opacity-90 px-2 mb-3 sm:mb-4">
            <p>Đã thu thập: {collectedCount} / {totalCollectibles} vật phẩm ({collectionProgressPercentage.toFixed(0)}%)</p>
            <div className="w-full bg-[var(--primary-bg)] bg-opacity-50 rounded-full h-2 sm:h-2.5 mt-1 shadow-inner overflow-hidden">
            <div
                className="bg-[var(--accent-color)] h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${collectionProgressPercentage}%` }}
            ></div>
            </div>
        </div>
        <div className="flex-grow overflow-y-auto space-y-2 pr-0.5 sm:pr-1">
            {allCollectibles.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-3">
                {allCollectibles.map(item => {
                const isCollected = collectedItems[item.id];
                return (
                    <div
                    key={item.id}
                    className={`
                        p-2 sm:p-3 rounded-lg border-2 flex flex-col items-center justify-center aspect-square
                        transition-all duration-300 transform hover:scale-105
                        ${isCollected ? 'bg-[var(--secondary-bg)] border-[var(--accent-color)] shadow-md' : `bg-[var(--secondary-bg)] opacity-60 border-[var(--border-color)]`}
                        ${themeConfig.frostedGlassOpacity || ''}
                    `}
                    title={isCollected ? `${item.name}: ${item.description}` : COLLECTIBLE_UNCOLLECTED_NAME}
                    >
                    <span className={`text-3xl sm:text-4xl ${isCollected ? '' : 'grayscale opacity-70'}`}>{isCollected ? item.icon : COLLECTIBLE_UNCOLLECTED_ICON}</span>
                    <p className={`mt-1 text-xs sm:text-sm text-center font-semibold ${isCollected ? 'text-[var(--accent-color)]' : 'text-[var(--secondary-text)]'}`}>
                        {isCollected ? item.name : COLLECTIBLE_UNCOLLECTED_NAME}
                    </p>
                    </div>
                );
                })}
            </div>
            ) : (
            <p className="text-center text-[var(--secondary-text)] opacity-80 py-10 text-sm sm:text-base">{NO_COLLECTIBLES_YET_TEXT}</p>
            )}
        </div>
    </>
  );


  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-2 sm:p-4 z-50 bg-[var(--modal-bg-backdrop)] animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="achievements-modal-title"
    >
      <div
        className={`w-full max-w-2xl h-[90vh] sm:h-[85vh] flex flex-col p-3 py-4 sm:p-5 sm:py-6 rounded-xl shadow-2xl relative transform transition-all duration-300 scale-100 animate-slideUp text-[var(--primary-text)] border-2 border-[var(--border-color)] ${themeConfig.frostedGlassOpacity || ''}`}
        style={{ background: themeConfig.modalContentBg }}
        onClick={(e) => e.stopPropagation()}
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

        <header className="mb-3 sm:mb-4 text-center">
          {activeTab === 'achievements' ?
            <AchievementIcon className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-[var(--accent-color)] mb-1 sm:mb-2" /> :
            <CollectionIcon className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-[var(--accent-color)] mb-1 sm:mb-2" />
          }
          <h2 id="achievements-modal-title" className="text-xl sm:text-2xl font-bold text-[var(--modal-header-text)]">
            {activeTab === 'achievements' ? ACHIEVEMENTS_SCREEN_TITLE : COLLECTIBLES_TAB_TEXT}
          </h2>
        </header>

        {/* Tabs */}
        <div className="flex border-b-2 border-[var(--border-color)] mb-3 sm:mb-4">
            <button
                onClick={() => {playSound(BUTTON_CLICK_SOUND_URL, 0.3); setActiveTab('achievements');}}
                className={`flex-1 py-2 sm:py-2.5 text-sm sm:text-base font-semibold transition-colors
                            ${activeTab === 'achievements' ? 'border-b-4 border-[var(--accent-color)] text-[var(--accent-color)]' : 'text-[var(--secondary-text)] hover:text-[var(--primary-text)] opacity-70 hover:opacity-100'}`}
            >
                {ACHIEVEMENTS_TAB_TEXT}
            </button>
            <button
                onClick={() => {playSound(BUTTON_CLICK_SOUND_URL, 0.3); setActiveTab('collectibles');}}
                className={`flex-1 py-2 sm:py-2.5 text-sm sm:text-base font-semibold transition-colors
                            ${activeTab === 'collectibles' ? 'border-b-4 border-[var(--accent-color)] text-[var(--accent-color)]' : 'text-[var(--secondary-text)] hover:text-[var(--primary-text)] opacity-70 hover:opacity-100'}`}
            >
                {COLLECTIBLES_TAB_TEXT}
            </button>
        </div>

        {activeTab === 'achievements' && renderAchievementsTab()}
        {activeTab === 'collectibles' && renderCollectiblesTab()}

        <button
          onClick={() => { playSound(BUTTON_CLICK_SOUND_URL, 0.5); onClose(); }}
          className="mt-3 sm:mt-4 w-full bg-[var(--button-primary-bg)] hover:opacity-95 active:brightness-95 text-[var(--button-primary-text)] font-bold py-2.5 sm:py-3 px-4 rounded-lg shadow-md text-base sm:text-lg"
        >
          {CLOSE_BUTTON_TEXT}
        </button>
      </div>
    </div>
  );
};

export default AchievementsScreen;
