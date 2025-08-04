import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useTheme } from '../contexts/ThemeContext';
import { StudentProfileData, GradeLevel, Assignment, IslandConfig, StudentActivityLogState, AllGradesStarRatingsState, IslandProgressState, ActivityLogEntry, IslandDifficulty } from '../types';
import {
  loadStudentActivityLog,
  loadAllGradesStarRatingsFromStorage,
  loadIslandProgressFromStorage,
  loadStudentAssignments,
  saveStudentAssignments,
} from '../utils/storage';
import { useToast } from './hooks/useToast';
import {
  TEACHER_DASHBOARD_TITLE,
  STUDENT_DETAILS_WIDGET_TITLE,
  SKILL_MAP_WIDGET_TITLE,
  ASSIGN_HOMEWORK_BUTTON_TEXT,
  ASSIGNMENTS_WIDGET_TITLE,
  NO_ASSIGNMENTS_TEXT,
  ASSIGNMENT_DUE_DATE_TEXT,
  ASSIGN_HOMEWORK_MODAL_TITLE,
  SELECT_GRADE_PROMPT,
  SELECT_ISLAND_PROMPT,
  SELECT_DUE_DATE_PROMPT,
  ASSIGN_BUTTON_TEXT,
  HOMEWORK_ASSIGNED_SUCCESS_TOAST,
  ISLAND_CONFIGS,
  GRADE_LEVEL_TEXT_MAP,
  BUTTON_CLICK_SOUND_URL,
  HOVER_SOUND_URL,
  CLOSE_BUTTON_TEXT,
  STUDENT_NAME,
} from '../constants';
import { StarIconFilled, CheckCircleIcon } from './icons';
import LoadingSpinner from './LoadingSpinner';

const calculateSkillScoreForEntry = (entry: ActivityLogEntry): number => {
    let score = 0;
    if (entry.isCorrect) {
        score = 20;
    } else {
        return -10;
    }
    const difficultyMultiplier = { [IslandDifficulty.EASY]: 1, [IslandDifficulty.MEDIUM]: 1.5, [IslandDifficulty.HARD]: 2.5 };
    score *= difficultyMultiplier[entry.difficulty] || 1;
    const timeInSeconds = entry.timeTaken / 1000;
    const timeBonus = Math.max(0, 15 - timeInSeconds);
    score += timeBonus;
    if (entry.hintUsed) {
        score *= 0.6;
    }
    if (entry.attempts > 1) {
        score /= (1 + (entry.attempts - 1) * 0.5);
    }
    return score;
};

// --- Main Dashboard Component ---
const TeacherDashboard: React.FC = () => {
  const [student, setStudent] = useState<StudentProfileData | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const handleStorageChange = () => {
        const activityLog = loadStudentActivityLog();
        const starRatings = loadAllGradesStarRatingsFromStorage();
        const allGrades = Object.values(GradeLevel).filter(g => typeof g === 'number') as GradeLevel[];
        const allProgress = allGrades.reduce((acc, grade) => {
          acc[grade] = loadIslandProgressFromStorage(grade);
          return acc;
        }, {} as Record<GradeLevel, IslandProgressState>);
        const assignments = loadStudentAssignments();

        const totalStars = Object.values(starRatings).flatMap(grade => Object.values(grade)).reduce((sum, stars) => sum + stars, 0);
        const islandsCompleted = Object.values(allProgress).flatMap(grade => Object.values(grade)).filter(status => status === 'completed').length;
        
        const skillScores: Record<string, { score: number; count: number }> = {};
        if (activityLog.length > 0) {
            const topicStats: { [key: string]: { scores: number[]; count: number } } = {};
            activityLog.forEach(entry => {
                const topic = entry.questionTopic.split('(')[0].trim();
                if (!topicStats[topic]) topicStats[topic] = { scores: [], count: 0 };
                topicStats[topic].scores.push(calculateSkillScoreForEntry(entry));
                topicStats[topic].count++;
            });
            for (const topic in topicStats) {
                const averageRawScore = topicStats[topic].scores.reduce((a, b) => a + b, 0) / topicStats[topic].count;
                const normalizedScore = Math.max(0, Math.min(100, (averageRawScore / 50) * 100)); // Normalize
                skillScores[topic] = { score: normalizedScore, count: topicStats[topic].count };
            }
        }

        const binhMinhData: StudentProfileData = {
          id: 'student_binh_minh',
          name: STUDENT_NAME,
          avatar: '👨‍🎓',
          totalStars,
          islandsCompleted,
          skillScores,
          assignments,
        };
        setStudent(binhMinhData);
    };
    handleStorageChange();
    window.addEventListener('storage', handleStorageChange);
    // Listen for custom event for immediate updates
    window.addEventListener('activityLogged', handleStorageChange);
    return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('activityLogged', handleStorageChange);
    };
  }, []);

  const handleAssignHomework = (assignment: Omit<Assignment, 'id' | 'assignedDate'>) => {
    if (!student) return;
    const newAssignment: Assignment = {
      ...assignment,
      id: uuidv4(),
      assignedDate: Date.now(),
    };
    const updatedAssignments = [...student.assignments, newAssignment];
    const updatedStudent = { ...student, assignments: updatedAssignments };
    setStudent(updatedStudent);
    saveStudentAssignments(updatedAssignments);
    showToast(HOMEWORK_ASSIGNED_SUCCESS_TOAST(assignment.islandName, student.name), 'success');
    setIsAssignModalOpen(false);
  };

  const playSound = (soundUrl: string, volume: number = 0.5) => {
    try {
      const audio = new Audio(soundUrl);
      audio.volume = volume;
      audio.play().catch(() => {});
    } catch (error) {}
  };

  if (!student) {
    return <div className="w-full h-full flex items-center justify-center"><LoadingSpinner text="Đang tải dữ liệu học sinh..." /></div>;
  }

  return (
    <div className="w-full h-full flex flex-col p-2 sm:p-4 animate-fadeInScale">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--title-text-gradient-from)] to-[var(--title-text-gradient-to)] text-center mb-4 sm:mb-6">
        {TEACHER_DASHBOARD_TITLE}
      </h1>
      <div className="flex-grow overflow-y-auto pr-1">
        <StudentDetailView
          student={student}
          onAssignHomeworkClick={() => setIsAssignModalOpen(true)}
          playSound={playSound}
        />
      </div>
      {isAssignModalOpen && (
        <AssignHomeworkModal
          isOpen={isAssignModalOpen}
          onClose={() => setIsAssignModalOpen(false)}
          studentName={student.name}
          onAssign={handleAssignHomework}
          playSound={playSound}
        />
      )}
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

