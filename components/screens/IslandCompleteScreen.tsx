import React from 'react';
import {
    IslandConfig, IslandStatus, GradeLevel, IslandStarRatingsState, IslandDifficulty, IslandProgressState
} from '../../types';
import {
    GRADE_LEVEL_TEXT_MAP, ISLAND_DIFFICULTY_TEXT_MAP, ISLAND_COMPLETE_TEXT, BACK_TO_MAP_TEXT,
    PLAY_AGAIN_TEXT, NEXT_ISLAND_BUTTON_TEXT, REWARD_TEXT_EASY_PERFECT, REWARD_TEXT_MEDIUM_PERFECT,
    REWARD_TEXT_HARD_PERFECT, HOVER_SOUND_URL, FINAL_ISLAND_CONGRATS_MESSAGE, FINAL_TREASURE_ISLAND_ID,
    MAX_PLAYER_LIVES
} from '../../constants';
import FireworksCanvas from '../FireworksCanvas';
import { StarIconFilled, StarIconOutline } from '../icons';

const renderStars = (islandId: string, islandStarRatings: IslandStarRatingsState) => {
    const stars = islandStarRatings[islandId] || 0;
    const totalStars = 5;
    return (
        <div className="flex justify-center items-center h-5 sm:h-6">
            {Array.from({ length: totalStars }).map((_, i) => i < stars ? <StarIconFilled key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--accent-color)]" /> : <StarIconOutline key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--accent-color)] opacity-50" />)}
        </div>
    );
};

interface ScreenWithAudioProps {
  playSound: (soundUrl: string, volume?: number) => void;
}
interface SummaryScreenSharedProps extends ScreenWithAudioProps {
    showCustomFireworks: boolean;
    audioUnlocked: boolean;
}
interface IslandCompleteScreenProps extends SummaryScreenSharedProps {
    currentIslandConfig: IslandConfig;
    selectedGrade: GradeLevel;
    selectedIslandDifficulty: IslandDifficulty;
    islandScore: number;
    overallScore: number;
    playerLives: number;
    islandStarRatings: IslandStarRatingsState;
    onBackToMap: () => void;
    onPlayIslandAgain: () => void;
    onNextIsland: () => void;
    islandsForCurrentGrade: IslandConfig[];
    currentIslandId: string;
    islandProgress: IslandProgressState;
}

