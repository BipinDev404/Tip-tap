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
  Volume2, 
  VolumeX, 
  Sliders, 
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

  const fontOptions: { id: FontFamily; label: string; preview: string }[] = [
    { id: 'system', label: 'SF Pro / Apple System', preview: 'The quick brown fox' },
    { id: 'dm', label: 'DM Sans (Geometric)', preview: 'The quick brown fox' },
    { id: 'mono', label: 'JetBrains Mono (Monospace)', preview: 'The quick brown fox' },
    { id: 'serif', label: 'Newsreader (Classic Serif)', preview: 'The quick brown fox' }
  ];

  const caretOptions: { id: CaretStyle; label: string }[] = [
    { id: 'bar', label: 'Smooth Bar' },
    { id: 'line', label: 'Thin Line' },
    { id: 'block', label: 'Solid Block' },
    { id: 'underline', label: 'Underline' },
    { id: 'pulse', label: 'Soft Pulse' }
  ];

  const soundOptions: { id: SoundEffect; label: string; desc: string }[] = [
    { id: 'mechanical', label: 'Mechanical Switch', desc: 'Tactile leaf release & crisp bottom-out click' },
    { id: 'thock', label: 'Deep Thock', desc: 'Warm, lubed custom mechanical resonance' },
    { id: 'clicky', label: 'Clicky Snap', desc: 'Sharp high-frequency blue-switch snap' },
    { id: 'soft', label: 'Soft Dome', desc: 'Quiet, dampened Apple-style chiclet tap' },
    { id: 'bubble', label: 'Soft Bubble', desc: 'Playful fluid acoustic pop' },
    { id: 'off', label: 'Silent', desc: 'No keystroke sounds' }
  ];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const success = await importBackup(file);
    if (success) {
      setImportStatus('Backup restored successfully!');
      setTimeout(() => setImportStatus(''), 3000);
    } else {
      setImportStatus('Error importing JSON. Please check file format.');
      setTimeout(() => setImportStatus(''), 4000);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-6 sm:py-8 px-4 animate-in fade-in duration-200">
      
      {/* Title */}
      <div className="pb-6 border-b border-zinc-200/80 dark:border-zinc-800/80 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Preferences & Settings
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 mt-1">
          Customize your workspace aesthetics, typography, keystroke feedback, and local data.
        </p>
      </div>

      <div className="space-y-8">
        
        {/* Appearance & Color */}
        <section className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
            Appearance & Theme
          </h2>
          <p className="text-xs text-zinc-400 mb-6">
            Choose light, dark, or system appearance with customized accent colors.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Theme Selector */}
            <div>
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 block mb-2">
                Interface Mode
              </label>
              <div className="flex items-center gap-2 p-1 bg-zinc-100 dark:bg-zinc-800/80 rounded-2xl border border-zinc-200/60 dark:border-zinc-700/60">
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
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium capitalize transition-all cursor-pointer ${
                        isActive
                          ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-xs'
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
            <div>
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 block mb-2">
                Accent Highlight
              </label>
              <div className="flex items-center gap-2.5">
                {accentOptions.map(acc => {
                  const isSelected = settings.accent === acc.id;
                  return (
                    <button
                      key={acc.id}
                      onClick={() => updateSettings({ accent: acc.id })}
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xs ${
                        isSelected ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-zinc-900 ring-zinc-900 dark:ring-white scale-110' : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: acc.color }}
                      title={acc.name}
                    >
                      {isSelected && <Check className="w-4 h-4 text-white" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Typography & Caret */}
        <section className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
            Typography & Typing Feel
          </h2>
          <p className="text-xs text-zinc-400 mb-6">
            Fine-tune typeface, text size, and caret cursor rendering.
          </p>

          <div className="space-y-6">
            {/* Font Family */}
            <div>
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 block mb-2">
                Font Family
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {fontOptions.map(font => {
                  const isSelected = settings.fontFamily === font.id;
                  return (
                    <button
                      key={font.id}
                      onClick={() => updateSettings({ fontFamily: font.id })}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50/20 dark:bg-blue-950/20 shadow-xs'
                          : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                      }`}
                    >
                      <span className="text-xs font-semibold block text-zinc-900 dark:text-zinc-100">
                        {font.label}
                      </span>
                      <span className="text-xs text-zinc-400 mt-1 block">
                        {font.preview}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Font Size & Caret Style */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <div>
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 block mb-2">
                  Typing Text Size
                </label>
                <div className="flex items-center gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-800/80 rounded-2xl border border-zinc-200/60 dark:border-zinc-700/60">
                  {(['sm', 'md', 'lg', 'xl'] as FontSize[]).map(sz => (
                    <button
                      key={sz}
                      onClick={() => updateSettings({ fontSize: sz })}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-medium uppercase transition-all cursor-pointer ${
                        settings.fontSize === sz
                          ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-xs font-semibold'
                          : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 block mb-2">
                  Caret Cursor Style
                </label>
                <div className="flex items-center gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-800/80 rounded-2xl border border-zinc-200/60 dark:border-zinc-700/60 overflow-x-auto">
                  {caretOptions.map(c => (
                    <button
                      key={c.id}
                      onClick={() => updateSettings({ caretStyle: c.id })}
                      className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                        settings.caretStyle === c.id
                          ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-xs font-semibold'
                          : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Additional Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
              <label className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 cursor-pointer">
                <div>
                  <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100 block">Highlight Errors</span>
                  <span className="text-[11px] text-zinc-400">Tint mistyped characters in red</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.highlightErrors}
                  onChange={e => updateSettings({ highlightErrors: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 cursor-pointer">
                <div>
                  <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100 block">Virtual Keyboard</span>
                  <span className="text-[11px] text-zinc-400">Show QWERTY keyboard guide</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.showVirtualKeyboard}
                  onChange={e => updateSettings({ showVirtualKeyboard: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 cursor-pointer">
                <div>
                  <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100 block">Focus Mode</span>
                  <span className="text-[11px] text-zinc-400">Hide header, footer, & stats during tests for total immersion</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.focusMode}
                  onChange={e => updateSettings({ focusMode: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 cursor-pointer">
                <div>
                  <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100 block">Ghosting Pacer</span>
                  <span className="text-[11px] text-zinc-400">Translucent text layer pacing your previous best performance</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.ghostingEnabled}
                  onChange={e => updateSettings({ ghostingEnabled: e.target.checked })}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                />
              </label>
            </div>
          </div>
        </section>

        {/* Audio & Keystroke Haptics */}
        <section className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-blue-500" />
                <span>Mechanical Sound Effect Engine</span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Low-latency tactile acoustic synthesis via Web Audio API. Zero external audio files.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => playKeySound()}
                disabled={!settings.soundEnabled || settings.sound === 'off'}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
                title="Preview current correct keystroke sound"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Preview Click</span>
              </button>

              <button
                onClick={() => playErrorSound()}
                disabled={!settings.soundEnabled || !settings.errorSoundEnabled}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium text-rose-600 dark:text-rose-400 transition-colors cursor-pointer border border-rose-200/60 dark:border-rose-800/40"
                title="Preview error keystroke audio"
              >
                <AlertTriangle className="w-3 h-3 text-rose-500" />
                <span>Preview Error</span>
              </button>
            </div>
          </div>

          {/* Sound Master Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 cursor-pointer">
              <div>
                <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 block">
                  Mechanical Keystroke Sounds
                </span>
                <span className="text-[11px] text-zinc-400">
                  Play acoustic click on each correct keystroke
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={e => updateSettings({ soundEnabled: e.target.checked })}
                className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 cursor-pointer">
              <div>
                <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 block">
                  Distinct Error Feedback
                </span>
                <span className="text-[11px] text-zinc-400">
                  Play distinct dampened audio tone on mistyped keys
                </span>
              </div>
              <input
                type="checkbox"
                checked={settings.errorSoundEnabled}
                onChange={e => updateSettings({ errorSoundEnabled: e.target.checked })}
                className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
              />
            </label>
          </div>

          {/* Switch Sound Profiles */}
          <div className="mb-6">
            <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 block mb-2">
              Keyboard Switch Sound Profile
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {soundOptions.map(snd => {
                const isSelected = settings.sound === snd.id;
                return (
                  <button
                    key={snd.id}
                    onClick={() => {
                      updateSettings({ sound: snd.id, soundEnabled: snd.id !== 'off' });
                      if (snd.id !== 'off') setTimeout(() => playKeySound(), 50);
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/20 dark:bg-blue-950/20 shadow-xs'
                        : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                        {snd.label}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-blue-500" />}
                    </div>
                    <span className="text-[11px] text-zinc-400 block mt-1 leading-snug">
                      {snd.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Volume Slider */}
          {settings.soundEnabled && settings.sound !== 'off' && (
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-4">
              <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Click Volume</span>
              <input
                type="range"
                min="0.05"
                max="0.8"
                step="0.05"
                value={settings.soundVolume}
                onChange={e => updateSettings({ soundVolume: parseFloat(e.target.value) })}
                className="flex-1 accent-blue-600 cursor-pointer"
              />
              <span className="text-xs font-mono text-zinc-400 tabular-nums">
                {Math.round(settings.soundVolume * 100)}%
              </span>
            </div>
          )}
        </section>

        {/* Data Persistence, Backup & Reset */}
        <section className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
            Data Storage & Backup
          </h2>
          <p className="text-xs text-zinc-400 mb-4">
            Tip tap saves all your progress locally in your browser. No account or API keys required. Clearing your browser cache or cookies can remove stored data, so we recommend exporting regular backups.
          </p>

          {importStatus && (
            <div className="p-3 mb-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs font-medium text-blue-600 dark:text-blue-400">
              {importStatus}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={exportBackup}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-zinc-900 dark:text-zinc-100 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Progress (JSON)</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-zinc-900 dark:text-zinc-100 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import Progress (JSON)</span>
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
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-semibold transition-colors cursor-pointer ml-auto"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset All Progress</span>
            </button>
          </div>
        </section>

      </div>

      {/* Confirmation Modal for Reset */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Reset All Progress?
            </h3>
            <p className="text-xs text-zinc-500 mt-1 mb-6">
              This will permanently delete all completed tests, personal best records, and academy milestones from your local storage.
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2 rounded-xl text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetAllData();
                  setShowResetConfirm(false);
                }}
                className="flex-1 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 transition-colors cursor-pointer shadow-sm"
              >
                Yes, Reset
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
