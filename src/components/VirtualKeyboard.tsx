import React, { useMemo, useState } from 'react';
import { Hand, Eye } from 'lucide-react';

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
  flexUnits: number;
  flexClass: string;
  finger: FingerId;
  isHomeAnchor?: boolean;
  isHomeRowKey?: boolean;
}

// Proportional 5-row ANSI keyboard layout where each row sums to exactly 150 flexUnits
const KEYBOARD_ROWS: KeyDefinition[][] = [
  // Row 1: Numbers & Backspace (13 * 10 + 20 = 150)
  [
    { id: '`', label: '`', sub: '~', flexUnits: 10, flexClass: 'flex-[10]', finger: 'left-pinky' },
    { id: '1', label: '1', sub: '!', flexUnits: 10, flexClass: 'flex-[10]', finger: 'left-pinky' },
    { id: '2', label: '2', sub: '@', flexUnits: 10, flexClass: 'flex-[10]', finger: 'left-ring' },
    { id: '3', label: '3', sub: '#', flexUnits: 10, flexClass: 'flex-[10]', finger: 'left-middle' },
    { id: '4', label: '4', sub: '$', flexUnits: 10, flexClass: 'flex-[10]', finger: 'left-index' },
    { id: '5', label: '5', sub: '%', flexUnits: 10, flexClass: 'flex-[10]', finger: 'left-index' },
    { id: '6', label: '6', sub: '^', flexUnits: 10, flexClass: 'flex-[10]', finger: 'right-index' },
    { id: '7', label: '7', sub: '&', flexUnits: 10, flexClass: 'flex-[10]', finger: 'right-index' },
    { id: '8', label: '8', sub: '*', flexUnits: 10, flexClass: 'flex-[10]', finger: 'right-middle' },
    { id: '9', label: '9', sub: '(', flexUnits: 10, flexClass: 'flex-[10]', finger: 'right-ring' },
    { id: '0', label: '0', sub: ')', flexUnits: 10, flexClass: 'flex-[10]', finger: 'right-pinky' },
    { id: '-', label: '-', sub: '_', flexUnits: 10, flexClass: 'flex-[10]', finger: 'right-pinky' },
    { id: '=', label: '=', sub: '+', flexUnits: 10, flexClass: 'flex-[10]', finger: 'right-pinky' },
    { id: 'Backspace', shortName: 'Bksp', icon: '⌫', flexUnits: 20, flexClass: 'flex-[20]', finger: 'right-pinky' }
  ],
  // Row 2: Tab, QWERTY, Backslash (15 + 12 * 10 + 15 = 150)
  [
    { id: 'Tab', shortName: 'Tab', icon: '⇥', flexUnits: 15, flexClass: 'flex-[15]', finger: 'left-pinky' },
    { id: 'q', label: 'Q', flexUnits: 10, flexClass: 'flex-[10]', finger: 'left-pinky' },
    { id: 'w', label: 'W', flexUnits: 10, flexClass: 'flex-[10]', finger: 'left-ring' },
    { id: 'e', label: 'E', flexUnits: 10, flexClass: 'flex-[10]', finger: 'left-middle' },
    { id: 'r', label: 'R', flexUnits: 10, flexClass: 'flex-[10]', finger: 'left-index' },
    { id: 't', label: 'T', flexUnits: 10, flexClass: 'flex-[10]', finger: 'left-index' },
    { id: 'y', label: 'Y', flexUnits: 10, flexClass: 'flex-[10]', finger: 'right-index' },
    { id: 'u', label: 'U', flexUnits: 10, flexClass: 'flex-[10]', finger: 'right-index' },
    { id: 'i', label: 'I', flexUnits: 10, flexClass: 'flex-[10]', finger: 'right-middle' },
    { id: 'o', label: 'O', flexUnits: 10, flexClass: 'flex-[10]', finger: 'right-ring' },
    { id: 'p', label: 'P', flexUnits: 10, flexClass: 'flex-[10]', finger: 'right-pinky' },
    { id: '[', label: '[', sub: '{', flexUnits: 10, flexClass: 'flex-[10]', finger: 'right-pinky' },
    { id: ']', label: ']', sub: '}', flexUnits: 10, flexClass: 'flex-[10]', finger: 'right-pinky' },
    { id: '\\', label: '\\', sub: '|', flexUnits: 15, flexClass: 'flex-[15]', finger: 'right-pinky' }
  ],
  // Row 3: Caps Lock, Home row (A S D F - J K L ;), Enter (18 + 11 * 10 + 22 = 150)
  [
    { id: 'CapsLock', shortName: 'Caps', icon: '⇪', flexUnits: 18, flexClass: 'flex-[18]', finger: 'left-pinky' },
    { id: 'a', label: 'A', flexUnits: 10, flexClass: 'flex-[10]', finger: 'left-pinky', isHomeRowKey: true },
    { id: 's', label: 'S', flexUnits: 10, flexClass: 'flex-[10]', finger: 'left-ring', isHomeRowKey: true },
    { id: 'd', label: 'D', flexUnits: 10, flexClass: 'flex-[10]', finger: 'left-middle', isHomeRowKey: true },
    { id: 'f', label: 'F', flexUnits: 10, flexClass: 'flex-[10]', finger: 'left-index', isHomeAnchor: true, isHomeRowKey: true },
    { id: 'g', label: 'G', flexUnits: 10, flexClass: 'flex-[10]', finger: 'left-index' },
    { id: 'h', label: 'H', flexUnits: 10, flexClass: 'flex-[10]', finger: 'right-index' },
    { id: 'j', label: 'J', flexUnits: 10, flexClass: 'flex-[10]', finger: 'right-index', isHomeAnchor: true, isHomeRowKey: true },
    { id: 'k', label: 'K', flexUnits: 10, flexClass: 'flex-[10]', finger: 'right-middle', isHomeRowKey: true },
    { id: 'l', label: 'L', flexUnits: 10, flexClass: 'flex-[10]', finger: 'right-ring', isHomeRowKey: true },
    { id: ';', label: ';', sub: ':', flexUnits: 10, flexClass: 'flex-[10]', finger: 'right-pinky', isHomeRowKey: true },
    { id: '\'', label: '\'', sub: '"', flexUnits: 10, flexClass: 'flex-[10]', finger: 'right-pinky' },
    { id: 'Enter', shortName: 'Enter', icon: '↵', flexUnits: 22, flexClass: 'flex-[22]', finger: 'right-pinky' }
  ],
  // Row 4: Left Shift, Bottom row letters, Right Shift (23 + 10 * 10 + 27 = 150)
  [
    { id: 'ShiftLeft', shortName: 'Shift', icon: '⇧', flexUnits: 23, flexClass: 'flex-[23]', finger: 'left-pinky' },
    { id: 'z', label: 'Z', flexUnits: 10, flexClass: 'flex-[10]', finger: 'left-pinky' },
    { id: 'x', label: 'X', flexUnits: 10, flexClass: 'flex-[10]', finger: 'left-ring' },
    { id: 'c', label: 'C', flexUnits: 10, flexClass: 'flex-[10]', finger: 'left-middle' },
    { id: 'v', label: 'V', flexUnits: 10, flexClass: 'flex-[10]', finger: 'left-index' },
    { id: 'b', label: 'B', flexUnits: 10, flexClass: 'flex-[10]', finger: 'left-index' },
    { id: 'n', label: 'N', flexUnits: 10, flexClass: 'flex-[10]', finger: 'right-index' },
    { id: 'm', label: 'M', flexUnits: 10, flexClass: 'flex-[10]', finger: 'right-index' },
    { id: ',', label: ',', sub: '<', flexUnits: 10, flexClass: 'flex-[10]', finger: 'right-middle' },
    { id: '.', label: '.', sub: '>', flexUnits: 10, flexClass: 'flex-[10]', finger: 'right-ring' },
    { id: '/', label: '/', sub: '?', flexUnits: 10, flexClass: 'flex-[10]', finger: 'right-pinky' },
    { id: 'ShiftRight', shortName: 'Shift', icon: '⇧', flexUnits: 27, flexClass: 'flex-[27]', finger: 'right-pinky' }
  ],
  // Row 5: Modifier row (14 * 6 + 66 = 150)
  [
    { id: 'Control', shortName: 'Ctrl', icon: '⌃', flexUnits: 14, flexClass: 'flex-[14]', finger: 'left-pinky' },
    { id: 'Meta', shortName: 'Cmd', icon: '⌘', flexUnits: 14, flexClass: 'flex-[14]', finger: 'left-ring' },
    { id: 'Alt', shortName: 'Alt', icon: '⌥', flexUnits: 14, flexClass: 'flex-[14]', finger: 'left-middle' },
    { id: ' ', shortName: 'Space', icon: '␣', flexUnits: 66, flexClass: 'flex-[66]', finger: 'thumbs' },
    { id: 'AltRight', shortName: 'Alt', icon: '⌥', flexUnits: 14, flexClass: 'flex-[14]', finger: 'right-ring' },
    { id: 'Fn', shortName: 'Fn', icon: 'fn', flexUnits: 14, flexClass: 'flex-[14]', finger: 'right-pinky' },
    { id: 'ControlRight', shortName: 'Ctrl', icon: '⌃', flexUnits: 14, flexClass: 'flex-[14]', finger: 'right-pinky' }
  ]
];

