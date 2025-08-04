import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useTheme } from '../contexts/ThemeContext';
import {
  GradeLevel,
  StudentActivityLogState,
  AllGradesStarRatingsState,
  IslandProgressState,
  ParentGoalsState,
  ParentGoal,
  GoalType,
  ActivityLogEntry,
  IslandDifficulty,
} from '../types';
import {
  loadStudentActivityLog,
  loadAllGradesStarRatingsFromStorage,
  loadIslandProgressFromStorage,
  loadParentGoals,
  saveParentGoals,
} from '../utils/storage';
import { generateParentingTips } from '../services/geminiService';
import {
  PARENT_DASHBOARD_TITLE, QUICK_OVERVIEW_WIDGET_TITLE, SKILL_MAP_WIDGET_TITLE,
  PARENT_TIPS_WIDGET_TITLE, GOALS_WIDGET_TITLE, TOTAL_STARS_TEXT,
  ISLANDS_COMPLETED_TEXT, SKILL_MAP_NO_DATA_TEXT, GET_NEW_TIP_BUTTON_TEXT,
  GENERATING_TIP_TEXT, SET_NEW_GOAL_SECTION_TITLE, GOAL_TYPE_PROMPT,
  GOAL_TYPE_ISLANDS, GOAL_TYPE_STARS, GOAL_TARGET_PROMPT, GOAL_REWARD_PROMPT,
  SET_GOAL_BUTTON_TEXT, ACTIVE_GOALS_SECTION_TITLE, NO_ACTIVE_GOALS_TEXT,
  GOAL_PROGRESS_TEXT, GOAL_CLAIMED_TEXT, HOVER_SOUND_URL, BUTTON_CLICK_SOUND_URL,
  ISLAND_DIFFICULTY_TEXT_MAP,
} from '../constants';
import LoadingSpinner from './LoadingSpinner';
import { StarIconFilled, CheckCircleIcon, LightbulbIcon, GemIcon } from './icons';

// --- Helper function for Skill Score Calculation ---
const calculateSkillScoreForEntry = (entry: ActivityLogEntry): number => {
    let score = 0;
    if (entry.isCorrect) {
        score = 20; // Base points for correct answer
    } else {
        return -10; // Penalty for incorrect answer
    }
    
    // Difficulty multiplier
    const difficultyMultiplier = {
        [IslandDifficulty.EASY]: 1,
        [IslandDifficulty.MEDIUM]: 1.5,
        [IslandDifficulty.HARD]: 2.5,
    };
    score *= difficultyMultiplier[entry.difficulty] || 1;
    
    // Time bonus (more points for faster correct answers)
    const timeInSeconds = entry.timeTaken / 1000;
    const timeBonus = Math.max(0, 15 - timeInSeconds); // Bonus up to 15 points, max time 15s
    score += timeBonus;

    // Hint penalty
    if (entry.hintUsed) {
        score *= 0.6;
    }

    // Attempts penalty
    if (entry.attempts > 1) {
        score /= (1 + (entry.attempts - 1) * 0.5);
    }
    
    return score;
};

// --- Main Dashboard Component ---
const ParentDashboard: React.FC = () => {
  const { themeConfig } = useTheme();
  const [activityLog, setActivityLog] = useState<StudentActivityLogState>([]);
  const [starRatings, setStarRatings] = useState<AllGradesStarRatingsState>(() => loadAllGradesStarRatingsFromStorage());
  const [allProgress, setAllProgress] = useState<Record<GradeLevel, IslandProgressState>>({} as any);
  const [goals, setGoals] = useState<ParentGoalsState>([]);

  useEffect(() => {
    const handleStorageChange = () => {
        setActivityLog(loadStudentActivityLog());
        setStarRatings(loadAllGradesStarRatingsFromStorage());
        const allGrades = Object.values(GradeLevel).filter(g => typeof g === 'number') as GradeLevel[];
        const progressData = allGrades.reduce((acc, grade) => {
            acc[grade] = loadIslandProgressFromStorage(grade);
            return acc;
        }, {} as Record<GradeLevel, IslandProgressState>);
        setAllProgress(progressData);
        setGoals(loadParentGoals());
    };
    handleStorageChange(); // Initial load
    window.addEventListener('storage', handleStorageChange);
    // Add a custom event listener for immediate updates from the game
    window.addEventListener('activityLogged', handleStorageChange);
    return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('activityLogged', handleStorageChange);
    };
  }, []);
  
  const islandsCompleted = useMemo(() => {
    if (!allProgress) return 0;
    return Object.values(allProgress).flatMap(p => Object.values(p)).filter(s => s === 'completed').length;
  }, [allProgress]);


  const playSound = (soundUrl: string, volume: number = 0.5) => {
    try {
        const audio = new Audio(soundUrl);
        audio.volume = volume;
        audio.play().catch(() => {});
    } catch (error) {}
  };

  return (
    <div className="w-full h-full flex flex-col p-2 sm:p-4 animate-fadeInScale">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--title-text-gradient-from)] to-[var(--title-text-gradient-to)] text-center mb-4 sm:mb-6">
        {PARENT_DASHBOARD_TITLE}
      </h1>
      <div className="flex-grow overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 pr-1">
        <QuickOverviewWidget starRatings={starRatings} allProgress={allProgress} />
        <SkillMapWidget activityLog={activityLog} islandsCompleted={islandsCompleted} />
        <ParentTipsWidget activityLog={activityLog} islandsCompleted={islandsCompleted} playSound={playSound} />
        <GoalsWidget goals={goals} setGoals={setGoals} playSound={playSound} allProgress={allProgress} starRatings={starRatings} />
      </div>
    </div>
  );
};