const StudentDetailView: React.FC<{ student: StudentProfileData; onAssignHomeworkClick: () => void; playSound: (url: string, vol?: number) => void; }> = ({ student, onAssignHomeworkClick, playSound }) => {
  const skillData = useMemo(() => {
    return Object.entries(student.skillScores)
      .map(([topic, data]) => ({ topic, score: data.score }))
      .sort((a, b) => b.score - a.score);
  }, [student.skillScores]);
  
  const strengths = skillData.filter(s => s.score >= 65).slice(0, 3);
  const weaknesses = skillData.filter(s => s.score < 65).sort((a, b) => a.score - b.score).slice(0, 3);


  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center p-3 rounded-lg bg-[var(--primary-bg)]">
        <div className="flex items-center gap-4 mb-3 sm:mb-0">
          <span className="text-5xl">{student.avatar}</span>
          <div>
            <h2 className="text-2xl font-bold text-[var(--primary-text)]">{student.name}</h2>
            <div className="flex items-center gap-4 text-sm text-[var(--secondary-text)]">
              <span className="flex items-center"><StarIconFilled className="w-4 h-4 text-yellow-400 mr-1" /> {student.totalStars} Sao</span>
              <span className="flex items-center"><CheckCircleIcon className="w-4 h-4 text-green-500 mr-1" /> {student.islandsCompleted} Đảo</span>
            </div>
          </div>
        </div>
        <button onClick={() => { playSound(BUTTON_CLICK_SOUND_URL); onAssignHomeworkClick(); }} onMouseEnter={() => playSound(HOVER_SOUND_URL, 0.2)} className="w-full sm:w-auto bg-[var(--button-primary-bg)] hover:opacity-90 text-[var(--button-primary-text)] font-semibold py-2 px-4 rounded-lg shadow-md">{ASSIGN_HOMEWORK_BUTTON_TEXT}</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <WidgetCard title={SKILL_MAP_WIDGET_TITLE}>
            <div>
              <h3 className="font-semibold text-green-600 mb-2">Điểm mạnh</h3>
              <div className="space-y-3">
                {strengths.length > 0 ? strengths.map(({ topic, score }) => (
                  <div key={topic}>
                    <div className="flex justify-between items-center mb-1 text-sm font-medium text-[var(--primary-text)]"><span>{topic}</span><span className="font-bold">{score.toFixed(0)}/100</span></div>
                    <div className="w-full bg-[var(--primary-bg)] rounded-full h-4 shadow-inner"><div className="bg-gradient-to-r from-green-400 to-emerald-500 h-4 rounded-full" style={{ width: `${score}%` }}></div></div>
                  </div>
                )) : <p className="text-xs text-center text-[var(--secondary-text)] opacity-70 pt-2">Cần thêm dữ liệu.</p>}
              </div>
              <h3 className="font-semibold text-red-600 mb-2 mt-4">Cần cải thiện</h3>
               <div className="space-y-3">
                {weaknesses.length > 0 ? weaknesses.map(({ topic, score }) => (
                  <div key={topic}>
                    <div className="flex justify-between items-center mb-1 text-sm font-medium text-[var(--primary-text)]"><span>{topic}</span><span className="font-bold">{score.toFixed(0)}/100</span></div>
                    <div className="w-full bg-[var(--primary-bg)] rounded-full h-4 shadow-inner"><div className="bg-gradient-to-r from-orange-400 to-red-500 h-4 rounded-full" style={{ width: `${score}%` }}></div></div>
                  </div>
                )) : <p className="text-xs text-center text-[var(--secondary-text)] opacity-70 pt-2">Không có điểm yếu rõ rệt.</p>}
              </div>
            </div>
        </WidgetCard>
        <WidgetCard title={ASSIGNMENTS_WIDGET_TITLE}>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {student.assignments.length > 0 ? [...student.assignments].sort((a,b) => b.assignedDate - a.assignedDate).map(a => (
              <div key={a.id} className="p-2 bg-[var(--primary-bg)] rounded-md">
                <p className="font-semibold text-sm text-[var(--primary-text)]">{a.islandName} ({GRADE_LEVEL_TEXT_MAP[a.grade]})</p>
                <p className="text-xs text-[var(--secondary-text)]">{ASSIGNMENT_DUE_DATE_TEXT(new Date(a.dueDate).toLocaleDateString('vi-VN'))}</p>
              </div>
            )) : <p className="text-center text-sm text-[var(--secondary-text)] opacity-70 pt-4">{NO_ASSIGNMENTS_TEXT}</p>}
          </div>
        </WidgetCard>
      </div>
    </div>
  );
};