// Precompute exact SVG coordinates (in 1500 x 500 viewBox) for every key center
interface KeyCoord {
  keyDef: KeyDefinition;
  cx: number;
  cy: number;
}

const KEY_LOOKUP: Record<string, KeyDefinition> = {};
const KEY_COORDS: Record<string, KeyCoord> = {};

KEYBOARD_ROWS.forEach((row, rIdx) => {
  let cumUnits = 0;
  const cy = rIdx * 100 + 50;
  row.forEach(k => {
    const cx = (cumUnits + k.flexUnits / 2) * 10;
    cumUnits += k.flexUnits;
    KEY_LOOKUP[k.id.toLowerCase()] = k;
    KEY_LOOKUP[k.id] = k;
    KEY_COORDS[k.id.toLowerCase()] = { keyDef: k, cx, cy };
    KEY_COORDS[k.id] = { keyDef: k, cx, cy };
  });
});

// Mapping of symbols requiring Shift to their base key
const SYMBOL_BASE_KEY_MAP: Record<string, string> = {
  '~': '`', '!': '1', '@': '2', '#': '3', '$': '4', '%': '5',
  '^': '6', '&': '7', '*': '8', '(': '9', ')': '0', '_': '-',
  '+': '=', '{': '[', '}': ']', '|': '\\', ':': ';', '"': '\'',
  '<': ',', '>': '.', '?': '/'
};