// --- Widget Components ---

const WidgetCard: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className = '' }) => {
  const { themeConfig } = useTheme();
  return (
    <div className={`p-4 rounded-xl shadow-lg border border-[var(--border-color)] bg-[var(--secondary-bg)] ${themeConfig.frostedGlassOpacity || ''} flex flex-col ${className}`}>
      <h2 className="text-lg sm:text-xl font-bold text-[var(--primary-text)] mb-3 border-b-2 border-[var(--border-color)] pb-2">{title}</h2>
      <div className="flex-grow relative">{children}</div>
    </div>
  );
};

const QuickOverviewWidget: React.FC<{ starRatings: AllGradesStarRatingsState; allProgress: Record<GradeLevel, IslandProgressState> }> = ({ starRatings, allProgress }) => {
  const { totalStars, islandsCompleted } = useMemo(() => {
    let stars = 0;
    let completed = 0;
    for (const grade in starRatings) {
      for (const island in starRatings[grade as unknown as GradeLevel]) {
        stars += starRatings[grade as unknown as GradeLevel][island];
      }
    }
    if (allProgress) {
        completed = Object.values(allProgress).flatMap(p => Object.values(p)).filter(s => s === 'completed').length;
    }
    return { totalStars: stars, islandsCompleted: completed };
  }, [starRatings, allProgress]);

  return (
    <WidgetCard title={QUICK_OVERVIEW_WIDGET_TITLE} className="lg:col-span-1">
      <div className="space-y-4">
        <div className="flex items-center p-3 bg-[var(--primary-bg)] rounded-lg">
          <StarIconFilled className="w-8 h-8 text-yellow-400 mr-4" />
          <div>
            <p className="text-md font-semibold text-[var(--secondary-text)]">{TOTAL_STARS_TEXT}</p>
            <p className="text-2xl font-bold text-[var(--accent-color)]">{totalStars}</p>
          </div>
        </div>
        <div className="flex items-center p-3 bg-[var(--primary-bg)] rounded-lg">
          <CheckCircleIcon className="w-8 h-8 text-green-500 mr-4" />
          <div>
            <p className="text-md font-semibold text-[var(--secondary-text)]">{ISLANDS_COMPLETED_TEXT}</p>
            <p className="text-2xl font-bold text-[var(--accent-color)]">{islandsCompleted}</p>
          </div>
        </div>
      </div>
    </WidgetCard>
  );
};

