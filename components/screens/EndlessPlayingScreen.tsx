import React from 'react';
import { Question, GradeLevel, IslandDifficulty } from '../../types';
import {
    GRADE_LEVEL_TEXT_MAP, HOVER_SOUND_URL, ENDLESS_MODE_LIVES,
    ENDLESS_MODE_TITLE_TEXT, ENDLESS_MODE_SCORE_TEXT, ENDLESS_MODE_QUESTIONS_ANSWERED_TEXT, ENDLESS_DIFFICULTY_LEVEL_TEXT_MAP
} from '../../constants';
import QuestionDisplay from '../QuestionDisplay';
import AnswerOption from '../AnswerOption';
import FeedbackIndicator from '../FeedbackIndicator';
import { LightbulbIcon, HeartIconFilled, HeartIconBroken, StopIcon } from '../icons';

interface ScreenWithAudioProps {
  playSound: (soundUrl: string, volume?: number) => void;
}

interface EndlessPlayingScreenProps extends ScreenWithAudioProps {
    currentQuestion: Question;
    currentEndlessGrade: GradeLevel;
    endlessModeLives: number;
    endlessModeScore: number;
    endlessQuestionsAnswered: number;
    selectedAnswer: string | null;
    userAttemptShown: boolean;
    feedback: { isCorrect: boolean | null; message?: string };
    revealSolution: boolean;
    isHintModalOpen: boolean;
    hintButtonUsed: boolean;
    endlessDifficultyLevel: number;
    onAnswerSelect: (answer: string) => void;
    onAnswerSubmit: () => void;
    onHintRequest: () => void;
    onBackToMap: () => void;
}

export const EndlessPlayingScreen: React.FC<EndlessPlayingScreenProps> = ({ currentQuestion, currentEndlessGrade, endlessModeLives, endlessModeScore, endlessQuestionsAnswered, selectedAnswer, userAttemptShown, feedback, revealSolution, isHintModalOpen, hintButtonUsed, endlessDifficultyLevel, onAnswerSelect, onAnswerSubmit, onHintRequest, onBackToMap, playSound }) => (
    <div className={`w-full h-full flex flex-col animate-fadeInScale p-1 sm:p-2`}>
        <header className={`w-full flex flex-col sm:flex-row justify-between items-center p-2 sm:p-3 mb-1 sm:mb-2 border-b-2 border-[var(--border-color)]`}>
            <div className="flex flex-col items-center sm:items-start mb-1 sm:mb-0">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[var(--title-text-gradient-from)] text-center sm:text-left">{ENDLESS_MODE_TITLE_TEXT(GRADE_LEVEL_TEXT_MAP[currentEndlessGrade])}</h1>
                <p className="text-sm sm:text-base text-[var(--primary-text)] opacity-80">
                    Cấp Độ Khó: <span className="font-semibold">{ENDLESS_DIFFICULTY_LEVEL_TEXT_MAP[endlessDifficultyLevel]}</span>
                </p>
            </div>
            <div className="flex items-center gap-3">
                <div className={`text-lg sm:text-xl md:text-2xl font-bold flex items-center ${endlessModeLives <= 1 ? 'text-red-500 animate-pulse' : 'text-[var(--accent-color)]'}`}>
                    {Array.from({ length: ENDLESS_MODE_LIVES }).map((_, i) => (
                        i < endlessModeLives ? <HeartIconFilled key={i} className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" /> : <HeartIconBroken key={i} className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 opacity-50" />
                    ))}
                </div>
                <button onClick={onBackToMap} onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)} className="bg-[var(--button-secondary-bg)] hover:opacity-90 active:brightness-90 text-[var(--button-secondary-text)] font-semibold py-1.5 px-3 rounded-md shadow-[var(--button-primary-shadow,theme(boxShadow.md))] text-xs sm:text-sm">
                    <StopIcon className="w-4 h-4 mr-1 inline"/>Dừng Lại
                </button>
            </div>
        </header>
        <div className="w-full flex justify-between items-center px-1 mb-2 text-sm sm:text-base font-semibold">
            <span>{ENDLESS_MODE_SCORE_TEXT}: <span className="text-[var(--accent-color)]">{endlessModeScore}</span></span>
            <span>{ENDLESS_MODE_QUESTIONS_ANSWERED_TEXT}: <span className="text-[var(--accent-color)]">{endlessQuestionsAnswered}</span></span>
        </div>
        <div className="flex-grow flex flex-col justify-center">
            <QuestionDisplay question={currentQuestion} />
        </div>
        
        <div className="min-h-24 flex items-center justify-center">
            <FeedbackIndicator isCorrect={feedback.isCorrect} message={feedback.message} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4 my-2 sm:my-3">
            {currentQuestion.options.map((option, index) => (
                <AnswerOption key={index} optionText={option} onClick={() => onAnswerSelect(option)} disabled={userAttemptShown} isSelected={selectedAnswer === option} isCorrect={option === currentQuestion.correctAnswer} userAttemptShown={userAttemptShown} solutionRevealed={revealSolution} />
            ))}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-auto">
            <button onClick={onHintRequest} onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)} disabled={isHintModalOpen || hintButtonUsed || userAttemptShown} className={`flex-1 bg-[var(--button-secondary-bg)] text-[var(--button-secondary-text)] font-semibold py-2.5 sm:py-3 px-4 rounded-lg shadow-[var(--button-primary-shadow,theme(boxShadow.md))] flex items-center justify-center gap-2 text-sm sm:text-base transition-all duration-200 ${hintButtonUsed ? 'opacity-60 cursor-not-allowed' : 'hover:bg-opacity-80 active:scale-95'}`}>
                <LightbulbIcon className="w-4 h-4 sm:w-5 sm:h-5" /> Gợi Ý {hintButtonUsed && "(Đã dùng)"}
            </button>
            <button onClick={onAnswerSubmit} onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)} disabled={!selectedAnswer || userAttemptShown} className={`flex-1 bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] font-bold py-2.5 sm:py-3 px-4 rounded-lg shadow-[var(--button-primary-shadow,theme(boxShadow.xl))] text-sm sm:text-base transition-all duration-200 ${(!selectedAnswer || userAttemptShown) ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-90 active:scale-95 active:brightness-90'}`}>
                {userAttemptShown ? (feedback.isCorrect ? "Câu Tiếp Theo" : "Thử Lại") : "Kiểm Tra Đáp Án"}
            </button>
        </div>
    </div>
);
