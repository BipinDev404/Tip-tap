import React, { useMemo, useState } from 'react';
import { Hand, Eye, Sparkles } from 'lucide-react';

export type FingerId =
  | 'left-pinky'
  | 'left-ring'
  | 'left-middle'
  | 'left-index'
  | 'thumbs'
  | 'right-index'
  | 'right-middle'
  | 'right-ring'
  | 'right-pinky';

interface FingerMeta {
  id: FingerId;
  hand: 'Left Hand' | 'Right Hand' | 'Both Thumbs';
  name: string;
  shortLabel: string;
  fingerOnly: string;
  colorHex: string;
  bgTint: string;
  borderTint: string;
  textClass: string;
  badgeBg: string;
  barClass: string;
}

export const FINGER_METADATA: Record<FingerId, FingerMeta> = {
  'left-pinky': {
    id: 'left-pinky',
    hand: 'Left Hand',
    name: 'Left Pinky',
    shortLabel: 'L · Pinky',
    fingerOnly: 'Pinky',
    colorHex: '#f43f5e',
    bgTint: 'rgba(244, 63, 94, 0.14)',
    borderTint: 'rgba(244, 63, 94, 0.45)',
    textClass: 'text-rose-400',
    badgeBg: 'bg-rose-500/20 border-rose-500/40 text-rose-300',
    barClass: 'bg-rose-500'
  },
  'left-ring': {
    id: 'left-ring',
    hand: 'Left Hand',
    name: 'Left Ring',
    shortLabel: 'L · Ring',
    fingerOnly: 'Ring',
    colorHex: '#f59e0b',
    bgTint: 'rgba(245, 158, 11, 0.14)',
    borderTint: 'rgba(245, 158, 11, 0.45)',
    textClass: 'text-amber-400',
    badgeBg: 'bg-amber-500/20 border-amber-500/40 text-amber-300',
    barClass: 'bg-amber-500'
  },
  'left-middle': {
    id: 'left-middle',
    hand: 'Left Hand',
    name: 'Left Middle',
    shortLabel: 'L · Middle',
    fingerOnly: 'Middle',
    colorHex: '#10b981',
    bgTint: 'rgba(16, 185, 129, 0.14)',
    borderTint: 'rgba(16, 185, 129, 0.45)',
    textClass: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300',
    barClass: 'bg-emerald-500'
  },
  'left-index': {
    id: 'left-index',
    hand: 'Left Hand',
    name: 'Left Index',
    shortLabel: 'L · Index',
    fingerOnly: 'Index',
    colorHex: '#38bdf8',
    bgTint: 'rgba(56, 189, 248, 0.15)',
    borderTint: 'rgba(56, 189, 248, 0.45)',
    textClass: 'text-sky-400',
    badgeBg: 'bg-sky-500/20 border-sky-500/40 text-sky-300',
    barClass: 'bg-sky-400'
  },
  'thumbs': {
    id: 'thumbs',
    hand: 'Both Thumbs',
    name: 'Thumb',
    shortLabel: 'Thumb',
    fingerOnly: 'Thumb',
    colorHex: '#a855f7',
    bgTint: 'rgba(168, 85, 247, 0.15)',
    borderTint: 'rgba(168, 85, 247, 0.45)',
    textClass: 'text-purple-400',
    badgeBg: 'bg-purple-500/20 border-purple-500/40 text-purple-300',
    barClass: 'bg-purple-500'
  },
  'right-index': {
    id: 'right-index',
    hand: 'Right Hand',
    name: 'Right Index',
    shortLabel: 'R · Index',
    fingerOnly: 'Index',
    colorHex: '#818cf8',
    bgTint: 'rgba(129, 140, 248, 0.15)',
    borderTint: 'rgba(129, 140, 248, 0.45)',
    textClass: 'text-indigo-400',
    badgeBg: 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300',
    barClass: 'bg-indigo-400'
  },
  'right-middle': {
    id: 'right-middle',
    hand: 'Right Hand',
    name: 'Right Middle',
    shortLabel: 'R · Middle',
    fingerOnly: 'Middle',
    colorHex: '#10b981',
    bgTint: 'rgba(16, 185, 129, 0.14)',
    borderTint: 'rgba(16, 185, 129, 0.45)',
    textClass: 'text-emerald-400',
    badgeBg: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300',
    barClass: 'bg-emerald-500'
  },
  'right-ring': {
    id: 'right-ring',
    hand: 'Right Hand',
    name: 'Right Ring',
    shortLabel: 'R · Ring',
    fingerOnly: 'Ring',
    colorHex: '#f59e0b',
    bgTint: 'rgba(245, 158, 11, 0.14)',
    borderTint: 'rgba(245, 158, 11, 0.45)',
    textClass: 'text-amber-400',
    badgeBg: 'bg-amber-500/20 border-amber-500/40 text-amber-300',
    barClass: 'bg-amber-500'
  },
  'right-pinky': {
    id: 'right-pinky',
    hand: 'Right Hand',
    name: 'Right Pinky',
    shortLabel: 'R · Pinky',
    fingerOnly: 'Pinky',
    colorHex: '#f43f5e',
    bgTint: 'rgba(244, 63, 94, 0.14)',
    borderTint: 'rgba(244, 63, 94, 0.45)',
    textClass: 'text-rose-400',
    badgeBg: 'bg-rose-500/20 border-rose-500/40 text-rose-300',
    barClass: 'bg-rose-500'
  }
};

