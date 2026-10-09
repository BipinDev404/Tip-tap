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
  isShortcutsOpen: boolean;
  setIsShortcutsOpen: (open: boolean) => void;
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
  const [isTestActive, setIsTestActive] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    saveUserData(data);
  }, [data]);

  // Apply Theme to document
  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = () => {
      let isDark = false;
      if (data.settings.theme === 'dark') {
        isDark = true;
      } else if (data.settings.theme === 'light') {
        isDark = false;
      } else {
        isDark = media.matches;
      }

      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    applyTheme();
    media.addEventListener('change', applyTheme);
    return () => media.removeEventListener('change', applyTheme);
  }, [data.settings.theme]);

  // Apply Accent & Font variables
  useEffect(() => {
    const root = document.documentElement;
    const accentColors: Record<AccentColor, { light: string; dark: string; lightRgb: string }> = {
      blue: { light: '#0071e3', dark: '#0a84ff', lightRgb: '0, 113, 227' },
      emerald: { light: '#059669', dark: '#34d399', lightRgb: '5, 150, 105' },
      orange: { light: '#ea580c', dark: '#fb923c', lightRgb: '234, 88, 12' },
      purple: { light: '#7c3aed', dark: '#a78bfa', lightRgb: '124, 58, 237' },
      rose: { light: '#e11d48', dark: '#fb7185', lightRgb: '225, 29, 72' },
      graphite: { light: '#3f3f46', dark: '#d4d4d8', lightRgb: '63, 63, 70' }
    };

    const currentAccent = accentColors[data.settings.accent] || accentColors.blue;
    root.style.setProperty('--accent-light', currentAccent.light);
    root.style.setProperty('--accent-dark', currentAccent.dark);
    root.style.setProperty('--accent-rgb', currentAccent.lightRgb);

    // Font family class
    const fontFamilies: Record<string, string> = {
      system: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      dm: '"DM Sans", -apple-system, BlinkMacSystemFont, sans-serif',
      mono: '"JetBrains Mono", Menlo, Monaco, Consolas, monospace',
      serif: '"Newsreader", Georgia, Cambria, serif'
    };
    root.style.setProperty('--font-custom', fontFamilies[data.settings.fontFamily] || fontFamilies.system);
  }, [data.settings.accent, data.settings.fontFamily]);

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
        isShortcutsOpen,
        setIsShortcutsOpen,
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
