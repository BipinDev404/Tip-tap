import React, { useMemo, useState } from 'react';
import { COURSES } from '../../utils/academyData';
import { useApp } from '../../context/AppContext';
import { LessonModal } from './LessonModal';
import { Lesson } from '../../types';
import { 
  CheckCircle2, 
  Lock, 
  Play, 
  Star, 
  ChevronRight,
  GraduationCap,
  Keyboard,
  ShieldAlert,
  Compass,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const LearnView: React.FC = () => {
  const { 
    lessonProgress, 
    activeLesson, 
    setActiveLesson,
    updateSettings
  } = useApp();

  const [showGuide, setShowGuide] = useState(true);

  // All lessons flat list
  const flatLessons = useMemo(() => {
    return COURSES.flatMap(c => c.lessons);
  }, []);

  // Compute unlock status:
  // First lesson of Course 1 is always unlocked.
  // Subsequent lessons unlock if the previous lesson is completed.
  const lessonStateMap = useMemo(() => {
    const map: Record<string, 'completed' | 'available' | 'locked'> = {};
    let previousCompleted = true;

    flatLessons.forEach((lesson, index) => {
      const isDone = !!lessonProgress[lesson.id]?.completed;
      if (isDone) {
        map[lesson.id] = 'completed';
        previousCompleted = true;
      } else if (previousCompleted || index === 0) {
        map[lesson.id] = 'available';
        previousCompleted = false;
      } else {
        map[lesson.id] = 'locked';
        previousCompleted = false;
      }
    });

    return map;
  }, [flatLessons, lessonProgress]);

  // Overall academy progress
  const totalCompleted = Object.values(lessonProgress).filter(p => p.completed).length;
  const progressPercent = Math.round((totalCompleted / flatLessons.length) * 100);

  // Clicking any lesson launches the interactive popup modal directly over the Learn page
  const handleLaunchPractice = (lesson: Lesson) => {
    updateSettings({ showVirtualKeyboard: true });
    setActiveLesson(lesson);
  };

  // Helper to find next lesson
  const findNextLesson = (currentId: string): Lesson | null => {
    const idx = flatLessons.findIndex(l => l.id === currentId);
    if (idx !== -1 && idx < flatLessons.length - 1) {
      return flatLessons[idx + 1];
    }
    return null;
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-5 sm:py-12 px-3 sm:px-6 animate-in fade-in duration-200">
      
      {/* Clean Minimalist Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 pb-5 sm:pb-6 mb-6 border-b border-zinc-200/60 dark:border-zinc-800/60">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 mb-1">
            <GraduationCap className="w-4 h-4 text-blue-500" />
            <span>Curriculum & Drills</span>
            <span aria-hidden="true" className="text-zinc-300 dark:text-zinc-700">·</span>
            <span>{totalCompleted} of {flatLessons.length} mastered</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            Learn to Type
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1 max-w-xl">
            Structured touch typing exercises from home row muscle memory to full fluid speed. Click any drill to practice directly in the modal overlay.
          </p>
        </div>

        {/* Progress Bar Indicator */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="w-32 h-1.5 bg-zinc-200 dark:bg-zinc-850 rounded-full overflow-hidden border border-zinc-300 dark:border-zinc-800">
            <div 
              className="h-full bg-accent rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-xs font-mono font-medium text-zinc-600 dark:text-zinc-400 tabular-nums">
            {progressPercent}%
          </span>
        </div>
      </div>

      {/* Expanded Educational Context: Foundations & Finger Placement Guide */}
      <div className="mb-8 rounded-2xl bg-zinc-100 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xs">
        <div 
          onClick={() => setShowGuide(!showGuide)}
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-zinc-200/50 dark:hover:bg-zinc-850/50 transition-colors select-none"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
              <Keyboard className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Touch Typing Foundations & Finger Placement
              </h2>
              <p className="text-xs text-zinc-500">
                Master tactile home row positioning, posture, and muscle memory rules.
              </p>
            </div>
          </div>
          <button className="text-zinc-400 hover:text-zinc-200 p-1">
            {showGuide ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {showGuide && (
          <div className="p-4 sm:p-5 pt-0 border-t border-zinc-200 dark:border-zinc-800/80 space-y-4 text-xs text-zinc-600 dark:text-zinc-300 animate-in fade-in duration-150">
            {/* Hand Map Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4">
              <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80">
                <div className="flex items-center gap-2 font-semibold text-accent mb-2">
                  <Compass className="w-4 h-4" />
                  <span>Left Hand Home Position</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 font-mono text-center text-xs">
                  <div className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                    <span className="block font-bold text-zinc-900 dark:text-zinc-100">A</span>
                    <span className="text-[10px] text-zinc-400">Pinky</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                    <span className="block font-bold text-zinc-900 dark:text-zinc-100">S</span>
                    <span className="text-[10px] text-zinc-400">Ring</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                    <span className="block font-bold text-zinc-900 dark:text-zinc-100">D</span>
                    <span className="text-[10px] text-zinc-400">Middle</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-accent/15 border border-accent/30">
                    <span className="block font-bold text-accent">F *</span>
                    <span className="text-[10px] text-accent/80">Index Bump</span>
                  </div>
                </div>
                <p className="mt-2 text-[11px] text-zinc-500 leading-relaxed">
                  Feel the tactile nub on <strong className="text-zinc-300">F</strong>. Left thumb rests lightly on Spacebar.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80">
                <div className="flex items-center gap-2 font-semibold text-emerald-500 mb-2">
                  <Compass className="w-4 h-4" />
                  <span>Right Hand Home Position</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 font-mono text-center text-xs">
                  <div className="p-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30">
                    <span className="block font-bold text-emerald-400">J *</span>
                    <span className="text-[10px] text-emerald-400/80">Index Bump</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                    <span className="block font-bold text-zinc-900 dark:text-zinc-100">K</span>
                    <span className="text-[10px] text-zinc-400">Middle</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                    <span className="block font-bold text-zinc-900 dark:text-zinc-100">L</span>
                    <span className="text-[10px] text-zinc-400">Ring</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                    <span className="block font-bold text-zinc-900 dark:text-zinc-100">;</span>
                    <span className="text-[10px] text-zinc-400">Pinky</span>
                  </div>
                </div>
                <p className="mt-2 text-[11px] text-zinc-500 leading-relaxed">
                  Feel the bump on <strong className="text-zinc-300">J</strong>. Right thumb controls Spacebar.
                </p>
              </div>
            </div>

            {/* Core Golden Rules */}
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200/90 flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5 sm:mt-0" />
              <div className="text-xs space-y-0.5">
                <p className="font-semibold text-amber-800 dark:text-amber-200">The Golden Rule of Touch Typing</p>
                <p className="text-amber-700 dark:text-amber-300/80">
                  Never look down at your keyboard. Focus on accuracy over raw speed—rhythmic speed naturally develops once muscle memory anchors every reach to the home row.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Comprehensive Practice & Lesson List Grouped by Topic */}
      <div className="space-y-12">
        {COURSES.map((course, courseIndex) => {
          const completedCount = course.lessons.filter(l => lessonProgress[l.id]?.completed).length;
          const isCourseFinished = completedCount === course.lessons.length && course.lessons.length > 0;

          return (
            <div key={course.id} className="space-y-4">
              
              {/* Module Header */}
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-2 border-b border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-mono font-semibold text-accent">
                    {courseIndex + 1 < 10 ? `0${courseIndex + 1}` : courseIndex + 1}
                  </span>
                  <h2 className="text-lg sm:text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                    {course.title}
                  </h2>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400 hidden sm:inline">
                    · {course.subtitle}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                  <span>{course.targetKeysSummary}</span>
                  {isCourseFinished && (
                    <span className="flex items-center gap-1 text-emerald-500 font-sans font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Completed
                    </span>
                  )}
                </div>
              </div>

              {/* Linear Practice List with Subtle Row Borders */}
              <div className="divide-y divide-zinc-200 dark:divide-zinc-800/80 border-y border-zinc-200 dark:border-zinc-800/80">
                {course.lessons.map((lesson, lessonIdx) => {
                  const state = lessonStateMap[lesson.id] || 'locked';
                  const prog = lessonProgress[lesson.id];
                  const isCompleted = state === 'completed';
                  const isAvailable = state === 'available';
                  const isLocked = state === 'locked';

                  return (
                    <div
                      key={lesson.id}
                      onClick={() => {
                        if (!isLocked) {
                          handleLaunchPractice(lesson);
                        }
                      }}
                      className={`group flex items-center justify-between py-3.5 sm:py-4 px-2 sm:px-3 transition-colors touch-manipulation min-h-[52px] ${
                        isCompleted
                          ? 'hover:bg-zinc-100 dark:hover:bg-zinc-900/60 cursor-pointer'
                          : isAvailable
                            ? 'hover:bg-zinc-100 dark:hover:bg-zinc-900/80 cursor-pointer'
                            : 'opacity-40 cursor-not-allowed select-none'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0 pr-4">
                        {/* State Indicator */}
                        <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0">
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          ) : isLocked ? (
                            <Lock className="w-3.5 h-3.5 text-zinc-400 dark:text-zinc-500" />
                          ) : (
                            <Play className="w-3.5 h-3.5 text-accent fill-accent" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-zinc-400">
                              {lessonIdx + 1 < 10 ? `0${lessonIdx + 1}` : lessonIdx + 1}
                            </span>
                            <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-accent transition-colors truncate">
                              {lesson.title}
                            </h3>
                            {prog?.stars ? (
                              <div className="flex items-center gap-0.5 ml-1">
                                {[1, 2, 3].map(s => (
                                  <Star
                                    key={s}
                                    className={`w-2.5 h-2.5 ${
                                      s <= prog.stars ? 'text-amber-400 fill-amber-400' : 'text-zinc-300 dark:text-zinc-700'
                                    }`}
                                  />
                                ))}
                              </div>
                            ) : null}
                          </div>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5 max-w-lg">
                            {lesson.fingerTips}
                          </p>
                        </div>
                      </div>

                      {/* Performance / Main Modal Practice Action */}
                      <div className="flex items-center gap-3 shrink-0">
                        {isCompleted && prog && (
                          <div className="text-right text-xs tabular-nums text-zinc-500 dark:text-zinc-400 hidden sm:block font-mono">
                            <span className="font-semibold text-zinc-800 dark:text-zinc-200">{prog.bestWpm} WPM</span>
                            <span className="text-zinc-400 dark:text-zinc-600 mx-1">·</span>
                            <span className="text-emerald-500">{prog.bestAccuracy}%</span>
                          </div>
                        )}

                        {isAvailable && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLaunchPractice(lesson);
                            }}
                            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-accent text-white hover:opacity-90 transition-all shadow-xs cursor-pointer"
                          >
                            <span>Practice</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {isCompleted && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLaunchPractice(lesson);
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 bg-zinc-200/60 dark:bg-zinc-800/60 hover:bg-zinc-200 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
                          >
                            <span>Retry</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Main Lesson Modal Overlay */}
      {activeLesson && (
        <LessonModal
          lesson={activeLesson}
          onClose={() => setActiveLesson(null)}
          onNextLesson={() => {
            const next = findNextLesson(activeLesson.id);
            if (next) {
              setActiveLesson(next);
            } else {
              setActiveLesson(null);
            }
          }}
        />
      )}
    </div>
  );
};

