import React, { useMemo } from 'react';

interface KeyDefinition {
  id: string;
  label?: string;
  sub?: string;
  icon?: string;
  shortName?: string;
  width?: string;
  isHomeAnchor?: boolean;
}

// Real standard ANSI 60% physical keyboard layout (5 proportional rows)
const KEYBOARD_ROWS: KeyDefinition[][] = [
  // Row 1: Numbers & Backspace
  [
    { id: '`', label: '`', sub: '~', width: 'w-8 sm:w-10' },
    { id: '1', label: '1', sub: '!', width: 'w-8 sm:w-10' },
    { id: '2', label: '2', sub: '@', width: 'w-8 sm:w-10' },
    { id: '3', label: '3', sub: '#', width: 'w-8 sm:w-10' },
    { id: '4', label: '4', sub: '$', width: 'w-8 sm:w-10' },
    { id: '5', label: '5', sub: '%', width: 'w-8 sm:w-10' },
    { id: '6', label: '6', sub: '^', width: 'w-8 sm:w-10' },
    { id: '7', label: '7', sub: '&', width: 'w-8 sm:w-10' },
    { id: '8', label: '8', sub: '*', width: 'w-8 sm:w-10' },
    { id: '9', label: '9', sub: '(', width: 'w-8 sm:w-10' },
    { id: '0', label: '0', sub: ')', width: 'w-8 sm:w-10' },
    { id: '-', label: '-', sub: '_', width: 'w-8 sm:w-10' },
    { id: '=', label: '=', sub: '+', width: 'w-8 sm:w-10' },
    { id: 'Backspace', shortName: 'Bksp', icon: '⌫', width: 'w-16 sm:w-20' }
  ],
  // Row 2: Tab, QWERTY, Backslash
  [
    { id: 'Tab', shortName: 'Tab', icon: '⇥', width: 'w-14 sm:w-16' },
    { id: 'q', label: 'Q', width: 'w-8 sm:w-10' },
    { id: 'w', label: 'W', width: 'w-8 sm:w-10' },
    { id: 'e', label: 'E', width: 'w-8 sm:w-10' },
    { id: 'r', label: 'R', width: 'w-8 sm:w-10' },
    { id: 't', label: 'T', width: 'w-8 sm:w-10' },
    { id: 'y', label: 'Y', width: 'w-8 sm:w-10' },
    { id: 'u', label: 'U', width: 'w-8 sm:w-10' },
    { id: 'i', label: 'I', width: 'w-8 sm:w-10' },
    { id: 'o', label: 'O', width: 'w-8 sm:w-10' },
    { id: 'p', label: 'P', width: 'w-8 sm:w-10' },
    { id: '[', label: '[', sub: '{', width: 'w-8 sm:w-10' },
    { id: ']', label: ']', sub: '}', width: 'w-8 sm:w-10' },
    { id: '\\', label: '\\', sub: '|', width: 'w-12 sm:w-14' }
  ],
  // Row 3: Caps Lock, Home row (F & J bumps), Enter
  [
    { id: 'CapsLock', shortName: 'Caps', icon: '⇪', width: 'w-16 sm:w-18' },
    { id: 'a', label: 'A', width: 'w-8 sm:w-10' },
    { id: 's', label: 'S', width: 'w-8 sm:w-10' },
    { id: 'd', label: 'D', width: 'w-8 sm:w-10' },
    { id: 'f', label: 'F', isHomeAnchor: true, width: 'w-8 sm:w-10' },
    { id: 'g', label: 'G', width: 'w-8 sm:w-10' },
    { id: 'h', label: 'H', width: 'w-8 sm:w-10' },
    { id: 'j', label: 'J', isHomeAnchor: true, width: 'w-8 sm:w-10' },
    { id: 'k', label: 'K', width: 'w-8 sm:w-10' },
    { id: 'l', label: 'L', width: 'w-8 sm:w-10' },
    { id: ';', label: ';', sub: ':', width: 'w-8 sm:w-10' },
    { id: '\'', label: '\'', sub: '"', width: 'w-8 sm:w-10' },
    { id: 'Enter', shortName: 'Enter', icon: '↵', width: 'w-18 sm:w-22' }
  ],
  // Row 4: Left Shift, Bottom row letters, Right Shift
  [
    { id: 'ShiftLeft', shortName: 'Shift', icon: '⇧', width: 'w-20 sm:w-24' },
    { id: 'z', label: 'Z', width: 'w-8 sm:w-10' },
    { id: 'x', label: 'X', width: 'w-8 sm:w-10' },
    { id: 'c', label: 'C', width: 'w-8 sm:w-10' },
    { id: 'v', label: 'V', width: 'w-8 sm:w-10' },
    { id: 'b', label: 'B', width: 'w-8 sm:w-10' },
    { id: 'n', label: 'N', width: 'w-8 sm:w-10' },
    { id: 'm', label: 'M', width: 'w-8 sm:w-10' },
    { id: ',', label: ',', sub: '<', width: 'w-8 sm:w-10' },
    { id: '.', label: '.', sub: '>', width: 'w-8 sm:w-10' },
    { id: '/', label: '/', sub: '?', width: 'w-8 sm:w-10' },
    { id: 'ShiftRight', shortName: 'Shift', icon: '⇧', width: 'w-22 sm:w-26' }
  ],
  // Row 5: Real modifier row (Ctrl, Cmd, Alt, Space, Alt, Fn, Ctrl)
  [
    { id: 'Control', shortName: 'Ctrl', icon: '⌃', width: 'w-11 sm:w-13' },
    { id: 'Meta', shortName: 'Cmd', icon: '⌘', width: 'w-11 sm:w-13' },
    { id: 'Alt', shortName: 'Alt', icon: '⌥', width: 'w-11 sm:w-13' },
    { id: ' ', shortName: 'Space', icon: '␣', width: 'flex-1 min-w-[180px] sm:min-w-[240px]' },
    { id: 'AltRight', shortName: 'Alt', icon: '⌥', width: 'w-11 sm:w-13' },
    { id: 'Fn', shortName: 'Fn', icon: 'fn', width: 'w-11 sm:w-13' },
    { id: 'ControlRight', shortName: 'Ctrl', icon: '⌃', width: 'w-11 sm:w-13' }
  ]
];

