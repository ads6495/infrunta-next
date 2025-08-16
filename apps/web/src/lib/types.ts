// Core enums matching Prisma schema
export type Level = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type ExerciseTypeEnum =
  | "AUDIO_IMAGE_MATCH"
  | "AUDIO_FILL_BLANK"
  | "WORD_USAGE_QUIZ"
  | "SPELLING_BANK"
  | "SYLLABLE_ASSEMBLY"
  | "DRAG_MATCH"
  | "PRONUNCIATION_CHALLENGE"
  | "CONVERSATION_RESPONSE"
  | "WORD_ORDER"
  | "AUDIO_TYPING"
  | "FIND_MISTAKE"
  | "ALPHABET_OVERVIEW";

// Core entities
export interface Language {
  id: number;
  code: string;
  name: string;
  units: Unit[];
}

export interface Unit {
  id: number;
  title: string;
  level: Level;
  languageId: number;
  objective: string;
  orderNumber: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: number;
  title: string;
  content: string;
  unitId: number;
  orderNumber: number;
  premium?: boolean;
  exercises: Exercise[];
}

// Exercise option for multiple choice questions
export interface ExerciseOption {
  id: number;
  text: string;
  isCorrect?: boolean;
  imageUrl?: string;
  orderIndex: number;
}

// Exercise component for complex exercises
export interface ExerciseComponent {
  id: number;
  type:
    | "SYLLABLE"
    | "LETTER_GROUP"
    | "MATCH_PAIR"
    | "DIALOGUE_LINE"
    | "WORD_FRAGMENT";
  content: string;
  pairWith?: string;
  audioUrl?: string;
  imageUrl?: string;
  isCorrect?: boolean;
  orderIndex: number;
}

// Base exercise interface
export interface BaseExercise {
  id: number;
  type: ExerciseTypeEnum;
  prompt?: string;
  correctAnswer: string;
  englishTranslation?: string;
  orderNumber: number;
  lessonId: number;
  audioUrl?: string;
  imageUrl?: string;
}

// Type-specific exercise data
export interface AudioImageMatchExercise extends BaseExercise {
  type: "AUDIO_IMAGE_MATCH";
  audioUrl: string;
  options: ExerciseOption[]; // Should have 4 options with imageUrl
}

export interface AudioFillBlankExercise extends BaseExercise {
  type: "AUDIO_FILL_BLANK";
  audioUrl: string;
}

export interface WordUsageQuizExercise extends BaseExercise {
  type: "WORD_USAGE_QUIZ";
  options: ExerciseOption[]; // At least 2 options
}

export interface SpellingBankExercise extends BaseExercise {
  type: "SPELLING_BANK";
  letterGroups: ExerciseComponent[]; // type: LETTER_GROUP
}

export interface SyllableAssemblyExercise extends BaseExercise {
  type: "SYLLABLE_ASSEMBLY";
  syllables: ExerciseComponent[]; // type: SYLLABLE
}

export interface DragMatchExercise extends BaseExercise {
  type: "DRAG_MATCH";
  pairs: ExerciseComponent[]; // type: MATCH_PAIR with pairWith
}

export interface PronunciationChallengeExercise extends BaseExercise {
  type: "PRONUNCIATION_CHALLENGE";
  audioUrl: string;
}

export interface ConversationResponseExercise extends BaseExercise {
  type: "CONVERSATION_RESPONSE";
  options?: ExerciseOption[]; // Optional for free text vs choice
}

export interface WordOrderExercise extends BaseExercise {
  type: "WORD_ORDER";
  words: ExerciseComponent[]; // type: WORD_FRAGMENT
}

export interface AudioTypingExercise extends BaseExercise {
  type: "AUDIO_TYPING";
  audioUrl: string;
}

export interface FindMistakeExercise extends BaseExercise {
  type: "FIND_MISTAKE";
  text: string;
  mistakes: { position: number; correct: string }[];
}

export interface AlphabetOverviewExercise extends BaseExercise {
  type: "ALPHABET_OVERVIEW";
  letterGroups: ExerciseComponent[]; // type: LETTER_GROUP
}

// Union type for all exercise types
export type Exercise =
  | AudioImageMatchExercise
  | AudioFillBlankExercise
  | WordUsageQuizExercise
  | SpellingBankExercise
  | SyllableAssemblyExercise
  | DragMatchExercise
  | PronunciationChallengeExercise
  | ConversationResponseExercise
  | WordOrderExercise
  | AudioTypingExercise
  | FindMistakeExercise
  | AlphabetOverviewExercise;

// User progress and attempts
export interface UserLessonProgress {
  id: string;
  completed: boolean;
  lastAccessed: Date;
  userId: string;
  lessonId: number;
}

export interface ExerciseAttempt {
  id: string;
  exerciseId: number;
  userId: string;
  answer: string;
  correct: boolean;
  timestamp: Date;
}

// Session management types
export interface ExerciseSession {
  lessonId: number;
  currentExerciseIndex: number;
  exercises: Exercise[];
  answers: Map<number, string>;
  startedAt: Date;
  completedAt?: Date;
}

export interface ExerciseProgress {
  completedExercises: Set<number>;
  completedLessons: Set<number>;
  totalExercisesCompleted: number;
  currentStreak: number;
}
