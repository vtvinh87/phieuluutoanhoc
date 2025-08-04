import React from 'react';
import { GradeLevel } from '../../types';
import {
    GRADE_LEVEL_TEXT_MAP, HOVER_SOUND_URL, ENDLESS_MODE_SCORE_TEXT, ENDLESS_MODE_QUESTIONS_ANSWERED_TEXT,
    ENDLESS_MODE_SUMMARY_TITLE, PLAY_AGAIN_ENDLESS_TEXT, BACK_TO_MAP_TEXT
} from '../../constants';
import FireworksCanvas from '../FireworksCanvas';
import { TrophyIcon } from '../icons';

interface ScreenWithAudioProps {
  playSound: (soundUrl: string, volume?: number) => void;
}
interface SummaryScreenSharedProps extends ScreenWithAudioProps {
    showCustomFireworks: boolean;
    audioUnlocked: boolean;
}
interface EndlessSummaryScreenProps extends SummaryScreenSharedProps {
    currentEndlessGrade: GradeLevel;
    endlessModeScore: number;
    endlessQuestionsAnswered: number;
    onBackToMap: () => void;
    onPlayAgain: () => void;
}

export const EndlessSummaryScreen: React.FC<EndlessSummaryScreenProps> = ({ currentEndlessGrade, endlessModeScore, endlessQuestionsAnswered, onBackToMap, onPlayAgain, playSound, showCustomFireworks, audioUnlocked }) => (
    <>
        {showCustomFireworks && <FireworksCanvas isActive={showCustomFireworks} playSound={playSound} audioUnlocked={audioUnlocked}/>}
        <div className="w-full h-full flex flex-col items-center justify-center animate-fadeInScale p-4 relative z-50">
            <div className={`text-center max-w-md md:max-w-xl mx-auto bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-700 text-white p-5 sm:p-6 md:p-8 rounded-xl relative`}>
                <TrophyIcon className="w-16 h-16 sm:w-20 mx-auto mb-3 sm:mb-4 animate-subtle-shine"/>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3">{ENDLESS_MODE_SUMMARY_TITLE}</h1>
                <p className="text-base sm:text-lg md:text-xl mb-1">Lớp: {GRADE_LEVEL_TEXT_MAP[currentEndlessGrade]}</p>
                <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-1 sm:mb-2">{ENDLESS_MODE_SCORE_TEXT}: {endlessModeScore}</p>
                <p className="text-lg sm:text-xl md:text-2xl mb-4 sm:mb-6">{ENDLESS_MODE_QUESTIONS_ANSWERED_TEXT}: {endlessQuestionsAnswered}</p>
                <div className="flex flex-col sm:flex-row justify-center gap-2.5 sm:gap-3">
                    <button onClick={onBackToMap} onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)} className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 sm:py-3 px-5 sm:px-6 rounded-lg shadow-[var(--button-primary-shadow,theme(boxShadow.lg))] text-sm sm:text-base w-full sm:w-auto">{BACK_TO_MAP_TEXT}</button>
                    <button onClick={onPlayAgain} onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)} className="bg-gradient-to-r from-orange-400 to-amber-500 hover:opacity-90 text-white font-bold py-2.5 sm:py-3 px-5 sm:px-6 rounded-lg shadow-[var(--button-primary-shadow,theme(boxShadow.lg))] text-sm sm:text-base w-full sm:w-auto">{PLAY_AGAIN_ENDLESS_TEXT}</button>
                </div>
            </div>
        </div>
    </>
);
