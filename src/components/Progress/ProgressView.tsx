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
  Calendar,
  Sparkles,
  Activity
} from 'lucide-react';

export const ProgressView: React.FC = () => {
  const { 
    results, 
    lessonProgress, 
    overallLevel, 
    personalBestWpm, 
    weakKeysCounter,
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

  // Practice activity calendar for past 28 days
  const activityDays = useMemo(() => {
    const days: { dateStr: string; count: number }[] = [];
    const now = new Date();

    const testCountsByDate: Record<string, number> = {};
    results.forEach(r => {
      const d = new Date(r.timestamp).toISOString().slice(0, 10);
      testCountsByDate[d] = (testCountsByDate[d] || 0) + 1;
    });

    for (let i = 27; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);
      days.push({
        dateStr,
        count: testCountsByDate[dateStr] || 0
      });
    }

    return days;
  }, [results]);

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
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 mb-8 border-b border-zinc-200/60 dark:border-zinc-800/60">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 mb-1.5">
            <Activity className="w-3.5 h-3.5 text-blue-500" />
            <span>Progress Analytics</span>
            <span aria-hidden="true" className="text-zinc-300 dark:text-zinc-700">·</span>
            <span>{stats.testsCount} tests recorded</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            Performance Overview
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Genuine metrics calculated from your typing sessions.
          </p>
        </div>

        {/* Quiet Level Indicator */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-800 dark:text-zinc-200">
              <span>Level {overallLevel.level}</span>
              <span className="text-zinc-400">·</span>
              <span className="text-zinc-500">{overallLevel.title}</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-24 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500 rounded-full transition-all duration-300"
                  style={{ width: `${overallLevel.progress}%` }}
                />
              </div>
              <span className="text-[10px] text-zinc-400 font-mono tabular-nums">{overallLevel.progress}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary KPI Strip - Clean Typographic Alignment */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 py-4 mb-10 border-b border-zinc-200/60 dark:border-zinc-800/60">
        <div>
          <span className="text-xs text-zinc-500 block">Personal Best</span>
          <div className="text-2xl sm:text-3xl font-semibold text-blue-600 dark:text-blue-400 tabular-nums mt-0.5">
            {personalBestWpm}
          </div>
          <span className="text-[11px] text-zinc-400">WPM peak</span>
        </div>

        <div>
          <span className="text-xs text-zinc-500 block">Average Speed</span>
          <div className="text-2xl sm:text-3xl font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums mt-0.5">
            {stats.avgWpm}
          </div>
          <span className="text-[11px] text-zinc-400">Net WPM</span>
        </div>

        <div>
          <span className="text-xs text-zinc-500 block">Accuracy</span>
          <div className="text-2xl sm:text-3xl font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums mt-0.5">
            {stats.avgAccuracy}%
          </div>
          <span className="text-[11px] text-zinc-400">Precision rate</span>
        </div>

        <div>
          <span className="text-xs text-zinc-500 block">Tests Done</span>
          <div className="text-2xl sm:text-3xl font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums mt-0.5">
            {stats.testsCount}
          </div>
          <span className="text-[11px] text-zinc-400">Completed tests</span>
        </div>

        <div>
          <span className="text-xs text-zinc-500 block">Words Typed</span>
          <div className="text-2xl sm:text-3xl font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums mt-0.5">
            {stats.totalWords}
          </div>
          <span className="text-[11px] text-zinc-400">Total volume</span>
        </div>

        <div>
          <span className="text-xs text-zinc-500 block">Time Spent</span>
          <div className="text-2xl sm:text-3xl font-semibold text-zinc-900 dark:text-zinc-100 tabular-nums mt-0.5">
            {stats.totalTimeMinutes}m
          </div>
          <span className="text-[11px] text-zinc-400">Active time</span>
        </div>
      </div>

      {/* Speed Chart & Weak Keys */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        
        {/* WPM Trend Chart */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                <span>Speed Progression</span>
              </h2>
              <span className="text-xs text-zinc-500">Last 10 sessions history</span>
            </div>

            {last10ChartData.length > 0 && (
              <div className="flex items-center gap-3 text-xs text-zinc-500">
                <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  Net WPM
                </span>
                <span className="flex items-center gap-1.5 text-zinc-400">
                  <span className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                  Raw
                </span>
              </div>
            )}
          </div>

          <div className="h-48 sm:h-56 w-full pt-2">
            {last10ChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={last10ChartData} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-zinc-200/50 dark:text-zinc-800/50" vertical={false} />
                  <XAxis 
                    dataKey="session" 
                    stroke="currentColor" 
                    className="text-[11px] text-zinc-400" 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="currentColor" 
                    className="text-[11px] text-zinc-400 tabular-nums" 
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
                          <div className="p-2.5 rounded-xl bg-zinc-900/90 dark:bg-zinc-800/90 text-white shadow-lg text-xs backdrop-blur-md border border-zinc-700/50">
                            <div className="font-semibold text-zinc-300 mb-1">{data.date} · {data.mode}</div>
                            <div className="flex items-center gap-3 tabular-nums">
                              <span className="text-blue-400 font-bold">{data.wpm} WPM</span>
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
                    stroke="#2563eb" 
                    strokeWidth={2} 
                    dot={{ r: 3, fill: '#2563eb' }} 
                    activeDot={{ r: 5 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="rawWpm" 
                    stroke="#94a3b8" 
                    strokeWidth={1.5} 
                    strokeDasharray="4 4" 
                    dot={false} 
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-zinc-400 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
                Complete a test to view your speed chart
              </div>
            )}
          </div>
        </div>

        {/* Weak Keys Insights */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Key Accuracy
              </h2>
              <span className="text-xs text-zinc-500">Most missed keys</span>
            </div>

            {weakKeysRanked.length > 0 && (
              <button
                onClick={handlePracticeWeakKeys}
                className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
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
                    <kbd className="w-6 h-6 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center font-mono font-semibold text-zinc-800 dark:text-zinc-200 uppercase text-[11px]">
                      {keyChar}
                    </kbd>
                    <div className="flex-1 h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                      <div
                        className="h-full bg-amber-500/80 rounded-full"
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
            <div className="py-8 text-center text-xs text-zinc-400 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
              No mistyped keys detected yet
            </div>
          )}
        </div>
      </div>

      {/* 28-Day Activity Heat Strip */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-500" />
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Activity History
            </h2>
          </div>
          <span className="text-xs text-zinc-400">
            Last 4 weeks
          </span>
        </div>

        <div className="grid grid-cols-7 sm:grid-cols-14 gap-1.5">
          {activityDays.map((day) => {
            const hasActivity = day.count > 0;
            return (
              <div
                key={day.dateStr}
                className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-lg border transition-all text-center ${
                  day.count >= 5
                    ? 'bg-blue-600 text-white border-blue-600'
                    : day.count >= 2
                      ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/25'
                      : day.count === 1
                        ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                        : 'bg-zinc-50 dark:bg-zinc-800/30 text-zinc-400 border-zinc-200/40 dark:border-zinc-800/40'
                }`}
                title={`${day.dateStr}: ${day.count} tests`}
              >
                <span className="text-[10px] font-mono leading-none">
                  {day.dateStr.slice(8)}
                </span>
                <span className="text-[9px] mt-1 opacity-70">
                  {hasActivity ? `${day.count}` : '·'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Sessions List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Recent Tests
          </h2>
          <span className="text-xs text-zinc-400">
            Latest {Math.min(10, results.length)} tests
          </span>
        </div>

        {results.length > 0 ? (
          <div className="divide-y divide-zinc-200/60 dark:divide-zinc-800/60 border-y border-zinc-200/60 dark:border-zinc-800/60 text-xs">
            {results.slice(0, 8).map((r) => (
              <div key={r.id} className="py-3 px-1 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm tabular-nums w-14">
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
