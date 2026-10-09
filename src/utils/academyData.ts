import { Course, Lesson } from '../types';

export const COURSES: Course[] = [
  {
    id: 'posture-foundations',
    code: '1',
    title: 'Foundations & Posture',
    subtitle: 'Ergonomic Anchor',
    description: 'Master tactile positioning, relaxed shoulder alignment, and the F and J home bumps.',
    targetKeysSummary: 'F, J, Spacebar',
    lessons: [
      {
        id: 'lesson-f-j-intro',
        title: 'Tactile Home Anchors (F & J)',
        targetKeys: ['f', 'j', ' '],
        explanation: 'Feel the small physical bumps on F and J with your left and right index fingers. Keep wrists elevated slightly.',
        fingerTips: 'Left index on F, right index on J. Thumbs lightly hovering above the spacebar.',
        text: 'f j f j fj jf f f j j fj fj jf jf f j',
        minAccuracy: 90,
        minWpm: 12
      },
      {
        id: 'lesson-f-j-space',
        title: 'Index Rhythms & Spacebar',
        targetKeys: ['f', 'j', ' '],
        explanation: 'Alternate taps between both index fingers followed by a rhythmic tap on the spacebar using your thumb.',
        fingerTips: 'Tap the spacebar with your dominant thumb. Keep hand motionless.',
        text: 'f j f j j f f j f f j j f j f j j f j f f j f j',
        minAccuracy: 92,
        minWpm: 14
      },
      {
        id: 'lesson-f-j-speed',
        title: 'Index Cadence Acceleration',
        targetKeys: ['f', 'j', ' '],
        explanation: 'Develop steady rhythm without pausing between hand transitions.',
        fingerTips: 'Keep finger curvature relaxed. Never hit keys with the flat pad of your fingers.',
        text: 'ff jj ff jj fff jjj fjj jff jjf ffj ffff jjjj fj fj',
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
    description: 'Learn the primary eight keys where your hands naturally rest: A, S, D, F, J, K, L, and Semicolon.',
    targetKeysSummary: 'A S D F · J K L ;',
    lessons: [
      {
        id: 'lesson-left-home',
        title: 'Left Hand Home Keys (A S D F)',
        targetKeys: ['a', 's', 'd', 'f'],
        explanation: 'Left hand covers Pinky (A), Ring (S), Middle (D), Index (F).',
        fingerTips: 'Keep all four fingers curved lightly over their respective keys without lifting.',
        text: 'a s d f as df fd sa asdf fdas sad dad fad as sad fad',
        minAccuracy: 90,
        minWpm: 15
      },
      {
        id: 'lesson-right-home',
        title: 'Right Hand Home Keys (J K L ;)',
        targetKeys: ['j', 'k', 'l', ';'],
        explanation: 'Right hand covers Index (J), Middle (K), Ring (L), Pinky (;).',
        fingerTips: 'Anchor gently on J while reaching adjacent keys with light taps.',
        text: 'j k l ; jk l; ;l kj jkl; ;lkj all ask fall lad ask all',
        minAccuracy: 90,
        minWpm: 15
      },
      {
        id: 'lesson-full-home-harmony',
        title: 'Home Row Harmony & Balance',
        targetKeys: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'],
        explanation: 'Seamlessly alternate keystrokes across both hands on the home row.',
        fingerTips: 'Balance pressure between hands so each tap sounds and feels identical.',
        text: 'asdf jkl; flask salad falls flash salsa glass alas fall flash',
        minAccuracy: 92,
        minWpm: 18
      },
      {
        id: 'lesson-home-words',
        title: 'Home Row Word Flow',
        targetKeys: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'],
        explanation: 'Form natural English words using exclusively home row letters.',
        fingerTips: 'Trust muscle memory. Keep your gaze firmly on the screen.',
        text: 'a sad lad had a fall all lads ask dad dad glad fall salad',
        minAccuracy: 92,
        minWpm: 20
      },
      {
        id: 'lesson-home-h-g',
        title: 'Inward Home Reaches (G & H)',
        targetKeys: ['g', 'h', 'f', 'j'],
        explanation: 'Left index reaches across to G. Right index reaches across to H. Immediately return to F and J.',
        fingerTips: 'Reach laterally without dragging your other fingers inward.',
        text: 'fg jh glad half flag hash flash slash gas gala hall hash',
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
    description: 'Reach up from home row to Q, W, E, R, T and Y, U, I, O, P while keeping wrists quiet.',
    targetKeysSummary: 'Q W E R T · Y U I O P',
    lessons: [
      {
        id: 'lesson-top-e-i',
        title: 'Vowel Anchors (E & I)',
        targetKeys: ['e', 'i', 'd', 'k'],
        explanation: 'Left middle reaches up to E. Right middle reaches up to I.',
        fingerTips: 'Reach diagonally up and snap back to D and K.',
        text: 'de ki die kid like seek feed file slide feel skill dike',
        minAccuracy: 90,
        minWpm: 18
      },
      {
        id: 'lesson-top-r-u-t-y',
        title: 'Index Upward Reach (R, T, Y, U)',
        targetKeys: ['r', 't', 'y', 'u', 'f', 'j'],
        explanation: 'Left index reaches R & T. Right index reaches Y & U.',
        fingerTips: 'Extend only the index finger; your ring and pinky stay anchored.',
        text: 'fr ft jy ju try rut fur yurt jury rust turf true duty yurt',
        minAccuracy: 90,
        minWpm: 18
      },
      {
        id: 'lesson-top-w-o',
        title: 'Ring Finger Upward (W & O)',
        targetKeys: ['w', 'o', 's', 'l'],
        explanation: 'Left ring reaches up to W. Right ring reaches up to O.',
        fingerTips: 'Maintain hand balance as the ring finger moves upward.',
        text: 'sw lo slow wolf pool wood roof wool flow glow blow solo',
        minAccuracy: 90,
        minWpm: 18
      },
      {
        id: 'lesson-top-q-p',
        title: 'Pinky Top Reach (Q & P)',
        targetKeys: ['q', 'p', 'a', ';'],
        explanation: 'Left pinky reaches Q. Right pinky reaches P.',
        fingerTips: 'Pivot lightly from your knuckle rather than shifting the whole wrist.',
        text: 'aq ;p equip peak poor quiet paper drop prompt quote plot',
        minAccuracy: 92,
        minWpm: 18
      },
      {
        id: 'lesson-top-synthesis',
        title: 'Top Row & Home Synthesis',
        targetKeys: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
        explanation: 'Combine top row vowels and consonants into everyday word patterns.',
        fingerTips: 'Keep a steady cadence like a metronome.',
        text: 'water power quiet write player street yellow output poetry pure',
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
    description: 'Learn comfortable downward curls to Z, X, C, V, B and N, M, Comma, Period.',
    targetKeysSummary: 'Z X C V B · N M , .',
    lessons: [
      {
        id: 'lesson-bottom-v-b-n-m',
        title: 'Index Downward Reach (V, B, N, M)',
        targetKeys: ['v', 'b', 'n', 'm', 'f', 'j'],
        explanation: 'Left index curls down to V and B. Right index curls down to N and M.',
        fingerTips: 'Curl fingers inward without resting wrists heavily on desk.',
        text: 'fv fb jn jm vine burn mint bump navy move numb vein bond',
        minAccuracy: 90,
        minWpm: 18
      },
      {
        id: 'lesson-bottom-c-x',
        title: 'Middle & Ring Downward (C & X)',
        targetKeys: ['c', 'x', 'd', 's'],
        explanation: 'Left middle curls down to C. Left ring curls down to X.',
        fingerTips: 'Tap lightly with the tip of the curved finger.',
        text: 'dc sx cat exact extra civil clean calm check axis toxic box',
        minAccuracy: 90,
        minWpm: 18
      },
      {
        id: 'lesson-bottom-z-punct',
        title: 'Pinky Corner & Punctuation (Z, Comma, Period)',
        targetKeys: ['z', 'a', ',', '.'],
        explanation: 'Left pinky curls down to Z. Right middle taps comma, right ring taps period.',
        fingerTips: 'Make sure your pinky returns promptly to resting anchor A.',
        text: 'az zero zone maze frozen prize, calm. size, quick. quiet, zinc.',
        minAccuracy: 90,
        minWpm: 18
      },
      {
        id: 'lesson-bottom-sentences',
        title: 'Lower Row Sentence Fluency',
        targetKeys: ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.'],
        explanation: 'Full sentence navigation spanning all three main rows.',
        fingerTips: 'Notice the gentle return to home row after every downward tap.',
        text: 'brave zebra moved swiftly beyond calm vibrant mountain views, next day.',
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
    description: 'Master Shift keys, sentence capitalization, punctuation flow, and fluid rhythm.',
    targetKeysSummary: 'Shift, Capitalization, Periods',
    lessons: [
      {
        id: 'lesson-shift-opposite',
        title: 'Opposite-Hand Shift Technique',
        targetKeys: ['Shift', 'a', 'z'],
        explanation: 'For left-hand capitals, hold Right Shift with right pinky. For right-hand capitals, hold Left Shift with left pinky.',
        fingerTips: 'Never press Shift and letter with the same hand.',
        text: 'Apple Berlin California Dublin England France Rome Tokyo London Oslo',
        minAccuracy: 92,
        minWpm: 20
      },
      {
        id: 'lesson-shift-sentences',
        title: 'Proper Sentence Cadence',
        targetKeys: ['Shift', '.', ',', '?'],
        explanation: 'Combine capital starting letters with fluid punctuation flow.',
        fingerTips: 'Single space after periods and commas.',
        text: 'The quick brown fox jumps over the lazy dog. Did you see that move?',
        minAccuracy: 94,
        minWpm: 24
      },
      {
        id: 'lesson-shift-common-words',
        title: 'Essential 100 Words Drill',
        targetKeys: ['all'],
        explanation: 'High-frequency English vocabulary drill to build subconscious speed.',
        fingerTips: 'Read one word ahead of where your hands are typing.',
        text: 'they would have said that we could find time to make this great work with open mind',
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
    description: 'Reach up to the number row (1-0) and frequently used coding/writing symbols.',
    targetKeysSummary: '1 2 3 4 5 6 7 8 9 0 ! @ # $ %',
    lessons: [
      {
        id: 'lesson-number-row',
        title: 'Numeric Row (1 through 0)',
        targetKeys: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
        explanation: 'Fingers reach up two rows: Pinky 1, Ring 2, Middle 3, Index 4 & 5. Right hand mirrors for 6, 7, 8, 9, 0.',
        fingerTips: 'Reach with intention and return directly back to home row.',
        text: '12 34 56 78 90 2026 1984 42 365 100 75 18 2048 512',
        minAccuracy: 90,
        minWpm: 16
      },
      {
        id: 'lesson-symbols-row',
        title: 'Common Symbols & Punctuation',
        targetKeys: ['!', '@', '#', '$', '%', '&', '*', '(', ')'],
        explanation: 'Combine Shift with the number row for essential symbols and code characters.',
        fingerTips: 'Hold Shift firmly before pressing the number key.',
        text: '#1 design (100%) save $50 now! item & data * note @user value (25% off)',
        minAccuracy: 90,
        minWpm: 16
      },
      {
        id: 'lesson-mixed-symbols',
        title: 'Code & Math Syntax Drill',
        targetKeys: ['=', '+', '-', '_', '/', '{', '}', '[', ']'],
        explanation: 'Type brackets, operators, and paths frequently used in software development.',
        fingerTips: 'Right pinky controls brackets and equals. Keep hand centered.',
        text: 'count = 10; item[0] = value + 2; path = /usr/local/bin; total_sum = 42;',
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
    description: 'Endurance, thought-to-finger synchronization, and effortless typing cadence across full paragraphs.',
    targetKeysSummary: 'Fluid Paragraphs & Rhythms',
    lessons: [
      {
        id: 'lesson-flow-paragraph-1',
        title: 'Rhythmic Sentence Cadence',
        targetKeys: ['all'],
        explanation: 'Type at an even, unbroken tempo. Steady typing without pauses beats bursty, errant speed.',
        fingerTips: 'Breathe evenly. Let keystrokes flow without tension in your shoulders.',
        text: 'Simplicity is not the absence of clutter, that is a consequence of simplicity. Simplicity is somehow essentially describing the purpose and place of an object and product.',
        minAccuracy: 94,
        minWpm: 28
      },
      {
        id: 'lesson-flow-paragraph-2',
        title: 'Architecture of Thought',
        targetKeys: ['all'],
        explanation: 'Long-form excerpt training sustained focus and minimal error rate.',
        fingerTips: 'Maintain light key pressure. Allow fingers to float naturally.',
        text: 'Design is not just what it looks like and feels like. Design is how it works. When you remove everything that is not essential, the core becomes clear and powerful.',
        minAccuracy: 94,
        minWpm: 30
      },
      {
        id: 'lesson-flow-graduation',
        title: 'Master Typist Graduation Drill',
        targetKeys: ['all'],
        explanation: 'Test your touch typing mastery across an inspiring philosophical passage.',
        fingerTips: 'Stay relaxed, keep eyes strictly on the text, and let muscle memory guide your hands.',
        text: 'Real elegance in design means discovering the simplest, most human way to solve a complex problem. When you master your keyboard, your thoughts flow directly onto the glass without friction.',
        minAccuracy: 95,
        minWpm: 32
      }
    ]
  }
];
