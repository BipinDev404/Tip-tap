import React from 'react';
import { TestResult } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  RotateCcw, 
  ArrowRight, 
  Trophy, 
  Sparkles, 
  AlertCircle,
  Share2,
  Check
} from 'lucide-react';

interface ResultsModalProps {
  result: TestResult;
  onRetry: () => void;
  onNewTest: () => void;
  onPracticeWeakKeys: () => void;
}

export const ResultsModal: React.FC<ResultsModalProps> = ({
  result,
  onRetry,
  onNewTest,
  onPracticeWeakKeys
}) => {
  const { personalBestWpm } = useApp();
  const [copied, setCopied] = React.useState(false);

  // SVG dimensions for WPM over time chart
  const history = result.history || [];
  const maxWpm = Math.max(60, ...history.map(h => Math.max(h.wpm, h.rawWpm)));
  const chartWidth = 540;
  const chartHeight = 140;
  const padding = 24;

  const pointsWpm = history.map((pt, i) => {
    const x = padding + (i / Math.max(1, history.length - 1)) * (chartWidth - padding * 2);
    const y = chartHeight - padding - (pt.wpm / maxWpm) * (chartHeight - padding * 2);
    return `${x},${y}`;
  }).join(' ');

  const pointsRaw = history.map((pt, i) => {
    const x = padding + (i / Math.max(1, history.length - 1)) * (chartWidth - padding * 2);
    const y = chartHeight - padding - (pt.rawWpm / maxWpm) * (chartHeight - padding * 2);
    return `${x},${y}`;
  }).join(' ');

  // Area under curve
  const areaPoints = history.length > 1 ? `
    ${padding},${chartHeight - padding} 
    ${pointsWpm} 
    ${chartWidth - padding},${chartHeight - padding}
  ` : '';

  const handleShare = () => {
    const text = `Tip tap typing test: ${result.wpm} WPM · ${result.accuracy}% accuracy (${result.modeValue} ${result.mode})`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const hasWeakKeys = Object.keys(result.missedKeys).length > 0;

  return (
    <div className="w-full max-w-3xl mx-auto p-4 sm:p-6 animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 p-6 sm:p-8 shadow-xl">
        
        {/* Top Header / Personal Best Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-100 dark:border-zinc-800/60">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
                Test Summary · {result.mode.toUpperCase()} ({result.modeValue})
              </span>
              {result.isPersonalBest && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  <Trophy className="w-3 h-3" />
                  New Personal Best!
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              {result.wpm >= 70 ? 'Incredible Speed!' : result.wpm >= 40 ? 'Great Performance' : 'Keep Practicing'}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* Primary Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6">
          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800/60">
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">WPM</span>
            <div className="mt-1 text-3xl sm:text-4xl font-extrabold text-blue-600 dark:text-blue-400 tabular-nums">
              {result.wpm}
            </div>
            <span className="text-[11px] text-zinc-400 tabular-nums">
              {result.isPersonalBest ? 'Your fastest yet' : `Best: ${personalBestWpm} WPM`}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800/60">
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Accuracy</span>
            <div className="mt-1 text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
              {result.accuracy}%
            </div>
            <span className="text-[11px] text-zinc-400 tabular-nums">
              {result.characters.correct} of {result.characters.total} chars
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800/60">
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Raw WPM</span>
            <div className="mt-1 text-3xl sm:text-4xl font-extrabold text-zinc-800 dark:text-zinc-200 tabular-nums">
              {result.rawWpm}
            </div>
            <span className="text-[11px] text-zinc-400 tabular-nums">
              Gross typing rate
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800/60">
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Consistency</span>
            <div className="mt-1 text-3xl sm:text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 tabular-nums">
              {result.consistency}%
            </div>
            <span className="text-[11px] text-zinc-400 tabular-nums">
              Cadence stability
            </span>
          </div>
        </div>

        {/* Characters & Errors Breakdown */}
        <div className="p-3.5 rounded-xl bg-zinc-50/70 dark:bg-zinc-800/30 border border-zinc-100 dark:border-zinc-800/40 flex flex-wrap items-center justify-between gap-4 text-xs text-zinc-600 dark:text-zinc-400 mb-6">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-zinc-400">Characters: </span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">{result.characters.correct}</span>
              <span className="text-zinc-300 dark:text-zinc-700"> / </span>
              <span className="font-semibold text-rose-500 tabular-nums">{result.characters.incorrect}</span>
            </div>
            <div>
              <span className="text-zinc-400">Time: </span>
              <span className="font-semibold text-zinc-800 dark:text-zinc-200 tabular-nums">{result.durationSeconds}s</span>
            </div>
          </div>

          {result.quoteAuthor && (
            <div className="text-[11px] italic text-zinc-500">
              — {result.quoteAuthor}
            </div>
          )}
        </div>

        {/* WPM Over Time Chart */}
        {history.length > 1 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-zinc-500">Speed Timeline (WPM & Raw WPM)</span>
              <div className="flex items-center gap-3 text-[11px] text-zinc-400">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-0.5 bg-blue-500 rounded-full" />
                  Net WPM
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-0.5 bg-zinc-400 rounded-full" />
                  Raw WPM
                </span>
              </div>
            </div>

            <div className="relative w-full rounded-2xl bg-zinc-50/80 dark:bg-zinc-800/30 border border-zinc-200/50 dark:border-zinc-800/50 p-2 overflow-hidden">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-32 sm:h-36">
                <defs>
                  <linearGradient id="wpmGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Subtle Grid Lines */}
                <line x1={padding} y1={padding} x2={chartWidth - padding} y2={padding} stroke="currentColor" strokeOpacity="0.06" />
                <line x1={padding} y1={chartHeight / 2} x2={chartWidth - padding} y2={chartHeight / 2} stroke="currentColor" strokeOpacity="0.06" />
                <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="currentColor" strokeOpacity="0.1" />

                {/* Filled Area */}
                {areaPoints && (
                  <polygon points={areaPoints} fill="url(#wpmGradient)" />
                )}

                {/* Raw WPM Line */}
                <polyline
                  points={pointsRaw}
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                  strokeLinecap="round"
                />

                {/* Net WPM Line */}
                <polyline
                  points={pointsWpm}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Error scatter dots */}
                {history.map((pt, i) => {
                  if (pt.errors <= 0) return null;
                  const x = padding + (i / Math.max(1, history.length - 1)) * (chartWidth - padding * 2);
                  const y = chartHeight - padding - (pt.wpm / maxWpm) * (chartHeight - padding * 2);
                  return (
                    <circle
                      key={i}
                      cx={x}
                      cy={y}
                      r="3"
                      fill="#ef4444"
                      className="animate-pulse"
                    />
                  );
                })}
              </svg>
            </div>
          </div>
        )}

        {/* Missed Keys Insight */}
        {hasWeakKeys && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-amber-900 dark:text-amber-200">
                  Targeted Practice Available
                </p>
                <p className="text-[11px] text-amber-700 dark:text-amber-300">
                  You missed: {Object.entries(result.missedKeys).map(([k, c]) => `'${k}' (${c}x)`).join(', ')}
                </p>
              </div>
            </div>

            <button
              onClick={onPracticeWeakKeys}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-medium shadow-xs transition-colors cursor-pointer shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Drill Missed Keys</span>
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={onRetry}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-750 text-zinc-900 dark:text-zinc-100 text-sm font-semibold transition-all cursor-pointer shadow-xs active:scale-98"
            title="Repeat the same text (Tab + Enter)"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retry Test</span>
          </button>

          <button
            onClick={onNewTest}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all cursor-pointer shadow-sm active:scale-98"
          >
            <span>Next Test</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
