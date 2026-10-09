export const COMMON_WORDS = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "i",
  "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
  "this", "but", "his", "by", "from", "they", "we", "say", "her", "she",
  "or", "an", "will", "my", "one", "all", "would", "there", "their", "what",
  "so", "up", "out", "if", "about", "who", "get", "which", "go", "me",
  "when", "make", "can", "like", "time", "no", "just", "him", "know", "take",
  "people", "into", "year", "your", "good", "some", "could", "them", "see", "other",
  "than", "then", "now", "look", "only", "come", "its", "over", "think", "also",
  "back", "after", "use", "two", "how", "our", "work", "first", "well", "way",
  "even", "new", "want", "because", "any", "these", "give", "day", "most", "us",
  "great", "between", "need", "large", "under", "never", "place", "such", "world", "still",
  "nation", "hand", "high", "point", "home", "small", "found", "water", "room", "right",
  "light", "line", "read", "turn", "land", "different", "away", "move", "spell", "air",
  "animal", "house", "point", "page", "letter", "mother", "answer", "study", "still", "learn",
  "should", "america", "world", "high", "every", "near", "add", "food", "between", "own",
  "below", "country", "plant", "last", "school", "father", "keep", "tree", "never", "start",
  "city", "earth", "eyes", "head", "story", "saw", "far", "sea", "draw", "left",
  "late", "run", "press", "close", "night", "real", "life", "few", "north", "open",
  "simple", "together", "next", "white", "children", "begin", "got", "walk", "example", "ease",
  "paper", "group", "always", "music", "those", "both", "mark", "often", "letter", "until",
  "mile", "river", "car", "feet", "care", "second", "book", "carry", "took", "science",
  "eat", "room", "friend", "began", "idea", "fish", "mountain", "stop", "once", "base",
  "hear", "horse", "cut", "sure", "watch", "color", "face", "wood", "main", "enough",
  "plain", "girl", "usual", "young", "ready", "above", "ever", "red", "list", "though",
  "feel", "talk", "bird", "soon", "body", "dog", "family", "direct", "pose", "leave",
  "song", "measure", "door", "product", "black", "short", "numeral", "class", "wind", "question",
  "happen", "complete", "ship", "area", "half", "rock", "order", "fire", "south", "problem",
  "piece", "told", "knew", "pass", "since", "top", "whole", "king", "space", "heard",
  "best", "hour", "better", "true", "during", "hundred", "five", "remember", "step", "early",
  "hold", "west", "ground", "interest", "reach", "fast", "verb", "sing", "listen", "six",
  "table", "travel", "less", "morning", "ten", "simple", "several", "vowel", "toward", "war",
  "lay", "against", "pattern", "slow", "center", "love", "person", "money", "serve", "appear",
  "road", "map", "rain", "rule", "govern", "pull", "cold", "notice", "voice", "unit"
];

export interface Quote {
  text: string;
  author: string;
  length: 'short' | 'medium' | 'long';
}

export const QUOTES: Quote[] = [
  {
    text: "Simplicity is the ultimate sophistication.",
    author: "Leonardo da Vinci",
    length: "short"
  },
  {
    text: "Design is not just what it looks like and feels like. Design is how it works.",
    author: "Steve Jobs",
    length: "short"
  },
  {
    text: "The details are not the details. They make the design.",
    author: "Charles Eames",
    length: "short"
  },
  {
    text: "Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away.",
    author: "Antoine de Saint-Exupéry",
    length: "medium"
  },
  {
    text: "Good design is as little design as possible. Less, but better, because it concentrates on the essential aspects.",
    author: "Dieter Rams",
    length: "medium"
  },
  {
    text: "Creativity is just connecting things. When you ask creative people how they did something, they feel a little guilty because they did not really do it, they just saw something.",
    author: "Steve Jobs",
    length: "long"
  },
  {
    text: "Have the courage to follow your heart and intuition. They somehow already know what you truly want to become. Everything else is secondary.",
    author: "Steve Jobs",
    length: "medium"
  },
  {
    text: "Do not dwell in the past, do not dream of the future, concentrate the mind on the present moment.",
    author: "Buddha",
    length: "short"
  },
  {
    text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    author: "Will Durant",
    length: "short"
  },
  {
    text: "The mind is everything. What you think you become. What you feel you attract. What you imagine you create.",
    author: "Buddha",
    length: "medium"
  },
  {
    text: "Typography is two-dimensional architecture, based on experience and imagination, and guided by rule and choice.",
    author: "Hermann Zapf",
    length: "medium"
  },
  {
    text: "Technology alone is not enough. It is technology married with the liberal arts, married with the humanities, that yields the results that make our heart sing.",
    author: "Steve Jobs",
    length: "long"
  }
];

export function generateRandomWords(count: number, punctuation: boolean, numbers: boolean): string {
  const words: string[] = [];
  const puncMarks = [".", ",", ";", "!", "?"];

  for (let i = 0; i < count; i++) {
    // Occasionally insert a number if enabled
    if (numbers && Math.random() < 0.12) {
      const num = Math.floor(Math.random() * 900) + 10;
      words.push(num.toString());
      continue;
    }

    const randomIndex = Math.floor(Math.random() * COMMON_WORDS.length);
    let word = COMMON_WORDS[randomIndex];

    // Capitalize occasionally or after a period
    const prevWord = words[i - 1];
    if (punctuation && (i === 0 || (prevWord && (prevWord.endsWith(".") || prevWord.endsWith("!"))))) {
      word = word.charAt(0).toUpperCase() + word.slice(1);
    }

    if (punctuation && Math.random() < 0.18) {
      const p = puncMarks[Math.floor(Math.random() * puncMarks.length)];
      word += p;
    }

    words.push(word);
  }

  return words.join(" ");
}

export function getRandomQuote(lengthPreference?: 'short' | 'medium' | 'long'): Quote {
  const filtered = lengthPreference 
    ? QUOTES.filter(q => q.length === lengthPreference) 
    : QUOTES;
  const pool = filtered.length > 0 ? filtered : QUOTES;
  return pool[Math.floor(Math.random() * pool.length)];
}
