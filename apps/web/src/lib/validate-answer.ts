import type { Exercise } from "./types";

// Centralized answer validation utility to keep the store lean and testable
export function validateAnswer(exercise: Exercise, userAnswer: string): boolean {
  if (!userAnswer.trim()) return false;

  // Normalize answers for comparison
  const normalize = (str: string) => str.toLowerCase().trim();
  const normalizedUser = normalize(userAnswer);
  const normalizedCorrect = (() => {
    // For DRAG_MATCH, derive from pairs if available; otherwise use correctAnswer string
    if ((exercise as any).type === "DRAG_MATCH" && (exercise as any).pairs) {
      const pairs = ((exercise as any).pairs as any[])
        .filter((p) => p.content && p.pairWith)
        .map((p) => `${p.content}:${p.pairWith}`)
        .join(", ");
      return normalize(pairs);
    }
    return normalize((exercise as any).correctAnswer || "");
  })();

  // For most exercise types, exact match after normalization
  switch ((exercise as any).type) {
    case "AUDIO_IMAGE_MATCH":
    case "WORD_USAGE_QUIZ":
    case "CONVERSATION_RESPONSE":
      // For multiple choice, match selected option text
      return normalizedUser === normalizedCorrect;

    case "SPELLING_BANK":
    case "SYLLABLE_ASSEMBLY":
    case "AUDIO_FILL_BLANK":
    case "AUDIO_TYPING":
    case "PRONUNCIATION_CHALLENGE":
      // For text assembly/input, exact match
      return normalizedUser === normalizedCorrect;

    case "WORD_ORDER": {
      // For word order, compare token order exactly (not sets)
      const tokenize = (s: string) => s.split(/\s+/).filter(Boolean);
      const correctWords = tokenize(normalizedCorrect);
      const userWords = tokenize(normalizedUser);
      if (userWords.length !== correctWords.length) return false;
      for (let i = 0; i < correctWords.length; i++) {
        if (userWords[i] !== correctWords[i]) return false;
      }
      return true;
    }

    case "DRAG_MATCH": {
      // Derive correct pairs from exercise.pairs rather than relying on correctAnswer
      const correctPairs = (((exercise as any).pairs
        ? (exercise as any).pairs
            .filter((p: any) => p.content && p.pairWith)
            .map((p: any) => [normalize(p.content), normalize(p.pairWith)])
        : []) as string[][]);

      const splitPairs = (s: string) =>
        s
          .split(/\||,/) // split by '|' or ','
          .map((p) => p.trim())
          .filter(Boolean)
          .map((p) => p.split(":").map((x) => x.trim()))
          .filter((arr) => arr.length === 2) as string[][];

      const normalizePairs = (pairs: string[][]) =>
        pairs.map(([l, r]) => `${l}:${r}`).sort((a, b) => a.localeCompare(b));

      const correctFlat = normalizePairs(correctPairs);
      const userPairs = normalizePairs(splitPairs(normalizedUser));
      return JSON.stringify(correctFlat) === JSON.stringify(userPairs);
    }

    case "FIND_MISTAKE":
      // For find mistake, compare selected positions
      return normalizedUser === normalizedCorrect;

    case "ALPHABET_OVERVIEW":
      // For alphabet overview, this might be completion-based
      return true; // Placeholder - depends on implementation

    default:
      return normalizedUser === normalizedCorrect;
  }
}
