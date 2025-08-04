import React from 'react';
import { GradeLevel } from '../../types';
import {
    GRADE_COMPLETE_TEXT, GRADE_LEVEL_TEXT_MAP, HOVER_SOUND_URL, PLAY_THIS_GRADE_AGAIN_TEXT,
    CHOOSE_ANOTHER_GRADE_TEXT, ENDLESS_MODE_BUTTON_TEXT
} from '../../constants';
import FireworksCanvas from '../FireworksCanvas';
import { SparklesIcon, PlayIcon } from '../icons';

interface ScreenWithAudioProps {
  playSound: (soundUrl: string, volume?: number) => void;
}
interface SummaryScreenSharedProps extends ScreenWithAudioProps {
    showCustomFireworks: boolean;
    audioUnlocked: boolean;
}
interface GradeCompleteScreenProps extends SummaryScreenSharedProps {
    selectedGrade: GradeLevel;
    overallScore: number;
    isEndlessUnlockedForGrade: boolean;
    onPlayThisGradeAgain: () => void;
    onChooseAnotherGrade: () => void;
    onStartEndlessMode: () => void;
}

export const GradeCompleteScreen: React.FC<GradeCompleteScreenProps> = ({ selectedGrade, overallScore, isEndlessUnlockedForGrade, onPlayThisGradeAgain, onChooseAnotherGrade, onStartEndlessMode, playSound, showCustomFireworks, audioUnlocked }) => (
    <>
        {showCustomFireworks && <FireworksCanvas isActive={showCustomFireworks} playSound={playSound} audioUnlocked={audioUnlocked}/>}
        <div className="w-full h-full flex flex-col items-center justify-center animate-fadeInScale p-4 relative z-50">
            <div className={`text-center max-w-lg md:max-w-2xl mx-auto bg-gradient-to-r from-[var(--title-text-gradient-from)] via-[var(--accent-color)] to-[var(--title-text-gradient-to)] text-[var(--accent-text)] p-5 sm:p-6 md:p-8 rounded-xl relative`}>
                <SparklesIcon className="w-16 h-16 sm:w-20 md:w-24 mx-auto mb-4 sm:mb-6 text-white animate-subtle-shine"/>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4 animate-subtle-shine">{GRADE_COMPLETE_TEXT}</h1>
                <p className="text-lg sm:text-xl md:text-2xl mb-1 sm:mb-2">{GRADE_LEVEL_TEXT_MAP[selectedGrade]}</p>
                <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 sm:mb-8 drop-shadow-lg">{overallScore} <span className="text-xl sm:text-2xl md:text-3xl">điểm</span></p>
                <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
                    <button onClick={onPlayThisGradeAgain} onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)} className="bg-[var(--correct-bg)] hover:opacity-90 active:brightness-90 text-[var(--correct-text)] font-bold py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg shadow-[var(--button-primary-shadow,theme(boxShadow.lg))] text-sm sm:text-base md:text-lg transition-transform transform hover:scale-105 w-full sm:w-auto">{PLAY_THIS_GRADE_AGAIN_TEXT}</button>
                    <button onClick={onChooseAnotherGrade} onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)} className="bg-[var(--button-secondary-bg)] hover:opacity-90 active:brightness-90 text-[var(--button-secondary-text)] font-bold py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg shadow-[var(--button-primary-shadow,theme(boxShadow.lg))] text-sm sm:text-base md:text-lg transition-transform transform hover:scale-105 w-full sm:w-auto">{CHOOSE_ANOTHER_GRADE_TEXT}</button>
                </div>
                {isEndlessUnlockedForGrade && (
                    <button onClick={onStartEndlessMode} onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)} className="mt-4 sm:mt-6 w-full max-w-xs sm:max-w-sm mx-auto block bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg shadow-[var(--button-primary-shadow,theme(boxShadow.lg))] text-base sm:text-lg transition-transform transform hover:scale-105 flex items-center justify-center gap-2">
                        <PlayIcon className="w-5 h-5 sm:w-6 sm:h-6" /> {ENDLESS_MODE_BUTTON_TEXT}
                    </button>
                )}
            </div>
        </div>
    </>
);
