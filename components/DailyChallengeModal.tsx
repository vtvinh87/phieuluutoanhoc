
import React, { useState } from 'react';
import { DailyChallenge, WeeklyChallenge, DailyChallengeType, WeeklyChallengeType } from '../types';
import {
  DAILY_CHALLENGE_MODAL_TITLE,
  DAILY_CHALLENGE_REWARD_TEXT,
  DAILY_CHALLENGE_COMPLETED_TEXT,
  DAILY_CHALLENGE_CLAIM_REWARD_BUTTON_TEXT,
  DAILY_CHALLENGE_REWARD_CLAIMED_TEXT,
  DAILY_CHALLENGE_PROGRESS_TEXT,
  CLOSE_BUTTON_TEXT,
  BUTTON_CLICK_SOUND_URL,
  HOVER_SOUND_URL,
  DAILY_CHALLENGE_REFRESH_NOTICE_TEXT,
  WEEKLY_CHALLENGE_TAB_TEXT,
  DAILY_CHALLENGE_TAB_TEXT,
  WEEKLY_CHALLENGE_REWARD_TEXT,
  WEEKLY_CHALLENGE_COMPLETED_TEXT,
  WEEKLY_CHALLENGE_CLAIM_REWARD_BUTTON_TEXT,
  WEEKLY_CHALLENGE_REWARD_CLAIMED_TEXT,
  WEEKLY_CHALLENGE_REFRESH_NOTICE_TEXT,
} from '../constants';
import { CalendarCheckIcon, GemIcon, CheckCircleIcon, TrophyIcon } from './icons';
import { useTheme } from '../contexts/ThemeContext';

type ActiveChallengeTab = 'daily' | 'weekly';

interface DailyChallengeModalProps {
  isOpen: boolean;
  dailyChallenge: DailyChallenge | null;
  weeklyChallenge: WeeklyChallenge | null;
  onClose: () => void;
  onClaimDailyReward: () => void;
  onClaimWeeklyReward: () => void;
  playSound: (soundUrl: string, volume?: number) => void;
  timeUntilNextDailyRefresh: string;
  timeUntilNextWeeklyRefresh: string;
}