export const IslandCompleteScreen: React.FC<IslandCompleteScreenProps> = ({ currentIslandConfig, selectedGrade, selectedIslandDifficulty, islandScore, overallScore, playerLives, islandStarRatings, onBackToMap, onPlayIslandAgain, onNextIsland, islandsForCurrentGrade, currentIslandId, islandProgress, playSound, showCustomFireworks, audioUnlocked }) => (
    <>
        {showCustomFireworks && <FireworksCanvas isActive={showCustomFireworks} playSound={playSound} audioUnlocked={audioUnlocked} />}
        <div className="w-full h-full flex flex-col items-center justify-center animate-fadeInScale p-4">
            <div className={`text-center max-w-lg md:max-w-2xl mx-auto ${(selectedGrade === GradeLevel.FINAL && currentIslandId === FINAL_TREASURE_ISLAND_ID) ? 'bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-600 text-white' : 'bg-gradient-to-br from-[var(--correct-bg)] to-[var(--accent-color)] text-[var(--correct-text)]'} p-5 sm:p-6 md:p-8 rounded-xl relative z-10`}>
                {(() => { const starsAchievedForThisIsland = islandStarRatings[currentIslandId] || 0; const isPerfectRun = starsAchievedForThisIsland === 5; let specialCelebrationText = ""; if (isPerfectRun) { if (selectedIslandDifficulty === IslandDifficulty.HARD) specialCelebrationText = REWARD_TEXT_HARD_PERFECT; else if (selectedIslandDifficulty === IslandDifficulty.MEDIUM) specialCelebrationText = REWARD_TEXT_MEDIUM_PERFECT; } return specialCelebrationText && ( <div className="my-2 sm:my-3 flex items-center justify-center gap-2 animate-subtle-shine"> <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[var(--title-text-gradient-from)] drop-shadow-lg">{specialCelebrationText}</p> {isPerfectRun && <StarIconFilled className="w-10 h-10 sm:w-12 sm:h-12 text-[var(--title-text-gradient-from)] animate-pulse" style={{ animationDuration: '1s' }} />} </div> ); })()}
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-1 sm:mb-2">{(selectedGrade === GradeLevel.FINAL && currentIslandId === FINAL_TREASURE_ISLAND_ID) ? "CHIẾN THẮNG HUYỀN THOẠI!" : ISLAND_COMPLETE_TEXT}</h1>
                <p className="text-lg sm:text-xl md:text-2xl mb-1">{(selectedGrade === GradeLevel.FINAL && currentIslandId === FINAL_TREASURE_ISLAND_ID) ? FINAL_ISLAND_CONGRATS_MESSAGE : `${currentIslandConfig.name} (${ISLAND_DIFFICULTY_TEXT_MAP[selectedIslandDifficulty]})`}</p>
                <div className="flex justify-center my-1.5 sm:my-2 animate-subtle-shine">{renderStars(currentIslandId, islandStarRatings)}</div>
                <p className="text-base sm:text-lg md:text-xl mb-1 sm:mb-2">{islandStarRatings[currentIslandId] === 5 && selectedIslandDifficulty === IslandDifficulty.EASY ? REWARD_TEXT_EASY_PERFECT : `Bạn đạt được: ${islandScore} điểm cho đảo này.`}</p>
                {!(selectedGrade === GradeLevel.FINAL && currentIslandId === FINAL_TREASURE_ISLAND_ID) && <p className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-4">Tổng điểm {GRADE_LEVEL_TEXT_MAP[selectedGrade]}: {overallScore}</p>}
                {(selectedGrade === GradeLevel.FINAL && currentIslandId === FINAL_TREASURE_ISLAND_ID) && <p className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-4">Bạn đã nhận được 1000 Đá Quý!</p>}
                <p className="text-base sm:text-lg md:text-xl mb-2 sm:mb-4">Bạn được thưởng +1 lượt thử! Hiện có: {playerLives}/{MAX_PLAYER_LIVES} lượt.</p>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mt-4 sm:mt-6">
                    <button onClick={onBackToMap} onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)} className="bg-[var(--button-secondary-bg)] hover:opacity-90 active:brightness-90 text-[var(--button-secondary-text)] font-bold py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg shadow-[var(--button-primary-shadow,theme(boxShadow.lg))] text-sm sm:text-base md:text-lg w-full sm:w-auto">{BACK_TO_MAP_TEXT}</button>
                    <button onClick={onPlayIslandAgain} onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)} className="bg-[var(--button-primary-bg)] hover:opacity-90 active:brightness-90 text-[var(--button-primary-text)] font-bold py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg shadow-[var(--button-primary-shadow,theme(boxShadow.lg))] text-sm sm:text-base md:text-lg w-full sm:w-auto">{PLAY_AGAIN_TEXT}</button>
                    {(() => { const currentCompletedIslandIndex = islandsForCurrentGrade.findIndex(i => i.islandId === currentIslandId); const nextIsland = (currentCompletedIslandIndex !== -1 && currentCompletedIslandIndex < islandsForCurrentGrade.length - 1) ? islandsForCurrentGrade[currentCompletedIslandIndex + 1] : null; return (nextIsland && islandProgress[nextIsland.islandId] === 'unlocked' && !(selectedGrade === GradeLevel.FINAL && currentIslandId === FINAL_TREASURE_ISLAND_ID)) && ( <button onClick={onNextIsland} onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)} className="bg-[var(--button-primary-bg)] hover:opacity-90 active:brightness-90 text-[var(--button-primary-text)] font-bold py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg shadow-[var(--button-primary-shadow,theme(boxShadow.lg))] text-sm sm:text-base md:text-lg w-full sm:w-auto">{NEXT_ISLAND_BUTTON_TEXT}</button>); })()}
                </div>
            </div>
        </div>
    </>
);
