import { Course } from '../types';

export const COURSES: Course[] = [
  {
    id: 'posture-foundations',
    code: '1',
    title: 'Foundations & Posture',
    subtitle: 'Ergonomic Anchor',
    description: 'Master tactile positioning, relaxed shoulder alignment, and the F and J home bumps without looking at the keyboard.',
    targetKeysSummary: 'F, J, Spacebar',
    lessons: [
      {
        id: 'lesson-f-j-intro',
        title: 'Tactile Home Anchors (F & J)',
        targetKeys: ['f', 'j', ' '],
        explanation: 'Feel the small physical tactile bumps on F and J with your left and right index fingers. These bumps allow you to find your home position instantly without looking down at the keyboard.',
        fingerTips: 'Left index rests on F bump, right index on J bump. Keep wrists slightly elevated above desk surface.',
        text: 'f j f j fj jf f f j j fj fj jf jf f j f j ff jj f j fj jf f j f j',
        minAccuracy: 90,
        minWpm: 12
      },
      {
        id: 'lesson-f-j-space',
        title: 'Index Rhythms & Spacebar Cadence',
        targetKeys: ['f', 'j', ' '],
        explanation: 'Alternate precise taps between both index fingers followed by a rhythmic tap on the spacebar using your thumb. Keep your hands stationary while only moving your fingers.',
        fingerTips: 'Tap the spacebar with your dominant thumb. Maintain a steady, metronome-like typing pace.',
        text: 'f j f j j f f j f f j j f j f j j f j f f j f j fj jf f j jf fj f j',
        minAccuracy: 92,
        minWpm: 14
      },
      {
        id: 'lesson-f-j-speed',
        title: 'Index Cadence Acceleration & Flow',
        targetKeys: ['f', 'j', ' '],
        explanation: 'Develop a continuous, unbroken cadence. Avoid pausing between hand transitions as you build muscle memory.',
        fingerTips: 'Keep finger curvature relaxed. Always strike keys with finger tips, never with the flat pads.',
        text: 'ff jj ff jj fff jjj fjj jff jjf ffj ffff jjjj fj fj ff jj fff jjj fj jf',
        minAccuracy: 92,
        minWpm: 16
      }
    ]
  },
  {
    id: 'home-row-mastery',
    code: '2',
    title: 'Home Row Mastery',
    subtitle: 'Anchor Keys',
    description: 'Master the primary eight keys where your hands naturally rest: A, S, D, F for the left hand and J, K, L, Semicolon for the right hand.',
    targetKeysSummary: 'A S D F · J K L ; · G H',
    lessons: [
      {
        id: 'lesson-left-home',
        title: 'Left Hand Home Keys (A S D F)',
        targetKeys: ['a', 's', 'd', 'f'],
        explanation: 'The left hand rests on A (Pinky), S (Ring), D (Middle), and F (Index). Each finger is responsible solely for its assigned key on the home row.',
        fingerTips: 'Keep all four fingers lightly curved over their respective home keys without pressing down.',
        text: 'a s d f as df fd sa asdf fdas sad dad fad as sad fad add dad fas sad dad',
        minAccuracy: 90,
        minWpm: 15
      },
      {
        id: 'lesson-right-home',
        title: 'Right Hand Home Keys (J K L ;)',
        targetKeys: ['j', 'k', 'l', ';'],
        explanation: 'The right hand rests on J (Index), K (Middle), L (Ring), and Semicolon (Pinky). Maintain light contact with the J tactile bump.',
        fingerTips: 'Anchor gently on J while striking adjacent keys with quick, springy finger taps.',
        text: 'j k l ; jk l; ;l kj jkl; ;lkj all ask fall lad ask all ask fall lad all',
        minAccuracy: 90,
        minWpm: 15
      },
      {
        id: 'lesson-full-home-harmony',
        title: 'Home Row Harmony & Hand Balance',
        targetKeys: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'],
        explanation: 'Seamlessly alternate keystrokes across both hands on the home row to build bilateral coordination and fluid typing rhythm.',
        fingerTips: 'Equalize pressure between both hands so every key tap sounds and feels identical.',
        text: 'asdf jkl; flask salad falls flash salsa glass alas fall flash salad flask glass',
        minAccuracy: 92,
        minWpm: 18
      },
      {
        id: 'lesson-home-words',
        title: 'Home Row Natural Word Flow',
        targetKeys: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'],
        explanation: 'Form complete natural English words and simple phrases using exclusively home row letters without looking down.',
        fingerTips: 'Trust your muscle memory. Keep your eyes focused strictly on the text on screen.',
        text: 'a sad lad had a fall all lads ask dad dad glad fall salad a sad flask glad',
        minAccuracy: 92,
        minWpm: 20
      },
      {
        id: 'lesson-home-h-g',
        title: 'Inward Home Reaches (G & H)',
        targetKeys: ['g', 'h', 'f', 'j'],
        explanation: 'Left index reaches laterally to press G and returns to F. Right index reaches laterally to press H and returns to J.',
        fingerTips: 'Reach sideways with the index finger only. Do not drag the remaining fingers off their home keys.',
        text: 'fg jh glad half flag hash flash slash gas gala hall hash glad half flag hall gala',
        minAccuracy: 92,
        minWpm: 20
      }
    ]
  },
  {
    id: 'top-row-reach',
    code: '3',
    title: 'Top Row Reaches',
    subtitle: 'Upward Elevation',
    description: 'Extend upward from the home row to Q, W, E, R, T and Y, U, I, O, P while keeping wrists calm and motionless.',
    targetKeysSummary: 'Q W E R T · Y U I O P',
    lessons: [
      {
        id: 'lesson-top-e-i',
        title: 'Top Vowel Anchors (E & I)',
        targetKeys: ['e', 'i', 'd', 'k'],
        explanation: 'Left middle finger reaches up to E from D. Right middle finger reaches up to I from K. E and I represent over 20% of all typed English characters.',
        fingerTips: 'Reach diagonally upward and instantly snap back to home keys D and K.',
        text: 'de ki die kid like seek feed file slide feel skill dike life like seek feel kid',
        minAccuracy: 90,
        minWpm: 18
      },
      {
        id: 'lesson-top-r-u-t-y',
        title: 'Index Upward Reach (R, T, Y, U)',
        targetKeys: ['r', 't', 'y', 'u', 'f', 'j'],
        explanation: 'Left index reaches up to R and T. Right index reaches up to Y and U. Keep your hand frame stationary as only the index finger extends.',
        fingerTips: 'Extend the index finger while keeping ring and pinky fingers anchored near home keys.',
        text: 'fr ft jy ju try rut fur yurt jury rust turf true duty yurt try true duty rust',
        minAccuracy: 90,
        minWpm: 18
      },
      {
        id: 'lesson-top-w-o',
        title: 'Ring Finger Upward Elevation (W & O)',
        targetKeys: ['w', 'o', 's', 'l'],
        explanation: 'Left ring finger extends upward from S to W. Right ring finger extends upward from L to O.',
        fingerTips: 'Maintain hand balance and avoid twisting your palm as the ring finger moves upward.',
        text: 'sw lo slow wolf pool wood roof wool flow glow blow solo slow wolf pool flow glow',
        minAccuracy: 90,
        minWpm: 18
      },
      {
        id: 'lesson-top-q-p',
        title: 'Pinky Top Reaches (Q & P)',
        targetKeys: ['q', 'p', 'a', ';'],
        explanation: 'Left pinky extends up from A to Q. Right pinky extends up from Semicolon to P.',
        fingerTips: 'Pivot lightly from the main knuckle rather than twisting the whole hand or wrist.',
        text: 'aq ;p equip peak poor quiet paper drop prompt quote plot equip paper quiet plot',
        minAccuracy: 92,
        minWpm: 18
      },
      {
        id: 'lesson-top-synthesis',
        title: 'Top Row & Home Synthesis Drill',
        targetKeys: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
        explanation: 'Combine top row vowels and consonants with home row keys into common vocabulary and sentence patterns.',
        fingerTips: 'Maintain a smooth, continuous metronome pace across finger transitions.',
        text: 'water power quiet write player street yellow output poetry pure quiet water street power',
        minAccuracy: 93,
        minWpm: 22
      }
    ]
  },
  {
    id: 'bottom-row-fluency',
    code: '4',
    title: 'Bottom Row Fluency',
    subtitle: 'Downward Transitions',
    description: 'Master downward finger curls to Z, X, C, V, B and N, M, Comma, Period with smooth returns to home row.',
    targetKeysSummary: 'Z X C V B · N M , .',
    lessons: [
      {
        id: 'lesson-bottom-v-b-n-m',
        title: 'Index Downward Curl (V, B, N, M)',
        targetKeys: ['v', 'b', 'n', 'm', 'f', 'j'],
        explanation: 'Left index curls down to V and B. Right index curls down to N and M. Always return fingers to home anchor keys F and J immediately.',
        fingerTips: 'Curl fingers inward towards your palm without letting your wrist drop down onto the desk.',
        text: 'fv fb jn jm vine burn mint bump navy move numb vein bond vine mint move navy bond',
        minAccuracy: 90,
        minWpm: 18
      },
      {
        id: 'lesson-bottom-c-x',
        title: 'Middle & Ring Downward Curls (C & X)',
        targetKeys: ['c', 'x', 'd', 's'],
        explanation: 'Left middle finger curls down from D to C. Left ring finger curls down from S to X.',
        fingerTips: 'Tap lightly with the tip of the curved finger and spring back to home row.',
        text: 'dc sx cat exact extra civil clean calm check axis toxic box cat clean civil extra box',
        minAccuracy: 90,
        minWpm: 18
      },
      {
        id: 'lesson-bottom-z-punct',
        title: 'Pinky Corner & Punctuation (Z, Comma, Period)',
        targetKeys: ['z', 'a', ',', '.'],
        explanation: 'Left pinky curls down to Z. Right middle finger taps comma. Right ring finger taps period.',
        fingerTips: 'Ensure your pinky returns promptly to resting anchor A after striking Z.',
        text: 'az zero zone maze frozen prize, calm. size, quick. quiet, zinc. zero zone calm, size, prize.',
        minAccuracy: 90,
        minWpm: 18
      },
      {
        id: 'lesson-bottom-sentences',
        title: 'Lower Row Sentence Fluency & Synthesis',
        targetKeys: ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.'],
        explanation: 'Full sentence typing spanning all three main letter rows with fluid transitions.',
        fingerTips: 'Focus on smooth transitions between top reaches, home row rests, and bottom curls.',
        text: 'brave zebra moved swiftly beyond calm vibrant mountain views, next day. clean views, swift move.',
        minAccuracy: 92,
        minWpm: 22
      }
    ]
  },
  {
    id: 'capitalization-flow',
    code: '5',
    title: 'Capitalization & Shift Key',
    subtitle: 'Opposite-Hand Technique',
    description: 'Master Shift keys, sentence capitalization, proper punctuation spacing, and unbroken typing rhythm.',
    targetKeysSummary: 'Left Shift, Right Shift, Capitals',
    lessons: [
      {
        id: 'lesson-shift-opposite',
        title: 'Opposite-Hand Shift Technique',
        targetKeys: ['Shift', 'a', 'z'],
        explanation: 'For left-hand capitals, hold Right Shift with your right pinky. For right-hand capitals, hold Left Shift with your left pinky. Never press Shift and the letter key with the same hand.',
        fingerTips: 'Press and hold Shift first, strike the letter key, then release Shift.',
        text: 'Apple Berlin California Dublin England France Rome Tokyo London Oslo Apple Dublin Tokyo Rome',
        minAccuracy: 92,
        minWpm: 20
      },
      {
        id: 'lesson-shift-sentences',
        title: 'Proper Sentence Cadence & Spacing',
        targetKeys: ['Shift', '.', ',', '?'],
        explanation: 'Combine capital starting letters with fluid punctuation flow and proper single-space cadence after punctuation marks.',
        fingerTips: 'Type a single space after periods and commas. Keep your pace steady.',
        text: 'The quick brown fox jumps over the lazy dog. Did you see that move? Yes, it was fast.',
        minAccuracy: 94,
        minWpm: 24
      },
      {
        id: 'lesson-shift-common-words',
        title: 'Essential High-Frequency Words Drill',
        targetKeys: ['all'],
        explanation: 'High-frequency English vocabulary drill designed to build subconscious speed and word-level chunking.',
        fingerTips: 'Read one word ahead of where your hands are currently typing.',
        text: 'they would have said that we could find time to make this great work with open mind and steady focus',
        minAccuracy: 95,
        minWpm: 26
      }
    ]
  },
  {
    id: 'numbers-symbols',
    code: '6',
    title: 'Numbers & Symbols',
    subtitle: 'Top Numeric Row',
    description: 'Extend upward to the number row (1-0) and frequently used writing/programming symbols.',
    targetKeysSummary: '1 2 3 4 5 6 7 8 9 0 ! @ # $ %',
    lessons: [
      {
        id: 'lesson-number-row',
        title: 'Numeric Row (1 through 0)',
        targetKeys: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
        explanation: 'Fingers reach up two rows: Pinky (1), Ring (2), Middle (3), Index (4 & 5). Right hand mirrors for 6, 7, 8, 9, 0.',
        fingerTips: 'Reach with intention and return directly back to home row anchors after every number.',
        text: '12 34 56 78 90 2026 1984 42 365 100 75 18 2048 512 12 34 56 78 90 2026',
        minAccuracy: 90,
        minWpm: 16
      },
      {
        id: 'lesson-symbols-row',
        title: 'Common Symbols & Punctuation',
        targetKeys: ['!', '@', '#', '$', '%', '&', '*', '(', ')'],
        explanation: 'Combine Shift with the number row for essential symbols, programming characters, and writing marks.',
        fingerTips: 'Hold Shift firmly with opposite pinky before pressing the target number key.',
        text: '#1 design (100%) save $50 now! item & data * note @user value (25% off) #1 save $50 now!',
        minAccuracy: 90,
        minWpm: 16
      },
      {
        id: 'lesson-mixed-symbols',
        title: 'Code & Math Syntax Drill',
        targetKeys: ['=', '+', '-', '_', '/', '{', '}', '[', ']'],
        explanation: 'Type brackets, mathematical operators, underscores, and file path syntax frequently used in technical work.',
        fingerTips: 'Right pinky controls brackets, minus, and equals. Keep your palm centered.',
        text: 'count = 10; item[0] = value + 2; path = /usr/local/bin; total_sum = 42; count = 10; path = /usr/bin;',
        minAccuracy: 90,
        minWpm: 18
      }
    ]
  },
  {
    id: 'speed-paragraph-mastery',
    code: '7',
    title: 'Speed & Paragraph Mastery',
    subtitle: 'Unbroken Flow',
    description: 'Sustained endurance, thought-to-finger synchronization, and effortless typing cadence across full paragraphs.',
    targetKeysSummary: 'Fluid Paragraphs & Rhythms',
    lessons: [
      {
        id: 'lesson-flow-paragraph-1',
        title: 'Rhythmic Sentence Cadence',
        targetKeys: ['all'],
        explanation: 'Type at an even, unbroken tempo. Steady, relaxed typing without pauses beats bursty, errant typing speed every time.',
        fingerTips: 'Breathe evenly. Let keystrokes flow naturally without tension in your wrist or shoulders.',
        text: 'Simplicity is not the absence of clutter, that is a consequence of simplicity. Simplicity is essentially describing the purpose and place of an object and product.',
        minAccuracy: 94,
        minWpm: 28
      },
      {
        id: 'lesson-flow-paragraph-2',
        title: 'Architecture of Thought & Focus',
        targetKeys: ['all'],
        explanation: 'Long-form paragraph practice training sustained mental focus, minimal error rate, and muscle memory endurance.',
        fingerTips: 'Maintain light key pressure. Allow your fingers to float naturally over the keys.',
        text: 'Design is not just what it looks like and feels like. Design is how it works. When you remove everything that is not essential, the core becomes clear and powerful.',
        minAccuracy: 94,
        minWpm: 30
      },
      {
        id: 'lesson-flow-graduation',
        title: 'Master Typist Graduation Passage',
        targetKeys: ['all'],
        explanation: 'Test your touch typing mastery across an inspiring passage to earn your Master Typist certification.',
        fingerTips: 'Stay relaxed, keep eyes strictly on the screen, and let your hands translate thought into text effortlessly.',
        text: 'Real elegance in design means discovering the simplest, most human way to solve a complex problem. When you master your keyboard, your thoughts flow directly onto the screen without friction.',
        minAccuracy: 95,
        minWpm: 32
      }
    ]
  }
];