interface KeyDefinition {
  id: string;
  label?: string;
  sub?: string;
  icon?: string;
  shortName?: string;
  flexClass: string;
  finger: FingerId;
  isHomeAnchor?: boolean;
  isHomeRowKey?: boolean;
}

// Proportional 5-row ANSI keyboard layout where each row sums to ~15 units so all rows align and scale to 100% width
const KEYBOARD_ROWS: KeyDefinition[][] = [
  // Row 1: Numbers & Backspace
  [
    { id: '`', label: '`', sub: '~', flexClass: 'flex-[10]', finger: 'left-pinky' },
    { id: '1', label: '1', sub: '!', flexClass: 'flex-[10]', finger: 'left-pinky' },
    { id: '2', label: '2', sub: '@', flexClass: 'flex-[10]', finger: 'left-ring' },
    { id: '3', label: '3', sub: '#', flexClass: 'flex-[10]', finger: 'left-middle' },
    { id: '4', label: '4', sub: '$', flexClass: 'flex-[10]', finger: 'left-index' },
    { id: '5', label: '5', sub: '%', flexClass: 'flex-[10]', finger: 'left-index' },
    { id: '6', label: '6', sub: '^', flexClass: 'flex-[10]', finger: 'right-index' },
    { id: '7', label: '7', sub: '&', flexClass: 'flex-[10]', finger: 'right-index' },
    { id: '8', label: '8', sub: '*', flexClass: 'flex-[10]', finger: 'right-middle' },
    { id: '9', label: '9', sub: '(', flexClass: 'flex-[10]', finger: 'right-ring' },
    { id: '0', label: '0', sub: ')', flexClass: 'flex-[10]', finger: 'right-pinky' },
    { id: '-', label: '-', sub: '_', flexClass: 'flex-[10]', finger: 'right-pinky' },
    { id: '=', label: '=', sub: '+', flexClass: 'flex-[10]', finger: 'right-pinky' },
    { id: 'Backspace', shortName: 'Bksp', icon: '⌫', flexClass: 'flex-[20]', finger: 'right-pinky' }
  ],
  // Row 2: Tab, QWERTY, Backslash
  [
    { id: 'Tab', shortName: 'Tab', icon: '⇥', flexClass: 'flex-[15]', finger: 'left-pinky' },
    { id: 'q', label: 'Q', flexClass: 'flex-[10]', finger: 'left-pinky' },
    { id: 'w', label: 'W', flexClass: 'flex-[10]', finger: 'left-ring' },
    { id: 'e', label: 'E', flexClass: 'flex-[10]', finger: 'left-middle' },
    { id: 'r', label: 'R', flexClass: 'flex-[10]', finger: 'left-index' },
    { id: 't', label: 'T', flexClass: 'flex-[10]', finger: 'left-index' },
    { id: 'y', label: 'Y', flexClass: 'flex-[10]', finger: 'right-index' },
    { id: 'u', label: 'U', flexClass: 'flex-[10]', finger: 'right-index' },
    { id: 'i', label: 'I', flexClass: 'flex-[10]', finger: 'right-middle' },
    { id: 'o', label: 'O', flexClass: 'flex-[10]', finger: 'right-ring' },
    { id: 'p', label: 'P', flexClass: 'flex-[10]', finger: 'right-pinky' },
    { id: '[', label: '[', sub: '{', flexClass: 'flex-[10]', finger: 'right-pinky' },
    { id: ']', label: ']', sub: '}', flexClass: 'flex-[10]', finger: 'right-pinky' },
    { id: '\\', label: '\\', sub: '|', flexClass: 'flex-[15]', finger: 'right-pinky' }
  ],
  // Row 3: Caps Lock, Home row (A S D F - J K L ;), Enter
  [
    { id: 'CapsLock', shortName: 'Caps', icon: '⇪', flexClass: 'flex-[18]', finger: 'left-pinky' },
    { id: 'a', label: 'A', flexClass: 'flex-[10]', finger: 'left-pinky', isHomeRowKey: true },
    { id: 's', label: 'S', flexClass: 'flex-[10]', finger: 'left-ring', isHomeRowKey: true },
    { id: 'd', label: 'D', flexClass: 'flex-[10]', finger: 'left-middle', isHomeRowKey: true },
    { id: 'f', label: 'F', flexClass: 'flex-[10]', finger: 'left-index', isHomeAnchor: true, isHomeRowKey: true },
    { id: 'g', label: 'G', flexClass: 'flex-[10]', finger: 'left-index' },
    { id: 'h', label: 'H', flexClass: 'flex-[10]', finger: 'right-index' },
    { id: 'j', label: 'J', flexClass: 'flex-[10]', finger: 'right-index', isHomeAnchor: true, isHomeRowKey: true },
    { id: 'k', label: 'K', flexClass: 'flex-[10]', finger: 'right-middle', isHomeRowKey: true },
    { id: 'l', label: 'L', flexClass: 'flex-[10]', finger: 'right-ring', isHomeRowKey: true },
    { id: ';', label: ';', sub: ':', flexClass: 'flex-[10]', finger: 'right-pinky', isHomeRowKey: true },
    { id: '\'', label: '\'', sub: '"', flexClass: 'flex-[10]', finger: 'right-pinky' },
    { id: 'Enter', shortName: 'Enter', icon: '↵', flexClass: 'flex-[22]', finger: 'right-pinky' }
  ],
  // Row 4: Left Shift, Bottom row letters, Right Shift
  [
    { id: 'ShiftLeft', shortName: 'Shift', icon: '⇧', flexClass: 'flex-[23]', finger: 'left-pinky' },
    { id: 'z', label: 'Z', flexClass: 'flex-[10]', finger: 'left-pinky' },
    { id: 'x', label: 'X', flexClass: 'flex-[10]', finger: 'left-ring' },
    { id: 'c', label: 'C', flexClass: 'flex-[10]', finger: 'left-middle' },
    { id: 'v', label: 'V', flexClass: 'flex-[10]', finger: 'left-index' },
    { id: 'b', label: 'B', flexClass: 'flex-[10]', finger: 'left-index' },
    { id: 'n', label: 'N', flexClass: 'flex-[10]', finger: 'right-index' },
    { id: 'm', label: 'M', flexClass: 'flex-[10]', finger: 'right-index' },
    { id: ',', label: ',', sub: '<', flexClass: 'flex-[10]', finger: 'right-middle' },
    { id: '.', label: '.', sub: '>', flexClass: 'flex-[10]', finger: 'right-ring' },
    { id: '/', label: '/', sub: '?', flexClass: 'flex-[10]', finger: 'right-pinky' },
    { id: 'ShiftRight', shortName: 'Shift', icon: '⇧', flexClass: 'flex-[27]', finger: 'right-pinky' }
  ],
  // Row 5: Modifier row (Ctrl, Cmd, Alt, Space, Alt, Fn, Ctrl)
  [
    { id: 'Control', shortName: 'Ctrl', icon: '⌃', flexClass: 'flex-[14]', finger: 'left-pinky' },
    { id: 'Meta', shortName: 'Cmd', icon: '⌘', flexClass: 'flex-[14]', finger: 'left-ring' },
    { id: 'Alt', shortName: 'Alt', icon: '⌥', flexClass: 'flex-[14]', finger: 'left-middle' },
    { id: ' ', shortName: 'Space', icon: '␣', flexClass: 'flex-[66]', finger: 'thumbs' },
    { id: 'AltRight', shortName: 'Alt', icon: '⌥', flexClass: 'flex-[14]', finger: 'right-ring' },
    { id: 'Fn', shortName: 'Fn', icon: 'fn', flexClass: 'flex-[14]', finger: 'right-pinky' },
    { id: 'ControlRight', shortName: 'Ctrl', icon: '⌃', flexClass: 'flex-[14]', finger: 'right-pinky' }
  ]
];

