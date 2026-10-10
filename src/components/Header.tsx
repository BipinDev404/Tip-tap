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
    setIsStreakModalOpen,
    isTestActive
  } = useApp();

  const isSoundActive = settings.soundEnabled && settings.sound !== 'off';
  const isFocusModeActive = settings.focusMode && isTestActive && activeTab === 'practice';
  const isTypingActiveOnMobile = isTestActive && activeTab === 'practice';

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
      <div className="max-w-6xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3 sm:gap-6">
        
        {/* Zone 1: Simple tipTap Logo with Keyboard Icon */}
        <button 
          onClick={() => setActiveTab('practice')}
          className="flex items-center gap-2 group text-left cursor-pointer focus:outline-none select-none shrink-0"
          title="tipTap Home"
        >
          <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform duration-200 shrink-0">
            <Keyboard className="w-4 h-4 text-accent" />
          </div>
          <span className="text-sm sm:text-base font-bold tracking-tight text-zinc-100 whitespace-nowrap font-brand">
            tipTap
          </span>
        </button>

        {/* Zone 2: Desktop Navigation Links */}
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
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Reusable Pill-Shaped StreakCounter */}
          <StreakCounter compact onClick={() => setIsStreakModalOpen(true)} />

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
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 flex items-center justify-center text-zinc-300 transition-colors cursor-pointer"
            title={isSoundActive ? 'Mute keystroke sounds' : 'Enable mechanical keystroke sounds'}
          >
            {!isSoundActive ? <VolumeX className="w-4 h-4 text-zinc-500" /> : <Volume2 className="w-4 h-4 text-accent" />}
          </button>

          {/* Shortcuts Help */}
          <button
            onClick={() => setIsShortcutsOpen(true)}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 flex items-center justify-center text-zinc-300 transition-colors cursor-pointer"
            title="Keyboard shortcuts (?)"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar - Pinned to bottom on phones for optimal thumb reach */}
      <nav 
        aria-label="Mobile Navigation"
        className={`fixed bottom-0 inset-x-0 md:hidden z-40 bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-800/80 px-2 py-1 pb-[calc(env(safe-area-inset-bottom,0px)+4px)] flex items-center justify-around shadow-2xl transition-all duration-300 ease-in-out ${
          isFocusModeActive || isTypingActiveOnMobile ? 'opacity-0 translate-y-full pointer-events-none' : 'opacity-100 translate-y-0'
        }`}
      >
        {navItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center min-h-[48px] flex-1 py-1 px-1 text-[11px] font-medium rounded-2xl transition-all cursor-pointer touch-manipulation active:scale-95 ${
                isActive
                  ? 'text-accent font-semibold'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span className={`p-1.5 rounded-xl transition-all duration-200 ${isActive ? 'bg-accent/15 text-accent shadow-xs scale-105' : 'text-zinc-400'}`}>
                {item.icon}
              </span>
              <span className="leading-tight mt-0.5 text-[10px] tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
};
