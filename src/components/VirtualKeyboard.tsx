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

// Standard ANSI 60% physical keyboard layout (5 proportional rows)
const KEYBOARD_ROWS: KeyDefinition[][] = [
  // Row 1: Numbers & Backspace
  [
    { id: '`', label: '`', sub: '~', width: 'w-6 sm:w-10' },
    { id: '1', label: '1', sub: '!', width: 'w-6 sm:w-10' },
    { id: '2', label: '2', sub: '@', width: 'w-6 sm:w-10' },
    { id: '3', label: '3', sub: '#', width: 'w-6 sm:w-10' },
    { id: '4', label: '4', sub: '$', width: 'w-6 sm:w-10' },
    { id: '5', label: '5', sub: '%', width: 'w-6 sm:w-10' },
    { id: '6', label: '6', sub: '^', width: 'w-6 sm:w-10' },
    { id: '7', label: '7', sub: '&', width: 'w-6 sm:w-10' },
    { id: '8', label: '8', sub: '*', width: 'w-6 sm:w-10' },
    { id: '9', label: '9', sub: '(', width: 'w-6 sm:w-10' },
    { id: '0', label: '0', sub: ')', width: 'w-6 sm:w-10' },
    { id: '-', label: '-', sub: '_', width: 'w-6 sm:w-10' },
    { id: '=', label: '=', sub: '+', width: 'w-6 sm:w-10' },
    { id: 'Backspace', shortName: 'Bksp', icon: '⌫', width: 'w-12 sm:w-20' }
  ],
  // Row 2: Tab, QWERTY, Backslash
  [
    { id: 'Tab', shortName: 'Tab', icon: '⇥', width: 'w-10 sm:w-16' },
    { id: 'q', label: 'Q', width: 'w-6 sm:w-10' },
    { id: 'w', label: 'W', width: 'w-6 sm:w-10' },
    { id: 'e', label: 'E', width: 'w-6 sm:w-10' },
    { id: 'r', label: 'R', width: 'w-6 sm:w-10' },
    { id: 't', label: 'T', width: 'w-6 sm:w-10' },
    { id: 'y', label: 'Y', width: 'w-6 sm:w-10' },
    { id: 'u', label: 'U', width: 'w-6 sm:w-10' },
    { id: 'i', label: 'I', width: 'w-6 sm:w-10' },
    { id: 'o', label: 'O', width: 'w-6 sm:w-10' },
    { id: 'p', label: 'P', width: 'w-6 sm:w-10' },
    { id: '[', label: '[', sub: '{', width: 'w-6 sm:w-10' },
    { id: ']', label: ']', sub: '}', width: 'w-6 sm:w-10' },
    { id: '\\', label: '\\', sub: '|', width: 'w-9 sm:w-14' }
  ],
  // Row 3: Caps Lock, Home row (F & J bumps), Enter
  [
    { id: 'CapsLock', shortName: 'Caps', icon: '⇪', width: 'w-11 sm:w-18' },
    { id: 'a', label: 'A', width: 'w-6 sm:w-10' },
    { id: 's', label: 'S', width: 'w-6 sm:w-10' },
    { id: 'd', label: 'D', width: 'w-6 sm:w-10' },
    { id: 'f', label: 'F', isHomeAnchor: true, width: 'w-6 sm:w-10' },
    { id: 'g', label: 'G', width: 'w-6 sm:w-10' },
    { id: 'h', label: 'H', width: 'w-6 sm:w-10' },
    { id: 'j', label: 'J', isHomeAnchor: true, width: 'w-6 sm:w-10' },
    { id: 'k', label: 'K', width: 'w-6 sm:w-10' },
    { id: 'l', label: 'L', width: 'w-6 sm:w-10' },
    { id: ';', label: ';', sub: ':', width: 'w-6 sm:w-10' },
    { id: '\'', label: '\'', sub: '"', width: 'w-6 sm:w-10' },
    { id: 'Enter', shortName: 'Enter', icon: '↵', width: 'w-14 sm:w-22' }
  ],
  // Row 4: Left Shift, Bottom row letters, Right Shift
  [
    { id: 'ShiftLeft', shortName: 'Shift', icon: '⇧', width: 'w-14 sm:w-24' },
    { id: 'z', label: 'Z', width: 'w-6 sm:w-10' },
    { id: 'x', label: 'X', width: 'w-6 sm:w-10' },
    { id: 'c', label: 'C', width: 'w-6 sm:w-10' },
    { id: 'v', label: 'V', width: 'w-6 sm:w-10' },
    { id: 'b', label: 'B', width: 'w-6 sm:w-10' },
    { id: 'n', label: 'N', width: 'w-6 sm:w-10' },
    { id: 'm', label: 'M', width: 'w-6 sm:w-10' },
    { id: ',', label: ',', sub: '<', width: 'w-6 sm:w-10' },
    { id: '.', label: '.', sub: '>', width: 'w-6 sm:w-10' },
    { id: '/', label: '/', sub: '?', width: 'w-6 sm:w-10' },
    { id: 'ShiftRight', shortName: 'Shift', icon: '⇧', width: 'w-16 sm:w-26' }
  ],
  // Row 5: Modifier row (Ctrl, Cmd, Alt, Space, Alt, Fn, Ctrl)
  [
    { id: 'Control', shortName: 'Ctrl', icon: '⌃', width: 'w-8 sm:w-13' },
    { id: 'Meta', shortName: 'Cmd', icon: '⌘', width: 'w-8 sm:w-13' },
    { id: 'Alt', shortName: 'Alt', icon: '⌥', width: 'w-8 sm:w-13' },
    { id: ' ', shortName: 'Space', icon: '␣', width: 'flex-1 min-w-[120px] sm:min-w-[240px]' },
    { id: 'AltRight', shortName: 'Alt', icon: '⌥', width: 'w-8 sm:w-13' },
    { id: 'Fn', shortName: 'Fn', icon: 'fn', width: 'w-8 sm:w-13' },
    { id: 'ControlRight', shortName: 'Ctrl', icon: '⌃', width: 'w-8 sm:w-13' }
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
      {/* Keyboard Shell - Pure black & dark-grey mechanical chassis */}
      <div className={`mx-auto p-2 sm:p-4 rounded-2xl bg-zinc-950/90 border border-zinc-800 shadow-xl backdrop-blur-md overflow-x-auto no-scrollbar max-w-4xl ${compact ? 'scale-90 origin-top' : ''}`}>
        <div className="min-w-[480px] sm:min-w-[660px] flex flex-col gap-1 sm:gap-2">
          {KEYBOARD_ROWS.map((row, rIdx) => (
            <div key={rIdx} className="flex justify-center gap-0.5 sm:gap-1.5">
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
                    style={
                      isPressed
                        ? {
                            backgroundColor: 'var(--accent-color)',
                            color: '#ffffff',
                            borderColor: 'var(--accent-color)',
                            boxShadow: '0 0 16px rgba(var(--accent-rgb), 0.6)'
                          }
                        : isExpected
                          ? {
                              borderColor: 'var(--accent-color)',
                              backgroundColor: 'rgba(var(--accent-rgb), 0.18)',
                              color: '#ffffff',
                              boxShadow: '0 0 14px rgba(var(--accent-rgb), 0.4), inset 0 0 8px rgba(var(--accent-rgb), 0.2)'
                            }
                          : undefined
                    }
                    className={`
                      relative flex flex-col items-center justify-center 
                      h-8 sm:h-12 rounded-md sm:rounded-xl text-[10px] sm:text-xs font-medium 
                      transition-all duration-75 select-none cursor-default
                      ${k.width || 'w-6 sm:w-10'}
                      ${isPressed 
                        ? 'translate-y-[2px] font-bold ring-2 ring-white/40' 
                        : isExpected 
                          ? 'border-2 font-bold ring-1 ring-white/20' 
                          : 'bg-zinc-900 border border-zinc-800 text-zinc-300 shadow-[0_2px_0_rgba(0,0,0,0.6)]'
                      }
                    `}
                  >
                    {/* Shifted secondary character on top */}
                    {k.sub && (
                      <span className={`text-[9px] sm:text-[10px] leading-none mb-0.5 ${isExpected ? 'text-white/80' : 'text-zinc-500'}`}>
                        {k.sub}
                      </span>
                    )}

                    {/* Primary label or Modifier icon & short name */}
                    {k.label ? (
                      <span className={`leading-none text-[11px] sm:text-xs ${isExpected ? 'text-white' : ''}`}>
                        {k.label}
                      </span>
                    ) : (
                      <div className={`flex items-center gap-1 leading-none ${isPressed || isExpected ? 'text-white' : 'text-zinc-400'}`}>
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
                      <span 
                        className="absolute bottom-1 w-2.5 h-0.5 rounded-full"
                        style={{
                          backgroundColor: isExpected || isPressed ? '#ffffff' : 'rgba(var(--accent-rgb), 0.7)'
                        }}
                      />
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