// Fast lookup map from key ID -> KeyDefinition
const KEY_LOOKUP: Record<string, KeyDefinition> = {};
KEYBOARD_ROWS.forEach(row => {
  row.forEach(k => {
    KEY_LOOKUP[k.id.toLowerCase()] = k;
    KEY_LOOKUP[k.id] = k;
  });
});

// Mapping of symbols requiring Shift to their base key
const SYMBOL_BASE_KEY_MAP: Record<string, string> = {
  '~': '`', '!': '1', '@': '2', '#': '3', '$': '4', '%': '5',
  '^': '6', '&': '7', '*': '8', '(': '9', ')': '0', '_': '-',
  '+': '=', '{': '[', '}': ']', '|': '\\', ':': ';', '"': '\'',
  '<': ',', '>': '.', '?': '/'
};

// Visual finger heights for the 2-hand anatomical indicator
const LEFT_HAND_FINGERS: { id: FingerId; label: string; heightClass: string; homeKey: string }[] = [
  { id: 'left-pinky', label: 'Pinky', heightClass: 'h-4 sm:h-5', homeKey: 'A' },
  { id: 'left-ring', label: 'Ring', heightClass: 'h-5 sm:h-6', homeKey: 'S' },
  { id: 'left-middle', label: 'Mid', heightClass: 'h-6 sm:h-7', homeKey: 'D' },
  { id: 'left-index', label: 'Index', heightClass: 'h-5 sm:h-6', homeKey: 'F' },
  { id: 'thumbs', label: 'Thumb', heightClass: 'h-3.5 sm:h-4', homeKey: '␣' }
];

