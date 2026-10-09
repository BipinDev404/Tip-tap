import { TipTapUserData, UserSettings, TestResult, LessonProgress } from '../types';

const STORAGE_KEY = 'tiptap_data_v1';

export const DEFAULT_SETTINGS: UserSettings = {
  theme: 'system',
  accent: 'blue',
  fontFamily: 'system',
  fontSize: 'lg',
  caretStyle: 'bar',
  sound: 'mechanical',
  soundEnabled: true,
  errorSoundEnabled: true,
  soundVolume: 0.35,
  highlightErrors: true,
  showVirtualKeyboard: true,
  reducedMotion: false,
  smoothCaret: true,
  blindMode: false,
  focusMode: false,
  ghostingEnabled: true
};

export const INITIAL_DATA: TipTapUserData = {
  settings: DEFAULT_SETTINGS,
  results: [],
  lessonProgress: {
    'lesson-a1': {
      completed: false,
      bestWpm: 0,
      bestAccuracy: 0,
      completedAt: 0,
      stars: 0
    }
  },
  customTexts: [
    "Practice makes permanence. When you type with calm intention, your speed will naturally follow."
  ],
  weakKeysCounter: {}
};

export function loadUserData(): TipTapUserData {
  if (typeof window === 'undefined') return INITIAL_DATA;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_DATA;
    const parsed = JSON.parse(raw);
    return {
      settings: { ...DEFAULT_SETTINGS, ...(parsed.settings || {}) },
      results: Array.isArray(parsed.results) ? parsed.results : [],
      lessonProgress: parsed.lessonProgress || {},
      customTexts: Array.isArray(parsed.customTexts) && parsed.customTexts.length > 0 ? parsed.customTexts : INITIAL_DATA.customTexts,
      weakKeysCounter: parsed.weakKeysCounter || {}
    };
  } catch (e) {
    console.error('Failed to load Tip tap data from localStorage', e);
    return INITIAL_DATA;
  }
}

export function saveUserData(data: TipTapUserData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save Tip tap data', e);
  }
}

export function exportDataAsJSON(data: TipTapUserData): void {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const dateStr = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `tiptap-backup-${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function parseImportJSON(jsonText: string): TipTapUserData | null {
  try {
    const parsed = JSON.parse(jsonText);
    if (!parsed || typeof parsed !== 'object') return null;
    return {
      settings: { ...DEFAULT_SETTINGS, ...(parsed.settings || {}) },
      results: Array.isArray(parsed.results) ? parsed.results : [],
      lessonProgress: parsed.lessonProgress || {},
      customTexts: Array.isArray(parsed.customTexts) ? parsed.customTexts : INITIAL_DATA.customTexts,
      weakKeysCounter: parsed.weakKeysCounter || {}
    };
  } catch (e) {
    console.error('Failed to parse imported json', e);
    return null;
  }
}
