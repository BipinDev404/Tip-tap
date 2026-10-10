/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { PracticeView } from './components/Practice/PracticeView';
import { LearnView } from './components/Learn/LearnView';
import { ProgressView } from './components/Progress/ProgressView';
import { SettingsView } from './components/Settings/SettingsView';
import { ShortcutsModal } from './components/ShortcutsModal';
import { StreakModal } from './components/StreakModal';
import { SEOHead } from './components/SEOHead';
import { SEOModal } from './components/SEOModal';
import { Sparkles } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, setIsShortcutsOpen, settings, isTestActive } = useApp();
  const [isSEOModalOpen, setIsSEOModalOpen] = useState(false);

  const isFocusModeActive = settings.focusMode && isTestActive && activeTab === 'practice';

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-blue-500/20 selection:text-blue-600 dark:selection:text-blue-400 font-sans transition-colors duration-200">
      {/* Dynamic SEO Head Manager */}
      <SEOHead />

      {/* Top Navigation - Smoothly hides in Focus Mode during active typing */}
      <div className={`transition-all duration-300 ease-in-out ${isFocusModeActive ? 'opacity-0 -translate-y-full pointer-events-none max-h-0 overflow-hidden' : 'opacity-100 translate-y-0 max-h-24'}`}>
        <Header />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col pb-20 md:pb-6">
        {activeTab === 'practice' && <PracticeView />}
        {activeTab === 'learn' && <LearnView />}
        {activeTab === 'progress' && <ProgressView />}
        {activeTab === 'settings' && <SettingsView />}
      </main>

      {/* Shortcuts Modal */}
      <ShortcutsModal />

      {/* Realistic Daily Streak Modal */}
      <StreakModal />

      {/* SEO & AI Models Indexing Hub Modal */}
      <SEOModal isOpen={isSEOModalOpen} onClose={() => setIsSEOModalOpen(false)} />

      {/* Minimalist Apple-inspired Footer - Smoothly hides in Focus Mode during active typing */}
      <footer className={`w-full py-6 px-4 border-t border-zinc-200/60 dark:border-zinc-800/60 mt-auto text-center text-xs text-zinc-500 dark:text-zinc-500 mb-16 md:mb-0 transition-all duration-300 ease-in-out ${isFocusModeActive ? 'opacity-0 translate-y-full pointer-events-none max-h-0 py-0 overflow-hidden border-transparent' : 'opacity-100 translate-y-0'}`}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-700 dark:text-zinc-300 font-brand">tipTap</span>
            <span>·</span>
            <span>Distraction-free typing excellence</span>
          </div>

          <div className="flex items-center flex-wrap justify-center gap-4 text-xs">
            <button
              onClick={() => setIsSEOModalOpen(true)}
              className="flex items-center gap-1.5 text-zinc-400 hover:text-blue-400 dark:hover:text-blue-400 transition-colors cursor-pointer group"
              title="Inspect Search Engine & AI Model Indexing Details"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-500/70 group-hover:text-blue-400 transition-colors" />
              <span>SEO &amp; AI Indexing</span>
            </button>
            <span>·</span>
            <button
              onClick={() => setIsShortcutsOpen(true)}
              className="hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors cursor-pointer"
            >
              Shortcuts
            </button>
            <span>·</span>
            <span>Privacy-first local storage</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
