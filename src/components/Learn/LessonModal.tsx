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
  Sparkles,
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isCompleted) {
      if (e.key === 'Enter' && passedCriteria && onNextLesson) {
        onNextLesson();
      }
      return;
    }

    if (e.key === 'Escape') {
      onClose();
      return;
    }

    if (['Control', 'Alt', 'Meta', 'Shift', 'CapsLock'].includes(e.key)) {
      return;
    }

    const now = Date.now();
    if (!startTime) {
      setStartTime(now);
    }

    setLastKeyPressed(e.key);
    setTimeout(() => setLastKeyPressed(null), 100);

    if (e.key === 'Backspace') {
      e.preventDefault();
      if (typedText.length > 0) {
        setTypedText(prev => prev.slice(0, -1));
        playKeySound();
      }
      return;
    }

    if (e.key.length === 1) {
      e.preventDefault();
      const nextIndex = typedText.length;
      const expectedChar = targetText[nextIndex];
      const isCorrect = e.key === expectedChar;

      if (isCorrect) {
        playKeySound();
      } else {
        playErrorSound();
      }

      const nextTyped = typedText + e.key;
      setTypedText(nextTyped);

      // Lesson finished check
      if (nextTyped.length >= targetText.length) {
        const durationSec = Math.max(1, (now - (startTime || now)) / 1000);
        let correctCount = 0;
        for (let i = 0; i < targetText.length; i++) {
          if (nextTyped[i] === targetText[i]) correctCount++;
        }
        const acc = Math.round((correctCount / targetText.length) * 100);
        const wpm = Math.round((correctCount / 5) / (durationSec / 60));

        // Evaluate passing criteria
        const passed = acc >= lesson.minAccuracy && wpm >= lesson.minWpm;
        setPassedCriteria(passed);

        let stars = 1;
        if (acc >= 96 && wpm >= lesson.minWpm + 8) stars = 3;
        else if (acc >= 92 && wpm >= lesson.minWpm) stars = 2;

        setCompletionStats({ wpm, accuracy: acc, stars });

        if (passed) {
          updateLessonProgress(lesson.id, wpm, acc, stars);
          playCompleteSound();
        }

        setIsCompleted(true);
      }
    }
  };

  const expectedChar = targetText[typedText.length] || '';

  // Existing progress in this lesson
  const existingProg = lessonProgress[lesson.id];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-3xl rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl p-6 sm:p-8 flex flex-col max-h-[90vh] overflow-y-auto"
        onClick={() => inputRef.current?.focus()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400 font-semibold">
                Lesson Drill
              </span>
              {existingProg?.completed && (
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Passed (Best: {existingProg.bestWpm} WPM)
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
              {lesson.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Lesson Explanations & Finger Tips */}
        <div className="mt-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800/60 text-xs space-y-2">
          <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
            {lesson.explanation}
          </p>
          <div className="flex items-start gap-1.5 text-blue-600 dark:text-blue-400 font-medium">
            <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>Finger guidance: {lesson.fingerTips}</span>
          </div>
          <div className="text-[11px] text-zinc-400">
            Goal: &ge; {lesson.minAccuracy}% accuracy and &ge; {lesson.minWpm} WPM
          </div>
        </div>

        {/* Typing Stage */}
        <div className="relative my-6 p-6 rounded-2xl bg-zinc-100/60 dark:bg-zinc-950/60 border border-zinc-200/80 dark:border-zinc-800/80 cursor-text select-none min-h-[140px] flex items-center justify-center">
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

          <div className="text-xl sm:text-2xl font-mono leading-relaxed text-center tracking-wide">
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
                      ? 'text-zinc-900 dark:text-zinc-100'
                      : isIncorrect
                        ? 'text-rose-500 bg-rose-500/10 rounded-xs'
                        : 'text-zinc-400/50 dark:text-zinc-600'
                  }`}
                >
                  {isCurrent && (
                    <span className="absolute left-0 top-1 w-0.5 h-6 bg-blue-500 animate-caret-blink" />
                  )}
                  {char === ' ' ? '\u00A0' : char}
                </span>
              );
            })}
          </div>
        </div>

        {/* Completion Card or Keyboard Guide */}
        {isCompleted ? (
          <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-center animate-in zoom-in-95 duration-200">
            <div className="flex justify-center items-center gap-1.5 mb-2">
              {[1, 2, 3].map(starNum => (
                <Star
                  key={starNum}
                  className={`w-6 h-6 ${
                    starNum <= completionStats.stars
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-zinc-300 dark:text-zinc-700'
                  }`}
                />
              ))}
            </div>

            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              {passedCriteria ? 'Lesson Completed!' : 'Almost There!'}
            </h3>

            <p className="text-xs text-zinc-500 mt-1 mb-4">
              {passedCriteria 
                ? 'Excellent muscle memory technique. Ready for next drill!'
                : `Target criteria was ${lesson.minAccuracy}% accuracy & ${lesson.minWpm} WPM. Let's try again!`}
            </p>

            <div className="flex justify-center items-center gap-6 text-sm tabular-nums mb-6">
              <div>
                <span className="text-xs text-zinc-400 block">Speed</span>
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">{completionStats.wpm} WPM</span>
              </div>
              <div className="h-8 w-px bg-zinc-200 dark:bg-zinc-700" />
              <div>
                <span className="text-xs text-zinc-400 block">Accuracy</span>
                <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{completionStats.accuracy}%</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={resetLesson}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-650 text-zinc-800 dark:text-zinc-200 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Lesson</span>
              </button>

              {passedCriteria && onNextLesson && (
                <button
                  onClick={onNextLesson}
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition-all cursor-pointer"
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
              compact={true}
            />
          </div>
        )}

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-800 text-xs text-zinc-400">
          <span>Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono text-[10px]">Esc</kbd> anytime to exit</span>
          <button
            onClick={resetLesson}
            className="flex items-center gap-1 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Drill</span>
          </button>
        </div>

      </div>
    </div>
  );
};
