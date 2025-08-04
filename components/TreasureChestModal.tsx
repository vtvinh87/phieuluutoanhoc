
import React, { useState, useEffect, useMemo } from 'react';
import { FunQuiz, ThemeConfig } from '../types';
import {
    TREASURE_MODAL_TITLE,
    FUN_QUIZZES,
    TREASURE_REWARD_POINTS_MIN,
    TREASURE_REWARD_POINTS_MAX,
    TREASURE_QUIZ_REWARD_POINTS_MIN,
    TREASURE_QUIZ_REWARD_POINTS_MAX,
    TREASURE_CHEST_THANKS_MESSAGE,
    TREASURE_CHEST_POINTS_MESSAGE,
    TREASURE_CHEST_QUIZ_CORRECT_MESSAGE,
    TREASURE_CHEST_QUIZ_INCORRECT_MESSAGE,
    CLOSE_BUTTON_TEXT,
    BUTTON_CLICK_SOUND_URL,
    HOVER_SOUND_URL,
    CORRECT_ANSWER_SOUND_URL,
    INCORRECT_ANSWER_SOUND_URL,
    TREASURE_OPEN_SOUND_URL
} from '../constants';
import { TreasureChestIcon, GiftIcon, SparklesIcon, CheckCircleIcon, XCircleIcon } from './icons';
import LoadingSpinner from './LoadingSpinner';

interface TreasureChestModalProps {
  isOpen: boolean;
  islandName: string;
  onClose: (pointsAwarded: number) => void;
  playSound: (soundUrl: string, volume?: number) => void;
  themeConfig: ThemeConfig;
  onChestActuallyOpened?: () => void;
}

type RewardType = 'points' | 'quiz' | 'nothing';
type QuizPhase = 'question' | 'feedback';

