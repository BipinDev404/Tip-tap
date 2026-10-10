import React, { useMemo, useEffect } from 'react';
import { 
  Flame, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Trophy, 
  Calendar as CalendarIcon, 
  Sparkles,
  ArrowRight,
  Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const StreakModal: React.FC = () => {
  const { 
    isStreakModalOpen, 
    setIsStreakModalOpen, 
    streakInfo, 
    results, 
    setActiveTab 
  } = useApp();

  // Close on Escape key
  useEffect(() => {
    if (!isStreakModalOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsStreakModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isStreakModalOpen, setIsStreakModalOpen]);

  // Aggregate dates where user completed at least 1 test
  const activeDatesMap = useMemo(() => {
    const map: Record<string, number> = {};
    results.forEach(r => {
      if (!r.timestamp) return;
      const d = new Date(r.timestamp);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      map[key] = (map[key] || 0) + 1;
    });
    return map;
  }, [results]);

  const totalActiveDays = useMemo(() => {
    return Object.keys(activeDatesMap).length;
  }, [activeDatesMap]);

  // Calendar info for current month
  const currentMonthData = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const monthName = now.toLocaleString('default', { month: 'long' });

    // Days in current month
    const totalDays = new Date(year, month + 1, 0).getDate();
    // First day of month (0 = Sun, 1 = Mon...)
    const firstDayIndex = new Date(year, month, 1).getDay();
    // Adjust to Monday-first (0 = Mon, 6 = Sun)
    const adjustedFirstDay = (firstDayIndex + 6) % 7;

    const days = [];
    // Padding before 1st
    for (let i = 0; i < adjustedFirstDay; i++) {
      days.push({ dayNumber: 0, isCurrentMonth: false, dateStr: '' });
    }
    // Days 1 to totalDays
    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({
        dayNumber: d,
        isCurrentMonth: true,
        dateStr,
        isToday: d === now.getDate(),
        count: activeDatesMap[dateStr] || 0
      });
    }

    return { year, monthName, days };
  }, [activeDatesMap]);

  if (!isStreakModalOpen) return null;

  const currentStreak = streakInfo.currentStreak;
  const longestStreak = streakInfo.longestStreak;
  const todayCount = streakInfo.todayCount;
  const dailyGoal = streakInfo.dailyGoal || 3;
  const isPracticedToday = todayCount > 0;
  const goalProgressPercent = Math.min(100, Math.round((todayCount / dailyGoal) * 100));

  const handleStartPractice = () => {
    setIsStreakModalOpen(false);
    setActiveTab('practice');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div 
        className="w-full max-w-lg rounded-3xl bg-zinc-950 border border-zinc-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden relative animate-in zoom-in-95 duration-200 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle radial fire glow in top background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-64 bg-radial from-amber-500/20 via-orange-500/5 to-transparent blur-2xl pointer-events-none -z-0" />

        {/* Close Button */}
        <button
          onClick={() => setIsStreakModalOpen(false)}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
          title="Close (Esc)"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 relative z-10 flex flex-col gap-5">
          
          {/* Header Lockup: Realistic Glowing Flame + Streak Number */}
          <div className="flex flex-col items-center text-center pt-2">
            
            {/* Animated Flame Badge */}
            <div className="relative mb-3 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-amber-500/25 blur-xl animate-pulse" />
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-b from-amber-500/20 via-orange-500/10 to-zinc-900 border border-amber-500/40 flex items-center justify-center shadow-[0_0_25px_rgba(245,158,11,0.3)]">
                <Flame className="w-12 h-12 text-amber-400 fill-amber-400 drop-shadow-[0_0_12px_rgba(245,158,11,0.6)] animate-bounce duration-1000" />
              </div>
            </div>

            {/* Streak Count & Title */}
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black font-brand tracking-tight text-white tabular-nums drop-shadow-sm">
                {currentStreak}
              </span>
              <span className="text-2xl sm:text-3xl font-black text-amber-400 font-brand uppercase tracking-wider">
                {currentStreak === 1 ? 'DAY' : 'DAYS'}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xs font-medium">
              {currentStreak > 0
                ? "You're on fire! Practice each day to keep your streak burning."
                : "Practice at least once a day to ignite your typing streak."}
            </p>
          </div>

          {/* Today's Streak Status Card */}
          <div className={`p-4 rounded-2xl border transition-all ${
            isPracticedToday 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isPracticedToday ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
                )}
                <div>
                  <div className="text-xs sm:text-sm font-bold text-white">
                    {isPracticedToday ? 'Streak Protected Today!' : 'Practice Needed Today'}
                  </div>
                  <div className="text-[11px] text-zinc-400">
                    {isPracticedToday 
                      ? `Completed ${todayCount} test${todayCount > 1 ? 's' : ''} today. Your streak is safe.`
                      : 'Complete 1 test before midnight to keep your streak alive.'}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-white tabular-nums">
                  {todayCount}/{dailyGoal}
                </span>
                <span className="block text-[10px] text-zinc-400 uppercase">Goal</span>
              </div>
            </div>

            {/* Daily Goal Progress Bar */}
            <div className="mt-3 w-full bg-zinc-900/90 rounded-full h-2 overflow-hidden border border-zinc-800">
              <div 
                className={`h-full transition-all duration-500 rounded-full ${
                  isPracticedToday 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                    : 'bg-gradient-to-r from-amber-500 to-orange-400'
                }`}
                style={{ width: `${goalProgressPercent}%` }}
              />
            </div>
          </div>

          {/* 7-Day Weekly Streak Strip */}
          <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
            <div className="flex items-center justify-between text-xs text-zinc-400 font-semibold mb-2.5 px-1">
              <span>Past 7 Days</span>
              <span className="text-[11px] text-zinc-500">
                {streakInfo.thisWeekDays.filter(d => d.isActive).length} active days
              </span>
            </div>

            <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
              {streakInfo.thisWeekDays.map((day, idx) => (
                <div 
                  key={idx}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl text-center border transition-all ${
                    day.isToday
                      ? 'bg-amber-500/15 border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                      : day.isActive
                      ? 'bg-zinc-900 border-amber-500/30'
                      : 'bg-zinc-900/40 border-zinc-800/60'
                  }`}
                >
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${
                    day.isToday ? 'text-amber-400' : 'text-zinc-500'
                  }`}>
                    {day.dayName}
                  </span>

                  <div className="my-1 flex items-center justify-center">
                    {day.isActive ? (
                      <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
                    ) : day.isToday ? (
                      <div className="w-2.5 h-2.5 rounded-full border border-dashed border-amber-400" />
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                    )}
                  </div>

                  <span className={`text-[10px] font-mono tabular-nums ${
                    day.isToday ? 'text-white font-bold' : 'text-zinc-400'
                  }`}>
                    {day.dateStr.split('-')[2]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Activity Heatmap (Realistic Calendar View) */}
          <div className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
            <div className="flex items-center justify-between text-xs text-zinc-400 font-semibold mb-2 px-1">
              <span className="flex items-center gap-1.5 text-zinc-300">
                <CalendarIcon className="w-3.5 h-3.5 text-amber-400" />
                {currentMonthData.monthName} {currentMonthData.year}
              </span>
              <span className="text-[11px] text-zinc-500 tabular-nums">
                {currentMonthData.days.filter(d => d.count > 0).length} days practiced
              </span>
            </div>

            {/* Day of Week Headers */}
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-zinc-500 mb-1">
              <span>M</span>
              <span>T</span>
              <span>W</span>
              <span>T</span>
              <span>F</span>
              <span>S</span>
              <span>S</span>
            </div>

            {/* Month Days Grid */}
            <div className="grid grid-cols-7 gap-1">
              {currentMonthData.days.map((d, i) => {
                if (!d.isCurrentMonth) {
                  return <div key={i} className="h-6" />;
                }
                const hasPractice = d.count > 0;
                return (
                  <div
                    key={i}
                    title={`${d.dateStr}: ${d.count} test${d.count !== 1 ? 's' : ''}`}
                    className={`h-6 rounded-md flex items-center justify-center text-[10px] font-mono tabular-nums transition-all ${
                      d.isToday && hasPractice
                        ? 'bg-amber-500 text-zinc-950 font-black shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                        : d.isToday
                        ? 'border border-amber-400 text-amber-300 font-bold bg-amber-500/10'
                        : hasPractice
                        ? 'bg-amber-500/25 text-amber-300 font-semibold border border-amber-500/30'
                        : 'text-zinc-600 hover:text-zinc-400 bg-zinc-900/30'
                    }`}
                  >
                    {d.dayNumber}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Key Stats: 3-Pill Grid */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/80 text-center">
              <div className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
                Current
              </div>
              <div className="text-xl font-black text-amber-400 tabular-nums mt-0.5">
                {currentStreak}d
              </div>
            </div>

            <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/80 text-center">
              <div className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
                Best
              </div>
              <div className="text-xl font-black text-white tabular-nums mt-0.5">
                {longestStreak}d
              </div>
            </div>

            <div className="p-3 rounded-xl bg-zinc-900/50 border border-zinc-800/80 text-center">
              <div className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
                Total Days
              </div>
              <div className="text-xl font-black text-zinc-300 tabular-nums mt-0.5">
                {totalActiveDays}
              </div>
            </div>
          </div>

          {/* Streak Shield Motivation Tip */}
          <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-zinc-900/40 border border-zinc-800/60 text-xs text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong className="text-zinc-300 font-semibold">Streak Shield Active:</strong> Tests completed between 00:00 and 23:59 count toward your daily streak.
            </span>
          </div>

          {/* Action Footer */}
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={handleStartPractice}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-bold text-sm shadow-[0_0_20px_rgba(245,158,11,0.25)] flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Practice Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsStreakModalOpen(false)}
              className="py-3 px-5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white font-medium text-sm transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