const SkillMapWidget: React.FC<{ activityLog: StudentActivityLogState; islandsCompleted: number }> = ({ activityLog, islandsCompleted }) => {
  const skillData = useMemo(() => {
    if (islandsCompleted < 1) return [];

    const topicStats: { [key: string]: { scores: number[]; count: number } } = {};
    activityLog.forEach(entry => {
      const topic = entry.questionTopic.split('(')[0].trim();
      if (!topicStats[topic]) topicStats[topic] = { scores: [], count: 0 };
      topicStats[topic].scores.push(calculateSkillScoreForEntry(entry));
      topicStats[topic].count++;
    });

    return Object.entries(topicStats)
      .map(([topic, stats]) => {
          const averageRawScore = stats.scores.reduce((a, b) => a + b, 0) / stats.count;
          const normalizedScore = Math.max(0, Math.min(100, (averageRawScore / 50) * 100));
          return { topic, score: normalizedScore, count: stats.count };
      })
      .filter(item => item.count > 1) // Only show topics with more than one question attempt
      .sort((a, b) => b.score - a.score);
  }, [activityLog, islandsCompleted]);

  if (islandsCompleted < 1) {
    return (
      <WidgetCard title={SKILL_MAP_WIDGET_TITLE} className="lg:col-span-2">
        <div className="flex items-center justify-center h-full text-center text-[var(--secondary-text)] opacity-80">
          <p>{SKILL_MAP_NO_DATA_TEXT}</p>
        </div>
      </WidgetCard>
    );
  }

  const strengths = skillData.filter(s => s.score >= 65).slice(0, 3);
  const weaknesses = skillData.filter(s => s.score < 65).sort((a, b) => a.score - b.score).slice(0, 3);

  return (
    <WidgetCard title={SKILL_MAP_WIDGET_TITLE} className="lg:col-span-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold text-green-600 mb-2">Điểm mạnh</h3>
          <div className="space-y-3">
            {strengths.length > 0 ? strengths.map(({ topic, score }) => (
              <div key={topic}>
                <div className="flex justify-between items-center mb-1 text-sm font-medium text-[var(--primary-text)]"><span>{topic}</span><span className="font-bold">{score.toFixed(0)}/100</span></div>
                <div className="w-full bg-[var(--primary-bg)] rounded-full h-4 shadow-inner"><div className="bg-gradient-to-r from-green-400 to-emerald-500 h-4 rounded-full" style={{ width: `${score}%` }}></div></div>
              </div>
            )) : <p className="text-xs text-center text-[var(--secondary-text)] opacity-70 pt-4">Cần thêm dữ liệu để xác định điểm mạnh.</p>}
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-red-600 mb-2">Cần cải thiện</h3>
           <div className="space-y-3">
            {weaknesses.length > 0 ? weaknesses.map(({ topic, score }) => (
              <div key={topic}>
                <div className="flex justify-between items-center mb-1 text-sm font-medium text-[var(--primary-text)]"><span>{topic}</span><span className="font-bold">{score.toFixed(0)}/100</span></div>
                <div className="w-full bg-[var(--primary-bg)] rounded-full h-4 shadow-inner"><div className="bg-gradient-to-r from-orange-400 to-red-500 h-4 rounded-full" style={{ width: `${score}%` }}></div></div>
              </div>
            )) : <p className="text-xs text-center text-[var(--secondary-text)] opacity-70 pt-4">Chưa phát hiện điểm yếu rõ rệt.</p>}
          </div>
        </div>
      </div>
    </WidgetCard>
  );
};

