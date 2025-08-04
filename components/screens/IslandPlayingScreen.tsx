import React from 'react';
import { Question, IslandConfig, GradeLevel, IslandDifficulty } from '../../types';
import {
    MAX_PLAYER_LIVES, GRADE_LEVEL_TEXT_MAP, ISLAND_DIFFICULTY_TEXT_MAP, HOVER_SOUND_URL,
    QUESTIONS_PER_ISLAND, QUESTIONS_PER_FINAL_ISLAND, FINAL_ISLAND_GRADE_TITLE,
    FINAL_ISLAND_EPIC_DIFFICULTY_TEXT, BACK_TO_MAP_TEXT
} from '../../constants';
import QuestionDisplay from '../QuestionDisplay';
import AnswerOption from '../AnswerOption';
import FeedbackIndicator from '../FeedbackIndicator';
import { LightbulbIcon, HeartIconFilled, HeartIconBroken, StopIcon } from '../icons';

interface ScreenWithAudioProps {
  playSound: (soundUrl: string, volume?: number) => void;
}
interface IslandPlayingScreenProps extends ScreenWithAudioProps {
    currentQuestion: Question;
    currentIslandConfig: IslandConfig;
    selectedIslandDifficulty: IslandDifficulty;
    playerLives: number;
    selectedAnswer: string | null;
    userAttemptShown: boolean;
    feedback: { isCorrect: boolean | null; message?: string };
    revealSolution: boolean;
    currentQuestionIndexInIsland: number;
    isHintModalOpen: boolean;
    hintButtonUsed: boolean;
    onAnswerSelect: (answer: string) => void;
    onAnswerSubmit: () => void;
    onHintRequest: () => void;
    onBackToMap: () => void;
}

