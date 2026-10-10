import React from 'react';
import { useApp, NavigationTab } from '../context/AppContext';
import { StreakCounter } from './StreakCounter';
import { 
  Volume2, 
  VolumeX, 
  HelpCircle, 
  Trophy,
  Keyboard,
  BookOpen,
  BarChart2,
  Sliders
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    settings, 
    updateSettings, 
    overallLevel,
    setIsShortcutsOpen,
    setIsStreakModalOpen
  } = useApp();

  const isSoundActive = settings.soundEnabled && settings.sound !== 'off';

  const toggleSound = () => {
    if (isSoundActive) {
      updateSettings({ soundEnabled: false });
    } else {
      updateSettings({ 
        soundEnabled: true, 
        sound: settings.sound === 'off' ? 'mechanical' : settings.sound 
      });
    }
  };

  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode }[] = [
    { id: 'practice', label: 'Practice', icon: <Keyboard className="w-4 h-4" /> },
    { id: 'learn', label: 'Learn', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'progress', label: 'Progress', icon: <BarChart2 className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Sliders className="w-4 h-4" /> }
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-zinc-950/85 border-b border-zinc-800/80 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Simple tipTap Logo with Keyboard Icon */}
        <button 
          onClick={() => setActiveTab('practice')}
          className="flex items-center gap-2.5 group text-left cursor-pointer focus:outline-none select-none"
          title="tipTap Home"
        >
          <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform duration-200 shrink-0">
            <Keyboard className="w-4.5 h-4.5 text-accent" />
          </div>
          <span className="text-base font-bold tracking-tight text-zinc-100 whitespace-nowrap font-brand">
            tipTap
          </span>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 p-1 bg-zinc-900/90 rounded-2xl border border-zinc-800/80 shadow-xs">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-zinc-800 text-white border border-zinc-700/80 shadow-xs font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850/60'
                }`}
              >
                <span className={isActive ? 'text-accent' : ''}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Quick Action & Profile Status */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Reusable Pill-Shaped StreakCounter */}
          <StreakCounter onClick={() => setIsStreakModalOpen(true)} />

          {/* Level badge */}
          <button
            onClick={() => setActiveTab('progress')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-300 hover:bg-zinc-850 transition-colors cursor-pointer"
            title={`Level ${overallLevel.level}: ${overallLevel.title}`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="tabular-nums font-semibold">Lv.{overallLevel.level}</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="w-9 h-9 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 flex items-center justify-center text-zinc-300 transition-colors cursor-pointer"
            title={isSoundActive ? 'Mute keystroke sounds' : 'Enable mechanical keystroke sounds'}
          >
            {!isSoundActive ? <VolumeX className="w-4 h-4 text-zinc-500" /> : <Volume2 className="w-4 h-4 text-accent" />}
          </button>

          {/* Shortcuts Help */}
          <button
            onClick={() => setIsShortcutsOpen(true)}
            className="w-9 h-9 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 flex items-center justify-center text-zinc-300 transition-colors cursor-pointer"
            title="Keyboard shortcuts (?)"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Tab Navigation Bar */}
      <div className="flex md:hidden border-t border-zinc-800/80 px-2 py-1 justify-around bg-zinc-950/95">
        {navItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 py-1 px-3 text-[11px] font-medium rounded-lg transition-colors cursor-pointer ${
                isActive
                  ? 'text-accent font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
