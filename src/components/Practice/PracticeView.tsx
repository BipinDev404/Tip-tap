import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  TestMode, 
  TimeOption, 
  WordsOption, 
  QuoteLength, 
  KeystrokeSample, 
  TestResult 
} from '../../types';
import { generateRandomWords, getRandomQuote, Quote } from '../../utils/wordLists';
import { soundManager } from '../../utils/audio';
import { VirtualKeyboard } from '../VirtualKeyboard';
import { ResultsModal } from './ResultsModal';
import { CustomTextModal } from './CustomTextModal';
import { 
  RotateCcw, 
  Clock, 
  FileText, 
  Quote as QuoteIcon, 
  Edit3, 
  Keyboard as KeyboardIcon,
  Sparkles,
  SlidersHorizontal,
  ChevronDown,
  Ghost,
  EyeOff
} from 'lucide-react';

export const PracticeView: React.FC = () => {
  const { 
    settings, 
    updateSettings, 
    addTestResult, 
    playKeySound, 
    playErrorSound, 
    playCompleteSound,
    practiceTargetWords,
    setPracticeTargetWords,
    setIsTestActive: setContextTestActive,
    results,
    personalBestWpm
  } = useApp();

  // Test mode configuration state
  const [mode, setMode] = useState<TestMode>('time');
  const [timeOption, setTimeOption] = useState<TimeOption>(30);
  const [wordsOption, setWordsOption] = useState<WordsOption>(25);
  const [quoteLength, setQuoteLength] = useState<QuoteLength>('medium');
  const [hasPunctuation, setHasPunctuation] = useState<boolean>(false);
  const [hasNumbers, setHasNumbers] = useState<boolean>(false);

  // Custom text modal state
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [customTextString, setCustomTextString] = useState<string>('');

  // Active quote if quote mode
  const [activeQuote, setActiveQuote] = useState<Quote | null>(null);

  // Engine state
  const [targetText, setTargetText] = useState<string>('');
  const [typedText, setTypedText] = useState<string>('');
  const [testSessionId, setTestSessionId] = useState<number>(0);
  const [isTestActive, setIsTestActive] = useState<boolean>(false);
  const [isTestFinished, setIsTestFinished] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [lastKeyPressed, setLastKeyPressed] = useState<string | null>(null);

  // Results state
  const [finishedResult, setFinishedResult] = useState<TestResult | null>(null);
  const [lineWordIndices, setLineWordIndices] = useState<number[][]>([]);
  const [lineHeightPx, setLineHeightPx] = useState<number>(58);

  // Performance tracking
  const keystrokeTimestamps = useRef<number[]>([]);
  const missedKeysRef = useRef<Record<string, number>>({});
  const historyRef = useRef<KeystrokeSample[]>([]);
  const timerIntervalRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const textContainerRef = useRef<HTMLDivElement | null>(null);
  const probeContainerRef = useRef<HTMLDivElement | null>(null);
  const activeCharRef = useRef<HTMLSpanElement | null>(null);
  const activeWordRef = useRef<HTMLSpanElement | null>(null);

  // Shortcuts handling (Tab then Enter)
  const tabPressedRef = useRef<boolean>(false);

  // Generate target text based on active settings
  const generateText = useCallback(() => {
    if (practiceTargetWords) {
      setTargetText(practiceTargetWords);
      setActiveQuote(null);
      return;
    }

    if (mode === 'custom' && customTextString) {
      setTargetText(customTextString);
      setActiveQuote(null);
      return;
    }

    if (mode === 'quote') {
      const q = getRandomQuote(quoteLength);
      setActiveQuote(q);
      setTargetText(q.text);
      return;
    }

    setActiveQuote(null);
    let count = 30;
    if (mode === 'words') {
      count = wordsOption;
    } else if (mode === 'time') {
      // Generate sufficient words for the time duration
      count = Math.max(60, Math.round(timeOption * 2.5));
    }

    const words = generateRandomWords(count, hasPunctuation, hasNumbers);
    setTargetText(words);
  }, [mode, timeOption, wordsOption, quoteLength, hasPunctuation, hasNumbers, practiceTargetWords, customTextString]);

  // Reset test
  const resetTest = useCallback((keepSameText = false) => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    setTypedText('');
    setIsTestActive(false);
    setContextTestActive(false);
    setGhostIndex(0);
    setIsTestFinished(false);
    setStartTime(null);
    setElapsedSeconds(0);
    setLastKeyPressed(null);
    setFinishedResult(null);
    keystrokeTimestamps.current = [];
    missedKeysRef.current = {};
    historyRef.current = [];
    setTestSessionId(prev => prev + 1);

    if (!keepSameText) {
      generateText();
    }

    // Refocus input
    setTimeout(() => {
      inputRef.current?.focus();
    }, 20);
  }, [generateText]);

  // Initial load or mode change
  useEffect(() => {
    resetTest(false);
  }, [mode, timeOption, wordsOption, quoteLength, hasPunctuation, hasNumbers, practiceTargetWords]);

  // Ensure input stays focused on click and resume Web Audio Context
  const focusInput = () => {
    soundManager.resume();
    inputRef.current?.focus();
  };

  // Measure word positions inside the static layout probe to compute line groupings
  const measureProbeLines = useCallback(() => {
    if (!probeContainerRef.current) return;
    const probeEls = probeContainerRef.current.querySelectorAll<HTMLElement>('[data-probe-word]');
    if (probeEls.length === 0) return;

    const lines: number[][] = [];
    let currentLine: number[] = [];
    let lastTop: number | null = null;
    const baseLineHeightMap: Record<string, number> = {
      sm: 44,
      md: 52,
      lg: 60,
      xl: 72
    };
    const minLineHeight = baseLineHeightMap[settings.fontSize] || 60;
    let detectedLineHeight = minLineHeight;

    probeEls.forEach((el, idx) => {
      const top = el.offsetTop;
      if (lastTop === null) {
        lastTop = top;
        currentLine.push(idx);
      } else if (top > lastTop + 6) {
        lines.push(currentLine);
        if (lines.length === 1) {
          detectedLineHeight = Math.max(minLineHeight, Math.round(top - lastTop));
        }
        lastTop = top;
        currentLine = [idx];
      } else {
        currentLine.push(idx);
      }
    });

    if (currentLine.length > 0) {
      lines.push(currentLine);
    }

    if (lines.length === 1 && probeEls[0]) {
      detectedLineHeight = Math.max(minLineHeight, Math.round(probeEls[0].offsetHeight * 1.35));
    }

    setLineWordIndices(lines);
    setLineHeightPx(detectedLineHeight);
  }, [settings.fontSize]);

  // Measure whenever target text, font size, font family, or session changes
  useEffect(() => {
    measureProbeLines();
    const frameId = requestAnimationFrame(() => {
      measureProbeLines();
    });

    if (document.fonts) {
      document.fonts.ready.then(() => {
        measureProbeLines();
      });
    }

    return () => cancelAnimationFrame(frameId);
  }, [targetText, settings.fontSize, settings.fontFamily, testSessionId, measureProbeLines]);

  // Recalculate on container resize via ResizeObserver
  useEffect(() => {
    if (!textContainerRef.current) return;
    const observer = new ResizeObserver(() => {
      measureProbeLines();
    });
    observer.observe(textContainerRef.current);
    return () => observer.disconnect();
  }, [measureProbeLines]);

  // Finish Test Calculation
  const finishTest = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    setIsTestActive(false);
    setContextTestActive(false);
    setIsTestFinished(true);

    const now = Date.now();
    const duration = startTime ? Math.max(1, (now - startTime) / 1000) : 1;

    // Calculate accuracy and characters
    let correctChars = 0;
    let incorrectChars = 0;
    const minLength = Math.min(typedText.length, targetText.length);

    for (let i = 0; i < minLength; i++) {
      if (typedText[i] === targetText[i]) {
        correctChars++;
      } else {
        incorrectChars++;
      }
    }

    const extraChars = Math.max(0, typedText.length - targetText.length);
    const totalTyped = typedText.length;
    const accuracy = totalTyped > 0 ? Math.round((correctChars / totalTyped) * 100) : 100;
    const finalWpm = Math.max(0, Math.round((correctChars / 5) / (duration / 60)));
    const finalRawWpm = Math.max(0, Math.round((totalTyped / 5) / (duration / 60)));

    // Calculate consistency (Standard deviation of inter-keystroke intervals)
    let consistency = 80;
    if (keystrokeTimestamps.current.length > 5) {
      const intervals: number[] = [];
      for (let i = 1; i < keystrokeTimestamps.current.length; i++) {
        intervals.push(keystrokeTimestamps.current[i] - keystrokeTimestamps.current[i - 1]);
      }
      const mean = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const variance = intervals.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / intervals.length;
      const stdDev = Math.sqrt(variance);
      // Coefficient of variation: lower is better consistency. Scale to 0-100%
      const cv = mean > 0 ? stdDev / mean : 0.5;
      consistency = Math.max(15, Math.min(100, Math.round(100 - cv * 60)));
    }

    const modeVal = 
      mode === 'time' ? `${timeOption}s` :
      mode === 'words' ? `${wordsOption}w` :
      mode === 'quote' ? `${quoteLength}` : 'custom';

    const resultData = addTestResult({
      mode,
      modeValue: modeVal,
      wpm: finalWpm,
      rawWpm: finalRawWpm,
      accuracy,
      consistency,
      durationSeconds: Math.round(duration),
      characters: {
        total: totalTyped,
        correct: correctChars,
        incorrect: incorrectChars,
        extra: extraChars
      },
      missedKeys: { ...missedKeysRef.current },
      history: historyRef.current.length > 0 ? [...historyRef.current] : [
        { second: 1, wpm: finalWpm, rawWpm: finalRawWpm, errors: incorrectChars }
      ],
      quoteAuthor: activeQuote?.author
    });

    setFinishedResult(resultData);
    playCompleteSound();
  }, [startTime, typedText, targetText, mode, timeOption, wordsOption, quoteLength, activeQuote, addTestResult, playCompleteSound]);

  // Interval for time countdown / elapsed metrics
  useEffect(() => {
    if (!isTestActive || !startTime) return;

    timerIntervalRef.current = window.setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - startTime) / 1000);
      setElapsedSeconds(elapsed);

      // Record second-by-second keystroke sample for the chart
      const currentTyped = typedText.length;
      let currentCorrect = 0;
      let currentErrors = 0;
      for (let i = 0; i < currentTyped; i++) {
        if (typedText[i] === targetText[i]) currentCorrect++;
        else currentErrors++;
      }
      const currentMin = Math.max(0.01, elapsed / 60);
      const instantWpm = Math.round((currentCorrect / 5) / currentMin);
      const instantRawWpm = Math.round((currentTyped / 5) / currentMin);

      historyRef.current.push({
        second: elapsed,
        wpm: instantWpm,
        rawWpm: instantRawWpm,
        errors: currentErrors
      });

      // Check time limit
      if (mode === 'time' && elapsed >= timeOption) {
        finishTest();
      }
    }, 1000);

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isTestActive, startTime, mode, timeOption, finishTest, typedText, targetText]);

  // Live Metrics Calculation
  const liveStats = useMemo(() => {
    if (!isTestActive || !startTime || elapsedSeconds === 0) {
      return { wpm: 0, rawWpm: 0, accuracy: 100, remainingTime: timeOption, correct: 0, errors: 0 };
    }

    let correct = 0;
    let errors = 0;
    const len = Math.min(typedText.length, targetText.length);
    for (let i = 0; i < len; i++) {
      if (typedText[i] === targetText[i]) correct++;
      else errors++;
    }

    const minElapsed = Math.max(0.02, elapsedSeconds / 60);
    const wpm = Math.round((correct / 5) / minElapsed);
    const rawWpm = Math.round((typedText.length / 5) / minElapsed);
    const accuracy = typedText.length > 0 ? Math.round((correct / typedText.length) * 100) : 100;
    const remainingTime = Math.max(0, timeOption - elapsedSeconds);

    return { wpm, rawWpm, accuracy, remainingTime, correct, errors };
  }, [isTestActive, startTime, elapsedSeconds, typedText, targetText, timeOption]);

  // Primary Input Handler (Keystroke Event)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Shortcuts: Tab followed by Enter to restart
    if (e.key === 'Tab') {
      e.preventDefault();
      tabPressedRef.current = true;
      setTimeout(() => {
        tabPressedRef.current = false;
      }, 1000);
      return;
    }

    if (e.key === 'Enter' && tabPressedRef.current) {
      e.preventDefault();
      tabPressedRef.current = false;
      resetTest(true);
      return;
    }

    // Escape resets test
    if (e.key === 'Escape') {
      e.preventDefault();
      resetTest(false);
      return;
    }

    if (isTestFinished) return;

    // Ignore modifier keys alone
    if (['Control', 'Alt', 'Meta', 'Shift', 'CapsLock'].includes(e.key)) {
      return;
    }

    const now = Date.now();
    keystrokeTimestamps.current.push(now);

    // Start timer on first genuine keystroke
    if (!isTestActive) {
      setIsTestActive(true);
      setContextTestActive(true);
      setStartTime(now);
    }

    setLastKeyPressed(e.key);
    setTimeout(() => setLastKeyPressed(null), 120);

    // Handle Backspace
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (typedText.length > 0) {
        setTypedText(prev => prev.slice(0, -1));
        playKeySound();
      }
      return;
    }

    // Handle normal single character key
    if (e.key.length === 1) {
      e.preventDefault();
      const nextIndex = typedText.length;
      const expectedChar = targetText[nextIndex];
      const typedChar = e.key;

      if (typedChar === expectedChar) {
        playKeySound();
      } else {
        playErrorSound();
        // Track missed key
        const expectedKey = expectedChar ? expectedChar.toLowerCase() : 'unknown';
        missedKeysRef.current[expectedKey] = (missedKeysRef.current[expectedKey] || 0) + 1;
      }

      const nextTyped = typedText + typedChar;
      setTypedText(nextTyped);

      // Check word mode or quote completion
      if (nextTyped.length >= targetText.length) {
        finishTest();
      }
    }
  };

  // Expected next character for Virtual Keyboard highlight
  const currentExpectedChar = targetText[typedText.length] || '';

  // Caret Styles Mapping - Dynamically uses the user-selected accent color
  const caretClasses = useMemo(() => {
    switch (settings.caretStyle) {
      case 'block':
        return 'inset-0 -mx-[2px] bg-accent/85 rounded-xs animate-caret-pulse z-0 pointer-events-none shadow-[0_0_10px_rgba(var(--accent-rgb),0.5)]';
      case 'underline':
        return 'left-0 right-0 -bottom-[1px] h-[3.5px] bg-accent rounded-full animate-caret-blink shadow-[0_0_8px_var(--accent-color)] z-10 pointer-events-none';
      case 'pulse':
        return 'w-[3px] -left-[2px] top-[10%] h-[80%] bg-accent rounded-full animate-caret-pulse shadow-[0_0_14px_var(--accent-color)] z-10 pointer-events-none';
      case 'line':
        return 'w-[1.5px] -left-[1px] top-[10%] h-[80%] bg-accent animate-caret-blink shadow-[0_0_4px_var(--accent-color)] z-10 pointer-events-none';
      case 'bar':
      default:
        return 'w-[2.5px] -left-[1.5px] top-[10%] h-[80%] bg-accent rounded-full animate-caret-blink shadow-[0_0_8px_var(--accent-color)] z-10 pointer-events-none';
    }
  }, [settings.caretStyle]);

  // Words tokenization for clean line wrapping and Monkeytype-style line-by-line scrolling
  const wordsList = useMemo(() => {
    const rawWords = targetText.split(' ');
    let globalIndex = 0;
    return rawWords.map((w, wIdx) => {
      const letters = w.split('').map((char, charIdx) => ({
        char,
        index: globalIndex + charIdx
      }));
      const hasSpace = wIdx < rawWords.length - 1;
      const spaceIndex = globalIndex + w.length;
      globalIndex += w.length + (hasSpace ? 1 : 0);
      return {
        wordIndex: wIdx,
        letters,
        hasSpace,
        spaceIndex
      };
    });
  }, [targetText]);

  // Active word index based on cursor position
  const currentWordIndex = useMemo(() => {
    const len = typedText.length;
    for (let i = 0; i < wordsList.length; i++) {
      const w = wordsList[i];
      const lastIndex = w.hasSpace
        ? w.spaceIndex
        : (w.letters[w.letters.length - 1]?.index ?? w.spaceIndex);
      if (len <= lastIndex) {
        return i;
      }
    }
    return Math.max(0, wordsList.length - 1);
  }, [typedText.length, wordsList]);

  // Active line index calculated from word-to-line grouping
  const activeLineIndex = useMemo(() => {
    if (lineWordIndices.length === 0) return 0;
    for (let lineIdx = 0; lineIdx < lineWordIndices.length; lineIdx++) {
      if (lineWordIndices[lineIdx].includes(currentWordIndex)) {
        return lineIdx;
      }
    }
    return Math.max(0, lineWordIndices.length - 1);
  }, [lineWordIndices, currentWordIndex]);

  // Sliding window: only render the active line and the next line,
  // plus the completing line during exit transition
  const slidingWindowLines = useMemo(() => {
    if (lineWordIndices.length === 0) {
      // Fallback: single line with all words while probe is measuring
      return [{ lineIdx: 0, wordIndices: wordsList.map(w => w.wordIndex) }];
    }

    const linesToRender: Array<{ lineIdx: number; wordIndices: number[] }> = [];

    // Completed line (animates shifting upwards and fading out)
    if (activeLineIndex > 0) {
      linesToRender.push({
        lineIdx: activeLineIndex - 1,
        wordIndices: lineWordIndices[activeLineIndex - 1]
      });
    }

    // Current line (active, highlighted characters, typing cursor)
    if (activeLineIndex < lineWordIndices.length) {
      linesToRender.push({
        lineIdx: activeLineIndex,
        wordIndices: lineWordIndices[activeLineIndex]
      });
    }

    // Next line (preview line, upcoming characters)
    if (activeLineIndex + 1 < lineWordIndices.length) {
      linesToRender.push({
        lineIdx: activeLineIndex + 1,
        wordIndices: lineWordIndices[activeLineIndex + 1]
      });
    }

    // Next + 1 line (enters from below into preview slot)
    if (activeLineIndex + 2 < lineWordIndices.length) {
      linesToRender.push({
        lineIdx: activeLineIndex + 2,
        wordIndices: lineWordIndices[activeLineIndex + 2]
      });
    }

    return linesToRender;
  }, [lineWordIndices, activeLineIndex, wordsList]);

  // Previous best WPM for ghost pacing layer
  const previousBestWpm = useMemo(() => {
    const matching = results.filter(r => r.mode === mode);
    if (matching.length > 0) {
      return Math.max(...matching.map(r => r.wpm));
    }
    if (personalBestWpm > 0) return personalBestWpm;
    return 60; // Default gentle pacing baseline if no prior tests recorded
  }, [results, mode, personalBestWpm]);

  // Ghosting progress in characters based on previous best WPM
  const [ghostIndex, setGhostIndex] = useState<number>(0);

  useEffect(() => {
    if (!isTestActive || !startTime || !settings.ghostingEnabled) {
      setGhostIndex(0);
      return;
    }

    const interval = setInterval(() => {
      const elapsedSec = (Date.now() - startTime) / 1000;
      // Target characters = (WPM * 5 chars per word) * (elapsedSec / 60)
      const targetChars = Math.floor((previousBestWpm * 5) * (elapsedSec / 60));
      setGhostIndex(Math.min(targetText.length, targetChars));
    }, 60);

    return () => clearInterval(interval);
  }, [isTestActive, startTime, settings.ghostingEnabled, previousBestWpm, targetText.length]);

  // Font size mapping for typing text
  const fontSizeClass = useMemo(() => {
    switch (settings.fontSize) {
      case 'sm': return 'text-xl sm:text-2xl leading-relaxed tracking-normal';
      case 'md': return 'text-2xl sm:text-3xl leading-relaxed tracking-normal';
      case 'xl': return 'text-4xl sm:text-5xl leading-relaxed tracking-normal';
      case 'lg':
      default: return 'text-3xl sm:text-4xl leading-relaxed tracking-normal';
    }
  }, [settings.fontSize]);

  return (
    <div className="w-full flex flex-col items-center justify-start min-h-[calc(100vh-80px)] py-4 sm:py-8 px-4 max-w-5xl mx-auto">
      
      {/* If test is finished, render Results Screen */}
      {isTestFinished && finishedResult ? (
        <ResultsModal
          result={finishedResult}
          onRetry={() => resetTest(true)}
          onNewTest={() => resetTest(false)}
          onPracticeWeakKeys={() => {
            const keys = Object.keys(finishedResult.missedKeys);
            if (keys.length > 0) {
              // Generate custom drill words containing these keys
              const drill = keys.map(k => `${k}${k} ${k}e ${k}a ${k}o`).join(' ');
              setPracticeTargetWords(drill);
              resetTest(false);
            }
          }}
        />
      ) : (
        <>
          {/* Mode Selector and Controls Deck */}
          <div className={`w-full max-w-4xl flex flex-wrap items-center justify-between gap-3 mb-4 p-2.5 rounded-2xl bg-zinc-950/90 border border-zinc-800/90 transition-all duration-300 shadow-md ${
            settings.focusMode && isTestActive
              ? 'opacity-0 pointer-events-none max-h-0 py-0 mb-0 overflow-hidden border-transparent'
              : isTestActive ? 'opacity-35 hover:opacity-100' : 'opacity-100'
          }`}>
            
            {/* Mode Tabs */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => { setMode('time'); setPracticeTargetWords(null); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  mode === 'time' && !practiceTargetWords
                    ? 'bg-zinc-800 text-white border border-zinc-700 shadow-xs font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <Clock className={`w-3.5 h-3.5 ${mode === 'time' && !practiceTargetWords ? 'text-accent' : ''}`} />
                <span>Time</span>
              </button>

              <button
                onClick={() => { setMode('words'); setPracticeTargetWords(null); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  mode === 'words' && !practiceTargetWords
                    ? 'bg-zinc-800 text-white border border-zinc-700 shadow-xs font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <FileText className={`w-3.5 h-3.5 ${mode === 'words' && !practiceTargetWords ? 'text-accent' : ''}`} />
                <span>Words</span>
              </button>

              <button
                onClick={() => { setMode('quote'); setPracticeTargetWords(null); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  mode === 'quote' && !practiceTargetWords
                    ? 'bg-zinc-800 text-white border border-zinc-700 shadow-xs font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <QuoteIcon className={`w-3.5 h-3.5 ${mode === 'quote' && !practiceTargetWords ? 'text-accent' : ''}`} />
                <span>Quote</span>
              </button>

              <button
                onClick={() => {
                  setMode('custom');
                  setIsCustomModalOpen(true);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  mode === 'custom' || practiceTargetWords
                    ? 'bg-zinc-800 text-white border border-zinc-700 shadow-xs font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <Edit3 className={`w-3.5 h-3.5 ${mode === 'custom' || practiceTargetWords ? 'text-accent' : ''}`} />
                <span>Custom</span>
              </button>
            </div>

            {/* Mode-Specific Sub-Options */}
            <div className="flex items-center gap-2">
              {mode === 'time' && !practiceTargetWords && (
                <div className="flex items-center gap-1 bg-zinc-900 p-0.5 rounded-xl border border-zinc-800">
                  {([15, 30, 60, 120] as TimeOption[]).map(t => (
                    <button
                      key={t}
                      onClick={() => setTimeOption(t)}
                      className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors tabular-nums cursor-pointer ${
                        timeOption === t
                          ? 'bg-zinc-800 text-accent border border-zinc-700 font-bold shadow-xs'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {t}s
                    </button>
                  ))}
                </div>
              )}

              {mode === 'words' && !practiceTargetWords && (
                <div className="flex items-center gap-1 bg-zinc-900 p-0.5 rounded-xl border border-zinc-800">
                  {([10, 25, 50, 100] as WordsOption[]).map(w => (
                    <button
                      key={w}
                      onClick={() => setWordsOption(w)}
                      className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors tabular-nums cursor-pointer ${
                        wordsOption === w
                          ? 'bg-zinc-800 text-accent border border-zinc-700 font-bold shadow-xs'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              )}

              {mode === 'quote' && !practiceTargetWords && (
                <div className="flex items-center gap-1 bg-zinc-900 p-0.5 rounded-xl border border-zinc-800">
                  {(['short', 'medium', 'long'] as QuoteLength[]).map(ql => (
                    <button
                      key={ql}
                      onClick={() => setQuoteLength(ql)}
                      className={`px-2.5 py-1 text-xs font-medium rounded-lg capitalize transition-colors cursor-pointer ${
                        quoteLength === ql
                          ? 'bg-zinc-800 text-accent border border-zinc-700 font-bold shadow-xs'
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {ql}
                    </button>
                  ))}
                </div>
              )}

              {/* Toggles: Punctuation and Numbers */}
              {mode !== 'quote' && !practiceTargetWords && (
                <div className="flex items-center gap-1 border-l border-zinc-800 pl-2">
                  <button
                    onClick={() => setHasPunctuation(p => !p)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                      hasPunctuation
                        ? 'bg-zinc-800 text-accent border border-zinc-700 font-semibold'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                    }`}
                    title="Toggle punctuation marks"
                  >
                    @ punctuation
                  </button>
                  <button
                    onClick={() => setHasNumbers(n => !n)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                      hasNumbers
                        ? 'bg-zinc-800 text-accent border border-zinc-700 font-semibold'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                    }`}
                    title="Toggle number digits"
                  >
                    # numbers
                  </button>
                </div>
              )}

              {/* Virtual Keyboard Toggle */}
              <button
                onClick={() => updateSettings({ showVirtualKeyboard: !settings.showVirtualKeyboard })}
                className={`p-1.5 rounded-xl border transition-all cursor-pointer ${
                  settings.showVirtualKeyboard
                    ? 'text-accent bg-zinc-800 border-zinc-700 shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border-transparent'
                }`}
                title="Toggle on-screen visual keyboard"
              >
                <KeyboardIcon className="w-4 h-4" />
              </button>

              {/* Focus Mode Toggle */}
              <button
                onClick={() => updateSettings({ focusMode: !settings.focusMode })}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl transition-all cursor-pointer text-xs font-medium border ${
                  settings.focusMode
                    ? 'text-accent bg-zinc-800 border-zinc-700 font-semibold shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border-transparent'
                }`}
                title={settings.focusMode ? 'Focus Mode active (hides header, footer, and stats during test)' : 'Enable Focus Mode (hides header, footer, and stats during test)'}
              >
                <EyeOff className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[11px]">Focus Mode</span>
              </button>

              {/* Ghosting Pacer Toggle */}
              <button
                onClick={() => updateSettings({ ghostingEnabled: !settings.ghostingEnabled })}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl transition-all cursor-pointer text-xs font-medium border ${
                  settings.ghostingEnabled
                    ? 'text-accent bg-zinc-800 border-zinc-700 font-semibold shadow-xs'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border-transparent'
                }`}
                title={`Ghosting Pacer: Shows previous best pace (${previousBestWpm} WPM) as translucent text layer`}
              >
                <Ghost className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[11px]">Ghost ({previousBestWpm})</span>
              </button>
            </div>
          </div>

          {/* Active Custom Words Banner */}
          {practiceTargetWords && (
            <div className="flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300 animate-in fade-in">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Targeted drill active</span>
              <button
                onClick={() => {
                  setPracticeTargetWords(null);
                  resetTest(false);
                }}
                className="underline font-semibold ml-1 hover:text-amber-900 dark:hover:text-amber-100 cursor-pointer"
              >
                Clear
              </button>
            </div>
          )}

          {/* Live Telemetry Bar - Hides in Focus Mode during active typing */}
          <div className={`w-full max-w-3xl flex items-center justify-between px-2 mb-4 text-xs font-medium text-zinc-400 transition-all duration-300 ${
            settings.focusMode && isTestActive
              ? 'opacity-0 pointer-events-none max-h-0 mb-0 overflow-hidden'
              : 'opacity-100'
          }`}>
            <div className="flex items-center gap-5 tabular-nums">
              {mode === 'time' && (
                <div className="flex items-center gap-1.5">
                  <span className="text-zinc-500">Time:</span>
                  <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                    {isTestActive ? liveStats.remainingTime : timeOption}s
                  </span>
                </div>
              )}

              {mode === 'words' && (
                <div className="flex items-center gap-1.5">
                  <span className="text-zinc-500">Words:</span>
                  <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                    {typedText.trim().split(/\s+/).filter(Boolean).length} / {wordsOption}
                  </span>
                </div>
              )}

              {isTestActive && (
                <>
                  <div className="flex items-center gap-1.5">
                    <span className="text-zinc-500">WPM:</span>
                    <span className="text-sm font-extrabold text-accent">
                      {liveStats.wpm}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-zinc-500">Acc:</span>
                    <span className="text-sm font-bold text-emerald-400">
                      {liveStats.accuracy}%
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Restart Button & Shortcut Indicator */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => resetTest(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-zinc-400 hover:text-zinc-200 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 transition-colors cursor-pointer"
                title="Restart test (Tab then Enter)"
              >
                <RotateCcw className="w-3.5 h-3.5 text-accent" />
                <span className="text-[11px] font-medium">Restart</span>
              </button>
            </div>
          </div>

          {/* Centered Distraction-Free Linear Typing Stage */}
          <div
            onClick={focusInput}
            className="relative w-full max-w-4xl rounded-3xl mt-8 sm:mt-12 mb-8 sm:mb-10 py-8 sm:py-10 px-8 sm:px-12 cursor-text select-none bg-zinc-950/90 border border-zinc-800 shadow-2xl backdrop-blur-md transition-all group"
          >
            {/* Hidden Input for Keyboard Capture (Touch + Physical) */}
            <input
              ref={inputRef}
              type="text"
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck="false"
              className="absolute opacity-0 -top-40 left-0 w-1 h-1 pointer-events-none"
              onKeyDown={handleKeyDown}
              tabIndex={0}
            />

            {/* Focused Linear Typing View (Sliding Window: Current & Next Line) */}
            <div
              ref={textContainerRef}
              className={`relative overflow-hidden select-none font-normal text-center transition-colors px-4 sm:px-6 ${fontSizeClass}`}
              style={{
                fontFamily: 'var(--font-custom)',
                height: `${lineHeightPx * 2}px`
              }}
            >
              {/* Invisible Layout Probe to measure exact natural word line wrapping with safety margins */}
              <div
                ref={probeContainerRef}
                aria-hidden="true"
                className="absolute left-0 top-0 w-full invisible pointer-events-none -z-50 select-none text-center px-4 sm:px-6"
              >
                <div className="w-[86%] max-w-[800px] mx-auto text-center">
                  {wordsList.map(wordObj => (
                    <span
                      key={`probe-${wordObj.wordIndex}`}
                      data-probe-word={wordObj.wordIndex}
                      className="inline-block whitespace-nowrap mr-[0.3em]"
                    >
                      {wordObj.letters.map(l => l.char).join('')}
                      {wordObj.hasSpace ? ' ' : ''}
                    </span>
                  ))}
                </div>
              </div>

              {/* Render only lines in the sliding window */}
              {slidingWindowLines.map(({ lineIdx, wordIndices }) => {
                const lineDelta = lineIdx - activeLineIndex;
                // lineDelta === -1: completed line, shifted upwards and fading out
                // lineDelta === 0: current active line in top slot, opacity 1
                // lineDelta === 1: next line preview in bottom slot, opacity 0.42
                // lineDelta >= 2: upcoming line entering from below, opacity 0

                const yOffset = lineDelta * lineHeightPx;
                const isCurrentLine = lineDelta === 0;
                const isNextLine = lineDelta === 1;

                const lineOpacity = isCurrentLine ? 1 : isNextLine ? 0.42 : 0;
                const transitionClass = settings.reducedMotion
                  ? 'transition-none'
                  : 'transition-all duration-300 ease-out';

                return (
                  <div
                    key={`line-${lineIdx}`}
                    className={`absolute left-0 top-0 w-full px-4 sm:px-6 flex items-center justify-center flex-nowrap whitespace-nowrap text-center ${transitionClass} will-change-transform`}
                    style={{
                      transform: `translate3d(0, ${yOffset}px, 0)`,
                      opacity: lineOpacity,
                      height: `${lineHeightPx}px`,
                      pointerEvents: isCurrentLine ? 'auto' : 'none'
                    }}
                  >
                    {wordIndices.map(wIdx => {
                      const wordObj = wordsList[wIdx];
                      if (!wordObj) return null;
                      const isWordActive = wordObj.wordIndex === currentWordIndex;

                      return (
                        <span
                          key={wordObj.wordIndex}
                          ref={isWordActive ? activeWordRef : null}
                          data-word-idx={wordObj.wordIndex}
                          className="inline-block whitespace-nowrap mr-[0.28em]"
                        >
                          {wordObj.letters.map(letter => {
                            const isTyped = letter.index < typedText.length;
                            const isCurrent = letter.index === typedText.length;
                            const isCorrect = isTyped && typedText[letter.index] === letter.char;
                            const isIncorrect = isTyped && !isCorrect;

                            // Ghosting pacing calculations
                            const isGhostPaced = settings.ghostingEnabled && isTestActive && letter.index < ghostIndex;
                            const isGhostCaret = settings.ghostingEnabled && isTestActive && letter.index === ghostIndex;

                            return (
                              <span
                                key={letter.index}
                                ref={isCurrent ? activeCharRef : null}
                                className={`relative inline-block transition-colors duration-75 ${
                                  isCorrect
                                    ? 'text-zinc-100 font-medium'
                                    : isIncorrect
                                      ? settings.highlightErrors
                                        ? 'text-rose-400 bg-rose-500/15 rounded-xs font-medium'
                                        : 'text-rose-400 font-medium'
                                      : isCurrent && settings.caretStyle === 'block'
                                        ? 'text-zinc-950 font-bold relative z-10'
                                        : 'text-zinc-500'
                                }`}
                              >
                                {/* Ghost Pacing Translucent Text Layer */}
                                {isGhostPaced && !isTyped && (
                                  <span className="absolute inset-0 -inset-x-0.5 bg-indigo-500/15 rounded-xs pointer-events-none -z-10" />
                                )}

                                {/* Ghost Pacing Caret (Previous Best) */}
                                {isGhostCaret && (
                                  <span 
                                    className="absolute -left-[1px] top-[18%] h-[68%] w-[2px] bg-indigo-500/80 rounded-full pointer-events-none animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.6)] z-10"
                                    title={`Ghost Pacer (${previousBestWpm} WPM)`}
                                  >
                                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-1 py-0.2 rounded-xs bg-indigo-600 text-[8px] font-mono text-white font-bold tracking-tighter opacity-80 whitespace-nowrap shadow-xs">
                                      PB
                                    </span>
                                  </span>
                                )}

                                {/* Render active caret before current untyped character */}
                                {isCurrent && (
                                  <span className={`absolute ${caretClasses}`} />
                                )}

                                {letter.char}
                              </span>
                            );
                          })}

                          {/* Trailing space after word */}
                          {wordObj.hasSpace && (() => {
                            const isGhostSpaceCaret = settings.ghostingEnabled && isTestActive && wordObj.spaceIndex === ghostIndex;
                            const isSpaceCurrent = wordObj.spaceIndex === typedText.length;
                            return (
                              <span
                                ref={isSpaceCurrent ? activeCharRef : null}
                                className="relative inline-block w-[0.25em]"
                              >
                                {/* Ghost Space Caret */}
                                {isGhostSpaceCaret && (
                                  <span 
                                    className="absolute -left-[1px] top-[18%] h-[68%] w-[2px] bg-indigo-500/80 rounded-full pointer-events-none animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.6)] z-10"
                                    title={`Ghost Pacer (${previousBestWpm} WPM)`}
                                  >
                                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-1 py-0.2 rounded-xs bg-indigo-600 text-[8px] font-mono text-white font-bold tracking-tighter opacity-80 whitespace-nowrap shadow-xs">
                                      PB
                                    </span>
                                  </span>
                                )}

                                {isSpaceCurrent && (
                                  <span className={`absolute ${settings.caretStyle === 'block' ? 'inset-0 w-[0.55em] -left-[1px] bg-accent/85 rounded-xs animate-caret-pulse z-0 pointer-events-none shadow-[0_0_10px_rgba(var(--accent-rgb),0.5)]' : caretClasses}`} />
                                )}
                                &nbsp;
                              </span>
                            );
                          })()}
                        </span>
                      );
                    })}

                    {/* Trailing caret if end reached on current line */}
                    {isCurrentLine && typedText.length >= targetText.length && (
                      <span className="relative inline-block w-[2px] h-[1em]">
                        <span className={`absolute ${caretClasses}`} />
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Author Attribution for Quote Mode */}
            {activeQuote && (
              <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/60 text-right">
                <span className="text-xs italic text-zinc-400">— {activeQuote.author}</span>
              </div>
            )}

            {/* Click to Focus Hint on Idle */}
            {!isTestActive && typedText.length === 0 && (
              <div className="absolute inset-x-0 bottom-3 text-center pointer-events-none">
                <span className="text-[11px] text-zinc-400/70 tracking-wide font-medium">
                  Click here or press any key to start typing
                </span>
              </div>
            )}
          </div>

          {/* Quick Shortcuts Hint */}
          <div className="mt-4 text-center">
            <span className="text-[11px] text-zinc-400/80 font-mono">
              tab + enter — restart test · esc — reset
            </span>
          </div>

          {/* Interactive Virtual Keyboard */}
          {settings.showVirtualKeyboard && (
            <div className="w-full max-w-4xl mt-6 animate-in fade-in duration-300">
              <VirtualKeyboard
                expectedKey={currentExpectedChar}
                activeKeyPressed={lastKeyPressed}
              />
            </div>
          )}
        </>
      )}

      {/* Custom Text Modal */}
      <CustomTextModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onApply={(text) => {
          setCustomTextString(text);
          setMode('custom');
          setPracticeTargetWords(null);
          resetTest(false);
        }}
      />
    </div>
  );
};