export const IslandPlayingScreen: React.FC<IslandPlayingScreenProps> = ({ currentQuestion, currentIslandConfig, selectedIslandDifficulty, playerLives, selectedAnswer, userAttemptShown, feedback, revealSolution, currentQuestionIndexInIsland, isHintModalOpen, hintButtonUsed, onAnswerSelect, onAnswerSubmit, onHintRequest, onBackToMap, playSound }) => (
    <div className={`w-full h-full flex flex-col animate-fadeInScale ${(currentIslandConfig.targetGradeLevel === GradeLevel.FINAL) ? 'final-island-playing-card' : ''} p-1 sm:p-2`}>
        <header className={`w-full flex flex-col sm:flex-row justify-between items-center p-2 sm:p-3 mb-1 sm:mb-2 border-b-2 ${(currentIslandConfig.targetGradeLevel === GradeLevel.FINAL) ? 'border-yellow-400/30' : 'border-[var(--border-color)]'}`}>
            <div className="flex flex-col items-center sm:items-start mb-1 sm:mb-0">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[var(--title-text-gradient-from)] text-center sm:text-left">
                    {(currentIslandConfig.targetGradeLevel === GradeLevel.FINAL) ? FINAL_ISLAND_GRADE_TITLE : `${currentIslandConfig.mapIcon} ${currentIslandConfig.name}`}
                </h1>
                <p className="text-sm sm:text-base text-[var(--primary-text)] opacity-80">
                    {(currentIslandConfig.targetGradeLevel === GradeLevel.FINAL) ? FINAL_ISLAND_EPIC_DIFFICULTY_TEXT : ISLAND_DIFFICULTY_TEXT_MAP[selectedIslandDifficulty]}
                </p>
            </div>
            <div className="flex items-center gap-3">
                <div className={`text-lg sm:text-xl md:text-2xl font-bold flex items-center ${playerLives <= 1 ? 'text-red-500 animate-pulse' : 'text-[var(--accent-color)]'}`}>
                    {Array.from({ length: MAX_PLAYER_LIVES }).map((_, i) => (
                        i < playerLives ? <HeartIconFilled key={i} className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" /> : <HeartIconBroken key={i} className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 opacity-50" />
                    ))}
                </div>
                <button onClick={onBackToMap} onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)} className="bg-[var(--button-secondary-bg)] hover:opacity-90 active:brightness-90 text-[var(--button-secondary-text)] font-semibold py-1.5 px-3 rounded-md shadow-[var(--button-primary-shadow,theme(boxShadow.md))] text-xs sm:text-sm">
                    <StopIcon className="w-4 h-4 mr-1 inline"/>{BACK_TO_MAP_TEXT}
                </button>
            </div>
        </header>
        <div className="w-full bg-[var(--border-color)] rounded-full h-2 sm:h-2.5 mb-2 sm:mb-3">
            <div className="bg-[var(--accent-color)] h-full rounded-full transition-all duration-300 ease-linear" style={{ width: `${ ( (currentIslandConfig.targetGradeLevel === GradeLevel.FINAL ? QUESTIONS_PER_FINAL_ISLAND : QUESTIONS_PER_ISLAND) > 0 ? ((currentQuestionIndexInIsland + 1) / (currentIslandConfig.targetGradeLevel === GradeLevel.FINAL ? QUESTIONS_PER_FINAL_ISLAND : QUESTIONS_PER_ISLAND)) * 100 : 0)}%` }} ></div>
        </div>
        <div className="flex-grow flex flex-col justify-center">
            <QuestionDisplay question={currentQuestion} />
        </div>
        
        <div className="min-h-24 flex items-center justify-center">
            <FeedbackIndicator isCorrect={feedback.isCorrect} message={feedback.message} />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4 my-2 sm:my-3">
            {currentQuestion.options.map((option, index) => (
                <AnswerOption key={index} optionText={option} onClick={() => onAnswerSelect(option)} disabled={userAttemptShown || (feedback.isCorrect === true || (playerLives === 0 && feedback.isCorrect === false && revealSolution))} isSelected={selectedAnswer === option} isCorrect={option === currentQuestion.correctAnswer} userAttemptShown={userAttemptShown} solutionRevealed={revealSolution} />
            ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-auto">
            <button onClick={onHintRequest} onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)} disabled={isHintModalOpen || hintButtonUsed || (feedback.isCorrect === true || (playerLives === 0 && feedback.isCorrect === false && revealSolution))} className={`flex-1 bg-[var(--button-secondary-bg)] text-[var(--button-secondary-text)] font-semibold py-2.5 sm:py-3 px-4 rounded-lg shadow-[var(--button-primary-shadow,theme(boxShadow.md))] flex items-center justify-center gap-2 text-sm sm:text-base transition-all duration-200 ${hintButtonUsed ? 'opacity-60 cursor-not-allowed' : 'hover:bg-opacity-80 active:scale-95'}`}>
                <LightbulbIcon className="w-4 h-4 sm:w-5 sm:h-5" /> Gợi Ý {hintButtonUsed && "(Đã dùng)"}
            </button>
            <button onClick={onAnswerSubmit} onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)} disabled={!selectedAnswer || userAttemptShown || (feedback.isCorrect === true || (playerLives === 0 && feedback.isCorrect === false && revealSolution))} className={`flex-1 bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] font-bold py-2.5 sm:py-3 px-4 rounded-lg shadow-[var(--button-primary-shadow,theme(boxShadow.xl))] text-sm sm:text-base transition-all duration-200 ${(!selectedAnswer || userAttemptShown || (feedback.isCorrect === true || (playerLives === 0 && feedback.isCorrect === false && revealSolution))) ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-90 active:scale-95 active:brightness-90'}`}>
                {(feedback.isCorrect === true || (playerLives === 0 && feedback.isCorrect === false && revealSolution)) ? (feedback.isCorrect ? "Câu Tiếp Theo" : "Tiếp Tục") : "Kiểm Tra Đáp Án"}
            </button>
        </div>
    </div>
);
