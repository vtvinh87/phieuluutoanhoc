import React from 'react';
import {
    IslandConfig, IslandStatus, GradeLevel, IslandStarRatingsState,
    ActiveTreasureChestsState, ActiveMessageBottlesState,
    ShootingStarData, ActiveNPCInfo, ActiveCollectibleState,
    ActiveDailyChallengeState, ActiveWeeklyChallengeState, IslandProgressState
} from '../../types';
import {
    GRADE_LEVEL_TEXT_MAP, CHOOSE_ISLAND_TEXT, HOVER_SOUND_URL, ACHIEVEMENT_BUTTON_ICON_URL, VIEW_ACHIEVEMENTS_BUTTON_TEXT,
    TREASURE_CHEST_ICON_EMOJI, MESSAGE_IN_BOTTLE_ICON_EMOJI, ENDLESS_MODE_BUTTON_TEXT, FINAL_ISLAND_GRADE_TITLE,
    CHOOSE_ANOTHER_GRADE_TEXT, NO_ISLANDS_FOR_GRADE_TEXT, DAILY_CHALLENGE_BUTTON_TEXT, PLAYER_GEMS_TEXT,
    COLLECTIBLE_ITEMS, FINAL_TREASURE_ISLAND_ID
} from '../../constants';
import ShootingStar from '../ShootingStar';
import {
    GemIcon, CalendarCheckIcon, XCircleIcon as LockIcon, StarIconFilled, StarIconOutline, PlayIcon
} from '../icons';

interface ScreenWithAudioProps {
  playSound: (soundUrl: string, volume?: number) => void;
}

interface IslandMapScreenProps extends ScreenWithAudioProps {
    selectedGrade: GradeLevel;
    islandsForCurrentGrade: IslandConfig[];
    islandProgress: IslandProgressState;
    islandStarRatings: IslandStarRatingsState;
    overallScore: number;
    isEndlessUnlockedForGrade: boolean;
    onIslandSelect: (islandId: string) => void;
    onChooseAnotherGrade: () => void;
    onToggleAchievementsScreen: () => void;
    onToggleDailyChallengeModal: () => void;
    onStartEndlessMode: () => void;
    activeTreasureChests: Record<string, boolean>;
    activeMessageBottle: ActiveMessageBottlesState;
    activeNPCData: ActiveNPCInfo | null;
    activeCollectible: ActiveCollectibleState;
    shootingStar: ShootingStarData | null;
    onShootingStarClick: (id: string) => void;
    setShootingStar: React.Dispatch<React.SetStateAction<ShootingStarData | null>>;
    playerGems: number;
    activeDailyChallenge: ActiveDailyChallengeState;
    activeWeeklyChallenge: ActiveWeeklyChallengeState;
}

const renderStars = (islandId: string, islandStarRatings: IslandStarRatingsState) => {
    const stars = islandStarRatings[islandId] || 0;
    const totalStars = 5;
    return (
        <div className="flex justify-center items-center h-5 sm:h-6">
            {Array.from({ length: totalStars }).map((_, i) => i < stars ? <StarIconFilled key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--accent-color)]" /> : <StarIconOutline key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--accent-color)] opacity-50" />)}
        </div>
    );
};