// Anatomical 10-Finger Overlay Definitions (Knuckle Base -> Resting Home Row Key)
interface VisualFingerSpec {
  visualId: string;
  fingerId: FingerId;
  hand: 'left' | 'right';
  label: string;
  knuckleX: number;
  knuckleY: number;
  homeX: number;
  homeY: number;
  baseRadius: number;
  tipRadius: number;
}

const VISUAL_FINGERS: VisualFingerSpec[] = [
  // Left Hand (Pinky -> Thumb)
  {
    visualId: 'left-pinky',
    fingerId: 'left-pinky',
    hand: 'left',
    label: 'L-Pinky',
    knuckleX: 215,
    knuckleY: 435,
    homeX: KEY_COORDS['a'].cx,
    homeY: KEY_COORDS['a'].cy + 6,
    baseRadius: 23,
    tipRadius: 18
  },
  {
    visualId: 'left-ring',
    fingerId: 'left-ring',
    hand: 'left',
    label: 'L-Ring',
    knuckleX: 315,
    knuckleY: 422,
    homeX: KEY_COORDS['s'].cx,
    homeY: KEY_COORDS['s'].cy + 4,
    baseRadius: 25,
    tipRadius: 20
  },
  {
    visualId: 'left-middle',
    fingerId: 'left-middle',
    hand: 'left',
    label: 'L-Middle',
    knuckleX: 422,
    knuckleY: 416,
    homeX: KEY_COORDS['d'].cx,
    homeY: KEY_COORDS['d'].cy + 2,
    baseRadius: 26,
    tipRadius: 21
  },
  {
    visualId: 'left-index',
    fingerId: 'left-index',
    hand: 'left',
    label: 'L-Index',
    knuckleX: 528,
    knuckleY: 425,
    homeX: KEY_COORDS['f'].cx,
    homeY: KEY_COORDS['f'].cy + 4,
    baseRadius: 26,
    tipRadius: 21
  },
  {
    visualId: 'left-thumb',
    fingerId: 'thumbs',
    hand: 'left',
    label: 'L-Thumb',
    knuckleX: 590,
    knuckleY: 492,
    homeX: 655,
    homeY: 452,
    baseRadius: 28,
    tipRadius: 22
  },
  // Right Hand (Thumb -> Pinky)
  {
    visualId: 'right-thumb',
    fingerId: 'thumbs',
    hand: 'right',
    label: 'R-Thumb',
    knuckleX: 910,
    knuckleY: 492,
    homeX: 845,
    homeY: 452,
    baseRadius: 28,
    tipRadius: 22
  },
  {
    visualId: 'right-index',
    fingerId: 'right-index',
    hand: 'right',
    label: 'R-Index',
    knuckleX: 972,
    knuckleY: 425,
    homeX: KEY_COORDS['j'].cx,
    homeY: KEY_COORDS['j'].cy + 4,
    baseRadius: 26,
    tipRadius: 21
  },
  {
    visualId: 'right-middle',
    fingerId: 'right-middle',
    hand: 'right',
    label: 'R-Middle',
    knuckleX: 1078,
    knuckleY: 416,
    homeX: KEY_COORDS['k'].cx,
    homeY: KEY_COORDS['k'].cy + 2,
    baseRadius: 26,
    tipRadius: 21
  },
  {
    visualId: 'right-ring',
    fingerId: 'right-ring',
    hand: 'right',
    label: 'R-Ring',
    knuckleX: 1185,
    knuckleY: 422,
    homeX: KEY_COORDS['l'].cx,
    homeY: KEY_COORDS['l'].cy + 4,
    baseRadius: 25,
    tipRadius: 20
  },
  {
    visualId: 'right-pinky',
    fingerId: 'right-pinky',
    hand: 'right',
    label: 'R-Pinky',
    knuckleX: 1285,
    knuckleY: 435,
    homeX: KEY_COORDS[';'].cx,
    homeY: KEY_COORDS[';'].cy + 6,
    baseRadius: 23,
    tipRadius: 18
  }
];