const ParentTipsWidget: React.FC<{ activityLog: StudentActivityLogState; playSound: (url: string, vol?: number) => void; islandsCompleted: number; }> = ({ activityLog, playSound, islandsCompleted }) => {
  const [tip, setTip] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const canGenerateTip = useMemo(() => islandsCompleted >= 2, [islandsCompleted]);

  const getNewTip = useCallback(async () => {
    if (!canGenerateTip) return;
    setIsLoading(true);
    setTip(null);
    playSound(BUTTON_CLICK_SOUND_URL, 0.4);
    
    // 1. Calculate Skill Scores
    const topicStats: { [key: string]: { scores: number[]; count: number } } = {};
    activityLog.forEach(entry => {
      const topic = entry.questionTopic.split('(')[0].trim();
      if (!topicStats[topic]) topicStats[topic] = { scores: [], count: 0 };
      topicStats[topic].scores.push(calculateSkillScoreForEntry(entry));
      topicStats[topic].count++;
    });
     const skillScores = Object.entries(topicStats)
      .map(([topic, stats]) => {
          const averageRawScore = stats.scores.reduce((a, b) => a + b, 0) / stats.count;
          const normalizedScore = Math.max(0, Math.min(100, (averageRawScore / 50) * 100));
          return { topic, score: normalizedScore, count: stats.count };
      }).sort((a,b) => a.score - b.score);

    // 2. Analyze Habits
    const totalQuestions = activityLog.length;
    const totalTime = activityLog.reduce((sum, entry) => sum + entry.timeTaken, 0);
    const totalHints = activityLog.filter(e => e.hintUsed).length;
    const totalAttempts = activityLog.reduce((sum, entry) => sum + entry.attempts, 0);
    const difficultyCounts = activityLog.reduce((acc, entry) => { acc[entry.difficulty] = (acc[entry.difficulty] || 0) + 1; return acc; }, {} as Record<IslandDifficulty, number>);
    const mostPlayedDifficulty = Object.keys(difficultyCounts).length > 0 ? Object.entries(difficultyCounts).sort((a,b) => b[1] - a[1])[0][0] : 'Không rõ';

    // 3. Build Summary String
    const summary = `
Hồ sơ học tập của học sinh:
- Kỹ năng cần cải thiện nhất: ${skillScores.slice(0,2).map(s => `${s.topic} (Điểm: ${s.score.toFixed(0)}/100)`).join(', ') || 'Chưa có'}.
- Kỹ năng tốt nhất: ${skillScores.length > 2 ? `${skillScores[skillScores.length -1].topic} (Điểm: ${skillScores[skillScores.length-1].score.toFixed(0)}/100)` : 'Chưa có'}.
- Tốc độ trả lời trung bình: ${totalQuestions > 0 ? (totalTime / totalQuestions / 1000).toFixed(1) : 0} giây/câu.
- Tỷ lệ dùng gợi ý: ${totalQuestions > 0 ? ((totalHints / totalQuestions) * 100).toFixed(0) : 0}%.
- Số lần thử trung bình cho mỗi câu hỏi: ${totalQuestions > 0 ? (totalAttempts / totalQuestions).toFixed(1) : 0}.
- Độ khó thường chơi: ${ISLAND_DIFFICULTY_TEXT_MAP[mostPlayedDifficulty as IslandDifficulty] || 'Không rõ'}.
`;

    try {
      const generatedTip = await generateParentingTips(summary);
      setTip(generatedTip);
    } catch (e) {
      setTip("Không thể tạo gợi ý lúc này. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  }, [activityLog, playSound, canGenerateTip]);

  return (
    <WidgetCard title={PARENT_TIPS_WIDGET_TITLE} className="lg:col-span-1">
      <div className="flex flex-col h-full">
        <div className="flex-grow p-3 bg-[var(--primary-bg)] rounded-lg flex items-center justify-center min-h-[120px]">
          {isLoading ? <LoadingSpinner text={GENERATING_TIP_TEXT} /> :
            <p className="text-sm text-[var(--secondary-text)] italic text-center">
              {tip || (canGenerateTip ? "Nhấn nút bên dưới để nhận gợi ý giúp bạn đồng hành cùng bé học toán tốt hơn." : "Hoàn thành thêm đảo để mở khóa gợi ý từ AI.")}
            </p>
          }
        </div>
        <button
          onClick={getNewTip}
          disabled={isLoading || !canGenerateTip}
          onMouseEnter={() => !isLoading && canGenerateTip && playSound(HOVER_SOUND_URL, 0.2)}
          className="mt-3 w-full bg-[var(--button-primary-bg)] hover:opacity-90 text-[var(--button-primary-text)] font-semibold py-2 px-4 rounded-lg shadow-md flex items-center justify-center gap-2 disabled:opacity-60"
        >
          <LightbulbIcon className="w-5 h-5" /> {GET_NEW_TIP_BUTTON_TEXT}
        </button>
      </div>
    </WidgetCard>
  );
};

const GoalsWidget: React.FC<{
    goals: ParentGoalsState;
    setGoals: React.Dispatch<React.SetStateAction<ParentGoalsState>>;
    playSound: (url: string, vol?: number) => void;
    allProgress: Record<GradeLevel, IslandProgressState>;
    starRatings: AllGradesStarRatingsState;
}> = ({ goals, setGoals, playSound, allProgress, starRatings }) => {
    const [newGoalType, setNewGoalType] = useState<GoalType>(GoalType.COMPLETE_ISLANDS);
    const [newGoalTarget, setNewGoalTarget] = useState(5);
    const [newGoalReward, setNewGoalReward] = useState(100);

    const handleSetGoal = () => {
        playSound(BUTTON_CLICK_SOUND_URL, 0.6);
        const newGoal: ParentGoal = {
            id: uuidv4(),
            type: newGoalType,
            target: newGoalTarget,
            rewardGems: newGoalReward,
            createdAt: Date.now(),
            isClaimed: false,
        };
        const updatedGoals = [...goals, newGoal];
        setGoals(updatedGoals);
        saveParentGoals(updatedGoals);
    };
    
    const getCurrentProgress = useCallback((goal: ParentGoal) => {
        if (goal.type === GoalType.COMPLETE_ISLANDS) {
            return Object.values(allProgress).flatMap(grade => Object.values(grade)).filter(status => status === 'completed').length;
        }
        if (goal.type === GoalType.EARN_STARS) {
            return Object.values(starRatings).flatMap(grade => Object.values(grade)).reduce((sum, stars) => sum + stars, 0);
        }
        return 0;
    }, [allProgress, starRatings]);

    return (
        <WidgetCard title={GOALS_WIDGET_TITLE} className="md:col-span-2 lg:col-span-2">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Set New Goal */}
                <div className="p-3 bg-[var(--primary-bg)] rounded-lg">
                    <h3 className="font-semibold mb-2 text-md text-[var(--primary-text)]">{SET_NEW_GOAL_SECTION_TITLE}</h3>
                    <div className="space-y-2 text-sm">
                        <div>
                            <label className="block text-xs font-medium text-[var(--secondary-text)]">{GOAL_TYPE_PROMPT}</label>
                            <select value={newGoalType} onChange={e => setNewGoalType(e.target.value as GoalType)} className="w-full p-1.5 mt-1 rounded border border-[var(--border-color)] bg-[var(--secondary-bg)] text-[var(--primary-text)]">
                                <option value={GoalType.COMPLETE_ISLANDS}>{GOAL_TYPE_ISLANDS}</option>
                                <option value={GoalType.EARN_STARS}>{GOAL_TYPE_STARS}</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-[var(--secondary-text)]">{GOAL_TARGET_PROMPT}</label>
                            <input type="number" value={newGoalTarget} onChange={e => setNewGoalTarget(parseInt(e.target.value, 10))} min="1" className="w-full p-1.5 mt-1 rounded border border-[var(--border-color)] bg-[var(--secondary-bg)] text-[var(--primary-text)]" />
                        </div>
                        <div>
                             <label className="block text-xs font-medium text-[var(--secondary-text)]">{GOAL_REWARD_PROMPT}</label>
                            <input type="number" value={newGoalReward} onChange={e => setNewGoalReward(parseInt(e.target.value, 10))} min="10" step="10" className="w-full p-1.5 mt-1 rounded border border-[var(--border-color)] bg-[var(--secondary-bg)] text-[var(--primary-text)]" />
                        </div>
                        <button onClick={handleSetGoal} className="w-full mt-2 bg-[var(--button-primary-bg)] hover:opacity-90 text-[var(--button-primary-text)] font-semibold py-2 px-3 rounded-md text-sm">{SET_GOAL_BUTTON_TEXT}</button>
                    </div>
                </div>
                {/* Active Goals */}
                <div className="p-3 bg-[var(--primary-bg)] rounded-lg">
                    <h3 className="font-semibold mb-2 text-md text-[var(--primary-text)]">{ACTIVE_GOALS_SECTION_TITLE}</h3>
                    <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                        {goals.filter(g => !g.isClaimed).length > 0 ? goals.filter(g => !g.isClaimed).map(goal => {
                            const currentProgress = getCurrentProgress(goal);
                            const isCompleted = currentProgress >= goal.target;
                            return (
                                <div key={goal.id} className={`p-2 rounded ${goal.isClaimed ? 'bg-green-100 text-green-800' : 'bg-[var(--secondary-bg)]'}`}>
                                    <p className="text-xs font-medium">
                                        {goal.type === GoalType.COMPLETE_ISLANDS ? GOAL_TYPE_ISLANDS : GOAL_TYPE_STARS}: {goal.target}
                                    </p>
                                     <p className="text-xs flex items-center gap-1">Phần thưởng: {goal.rewardGems} <GemIcon className="w-3 h-3 text-yellow-500"/></p>
                                    {goal.isClaimed ? <p className="text-xs font-bold mt-1 text-green-600">{GOAL_CLAIMED_TEXT}</p> : <p className="text-xs mt-1">{GOAL_PROGRESS_TEXT(currentProgress, goal.target)}</p>}
                                </div>
                            );
                        }) : <p className="text-xs text-center text-[var(--secondary-text)] opacity-70 py-4">{NO_ACTIVE_GOALS_TEXT}</p>}
                    </div>
                </div>
            </div>
        </WidgetCard>
    );
};


export default ParentDashboard;