const RIGHT_HAND_FINGERS: { id: FingerId; label: string; heightClass: string; homeKey: string }[] = [
  { id: 'thumbs', label: 'Thumb', heightClass: 'h-3.5 sm:h-4', homeKey: '␣' },
  { id: 'right-index', label: 'Index', heightClass: 'h-5 sm:h-6', homeKey: 'J' },
  { id: 'right-middle', label: 'Mid', heightClass: 'h-6 sm:h-7', homeKey: 'K' },
  { id: 'right-ring', label: 'Ring', heightClass: 'h-5 sm:h-6', homeKey: 'L' },
  { id: 'right-pinky', label: 'Pinky', heightClass: 'h-4 sm:h-5', homeKey: ';' }
];

interface VirtualKeyboardProps {
  expectedKey?: string;
  activeKeyPressed?: string | null;
  highlightFingers?: boolean;
  compact?: boolean;
  onKeyPress?: (key: string) => void;
}

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  expectedKey = '',
  activeKeyPressed = null,
  highlightFingers = true,
  compact = false,
  onKeyPress
}) => {
  const [showZoneColors, setShowZoneColors] = useState<boolean>(highlightFingers);

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

  // Target key definition & finger metadata
  const targetKeyDef = useMemo(() => {
    if (!targetBaseKeyId) return null;
    return KEY_LOOKUP[targetBaseKeyId] || null;
  }, [targetBaseKeyId]);

  const targetFingerMeta = useMemo(() => {
    if (!targetKeyDef) return null;
    return FINGER_METADATA[targetKeyDef.finger];
  }, [targetKeyDef]);

  // Opposite-hand Shift key logic for proper touch typing
  const expectedShiftKeyId = useMemo(() => {
    if (!requiresShift || !targetFingerMeta) return null;
    return targetFingerMeta.hand === 'Left Hand' ? 'ShiftRight' : 'ShiftLeft';
  }, [requiresShift, targetFingerMeta]);

  const shiftFingerMeta = useMemo(() => {
    if (!expectedShiftKeyId) return null;
    return expectedShiftKeyId === 'ShiftRight'
      ? FINGER_METADATA['right-pinky']
      : FINGER_METADATA['left-pinky'];
  }, [expectedShiftKeyId]);

  const displayKeyLabel = useMemo(() => {
    if (!normalizedExpected) return 'Ready';
    if (normalizedExpected === ' ') return 'Spacebar (␣)';
    return `"${normalizedExpected}"`;
  }, [normalizedExpected]);

  return (
    <div className="w-full select-none">
      {/* Full-Width Keyboard Container — Matches Typing Box width (max-w-4xl) and scales down on small displays */}
      <div
        className={`w-full rounded-2xl sm:rounded-3xl bg-zinc-950/90 border border-zinc-800/90 shadow-2xl backdrop-blur-md transition-all duration-200 ${
          compact ? 'p-2 sm:p-3' : 'p-2.5 sm:p-4 md:p-5'
        }`}
      >
        {/* Top Interactive Finger Guidance Header + 10-Finger Hand Map */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2 sm:gap-3 pb-2.5 sm:pb-3 mb-2.5 sm:mb-3 border-b border-zinc-800/80">
          
          {/* Left: Real-Time "Where to Click & With Which Finger" Callout */}
          <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-3 min-w-0">
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
              <div
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center border shrink-0 transition-colors duration-150"
                style={
                  targetFingerMeta
                    ? {
                        backgroundColor: targetFingerMeta.bgTint,
                        borderColor: targetFingerMeta.borderTint,
                        color: targetFingerMeta.colorHex
                      }
                    : {
                        backgroundColor: 'rgba(39,39,42,0.6)',
                        borderColor: 'rgba(63,63,70,0.6)',
                        color: '#a1a1aa'
                      }
                }
              >
                <Hand className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>

              {targetFingerMeta ? (
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] sm:text-xs text-zinc-400">Next Key:</span>
                    <span className="px-2 py-0.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs sm:text-sm font-mono font-bold text-white shadow-2xs">
                      {displayKeyLabel}
                    </span>
                  </div>

                  <span className="text-zinc-600 hidden xs:inline">→</span>

                  {/* Primary Finger Badge */}
                  <div
                    className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg border text-[11px] sm:text-xs font-semibold tracking-wide transition-all"
                    style={{
                      backgroundColor: targetFingerMeta.bgTint,
                      borderColor: targetFingerMeta.borderTint,
                      color: '#ffffff'
                    }}
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: targetFingerMeta.colorHex }}
                    />
                    <span>Use {targetFingerMeta.name}</span>
                  </div>

                  {/* Opposite-Hand Shift Finger Badge when uppercase or shifted symbol */}
                  {requiresShift && shiftFingerMeta && (
                    <div
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[10px] sm:text-[11px] font-semibold"
                      style={{
                        backgroundColor: shiftFingerMeta.bgTint,
                        borderColor: shiftFingerMeta.borderTint,
                        color: '#f4f4f5'
                      }}
                    >
                      <span>+ Hold ⇧ with {shiftFingerMeta.name}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-xs text-zinc-400 font-medium">
                  Place fingers on Home Row (<span className="text-zinc-200 font-mono">A S D F</span> &amp; <span className="text-zinc-200 font-mono">J K L ;</span>)
                </div>
              )}
            </div>

            {/* Toggle Finger Zone Colors on mobile/tablet right edge */}
            <button
              type="button"
              onClick={() => setShowZoneColors(v => !v)}
              className={`lg:hidden flex items-center gap-1 px-2 py-1 rounded-lg border text-[10px] font-medium transition-all cursor-pointer shrink-0 ${
                showZoneColors
                  ? 'bg-zinc-800 text-zinc-100 border-zinc-700'
                  : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:text-zinc-200'
              }`}
              title="Toggle finger zone colors on keys"
            >
              <Eye className="w-3 h-3 text-accent" />
              <span>Zones</span>
            </button>
          </div>

          {/* Right: Visual 10-Finger Left & Right Hand Diagram + Zone Toggle */}
          <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-4">
            {/* Interactive 2-Hand 10-Finger Visual Indicator */}
            <div className="flex items-end justify-center gap-3 sm:gap-5 px-2.5 py-1 rounded-xl bg-zinc-900/80 border border-zinc-800/80 w-full sm:w-auto">
              {/* Left Hand */}
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] sm:text-[10px] font-medium text-zinc-500 mr-0.5">Left</span>
                <div className="flex items-end gap-1">
                  {LEFT_HAND_FINGERS.map((f) => {
                    const meta = FINGER_METADATA[f.id];
                    const isPrimaryFinger =
                      targetFingerMeta?.id === f.id &&
                      (f.id !== 'thumbs' || targetFingerMeta.id === 'thumbs');
                    const isShiftFinger =
                      requiresShift && expectedShiftKeyId === 'ShiftLeft' && f.id === 'left-pinky';
                    const isActive = isPrimaryFinger || isShiftFinger;

                    return (
                      <div
                        key={`lh-${f.id}`}
                        className="flex flex-col items-center gap-0.5"
                        title={`${meta.name} (Home: ${f.homeKey})`}
                      >
                        <div
                          className={`w-4 sm:w-5 ${f.heightClass} rounded-t-full rounded-b-sm flex flex-col items-center justify-end pb-0.5 border transition-all duration-150 ${
                            isActive ? '-translate-y-1 font-bold' : 'opacity-65'
                          }`}
                          style={{
                            backgroundColor: isActive ? meta.colorHex : meta.bgTint,
                            borderColor: isActive ? '#ffffff' : meta.borderTint,
                            boxShadow: isActive ? `0 0 10px ${meta.colorHex}` : 'none'
                          }}
                        >
                          <span
                            className={`text-[8px] sm:text-[9px] leading-none font-mono ${
                              isActive ? 'text-zinc-950 font-extrabold' : 'text-zinc-300'
                            }`}
                          >
                            {isShiftFinger ? '⇧' : f.homeKey}
                          </span>
                        </div>
                        <span
                          className={`text-[8px] leading-none tracking-tight ${
                            isActive ? 'text-white font-semibold' : 'text-zinc-500'
                          }`}
                        >
                          {f.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="h-6 w-px bg-zinc-800 shrink-0" />

              {/* Right Hand */}
              <div className="flex items-center gap-1.5">
                <div className="flex items-end gap-1">
                  {RIGHT_HAND_FINGERS.map((f) => {
                    const meta = FINGER_METADATA[f.id];
                    const isPrimaryFinger =
                      targetFingerMeta?.id === f.id &&
                      (f.id !== 'thumbs' || targetFingerMeta.id === 'thumbs');
                    const isShiftFinger =
                      requiresShift && expectedShiftKeyId === 'ShiftRight' && f.id === 'right-pinky';
                    const isActive = isPrimaryFinger || isShiftFinger;

                    return (
                      <div
                        key={`rh-${f.id}`}
                        className="flex flex-col items-center gap-0.5"
                        title={`${meta.name} (Home: ${f.homeKey})`}
                      >
                        <div
                          className={`w-4 sm:w-5 ${f.heightClass} rounded-t-full rounded-b-sm flex flex-col items-center justify-end pb-0.5 border transition-all duration-150 ${
                            isActive ? '-translate-y-1 font-bold' : 'opacity-65'
                          }`}
                          style={{
                            backgroundColor: isActive ? meta.colorHex : meta.bgTint,
                            borderColor: isActive ? '#ffffff' : meta.borderTint,
                            boxShadow: isActive ? `0 0 10px ${meta.colorHex}` : 'none'
                          }}
                        >
                          <span
                            className={`text-[8px] sm:text-[9px] leading-none font-mono ${
                              isActive ? 'text-zinc-950 font-extrabold' : 'text-zinc-300'
                            }`}
                          >
                            {isShiftFinger ? '⇧' : f.homeKey}
                          </span>
                        </div>
                        <span
                          className={`text-[8px] leading-none tracking-tight ${
                            isActive ? 'text-white font-semibold' : 'text-zinc-500'
                          }`}
                        >
                          {f.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <span className="text-[9px] sm:text-[10px] font-medium text-zinc-500 ml-0.5">Right</span>
              </div>
            </div>

            {/* Desktop Toggle Finger Zone Colors */}
            <button
              type="button"
              onClick={() => setShowZoneColors(v => !v)}
              className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[11px] font-medium transition-all cursor-pointer shrink-0 ${
                showZoneColors
                  ? 'bg-zinc-800 text-zinc-100 border-zinc-700'
                  : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:text-zinc-200'
              }`}
              title="Toggle color-coded finger zones on keyboard keys"
            >
              <Eye className="w-3.5 h-3.5 text-accent" />
              <span>Finger Zones</span>
            </button>
          </div>
        </div>

        {/* Proportional 5-Row Keyboard Grid — Scales smoothly to fit any screen size without overflow */}
        <div className="w-full flex flex-col gap-1 sm:gap-1.5">
          {KEYBOARD_ROWS.map((row, rIdx) => (
            <div key={rIdx} className="w-full flex items-center justify-between gap-1 sm:gap-1.5">
              {row.map(k => {
                const keyLower = k.id.toLowerCase();
                const fingerMeta = FINGER_METADATA[k.finger];

                // Expected key matching
                const isDirectExpected =
                  (k.id === ' ' && targetBaseKeyId === ' ') ||
                  (k.id.length === 1 && keyLower === targetBaseKeyId);

                const isShiftExpected =
                  requiresShift && k.id === expectedShiftKeyId;

                const isExpected = isDirectExpected || isShiftExpected;

                // Active pressed key matching
                const isPressed = Boolean(
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
                  )
                );

                return (
                  <div
                    key={k.id}
                    onClick={() => {
                      if (onKeyPress && k.id.length === 1) {
                        onKeyPress(k.id);
                      }
                    }}
                    style={
                      isPressed
                        ? {
                            backgroundColor: fingerMeta.colorHex,
                            color: '#09090b',
                            borderColor: '#ffffff',
                            boxShadow: `0 0 16px ${fingerMeta.colorHex}`
                          }
                        : isExpected
                          ? {
                              borderColor: fingerMeta.colorHex,
                              backgroundColor: fingerMeta.bgTint,
                              color: '#ffffff',
                              boxShadow: `0 0 14px ${fingerMeta.borderTint}, inset 0 0 8px ${fingerMeta.bgTint}`
                            }
                          : showZoneColors
                            ? {
                                backgroundColor: 'rgba(24, 24, 27, 0.92)',
                                borderColor: 'rgba(63, 63, 70, 0.65)',
                                borderBottomColor: fingerMeta.colorHex,
                                borderBottomWidth: '2.5px'
                              }
                            : undefined
                    }
                    className={`
                      relative min-w-0 flex flex-col items-center justify-center
                      ${compact ? 'h-7 sm:h-9 md:h-10' : 'h-8 sm:h-10 md:h-12'}
                      rounded-md sm:rounded-xl font-medium
                      transition-all duration-75 select-none
                      ${k.flexClass}
                      ${onKeyPress && k.id.length === 1 ? 'cursor-pointer active:scale-95' : 'cursor-default'}
                      ${
                        isPressed
                          ? 'translate-y-[1px] font-extrabold ring-2 ring-white z-10'
                          : isExpected
                            ? 'border-2 font-bold ring-1 ring-white/40 -translate-y-[1px] z-10'
                            : 'bg-zinc-900/95 border border-zinc-800/90 text-zinc-300 shadow-[0_2px_0_rgba(0,0,0,0.55)]'
                      }
                    `}
                  >
                    {/* Floating Finger Badge directly on the expected key */}
                    {isExpected && (
                      <span
                        className="hidden sm:inline-flex items-center px-1 py-[1px] rounded text-[8px] md:text-[9px] font-bold leading-none tracking-tight whitespace-nowrap mb-0.5"
                        style={{
                          backgroundColor: fingerMeta.colorHex,
                          color: '#09090b'
                        }}
                      >
                        {isShiftExpected ? 'Hold ⇧' : fingerMeta.shortLabel}
                      </span>
                    )}

                    {/* Shifted secondary character on top (hidden on desktop when expected badge is shown to keep key clean) */}
                    {k.sub && !isExpected && (
                      <span className="text-[7px] sm:text-[9px] leading-none mb-0.5 text-zinc-500">
                        {k.sub}
                      </span>
                    )}

                    {/* Primary label or Modifier icon & short name */}
                    {k.label ? (
                      <span
                        className={`leading-none font-mono ${
                          isExpected
                            ? 'text-[11px] sm:text-xs md:text-sm font-extrabold text-white'
                            : 'text-[10px] sm:text-xs md:text-[13px]'
                        }`}
                      >
                        {k.label}
                      </span>
                    ) : (
                      <div
                        className={`flex items-center gap-0.5 sm:gap-1 leading-none px-0.5 truncate ${
                          isPressed
                            ? 'text-zinc-950 font-bold'
                            : isExpected
                              ? 'text-white font-bold'
                              : 'text-zinc-400'
                        }`}
                      >
                        {k.icon && (
                          <span className="text-[9px] sm:text-[11px] font-semibold opacity-90">
                            {k.icon}
                          </span>
                        )}
                        {k.shortName && (
                          <span className="text-[8px] sm:text-[10px] font-medium tracking-tight hidden xs:inline">
                            {k.shortName}
                          </span>
                        )}
                        {k.id === ' ' && isExpected && (
                          <span className="text-[9px] sm:text-[10px] font-bold ml-1 text-purple-200">
                            (Press with Thumb)
                          </span>
                        )}
                      </div>
                    )}

                    {/* Home Row subtle indicator dot for A S D F J K L ; */}
                    {k.isHomeRowKey && !k.isHomeAnchor && !isExpected && (
                      <span
                        className="absolute bottom-1 w-1 h-1 rounded-full opacity-50"
                        style={{ backgroundColor: fingerMeta.colorHex }}
                      />
                    )}

                    {/* F & J physical tactile homing bumps */}
                    {k.isHomeAnchor && (
                      <span
                        className="absolute bottom-1 w-2.5 sm:w-3.5 h-[2.5px] rounded-full"
                        style={{
                          backgroundColor: isExpected || isPressed ? '#ffffff' : fingerMeta.colorHex
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Compact Color Legend Footer inside Keyboard */}
        {showZoneColors && (
          <div className="mt-2.5 pt-2 border-t border-zinc-800/60 flex flex-wrap items-center justify-between gap-2 text-[10px] text-zinc-400">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="text-zinc-500 font-medium">Finger Color Guide:</span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span>Pinky</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Ring</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Middle</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-sky-400" />
                <span>L-Index</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                <span>R-Index</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                <span>Thumb (Space)</span>
              </span>
            </div>
            <span className="hidden sm:inline text-zinc-500 font-mono text-[10px]">
              Home Row Bumps: F (Left Index) · J (Right Index)
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
