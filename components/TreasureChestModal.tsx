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
}

type RewardType = 'points' | 'quiz' | 'nothing';
type QuizPhase = 'question' | 'feedback';

const TreasureChestModal: React.FC<TreasureChestModalProps> = ({
  isOpen,
  islandName,
  onClose,
  playSound,
  themeConfig,
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
    if (rand < 0.6) return 'points'; // 60% chance for points
    if (rand < 0.9) return 'quiz';   // 30% chance for quiz
    return 'nothing';                // 10% chance for nothing
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

      playSound(TREASURE_OPEN_SOUND_URL, 0.6); // Sound when modal appears (chest appears)
      
      // Simulate chest opening animation
      const openTimer = setTimeout(() => {
        setIsOpening(false);
        setChestOpened(true);
        const determinedReward = determineReward();
        setRewardType(determinedReward);

        if (determinedReward === 'points') {
          const points = getRandomInt(TREASURE_REWARD_POINTS_MIN, TREASURE_REWARD_POINTS_MAX);
          setPointsFromChest(points);
        } else if (determinedReward === 'quiz') {
          const randomQuiz = FUN_QUIZZES[Math.floor(Math.random() * FUN_QUIZZES.length)];
          setCurrentQuiz(randomQuiz);
        } else {
            setPointsFromChest(0); // For "nothing" case
        }
      }, 1200); // Duration of "opening" animation

      return () => clearTimeout(openTimer);
    }
  }, [isOpen, playSound]);

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
              Trả Lời
            </button>
          </div>
        );
      }
      // Quiz Feedback Phase
      return (
        <div className="text-center animate-fadeIn">
          {isQuizCorrect ? (
            <CheckCircleIcon className="w-12 h-12 mx-auto text-[var(--correct-bg)] mb-2" />
          ) : (
            <XCircleIcon className="w-12 h-12 mx-auto text-[var(--incorrect-bg)] mb-2" />
          )}
          <p className={`text-lg sm:text-xl font-semibold mb-1 ${isQuizCorrect ? 'text-[var(--correct-bg)]' : 'text-[var(--incorrect-bg)]'}`}>
            {isQuizCorrect ? TREASURE_CHEST_QUIZ_CORRECT_MESSAGE(pointsFromChest) : TREASURE_CHEST_QUIZ_INCORRECT_MESSAGE}
          </p>
          {!isQuizCorrect && <p className="text-sm sm:text-base text-[var(--secondary-text)]">Đáp án đúng là: {currentQuiz.answer}</p>}
        </div>
      );
    }
    if (rewardType === 'nothing') {
      return (
        <div className="text-center animate-fadeIn">
          <SparklesIcon className="w-12 h-12 mx-auto text-[var(--secondary-text)] opacity-70 mb-3" />
          <p className="text-md sm:text-lg">{TREASURE_CHEST_THANKS_MESSAGE}</p>
        </div>
      );
    }
    return <LoadingSpinner text="Đang mở rương..." />; // Should not be visible for long
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center p-4 z-[60] transition-opacity duration-300 bg-[var(--modal-bg-backdrop)]`}
      onClick={handleCloseModal} // Close if backdrop is clicked
      role="dialog"
      aria-modal="true"
      aria-labelledby="treasure-chest-modal-title"
    >
      <div
        className={`p-5 sm:p-7 rounded-xl shadow-2xl w-full max-w-md relative transform transition-all duration-300 scale-100 animate-slideUp text-[var(--primary-text)] border-2 border-[var(--border-color)] ${themeConfig.frostedGlassOpacity || ''}`}
        style={{ background: themeConfig.modalContentBg }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleCloseModal}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-[var(--primary-text)] hover:opacity-70 active:opacity-50 transition-colors"
          aria-label={CLOSE_BUTTON_TEXT}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-7 h-7 sm:w-8 sm:h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 id="treasure-chest-modal-title" className="text-xl sm:text-2xl font-bold text-[var(--modal-header-text)] mb-3 text-center">
          {TREASURE_MODAL_TITLE}
        </h2>
        <p className="text-center text-sm sm:text-md text-[var(--secondary-text)] opacity-80 mb-4 sm:mb-5">
            Tại đảo: <span className="font-semibold">{islandName}</span>
        </p>

        <div className="flex flex-col items-center justify-center min-h-[150px] sm:min-h-[180px] my-3">
          {isOpening && (
            <div className="animate-pulse">
                <TreasureChestIcon className="w-24 h-24 sm:w-32 sm:h-32 text-[var(--accent-color)] opacity-80" />
            </div>
          )}
          {chestOpened && !isOpening && (
            <>
                {!rewardType && <LoadingSpinner text="Xem nào..."/>} 
                {rewardType && renderRewardContent()}
            </>
          )}
        </div>
        
        {chestOpened && !isOpening && rewardType && (quizPhase === 'question' && rewardType === 'quiz' ? null : ( // Don't show close button during quiz question phase
            <button
                onClick={handleCloseModal}
                onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)}
                className="mt-4 sm:mt-5 w-full bg-[var(--button-primary-bg)] hover:opacity-90 text-[var(--button-primary-text)] font-bold py-2.5 sm:py-3 px-4 rounded-lg shadow-md text-base sm:text-lg"
            >
                {CLOSE_BUTTON_TEXT}
            </button>
        ))}
      </div>
    </div>
  );
};

export default TreasureChestModal;