export const IslandMapScreen: React.FC<IslandMapScreenProps> = ({ selectedGrade, islandsForCurrentGrade, islandProgress, overallScore, isEndlessUnlockedForGrade, onIslandSelect, onChooseAnotherGrade, onToggleAchievementsScreen, onToggleDailyChallengeModal, onStartEndlessMode, playSound, islandStarRatings, activeTreasureChests, activeMessageBottle, activeNPCData, activeCollectible, shootingStar, onShootingStarClick, setShootingStar, playerGems, activeDailyChallenge, activeWeeklyChallenge }) => (
    <div className="w-full h-full flex flex-col animate-fadeInScale relative">
        {shootingStar && shootingStar.visible && !shootingStar.clicked && (
            <ShootingStar starData={shootingStar} onClick={() => onShootingStarClick(shootingStar.id)} onDisappear={() => setShootingStar(prev => prev && prev.id === shootingStar.id ? null : prev)} />
        )}
        <div className="w-full h-full flex flex-col p-1 sm:p-2">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-3 sm:mb-4 gap-2">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--title-text-gradient-from)] to-[var(--title-text-gradient-to)] mb-1 sm:mb-0 text-center sm:text-left">
                    {selectedGrade === GradeLevel.FINAL ? FINAL_ISLAND_GRADE_TITLE : CHOOSE_ISLAND_TEXT}
                </h1>
                <div className="flex items-center justify-end flex-wrap gap-2 sm:gap-3">
                    <div className="flex items-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 rounded-full bg-[var(--secondary-bg)] shadow-md">
                        <GemIcon className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                        <span className="text-xs sm:text-sm font-semibold text-[var(--primary-text)]">{playerGems}</span>
                    </div>
                    <button onClick={onToggleDailyChallengeModal} onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)} className="p-2 sm:p-2.5 rounded-full bg-[var(--button-secondary-bg)] hover:opacity-90 active:brightness-90 shadow-md relative focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[var(--accent-color)]" aria-label={DAILY_CHALLENGE_BUTTON_TEXT}>
                        <CalendarCheckIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--accent-color)]" />
                        {((activeDailyChallenge && !activeDailyChallenge.isCompleted) || (activeWeeklyChallenge && !activeWeeklyChallenge.isCompleted)) && (
                            <span className="absolute top-0 right-0 block h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-red-500 ring-1 sm:ring-2 ring-white" />
                        )}
                        {((activeDailyChallenge && activeDailyChallenge.isCompleted && !activeDailyChallenge.rewardClaimed) || (activeWeeklyChallenge && activeWeeklyChallenge.isCompleted && !activeWeeklyChallenge.rewardClaimed)) && (
                            <span className="absolute top-0 right-0 block h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-green-500 ring-1 sm:ring-2 ring-white animate-pulse" />
                        )}
                    </button>
                    <button onClick={onChooseAnotherGrade} onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)} className="bg-[var(--button-secondary-bg)] hover:opacity-90 active:brightness-90 text-[var(--button-secondary-text)] font-semibold py-1.5 sm:py-2 px-2.5 sm:px-3 rounded-md sm:rounded-lg shadow-[var(--button-primary-shadow,theme(boxShadow.md))] text-xs sm:text-sm">
                        {CHOOSE_ANOTHER_GRADE_TEXT}
                    </button>
                    <button onClick={onToggleAchievementsScreen} onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)} className="hover:opacity-90 active:brightness-90 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[var(--accent-color)] rounded-full p-0.5" aria-label={VIEW_ACHIEVEMENTS_BUTTON_TEXT}>
                        <img src={ACHIEVEMENT_BUTTON_ICON_URL} alt="Huy hiệu" className="w-10 h-10 sm:w-12 sm:h-12 animate-trophy-glow" />
                    </button>
                </div>
            </div>
            {selectedGrade !== GradeLevel.FINAL && (
                <div className="mb-3 sm:mb-4">
                    <div className="flex justify-between items-center text-xs sm:text-sm text-[var(--primary-text)] opacity-90 mb-0.5 sm:mb-1 px-1">
                        <span className="font-semibold">Tiến Độ Phiêu Lưu</span>
                        <span className="font-semibold">{ (islandsForCurrentGrade.length > 0 ? (islandsForCurrentGrade.filter(island => islandProgress[island.islandId] === 'completed').length / islandsForCurrentGrade.length) * 100 : 0).toFixed(0) }%</span>
                    </div>
                    <div className="w-full bg-[var(--secondary-bg)] rounded-full h-2.5 sm:h-3 shadow-inner">
                        <div className="bg-[var(--accent-color)] h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${islandsForCurrentGrade.length > 0 ? (islandsForCurrentGrade.filter(island => islandProgress[island.islandId] === 'completed').length / islandsForCurrentGrade.length) * 100 : 0}%` }} ></div>
                    </div>
                </div>
            )}
            <p className="text-center text-[var(--primary-text)] opacity-90 mb-2 sm:mb-3 text-lg sm:text-xl md:text-2xl">
                {selectedGrade === GradeLevel.FINAL ? islandsForCurrentGrade[0]?.name : `Lớp: ${GRADE_LEVEL_TEXT_MAP[selectedGrade]}`}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 flex-grow overflow-y-auto py-1 sm:py-2">
                {islandsForCurrentGrade.length === 0 && selectedGrade !== GradeLevel.FINAL ? (<p className="col-span-full text-center text-[var(--secondary-text)]">{NO_ISLANDS_FOR_GRADE_TEXT}</p>) : islandsForCurrentGrade.map((island) => {
                    const status = islandProgress[island.islandId] || 'locked';
                    const isDisabled = status === 'locked';
                    let currentBgColor = 'bg-[var(--island-locked-bg)]';
                    let currentTextColor = 'text-[var(--island-locked-text)]';
                    if (status === 'completed') { currentBgColor = 'bg-[var(--island-completed-bg)]'; currentTextColor = 'text-[var(--island-completed-text)]'; } else if (status === 'unlocked') { currentBgColor = 'bg-[var(--island-unlocked-bg)]'; currentTextColor = 'text-[var(--island-unlocked-text)]'; }
                    const isUnlockedAndNotCompleted = status === 'unlocked';
                    const hasTreasure = status === 'completed' && selectedGrade && activeTreasureChests[island.islandId];
                    const hasBottle = status === 'completed' && activeMessageBottle[island.islandId];
                    const hasNPC = (status === 'completed' || status === 'unlocked') && activeNPCData && activeNPCData.islandId === island.islandId && activeNPCData.grade === selectedGrade;
                    const collectibleOnIsland = status === 'completed' && activeCollectible[island.islandId];
                    const collectibleIcon = collectibleOnIsland ? COLLECTIBLE_ITEMS.find(c => c.id === activeCollectible[island.islandId]?.collectibleId)?.icon : null;
                    let topIcon = null;
                    if (collectibleOnIsland && collectibleIcon) topIcon = collectibleIcon;
                    else if (hasNPC && activeNPCData?.islandId === island.islandId) topIcon = <img src={activeNPCData.npc.imageUrl} alt={activeNPCData.npc.name} className="w-full h-full object-contain rounded-full" />;
                    else if (hasTreasure) topIcon = TREASURE_CHEST_ICON_EMOJI;
                    else if (hasBottle) topIcon = MESSAGE_IN_BOTTLE_ICON_EMOJI;
                    const isFinalIslandButton = island.islandId === FINAL_TREASURE_ISLAND_ID;
                    let finalIslandSpecificStyles = isFinalIslandButton ? 'border-4 border-yellow-400 bg-gradient-to-br from-amber-400 via-orange-500 to-red-600 !text-white shadow-yellow-500/50 animate-pulse-glow' : '';
                    const pulseAnimation = isUnlockedAndNotCompleted || hasTreasure || hasBottle || hasNPC || collectibleOnIsland || isFinalIslandButton;
                    const ariaLabelParts = [island.name];
                    if (isDisabled) ariaLabelParts.push('(Đã khoá)');
                    if (collectibleOnIsland) ariaLabelParts.push(`(Có ${COLLECTIBLE_ITEMS.find(c => c.id === activeCollectible[island.islandId]?.collectibleId)?.name || 'vật phẩm'})`);
                    else if (hasNPC && activeNPCData?.islandId === island.islandId) ariaLabelParts.push(`(Có ${activeNPCData.npc.name}!)`);
                    else if (hasTreasure) ariaLabelParts.push('(Có rương báu!)');
                    else if (hasBottle) ariaLabelParts.push('(Có thông điệp!)');

                    return (
                        <button key={island.islandId} onClick={() => !isDisabled && onIslandSelect(island.islandId)} onMouseEnter={() => !isDisabled && playSound(HOVER_SOUND_URL, 0.2)} disabled={isDisabled} className={`p-3 sm:p-4 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 ${currentBgColor} ${currentTextColor} ${finalIslandSpecificStyles} min-h-[160px] sm:min-h-[180px] flex flex-col justify-between items-center text-center focus:outline-none focus:ring-4 ring-[var(--island-button-ring-color)] relative ${isDisabled ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90 active:scale-95 active:brightness-90'} ${pulseAnimation && !isFinalIslandButton ? 'animate-pulse-glow' : ''} ${(hasTreasure || hasBottle || hasNPC || collectibleOnIsland) && !isFinalIslandButton ? 'ring-4 ring-yellow-400 border-2 border-yellow-200' : ''}`} aria-label={ariaLabelParts.join(' ')}>
                            {topIcon && (
                                <span className="absolute top-1 right-1 text-xl sm:text-2xl animate-bounce" style={{ filter: 'drop-shadow(0 0 3px gold)', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {topIcon}
                                </span>
                            )}
                            <div className="flex-grow flex flex-col items-center justify-center">
                                <span className="text-2xl sm:text-3xl mb-1" aria-hidden="true">{island.mapIcon}</span>
                                <h2 className="text-base sm:text-lg font-bold leading-tight">{island.name}</h2>
                                <p className="text-xs sm:text-sm mt-1 px-1 opacity-90 line-clamp-2">{island.description}</p>
                            </div>
                            <div className="mt-1.5 sm:mt-2 h-5 sm:h-6">
                                {isDisabled && <LockIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--incorrect-bg)] opacity-70" />}
                                {status === 'completed' && !topIcon ? <div className="animate-subtle-shine">{renderStars(island.islandId, islandStarRatings)}</div> : null}
                                {((status === 'completed' || status === 'unlocked') && topIcon) ? <div className="animate-subtle-shine">{renderStars(island.islandId, islandStarRatings)}</div> : null}
                                {status === 'unlocked' && !topIcon ? <span className="text-xs opacity-80">(Chưa hoàn thành)</span> : null}
                            </div>
                        </button>
                    );
                })}
            </div>
            {selectedGrade !== GradeLevel.FINAL && (
                <p className="text-center text-[var(--primary-text)] opacity-90 mt-3 sm:mt-4 text-xl sm:text-2xl font-bold">Tổng Điểm {GRADE_LEVEL_TEXT_MAP[selectedGrade]}: {overallScore}</p>
            )}
            {selectedGrade !== GradeLevel.FINAL && isEndlessUnlockedForGrade && (
                <button onClick={onStartEndlessMode} onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)} className="mt-4 sm:mt-6 w-full max-w-xs sm:max-w-sm mx-auto block bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg shadow-[var(--button-primary-shadow,theme(boxShadow.lg))] text-base sm:text-lg transition-transform transform hover:scale-105 flex items-center justify-center gap-2">
                    <PlayIcon className="w-5 h-5 sm:w-6 sm:h-6" /> {ENDLESS_MODE_BUTTON_TEXT}
                </button>
            )}
        </div>
    </div>
);