// --- Assign Homework Modal ---
const AssignHomeworkModal: React.FC<{ isOpen: boolean; onClose: () => void; studentName: string; onAssign: (assignment: Omit<Assignment, 'id' | 'assignedDate'>) => void; playSound: (url: string, vol?: number) => void; }> = ({ isOpen, onClose, studentName, onAssign, playSound }) => {
  const { themeConfig } = useTheme();
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(GradeLevel.GRADE_1);
  const [selectedIslandId, setSelectedIslandId] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

  const islandsForGrade = useMemo(() => ISLAND_CONFIGS.filter(i => i.targetGradeLevel === selectedGrade), [selectedGrade]);

  useEffect(() => {
    if (islandsForGrade.length > 0) setSelectedIslandId(islandsForGrade[0].islandId);
    else setSelectedIslandId('');
  }, [islandsForGrade]);

  const handleSubmit = () => {
    const island = ISLAND_CONFIGS.find(i => i.islandId === selectedIslandId);
    if (!island || !dueDate) return;
    playSound(BUTTON_CLICK_SOUND_URL, 0.6);
    onAssign({
      islandId: island.islandId,
      islandName: island.name,
      grade: selectedGrade,
      dueDate: new Date(dueDate).getTime()
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-[70] bg-[var(--modal-bg-backdrop)] animate-fadeIn">
      <div onClick={(e) => e.stopPropagation()} className={`p-6 rounded-xl shadow-2xl w-full max-w-md text-[var(--primary-text)] animate-slideUp border-2 border-[var(--border-color)] ${themeConfig.frostedGlassOpacity || ''}`} style={{ background: themeConfig.modalContentBg }}>
        <h2 className="text-xl font-bold text-[var(--modal-header-text)] mb-4">{ASSIGN_HOMEWORK_MODAL_TITLE(studentName)}</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--secondary-text)]">{SELECT_GRADE_PROMPT}</label>
            <select value={selectedGrade} onChange={e => setSelectedGrade(Number(e.target.value) as GradeLevel)} className="w-full p-2 mt-1 rounded border border-[var(--border-color)] bg-[var(--secondary-bg)] text-[var(--primary-text)]">
              {(Object.values(GradeLevel).filter(g => typeof g === 'number') as GradeLevel[]).map(g => (
                <option key={g} value={g}>{GRADE_LEVEL_TEXT_MAP[g]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--secondary-text)]">{SELECT_ISLAND_PROMPT}</label>
            <select value={selectedIslandId} onChange={e => setSelectedIslandId(e.target.value)} disabled={islandsForGrade.length === 0} className="w-full p-2 mt-1 rounded border border-[var(--border-color)] bg-[var(--secondary-bg)] text-[var(--primary-text)]">
              {islandsForGrade.map(i => (
                <option key={i.islandId} value={i.islandId}>{i.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--secondary-text)]">{SELECT_DUE_DATE_PROMPT}</label>
            <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="w-full p-2 mt-1 rounded border border-[var(--border-color)] bg-[var(--secondary-bg)] text-[var(--primary-text)]" />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={() => { playSound(BUTTON_CLICK_SOUND_URL, 0.4); onClose(); }} className="bg-[var(--button-secondary-bg)] text-[var(--button-secondary-text)] font-semibold py-2 px-4 rounded-lg">{CLOSE_BUTTON_TEXT}</button>
          <button onClick={handleSubmit} disabled={!selectedIslandId || !dueDate} className="bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] font-semibold py-2 px-4 rounded-lg disabled:opacity-50">{ASSIGN_BUTTON_TEXT}</button>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
