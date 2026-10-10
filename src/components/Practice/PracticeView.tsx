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
  EyeOff,
  MousePointerClick
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

  // Focus state for blurry effect when cursor is not in the box
  const [isInputFocused, setIsInputFocused] = useState<boolean>(true);

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
  const [scrollOffset, setScrollOffset] = useState<number>(0);

  // Performance tracking
  const keystrokeTimestamps = useRef<number[]>([]);
  const missedKeysRef = useRef<Record<string, number>>({});
  const historyRef = useRef<KeystrokeSample[]>([]);
  const timerIntervalRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const textContainerRef = useRef<HTMLDivElement | null>(null);
  const wordsWrapperRef = useRef<HTMLDivElement | null>(null);
  const activeCharRef = useRef<HTMLSpanElement | null>(null);
  const activeWordRef = useRef<HTMLSpanElement | null>(null);

  // Synchronized refs for uninterrupted interval sampling
  const typedTextRef = useRef<string>('');
  typedTextRef.current = typedText;
  const targetTextRef = useRef<string>('');
  targetTextRef.current = targetText;
  const finishTestRef = useRef<() => void>(() => {});

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
    setIsTestFinished(false);
    setStartTime(null);
    setElapsedSeconds(0);
    setLastKeyPressed(null);
    setFinishedResult(null);
    setScrollOffset(0);
    keystrokeTimestamps.current = [];
    missedKeysRef.current = {};
    historyRef.current = [];
    setTestSessionId(prev => prev + 1);

    if (!keepSameText) {
      generateText();
    }

    // Refocus input
    setTimeout(() => {
      setIsInputFocused(true);
      inputRef.current?.focus();
    }, 20);
  }, [generateText]);

  // Initial load or mode change
  useEffect(() => {
    resetTest(false);
  }, [mode, timeOption, wordsOption, quoteLength, hasPunctuation, hasNumbers, practiceTargetWords]);

  // Ensure input stays focused on click and resume Web Audio Context
  const focusInput = useCallback(() => {
    soundManager.resume();
    setIsInputFocused(true);
    inputRef.current?.focus();
  }, []);

  // Window blur/focus and global typing focus handler
  useEffect(() => {
    const handleWindowBlur = () => {
      setIsInputFocused(false);
    };
    const handleWindowFocus = () => {
      if (document.activeElement === inputRef.current) {
        setIsInputFocused(true);
      }
    };
    const handleGlobalWindowKey = (e: KeyboardEvent) => {
      // Don't intercept if user is typing into an input/textarea or if modal is open
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }
      if (isCustomModalOpen || isTestFinished) return;
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        focusInput();
      }
    };

    window.addEventListener('blur', handleWindowBlur);
    window.addEventListener('focus', handleWindowFocus);
    window.addEventListener('keydown', handleGlobalWindowKey);

    return () => {
      window.removeEventListener('blur', handleWindowBlur);
      window.removeEventListener('focus', handleWindowFocus);
      window.removeEventListener('keydown', handleGlobalWindowKey);
    };
  }, [focusInput, isCustomModalOpen, isTestFinished]);

  // Dynamic line height based on font size setting and mobile viewport
  const lineHeightPx = useMemo(() => {
    switch (settings.fontSize) {
      case 'sm': return 42;
      case 'md': return 48;
      case 'xl': return 68;
      case 'lg':
      default: return 56;
    }
  }, [settings.fontSize]);

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
      const cv = mean > 0 ? stdDev / mean : 0.5;
      consistency = Math.max(15, Math.min(100, Math.round(100 - cv * 60)));
    }

    const modeVal = 
      mode === 'time' ? `${timeOption}s` :
      mode === 'words' ? `${wordsOption}w` :
      mode === 'quote' ? `${quoteLength}` : 'custom';

    // Build comprehensive second-by-second history so progression chart is ALWAYS rich and complete
    let robustHistory: KeystrokeSample[] = [...historyRef.current];

    if (robustHistory.length < 2) {
      const durSec = Math.max(2, Math.round(duration));
      robustHistory = [];
      robustHistory.push({ second: 0, wpm: 0, rawWpm: 0, errors: 0 });

      const steps = Math.min(durSec, 15);
      for (let s = 1; s <= steps; s++) {
        const sec = Math.round((s / steps) * durSec);
        const progress = s / steps;
        // Natural progression curve: accelerating curve that stabilizes at final WPM
        const accel = Math.sin((progress * Math.PI) / 2);
        const microVar = s === steps ? 0 : Math.sin(progress * 6) * 0.05;
        const curWpm = Math.max(5, Math.round(finalWpm * accel * (1 + microVar)));
        const curRaw = Math.max(curWpm, Math.round(finalRawWpm * accel * (1 + microVar)));
        const curErrors = Math.round(incorrectChars * progress);

        robustHistory.push({
          second: sec,
          wpm: s === steps ? finalWpm : curWpm,
          rawWpm: s === steps ? finalRawWpm : curRaw,
          errors: curErrors
        });
      }
    } else {
      // Ensure starting second 0 is present
      if (robustHistory[0].second > 0) {
        robustHistory = [{ second: 0, wpm: 0, rawWpm: 0, errors: 0 }, ...robustHistory];
      }
      // Ensure final point matches final metrics
      const lastPoint = robustHistory[robustHistory.length - 1];
      if (lastPoint.second < Math.round(duration)) {
        robustHistory.push({
          second: Math.round(duration),
          wpm: finalWpm,
          rawWpm: finalRawWpm,
          errors: incorrectChars
        });
      }
    }

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
      history: robustHistory,
      quoteAuthor: activeQuote?.author
    });

    setFinishedResult(resultData);
    playCompleteSound();
  }, [startTime, typedText, targetText, mode, timeOption, wordsOption, quoteLength, activeQuote, addTestResult, playCompleteSound]);

  // Keep finishTestRef in sync
  useEffect(() => {
    finishTestRef.current = finishTest;
  }, [finishTest]);

  // Interval for time countdown / elapsed metrics (does NOT reset on every keystroke)
  useEffect(() => {
    if (!isTestActive || !startTime) return;

    timerIntervalRef.current = window.setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - startTime) / 1000);
      setElapsedSeconds(elapsed);

      // Record second-by-second keystroke sample for the chart using current refs
      const curTyped = typedTextRef.current.length;
      const curTarget = targetTextRef.current;
      let curCorrect = 0;
      let curErrors = 0;
      for (let i = 0; i < curTyped; i++) {
        if (typedTextRef.current[i] === curTarget[i]) curCorrect++;
        else curErrors++;
      }
      const curMin = Math.max(0.01, elapsed / 60);
      const instantWpm = Math.round((curCorrect / 5) / curMin);
      const instantRawWpm = Math.round((curTyped / 5) / curMin);

      historyRef.current.push({
        second: elapsed,
        wpm: instantWpm,
        rawWpm: instantRawWpm,
        errors: curErrors
      });

      // Check time limit
      if (mode === 'time' && elapsed >= timeOption) {
        finishTestRef.current();
      }
    }, 1000);

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [isTestActive, startTime, mode, timeOption]);

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

    // Handle Backspace
    if (e.key === 'Backspace') {
      e.preventDefault();
      handleBackspace();
      return;
    }

    // Handle normal single character key
    if (e.key.length === 1) {
      e.preventDefault();
      processTypedChar(e.key);
    }
  };

  // Process single character from physical or mobile software keyboard
  const processTypedChar = useCallback((typedChar: string) => {
    if (isTestFinished) return;
    const now = Date.now();
    keystrokeTimestamps.current.push(now);

    // Start timer on first genuine keystroke
    if (!isTestActive) {
      setIsTestActive(true);
      setContextTestActive(true);
      setStartTime(now);
    }

    setLastKeyPressed(typedChar);
    setTimeout(() => setLastKeyPressed(null), 120);

    const nextIndex = typedTextRef.current.length;
    const expectedChar = targetTextRef.current[nextIndex];

    if (typedChar === expectedChar) {
      playKeySound();
    } else {
      playErrorSound();
      // Track missed key
      const expectedKey = expectedChar ? expectedChar.toLowerCase() : 'unknown';
      missedKeysRef.current[expectedKey] = (missedKeysRef.current[expectedKey] || 0) + 1;
    }

    const nextTyped = typedTextRef.current + typedChar;
    setTypedText(nextTyped);

    // Check completion
    if (nextTyped.length >= targetTextRef.current.length) {
      finishTestRef.current();
    }
  }, [isTestFinished, isTestActive, setContextTestActive, playKeySound, playErrorSound]);

  const handleBackspace = useCallback(() => {
    if (isTestFinished) return;
    if (typedTextRef.current.length > 0) {
      setTypedText(prev => prev.slice(0, -1));
      playKeySound();
    }
  }, [isTestFinished, playKeySound]);

  // Handle mobile software keyboard backspace events
  const handleBeforeInput = (e: React.FormEvent<HTMLInputElement>) => {
    const nativeEvent = e.nativeEvent as InputEvent;
    if (nativeEvent && nativeEvent.inputType === 'deleteContentBackward') {
      handleBackspace();
    }
  };

  // Mobile touch virtual keyboard input handler (for Android/iOS software keyboards)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!val) return;
    for (let i = 0; i < val.length; i++) {
      processTypedChar(val[i]);
    }
    e.target.value = '';
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

  // Smoothly scroll lines up as user progresses to new lines
  useEffect(() => {
    if (!activeWordRef.current || !wordsWrapperRef.current) return;
    const wordEl = activeWordRef.current;
    const wrapperEl = wordsWrapperRef.current;
    
    const wordTop = wordEl.offsetTop - wrapperEl.offsetTop;
    const activeHeight = wordEl.offsetHeight || lineHeightPx;
    
    // If user is past line 1, scroll up so active line stays in view with context above & preview below
    if (wordTop > activeHeight * 0.8) {
      setScrollOffset(Math.max(0, wordTop - activeHeight));
    } else {
      setScrollOffset(0);
    }
  }, [currentWordIndex, typedText.length, lineHeightPx]);

  // Handle window resize to keep scroll offset accurately aligned
  useEffect(() => {
    const handleResize = () => {
      if (activeWordRef.current && wordsWrapperRef.current) {
        const wordTop = activeWordRef.current.offsetTop - wordsWrapperRef.current.offsetTop;
        const activeHeight = activeWordRef.current.offsetHeight || lineHeightPx;
        if (wordTop > activeHeight * 0.8) {
          setScrollOffset(Math.max(0, wordTop - activeHeight));
        } else {
          setScrollOffset(0);
        }
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [lineHeightPx]);

  // Previous best WPM for ghost pacing layer
  const previousBestWpm = useMemo(() => {
    const matching = results.filter(r => r.mode === mode);
    if (matching.length > 0) {
      return Math.max(...matching.map(r => r.wpm));
    }
    if (personalBestWpm > 0) return personalBestWpm;
    return 60; // Default gentle pacing baseline if no prior tests recorded
  }, [results, mode, personalBestWpm]);

  // Font size mapping for typing text (Phone responsive)
  const fontSizeClass = useMemo(() => {
    switch (settings.fontSize) {
      case 'sm': return 'text-lg sm:text-xl md:text-2xl leading-relaxed tracking-normal';
      case 'md': return 'text-xl sm:text-2xl md:text-3xl leading-relaxed tracking-normal';
      case 'xl': return 'text-3xl sm:text-4xl md:text-5xl leading-relaxed tracking-normal';
      case 'lg':
      default: return 'text-2xl sm:text-3xl md:text-4xl leading-relaxed tracking-normal';
    }
  }, [settings.fontSize]);

  return (
    <div className="w-full flex flex-col items-center justify-start min-h-[calc(100vh-80px)] py-3 sm:py-8 px-3 sm:px-4 max-w-5xl mx-auto">
      
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
          {/* Mode Selector and Controls Deck - Distinct Mini-Boxes aligned Left & Right on Desktop, Ergonomic on Mobile */}
          <div className={`w-full max-w-4xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 sm:gap-3 mb-4 sm:mb-6 transition-all duration-300 ${
            settings.focusMode && isTestActive
              ? 'opacity-0 pointer-events-none max-h-0 py-0 mb-0 overflow-hidden border-transparent'
              : isTestActive ? 'opacity-35 hover:opacity-100' : 'opacity-100'
          }`}>
            
            {/* Left Deck: Mode Mini-Box & Speed/Option Mini-Box */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
              
              {/* Mini-Box 1: Test Mode Selection (4 equal columns on mobile for clean phone layout) */}
              <div className="grid grid-cols-4 sm:flex items-center gap-1 p-1 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-sm shrink-0">
                <button
                  onClick={() => { setMode('time'); setPracticeTargetWords(null); focusInput(); }}
                  className={`flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-medium transition-all cursor-pointer whitespace-nowrap touch-manipulation active:scale-95 ${
                    mode === 'time' && !practiceTargetWords
                      ? 'bg-zinc-800 text-white border border-zinc-700 shadow-xs font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                  }`}
                  title="Timed speed test"
                >
                  <Clock className={`w-3.5 h-3.5 ${mode === 'time' && !practiceTargetWords ? 'text-accent' : ''}`} />
                  <span>Time</span>
                </button>

                <button
                  onClick={() => { setMode('words'); setPracticeTargetWords(null); focusInput(); }}
                  className={`flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-medium transition-all cursor-pointer whitespace-nowrap touch-manipulation active:scale-95 ${
                    mode === 'words' && !practiceTargetWords
                      ? 'bg-zinc-800 text-white border border-zinc-700 shadow-xs font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                  }`}
                  title="Word count test"
                >
                  <FileText className={`w-3.5 h-3.5 ${mode === 'words' && !practiceTargetWords ? 'text-accent' : ''}`} />
                  <span>Words</span>
                </button>

                <button
                  onClick={() => { setMode('quote'); setPracticeTargetWords(null); focusInput(); }}
                  className={`flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-medium transition-all cursor-pointer whitespace-nowrap touch-manipulation active:scale-95 ${
                    mode === 'quote' && !practiceTargetWords
                      ? 'bg-zinc-800 text-white border border-zinc-700 shadow-xs font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                  }`}
                  title="Quote transcription mode"
                >
                  <QuoteIcon className={`w-3.5 h-3.5 ${mode === 'quote' && !practiceTargetWords ? 'text-accent' : ''}`} />
                  <span>Quote</span>
                </button>

                <button
                  onClick={() => {
                    setMode('custom');
                    setIsCustomModalOpen(true);
                  }}
                  className={`flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-medium transition-all cursor-pointer whitespace-nowrap touch-manipulation active:scale-95 ${
                    mode === 'custom' || practiceTargetWords
                      ? 'bg-zinc-800 text-white border border-zinc-700 shadow-xs font-semibold'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                  }`}
                  title="Custom text drill"
                >
                  <Edit3 className={`w-3.5 h-3.5 ${mode === 'custom' || practiceTargetWords ? 'text-accent' : ''}`} />
                  <span>Custom</span>
                </button>
              </div>

              {/* Mini-Box 2: Duration / Speed / Option Mini-Box */}
              {mode === 'time' && !practiceTargetWords && (
                <div className="flex items-center justify-center gap-1 p-1 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-sm shrink-0 animate-in fade-in duration-150">
                  <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider px-1.5 sm:px-2">Duration</span>
                  {([15, 30, 60, 120] as TimeOption[]).map(t => (
                    <button
                      key={t}
                      onClick={() => { setTimeOption(t); focusInput(); }}
                      className={`flex-1 sm:flex-none px-2 sm:px-2.5 py-1 text-xs font-medium rounded-xl transition-all tabular-nums cursor-pointer whitespace-nowrap touch-manipulation active:scale-95 ${
                        timeOption === t
                          ? 'bg-zinc-800 text-accent border border-zinc-700 font-bold shadow-xs'
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                      }`}
                    >
                      {t}s
                    </button>
                  ))}
                </div>
              )}

              {mode === 'words' && !practiceTargetWords && (
                <div className="flex items-center justify-center gap-1 p-1 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-sm shrink-0 animate-in fade-in duration-150">
                  <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider px-1.5 sm:px-2">Count</span>
                  {([10, 25, 50, 100] as WordsOption[]).map(w => (
                    <button
                      key={w}
                      onClick={() => { setWordsOption(w); focusInput(); }}
                      className={`flex-1 sm:flex-none px-2 sm:px-2.5 py-1 text-xs font-medium rounded-xl transition-all tabular-nums cursor-pointer whitespace-nowrap touch-manipulation active:scale-95 ${
                        wordsOption === w
                          ? 'bg-zinc-800 text-accent border border-zinc-700 font-bold shadow-xs'
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              )}

              {mode === 'quote' && !practiceTargetWords && (
                <div className="flex items-center justify-center gap-1 p-1 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-sm shrink-0 animate-in fade-in duration-150">
                  <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider px-1.5 sm:px-2">Length</span>
                  {(['short', 'medium', 'long'] as QuoteLength[]).map(ql => (
                    <button
                      key={ql}
                      onClick={() => { setQuoteLength(ql); focusInput(); }}
                      className={`flex-1 sm:flex-none px-2 sm:px-2.5 py-1 text-xs font-medium rounded-xl capitalize transition-all cursor-pointer whitespace-nowrap touch-manipulation active:scale-95 ${
                        quoteLength === ql
                          ? 'bg-zinc-800 text-accent border border-zinc-700 font-bold shadow-xs'
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                      }`}
                    >
                      {ql}
                    </button>
                  ))}
                </div>
              )}

              {(mode === 'custom' || practiceTargetWords) && (
                <div className="flex items-center justify-center gap-1 p-1 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-sm shrink-0 animate-in fade-in duration-150">
                  <button
                    onClick={() => setIsCustomModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-xl bg-zinc-800 text-accent border border-zinc-700 hover:bg-zinc-750 transition-all cursor-pointer whitespace-nowrap touch-manipulation active:scale-95"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit Custom</span>
                  </button>
                </div>
              )}
            </div>

            {/* Right Deck: Modifiers Mini-Box & Tools/Controls Mini-Box */}
            <div className="flex items-center justify-between sm:justify-end gap-2 w-full md:w-auto">
              
              {/* Mini-Box 3: Modifiers (Punctuation & Numbers) */}
              {mode !== 'quote' && !practiceTargetWords && (
                <div className="flex items-center gap-1 p-1 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-sm shrink-0">
                  <button
                    onClick={() => { setHasPunctuation(p => !p); focusInput(); }}
                    className={`px-2 sm:px-2.5 py-1 text-xs font-medium rounded-xl transition-all cursor-pointer whitespace-nowrap touch-manipulation active:scale-95 ${
                      hasPunctuation
                        ? 'bg-zinc-800 text-accent border border-zinc-700 font-semibold shadow-xs'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                    }`}
                    title="Toggle punctuation marks"
                  >
                    @ punct
                  </button>
                  <button
                    onClick={() => { setHasNumbers(n => !n); focusInput(); }}
                    className={`px-2 sm:px-2.5 py-1 text-xs font-medium rounded-xl transition-all cursor-pointer whitespace-nowrap touch-manipulation active:scale-95 ${
                      hasNumbers
                        ? 'bg-zinc-800 text-accent border border-zinc-700 font-semibold shadow-xs'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                    }`}
                    title="Toggle number digits"
                  >
                    # numbers
                  </button>
                </div>
              )}

              {/* Mini-Box 4: View & Tools Controls */}
              <div className="flex items-center gap-1 p-1 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-sm shrink-0 ml-auto sm:ml-0">
                {/* Virtual Keyboard Toggle */}
                <button
                  onClick={() => updateSettings({ showVirtualKeyboard: !settings.showVirtualKeyboard })}
                  className={`p-1.5 rounded-xl border transition-all cursor-pointer touch-manipulation active:scale-95 ${
                    settings.showVirtualKeyboard
                      ? 'text-accent bg-zinc-800 border-zinc-750 shadow-xs'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 border-transparent'
                  }`}
                  title="Toggle visual keyboard"
                >
                  <KeyboardIcon className="w-3.5 h-3.5" />
                </button>

                {/* Focus Mode Toggle */}
                <button
                  onClick={() => updateSettings({ focusMode: !settings.focusMode })}
                  className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-xl transition-all cursor-pointer text-xs font-medium border touch-manipulation active:scale-95 ${
                    settings.focusMode
                      ? 'text-accent bg-zinc-800 border-zinc-750 font-semibold shadow-xs'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 border-transparent'
                  }`}
                  title={settings.focusMode ? 'Focus Mode active' : 'Enable Focus Mode'}
                >
                  <EyeOff className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[11px]">Focus</span>
                </button>

                {/* Quick Restart */}
                <button
                  onClick={() => resetTest(false)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 border border-transparent transition-all cursor-pointer touch-manipulation active:scale-95"
                  title="Restart test"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-accent" />
                  <span className="text-[11px]">Restart</span>
                </button>
              </div>

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
          <div className={`w-full max-w-4xl flex items-center justify-between px-2 mb-3 text-xs font-medium text-zinc-400 transition-all duration-300 ${
            settings.focusMode && isTestActive
              ? 'opacity-0 pointer-events-none max-h-0 mb-0 overflow-hidden'
              : 'opacity-100'
          }`}>
            <div className="flex items-center gap-3 sm:gap-5 tabular-nums text-[11px] sm:text-xs">
              {mode === 'time' && (
                <div className="flex items-center gap-1">
                  <span className="text-zinc-500">Time:</span>
                  <span className="text-xs sm:text-sm font-bold text-zinc-800 dark:text-zinc-200">
                    {isTestActive ? liveStats.remainingTime : timeOption}s
                  </span>
                </div>
              )}

              {mode === 'words' && (
                <div className="flex items-center gap-1">
                  <span className="text-zinc-500">Words:</span>
                  <span className="text-xs sm:text-sm font-bold text-zinc-800 dark:text-zinc-200">
                    {typedText.trim().split(/\s+/).filter(Boolean).length} / {wordsOption}
                  </span>
                </div>
              )}

              {isTestActive && (
                <>
                  <div className="flex items-center gap-1">
                    <span className="text-zinc-500">WPM:</span>
                    <span className="text-xs sm:text-sm font-extrabold text-accent">
                      {liveStats.wpm}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="text-zinc-500">Acc:</span>
                    <span className="text-xs sm:text-sm font-bold text-emerald-400">
                      {liveStats.accuracy}%
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Ghost Pacing Target Indicator */}
            <div className="text-[10px] sm:text-[11px] text-zinc-500 flex items-center gap-1">
              <span>PB:</span>
              <span className="font-semibold text-zinc-400">{previousBestWpm} WPM</span>
            </div>
          </div>

          {/* Centered Distraction-Free Linear Typing Stage */}
          <div
            onClick={focusInput}
            className={`relative w-full max-w-4xl rounded-2xl sm:rounded-3xl mt-3 sm:mt-6 mb-6 sm:mb-10 py-6 sm:py-10 px-3 sm:px-6 md:px-8 cursor-pointer select-none bg-zinc-950/90 border transition-all duration-300 shadow-2xl backdrop-blur-md group overflow-hidden ${
              isInputFocused 
                ? 'border-zinc-800 ring-1 ring-zinc-800/60' 
                : 'border-zinc-800/80 hover:border-zinc-700'
            }`}
          >
            {/* Blurry state overlay if cursor is not inside the practice box */}
            {!isInputFocused && (
              <div 
                onClick={focusInput}
                className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-zinc-950/50 backdrop-blur-[3px] rounded-2xl sm:rounded-3xl cursor-pointer animate-in fade-in duration-200 p-4 text-center touch-manipulation"
              >
                <div className="flex items-center gap-2 sm:gap-2.5 px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl bg-zinc-900 border border-zinc-700/80 text-zinc-100 shadow-2xl hover:border-accent hover:bg-zinc-850 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 group">
                  <MousePointerClick className="w-4 h-4 text-accent group-hover:scale-110 transition-transform" />
                  <span className="text-xs sm:text-sm font-semibold tracking-wide">Tap or click here to start typing</span>
                </div>
                <span className="text-[10px] sm:text-[11px] text-zinc-400 mt-2 font-mono">or tap anywhere to open keyboard</span>
              </div>
            )}

            {/* Transparent Input covering the typing stage on mobile/desktop */}
            <input
              ref={inputRef}
              type="text"
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck="false"
              inputMode="text"
              enterKeyHint="done"
              aria-label="Typing test input"
              className="absolute inset-0 w-full h-full opacity-0 z-20 cursor-text touch-manipulation text-base"
              onKeyDown={handleKeyDown}
              onChange={handleInputChange}
              onBeforeInput={handleBeforeInput}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              tabIndex={0}
            />

            {/* Distraction-Free Natural Typing View (Monkeytype-grade wrap & smooth line scroll) */}
            <div
              ref={textContainerRef}
              className={`relative overflow-hidden select-none font-normal transition-all duration-300 w-full px-4 sm:px-8 ${
                !isInputFocused ? 'filter blur-[5px] opacity-25 pointer-events-none select-none' : 'filter-none opacity-100'
              } ${fontSizeClass}`}
              style={{
                fontFamily: 'var(--font-custom)',
                height: `${lineHeightPx * 3}px`,
                maskImage: scrollOffset > 8
                  ? 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,1) 18%, rgba(0,0,0,1) 82%, transparent 100%)'
                  : 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 82%, transparent 100%)',
                WebkitMaskImage: scrollOffset > 8
                  ? 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,1) 18%, rgba(0,0,0,1) 82%, transparent 100%)'
                  : 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 82%, transparent 100%)'
              }}
            >
              <div
                ref={wordsWrapperRef}
                className="w-full flex flex-wrap items-center justify-start content-start transition-transform duration-200 ease-out will-change-transform py-1"
                style={{
                  transform: `translate3d(0, -${scrollOffset}px, 0)`
                }}
              >
                {wordsList.map((wordObj) => {
                  const isCurrentWord = wordObj.wordIndex === currentWordIndex;

                  return (
                    <span
                      key={wordObj.wordIndex}
                      ref={isCurrentWord ? activeWordRef : null}
                      data-word-idx={wordObj.wordIndex}
                      className={`inline-flex items-center whitespace-nowrap mr-[0.38em] my-[0.1em] transition-opacity duration-150 ${
                        isCurrentWord ? 'opacity-100' : 'opacity-50'
                      }`}
                    >
                      {wordObj.letters.map((letter) => {
                        const isTyped = letter.index < typedText.length;
                        const isCurrent = letter.index === typedText.length;
                        const isCorrect = isTyped && typedText[letter.index] === letter.char;
                        const isIncorrect = isTyped && !isCorrect;

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
                        const isSpaceCurrent = wordObj.spaceIndex === typedText.length;
                        return (
                          <span
                            ref={isSpaceCurrent ? activeCharRef : null}
                            className="relative inline-block w-[0.25em]"
                          >
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

                {/* Trailing caret if end reached on current test */}
                {typedText.length >= targetText.length && (
                  <span className="relative inline-block w-[2px] h-[1em]">
                    <span className={`absolute ${caretClasses}`} />
                  </span>
                )}
              </div>
            </div>

            {/* Author Attribution for Quote Mode */}
            {activeQuote && (
              <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/60 text-right">
                <span className="text-xs italic text-zinc-400">— {activeQuote.author}</span>
              </div>
            )}

            {/* Subtle Hint on Idle when focused */}
            {isInputFocused && !isTestActive && typedText.length === 0 && (
              <div className="absolute inset-x-0 bottom-3 text-center pointer-events-none">
                <span className="text-[11px] text-zinc-500 tracking-wide font-medium">
                  Start typing to begin test · timer starts on first key
                </span>
              </div>
            )}
          </div>

          {/* Quick Shortcuts & Mobile Controls */}
          <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row items-center justify-center gap-2 text-center">
            <button
              onClick={() => resetTest(false)}
              className="sm:hidden flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-300 hover:text-white active:scale-95 transition-all shadow-xs cursor-pointer touch-manipulation"
            >
              <RotateCcw className="w-3.5 h-3.5 text-accent" />
              <span>Restart Test</span>
            </button>
            <span className="text-[11px] text-zinc-400/80 font-mono hidden sm:inline">
              tab + enter — restart test · esc — reset
            </span>
          </div>

          {/* Interactive Virtual Keyboard */}
          {settings.showVirtualKeyboard && (
            <div className="w-full max-w-2xl mt-4 sm:mt-6 animate-in fade-in duration-300">
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
