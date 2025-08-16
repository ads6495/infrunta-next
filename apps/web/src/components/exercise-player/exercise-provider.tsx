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
  const store = useExerciseSessionStore();

  // Derived state
  const currentExercise = store.getCurrentExercise();
  const totalExercises = store.currentSession?.exercises.length || 0;
  const progress =
    totalExercises > 0
      ? ((store.currentExerciseIndex + 1) / totalExercises) * 100
      : 0;
  const isSessionCompleted = store.isSessionCompleted();

  // Actions with feedback
  const setAnswer = useCallback(
    (answer: string) => {
      store.setCurrentAnswer(answer);
    },
    [store]
  );

  const submitAnswer = useCallback(() => {
    const wasSubmitted = store.hasSubmitted;
    store.submitAnswer();

    // Show feedback toast
    if (enableToastFeedback && !wasSubmitted) {
      // Wait for state update
      setTimeout(() => {
        const isCorrect = store.isCorrect;
        if (isCorrect === true) {
          toast.success("Correct! Great job! 🎉");
        } else if (isCorrect === false) {
          toast.error("Not quite right. Try again! 💪");
        }
      }, 100);
    }
  }, [store, enableToastFeedback]);

  const nextExercise = useCallback(() => {
    const prevIndex = store.currentExerciseIndex;
    store.nextExercise();

    // Check if session was completed
    if (
      enableToastFeedback &&
      store.currentExerciseIndex === prevIndex &&
      store.isSessionCompleted()
    ) {
      toast.success("Lesson completed! Excellent work! 🌟");
    }
  }, [store, enableToastFeedback]);

  const previousExercise = useCallback(() => {
    store.previousExercise();
  }, [store]);

  const retryExercise = useCallback(() => {
    store.retryCurrentExercise();
  }, [store, enableToastFeedback]);

  const startSession = useCallback(
    (lessonId: number, exercises: Exercise[]) => {
      store.startSession(lessonId, exercises);
    },
    [store, enableToastFeedback]
  );

  // Audio management - auto-stop when exercise changes
  useEffect(() => {
    if (store.isAudioPlaying) {
      store.setAudioPlaying(false);
    }
  }, [store.currentExerciseIndex]);

  // Session completion callback
  useEffect(() => {
    if (isSessionCompleted && onSessionComplete) {
      onSessionComplete();
    }
  }, [isSessionCompleted, onSessionComplete]);

  const contextValue: ExerciseContextValue = {
    // Current exercise data
    currentExercise,
    currentAnswer: store.currentAnswer,
    hasSubmitted: store.hasSubmitted,
    isCorrect: store.isCorrect,

    // Session info
    currentIndex: store.currentExerciseIndex,
    totalExercises,
    progress,

    // Actions
    setAnswer,
    submitAnswer,
    nextExercise,
    previousExercise,
    retryExercise,

    // UI state
    isAudioPlaying: store.isAudioPlaying,
    showHint: store.showHint,
    showTranslation: store.showTranslation,
    setAudioPlaying: store.setAudioPlaying,
    toggleHint: store.toggleHint,
    toggleTranslation: store.toggleTranslation,

    // Session management
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

export function useExerciseAudio() {
  const { isAudioPlaying, setAudioPlaying } = useExercise();
  return [isAudioPlaying, setAudioPlaying] as const;
}
