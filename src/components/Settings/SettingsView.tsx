import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ThemeMode, 
  AccentColor, 
  FontFamily, 
  FontSize, 
  CaretStyle, 
  SoundEffect 
} from '../../types';
import { 
  Sun, 
  Moon, 
  Monitor, 
  Download, 
  Upload, 
  Trash2, 
  Check, 
  AlertTriangle,
  Play
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { 
    settings, 
    updateSettings, 
    exportBackup, 
    importBackup, 
    resetAllData,
    playKeySound,
    playErrorSound 
  } = useApp();

  const [importStatus, setImportStatus] = useState<string>('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const accentOptions: { id: AccentColor; name: string; color: string }[] = [
    { id: 'blue', name: 'Apple Blue', color: '#0071e3' },
    { id: 'emerald', name: 'Emerald', color: '#10b981' },
    { id: 'orange', name: 'Sunset Orange', color: '#ea580c' },
    { id: 'purple', name: 'Violet', color: '#7c3aed' },
    { id: 'rose', name: 'Rose', color: '#e11d48' },
    { id: 'graphite', name: 'Graphite', color: '#52525b' }
  ];

  const fontOptions: { id: FontFamily; label: string }[] = [
    { id: 'system', label: 'SF Pro / System Sans' },
    { id: 'dm', label: 'DM Sans (Geometric)' },
    { id: 'mono', label: 'JetBrains Mono' },
    { id: 'serif', label: 'Newsreader Serif' }
  ];

  const caretOptions: { id: CaretStyle; label: string }[] = [
    { id: 'bar', label: 'Bar' },
    { id: 'line', label: 'Line' },
    { id: 'block', label: 'Block' },
    { id: 'underline', label: 'Underline' },
    { id: 'pulse', label: 'Pulse' }
  ];

  const soundOptions: { id: SoundEffect; label: string }[] = [
    { id: 'mechanical', label: 'Mechanical' },
    { id: 'thock', label: 'Deep Thock' },
    { id: 'clicky', label: 'Clicky Snap' },
    { id: 'soft', label: 'Soft Dome' },
    { id: 'bubble', label: 'Bubble' },
    { id: 'off', label: 'Mute' }
  ];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const success = await importBackup(file);
    if (success) {
      setImportStatus('Backup restored successfully');
      setTimeout(() => setImportStatus(''), 3000);
    } else {
      setImportStatus('Error importing JSON. Please check file format.');
      setTimeout(() => setImportStatus(''), 4000);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-8 sm:py-10 px-4 sm:px-6 animate-in fade-in duration-200">
      
      {/* Title */}
      <div className="pb-6 mb-8 border-b border-zinc-200/60 dark:border-zinc-800/60">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          Preferences
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 mt-1">
          Customize typing experience, audio feedback, and local data.
        </p>
      </div>

      <div className="space-y-10">
        
        {/* Section 1: Appearance */}
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-4">
            Interface & Theme
          </h2>

          <div className="space-y-5">
            {/* Theme Mode */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2">
              <div>
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 block">Theme</span>
                <span className="text-xs text-zinc-500">Light, dark, or follow operating system</span>
              </div>
              <div className="flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-850 rounded-xl">
                {(['light', 'dark', 'system'] as ThemeMode[]).map(mode => {
                  const isActive = settings.theme === mode;
                  const icons = {
                    light: <Sun className="w-3.5 h-3.5" />,
                    dark: <Moon className="w-3.5 h-3.5" />,
                    system: <Monitor className="w-3.5 h-3.5" />
                  };
                  return (
                    <button
                      key={mode}
                      onClick={() => updateSettings({ theme: mode })}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all cursor-pointer ${
                        isActive
                          ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-2xs'
                          : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                      }`}
                    >
                      {icons[mode]}
                      <span>{mode}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Accent Color */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 border-t border-zinc-100 dark:border-zinc-800/60">
              <div>
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 block">Accent Color</span>
                <span className="text-xs text-zinc-500">Color used for focus rings and highlights</span>
              </div>
              <div className="flex items-center gap-2">
                {accentOptions.map(acc => {
                  const isSelected = settings.accent === acc.id;
                  return (
                    <button
                      key={acc.id}
                      onClick={() => updateSettings({ accent: acc.id })}
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform cursor-pointer ${
                        isSelected ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-zinc-900 ring-zinc-900 dark:ring-white scale-110' : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: acc.color }}
                      title={acc.name}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Typing Display & Typography */}
        <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-800/60">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-4">
            Typing Environment
          </h2>

          <div className="space-y-5">
            {/* Font Family */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2">
              <div>
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 block">Typeface</span>
                <span className="text-xs text-zinc-500">Font family for the typing test stage</span>
              </div>
              <div className="flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-850 rounded-xl overflow-x-auto">
                {fontOptions.map(f => (
                  <button
                    key={f.id}
                    onClick={() => updateSettings({ fontFamily: f.id })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                      settings.fontFamily === f.id
                        ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-2xs font-semibold'
                        : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Size */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 border-t border-zinc-100 dark:border-zinc-800/60">
              <div>
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 block">Text Size</span>
                <span className="text-xs text-zinc-500">Scaling for practice words</span>
              </div>
              <div className="flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-850 rounded-xl">
                {(['sm', 'md', 'lg', 'xl'] as FontSize[]).map(sz => (
                  <button
                    key={sz}
                    onClick={() => updateSettings({ fontSize: sz })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium uppercase transition-all cursor-pointer ${
                      settings.fontSize === sz
                        ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-2xs font-semibold'
                        : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Caret Cursor Style */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 border-t border-zinc-100 dark:border-zinc-800/60">
              <div>
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 block">Caret Style</span>
                <span className="text-xs text-zinc-500">Current character position indicator</span>
              </div>
              <div className="flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-850 rounded-xl overflow-x-auto">
                {caretOptions.map(c => (
                  <button
                    key={c.id}
                    onClick={() => updateSettings({ caretStyle: c.id })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                      settings.caretStyle === c.id
                        ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-2xs font-semibold'
                        : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Toggle Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800/60">
              <label className="flex items-center justify-between py-2 px-1 cursor-pointer">
                <div>
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 block">Highlight Errors</span>
                  <span className="text-xs text-zinc-500">Tint mistyped letters</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.highlightErrors}
                  onChange={e => updateSettings({ highlightErrors: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between py-2 px-1 cursor-pointer">
                <div>
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 block">Virtual Keyboard</span>
                  <span className="text-xs text-zinc-500">Show ANSI keyboard guide</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.showVirtualKeyboard}
                  onChange={e => updateSettings({ showVirtualKeyboard: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between py-2 px-1 cursor-pointer">
                <div>
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 block">Focus Mode</span>
                  <span className="text-xs text-zinc-500">Hide stats and header during tests</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.focusMode}
                  onChange={e => updateSettings({ focusMode: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between py-2 px-1 cursor-pointer">
                <div>
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 block">Ghosting Pacer</span>
                  <span className="text-xs text-zinc-500">Pace your previous personal best</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.ghostingEnabled}
                  onChange={e => updateSettings({ ghostingEnabled: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between py-2 px-1 cursor-pointer">
                <div>
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 block">Reduced Motion</span>
                  <span className="text-xs text-zinc-500">Disable sliding animations</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.reducedMotion}
                  onChange={e => updateSettings({ reducedMotion: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Section 3: Audio & Sound Engine */}
        <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-800/60">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Acoustic Keystrokes
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => playKeySound()}
                disabled={!settings.soundEnabled || settings.sound === 'off'}
                className="flex items-center gap-1 text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 disabled:opacity-40 cursor-pointer"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Test Sound</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {/* Sound Profile Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2">
              <div>
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 block">Switch Profile</span>
                <span className="text-xs text-zinc-500">Synthetic Web Audio tactile release profile</span>
              </div>
              <div className="flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-850 rounded-xl overflow-x-auto">
                {soundOptions.map(s => {
                  const isSelected = settings.sound === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => {
                        updateSettings({ sound: s.id, soundEnabled: s.id !== 'off' });
                        if (s.id !== 'off') setTimeout(() => playKeySound(), 50);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-2xs font-semibold'
                          : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                      }`}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Error Sound & Volume */}
            {settings.soundEnabled && settings.sound !== 'off' && (
              <div className="flex items-center justify-between gap-4 py-2 border-t border-zinc-100 dark:border-zinc-800/60">
                <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Volume</span>
                <div className="flex items-center gap-3 w-48">
                  <input
                    type="range"
                    min="0.05"
                    max="0.8"
                    step="0.05"
                    value={settings.soundVolume}
                    onChange={e => updateSettings({ soundVolume: parseFloat(e.target.value) })}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <span className="text-xs font-mono text-zinc-400 tabular-nums w-8">
                    {Math.round(settings.soundVolume * 100)}%
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 4: Data Management & Backups */}
        <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-800/60">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-4">
            Data Storage
          </h2>

          <p className="text-xs text-zinc-500 mb-4 max-w-xl">
            All progress, personal bests, and test history are stored locally in your browser. No server accounts needed.
          </p>

          {importStatus && (
            <div className="p-2.5 mb-4 rounded-lg bg-blue-500/10 text-xs font-medium text-blue-600 dark:text-blue-400">
              {importStatus}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={exportBackup}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-zinc-900 dark:text-zinc-100 text-xs font-medium transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-zinc-900 dark:text-zinc-100 text-xs font-medium transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import JSON</span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />

            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg text-xs font-medium transition-colors cursor-pointer sm:ml-auto"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset Data</span>
            </button>
          </div>
        </div>

      </div>

      {/* Confirmation Modal for Reset */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-xl text-center">
            <div className="w-10 h-10 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              Reset All Progress?
            </h3>
            <p className="text-xs text-zinc-500 mt-1 mb-6">
              This will permanently delete all saved test records and academy progress from local browser storage.
            </p>

            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetAllData();
                  setShowResetConfirm(false);
                }}
                className="flex-1 py-2 rounded-lg text-xs font-medium text-white bg-rose-600 hover:bg-rose-500 transition-colors cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
