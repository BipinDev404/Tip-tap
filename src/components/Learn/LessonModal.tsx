import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Lesson } from '../../types';
import { useApp } from '../../context/AppContext';
import { VirtualKeyboard } from '../VirtualKeyboard';
import { 
  X, 
  RotateCcw, 
  CheckCircle2, 
  Star, 
  ArrowRight, 
  Info
} from 'lucide-react';

interface LessonModalProps {
  lesson: Lesson;
  onClose: () => void;
  onNextLesson?: () => void;
}

export const LessonModal: React.FC<LessonModalProps> = ({
  lesson,
  onClose,
  onNextLesson
}) => {
  const { 
    updateLessonProgress, 
    lessonProgress, 
    playKeySound, 
    playErrorSound, 
    playCompleteSound 
  } = useApp();

  const [typedText, setTypedText] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [lastKeyPressed, setLastKeyPressed] = useState<string | null>(null);
  const [passedCriteria, setPassedCriteria] = useState(false);
  const [completionStats, setCompletionStats] = useState<{
    wpm: number;
    accuracy: number;
    stars: number;
  }>({ wpm: 0, accuracy: 0, stars: 0 });

  const inputRef = useRef<HTMLInputElement | null>(null);
  const targetText = lesson.text;

  // Reset lesson
  const resetLesson = useCallback(() => {
    setTypedText('');
    setStartTime(null);
    setIsCompleted(false);
    setPassedCriteria(false);
    setLastKeyPressed(null);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  }, []);

  useEffect(() => {
    resetLesson();
  }, [lesson, resetLesson]);

  // Handle physical keystrokes
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isCompleted) return;

    if (e.key === 'Escape') {
      onClose();
      return;
    }

    // Ignore standalone modifier keys
    if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock'].includes(e.key)) {
      setLastKeyPressed(e.key);
      return;
    }

    setLastKeyPressed(e.key);

    // Start timer on first keystroke
    if (!startTime) {
      setStartTime(Date.now());
    }

    // Handle Backspace
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (typedText.length > 0) {
        setTypedText(prev => prev.slice(0, -1));
        playKeySound();
      }
      return;
    }

    // Normal single character
    if (e.key.length === 1) {
      e.preventDefault();
      const nextIndex = typedText.length;
      const expectedChar = targetText[nextIndex];
      const typedChar = e.key;

      if (typedChar === expectedChar) {
        playKeySound();
      } else {
        playErrorSound();
      }

      const nextTyped = typedText + typedChar;
      setTypedText(nextTyped);

      // Check if finished
      if (nextTyped.length >= targetText.length) {
        finishLesson(nextTyped);
      }
    }
  };

  const finishLesson = (finalTyped: string) => {
    const elapsedMinutes = Math.max(0.01, (Date.now() - (startTime || Date.now())) / 60000);
    const wordCount = targetText.length / 5;
    const calcWpm = Math.round(wordCount / elapsedMinutes);

    let correctChars = 0;
    for (let i = 0; i < targetText.length; i++) {
      if (finalTyped[i] === targetText[i]) correctChars++;
    }
    const calcAccuracy = Math.round((correctChars / targetText.length) * 100);

    // Compute star rating
    let earnedStars = 1;
    const passed = calcAccuracy >= lesson.minAccuracy && calcWpm >= lesson.minWpm;
    if (calcAccuracy >= lesson.minAccuracy + 3 && calcWpm >= lesson.minWpm + 10) {
      earnedStars = 3;
    } else if (passed) {
      earnedStars = 2;
    }

    setPassedCriteria(passed);
    setCompletionStats({ wpm: calcWpm, accuracy: calcAccuracy, stars: earnedStars });
    setIsCompleted(true);

    if (passed) {
      playCompleteSound();
      updateLessonProgress(lesson.id, calcWpm, calcAccuracy, earnedStars);
    }
  };

  const expectedChar = targetText[typedText.length] || '';
  const existingProg = lessonProgress[lesson.id];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div 
        className="w-full max-w-4xl rounded-2xl bg-zinc-950 border border-zinc-800/90 shadow-2xl p-4 sm:p-6 flex flex-col justify-between my-auto max-h-[98vh] overflow-y-auto"
        onClick={() => inputRef.current?.focus()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[11px] uppercase tracking-wider text-accent font-semibold">
                Lesson Drill
              </span>
              {existingProg?.completed && (
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3 h-3" />
                  Passed ({existingProg.bestWpm} WPM)
                </span>
              )}
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-zinc-100">
              {lesson.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Compact Lesson Guidance Banner */}
        <div className="mt-3 p-3 rounded-xl bg-zinc-900/90 border border-zinc-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-0.5">
            <p className="text-zinc-300 font-medium line-clamp-1">
              {lesson.explanation}
            </p>
            <div className="flex items-center gap-1.5 text-accent text-[11px]">
              <Info className="w-3.5 h-3.5 shrink-0" />
              <span>Finger guidance: {lesson.fingerTips}</span>
            </div>
          </div>
          <div className="text-[11px] font-mono text-zinc-400 whitespace-nowrap bg-zinc-950 px-2.5 py-1 rounded-lg border border-zinc-800 shrink-0">
            Goal: &ge; {lesson.minAccuracy}% acc · &ge; {lesson.minWpm} WPM
          </div>
        </div>

        {/* Typing Stage */}
        <div className="relative my-4 p-5 sm:p-6 rounded-xl bg-zinc-900/90 border border-zinc-800/80 cursor-text select-none min-h-[110px] sm:min-h-[130px] flex items-center justify-center shadow-inner">
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
            autoFocus
          />

          <div className="text-lg sm:text-2xl font-mono leading-relaxed text-center tracking-wide">
            {targetText.split('').map((char, idx) => {
              const isTyped = idx < typedText.length;
              const isCurrent = idx === typedText.length;
              const isCorrect = isTyped && typedText[idx] === char;
              const isIncorrect = isTyped && !isCorrect;

              return (
                <span
                  key={idx}
                  className={`relative inline-block ${
                    isCorrect
                      ? 'text-zinc-100 font-medium'
                      : isIncorrect
                        ? 'text-rose-400 bg-rose-500/15 rounded-xs'
                        : 'text-zinc-500'
                  }`}
                >
                  {isCurrent && (
                    <span className="absolute left-0 top-1 w-[2.5px] h-6 bg-accent rounded-full animate-caret-blink shadow-[0_0_8px_var(--accent-color)]" />
                  )}
                  {char === ' ' ? '\u00A0' : char}
                </span>
              );
            })}
          </div>
        </div>

        {/* Completion Card or Full Virtual Keyboard */}
        {isCompleted ? (
          <div className="p-5 sm:p-6 rounded-xl bg-zinc-900/90 border border-zinc-800 text-center animate-in zoom-in-95 duration-200">
            <div className="flex justify-center items-center gap-1.5 mb-2">
              {[1, 2, 3].map(starNum => (
                <Star
                  key={starNum}
                  className={`w-6 h-6 ${
                    starNum <= completionStats.stars
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-zinc-700'
                  }`}
                />
              ))}
            </div>

            <h3 className="text-lg font-bold text-zinc-100">
              {passedCriteria ? 'Lesson Completed!' : 'Almost There!'}
            </h3>

            <p className="text-xs text-zinc-400 mt-1 mb-3">
              {passedCriteria 
                ? 'Excellent technique! Muscle memory updated.'
                : `Target criteria was ${lesson.minAccuracy}% accuracy & ${lesson.minWpm} WPM.`}
            </p>

            <div className="flex justify-center items-center gap-6 text-sm tabular-nums mb-5">
              <div>
                <span className="text-[11px] text-zinc-400 block">Speed</span>
                <span className="text-xl font-bold text-accent">{completionStats.wpm} WPM</span>
              </div>
              <div className="h-8 w-px bg-zinc-800" />
              <div>
                <span className="text-[11px] text-zinc-400 block">Accuracy</span>
                <span className="text-xl font-bold text-emerald-400">{completionStats.accuracy}%</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={resetLesson}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-750 text-zinc-200 border border-zinc-700 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Lesson</span>
              </button>

              {passedCriteria && onNextLesson && (
                <button
                  onClick={onNextLesson}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold bg-accent hover:opacity-90 text-white shadow-md transition-all cursor-pointer"
                >
                  <span>Next Lesson</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="w-full">
            <VirtualKeyboard
              expectedKey={expectedChar}
              activeKeyPressed={lastKeyPressed}
              highlightFingers={true}
              compact={false}
            />
          </div>
        )}

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-3 mt-3 border-t border-zinc-800/80 text-xs text-zinc-400">
          <span>Press <kbd className="px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 font-mono text-[10px] text-zinc-300">Esc</kbd> to exit</span>
          <button
            onClick={resetLesson}
            className="flex items-center gap-1.5 hover:text-zinc-200 cursor-pointer text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-accent" />
            <span>Reset Drill</span>
          </button>
        </div>

      </div>
    </div>
  );
};
