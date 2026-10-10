import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Flame } from 'lucide-react';
import { useApp } from '../context/AppContext';

export interface StreakCounterProps {
  className?: string;
  compact?: boolean;
  showLabel?: boolean;
  onClick?: () => void;
}

interface LocalStreakData {
  currentStreak: number;
  todayCount: number;
  dailyGoal: number;
}

const STORAGE_KEY = 'tiptap_data_v1';

/**
 * Calculates typing practice streak directly from local storage
 */
export function calculateStreakFromLocalStorage(): LocalStreakData {
  if (typeof window === 'undefined') {
    return { currentStreak: 0, todayCount: 0, dailyGoal: 3 };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { currentStreak: 0, todayCount: 0, dailyGoal: 3 };
    }

    const parsed = JSON.parse(raw);
    const results = Array.isArray(parsed?.results) ? parsed.results : [];

    if (results.length === 0) {
      return { currentStreak: 0, todayCount: 0, dailyGoal: 3 };
    }

    const dateSet = new Set<string>();
    const countByDate: Record<string, number> = {};

    results.forEach((r: { timestamp: number }) => {
      if (!r?.timestamp) return;
      const d = new Date(r.timestamp);
      // Format as local YYYY-MM-DD
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      dateSet.add(dateStr);
      countByDate[dateStr] = (countByDate[dateStr] || 0) + 1;
    });

    const now = new Date();
    const todayYear = now.getFullYear();
    const todayMonth = String(now.getMonth() + 1).padStart(2, '0');
    const todayDay = String(now.getDate()).padStart(2, '0');
    const todayStr = `${todayYear}-${todayMonth}-${todayDay}`;

    const todayCount = countByDate[todayStr] || 0;

    let currentStreak = 0;
    const checkDate = new Date();

    if (dateSet.has(todayStr)) {
      // Practiced today -> start counting backwards from today
      while (true) {
        const y = checkDate.getFullYear();
        const m = String(checkDate.getMonth() + 1).padStart(2, '0');
        const d = String(checkDate.getDate()).padStart(2, '0');
        const s = `${y}-${m}-${d}`;

        if (dateSet.has(s)) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    } else {
      // Not yet practiced today -> check if practiced yesterday to preserve active streak
      checkDate.setDate(checkDate.getDate() - 1);
      const yesterdayYear = checkDate.getFullYear();
      const yesterdayMonth = String(checkDate.getMonth() + 1).padStart(2, '0');
      const yesterdayDay = String(checkDate.getDate()).padStart(2, '0');
      const yesterdayStr = `${yesterdayYear}-${yesterdayMonth}-${yesterdayDay}`;

      if (dateSet.has(yesterdayStr)) {
        while (true) {
          const y = checkDate.getFullYear();
          const m = String(checkDate.getMonth() + 1).padStart(2, '0');
          const d = String(checkDate.getDate()).padStart(2, '0');
          const s = `${y}-${m}-${d}`;

          if (dateSet.has(s)) {
            currentStreak++;
            checkDate.setDate(checkDate.getDate() - 1);
          } else {
            break;
          }
        }
      }
    }

    return {
      currentStreak,
      todayCount,
      dailyGoal: 3
    };
  } catch (err) {
    console.warn('Failed to calculate streak from local storage:', err);
    return { currentStreak: 0, todayCount: 0, dailyGoal: 3 };
  }
}

/**
 * Reusable pill-shaped StreakCounter component
 */
export const StreakCounter: React.FC<StreakCounterProps> = ({
  className = '',
  compact = false,
  showLabel = false,
  onClick
}) => {
  // Try to read AppContext if available for fast reactive updates
  let appContext: ReturnType<typeof useApp> | null = null;
  try {
    appContext = useApp();
  } catch {
    appContext = null;
  }

  const [localStreak, setLocalStreak] = useState<LocalStreakData>(calculateStreakFromLocalStorage);

  const refreshStreak = useCallback(() => {
    setLocalStreak(calculateStreakFromLocalStorage());
  }, []);

  // Update whenever window focuses or storage event fires
  useEffect(() => {
    refreshStreak();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY || !e.key) {
        refreshStreak();
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('focus', refreshStreak);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('focus', refreshStreak);
    };
  }, [refreshStreak]);

  // If appContext has streakInfo, prefer it reactively
  const currentStreak = useMemo(() => {
    if (appContext?.streakInfo) {
      return appContext.streakInfo.currentStreak;
    }
    return localStreak.currentStreak;
  }, [appContext?.streakInfo, localStreak.currentStreak]);

  const todayCount = useMemo(() => {
    if (appContext?.streakInfo) {
      return appContext.streakInfo.todayCount;
    }
    return localStreak.todayCount;
  }, [appContext?.streakInfo, localStreak.todayCount]);

  const dailyGoal = useMemo(() => {
    if (appContext?.streakInfo) {
      return appContext.streakInfo.dailyGoal;
    }
    return localStreak.dailyGoal;
  }, [appContext?.streakInfo, localStreak.dailyGoal]);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (appContext?.setIsStreakModalOpen) {
      appContext.setIsStreakModalOpen(true);
    } else if (appContext?.setActiveTab) {
      appContext.setActiveTab('progress');
    }
  };

  const isActive = currentStreak > 0;

  const titleText = `${currentStreak} Day Practice Streak (${todayCount}/${dailyGoal} tests today)`;

  return (
    <button
      type="button"
      onClick={handleClick}
      title={titleText}
      aria-label={titleText}
      className={`
        inline-flex items-center rounded-full select-none transition-all duration-200 cursor-pointer
        ${compact ? 'gap-1 px-2.5 py-0.5 text-xs' : 'gap-1.5 px-3 py-1 text-xs'}
        ${
          isActive
            ? 'bg-amber-500/10 hover:bg-amber-500/15 text-amber-400 border border-amber-500/30 hover:border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
            : 'bg-zinc-900/90 hover:bg-zinc-850 text-zinc-400 hover:text-zinc-200 border border-zinc-800 hover:border-zinc-700'
        }
        ${className}
      `}
    >
      <Flame
        className={`shrink-0 ${compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} ${
          isActive ? 'text-amber-400 fill-amber-400 animate-pulse' : 'text-zinc-500'
        }`}
      />
      <span className="tabular-nums font-bold leading-none tracking-tight">
        {currentStreak}
      </span>
      {showLabel && (
        <span className="text-[11px] font-medium opacity-90 leading-none">
          {currentStreak === 1 ? 'day' : 'days'}
        </span>
      )}
    </button>
  );
};

export default StreakCounter;
