import React, { useState, useEffect, useMemo } from 'react';
import { TestResult, KeystrokeSample } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  RotateCcw, 
  ArrowRight, 
  Trophy, 
  Sparkles, 
  Share2, 
  Check, 
  TrendingUp, 
  Zap, 
  Target, 
  Activity, 
  Clock, 
  BarChart2, 
  Download,
  Copy,
  Flame,
  X,
  ImageIcon,
  AlertTriangle,
  CheckCircle2
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
  const [copiedText, setCopiedText] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const history: KeystrokeSample[] = useMemo(() => {
    if (result.history && result.history.length > 0) {
      return result.history;
    }
    return [
      { second: 0, wpm: 0, rawWpm: 0, errors: 0 },
      { second: result.durationSeconds, wpm: result.wpm, rawWpm: result.rawWpm, errors: result.characters.incorrect }
    ];
  }, [result]);

  // Performance calculations
  const maxWpmInHistory = useMemo(() => {
    const historyMax = Math.max(0, ...history.map(h => Math.max(h.wpm, h.rawWpm)));
    return Math.max(60, historyMax, result.wpm + 10);
  }, [history, result.wpm]);

  const peakWpm = useMemo(() => {
    if (history.length === 0) return result.wpm;
    return Math.max(...history.map(h => h.wpm), result.wpm);
  }, [history, result.wpm]);

  const avgWpm = useMemo(() => {
    if (history.length === 0) return result.wpm;
    const sum = history.reduce((acc, h) => acc + h.wpm, 0);
    return Math.round(sum / history.length);
  }, [history, result.wpm]);

  // DYNAMIC PERFORMANCE COLOR SYSTEM
  // Bad = Red (<35 WPM), Normal = Yellow (35-65 WPM), Very Good = Blue (>65 WPM)
  const wpmStyle = useMemo(() => {
    const wpm = result.wpm;
    if (wpm < 35) {
      return {
        textColor: 'text-rose-400',
        badgeBg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
        glow: 'drop-shadow-[0_0_35px_rgba(244,63,94,0.35)]',
        badgeText: 'Needs Practice · Building Speed',
        canvasHex: '#f43f5e',
        icon: AlertTriangle
      };
    } else if (wpm <= 65) {
      return {
        textColor: 'text-amber-400',
        badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        glow: 'drop-shadow-[0_0_35px_rgba(245,158,11,0.35)]',
        badgeText: 'Normal Speed · Solid Performance',
        canvasHex: '#fbbf24',
        icon: Flame
      };
    } else {
      return {
        textColor: 'text-blue-400',
        badgeBg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
        glow: 'drop-shadow-[0_0_35px_rgba(96,165,250,0.35)]',
        badgeText: 'Very Good · High Speed',
        canvasHex: '#60a5fa',
        icon: Zap
      };
    }
  }, [result.wpm]);

  // ACCURACY COLOR SYSTEM
  // Bad = Red (<92%), Normal = Yellow (92-97%), Very Good = Blue (>97%)
  const accuracyStyle = useMemo(() => {
    const acc = result.accuracy;
    if (acc < 92) {
      return {
        textColor: 'text-rose-400',
        label: 'Low Precision'
      };
    } else if (acc <= 97) {
      return {
        textColor: 'text-amber-400',
        label: 'Normal Accuracy'
      };
    } else {
      return {
        textColor: 'text-blue-400',
        label: 'High Accuracy'
      };
    }
  }, [result.accuracy]);

  // Clean Test Mode Title
  const modeTitle = useMemo(() => {
    switch (result.mode) {
      case 'words': return `WORD PRACTICE TEST (${result.modeValue})`;
      case 'quote': return `QUOTE TYPING TEST`;
      case 'custom': return `CUSTOM TEXT TEST`;
      case 'time':
      default: return `TIMED SPEED TEST (${result.modeValue})`;
    }
  }, [result.mode, result.modeValue]);

  // WPM diff vs Personal Best
  const pbDiff = result.wpm - personalBestWpm;

  // Chart Dimensions & Coordinate Math
  const chartWidth = 720;
  const chartHeight = 180;
  const paddingX = 40;
  const paddingY = 25;

  const pointsWpm = useMemo(() => {
    if (history.length <= 1) return [];
    return history.map((pt, i) => {
      const x = paddingX + (i / Math.max(1, history.length - 1)) * (chartWidth - paddingX * 2);
      const y = chartHeight - paddingY - (pt.wpm / maxWpmInHistory) * (chartHeight - paddingY * 2);
      return { x, y, pt, i };
    });
  }, [history, maxWpmInHistory]);

  const pointsRaw = useMemo(() => {
    if (history.length <= 1) return [];
    return history.map((pt, i) => {
      const x = paddingX + (i / Math.max(1, history.length - 1)) * (chartWidth - paddingX * 2);
      const y = chartHeight - paddingY - (pt.rawWpm / maxWpmInHistory) * (chartHeight - paddingY * 2);
      return { x, y };
    });
  }, [history, maxWpmInHistory]);

  // Smooth SVG Path with Cubic Spline Generator
  const generateSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return '';
    if (pts.length === 1) return `M ${pts[0].x},${pts[0].y}`;

    let path = `M ${pts[0].x},${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const current = pts[i];
      const next = pts[i + 1];
      const mx = (current.x + next.x) / 2;
      path += ` C ${mx},${current.y} ${mx},${next.y} ${next.x},${next.y}`;
    }
    return path;
  };

  const wpmPathStr = useMemo(() => generateSmoothPath(pointsWpm), [pointsWpm]);
  const rawPathStr = useMemo(() => generateSmoothPath(pointsRaw), [pointsRaw]);

  // Area under WPM curve
  const areaPathStr = useMemo(() => {
    if (pointsWpm.length <= 1) return '';
    const firstX = pointsWpm[0].x;
    const lastX = pointsWpm[pointsWpm.length - 1].x;
    const bottomY = chartHeight - paddingY;
    return `${wpmPathStr} L ${lastX},${bottomY} L ${firstX},${bottomY} Z`;
  }, [pointsWpm, wpmPathStr]);

  // Generate Image Card using HTML5 Canvas
  const generateCanvasImage = (): string => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    const heroHex = wpmStyle.canvasHex;

    // Outer Background
    ctx.fillStyle = '#09090b';
    ctx.fillRect(0, 0, 1200, 630);

    // Radial glow in center using performance color
    const radial = ctx.createRadialGradient(600, 260, 20, 600, 260, 520);
    radial.addColorStop(0, `${heroHex}22`);
    radial.addColorStop(1, 'rgba(9, 9, 11, 0)');
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, 1200, 630);

    // Card frame border
    ctx.strokeStyle = '#27272a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(24, 24, 1152, 582, 24);
    ctx.stroke();

    // Brand Lockup Header
    ctx.fillStyle = '#f4f4f5';
    ctx.font = 'bold 30px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Tip tap', 64, 80);

    ctx.fillStyle = '#71717a';
    ctx.font = '500 18px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillText('· Typing Result', 180, 80);

    // Mode Pill Badge Top Right
    ctx.fillStyle = '#18181b';
    ctx.beginPath();
    ctx.roundRect(880, 52, 256, 42, 21);
    ctx.fill();
    ctx.strokeStyle = '#3f3f46';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = '#a1a1aa';
    ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(modeTitle, 1008, 78);

    // Centered Hero WPM Number (Color Coded)
    ctx.fillStyle = heroHex;
    ctx.font = '900 140px -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${result.wpm}`, 600, 250);

    ctx.fillStyle = '#a1a1aa';
    ctx.font = 'bold 22px -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif';
    ctx.fillText('WPM', 600, 295);

    // Status Badge Pill
    ctx.fillStyle = '#18181b';
    ctx.beginPath();
    ctx.roundRect(460, 312, 280, 34, 17);
    ctx.fill();
    ctx.strokeStyle = heroHex;
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = heroHex;
    ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(wpmStyle.badgeText.toUpperCase(), 600, 334);

    // Secondary Stats Grid (4 Cards)
    const stats = [
      { label: 'ACCURACY', val: `${result.accuracy}%` },
      { label: 'RAW WPM', val: `${result.rawWpm}` },
      { label: 'CONSISTENCY', val: `${result.consistency}%` },
      { label: 'TEST TIME', val: `${result.durationSeconds}s` }
    ];

    const startX = 84;
    const boxW = 236;
    const gap = 28;
    const boxY = 370;

    stats.forEach((stat, idx) => {
      const x = startX + idx * (boxW + gap);

      ctx.fillStyle = '#121215';
      ctx.beginPath();
      ctx.roundRect(x, boxY, boxW, 100, 16);
      ctx.fill();
      ctx.strokeStyle = '#27272a';
      ctx.stroke();

      ctx.fillStyle = '#71717a';
      ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(stat.label, x + boxW / 2, boxY + 34);

      ctx.fillStyle = '#f4f4f5';
      ctx.font = 'bold 30px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText(stat.val, x + boxW / 2, boxY + 76);
    });

    // Timeline curve at bottom of card
    if (history.length > 1) {
      const chartX = 84;
      const chartY = 500;
      const chartW = 1032;
      const chartH = 45;

      ctx.beginPath();
      ctx.strokeStyle = heroHex;
      ctx.lineWidth = 3;

      history.forEach((pt, i) => {
        const px = chartX + (i / (history.length - 1)) * chartW;
        const py = chartY + chartH - (pt.wpm / maxWpmInHistory) * chartH;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();
    }

    // Footer
    ctx.fillStyle = '#52525b';
    ctx.font = '13px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('tiptap.app · Premium Typing Experience', 600, 580);

    return canvas.toDataURL('image/png');
  };

  // Open Share & Download Modal
  const handleOpenShareModal = () => {
    const dataUrl = generateCanvasImage();
    setGeneratedImageUrl(dataUrl);
    setIsShareModalOpen(true);
  };

  // Download image file
  const handleDownloadImage = () => {
    if (!generatedImageUrl) return;
    const a = document.createElement('a');
    a.href = generatedImageUrl;
    a.download = `tiptap-typing-result-${result.wpm}wpm.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Copy Image to Clipboard
  const handleCopyImageToClipboard = async () => {
    if (!generatedImageUrl) return;
    try {
      const response = await fetch(generatedImageUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      setCopiedImage(true);
      setTimeout(() => setCopiedImage(false), 2200);
    } catch {
      handleCopyText();
    }
  };

  // Copy text summary
  const handleCopyText = () => {
    const text = `Tip tap typing test: ${result.wpm} WPM · ${result.accuracy}% accuracy (${result.modeValue} ${result.mode})`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2200);
    }
  };

  const hasWeakKeys = Object.keys(result.missedKeys).length > 0;
  const missedKeysEntries = Object.entries(result.missedKeys).sort((a, b) => b[1] - a[1]);

  // Global keyboard shortcuts while results modal is active
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onNewTest();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        onRetry();
      } else if ((e.key === 'd' || e.key === 'D') && hasWeakKeys) {
        e.preventDefault();
        onPracticeWeakKeys();
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        handleOpenShareModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNewTest, onRetry, onPracticeWeakKeys, hasWeakKeys]);

  const StatusIcon = wpmStyle.icon;

  return (
    <div className="w-full max-w-4xl mx-auto my-2 animate-in fade-in zoom-in-95 duration-200">
      <div className="bg-zinc-950/95 border border-zinc-800/90 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-2xl">
        
        {/* Top Header Label */}
        <div className="text-center mb-4">
          <span className="text-xs font-bold tracking-widest text-zinc-500 uppercase">
            {modeTitle}
          </span>
        </div>

        {/* Top Personal Best Banner (If applicable) */}
        {result.isPersonalBest && (
          <div className="mb-6 p-3 rounded-2xl bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-transparent border border-amber-500/30 flex items-center justify-between gap-3 animate-pulse max-w-md mx-auto">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                <Trophy className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  New Personal Best!
                </div>
                <div className="text-[11px] text-amber-400/80">
                  New high score recorded
                </div>
              </div>
            </div>
            <span className="text-xs font-extrabold text-amber-300 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/40 tabular-nums">
              +{pbDiff > 0 ? pbDiff : result.wpm} WPM
            </span>
          </div>
        )}

        {/* CENTERED HERO SECTION: COLOR-CODED GIANT WPM */}
        <div className="flex flex-col items-center justify-center text-center pb-8 border-b border-zinc-800/80">
          
          {/* Performance Status Badge */}
          <div className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold border mb-2 ${wpmStyle.badgeBg}`}>
            <StatusIcon className="w-3.5 h-3.5" />
            <span>{wpmStyle.badgeText}</span>
          </div>

          {/* Centered Giant Color-Coded WPM Number */}
          <div className="flex flex-col items-center justify-center my-1">
            <div className={`text-8xl sm:text-9xl md:text-[10rem] font-black tracking-tight tabular-nums leading-none ${wpmStyle.textColor} ${wpmStyle.glow}`}>
              {result.wpm}
            </div>
            <div className="text-2xl sm:text-3xl font-black text-zinc-400 tracking-widest uppercase mt-1">
              WPM
            </div>
            <span className="text-xs text-zinc-500 font-medium tracking-wide mt-1">
              net words per minute
            </span>
          </div>

          {/* Benchmark comparison / Quote Note */}
          <div className="mt-2 text-xs text-zinc-500 tabular-nums flex items-center justify-center gap-3 flex-wrap">
            {!result.isPersonalBest && personalBestWpm > 0 && (
              <span>Personal Best: <strong className="text-zinc-300 font-semibold">{personalBestWpm} WPM</strong></span>
            )}
            {result.quoteAuthor && (
              <span className="italic text-zinc-400">
                — {result.quoteAuthor}
              </span>
            )}
          </div>

        </div>

        {/* SECONDARY METRICS: Clean 4-Card Grid with Color-Coded Accuracy */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 my-8">
          
          {/* Accuracy (Color-Coded: Red if low, Yellow if normal, Blue if high) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex flex-col items-center text-center justify-between transition-colors hover:border-zinc-700">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
              <Target className={`w-3.5 h-3.5 ${accuracyStyle.textColor}`} />
              Accuracy
            </span>
            <div className={`mt-2 text-3xl sm:text-4xl font-black tabular-nums ${accuracyStyle.textColor}`}>
              {result.accuracy}%
            </div>
            <span className="mt-1 text-[11px] text-zinc-500 tabular-nums">
              {result.characters.correct} correct · {result.characters.incorrect} err
            </span>
          </div>

          {/* Raw WPM */}
          <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex flex-col items-center text-center justify-between transition-colors hover:border-zinc-700">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
              <BarChart2 className="w-3.5 h-3.5 text-zinc-400" />
              Raw WPM
            </span>
            <div className="mt-2 text-3xl sm:text-4xl font-black text-zinc-200 tabular-nums">
              {result.rawWpm}
            </div>
            <span className="mt-1 text-[11px] text-zinc-500 tabular-nums">
              Gross typing speed
            </span>
          </div>

          {/* Consistency */}
          <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex flex-col items-center text-center justify-between transition-colors hover:border-zinc-700">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-zinc-400" />
              Consistency
            </span>
            <div className="mt-2 text-3xl sm:text-4xl font-black text-zinc-300 tabular-nums">
              {result.consistency}%
            </div>
            <span className="mt-1 text-[11px] text-zinc-500 tabular-nums">
              Rhythm stability
            </span>
          </div>

          {/* Duration */}
          <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 flex flex-col items-center text-center justify-between transition-colors hover:border-zinc-700">
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              Time
            </span>
            <div className="mt-2 text-3xl sm:text-4xl font-black text-zinc-300 tabular-nums">
              {result.durationSeconds}s
            </div>
            <span className="mt-1 text-[11px] text-zinc-500 tabular-nums">
              {result.characters.total} characters
            </span>
          </div>

        </div>

        {/* SPEED TIMELINE GRAPH */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-accent" />
              <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                Speed Timeline
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs text-zinc-400 tabular-nums flex-wrap">
              <div>
                <span className="text-zinc-500">Peak: </span>
                <span className="font-bold text-zinc-200">{peakWpm} WPM</span>
              </div>
              <span className="text-zinc-700">·</span>
              <div>
                <span className="text-zinc-500">Avg: </span>
                <span className="font-bold text-zinc-200">{avgWpm} WPM</span>
              </div>
            </div>
          </div>

          {/* SVG Chart Stage */}
          <div className="relative w-full rounded-2xl bg-zinc-900/80 border border-zinc-800 p-3 sm:p-4 overflow-hidden">
            <svg 
              viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
              className="w-full h-36 sm:h-44 overflow-visible select-none"
            >
              <defs>
                <linearGradient id="wpmGradientArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent-color)" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="var(--accent-color)" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              <line x1={paddingX} y1={paddingY} x2={chartWidth - paddingX} y2={paddingY} stroke="currentColor" strokeOpacity="0.08" className="text-zinc-700" />
              <line x1={paddingX} y1={chartHeight / 2} x2={chartWidth - paddingX} y2={chartHeight / 2} stroke="currentColor" strokeOpacity="0.08" className="text-zinc-700" />
              <line x1={paddingX} y1={chartHeight - paddingY} x2={chartWidth - paddingX} y2={chartHeight - paddingY} stroke="currentColor" strokeOpacity="0.15" className="text-zinc-600" />

              <text x={paddingX - 8} y={paddingY + 4} textAnchor="end" className="text-[10px] fill-zinc-500 font-mono tabular-nums">
                {maxWpmInHistory}
              </text>
              <text x={paddingX - 8} y={chartHeight / 2 + 4} textAnchor="end" className="text-[10px] fill-zinc-500 font-mono tabular-nums">
                {Math.round(maxWpmInHistory / 2)}
              </text>
              <text x={paddingX - 8} y={chartHeight - paddingY + 4} textAnchor="end" className="text-[10px] fill-zinc-500 font-mono tabular-nums">
                0
              </text>

              {areaPathStr && (
                <path d={areaPathStr} fill="url(#wpmGradientArea)" />
              )}

              {rawPathStr && (
                <path
                  d={rawPathStr}
                  fill="none"
                  stroke="#71717a"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  strokeLinecap="round"
                />
              )}

              {wpmPathStr && (
                <path
                  d={wpmPathStr}
                  fill="none"
                  stroke="var(--accent-color)"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}

              {pointsWpm.map((ptObj, i) => {
                const isHovered = hoveredIndex === i;
                const hasErrors = ptObj.pt.errors > 0;

                return (
                  <g key={i}>
                    <circle
                      cx={ptObj.x}
                      cy={ptObj.y}
                      r={isHovered ? "6" : hasErrors ? "3.5" : "2.5"}
                      fill={hasErrors ? "#f43f5e" : "var(--accent-color)"}
                      stroke={isHovered ? "#ffffff" : "none"}
                      strokeWidth="2"
                      className="cursor-pointer transition-all duration-150"
                      onMouseEnter={() => setHoveredIndex(i)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Hover Tooltip Card */}
            {hoveredIndex !== null && pointsWpm[hoveredIndex] && (
              <div 
                className="absolute z-20 pointer-events-none p-2 rounded-xl bg-zinc-950 border border-zinc-700 shadow-xl text-xs flex flex-col gap-1 transition-all"
                style={{
                  left: `${Math.min(85, Math.max(12, (pointsWpm[hoveredIndex].x / chartWidth) * 100))}%`,
                  top: '10px',
                  transform: 'translateX(-50%)'
                }}
              >
                <div className="text-[11px] font-bold text-zinc-400 border-b border-zinc-800 pb-1 flex justify-between gap-4">
                  <span>Second {pointsWpm[hoveredIndex].pt.second}s</span>
                  {pointsWpm[hoveredIndex].pt.errors > 0 && (
                    <span className="text-rose-400 font-bold">
                      {pointsWpm[hoveredIndex].pt.errors} err
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 tabular-nums font-medium">
                  <span className="text-accent font-bold">
                    Net: {pointsWpm[hoveredIndex].pt.wpm} WPM
                  </span>
                  <span className="text-zinc-400">
                    Raw: {pointsWpm[hoveredIndex].pt.rawWpm}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* WEAK KEYS DRILL BANNER (If missed keys exist) */}
        {hasWeakKeys && (
          <div className="mb-8 p-4 rounded-2xl bg-amber-950/20 border border-amber-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-amber-300">
                  Targeted Missed Key Drill
                </div>
                <div className="text-xs text-amber-400/80 mt-0.5 flex flex-wrap gap-1.5 items-center">
                  <span>Keys missed:</span>
                  {missedKeysEntries.slice(0, 6).map(([char, count]) => (
                    <span key={char} className="font-mono font-bold text-amber-200 bg-amber-500/20 px-1.5 py-0.5 rounded text-[11px] border border-amber-500/30">
                      '{char}' ({count}x)
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={onPracticeWeakKeys}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold transition-all cursor-pointer shadow-md shrink-0"
            >
              <span>Drill Missed Keys</span>
              <kbd className="hidden sm:inline text-[9px] px-1 py-0.5 rounded bg-zinc-900/30 font-mono">D</kbd>
            </button>
          </div>
        )}

        {/* PRIMARY ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-zinc-800/80 mb-6">
          
          <button
            onClick={onRetry}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 text-zinc-200 text-sm font-semibold transition-all cursor-pointer shadow-xs active:scale-98"
            title="Repeat same text (Shortcut: R)"
          >
            <RotateCcw className="w-4 h-4 text-zinc-400" />
            <span>Repeat Same Text</span>
            <kbd className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700 font-mono">
              R
            </kbd>
          </button>

          <button
            onClick={onNewTest}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl bg-accent hover:opacity-90 text-zinc-950 font-bold text-sm transition-all cursor-pointer shadow-lg active:scale-98"
            title="Start new test (Shortcut: Enter or Space)"
          >
            <span>Next Test</span>
            <ArrowRight className="w-4 h-4" />
            <kbd className="hidden sm:inline text-[10px] px-2 py-0.5 rounded bg-zinc-950/20 text-zinc-950 font-mono border border-zinc-950/20 font-bold">
              Tab + Enter
            </kbd>
          </button>

        </div>

        {/* SHARE & IMAGE EXPORT BAR AT THE BOTTOM */}
        <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-accent/10 text-accent">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-zinc-200">
                Share Result Image & Stats
              </div>
              <div className="text-[11px] text-zinc-400">
                Export a clean PNG card of your test score or copy text summary
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopyText}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-zinc-200 border border-zinc-700 text-xs font-semibold transition-all cursor-pointer"
            >
              {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
              <span>{copiedText ? 'Copied Text' : 'Copy Text'}</span>
            </button>

            <button
              onClick={handleOpenShareModal}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-accent/15 hover:bg-accent/25 text-accent border border-accent/30 text-xs font-bold transition-all cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share / Download Image</span>
            </button>
          </div>
        </div>

      </div>

      {/* SHARE & DOWNLOAD IMAGE PREVIEW MODAL */}
      {isShareModalOpen && generatedImageUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl flex flex-col gap-5">
            
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-accent" />
                <h3 className="text-base font-bold text-zinc-100">
                  Export Result Card Image
                </h3>
              </div>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="p-1.5 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative w-full rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 shadow-inner">
              <img 
                src={generatedImageUrl} 
                alt="Tip tap Typing Result Card" 
                className="w-full h-auto object-cover rounded-2xl"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
              <button
                onClick={handleCopyImageToClipboard}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-zinc-200 border border-zinc-700 text-xs font-semibold transition-all cursor-pointer"
              >
                {copiedImage ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-zinc-400" />}
                <span>{copiedImage ? 'Image Copied to Clipboard!' : 'Copy Image'}</span>
              </button>

              <button
                onClick={handleDownloadImage}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-accent hover:opacity-90 text-zinc-950 font-bold text-xs transition-all cursor-pointer shadow-md active:scale-98"
              >
                <Download className="w-4 h-4" />
                <span>Download PNG Image</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
