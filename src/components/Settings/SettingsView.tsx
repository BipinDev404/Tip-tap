import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  AccentColor, 
  FontFamily, 
  FontSize, 
  CaretStyle, 
  SoundEffect 
} from '../../types';
import { 
  Download, 
  Upload, 
  Trash2, 
  Check, 
  AlertTriangle,
  Play,
  Volume2,
  VolumeX,
  Volume1,
  Type,
  Music,
  Sliders,
  Database,
  Radio
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

  const accentOptions: { id: AccentColor; name: string; hex: string; desc: string }[] = [
    { id: 'blue', name: 'Electric Blue', hex: '#60a5fa', desc: 'Apple Modern' },
    { id: 'emerald', name: 'Emerald', hex: '#34d399', desc: 'Mint Growth' },
    { id: 'orange', name: 'Cyber Amber', hex: '#fbbf24', desc: 'Warm Focus' },
    { id: 'purple', name: 'Royal Violet', hex: '#a78bfa', desc: 'Deep Flow' },
    { id: 'rose', name: 'Neon Rose', hex: '#fb7185', desc: 'Vibrant Precision' },
    { id: 'cyan', name: 'Cyber Cyan', hex: '#22d3ee', desc: 'High Contrast' },
    { id: 'graphite', name: 'Monochrome', hex: '#e4e4e7', desc: 'Pure Silver' }
  ];

  const fontOptions: { 
    id: FontFamily; 
    name: string; 
    tag: string; 
    sample: string;
    fontFamilyCss: string;
  }[] = [
    { 
      id: 'system', 
      name: 'SF Pro / System', 
      tag: 'Native UI', 
      sample: 'Sphinx of black quartz, judge my vow',
      fontFamilyCss: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif'
    },
    { 
      id: 'inter', 
      name: 'Inter Pro', 
      tag: 'Modern Sans', 
      sample: 'Sphinx of black quartz, judge my vow',
      fontFamilyCss: '"Inter", -apple-system, sans-serif'
    },
    { 
      id: 'mono', 
      name: 'JetBrains Mono', 
      tag: 'Developer Monospace', 
      sample: 'const speed = wpm >= 100 ? "fast" : "fluid";',
      fontFamilyCss: '"JetBrains Mono", monospace'
    },
    { 
      id: 'fira', 
      name: 'Fira Code', 
      tag: 'Code & Ligatures', 
      sample: 'fn practice() -> Result<Wpm, Error> { => }',
      fontFamilyCss: '"Fira Code", monospace'
    },
    { 
      id: 'dm', 
      name: 'DM Sans', 
      tag: 'Geometric Pro', 
      sample: 'Pack my box with five dozen liquor jugs',
      fontFamilyCss: '"DM Sans", sans-serif'
    },
    { 
      id: 'serif', 
      name: 'Newsreader', 
      tag: 'Editorial Serif', 
      sample: 'The quick brown fox jumps over the lazy dog.',
      fontFamilyCss: '"Newsreader", serif'
    }
  ];

  const caretOptions: { id: CaretStyle; label: string; desc: string }[] = [
    { id: 'bar', label: 'Bar', desc: 'Standard 2.5px vertical cursor' },
    { id: 'line', label: 'Line', desc: 'Ultra-thin 1.5px sleek hairline' },
    { id: 'block', label: 'Block', desc: 'Vim/terminal full letter block' },
    { id: 'underline', label: 'Underline', desc: 'Horizontal bottom underline' },
    { id: 'pulse', label: 'Pulse', desc: 'Glowing neon pulsing bar' }
  ];

  const soundOptions: { id: SoundEffect; label: string; desc: string }[] = [
    { id: 'mechanical', label: 'Mechanical', desc: 'Crisp tactile switch + plate bottom-out' },
    { id: 'thock', label: 'Deep Thock', desc: 'Lubed linear switch warm bass tone' },
    { id: 'clicky', label: 'Clicky Snap', desc: 'High-pitch blue switch tactile snap' },
    { id: 'typewriter', label: 'Typewriter', desc: 'Vintage iron hammer strike' },
    { id: 'soft', label: 'Soft Scissor', desc: 'Gentle Apple Magic Keyboard tap' },
    { id: 'bubble', label: 'Bubble Pop', desc: 'Poppy synthetic water droplet' },
    { id: 'off', label: 'Muted', desc: 'Silent typing without sound' }
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

  const handleVolumeChange = (newVol: number) => {
    updateSettings({ soundVolume: newVol });
    // Audition immediately at the new volume
    if (settings.sound !== 'off') {
      setTimeout(() => playKeySound(), 20);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 sm:py-10 px-4 sm:px-6 animate-in fade-in duration-200">
      
      {/* Title */}
      <div className="pb-6 mb-8 border-b border-zinc-800">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-100">
          Preferences
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Customize typing appearance, typeface, caret dynamics, tactile audio, and data.
        </p>
      </div>

      <div className="space-y-12">
        
        {/* Section 1: Accent Color */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-5 sm:p-7 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Radio className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-semibold tracking-wide text-zinc-200">
              Accent Color
            </h2>
          </div>
          <p className="text-xs text-zinc-400 mb-5">
            Active across carets, virtual keyboard key highlights, graphs, progress bars, and navigation.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
            {accentOptions.map(acc => {
              const isSelected = settings.accent === acc.id;
              return (
                <button
                  key={acc.id}
                  onClick={() => updateSettings({ accent: acc.id })}
                  className={`flex flex-col items-center gap-2 p-3 rounded-2xl border transition-all cursor-pointer text-center ${
                    isSelected
                      ? 'bg-zinc-850 border-zinc-700 shadow-md ring-1 ring-zinc-600'
                      : 'bg-zinc-900/90 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-850/50'
                  }`}
                >
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-transform shadow-xs"
                    style={{ 
                      backgroundColor: acc.hex,
                      boxShadow: isSelected ? `0 0 14px ${acc.hex}80` : undefined
                    }}
                  >
                    {isSelected && <Check className="w-4 h-4 text-zinc-950 font-bold" />}
                  </div>
                  <div className="w-full">
                    <span className="text-xs font-medium text-zinc-200 block truncate">
                      {acc.name}
                    </span>
                    <span className="text-[10px] text-zinc-500 block">
                      {acc.desc}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 2: Typeface / Typography */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-5 sm:p-7 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4 text-accent" />
              <h2 className="text-sm font-semibold tracking-wide text-zinc-200">
                Typeface & Typography
              </h2>
            </div>
            <span className="text-xs text-zinc-500">Live preview below</span>
          </div>
          <p className="text-xs text-zinc-400 mb-5">
            Choose the font family applied to the central typing test stage and drills.
          </p>

          {/* Typeface Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
            {fontOptions.map(font => {
              const isSelected = settings.fontFamily === font.id;
              return (
                <button
                  key={font.id}
                  onClick={() => updateSettings({ fontFamily: font.id })}
                  className={`flex flex-col p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-zinc-850 border-zinc-600 ring-1 ring-zinc-500 shadow-md'
                      : 'bg-zinc-900/90 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-850/60'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-zinc-100">
                        {font.name}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-zinc-800 text-zinc-400 border border-zinc-700/60">
                        {font.tag}
                      </span>
                    </div>
                    {isSelected && (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-accent">
                        <Check className="w-3.5 h-3.5" />
                        <span>Active</span>
                      </span>
                    )}
                  </div>
                  
                  {/* Sample Sentence in that exact font */}
                  <div 
                    className="mt-1 text-sm text-zinc-300 tracking-normal overflow-hidden text-ellipsis whitespace-nowrap opacity-90"
                    style={{ fontFamily: font.fontFamilyCss }}
                  >
                    {font.sample}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Font Size Row */}
          <div className="pt-4 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-medium text-zinc-300 block">Typing Stage Text Size</span>
              <span className="text-[11px] text-zinc-500">Scale of practice words on screen</span>
            </div>
            <div className="flex items-center gap-1.5 p-1 bg-zinc-950 border border-zinc-800 rounded-xl">
              {(['sm', 'md', 'lg', 'xl'] as FontSize[]).map(sz => (
                <button
                  key={sz}
                  onClick={() => updateSettings({ fontSize: sz })}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase transition-all cursor-pointer ${
                    settings.fontSize === sz
                      ? 'bg-zinc-800 text-white border border-zinc-700 shadow-xs'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Caret Cursor Style */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-5 sm:p-7 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-accent" />
              <h2 className="text-sm font-semibold tracking-wide text-zinc-200">
                Caret Cursor Style
              </h2>
            </div>
            <span className="text-xs text-zinc-500">Interactive live previews</span>
          </div>
          <p className="text-xs text-zinc-400 mb-5">
            Select the visual marker that indicates your current character position.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
            {caretOptions.map(c => {
              const isSelected = settings.caretStyle === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => updateSettings({ caretStyle: c.id })}
                  className={`flex flex-col items-center p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-zinc-850 border-zinc-600 ring-1 ring-zinc-500 shadow-md'
                      : 'bg-zinc-900/90 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-850/60'
                  }`}
                >
                  {/* Visual Caret Box Simulation */}
                  <div className="w-full h-14 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-center mb-2.5 relative select-none">
                    <div className="relative inline-flex items-center text-xl font-mono text-zinc-300">
                      {c.id === 'bar' && (
                        <>
                          <span className="w-[2.5px] h-6 bg-accent rounded-full animate-caret-blink mr-0.5 shadow-[0_0_8px_var(--accent-color)]" />
                          <span>k</span>
                        </>
                      )}
                      {c.id === 'line' && (
                        <>
                          <span className="w-[1.5px] h-6 bg-accent animate-caret-blink mr-0.5" />
                          <span>k</span>
                        </>
                      )}
                      {c.id === 'block' && (
                        <span className="relative px-1 bg-accent/80 text-zinc-950 font-bold rounded-xs animate-caret-pulse">
                          k
                        </span>
                      )}
                      {c.id === 'underline' && (
                        <div className="relative">
                          <span>k</span>
                          <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-accent rounded-full animate-caret-blink shadow-[0_0_8px_var(--accent-color)]" />
                        </div>
                      )}
                      {c.id === 'pulse' && (
                        <>
                          <span className="w-[3px] h-6 bg-accent rounded-full animate-caret-pulse mr-0.5 shadow-[0_0_12px_var(--accent-color)]" />
                          <span>k</span>
                        </>
                      )}
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-zinc-200 block">
                    {c.label}
                  </span>
                  <span className="text-[10px] text-zinc-500 block mt-0.5 leading-tight">
                    {c.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 4: Acoustic Keystrokes & Volume */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-5 sm:p-7 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Music className="w-4 h-4 text-accent" />
              <h2 className="text-sm font-semibold tracking-wide text-zinc-200">
                Acoustic Keystroke Synthesizer
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => playKeySound()}
                disabled={!settings.soundEnabled || settings.sound === 'off'}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-xs font-medium text-zinc-200 border border-zinc-700/80 transition-colors disabled:opacity-40 cursor-pointer"
              >
                <Play className="w-3 h-3 fill-current text-accent" />
                <span>Test Keystroke</span>
              </button>
              <button
                onClick={() => playErrorSound()}
                disabled={!settings.soundEnabled || !settings.errorSoundEnabled || settings.sound === 'off'}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-xs font-medium text-rose-300 border border-zinc-700/80 transition-colors disabled:opacity-40 cursor-pointer"
              >
                <span>Test Error</span>
              </button>
            </div>
          </div>
          <p className="text-xs text-zinc-400 mb-5">
            Procedural Web Audio synthesizer generating real-time low-latency keyboard clicks.
          </p>

          {/* Sound Profiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5 mb-6">
            {soundOptions.map(s => {
              const isSelected = settings.sound === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    updateSettings({ sound: s.id, soundEnabled: s.id !== 'off' });
                    if (s.id !== 'off') {
                      setTimeout(() => playKeySound(), 50);
                    }
                  }}
                  className={`flex flex-col items-center p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-zinc-850 border-zinc-600 ring-1 ring-zinc-500 shadow-md'
                      : 'bg-zinc-900/90 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-850/60'
                  }`}
                >
                  <span className="text-xs font-semibold text-zinc-200 block truncate w-full">
                    {s.label}
                  </span>
                  <span className="text-[10px] text-zinc-500 block mt-0.5 line-clamp-2">
                    {s.desc}
                  </span>
                  {isSelected && (
                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-accent" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Volume Slider Card */}
          <div className="pt-4 border-t border-zinc-800/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-950 border border-zinc-800/90">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
                  className="w-9 h-9 rounded-xl bg-zinc-800 hover:bg-zinc-750 border border-zinc-700/80 flex items-center justify-center text-zinc-300 transition-colors cursor-pointer"
                  title={settings.soundEnabled ? 'Mute' : 'Unmute'}
                >
                  {!settings.soundEnabled || settings.sound === 'off' ? (
                    <VolumeX className="w-4 h-4 text-zinc-500" />
                  ) : settings.soundVolume > 0.5 ? (
                    <Volume2 className="w-4 h-4 text-accent" />
                  ) : (
                    <Volume1 className="w-4 h-4 text-accent" />
                  )}
                </button>
                <div>
                  <span className="text-xs font-semibold text-zinc-200 block">Synthesizer Volume</span>
                  <span className="text-[11px] text-zinc-500">Live preview triggers while adjusting</span>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-64">
                <input
                  type="range"
                  min="0.05"
                  max="1.0"
                  step="0.05"
                  value={settings.soundVolume}
                  onChange={e => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-full accent-slider cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, var(--accent-color) 0%, var(--accent-color) ${Math.round(settings.soundVolume * 100)}%, #27272a ${Math.round(settings.soundVolume * 100)}%, #27272a 100%)`
                  }}
                />
                <span className="text-xs font-mono font-semibold text-zinc-200 tabular-nums w-10 text-right">
                  {Math.round(settings.soundVolume * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 5: Improved Custom Checkboxes & Toggles */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-5 sm:p-7 shadow-sm">
          <div className="mb-4">
            <h2 className="text-sm font-semibold tracking-wide text-zinc-200">
              Behavior & Practice Options
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Refined toggles for feedback, pacing, and distraction-free typing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {[
              {
                id: 'highlightErrors' as const,
                title: 'Highlight Errors',
                desc: 'Tint mistyped letters in red immediately',
                val: settings.highlightErrors
              },
              {
                id: 'showVirtualKeyboard' as const,
                title: 'Virtual Keyboard',
                desc: 'Display tactile ANSI keyboard guide',
                val: settings.showVirtualKeyboard
              },
              {
                id: 'errorSoundEnabled' as const,
                title: 'Mistake Tone Audio',
                desc: 'Play distinct low-frequency error buzz',
                val: settings.errorSoundEnabled
              },
              {
                id: 'focusMode' as const,
                title: 'Focus Mode',
                desc: 'Hide stats and header during active tests',
                val: settings.focusMode
              },
              {
                id: 'reducedMotion' as const,
                title: 'Reduced Motion',
                desc: 'Disable sliding lines and animations',
                val: settings.reducedMotion
              }
            ].map(item => (
              <div
                key={item.id}
                onClick={() => updateSettings({ [item.id]: !item.val })}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-950 border border-zinc-800/80 hover:border-zinc-700 transition-all cursor-pointer group"
              >
                <div>
                  <span className="text-xs font-semibold text-zinc-200 block group-hover:text-white transition-colors">
                    {item.title}
                  </span>
                  <span className="text-[11px] text-zinc-500 block mt-0.5">
                    {item.desc}
                  </span>
                </div>

                {/* Sleek Custom Switch */}
                <div
                  className={`w-11 h-6 rounded-full p-0.5 flex items-center transition-colors shrink-0 ${
                    item.val ? 'bg-accent' : 'bg-zinc-800'
                  }`}
                  style={item.val ? { boxShadow: '0 0 10px rgba(var(--accent-rgb), 0.4)' } : undefined}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                      item.val ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 6: Data Storage & Backups (Dark Grey Boxes) */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-5 sm:p-7 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-semibold tracking-wide text-zinc-200">
              Data Management & Backups
            </h2>
          </div>
          <p className="text-xs text-zinc-400 mb-5">
            All tests, personal records, and curriculum stars are preserved locally in browser storage.
          </p>

          {importStatus && (
            <div className="p-3 mb-4 rounded-xl bg-zinc-850 border border-zinc-700 text-xs font-medium text-accent">
              {importStatus}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={exportBackup}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-850 hover:bg-zinc-800 border border-zinc-750 hover:border-zinc-700 text-zinc-200 text-xs font-medium transition-all shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-accent" />
              <span>Export JSON Backup</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-850 hover:bg-zinc-800 border border-zinc-750 hover:border-zinc-700 text-zinc-200 text-xs font-medium transition-all shadow-xs cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-accent" />
              <span>Import JSON Backup</span>
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
              className="flex items-center gap-1.5 px-4 py-2.5 bg-rose-950/40 hover:bg-rose-950/70 border border-rose-900/60 hover:border-rose-800 text-rose-300 rounded-xl text-xs font-medium transition-all cursor-pointer sm:ml-auto"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset All Records</span>
            </button>
          </div>
        </div>

      </div>

      {/* Confirmation Modal for Reset (Pure Dark Box) */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl bg-zinc-900 border border-zinc-800 p-6 shadow-2xl text-center">
            <div className="w-11 h-11 rounded-2xl bg-rose-500/15 text-rose-400 flex items-center justify-center mx-auto mb-3 border border-rose-500/20">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-zinc-100">
              Reset All Progress?
            </h3>
            <p className="text-xs text-zinc-400 mt-1 mb-6">
              This will permanently delete all saved test records, personal bests, and academy progress.
            </p>

            <div className="flex items-center justify-center gap-2.5">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2.5 rounded-xl text-xs font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetAllData();
                  setShowResetConfirm(false);
                }}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 transition-colors cursor-pointer shadow-md"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
