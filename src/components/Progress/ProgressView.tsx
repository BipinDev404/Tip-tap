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
  Clock, 
  Flame, 
  Target, 
  TrendingUp, 
  Activity, 
  AlertCircle, 
  Calendar,
  Sparkles,
  ArrowUpRight,
  BookOpen
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
    return entries.slice(0, 6);
  }, [weakKeysCounter]);

  // Practice activity calendar for the past 28 days
  const activityDays = useMemo(() => {
    const days: { dateStr: string; count: number; dayOfWeek: number }[] = [];
    const now = new Date();

    // Map test timestamps to dates
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
        count: testCountsByDate[dateStr] || 0,
        dayOfWeek: d.getDay()
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
    // Create rhythmic practice patterns around the weak keys
    const drills = keys.map(k => `${k}${k} ${k}e ${k}a ${k}t ${k}r`).join(' ');
    setPracticeTargetWords(drills);
    setActiveTab('practice');
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-6 sm:py-8 px-4 animate-in fade-in duration-200">
      
      {/* Title & Level Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200/80 dark:border-zinc-800/80">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1">
                <Activity className="w-3.5 h-3.5" />
                Performance Dashboard
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Your Typing Journey
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
              Metrics calculated strictly from your completed tests and touch typing sessions.
            </p>
          </div>

          {/* Level Card */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-100/80 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Level {overallLevel.level}
                </span>
                <span className="text-xs text-zinc-400">·</span>
                <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  {overallLevel.title}
                </span>
              </div>
              <div className="w-36 sm:w-44 h-2 rounded-full bg-zinc-200 dark:bg-zinc-800 mt-2 overflow-hidden">
                <div 
                  className="h-full bg-amber-500 rounded-full transition-all duration-500" 
                  style={{ width: `${overallLevel.progress}%` }}
                />
              </div>
              <div className="text-[10px] text-zinc-400 mt-1">
                {overallLevel.nextLevelAt} XP to Level {overallLevel.level + 1}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs">
          <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider block">Best Speed</span>
          <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 tabular-nums mt-1">
            {personalBestWpm}
          </div>
          <span className="text-[10px] text-zinc-400">Words per minute</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs">
          <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider block">Average Speed</span>
          <div className="text-2xl font-extrabold text-zinc-800 dark:text-zinc-200 tabular-nums mt-1">
            {stats.avgWpm}
          </div>
          <span className="text-[10px] text-zinc-400">Net average WPM</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs">
          <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider block">Accuracy</span>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums mt-1">
            {stats.avgAccuracy}%
          </div>
          <span className="text-[10px] text-zinc-400">Average precision</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs">
          <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider block">Tests Done</span>
          <div className="text-2xl font-extrabold text-zinc-800 dark:text-zinc-200 tabular-nums mt-1">
            {stats.testsCount}
          </div>
          <span className="text-[10px] text-zinc-400">Completed tests</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs">
          <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider block">Words Typed</span>
          <div className="text-2xl font-extrabold text-zinc-800 dark:text-zinc-200 tabular-nums mt-1">
            {stats.totalWords}
          </div>
          <span className="text-[10px] text-zinc-400">Total volume</span>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-2xs">
          <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider block">Time Spent</span>
          <div className="text-2xl font-extrabold text-zinc-800 dark:text-zinc-200 tabular-nums mt-1">
            {stats.totalTimeMinutes}m
          </div>
          <span className="text-[10px] text-zinc-400">Active typing</span>
        </div>
      </div>

      {/* Progression Chart & Weak Keys Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* WPM Trend Chart with Recharts */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                <span>WPM Progression (Last 10 Sessions)</span>
              </h3>
              <p className="text-xs text-zinc-400">Interactive Recharts visualization tracking net and gross speed</p>
            </div>
            {last10ChartData.length > 0 && (
              <div className="flex items-center gap-3 text-[11px]">
                <span className="flex items-center gap-1.5 font-medium text-blue-600 dark:text-blue-400">
                  <span className="w-2.5 h-1 rounded-full bg-blue-500" />
                  Net WPM
                </span>
                <span className="flex items-center gap-1.5 text-zinc-400">
                  <span className="w-2.5 h-1 rounded-full bg-zinc-400" />
                  Raw WPM
                </span>
              </div>
            )}
          </div>

          {last10ChartData.length > 0 ? (
            <div className="h-44 sm:h-52 w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={last10ChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-zinc-200/60 dark:text-zinc-800/60" vertical={false} />
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
                          <div className="p-3 rounded-2xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 shadow-xl text-xs space-y-1">
                            <div className="flex items-center justify-between gap-4 font-semibold text-zinc-900 dark:text-zinc-100">
                              <span>{data.session} · {data.mode}</span>
                              <span className="text-[11px] text-zinc-400 font-normal">{data.date}</span>
                            </div>
                            <div className="flex items-center gap-3 pt-1 border-t border-zinc-100 dark:border-zinc-800 text-[11px]">
                              <span className="text-blue-600 dark:text-blue-400 font-bold tabular-nums">
                                {data.wpm} WPM
                              </span>
                              <span className="text-zinc-400">·</span>
                              <span className="text-zinc-500 tabular-nums">
                                Raw: {data.rawWpm}
                              </span>
                              <span className="text-zinc-400">·</span>
                              <span className="text-emerald-600 dark:text-emerald-400 font-medium tabular-nums">
                                {data.accuracy}% Acc
                              </span>
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
                    name="Net WPM"
                    stroke="#0071e3" 
                    strokeWidth={2.5} 
                    dot={{ fill: '#0071e3', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#0071e3', stroke: '#ffffff', strokeWidth: 2 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="rawWpm" 
                    name="Raw WPM"
                    stroke="#a1a1aa" 
                    strokeWidth={1.5} 
                    strokeDasharray="4 4"
                    dot={{ fill: '#a1a1aa', strokeWidth: 1, r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-44 rounded-2xl bg-zinc-50 dark:bg-zinc-800/30 flex flex-col items-center justify-center text-center p-6 border border-dashed border-zinc-200 dark:border-zinc-800">
              <Activity className="w-6 h-6 text-zinc-300 dark:text-zinc-600 mb-2" />
              <p className="text-xs text-zinc-500">Complete typing tests to view your 10-session WPM progression chart.</p>
              <button
                onClick={() => setActiveTab('practice')}
                className="mt-3 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                Start Practice &rarr;
              </button>
            </div>
          )}
        </div>

        {/* Weak Key Analysis */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                <span>Weak-Key Insights</span>
              </h3>
            </div>
            <p className="text-xs text-zinc-400 mb-4">
              Keys most frequently mistyped during your tests
            </p>

            {weakKeysRanked.length > 0 ? (
              <div className="space-y-2.5">
                {weakKeysRanked.map(([keyChar, count], idx) => {
                  const maxErr = weakKeysRanked[0][1];
                  const widthPercent = Math.max(15, Math.round((count / maxErr) * 100));

                  return (
                    <div key={keyChar} className="flex items-center gap-2.5 text-xs">
                      <kbd className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center font-mono font-bold text-zinc-800 dark:text-zinc-200 uppercase shadow-2xs">
                        {keyChar}
                      </kbd>
                      <div className="flex-1 h-3 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                        <div
                          className="h-full bg-amber-500/80 rounded-full"
                          style={{ width: `${widthPercent}%` }}
                        />
                      </div>
                      <span className="text-[11px] font-mono text-zinc-400 tabular-nums">
                        {count} misses
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-zinc-400">
                No error patterns detected yet. Take a test to identify opportunities for improvement.
              </div>
            )}
          </div>

          {weakKeysRanked.length > 0 && (
            <button
              onClick={handlePracticeWeakKeys}
              className="mt-6 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white shadow-xs transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Practice Weak Keys Drill</span>
            </button>
          )}
        </div>

      </div>

      {/* 28-Day Activity Heat Calendar */}
      <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-500" />
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Practice Activity (Past 4 Weeks)
            </h3>
          </div>
          <span className="text-xs text-zinc-400">
            {results.length} total sessions logged
          </span>
        </div>

        <div className="grid grid-cols-7 sm:grid-cols-14 gap-2">
          {activityDays.map((day, i) => {
            const hasActivity = day.count > 0;
            return (
              <div
                key={day.dateStr}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
                  day.count >= 5
                    ? 'bg-blue-600 text-white border-blue-600'
                    : day.count >= 2
                      ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30'
                      : day.count === 1
                        ? 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                        : 'bg-zinc-50 dark:bg-zinc-800/40 text-zinc-400 border-zinc-100 dark:border-zinc-800/40'
                }`}
                title={`${day.dateStr}: ${day.count} tests`}
              >
                <span className="text-[10px] font-mono leading-none">
                  {day.dateStr.slice(8)}
                </span>
                <span className="text-[9px] mt-1 opacity-70">
                  {day.count > 0 ? `${day.count}x` : '·'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Sessions Table */}
      <div className="rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            Recent Test Sessions
          </h3>
          <span className="text-xs text-zinc-400">
            Showing latest {Math.min(10, results.length)} tests
          </span>
        </div>

        {results.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 dark:bg-zinc-800/50 text-zinc-400 border-b border-zinc-100 dark:border-zinc-800">
                <tr>
                  <th className="py-3 px-6 font-medium">Date</th>
                  <th className="py-3 px-6 font-medium">Mode</th>
                  <th className="py-3 px-6 font-medium">WPM</th>
                  <th className="py-3 px-6 font-medium">Accuracy</th>
                  <th className="py-3 px-6 font-medium">Consistency</th>
                  <th className="py-3 px-6 font-medium">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60 font-mono">
                {results.slice(0, 10).map((r) => (
                  <tr key={r.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                    <td className="py-3.5 px-6 text-zinc-500 font-sans">
                      {new Date(r.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3.5 px-6 capitalize text-zinc-700 dark:text-zinc-300 font-sans">
                      {r.mode} ({r.modeValue})
                    </td>
                    <td className="py-3.5 px-6 font-bold text-blue-600 dark:text-blue-400 tabular-nums">
                      {r.wpm}
                    </td>
                    <td className="py-3.5 px-6 text-emerald-600 dark:text-emerald-400 tabular-nums">
                      {r.accuracy}%
                    </td>
                    <td className="py-3.5 px-6 text-zinc-600 dark:text-zinc-400 tabular-nums">
                      {r.consistency}%
                    </td>
                    <td className="py-3.5 px-6 text-zinc-500 tabular-nums">
                      {r.durationSeconds}s
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-zinc-400">
            No tests completed yet. Start typing in the Practice tab to record your progress!
          </div>
        )}
      </div>

    </div>
  );
};
