import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { 
  TipTapUserData, 
  UserSettings, 
  TestResult, 
  LessonProgress, 
  AccentColor, 
  ThemeMode,
  Lesson 
} from '../types';
import { loadUserData, saveUserData, DEFAULT_SETTINGS, exportDataAsJSON, parseImportJSON, INITIAL_DATA } from '../utils/storage';
import { soundManager } from '../utils/audio';

export type NavigationTab = 'practice' | 'learn' | 'progress' | 'settings';

export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  todayCount: number;
  dailyGoal: number;
  isGoalAchieved: boolean;
  thisWeekDays: { dayName: string; dateStr: string; isActive: boolean; isToday: boolean }[];
}

interface AppContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  settings: UserSettings;
  updateSettings: (partial: Partial<UserSettings>) => void;
  results: TestResult[];
  addTestResult: (result: Omit<TestResult, 'id' | 'timestamp' | 'isPersonalBest'>) => TestResult;
  lessonProgress: Record<string, LessonProgress>;
  updateLessonProgress: (lessonId: string, wpm: number, accuracy: number, stars: number) => void;
  activeLesson: Lesson | null;
  setActiveLesson: (lesson: Lesson | null) => void;
  weakKeysCounter: Record<string, number>;
  practiceTargetWords: string | null;
  setPracticeTargetWords: (text: string | null) => void;
  playKeySound: () => void;
  playErrorSound: () => void;
  playCompleteSound: () => void;
  exportBackup: () => void;
  importBackup: (file: File) => Promise<boolean>;
  resetAllData: () => void;
  personalBestWpm: number;
  overallLevel: { level: number; title: string; progress: number; nextLevelAt: number };
  streakInfo: StreakInfo;
  isShortcutsOpen: boolean;
  setIsShortcutsOpen: (open: boolean) => void;
  isStreakModalOpen: boolean;
  setIsStreakModalOpen: (open: boolean) => void;
  isTestActive: boolean;
  setIsTestActive: (active: boolean) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<TipTapUserData>(loadUserData);
  const [activeTab, setActiveTab] = useState<NavigationTab>('practice');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [practiceTargetWords, setPracticeTargetWords] = useState<string | null>(null);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isStreakModalOpen, setIsStreakModalOpen] = useState(false);
  const [isTestActive, setIsTestActive] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    saveUserData(data);
  }, [data]);

  // Enforce dark mode as the default and permanent state
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('dark');
  }, []);

  // Apply Accent, Font variables, and Motion settings
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    const accentColors: Record<AccentColor, { light: string; dark: string; lightRgb: string }> = {
      blue: { light: '#3b82f6', dark: '#60a5fa', lightRgb: '59, 130, 246' },
      emerald: { light: '#10b981', dark: '#34d399', lightRgb: '16, 185, 129' },
      orange: { light: '#f59e0b', dark: '#fbbf24', lightRgb: '245, 158, 11' },
      purple: { light: '#8b5cf6', dark: '#a78bfa', lightRgb: '139, 92, 246' },
      rose: { light: '#f43f5e', dark: '#fb7185', lightRgb: '244, 63, 94' },
      cyan: { light: '#06b6d4', dark: '#22d3ee', lightRgb: '6, 182, 212' },
      graphite: { light: '#71717a', dark: '#e4e4e7', lightRgb: '161, 161, 170' }
    };

    const currentAccent = accentColors[data.settings.accent] || accentColors.blue;
    root.style.setProperty('--accent-light', currentAccent.light);
    root.style.setProperty('--accent-dark', currentAccent.dark);
    root.style.setProperty('--accent-color', currentAccent.dark);
    root.style.setProperty('--accent-rgb', currentAccent.lightRgb);

    // Font family class
    const fontFamilies: Record<string, string> = {
      system: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      inter: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      dm: '"DM Sans", -apple-system, BlinkMacSystemFont, sans-serif',
      mono: '"JetBrains Mono", Menlo, Monaco, Consolas, monospace',
      fira: '"Fira Code", "JetBrains Mono", monospace',
      serif: '"Newsreader", Georgia, Cambria, serif'
    };
    root.style.setProperty('--font-custom', fontFamilies[data.settings.fontFamily] || fontFamilies.system);

    // Apply reduced motion to body
    if (data.settings.reducedMotion) {
      body.classList.add('reduce-motion');
    } else {
      body.classList.remove('reduce-motion');
    }
  }, [data.settings.accent, data.settings.fontFamily, data.settings.reducedMotion]);

  const updateSettings = (partial: Partial<UserSettings>) => {
    setData(prev => ({
      ...prev,
      settings: { ...prev.settings, ...partial }
    }));
  };

  const personalBestWpm = useMemo(() => {
    if (data.results.length === 0) return 0;
    return Math.max(...data.results.map(r => r.wpm));
  }, [data.results]);

  const addTestResult = (res: Omit<TestResult, 'id' | 'timestamp' | 'isPersonalBest'>): TestResult => {
    const isPB = res.wpm > personalBestWpm && res.wpm > 20;
    const fullResult: TestResult = {
      ...res,
      id: `test-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now(),
      isPersonalBest: isPB
    };

    // Update weak keys counter
    const updatedWeakKeys = { ...data.weakKeysCounter };
    Object.entries(res.missedKeys).forEach(([char, count]) => {
      const key = char.toLowerCase();
      updatedWeakKeys[key] = (updatedWeakKeys[key] || 0) + count;
    });

    setData(prev => ({
      ...prev,
      results: [fullResult, ...prev.results].slice(0, 500), // Keep latest 500 tests
      weakKeysCounter: updatedWeakKeys
    }));

    return fullResult;
  };

  const updateLessonProgress = (lessonId: string, wpm: number, accuracy: number, stars: number) => {
    setData(prev => {
      const existing = prev.lessonProgress[lessonId];
      const newProgress: LessonProgress = {
        completed: true,
        bestWpm: Math.max(existing?.bestWpm || 0, wpm),
        bestAccuracy: Math.max(existing?.bestAccuracy || 0, accuracy),
        completedAt: Date.now(),
        stars: Math.max(existing?.stars || 0, stars)
      };
      return {
        ...prev,
        lessonProgress: {
          ...prev.lessonProgress,
          [lessonId]: newProgress
        }
      };
    });
  };

  const playKeySound = () => {
    if (data.settings.soundEnabled && data.settings.sound !== 'off') {
      soundManager.playKey(data.settings.sound, data.settings.soundVolume);
    }
  };

  const playErrorSound = () => {
    if (data.settings.soundEnabled && data.settings.errorSoundEnabled && data.settings.sound !== 'off') {
      soundManager.playError(data.settings.soundVolume);
    }
  };

  const playCompleteSound = () => {
    if (data.settings.soundEnabled && data.settings.sound !== 'off') {
      soundManager.playComplete(data.settings.soundVolume);
    }
  };

  const exportBackup = () => {
    exportDataAsJSON(data);
  };

  const importBackup = async (file: File): Promise<boolean> => {
    try {
      const text = await file.text();
      const imported = parseImportJSON(text);
      if (imported) {
        setData(imported);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const resetAllData = () => {
    setData(INITIAL_DATA);
    localStorage.removeItem('tiptap_data_v1');
  };

  // Compute Overall Level
  const overallLevel = useMemo(() => {
    const totalWords = data.results.reduce((acc, r) => acc + (r.characters.correct / 5), 0);
    const testsCount = data.results.length;
    const completedLessons = Object.values(data.lessonProgress).filter(p => p.completed).length;

    // Experience points formula: 1 test = 25 XP, 1 word = 1 XP, 1 lesson = 50 XP
    const xp = Math.round(totalWords + testsCount * 25 + completedLessons * 50);

    // Levels: 0 to 10+
    const xpPerLevel = 250;
    const levelNumber = Math.max(1, Math.floor(xp / xpPerLevel) + 1);
    const progressInLevel = Math.min(100, Math.round(((xp % xpPerLevel) / xpPerLevel) * 100));

    const titles = [
      'Keyboard Novice',
      'Curious Keystroke',
      'Home Row Explorer',
      'Rhythmic Typist',
      'Fluent Scribe',
      'Precision Master',
      'Velocity Virtuoso',
      'Tactile Artisan',
      'Speed Virtuoso',
      'Grandmaster Typist'
    ];
    const title = titles[Math.min(levelNumber - 1, titles.length - 1)];

    return {
      level: levelNumber,
      title,
      progress: progressInLevel,
      nextLevelAt: xpPerLevel - (xp % xpPerLevel)
    };
  }, [data.results, data.lessonProgress]);

  // Compute Daily Practice Streak Info
  const streakInfo: StreakInfo = useMemo(() => {
    const dailyGoal = 3;
    const results = data.results;

    if (!results || results.length === 0) {
      const today = new Date();
      const thisWeekDays = [];
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateStr = d.toLocaleDateString('en-CA');
        thisWeekDays.push({
          dayName: dayNames[d.getDay()],
          dateStr,
          isActive: false,
          isToday: i === 0
        });
      }
      return {
        currentStreak: 0,
        longestStreak: 0,
        todayCount: 0,
        dailyGoal,
        isGoalAchieved: false,
        thisWeekDays
      };
    }

    const dateSet = new Set<string>();
    const countByDate: Record<string, number> = {};

    results.forEach(r => {
      const dStr = new Date(r.timestamp).toLocaleDateString('en-CA');
      dateSet.add(dStr);
      countByDate[dStr] = (countByDate[dStr] || 0) + 1;
    });

    const todayStr = new Date().toLocaleDateString('en-CA');
    const todayCount = countByDate[todayStr] || 0;

    let currentStreak = 0;
    let checkDate = new Date();

    if (dateSet.has(todayStr)) {
      while (dateSet.has(checkDate.toLocaleDateString('en-CA'))) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      }
    } else {
      checkDate.setDate(checkDate.getDate() - 1);
      const yesterdayStr = checkDate.toLocaleDateString('en-CA');
      if (dateSet.has(yesterdayStr)) {
        while (dateSet.has(checkDate.toLocaleDateString('en-CA'))) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        }
      }
    }

    const sortedDates = Array.from(dateSet).sort();
    let longestStreak = 0;
    let tempStreak = 0;
    let prevDate: Date | null = null;

    sortedDates.forEach(dStr => {
      const currDate = new Date(dStr);
      if (!prevDate) {
        tempStreak = 1;
      } else {
        const diffDays = Math.round((currDate.getTime() - prevDate.getTime()) / (1000 * 3600 * 24));
        if (diffDays === 1) {
          tempStreak++;
        } else {
          tempStreak = 1;
        }
      }
      prevDate = currDate;
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
    });

    const today = new Date();
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const thisWeekDays = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('en-CA');
      thisWeekDays.push({
        dayName: dayNames[d.getDay()],
        dateStr,
        isActive: dateSet.has(dateStr),
        isToday: i === 0
      });
    }

    return {
      currentStreak,
      longestStreak: Math.max(longestStreak, currentStreak),
      todayCount,
      dailyGoal,
      isGoalAchieved: todayCount >= dailyGoal,
      thisWeekDays
    };
  }, [data.results]);

  // Global keyboard shortcuts: Esc to close modal/exit, ? for shortcuts
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.key === '?' || (e.key === '/' && (e.metaKey || e.ctrlKey))) && 
          document.activeElement?.tagName !== 'INPUT' && 
          document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsShortcutsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        settings: data.settings,
        updateSettings,
        results: data.results,
        addTestResult,
        lessonProgress: data.lessonProgress,
        updateLessonProgress,
        activeLesson,
        setActiveLesson,
        weakKeysCounter: data.weakKeysCounter,
        practiceTargetWords,
        setPracticeTargetWords,
        playKeySound,
        playErrorSound,
        playCompleteSound,
        exportBackup,
        importBackup,
        resetAllData,
        personalBestWpm,
        overallLevel,
        streakInfo,
        isShortcutsOpen,
        setIsShortcutsOpen,
        isStreakModalOpen,
        setIsStreakModalOpen,
        isTestActive,
        setIsTestActive
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