// Mapping of symbols requiring Shift to their base key
const SYMBOL_BASE_KEY_MAP: Record<string, string> = {
  '~': '`', '!': '1', '@': '2', '#': '3', '$': '4', '%': '5',
  '^': '6', '&': '7', '*': '8', '(': '9', ')': '0', '_': '-',
  '+': '=', '{': '[', '}': ']', '|': '\\', ':': ';', '"': '\'',
  '<': ',', '>': '.', '?': '/'
};

interface VirtualKeyboardProps {
  expectedKey?: string;
  activeKeyPressed?: string | null;
  highlightFingers?: boolean;
  compact?: boolean;
}

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  expectedKey = '',
  activeKeyPressed = null,
  compact = false
}) => {
  // Normalize expected key
  const normalizedExpected = useMemo(() => {
    if (!expectedKey) return '';
    if (expectedKey === ' ') return ' ';
    return expectedKey;
  }, [expectedKey]);

  // Determine if expected key requires Shift
  const requiresShift = useMemo(() => {
    if (!expectedKey) return false;
    if (expectedKey === ' ') return false;
    if (SYMBOL_BASE_KEY_MAP[expectedKey]) return true;
    return expectedKey.length === 1 && expectedKey !== expectedKey.toLowerCase();
  }, [expectedKey]);

  // Target base key id
  const targetBaseKeyId = useMemo(() => {
    if (!normalizedExpected) return '';
    if (normalizedExpected === ' ') return ' ';
    if (SYMBOL_BASE_KEY_MAP[normalizedExpected]) {
      return SYMBOL_BASE_KEY_MAP[normalizedExpected];
    }
    return normalizedExpected.toLowerCase();
  }, [normalizedExpected]);

  return (
    <div className="w-full select-none">
      {/* Keyboard Shell - Clean real mechanical board styling without hover response */}
      <div className={`mx-auto p-2.5 sm:p-3.5 rounded-2xl bg-zinc-200/60 dark:bg-zinc-900/80 border border-zinc-300/60 dark:border-zinc-800/80 backdrop-blur-md shadow-xs overflow-x-auto max-w-4xl ${compact ? 'scale-90 origin-top' : ''}`}>
        <div className="min-w-[660px] flex flex-col gap-1.5 sm:gap-2">
          {KEYBOARD_ROWS.map((row, rIdx) => (
            <div key={rIdx} className="flex justify-center gap-1 sm:gap-1.5">
              {row.map(k => {
                const keyLower = k.id.toLowerCase();

                // Expected key matching
                const isDirectExpected = 
                  (k.id === ' ' && targetBaseKeyId === ' ') ||
                  (k.id.length === 1 && keyLower === targetBaseKeyId);

                const isShiftExpected = 
                  requiresShift && 
                  (k.id === 'ShiftLeft' || k.id === 'ShiftRight');

                const isExpected = isDirectExpected || isShiftExpected;

                // Active pressed key matching
                const isPressed = 
                  activeKeyPressed && (
                    (activeKeyPressed === ' ' && k.id === ' ') ||
                    (activeKeyPressed.toLowerCase() === keyLower) ||
                    (activeKeyPressed === 'Backspace' && k.id === 'Backspace') ||
                    (activeKeyPressed === 'Enter' && k.id === 'Enter') ||
                    (activeKeyPressed === 'Tab' && k.id === 'Tab') ||
                    (activeKeyPressed === 'CapsLock' && k.id === 'CapsLock') ||
                    (activeKeyPressed === 'Shift' && (k.id === 'ShiftLeft' || k.id === 'ShiftRight')) ||
                    (activeKeyPressed === 'Control' && (k.id === 'Control' || k.id === 'ControlRight')) ||
                    (activeKeyPressed === 'Alt' && (k.id === 'Alt' || k.id === 'AltRight')) ||
                    (activeKeyPressed === 'Meta' && k.id === 'Meta')
                  );

                return (
                  <div
                    key={k.id}
                    className={`
                      relative flex flex-col items-center justify-center 
                      h-10 sm:h-12 rounded-lg sm:rounded-xl text-xs font-medium 
                      transition-transform duration-75 select-none cursor-default
                      ${k.width || 'w-8 sm:w-10'}
                      ${isPressed 
                        ? 'bg-blue-600 text-white shadow-none translate-y-[2px] ring-2 ring-blue-400/50' 
                        : isExpected 
                          ? 'bg-blue-50/90 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-2 border-blue-500 shadow-sm font-semibold ring-2 ring-blue-500/20' 
                          : 'bg-white dark:bg-zinc-800/90 border border-zinc-200 dark:border-zinc-700/70 text-zinc-700 dark:text-zinc-200 shadow-[0_2px_0_rgba(0,0,0,0.05)] dark:shadow-[0_2px_0_rgba(0,0,0,0.4)]'
                      }
                    `}
                  >
                    {/* Shifted secondary character on top */}
                    {k.sub && (
                      <span className="text-[9px] sm:text-[10px] text-zinc-400 dark:text-zinc-500 leading-none mb-0.5">
                        {k.sub}
                      </span>
                    )}

                    {/* Primary label or Modifier icon & short name */}
                    {k.label ? (
                      <span className="leading-none text-[11px] sm:text-xs">
                        {k.label}
                      </span>
                    ) : (
                      <div className="flex items-center gap-1 leading-none text-zinc-600 dark:text-zinc-300">
                        {k.icon && (
                          <span className="text-[11px] sm:text-xs font-semibold opacity-90">
                            {k.icon}
                          </span>
                        )}
                        {k.shortName && (
                          <span className="text-[10px] sm:text-[11px] font-medium tracking-tight">
                            {k.shortName}
                          </span>
                        )}
                      </div>
                    )}

                    {/* F & J physical tactile homing bumps */}
                    {k.isHomeAnchor && (
                      <span className="absolute bottom-1 w-2.5 h-0.5 rounded-full bg-zinc-400/80 dark:bg-zinc-500" />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
