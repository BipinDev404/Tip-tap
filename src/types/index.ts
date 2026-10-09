export type TestMode = 'time' | 'words' | 'quote' | 'custom';
export type TimeOption = 15 | 30 | 60 | 120;
export type WordsOption = 10 | 25 | 50 | 100;
export type QuoteLength = 'short' | 'medium' | 'long';

export type ThemeMode = 'dark';
export type AccentColor = 'blue' | 'emerald' | 'orange' | 'purple' | 'rose' | 'cyan' | 'graphite';
export type CaretStyle = 'bar' | 'line' | 'block' | 'underline' | 'pulse';
export type FontFamily = 'system' | 'inter' | 'dm' | 'mono' | 'fira' | 'serif';
export type FontSize = 'sm' | 'md' | 'lg' | 'xl';
export type SoundEffect = 'off' | 'mechanical' | 'thock' | 'clicky' | 'typewriter' | 'soft' | 'bubble';

export interface UserSettings {
  theme: ThemeMode;
  accent: AccentColor;
  fontFamily: FontFamily;
  fontSize: FontSize;
  caretStyle: CaretStyle;
  sound: SoundEffect;
  soundEnabled: boolean;
  errorSoundEnabled: boolean;
  soundVolume: number; // 0 to 1
  highlightErrors: boolean;
  showVirtualKeyboard: boolean;
  reducedMotion: boolean;
  smoothCaret: boolean;
  blindMode: boolean; // Monkeytype blind mode (no error highlighting until end)
  focusMode: boolean; // Hides header, footer, and stats during test for distraction-free mode
  ghostingEnabled: boolean; // Displays previous best performance as translucent text pacing layer
}

export interface KeystrokeSample {
  second: number;
  wpm: number;
  rawWpm: number;
  errors: number;
}

export interface TestResult {
  id: string;
  timestamp: number;
  mode: TestMode;
  modeValue: string; // "30s", "50w", "quote", "custom"
  wpm: number;
  rawWpm: number;
  accuracy: number;
  consistency: number; // 0 - 100%
  durationSeconds: number;
  characters: {
    total: number;
    correct: number;
    incorrect: number;
    extra: number;
  };
  missedKeys: Record<string, number>;
  history: KeystrokeSample[];
  quoteAuthor?: string;
  isPersonalBest?: boolean;
}

export interface Lesson {
  id: string;
  title: string;
  targetKeys: string[];
  explanation: string;
  fingerTips: string;
  text: string;
  minAccuracy: number;
  minWpm: number;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  description: string;
  targetKeysSummary: string;
  lessons: Lesson[];
}

export interface LessonProgress {
  completed: boolean;
  bestWpm: number;
  bestAccuracy: number;
  completedAt: number;
  stars: number; // 1, 2, 3
}

export interface TipTapUserData {
  settings: UserSettings;
  results: TestResult[];
  lessonProgress: Record<string, LessonProgress>;
  customTexts: string[];
  weakKeysCounter: Record<string, number>;
}
