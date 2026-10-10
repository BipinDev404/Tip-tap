import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { 
  Trophy, 
  TrendingUp, 
  Sparkles,
  Activity,
  Flame,
  Zap,
  CheckCircle2,
  Target
} from 'lucide-react';

export const ProgressView: React.FC = () => {
  const { 
    results, 
    lessonProgress, 
    overallLevel, 
    personalBestWpm, 
    weakKeysCounter,
    streakInfo,
    setIsStreakModalOpen,
    setPracticeTargetWords,
    setActiveTab
  } = useApp();

  // Metrics calculation from genuine user history
  const stats = useMemo(() => {
    if (results.length === 0) {
      return {
        totalTimeMinutes: 0,
        totalWords: 0,
        avgWpm: 0,
        avgAccuracy: 0,
        testsCount: 0,
        completedLessons: Object.values(lessonProgress).filter(p => p.completed).length
      };
    }

    const totalSeconds = results.reduce((acc, r) => acc + r.durationSeconds, 0);
    const totalWords = Math.round(results.reduce((acc, r) => acc + (r.characters.correct / 5), 0));
    const avgWpm = Math.round(results.reduce((acc, r) => acc + r.wpm, 0) / results.length);
    const avgAccuracy = Math.round(results.reduce((acc, r) => acc + r.accuracy, 0) / results.length);
    const completedLessons = Object.values(lessonProgress).filter(p => p.completed).length;

    return {
      totalTimeMinutes: Math.round(totalSeconds / 60),
      totalWords,
      avgWpm,
      avgAccuracy,
      testsCount: results.length,
      completedLessons
    };
  }, [results, lessonProgress]);

  // Weak keys ranking
  const weakKeysRanked = useMemo(() => {
    const entries = Object.entries(weakKeysCounter)
      .filter(([k]) => k.length === 1 && k !== ' ')
      .sort((a, b) => b[1] - a[1]);
    return entries.slice(0, 5);
  }, [weakKeysCounter]);

  // WPM Progression Data for last 10 sessions (chronological order)
  const last10Results = useMemo(() => {
    return results.slice(0, 10).reverse();
  }, [results]);

  const last10ChartData = useMemo(() => {
    return last10Results.map((r, index) => ({
      session: `#${index + 1}`,
      wpm: r.wpm,
      rawWpm: r.rawWpm,
      accuracy: r.accuracy,
      mode: `${r.mode} (${r.modeValue})`,
      date: new Date(r.timestamp).toLocaleDateString([], {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }));
  }, [last10Results]);

  const handlePracticeWeakKeys = () => {
    if (weakKeysRanked.length === 0) return;
    const keys = weakKeysRanked.map(([k]) => k);
    const drills = keys.map(k => `${k}${k} ${k}e ${k}a ${k}t ${k}r`).join(' ');
    setPracticeTargetWords(drills);
    setActiveTab('practice');
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 sm:py-10 px-4 sm:px-6 animate-in fade-in duration-200">
      
      {/* Clean Header with Level Status */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 mb-8 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-400 mb-1.5">
            <Activity className="w-3.5 h-3.5 text-accent" />
            <span>Progress Analytics</span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span>{stats.testsCount} tests recorded</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-100">
            Performance Overview
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Genuine metrics calculated from your typing sessions.
          </p>
        </div>

        {/* Quiet Level Indicator */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-zinc-800 border border-zinc-750 text-amber-400 flex items-center justify-center shrink-0">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-200">
              <span>Level {overallLevel.level}</span>
              <span className="text-zinc-500">·</span>
              <span className="text-zinc-400">{overallLevel.title}</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-24 h-1.5 bg-zinc-800 rounded-full overflow-hidden border border-zinc-700/60">
                <div 
                  className="h-full bg-accent rounded-full transition-all duration-300"
                  style={{ width: `${overallLevel.progress}%` }}
                />
              </div>
              <span className="text-[10px] text-zinc-400 font-mono tabular-nums">{overallLevel.progress}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary KPI Strip - Clean Typographic Alignment */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 py-4 mb-10 border-b border-zinc-800">
        <div>
          <span className="text-xs text-zinc-500 block">Personal Best</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-accent tabular-nums mt-0.5">
            {personalBestWpm}
          </div>
          <span className="text-[11px] text-zinc-500">WPM peak</span>
        </div>

        <div>
          <span className="text-xs text-zinc-500 block">Average Speed</span>
          <div className="text-2xl sm:text-3xl font-semibold text-zinc-100 tabular-nums mt-0.5">
            {stats.avgWpm}
          </div>
          <span className="text-[11px] text-zinc-500">Net WPM</span>
        </div>

        <div>
          <span className="text-xs text-zinc-500 block">Accuracy</span>
          <div className="text-2xl sm:text-3xl font-semibold text-emerald-400 tabular-nums mt-0.5">
            {stats.avgAccuracy}%
          </div>
          <span className="text-[11px] text-zinc-500">Precision rate</span>
        </div>

        <div>
          <span className="text-xs text-zinc-500 block">Tests Done</span>
          <div className="text-2xl sm:text-3xl font-semibold text-zinc-100 tabular-nums mt-0.5">
            {stats.testsCount}
          </div>
          <span className="text-[11px] text-zinc-500">Completed tests</span>
        </div>

        <div>
          <span className="text-xs text-zinc-500 block">Words Typed</span>
          <div className="text-2xl sm:text-3xl font-semibold text-zinc-100 tabular-nums mt-0.5">
            {stats.totalWords}
          </div>
          <span className="text-[11px] text-zinc-500">Total volume</span>
        </div>

        <div>
          <span className="text-xs text-zinc-500 block">Time Spent</span>
          <div className="text-2xl sm:text-3xl font-semibold text-zinc-100 tabular-nums mt-0.5">
            {stats.totalTimeMinutes}m
          </div>
          <span className="text-[11px] text-zinc-500">Active time</span>
        </div>
      </div>

      {/* Speed Chart & Weak Keys */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        
        {/* WPM Trend Chart */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-semibold text-zinc-100 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-accent" />
                <span>Speed Progression</span>
              </h2>
              <span className="text-xs text-zinc-400">Last 10 sessions history</span>
            </div>

            {last10ChartData.length > 0 && (
              <div className="flex items-center gap-3 text-xs text-zinc-400">
                <span className="flex items-center gap-1.5 text-accent font-medium">
                  <span className="w-2 h-2 rounded-full bg-accent" />
                  Net WPM
                </span>
                <span className="flex items-center gap-1.5 text-zinc-500">
                  <span className="w-2 h-2 rounded-full bg-zinc-600" />
                  Raw
                </span>
              </div>
            )}
          </div>

          <div className="h-48 sm:h-56 w-full pt-2">
            {last10ChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={last10ChartData} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-zinc-800/80" vertical={false} />
                  <XAxis 
                    dataKey="session" 
                    stroke="currentColor" 
                    className="text-[11px] text-zinc-500" 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="currentColor" 
                    className="text-[11px] text-zinc-500 tabular-nums" 
                    tickLine={false} 
                    axisLine={false} 
                    domain={[0, 'auto']}
                  />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length > 0) {
                        const data = payload[0].payload as {
                          session: string;
                          wpm: number;
                          rawWpm: number;
                          accuracy: number;
                          mode: string;
                          date: string;
                        };
                        return (
                          <div className="p-2.5 rounded-xl bg-zinc-900 text-white shadow-xl text-xs backdrop-blur-md border border-zinc-700">
                            <div className="font-semibold text-zinc-300 mb-1">{data.date} · {data.mode}</div>
                            <div className="flex items-center gap-3 tabular-nums">
                              <span className="text-accent font-bold">{data.wpm} WPM</span>
                              <span className="text-emerald-400">{data.accuracy}%</span>
                              <span className="text-zinc-400">Raw {data.rawWpm}</span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="wpm" 
                    stroke="var(--accent-color)" 
                    strokeWidth={2.5} 
                    dot={{ r: 3.5, fill: 'var(--accent-color)' }} 
                    activeDot={{ r: 5 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="rawWpm" 
                    stroke="#71717a" 
                    strokeWidth={1.5} 
                    strokeDasharray="4 4" 
                    dot={false} 
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-zinc-500 border border-dashed border-zinc-800 rounded-2xl bg-zinc-950/40">
                Complete a test to view your speed chart
              </div>
            )}
          </div>
        </div>

        {/* Weak Keys Insights */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-semibold text-zinc-100">
                Key Accuracy
              </h2>
              <span className="text-xs text-zinc-400">Most missed keys</span>
            </div>

            {weakKeysRanked.length > 0 && (
              <button
                onClick={handlePracticeWeakKeys}
                className="text-xs font-semibold text-accent hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3" />
                Practice Drill
              </button>
            )}
          </div>

          {weakKeysRanked.length > 0 ? (
            <div className="space-y-2 pt-1">
              {weakKeysRanked.map(([keyChar, count]) => {
                const maxErr = weakKeysRanked[0][1];
                const widthPercent = Math.max(16, Math.round((count / maxErr) * 100));

                return (
                  <div key={keyChar} className="flex items-center gap-2.5 text-xs py-1">
                    <kbd className="w-6 h-6 rounded-md bg-zinc-850 border border-zinc-750 flex items-center justify-center font-mono font-semibold text-zinc-200 uppercase text-[11px]">
                      {keyChar}
                    </kbd>
                    <div className="flex-1 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full"
                        style={{ width: `${widthPercent}%` }}
                      />
                    </div>
                    <span className="text-[11px] font-mono text-zinc-400 tabular-nums w-12 text-right">
                      {count} err
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-zinc-500 border border-dashed border-zinc-800 rounded-2xl bg-zinc-950/40">
              No mistyped keys detected yet
            </div>
          )}
        </div>
      </div>

      {/* DAILY PRACTICE STREAK & GOAL CARD */}
      <div className="mb-10 p-6 rounded-3xl bg-zinc-900/80 border border-zinc-800 shadow-xl backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* Left: Flame Counter & Record */}
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-2xl border flex items-center justify-center shrink-0 ${
              streakInfo.currentStreak > 0
                ? 'bg-amber-500/15 border-amber-500/30 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.25)]'
                : 'bg-zinc-800/80 border-zinc-700 text-zinc-500'
            }`}>
              <Flame className={`w-8 h-8 ${streakInfo.currentStreak > 0 ? 'fill-amber-400 animate-pulse' : ''}`} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl sm:text-3xl font-black text-zinc-100 tabular-nums">
                  {streakInfo.currentStreak} {streakInfo.currentStreak === 1 ? 'Day' : 'Days'} Streak
                </h2>
                {streakInfo.isGoalAchieved && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3" />
                    Goal Achieved
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 text-xs text-zinc-400 mt-1 flex-wrap">
                <span className="flex items-center gap-1 font-semibold text-zinc-300">
                  <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  Longest: {streakInfo.longestStreak} {streakInfo.longestStreak === 1 ? 'day' : 'days'}
                </span>
                <span className="text-zinc-600">·</span>
                <span className="flex items-center gap-1">
                  <Target className="w-3.5 h-3.5 text-accent" />
                  Daily Goal: {streakInfo.todayCount}/{streakInfo.dailyGoal} tests today
                </span>
                <span className="text-zinc-600">·</span>
                <button
                  type="button"
                  onClick={() => setIsStreakModalOpen(true)}
                  className="font-semibold text-amber-400 hover:text-amber-300 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Flame className="w-3.5 h-3.5 fill-amber-400" />
                  <span>Streak Calendar</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right: 7-Day Weekly Streak Strip */}
          <div className="flex flex-col gap-1.5 pt-4 lg:pt-0 border-t lg:border-t-0 border-zinc-800">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              This Week's Activity
            </span>
            <div className="flex items-center gap-2">
              {streakInfo.thisWeekDays.map((day) => (
                <div 
                  key={day.dateStr}
                  className={`flex flex-col items-center justify-center w-10 sm:w-11 h-12 rounded-2xl border text-center transition-all ${
                    day.isActive
                      ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 shadow-sm'
                      : day.isToday
                        ? 'bg-zinc-800 border-zinc-600 text-zinc-200 ring-1 ring-zinc-500'
                        : 'bg-zinc-950 border-zinc-850 text-zinc-600'
                  }`}
                  title={`${day.dayName} (${day.dateStr}): ${day.isActive ? 'Practiced' : 'No practice'}`}
                >
                  <span className="text-[10px] font-mono font-bold uppercase">
                    {day.dayName}
                  </span>
                  <div className="mt-1">
                    {day.isActive ? (
                      <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    ) : (
                      <span className="text-[10px] text-zinc-600 font-mono">·</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Recent Sessions List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-zinc-100">
            Recent Tests
          </h2>
          <span className="text-xs text-zinc-400">
            Latest {Math.min(10, results.length)} tests
          </span>
        </div>

        {results.length > 0 ? (
          <div className="divide-y divide-zinc-800/80 border-y border-zinc-800/80 text-xs">
            {results.slice(0, 8).map((r) => (
              <div key={r.id} className="py-3 px-1 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-zinc-100 text-sm tabular-nums w-14">
                    {r.wpm} <span className="text-[10px] font-normal text-zinc-400">wpm</span>
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 tabular-nums font-medium">
                    {r.accuracy}%
                  </span>
                  <span className="text-zinc-400 capitalize hidden sm:inline">
                    {r.mode} ({r.modeValue})
                  </span>
                </div>

                <div className="flex items-center gap-4 text-zinc-400 tabular-nums text-[11px]">
                  <span>{r.durationSeconds}s</span>
                  <span>
                    {new Date(r.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-zinc-400 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
            No completed tests yet
          </div>
        )}
      </div>

    </div>
  );
};