const DailyChallengeModal: React.FC<DailyChallengeModalProps> = ({
  isOpen,
  dailyChallenge,
  weeklyChallenge,
  onClose,
  onClaimDailyReward,
  onClaimWeeklyReward,
  playSound,
  timeUntilNextDailyRefresh,
  timeUntilNextWeeklyRefresh,
}) => {
  const { themeConfig } = useTheme();
  const [activeTab, setActiveTab] = useState<ActiveChallengeTab>('daily');

  if (!isOpen || (!dailyChallenge && !weeklyChallenge)) return null;

  const renderChallengeContent = (challenge: DailyChallenge | WeeklyChallenge | null, isWeekly: boolean) => {
    if (!challenge) {
      return (
        <div className="text-center py-8">
          <p className="text-md text-[var(--secondary-text)] opacity-80">
            Hiện không có thử thách {isWeekly ? "tuần" : "ngày"} nào.
          </p>
        </div>
      );
    }

    const progressPercentage = challenge.targetValue > 0 ? (challenge.currentValue / challenge.targetValue) * 100 : 0;
    const rewardText = isWeekly ? WEEKLY_CHALLENGE_REWARD_TEXT(challenge.rewardGems) : DAILY_CHALLENGE_REWARD_TEXT(challenge.rewardGems);
    const completedText = isWeekly ? WEEKLY_CHALLENGE_COMPLETED_TEXT : DAILY_CHALLENGE_COMPLETED_TEXT;
    const claimButtonText = isWeekly ? WEEKLY_CHALLENGE_CLAIM_REWARD_BUTTON_TEXT : DAILY_CHALLENGE_CLAIM_REWARD_BUTTON_TEXT;
    const rewardClaimedText = isWeekly ? WEEKLY_CHALLENGE_REWARD_CLAIMED_TEXT : DAILY_CHALLENGE_REWARD_CLAIMED_TEXT;
    const refreshNoticeText = isWeekly ? WEEKLY_CHALLENGE_REFRESH_NOTICE_TEXT(timeUntilNextWeeklyRefresh) : DAILY_CHALLENGE_REFRESH_NOTICE_TEXT(timeUntilNextDailyRefresh);
    const onClaim = isWeekly ? onClaimWeeklyReward : onClaimDailyReward;

    return (
      <>
        <div className="mb-5 text-center">
          <p className="text-md md:text-lg font-semibold text-[var(--primary-text)] mb-1">
            {challenge.description}
          </p>
          <p className="text-sm text-[var(--secondary-text)] opacity-80">
            {refreshNoticeText}
          </p>
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center text-sm text-[var(--primary-text)] opacity-90 mb-1">
            <span className="font-medium">Tiến độ</span>
            <span className="font-medium">{DAILY_CHALLENGE_PROGRESS_TEXT(challenge.currentValue, challenge.targetValue)}</span>
          </div>
          <div className="w-full bg-[var(--secondary-bg)] bg-opacity-70 rounded-full h-3.5 shadow-inner">
            <div
              className="bg-[var(--accent-color)] h-3.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              aria-valuenow={progressPercentage}
              aria-valuemin={0}
              aria-valuemax={100}
            ></div>
          </div>
        </div>

        <div className="mb-6 text-center">
          <p className="text-md font-medium text-[var(--primary-text)] flex items-center justify-center">
            <GemIcon className="w-6 h-6 mr-2 text-yellow-400" />
            {rewardText}
          </p>
        </div>

        {challenge.isCompleted && !challenge.rewardClaimed && (
          <button
            onClick={() => { playSound(BUTTON_CLICK_SOUND_URL, 0.6); onClaim(); }}
            onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-95 text-white font-bold py-3 px-4 rounded-lg shadow-lg text-lg flex items-center justify-center gap-2"
          >
            <CheckCircleIcon className="w-6 h-6" />
            {claimButtonText}
          </button>
        )}

        {challenge.isCompleted && challenge.rewardClaimed && (
          <p className="text-center text-green-600 font-semibold text-lg bg-green-100 py-3 px-4 rounded-lg flex items-center justify-center gap-2">
            <CheckCircleIcon className="w-6 h-6" />
            {rewardClaimedText}
          </p>
        )}

        {!challenge.isCompleted && (
          <p className="text-center text-[var(--secondary-text)] opacity-90 text-sm">
            Hãy hoàn thành thử thách để nhận thưởng nhé!
          </p>
        )}

        {challenge.type === DailyChallengeType.CORRECT_ANSWERS_IN_A_ROW && (challenge as DailyChallenge).currentStreak !== undefined && (challenge as DailyChallenge).currentStreak! > 0 && !challenge.isCompleted && (
           <p className="text-center text-sm text-[var(--accent-color)] mt-2">
             Chuỗi hiện tại: {(challenge as DailyChallenge).currentStreak}
           </p>
        )}
      </>
    );
  };


  return (
    <div
      className={`fixed inset-0 flex items-center justify-center p-4 z-[70] transition-opacity duration-300 bg-[var(--modal-bg-backdrop)] animate-fadeIn`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="challenge-modal-title"
    >
      <div
        className={`p-6 md:p-8 rounded-xl shadow-2xl w-full max-w-lg relative transform transition-all duration-300 scale-100 animate-slideUp text-[var(--primary-text)] border-2 border-[var(--border-color)] ${themeConfig.frostedGlassOpacity || ''}`}
        style={{ background: themeConfig.modalContentBg }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => { playSound(BUTTON_CLICK_SOUND_URL); onClose(); }}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-[var(--primary-text)] hover:opacity-70 active:opacity-50 transition-colors"
          aria-label={CLOSE_BUTTON_TEXT}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-7 h-7 sm:w-8 sm:h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <header className="text-center mb-5">
           {activeTab === 'daily' ?
            <CalendarCheckIcon className="w-12 h-12 sm:w-14 sm:h-14 mx-auto text-[var(--accent-color)] mb-2" />
            : <TrophyIcon className="w-12 h-12 sm:w-14 sm:h-14 mx-auto text-[var(--accent-color)] mb-2" />
           }
          <h2 id="challenge-modal-title" className="text-xl md:text-2xl font-bold text-[var(--modal-header-text)]">
            {activeTab === 'daily' ? DAILY_CHALLENGE_MODAL_TITLE : DAILY_CHALLENGE_MODAL_TITLE}
          </h2>
        </header>

        {/* Tabs */}
        <div className="flex border-b-2 border-[var(--border-color)] mb-4">
            <button
                onClick={() => {playSound(BUTTON_CLICK_SOUND_URL, 0.3); setActiveTab('daily');}}
                className={`flex-1 py-2.5 text-md font-semibold transition-colors
                            ${activeTab === 'daily' ? 'border-b-4 border-[var(--accent-color)] text-[var(--accent-color)]' : 'text-[var(--secondary-text)] hover:text-[var(--primary-text)] opacity-70 hover:opacity-100'}`}
            >
                {DAILY_CHALLENGE_TAB_TEXT}
            </button>
            <button
                onClick={() => {playSound(BUTTON_CLICK_SOUND_URL, 0.3); setActiveTab('weekly');}}
                className={`flex-1 py-2.5 text-md font-semibold transition-colors
                            ${activeTab === 'weekly' ? 'border-b-4 border-[var(--accent-color)] text-[var(--accent-color)]' : 'text-[var(--secondary-text)] hover:text-[var(--primary-text)] opacity-70 hover:opacity-100'}`}
            >
                {WEEKLY_CHALLENGE_TAB_TEXT}
            </button>
        </div>
        
        {activeTab === 'daily' && renderChallengeContent(dailyChallenge, false)}
        {activeTab === 'weekly' && renderChallengeContent(weeklyChallenge, true)}

        <button
          onClick={() => { playSound(BUTTON_CLICK_SOUND_URL); onClose(); }}
          className="mt-6 w-full bg-[var(--button-secondary-bg)] hover:opacity-90 text-[var(--button-secondary-text)] font-semibold py-3 px-4 rounded-lg shadow-md transition-colors duration-200 text-lg"
        >
          {CLOSE_BUTTON_TEXT}
        </button>
      </div>
    </div>
  );
};

export default DailyChallengeModal;