const TreasureChestModal: React.FC<TreasureChestModalProps> = ({
  isOpen,
  islandName,
  onClose,
  playSound,
  themeConfig,
  onChestActuallyOpened,
}) => {
  const [isOpening, setIsOpening] = useState(true);
  const [chestOpened, setChestOpened] = useState(false);
  const [rewardType, setRewardType] = useState<RewardType | null>(null);
  const [currentQuiz, setCurrentQuiz] = useState<FunQuiz | null>(null);
  const [quizAnswer, setQuizAnswer] = useState<string>('');
  const [quizPhase, setQuizPhase] = useState<QuizPhase>('question');
  const [isQuizCorrect, setIsQuizCorrect] = useState<boolean | null>(null);
  const [pointsFromChest, setPointsFromChest] = useState(0);

  const determineReward = () => {
    const rand = Math.random();
    if (rand < 0.50) return 'points'; 
    if (rand < 0.75) return 'quiz';   
    return 'nothing';                
  };

  const getRandomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  useEffect(() => {
    if (isOpen) {
      setIsOpening(true);
      setChestOpened(false);
      setRewardType(null);
      setCurrentQuiz(null);
      setQuizAnswer('');
      setQuizPhase('question');
      setIsQuizCorrect(null);
      setPointsFromChest(0);

      playSound(TREASURE_OPEN_SOUND_URL, 0.6); 

      const openTimer = setTimeout(() => {
        setIsOpening(false);
        setChestOpened(true);
        // onChestActuallyOpened will be called in the next useEffect when chestOpened and !isOpening
      }, 1200); 

      return () => clearTimeout(openTimer);
    }
  }, [isOpen, playSound]);

  useEffect(() => {
    if (chestOpened && !isOpening) {
        onChestActuallyOpened?.(); // Trigger sparkle effect
        const determinedReward = determineReward();
        setRewardType(determinedReward);

        if (determinedReward === 'points') {
          const points = getRandomInt(TREASURE_REWARD_POINTS_MIN, TREASURE_REWARD_POINTS_MAX);
          setPointsFromChest(points);
        } else if (determinedReward === 'quiz') {
          const randomQuiz = FUN_QUIZZES[Math.floor(Math.random() * FUN_QUIZZES.length)];
          setCurrentQuiz(randomQuiz);
        } else {
            setPointsFromChest(0); 
        }
    }
  }, [chestOpened, isOpening, onChestActuallyOpened]);


  const handleQuizSubmit = () => {
    if (!currentQuiz) return;
    playSound(BUTTON_CLICK_SOUND_URL);
    const correct = currentQuiz.answer.toLowerCase() === quizAnswer.trim().toLowerCase();
    setIsQuizCorrect(correct);
    setQuizPhase('feedback');
    if (correct) {
      playSound(CORRECT_ANSWER_SOUND_URL, 0.5);
      setPointsFromChest(currentQuiz.points);
    } else {
      playSound(INCORRECT_ANSWER_SOUND_URL, 0.4);
      setPointsFromChest(0);
    }
  };

  const handleCloseModal = () => {
    playSound(BUTTON_CLICK_SOUND_URL);
    onClose(pointsFromChest);
  }

  if (!isOpen) return null;

  const renderRewardContent = () => {
    if (rewardType === 'points') {
      return (
        <div className="text-center animate-fadeIn">
          <GiftIcon className="w-16 h-16 mx-auto text-[var(--accent-color)] mb-3" />
          <p className="text-xl sm:text-2xl font-semibold">{TREASURE_CHEST_POINTS_MESSAGE(pointsFromChest)}</p>
        </div>
      );
    }
    if (rewardType === 'quiz' && currentQuiz) {
      if (quizPhase === 'question') {
        return (
          <div className="animate-fadeIn w-full">
            <p className="text-md sm:text-lg font-medium mb-3 text-center">{currentQuiz.question}</p>
            {currentQuiz.type === 'mc' && currentQuiz.options && (
              <div className="space-y-2.5 my-3">
                {currentQuiz.options.map(opt => (
                  <button
                    key={opt}
                    onClick={() => setQuizAnswer(opt)}
                    onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)}
                    className={`w-full p-2.5 sm:p-3 rounded-lg text-sm sm:text-base border-2 transition-colors
                                ${quizAnswer === opt ? 'bg-[var(--button-answer-option-selected-bg)] text-[var(--button-answer-option-selected-text)] border-[var(--button-answer-option-selected-ring)]'
                                                    : 'bg-[var(--button-answer-option-bg)] text-[var(--button-answer-option-text)] border-[var(--button-answer-option-ring)] hover:opacity-90'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
            {currentQuiz.type === 'fill' && (
              <input
                type="text"
                value={quizAnswer}
                onChange={(e) => setQuizAnswer(e.target.value)}
                placeholder="Nhập câu trả lời..."
                className="w-full p-2.5 sm:p-3 rounded-lg border-2 border-[var(--border-color)] bg-[var(--secondary-bg)] text-[var(--secondary-text)] focus:ring-2 focus:ring-[var(--accent-color)] focus:border-[var(--accent-color)] outline-none my-3"
              />
            )}
            <button
              onClick={handleQuizSubmit}
              disabled={!quizAnswer.trim()}
              onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)}
              className="w-full bg-[var(--button-primary-bg)] hover:opacity-90 text-[var(--button-primary-text)] font-bold py-2.5 sm:py-3 px-4 rounded-lg shadow-md text-base sm:text-lg disabled:opacity-60"
            >
              Trả lời
            </button>
          </div>
        );
      } else { // Feedback phase
        return (
          <div className="text-center animate-fadeIn">
            {isQuizCorrect ? (
              <CheckCircleIcon className="w-12 h-12 mx-auto text-[var(--correct-bg)] mb-2" />
            ) : (
              <XCircleIcon className="w-12 h-12 mx-auto text-[var(--incorrect-bg)] mb-2" />
            )}
            <p className={`text-lg sm:text-xl font-semibold mb-1 ${isQuizCorrect ? 'text-[var(--correct-text)]' : 'text-[var(--incorrect-text)]'}`}>
              {isQuizCorrect ? TREASURE_CHEST_QUIZ_CORRECT_MESSAGE(pointsFromChest) : TREASURE_CHEST_QUIZ_INCORRECT_MESSAGE}
            </p>
            {!isQuizCorrect && (
              <p className="text-sm sm:text-base text-[var(--secondary-text)]">
                Đáp án đúng là: {currentQuiz.answer}
              </p>
            )}
          </div>
        );
      }
    }
    if (rewardType === 'nothing') {
      return (
        <div className="text-center animate-fadeIn">
          <SparklesIcon className="w-16 h-16 mx-auto text-[var(--secondary-text)] opacity-70 mb-3" />
          <p className="text-lg sm:text-xl font-medium">{TREASURE_CHEST_THANKS_MESSAGE}</p>
        </div>
      );
    }
    return (
      <div className="h-24 flex items-center justify-center">
        <LoadingSpinner text="Đang mở rương..." />
      </div>
    );
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center p-4 z-[70] overflow-y-auto transition-opacity duration-300 bg-[var(--modal-bg-backdrop)] animate-fadeIn`}
      onClick={handleCloseModal}
      role="dialog"
      aria-modal="true"
      aria-labelledby="treasure-modal-title"
    >
      <div
        className={`p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-md relative transform transition-all duration-300 scale-100 animate-slideUp text-[var(--primary-text)] border-2 border-[var(--border-color)] ${themeConfig.frostedGlassOpacity || ''}`}
        style={{ background: themeConfig.modalContentBg }}
        onClick={(e) => e.stopPropagation()}
      >
        {!chestOpened && (
            <button
            onClick={handleCloseModal}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 text-[var(--primary-text)] hover:opacity-70 active:opacity-50 transition-colors z-20"
            aria-label={CLOSE_BUTTON_TEXT}
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-7 h-7 sm:w-8 sm:h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        )}
        <header className="text-center mb-4 sm:mb-5">
            {/* Add id here for targeting by sparkle effect */}
           <div id="treasure-chest-modal-icon-target" className="inline-block">
                <TreasureChestIcon
                    className={`
                    w-20 h-20 sm:w-24 sm:h-24 mx-auto text-[var(--accent-color)] mb-2 sm:mb-3
                    transition-transform duration-1000 ease-in-out
                    ${isOpening ? 'animate-bounce' : ''}
                    ${chestOpened ? 'transform scale-110 -rotate-6' : ''}
                    `}
                    style={chestOpened ? { filter: 'drop-shadow(0 0 10px gold)' } : {}}
                />
            </div>
          <h2 id="treasure-modal-title" className="text-xl md:text-2xl font-bold text-[var(--modal-header-text)]">
            {TREASURE_MODAL_TITLE}
          </h2>
          <p className="text-sm text-[var(--secondary-text)] opacity-80 mt-1">
            Tại: <span className="font-semibold">{islandName}</span>
          </p>
        </header>

        <div className="my-4 min-h-[80px] sm:min-h-[100px] flex items-center justify-center">
          {isOpening ? <LoadingSpinner text="Đang mở..." /> : renderRewardContent()}
        </div>
        
        {chestOpened && (
            <button
            onClick={handleCloseModal}
            className="mt-6 w-full bg-[var(--button-primary-bg)] hover:opacity-90 text-[var(--button-primary-text)] font-bold py-3 px-4 rounded-lg shadow-md transition-colors duration-200 text-lg"
            >
            {CLOSE_BUTTON_TEXT}
            </button>
        )}
      </div>
    </div>
  );
};

export default TreasureChestModal;