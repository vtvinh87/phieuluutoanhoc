import React from 'react';
import { GradeLevel, Theme, ActiveDailyChallengeState, ActiveWeeklyChallengeState } from '../../types';
import {
    GRADE_LEVEL_TEXT_MAP, CHOOSE_GRADE_TEXT, HOVER_SOUND_URL, ACHIEVEMENT_BUTTON_ICON_URL, VIEW_ACHIEVEMENTS_BUTTON_TEXT,
    FINAL_ISLAND_ACCESS_BUTTON_TEXT, DAILY_CHALLENGE_BUTTON_TEXT, PLAYER_GEMS_TEXT, MANAGE_ACCESSORIES_BUTTON_TEXT,
} from '../../constants';
import { THEME_CONFIGS } from '../../themes';
import { SunIcon, MoonIcon, CheckIcon, KeyIcon, CalendarCheckIcon, GemIcon, ShoppingBagIcon, CogIcon } from '../icons';

interface ScreenWithAudioProps {
  playSound: (soundUrl: string, volume?: number) => void;
}
interface GradeSelectionScreenProps extends ScreenWithAudioProps {
    onGradeSelect: (grade: GradeLevel) => void;
    onThemeChange: (theme: Theme) => void;
    onToggleAchievementsScreen: () => void;
    onToggleDailyChallengeModal: () => void;
    onAccessFinalIsland: () => void;
    onGoToShop: () => void;
    onToggleAccessoryCustomizationModal: () => void;
    theme: Theme;
    isFinalIslandUnlocked: boolean;
    playerGems: number;
    activeDailyChallenge: ActiveDailyChallengeState;
    activeWeeklyChallenge: ActiveWeeklyChallengeState;
}

