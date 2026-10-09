import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Command } from 'lucide-react';

export const ShortcutsModal: React.FC = () => {
  const { isShortcutsOpen, setIsShortcutsOpen } = useApp();

  if (!isShortcutsOpen) return null;

  const shortcuts = [
    { key: 'Tab + Enter', desc: 'Restart current typing test' },
    { key: 'Esc', desc: 'Exit dialog or return to practice' },
    { key: '?', desc: 'Toggle keyboard shortcuts guide' },
    { key: 'Alt + 1 / 2 / 3', desc: 'Quick switch test duration / word count' },
    { key: 'Alt + P', desc: 'Toggle punctuation mode' },
    { key: 'Alt + N', desc: 'Toggle numbers mode' },
    { key: 'Alt + K', desc: 'Toggle virtual keyboard visibility' },
    { key: 'Alt + M', desc: 'Toggle keystroke sound effects' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md rounded-3xl bg-zinc-900 border border-zinc-800 p-6 shadow-2xl transition-all"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-zinc-800 border border-zinc-700/80 flex items-center justify-center text-accent">
              <Command className="w-4 h-4" />
            </div>
            <h2 className="text-base font-semibold text-zinc-100">
              Keyboard Shortcuts
            </h2>
          </div>
          <button
            onClick={() => setIsShortcutsOpen(false)}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-4 space-y-2">
          {shortcuts.map((sc, i) => (
            <div key={i} className="flex items-center justify-between text-xs py-2 px-1 border-b border-zinc-800/50 last:border-0">
              <span className="text-zinc-300">{sc.desc}</span>
              <kbd className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 font-mono text-[11px] text-zinc-200 font-semibold shadow-xs">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-3 border-t border-zinc-800 text-center">
          <p className="text-[11px] text-zinc-500">
            Tip: You can start typing anytime in the Practice area without clicking.
          </p>
        </div>
      </div>
    </div>
  );
};