/**
 * Computes an anatomical tapered finger path, joint creases, and fingernail geometry
 * from knuckle (kx, ky) to fingertip target (tx, ty).
 */
function buildFingerGeometry(
  kx: number,
  ky: number,
  tx: number,
  ty: number,
  baseR: number,
  tipR: number
) {
  const dx = tx - kx;
  const dy = ty - ky;
  const len = Math.max(20, Math.hypot(dx, dy));
  const ux = dx / len;
  const uy = dy / len;
  // Perpendicular unit vector
  const px = -uy;
  const py = ux;

  // Base left & right points at knuckle
  const bLx = kx + px * baseR;
  const bLy = ky + py * baseR;
  const bRx = kx - px * baseR;
  const bRy = ky - py * baseR;

  // Mid-knuckle slight curve for natural organic contour
  const midX = kx + ux * (len * 0.52);
  const midY = ky + uy * (len * 0.52);
  const midR = (baseR + tipR) * 0.52;
  const mLx = midX + px * midR;
  const mLy = midY + py * midR;
  const mRx = midX - px * midR;
  const mRy = midY - py * midR;

  // Tip left & right points before rounded fingertip cap
  const tLx = tx + px * tipR;
  const tLy = ty + py * tipR;
  const tRx = tx - px * tipR;
  const tRy = ty - py * tipR;

  // Apex of fingertip slightly past (tx, ty)
  const apexX = tx + ux * (tipR * 1.15);
  const apexY = ty + uy * (tipR * 1.15);
  const capCtrlLx = tLx + ux * (tipR * 1.1);
  const capCtrlLy = tLy + uy * (tipR * 1.1);
  const capCtrlRx = tRx + ux * (tipR * 1.1);
  const capCtrlRy = tRy + uy * (tipR * 1.1);

  const bodyPath = [
    `M ${bLx.toFixed(1)} ${bLy.toFixed(1)}`,
    `Q ${mLx.toFixed(1)} ${mLy.toFixed(1)} ${tLx.toFixed(1)} ${tLy.toFixed(1)}`,
    `C ${capCtrlLx.toFixed(1)} ${capCtrlLy.toFixed(1)}, ${capCtrlRx.toFixed(1)} ${capCtrlRy.toFixed(1)}, ${tRx.toFixed(1)} ${tRy.toFixed(1)}`,
    `Q ${mRx.toFixed(1)} ${mRy.toFixed(1)} ${bRx.toFixed(1)} ${bRy.toFixed(1)}`,
    'Z'
  ].join(' ');

  // Two subtle knuckle joint crease lines along the finger
  const j1Center = { x: kx + ux * (len * 0.38), y: ky + uy * (len * 0.38) };
  const j2Center = { x: kx + ux * (len * 0.68), y: ky + uy * (len * 0.68) };
  const j1Half = midR * 0.55;
  const j2Half = tipR * 0.55;

  const crease1 = `M ${(j1Center.x + px * j1Half).toFixed(1)} ${(j1Center.y + py * j1Half).toFixed(1)} Q ${(j1Center.x - ux * 3).toFixed(1)} ${(j1Center.y - uy * 3).toFixed(1)} ${(j1Center.x - px * j1Half).toFixed(1)} ${(j1Center.y - py * j1Half).toFixed(1)}`;
  const crease2 = `M ${(j2Center.x + px * j2Half).toFixed(1)} ${(j2Center.y + py * j2Half).toFixed(1)} Q ${(j2Center.x - ux * 2.5).toFixed(1)} ${(j2Center.y - uy * 2.5).toFixed(1)} ${(j2Center.x - px * j2Half).toFixed(1)} ${(j2Center.y - py * j2Half).toFixed(1)}`;

  // Rotation angle in degrees for fingernail alignment
  const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI + 90;

  return { bodyPath, crease1, crease2, angleDeg };
}

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
  const [showHandsOverlay, setShowHandsOverlay] = useState<boolean>(true);
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

  // Target key definition, coordinates & finger metadata
  const targetKeyCoord = useMemo(() => {
    if (!targetBaseKeyId) return null;
    return KEY_COORDS[targetBaseKeyId] || null;
  }, [targetBaseKeyId]);

  const targetKeyDef = targetKeyCoord?.keyDef || null;

  const targetFingerMeta = useMemo(() => {
    if (!targetKeyDef) return null;
    return FINGER_METADATA[targetKeyDef.finger];
  }, [targetKeyDef]);

  // Opposite-hand Shift key logic for proper touch typing
  const expectedShiftKeyId = useMemo(() => {
    if (!requiresShift || !targetFingerMeta) return null;
    return targetFingerMeta.hand === 'Left Hand' ? 'ShiftRight' : 'ShiftLeft';
  }, [requiresShift, targetFingerMeta]);

  const expectedShiftCoord = useMemo(() => {
    if (!expectedShiftKeyId) return null;
    return KEY_COORDS[expectedShiftKeyId] || null;
  }, [expectedShiftKeyId]);

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
          compact ? 'p-2 sm:p-3' : 'p-2.5 sm:p-4'
        }`}
      >
        {/* Top Interactive Finger Guidance Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 sm:pb-2.5 mb-2 sm:mb-2.5 border-b border-zinc-800/80">
          
          {/* Left: Real-Time "Where to Click & With Which Finger" Callout */}
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
                  <span className="text-[10px] sm:text-xs text-zinc-400">Key:</span>
                  <span className="px-2 py-0.5 rounded-lg bg-zinc-900 border border-zinc-700 text-xs sm:text-sm font-mono font-bold text-white shadow-2xs">
                    {displayKeyLabel}
                  </span>
                </div>

                <span className="text-zinc-600">→</span>

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
                  <span>{targetFingerMeta.name}</span>
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
                    <span>+ Hold ⇧ ({shiftFingerMeta.name})</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-xs text-zinc-400 font-medium">
                Rest fingers on Home Row (<span className="text-zinc-200 font-mono">A S D F</span> &amp; <span className="text-zinc-200 font-mono">J K L ;</span>)
              </div>
            )}
          </div>

          {/* Right: Controls for Translucent Real Hands Overlay & Zone Colors */}
          <div className="flex items-center gap-1.5 ml-auto">
            <button
              type="button"
              onClick={() => setShowHandsOverlay(v => !v)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[10px] sm:text-[11px] font-medium transition-all cursor-pointer shrink-0 ${
                showHandsOverlay
                  ? 'bg-zinc-800 text-zinc-100 border-zinc-700 shadow-2xs'
                  : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:text-zinc-200'
              }`}
              title="Toggle translucent real hands & finger overlay on keyboard"
            >
              <Hand className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-accent" />
              <span>Hands</span>
            </button>

            <button
              type="button"
              onClick={() => setShowZoneColors(v => !v)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[10px] sm:text-[11px] font-medium transition-all cursor-pointer shrink-0 ${
                showZoneColors
                  ? 'bg-zinc-800 text-zinc-100 border-zinc-700 shadow-2xs'
                  : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:text-zinc-200'
              }`}
              title="Toggle color-coded finger zones on keyboard keys"
            >
              <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-accent" />
              <span>Zones</span>
            </button>
          </div>
        </div>

        {/* Keyboard Stage with Translucent Real Finger & Hand Overlay */}
        <div className="relative w-full">
          {/* Proportional 5-Row Keyboard Grid */}
          <div className="w-full flex flex-col gap-1 sm:gap-1.5 relative z-10">
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
                        ${compact ? 'h-7 sm:h-9 md:h-10' : 'h-8 sm:h-10 md:h-11'}
                        rounded-md sm:rounded-xl font-medium
                        transition-all duration-75 select-none
                        ${k.flexClass}
                        ${onKeyPress && k.id.length === 1 ? 'cursor-pointer active:scale-95' : 'cursor-default'}
                        ${
                          isPressed
                            ? 'translate-y-[1px] font-extrabold ring-2 ring-white z-10'
                            : isExpected
                              ? 'border-2 font-bold ring-1 ring-white/40 z-10'
                              : 'bg-zinc-900/95 border border-zinc-800/90 text-zinc-300 shadow-[0_2px_0_rgba(0,0,0,0.55)]'
                        }
                      `}
                    >
                      {/* Shifted secondary character on top */}
                      {k.sub && (
                        <span
                          className={`text-[7px] sm:text-[9px] leading-none mb-0.5 ${
                            isExpected ? 'text-white/90 font-bold' : 'text-zinc-500'
                          }`}
                        >
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

          {/* Translucent Real Hands & Reaching Fingers SVG Overlay (Low opacity so keys remain 100% readable) */}
          {showHandsOverlay && (
            <svg
              viewBox="0 0 1500 500"
              preserveAspectRatio="none"
              className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible"
              aria-hidden="true"
            >
              {/* Left Palm Silhouette (Low Opacity) */}
              <path
                d="M 192 435 C 215 398, 535 400, 560 432 C 588 455, 620 480, 610 515 L 220 515 C 198 492, 185 462, 192 435 Z"
                fill="rgba(228, 228, 231, 0.08)"
                stroke="rgba(228, 228, 231, 0.22)"
                strokeWidth="2"
              />

              {/* Right Palm Silhouette (Low Opacity) */}
              <path
                d="M 1308 435 C 1285 398, 965 400, 940 432 C 912 455, 880 480, 890 515 L 1280 515 C 1302 492, 1315 462, 1308 435 Z"
                fill="rgba(228, 228, 231, 0.08)"
                stroke="rgba(228, 228, 231, 0.22)"
                strokeWidth="2"
              />

              {/* Render all 10 realistic fingers (resting fingers at low opacity, active reaching finger highlighted with translucent fill + fingernail) */}
              {VISUAL_FINGERS.map((vf) => {
                const meta = FINGER_METADATA[vf.fingerId];

                // Determine if this specific finger is reaching for the expected target key
                let isTargetFinger = false;
                let tx = vf.homeX;
                let ty = vf.homeY;

                if (targetKeyCoord && targetKeyDef) {
                  if (targetKeyDef.id === ' ') {
                    // Use Right Thumb for Spacebar (standard touch-typing convention)
                    if (vf.visualId === 'right-thumb') {
                      isTargetFinger = true;
                      tx = 815;
                      ty = 450;
                    }
                  } else if (targetKeyDef.finger === vf.fingerId) {
                    isTargetFinger = true;
                    tx = targetKeyCoord.cx;
                    ty = targetKeyCoord.cy;
                  }
                }

                // Determine if this pinky finger is holding the opposite-hand Shift key
                let isShiftFinger = false;
                if (
                  requiresShift &&
                  expectedShiftCoord &&
                  ((expectedShiftKeyId === 'ShiftLeft' && vf.visualId === 'left-pinky') ||
                    (expectedShiftKeyId === 'ShiftRight' && vf.visualId === 'right-pinky'))
                ) {
                  isShiftFinger = true;
                  tx = expectedShiftCoord.cx;
                  ty = expectedShiftCoord.cy;
                }

                const isActive = isTargetFinger || isShiftFinger;

                const { bodyPath, crease1, crease2, angleDeg } = buildFingerGeometry(
                  vf.knuckleX,
                  vf.knuckleY,
                  tx,
                  ty,
                  vf.baseRadius,
                  vf.tipRadius
                );

                return (
                  <g
                    key={vf.visualId}
                    className="transition-all duration-150 ease-out"
                  >
                    {/* Target Key Contact Pulse Halo under the active fingertip */}
                    {isActive && (
                      <circle
                        cx={tx}
                        cy={ty}
                        r={vf.tipRadius + 10}
                        fill={meta.colorHex}
                        fillOpacity={0.14}
                        stroke={meta.colorHex}
                        strokeOpacity={0.5}
                        strokeWidth="2"
                        strokeDasharray="5 4"
                      />
                    )}

                    {/* Realistic Tapered Finger Body with Low Opacity so key label underneath is clearly visible */}
                    <path
                      d={bodyPath}
                      fill={isActive ? meta.colorHex : '#e4e4e7'}
                      fillOpacity={isActive ? 0.24 : 0.09}
                      stroke={isActive ? meta.colorHex : '#a1a1aa'}
                      strokeOpacity={isActive ? 0.65 : 0.24}
                      strokeWidth={isActive ? 2.5 : 1.5}
                    />

                    {/* Anatomical Finger Joint Crease Lines */}
                    <path
                      d={crease1}
                      fill="none"
                      stroke={isActive ? '#ffffff' : '#d4d4d8'}
                      strokeOpacity={isActive ? 0.35 : 0.16}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    <path
                      d={crease2}
                      fill="none"
                      stroke={isActive ? '#ffffff' : '#d4d4d8'}
                      strokeOpacity={isActive ? 0.35 : 0.16}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />

                    {/* Realistic Fingernail at the tip of the finger */}
                    <g transform={`translate(${tx.toFixed(1)}, ${ty.toFixed(1)}) rotate(${angleDeg.toFixed(1)})`}>
                      <rect
                        x={-(vf.tipRadius * 0.58)}
                        y={-(vf.tipRadius * 0.85)}
                        width={vf.tipRadius * 1.16}
                        height={vf.tipRadius * 0.95}
                        rx={vf.tipRadius * 0.48}
                        fill={isActive ? '#ffffff' : '#f4f4f5'}
                        fillOpacity={isActive ? 0.26 : 0.12}
                        stroke={isActive ? '#ffffff' : '#d4d4d8'}
                        strokeOpacity={isActive ? 0.7 : 0.25}
                        strokeWidth={isActive ? 1.8 : 1.2}
                      />
                    </g>
                  </g>
                );
              })}
            </svg>
          )}
        </div>

        {/* Compact Color Legend Footer inside Keyboard */}
        {showZoneColors && (
          <div className="mt-2 pt-2 border-t border-zinc-800/60 flex flex-wrap items-center justify-between gap-2 text-[10px] text-zinc-400">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="text-zinc-500 font-medium">Finger Guide:</span>
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