export const GradeSelectionScreen: React.FC<GradeSelectionScreenProps> = ({ onGradeSelect, onThemeChange, onToggleAchievementsScreen, onToggleDailyChallengeModal, onAccessFinalIsland, onGoToShop, onToggleAccessoryCustomizationModal, playSound, theme, isFinalIslandUnlocked, playerGems, activeDailyChallenge, activeWeeklyChallenge }) => (
    <div className="w-full h-full flex flex-col items-center justify-start animate-fadeInScale p-3 sm:p-4 md:p-6">
        <div className="w-full max-w-lg md:max-w-xl mx-auto">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--title-text-gradient-from)] to-[var(--title-text-gradient-to)] text-center flex-grow">
                    {CHOOSE_GRADE_TEXT}
                </h1>
                <div className="flex items-center gap-2 sm:gap-3">
                    <button onClick={onGoToShop} onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)} className="p-2 sm:p-2.5 rounded-full bg-[var(--button-secondary-bg)] hover:opacity-90 active:brightness-90 shadow-md relative focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[var(--accent-color)]" aria-label="Cửa Hàng Phụ Kiện">
                        <ShoppingBagIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--accent-color)]" />
                    </button>
                    <button onClick={onToggleAccessoryCustomizationModal} onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)} className="p-2 sm:p-2.5 rounded-full bg-[var(--button-secondary-bg)] hover:opacity-90 active:brightness-90 shadow-md relative focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[var(--accent-color)]" aria-label={MANAGE_ACCESSORIES_BUTTON_TEXT}>
                        <CogIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--accent-color)]" />
                    </button>
                    <button onClick={onToggleDailyChallengeModal} onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)} className="p-2 sm:p-2.5 rounded-full bg-[var(--button-secondary-bg)] hover:opacity-90 active:brightness-90 shadow-md relative focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[var(--accent-color)]" aria-label={DAILY_CHALLENGE_BUTTON_TEXT}>
                        <CalendarCheckIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--accent-color)]" />
                        {((activeDailyChallenge && !activeDailyChallenge.isCompleted) || (activeWeeklyChallenge && !activeWeeklyChallenge.isCompleted)) && (
                            <span className="absolute top-0 right-0 block h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-red-500 ring-1 sm:ring-2 ring-white" />
                        )}
                        {((activeDailyChallenge && activeDailyChallenge.isCompleted && !activeDailyChallenge.rewardClaimed) || (activeWeeklyChallenge && activeWeeklyChallenge.isCompleted && !activeWeeklyChallenge.rewardClaimed)) && (
                            <span className="absolute top-0 right-0 block h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-green-500 ring-1 sm:ring-2 ring-white animate-pulse" />
                        )}
                    </button>
                    <button onClick={onToggleAchievementsScreen} onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)} className="hover:opacity-90 active:brightness-90 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[var(--accent-color)] rounded-full p-0.5" aria-label={VIEW_ACHIEVEMENTS_BUTTON_TEXT}>
                        <img src={ACHIEVEMENT_BUTTON_ICON_URL} alt="Huy hiệu" className="w-10 h-10 sm:w-12 sm:h-12 animate-trophy-glow" />
                    </button>
                </div>
            </div>
            <div className="flex justify-center items-center mb-3 sm:mb-4 text-base sm:text-lg font-semibold text-[var(--primary-text)]">
                <GemIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-1.5 sm:mr-2 text-yellow-400" /> {PLAYER_GEMS_TEXT}: {playerGems}
            </div>
            <div className="grid grid-cols-1 gap-3 sm:gap-4 mb-6 sm:mb-8">
                {(Object.keys(GradeLevel).filter(key => !isNaN(Number(GradeLevel[key as keyof typeof GradeLevel])) && GradeLevel[key as keyof typeof GradeLevel] !== GradeLevel.FINAL) as (keyof typeof GradeLevel)[]).map((gradeKey) => {
                    const gradeValue = GradeLevel[gradeKey];
                    return (
                        <button key={gradeValue} onClick={() => onGradeSelect(gradeValue as GradeLevel)} onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)} className="p-3 sm:p-4 rounded-lg shadow-[var(--button-primary-shadow,theme(boxShadow.lg))] transition-transform transform hover:scale-105 active:scale-95 active:brightness-90 bg-[var(--button-primary-bg)] hover:opacity-90 text-[var(--button-primary-text)] font-bold text-xl sm:text-2xl">
                            {GRADE_LEVEL_TEXT_MAP[gradeValue as GradeLevel]}
                        </button>
                    );
                })}
                {isFinalIslandUnlocked && (
                    <button onClick={onAccessFinalIsland} onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)} className="mt-3 sm:mt-4 p-3 sm:p-4 rounded-lg shadow-[var(--button-primary-shadow,theme(boxShadow.lg))] transition-transform transform hover:scale-105 active:scale-95 active:brightness-90 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-white font-bold text-xl sm:text-2xl flex items-center justify-center gap-2 animate-pulse-glow" style={{ ['--island-button-ring-color' as any]: 'gold' }}>
                        <KeyIcon className="w-7 h-7 sm:w-8 sm:h-8" /> {FINAL_ISLAND_ACCESS_BUTTON_TEXT}
                    </button>
                )}
            </div>
            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t-2 border-[var(--border-color)]">
                <h2 className="text-xl sm:text-2xl font-bold text-[var(--primary-text)] mb-3 sm:mb-4 text-center">Chọn Giao Diện</h2>
                <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3">
                    {(Object.values(Theme).filter(t => t !== Theme.DEFAULT) as Theme[]).map(themeItem => (
                        <button key={themeItem} onClick={() => onThemeChange(themeItem)} onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)} className={`p-2.5 sm:p-3 rounded-lg shadow-md transition-all transform hover:scale-105 active:scale-95 active:brightness-90 text-sm sm:text-lg font-semibold w-full flex items-center justify-center gap-1.5 sm:gap-2 border-2 ${theme === themeItem ? 'border-[var(--accent-color)] ring-2 sm:ring-4 ring-[var(--ring-color-focus)]' : 'border-transparent'} ${themeItem === Theme.NEON ? 'bg-[#0d1117] text-[#30c5ff]' : 'bg-[#fdf2f8] text-[#c026d3]'}`}>
                            {themeItem === Theme.NEON ? <MoonIcon className="w-4 h-4 sm:w-5 sm:h-5"/> : <SunIcon className="w-4 h-4 sm:w-5 sm:h-5"/>} {THEME_CONFIGS[themeItem].name} {theme === themeItem && <CheckIcon className="w-4 h-4 sm:w-5 sm:h-5 ml-auto text-[var(--accent-color)]" />}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    </div>
);
