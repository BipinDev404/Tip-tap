import { Course } from '../types';

export const COURSES: Course[] = [
  {
    id: 'course-a',
    code: 'Course A',
    title: 'Getting Started',
    subtitle: 'Foundation & Ergonomics',
    description: 'Learn correct seating posture, wrist placement, tactile home markers, and finger resting positions.',
    targetKeysSummary: 'Posture, F, J & Resting Anchors',
    lessons: [
      {
        id: 'lesson-a1',
        title: 'Posture & Hand Positioning',
        targetKeys: ['f', 'j', ' '],
        explanation: 'Keep your elbows at a 90-degree angle, back straight, and feet flat. Let your fingers curve naturally over the home row. Feel the raised bumps on the F and J keys.',
        fingerTips: 'Rest your left index finger lightly on F, right index finger on J. Let thumbs gently hover over the Spacebar.',
        text: 'f j f j fj jf f f j j fj fj jf jf f j',
        minAccuracy: 90,
        minWpm: 12
      },
      {
        id: 'lesson-a2',
        title: 'The Home Rest & Spacebar',
        targetKeys: ['f', 'j', ' '],
        explanation: 'Practice switching between your left and right index fingers, followed by a crisp spacebar tap using your thumb.',
        fingerTips: 'Use your right thumb (or comfortable thumb) for the spacebar. Never lift your wrists completely off the desk.',
        text: 'f j f j j f f j f f j j f j f j j f j f',
        minAccuracy: 92,
        minWpm: 14
      }
    ]
  },
  {
    id: 'course-b',
    code: 'Course B',
    title: 'Home Row',
    subtitle: 'The Anchor Keys',
    description: 'Master the core eight keys where your hands always rest: A, S, D, F and J, K, L, Semicolon.',
    targetKeysSummary: 'A S D F  ·  J K L ;',
    lessons: [
      {
        id: 'lesson-b1',
        title: 'Left Hand Home Row (A S D F)',
        targetKeys: ['a', 's', 'd', 'f'],
        explanation: 'Your left hand covers: Pinky on A, Ring on S, Middle on D, Index on F. Keep fingers gently curved.',
        fingerTips: 'Press each key without shifting your other fingers away from the row.',
        text: 'a s d f as df fd sa asdf fdas sad dad fad',
        minAccuracy: 90,
        minWpm: 15
      },
      {
        id: 'lesson-b2',
        title: 'Right Hand Home Row (J K L ;)',
        targetKeys: ['j', 'k', 'l', ';'],
        explanation: 'Your right hand covers: Index on J, Middle on K, Ring on L, Pinky on Semicolon (;).',
        fingerTips: 'Keep your index finger on J as your home anchor while reaching with adjacent fingers.',
        text: 'j k l ; jk l; ;l kj jkl; ;lkj all ask fall',
        minAccuracy: 90,
        minWpm: 15
      },
      {
        id: 'lesson-b3',
        title: 'Full Home Row Harmony',
        targetKeys: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'],
        explanation: 'Blend both hands across the home row into words and rhythms.',
        fingerTips: 'Alternate smoothly between hands. Keep keystroke pressure light and uniform.',
        text: 'asdf jkl; flask salad falls flash salsa glass alas',
        minAccuracy: 92,
        minWpm: 18
      },
      {
        id: 'lesson-b4',
        title: 'Home Row Real Words Drill',
        targetKeys: ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'],
        explanation: 'Combine all eight home keys into natural cadence drills.',
        fingerTips: 'Do not look down at the keyboard. Trust the tactile bumps on F and J.',
        text: 'a sad lad had a fall all lads ask dad dad glad',
        minAccuracy: 94,
        minWpm: 20
      }
    ]
  },
  {
    id: 'course-c',
    code: 'Course C',
    title: 'Upper Row',
    subtitle: 'Upward Reach',
    description: 'Reach up from the home row to Q, W, E, R, T and Y, U, I, O, P while keeping wrists calm.',
    targetKeysSummary: 'Q W E R T  ·  Y U I O P',
    lessons: [
      {
        id: 'lesson-c1',
        title: 'Index Upward Reach (R, T, Y, U)',
        targetKeys: ['r', 't', 'y', 'u', 'f', 'j'],
        explanation: 'Left index reaches up to R and T, then snaps back to F. Right index reaches up to Y and U, then snaps back to J.',
        fingerTips: 'Extend only the index finger; your other fingers remain poised over the home row.',
        text: 'fr ft jy ju try rut fur yurt jury rust turf true',
        minAccuracy: 90,
        minWpm: 16
      },
      {
        id: 'lesson-c2',
        title: 'Middle & Ring Reaches (E, I, W, O)',
        targetKeys: ['e', 'i', 'w', 'o', 'd', 'k', 's', 'l'],
        explanation: 'Left middle reaches E, left ring reaches W. Right middle reaches I, right ring reaches O.',
        fingerTips: 'Reach up diagonally and immediately return to home resting position.',
        text: 'de ki sw lo wide slow wire roof pool weed side',
        minAccuracy: 90,
        minWpm: 18
      },
      {
        id: 'lesson-c3',
        title: 'Outer Pinky Reach (Q, P)',
        targetKeys: ['q', 'p', 'a', ';'],
        explanation: 'Left pinky reaches up to Q. Right pinky reaches up to P.',
        fingerTips: 'Avoid twisting your entire hand; pivot lightly from the knuckle.',
        text: 'aq ;p equip peak poor equip quite paper drop prompt',
        minAccuracy: 92,
        minWpm: 18
      },
      {
        id: 'lesson-c4',
        title: 'Home & Upper Row Synthesis',
        targetKeys: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
        explanation: 'Seamlessly type words transitioning between the top row and home row.',
        fingerTips: 'Maintain a steady, rhythmic cadence like a quiet metronome.',
        text: 'water power quiet write player street yellow output poetry',
        minAccuracy: 93,
        minWpm: 22
      }
    ]
  },
  {
    id: 'course-d',
    code: 'Course D',
    title: 'Lower Row',
    subtitle: 'Downward Transitions',
    description: 'Learn comfortable downward finger reaches to Z, X, C, V, B and N, M, Comma, Period.',
    targetKeysSummary: 'Z X C V B  ·  N M , .',
    lessons: [
      {
        id: 'lesson-d1',
        title: 'Index Downward Reach (V, B, N, M)',
        targetKeys: ['v', 'b', 'n', 'm', 'f', 'j'],
        explanation: 'Left index reaches down to V and B. Right index reaches down to N and M.',
        fingerTips: 'Curl fingers slightly inward. Keep palms from resting heavily on the desk.',
        text: 'fv fb jn jm vine burn mint bump navy move numb',
        minAccuracy: 90,
        minWpm: 18
      },
      {
        id: 'lesson-d2',
        title: 'Middle & Ring Downward (C, X)',
        targetKeys: ['c', 'x', 'd', 's'],
        explanation: 'Left middle curls down to C. Left ring curls down to X.',
        fingerTips: 'Keep finger curved and tap lightly with the fingertip.',
        text: 'dc sx cat exact extra civil clean calm check axis',
        minAccuracy: 90,
        minWpm: 18
      },
      {
        id: 'lesson-d3',
        title: 'Pinky Corner (Z, Comma, Period)',
        targetKeys: ['z', 'a', ',', '.'],
        explanation: 'Left pinky curls down to Z. Right middle taps comma, right ring taps period.',
        fingerTips: 'Do not hurry on Z; make sure the finger returns promptly to A.',
        text: 'az zero zone maze frozen prize, calm. size, quick.',
        minAccuracy: 90,
        minWpm: 18
      },
      {
        id: 'lesson-d4',
        title: 'Full Lower Row Fluency',
        targetKeys: ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
        explanation: 'Practice real phrases requiring smooth vertical hand navigation.',
        fingerTips: 'Notice how your fingers naturally bounce back to the home row.',
        text: 'brave zebra moved swiftly beyond calm vibrant mountain views',
        minAccuracy: 92,
        minWpm: 22
      }
    ]
  },
  {
    id: 'course-e',
    code: 'Course E',
    title: 'Complete Keyboard',
    subtitle: 'Capitals & Punctuation',
    description: 'Master Shift keys, sentence capitalization, punctuation flow, and fluid rhythm.',
    targetKeysSummary: 'Shift, Capitalization, Sentences',
    lessons: [
      {
        id: 'lesson-e1',
        title: 'Opposite-Hand Shift Key',
        targetKeys: ['Shift', 'a', 'z'],
        explanation: 'When capitalizing a left-hand letter, hold Right Shift with your right pinky. For right-hand letters, hold Left Shift with your left pinky.',
        fingerTips: 'Never use the same hand to hold Shift and press the letter.',
        text: 'Apple Berlin California Dublin England France Rome Tokyo',
        minAccuracy: 92,
        minWpm: 20
      },
      {
        id: 'lesson-e2',
        title: 'Standard Sentence Structure',
        targetKeys: ['Shift', '.', ',', '?'],
        explanation: 'Type full sentences with natural punctuation and single spacing between words.',
        fingerTips: 'Tap the spacebar immediately after punctuation marks.',
        text: 'The quick brown fox jumps over the lazy dog. Did you see that?',
        minAccuracy: 94,
        minWpm: 24
      },
      {
        id: 'lesson-e3',
        title: 'High-Frequency 100 Words',
        targetKeys: ['all'],
        explanation: 'Fluency drill covering the most common English words in typing.',
        fingerTips: 'Look ahead one or two words to build smooth predictive finger movements.',
        text: 'they would have said that we could find time to make this great work',
        minAccuracy: 95,
        minWpm: 28
      }
    ]
  },
  {
    id: 'course-f',
    code: 'Course F',
    title: 'Numbers and Symbols',
    subtitle: 'The Top Row & Punctuation',
    description: 'Reach up to the number row (1-0) and frequently used coding/writing symbols.',
    targetKeysSummary: '1 2 3 4 5 6 7 8 9 0 ! @ # $ %',
    lessons: [
      {
        id: 'lesson-f1',
        title: 'Number Row Fundamentals',
        targetKeys: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
        explanation: 'Each finger reaches up two rows: Pinky for 1, Ring for 2, Middle for 3, Index for 4 & 5. Right hand mirrors for 6, 7, 8, 9, 0.',
        fingerTips: 'Reach with intention and promptly return to home row.',
        text: '12 34 56 78 90 2026 1984 42 365 100 75 18',
        minAccuracy: 90,
        minWpm: 16
      },
      {
        id: 'lesson-f2',
        title: 'Common Symbols & Brackets',
        targetKeys: ['!', '@', '#', '$', '%', '&', '*', '(', ')'],
        explanation: 'Combine Shift with the number row for essential punctuation and symbols.',
        fingerTips: 'Hold Shift firmly before tapping the symbol key.',
        text: '#1 design (100%) save $50 now! item & data * note',
        minAccuracy: 90,
        minWpm: 16
      }
    ]
  },
  {
    id: 'course-g',
    code: 'Course G',
    title: 'Words and Sentences',
    subtitle: 'Speed & Flow Mastery',
    description: 'Endurance, thought-to-finger synchronization, and effortless typing cadence.',
    targetKeysSummary: 'Paragraph Fluency & Rhythm',
    lessons: [
      {
        id: 'lesson-g1',
        title: 'Rhythmic Sentence Cadence',
        targetKeys: ['all'],
        explanation: 'Type at an even, unbroken tempo. Steady typing without pauses beats bursty, errant speed.',
        fingerTips: 'Breathe evenly. Let keystrokes flow without tension in your shoulders.',
        text: 'Simplicity is not the absence of clutter, that is a consequence of simplicity. Simplicity is somehow essentially describing the purpose and place of an object and product.',
        minAccuracy: 94,
        minWpm: 28
      },
      {
        id: 'lesson-g2',
        title: 'Master Typist Graduation Drill',
        targetKeys: ['all'],
        explanation: 'Test your touch typing mastery across a multi-sentence philosophical excerpt.',
        fingerTips: 'Stay relaxed, keep eyes strictly on the screen, and let muscle memory guide your hands.',
        text: 'Real elegance in design means discovering the simplest, most human way to solve a complex problem. When you master your keyboard, your thoughts flow directly onto the glass.',
        minAccuracy: 95,
        minWpm: 32
      }
    ]
  }
];
