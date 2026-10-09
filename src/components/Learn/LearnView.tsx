import React, { useState, useMemo } from 'react';
import { COURSES } from '../../utils/academyData';
import { useApp } from '../../context/AppContext';
import { LessonModal } from './LessonModal';
import { Lesson } from '../../types';
import { 
  BookOpen, 
  CheckCircle2, 
  Lock, 
  Play, 
  Star, 
  Sparkles, 
  ChevronRight,
  GraduationCap
} from 'lucide-react';

export const LearnView: React.FC = () => {
  const { lessonProgress, activeLesson, setActiveLesson } = useApp();
  const [selectedCourseId, setSelectedCourseId] = useState<string>('course-a');

  // Compute unlock status:
  // First lesson of Course A is always unlocked.
  // Subsequent lessons unlock if the previous lesson is completed.
  const flatLessons = useMemo(() => {
    return COURSES.flatMap(c => c.lessons);
  }, []);

  const lessonStateMap = useMemo(() => {
    const map: Record<string, 'completed' | 'available' | 'locked'> = {};
    let previousCompleted = true; // First lesson is available

    flatLessons.forEach((lesson, index) => {
      const isDone = !!lessonProgress[lesson.id]?.completed;
      if (isDone) {
        map[lesson.id] = 'completed';
        previousCompleted = true;
      } else if (previousCompleted || index === 0) {
        map[lesson.id] = 'available';
        previousCompleted = false; // subsequent locked until this is done
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

  // Active course
  const activeCourse = COURSES.find(c => c.id === selectedCourseId) || COURSES[0];

  // Helper to find next lesson
  const findNextLesson = (currentId: string): Lesson | null => {
    const idx = flatLessons.findIndex(l => l.id === currentId);
    if (idx !== -1 && idx < flatLessons.length - 1) {
      return flatLessons[idx + 1];
    }
    return null;
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-6 sm:py-8 px-4 animate-in fade-in duration-200">
      
      {/* Academy Hero / Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200/80 dark:border-zinc-800/80">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase tracking-wider text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5" />
                Touch Typing Academy
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Structured Keyboard Mastery
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1 max-w-xl">
              Learn touch typing systematically from posture and home row resting anchors to full sentence speed drills.
            </p>
          </div>

          {/* Progress Ring Card */}
          <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-zinc-100/80 dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800/80 shrink-0">
            <div className="flex flex-col">
              <span className="text-[11px] text-zinc-500 font-medium">Academy Progress</span>
              <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">
                {totalCompleted} / {flatLessons.length} Lessons
              </span>
            </div>
            <div className="relative w-11 h-11 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-zinc-200 dark:text-zinc-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-blue-600 dark:text-blue-400 transition-all duration-500"
                  strokeDasharray={`${progressPercent}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-[10px] font-bold tabular-nums text-zinc-800 dark:text-zinc-200">
                {progressPercent}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Course Navigation Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
        {COURSES.map(course => {
          const isSelected = course.id === selectedCourseId;
          const courseCompletedCount = course.lessons.filter(l => lessonProgress[l.id]?.completed).length;
          const isCourseDone = courseCompletedCount === course.lessons.length && course.lessons.length > 0;

          return (
            <button
              key={course.id}
              onClick={() => setSelectedCourseId(course.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 border-zinc-900 dark:border-white shadow-xs'
                  : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200/80 dark:border-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              <span>{course.code}</span>
              <span className="text-[11px] opacity-75">· {course.title}</span>
              {isCourseDone && (
                <CheckCircle2 className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-400 dark:text-emerald-600' : 'text-emerald-500'}`} />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Course Header */}
      <div className="p-5 sm:p-6 rounded-3xl bg-zinc-100/60 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              {activeCourse.code} · {activeCourse.subtitle}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
              {activeCourse.title}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              {activeCourse.description}
            </p>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-white/80 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-700 dark:text-zinc-300 shrink-0">
            Target Keys: <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">{activeCourse.targetKeysSummary}</span>
          </div>
        </div>
      </div>

      {/* Lessons List in Selected Course */}
      <div className="space-y-3">
        {activeCourse.lessons.map((lesson, idx) => {
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
                  setActiveLesson(lesson);
                }
              }}
              className={`flex items-center justify-between p-4 sm:p-5 rounded-2xl border transition-all ${
                isCompleted
                  ? 'bg-white dark:bg-zinc-900/90 border-emerald-500/20 hover:border-emerald-500/40 cursor-pointer shadow-2xs'
                  : isAvailable
                    ? 'bg-white dark:bg-zinc-900 border-blue-500/40 hover:border-blue-500 shadow-sm cursor-pointer ring-1 ring-blue-500/10'
                    : 'bg-zinc-50/50 dark:bg-zinc-900/30 border-zinc-200/50 dark:border-zinc-800/40 opacity-60 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center gap-4">
                {/* State Icon */}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                  isCompleted
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : isAvailable
                      ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                      : 'bg-zinc-200/50 dark:bg-zinc-800/50 text-zinc-400'
                }`}>
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : isLocked ? (
                    <Lock className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4 ml-0.5 fill-blue-600 dark:fill-blue-400" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-400 font-mono">
                      Lesson {idx + 1}
                    </span>
                    {prog?.stars ? (
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3].map(s => (
                          <Star
                            key={s}
                            className={`w-3 h-3 ${
                              s <= prog.stars ? 'text-amber-400 fill-amber-400' : 'text-zinc-300 dark:text-zinc-700'
                            }`}
                          />
                        ))}
                      </div>
                    ) : null}
                  </div>
                  <h3 className="text-sm sm:text-base font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5">
                    {lesson.title}
                  </h3>
                  <p className="text-xs text-zinc-500 line-clamp-1 mt-0.5">
                    {lesson.fingerTips}
                  </p>
                </div>
              </div>

              {/* Action / Performance Info */}
              <div className="flex items-center gap-3 shrink-0 ml-4">
                {isCompleted && prog && (
                  <div className="text-right hidden sm:block">
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 tabular-nums">
                      {prog.bestWpm} WPM
                    </span>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 block tabular-nums">
                      {prog.bestAccuracy}% Acc
                    </span>
                  </div>
                )}

                {isAvailable && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-xs">
                    <span>Start</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                )}

                {isCompleted && (
                  <button className="px-3 py-1.5 rounded-xl text-xs font-medium text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
                    Practice Again
                  </button>
                )}

                {isLocked && (
                  <span className="text-xs text-zinc-400 flex items-center gap-1 font-medium">
                    <Lock className="w-3 h-3" />
                    Locked
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Lesson Modal */}
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
