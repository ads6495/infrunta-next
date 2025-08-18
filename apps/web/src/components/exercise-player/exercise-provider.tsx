'use client'
import type React from "react";
import { createContext, useCallback, useContext, useEffect } from "react";
import { toast } from "sonner";
import { useExerciseSessionStore } from "../../lib/stores/exercise-session-store";
import type { Exercise } from "../../lib/types";

interface ExerciseContextValue {
  // Current exercise data
  currentExercise: Exercise | null;
  currentAnswer: string;
  hasSubmitted: boolean;
  isCorrect: boolean | null;

  // Session info
  currentIndex: number;
  totalExercises: number;
  progress: number;

  // Actions
  setAnswer: (answer: string) => void;
  submitAnswer: () => void;
  nextExercise: () => void;
  previousExercise: () => void;
  retryExercise: () => void;

  // UI state
  isAudioPlaying: boolean;
  showHint: boolean;
  showTranslation: boolean;
  setAudioPlaying: (playing: boolean) => void;
  toggleHint: () => void;
  toggleTranslation: () => void;

  // Session management
  startSession: (lessonId: number, exercises: Exercise[]) => void;
  isSessionCompleted: boolean;
  onSessionComplete?: () => void;
}

const ExerciseContext = createContext<ExerciseContextValue | null>(null);

interface ExerciseProviderProps {
  children: React.ReactNode;
  onSessionComplete?: () => void;
  enableToastFeedback?: boolean;
}

export function ExerciseProvider({
  children,
  onSessionComplete,
  enableToastFeedback = true,
}: ExerciseProviderProps) {
  // Select slices to minimize re-renders
  const currentExerciseIndex = useExerciseSessionStore((s) => s.currentExerciseIndex);
  const currentAnswer = useExerciseSessionStore((s) => s.currentAnswer);
  const hasSubmitted = useExerciseSessionStore((s) => s.hasSubmitted);
  const isCorrect = useExerciseSessionStore((s) => s.isCorrect);
  const isAudioPlaying = useExerciseSessionStore((s) => s.isAudioPlaying);
  const showHint = useExerciseSessionStore((s) => s.showHint);
  const showTranslation = useExerciseSessionStore((s) => s.showTranslation);
  const totalExercises = useExerciseSessionStore(
    (s) => s.currentSession?.exercises.length || 0
  );
  const isSessionCompleted = useExerciseSessionStore((s) => s.isSessionCompleted());
  const currentExercise = useExerciseSessionStore(
    (s) => s.currentSession?.exercises[s.currentExerciseIndex] || null
  );

  const setCurrentAnswer = useExerciseSessionStore((s) => s.setCurrentAnswer);
  const submit = useExerciseSessionStore((s) => s.submitAnswer);
  const next = useExerciseSessionStore((s) => s.nextExercise);
  const prev = useExerciseSessionStore((s) => s.previousExercise);
  const retry = useExerciseSessionStore((s) => s.retryCurrentExercise);
  const setAudioPlaying = useExerciseSessionStore((s) => s.setAudioPlaying);
  const toggleHint = useExerciseSessionStore((s) => s.toggleHint);
  const toggleTranslation = useExerciseSessionStore((s) => s.toggleTranslation);
  const start = useExerciseSessionStore((s) => s.startSession);

  const progress = totalExercises
    ? ((currentExerciseIndex + 1) / totalExercises) * 100
    : 0;

  // Action wrappers
  const setAnswer = useCallback((answer: string) => setCurrentAnswer(answer), [setCurrentAnswer]);
  const submitAnswer = useCallback(() => submit(), [submit]);
  const nextExercise = useCallback(() => next(), [next]);
  const previousExercise = useCallback(() => prev(), [prev]);
  const retryExercise = useCallback(() => retry(), [retry]);
  const startSession = useCallback(
    (lessonId: number, exercises: Exercise[]) => start(lessonId, exercises),
    [start]
  );

  // Audio management - auto-stop when exercise changes
  useEffect(() => {
    if (isAudioPlaying) setAudioPlaying(false);
  }, [currentExerciseIndex, isAudioPlaying, setAudioPlaying]);

  // Toast feedback when an answer is submitted
  useEffect(() => {
    if (!enableToastFeedback || !hasSubmitted) return;
    if (isCorrect === true) toast.success("Correct! Great job! 🎉");
    else if (isCorrect === false) toast.error("Not quite right. Try again! 💪");
  }, [hasSubmitted, isCorrect, enableToastFeedback]);

  // Session completion callback only
  useEffect(() => {
    if (isSessionCompleted && onSessionComplete) onSessionComplete();
  }, [isSessionCompleted, onSessionComplete]);

  const contextValue: ExerciseContextValue = {
    currentExercise,
    currentAnswer,
    hasSubmitted,
    isCorrect,
    currentIndex: currentExerciseIndex,
    totalExercises,
    progress,
    setAnswer,
    submitAnswer,
    nextExercise,
    previousExercise,
    retryExercise,
    isAudioPlaying,
    showHint,
    showTranslation,
    setAudioPlaying,
    toggleHint,
    toggleTranslation,
    startSession,
    isSessionCompleted,
    onSessionComplete,
  };

  return (
    <ExerciseContext.Provider value={contextValue}>
      {children}
    </ExerciseContext.Provider>
  );
}

export function useExercise() {
  const context = useContext(ExerciseContext);
  if (!context) {
    throw new Error("useExercise must be used within an ExerciseProvider");
  }
  return context;
}

// Convenience hooks for specific functionality
export function useExerciseAnswer() {
  const { currentAnswer, setAnswer } = useExercise();
  return [currentAnswer, setAnswer] as const;
}

export function useExerciseSubmission() {
  const { hasSubmitted, isCorrect, submitAnswer } = useExercise();
  return { hasSubmitted, isCorrect, submitAnswer };
}

export function useExerciseAudio() {
  const { isAudioPlaying, setAudioPlaying } = useExercise();
  return [isAudioPlaying, setAudioPlaying] as const;
}

export function useExerciseNavigation() {
  const {
    currentIndex,
    totalExercises,
    progress,
    nextExercise,
    previousExercise,
    isSessionCompleted,
  } = useExercise();

  const canGoNext = currentIndex < totalExercises - 1 || isSessionCompleted;
  const canGoPrevious = currentIndex > 0;

  return {
    currentIndex,
    totalExercises,
    progress,
    nextExercise,
    previousExercise,
    canGoNext,
    canGoPrevious,
    isSessionCompleted,
  };
}

