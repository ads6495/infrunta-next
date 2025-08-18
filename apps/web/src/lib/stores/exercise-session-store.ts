import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type { Exercise, ExerciseProgress, ExerciseSession } from "../types";
import { validateAnswer } from "../validate-answer";

interface ExerciseSessionState {
  // Session state
  currentSession: ExerciseSession | null;
  currentExerciseIndex: number;
  currentAnswer: string;
  hasSubmitted: boolean;
  isCorrect: boolean | null;

  // Progress state
  progress: ExerciseProgress;

  // UI state
  isAudioPlaying: boolean;
  showHint: boolean;
  showTranslation: boolean;
}

interface ExerciseSessionActions {
  // Session management
  startSession: (lessonId: number, exercises: Exercise[]) => void;
  completeSession: () => void;
  resetSession: () => void;

  // Exercise navigation
  nextExercise: () => void;
  previousExercise: () => void;
  goToExercise: (index: number) => void;

  // Answer management
  setCurrentAnswer: (answer: string) => void;
  submitAnswer: () => void;
  resetCurrentAnswer: () => void;
  retryCurrentExercise: () => void;

  // Progress tracking
  markExerciseCompleted: (exerciseId: number) => void;
  markLessonCompleted: (lessonId: number) => void;

  // UI state
  setAudioPlaying: (playing: boolean) => void;
  toggleHint: () => void;
  toggleTranslation: () => void;

  // Getters
  getCurrentExercise: () => Exercise | null;
  getExerciseAnswer: (exerciseId: number) => string | undefined;
  isSessionCompleted: () => boolean;
}

type ExerciseSessionStore = ExerciseSessionState & ExerciseSessionActions;

const initialProgress: ExerciseProgress = {
  completedExercises: new Set(),
  completedLessons: new Set(),
  totalExercisesCompleted: 0,
  currentStreak: 0,
};

export const useExerciseSessionStore = create<ExerciseSessionStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial state
    currentSession: null,
    currentExerciseIndex: 0,
    currentAnswer: "",
    hasSubmitted: false,
    isCorrect: null,
    progress: initialProgress,
    isAudioPlaying: false,
    showHint: false,
    showTranslation: false,

    // Session management
    startSession: (lessonId: number, exercises: Exercise[]) => {
      const session: ExerciseSession = {
        lessonId,
        currentExerciseIndex: 0,
        exercises,
        answers: new Map(),
        startedAt: new Date(),
      };

      set({
        currentSession: session,
        currentExerciseIndex: 0,
        currentAnswer: "",
        hasSubmitted: false,
        isCorrect: null,
        isAudioPlaying: false,
        showHint: false,
        showTranslation: false,
      });
    },

    completeSession: () => {
      const { currentSession, progress } = get();
      if (!currentSession) return;

      const completedSession = {
        ...currentSession,
        completedAt: new Date(),
      };

      // Mark lesson as completed
      const newCompletedLessons = new Set(progress.completedLessons);
      newCompletedLessons.add(currentSession.lessonId);

      set({
        currentSession: completedSession,
        progress: {
          ...progress,
          completedLessons: newCompletedLessons,
        },
      });
    },

    resetSession: () => {
      set({
        currentSession: null,
        currentExerciseIndex: 0,
        currentAnswer: "",
        hasSubmitted: false,
        isCorrect: null,
        isAudioPlaying: false,
        showHint: false,
        showTranslation: false,
      });
    },

    // Exercise navigation
    nextExercise: () => {
      const { currentSession, currentExerciseIndex } = get();
      if (!currentSession) return;

      const nextIndex = currentExerciseIndex + 1;
      if (nextIndex >= currentSession.exercises.length) {
        // Session completed
        get().completeSession();
        return;
      }

      // Get the answer for the next exercise (if any)
      const nextExercise = currentSession.exercises[nextIndex];
      const nextAnswer = nextExercise
        ? get().getExerciseAnswer(nextExercise.id) || ""
        : "";

      set({
        currentExerciseIndex: nextIndex,
        currentAnswer: nextAnswer,
        hasSubmitted: false,
        isCorrect: null,
        showHint: false,
        showTranslation: false,
      });
    },

    previousExercise: () => {
      const { currentSession, currentExerciseIndex } = get();
      if (!currentSession || currentExerciseIndex <= 0) return;

      const prevIndex = currentExerciseIndex - 1;
      const prevExercise = currentSession.exercises[prevIndex];
      const prevAnswer = prevExercise
        ? get().getExerciseAnswer(prevExercise.id) || ""
        : "";

      set({
        currentExerciseIndex: prevIndex,
        currentAnswer: prevAnswer,
        hasSubmitted: false,
        isCorrect: null,
        showHint: false,
        showTranslation: false,
      });
    },

    goToExercise: (index: number) => {
      const { currentSession } = get();
      if (
        !currentSession ||
        index < 0 ||
        index >= currentSession.exercises.length
      ) {
        return;
      }

      const exercise = currentSession.exercises[index];
      const answer = get().getExerciseAnswer(exercise.id) || "";

      set({
        currentExerciseIndex: index,
        currentAnswer: answer,
        hasSubmitted: false,
        isCorrect: null,
        showHint: false,
        showTranslation: false,
      });
    },

    // Answer management
    setCurrentAnswer: (answer: string) => {
      set({ currentAnswer: answer });
    },

    submitAnswer: () => {
      const {
        currentSession,
        currentExerciseIndex,
        currentAnswer,
        hasSubmitted,
      } = get();
      if (!currentSession || hasSubmitted) return;

      const currentExercise = currentSession.exercises[currentExerciseIndex];
      if (!currentExercise) return;

      // Store the answer
      const updatedAnswers = new Map(currentSession.answers);
      updatedAnswers.set(currentExercise.id, currentAnswer);

      // Validate answer
      const isCorrect = validateAnswer(currentExercise, currentAnswer);

      // Update progress if correct
      let updatedProgress = get().progress;
      if (isCorrect) {
        const newCompletedExercises = new Set(
          updatedProgress.completedExercises
        );
        newCompletedExercises.add(currentExercise.id);

        updatedProgress = {
          ...updatedProgress,
          completedExercises: newCompletedExercises,
          totalExercisesCompleted: updatedProgress.totalExercisesCompleted + 1,
          currentStreak: updatedProgress.currentStreak + 1,
        };
      } else {
        // Reset streak on wrong answer
        updatedProgress = {
          ...updatedProgress,
          currentStreak: 0,
        };
      }

      set({
        currentSession: {
          ...currentSession,
          answers: updatedAnswers,
        },
        hasSubmitted: true,
        isCorrect,
        progress: updatedProgress,
      });
    },

    resetCurrentAnswer: () => {
      set({
        currentAnswer: "",
        hasSubmitted: false,
        isCorrect: null,
      });
    },

    retryCurrentExercise: () => {
      const { currentSession, currentExerciseIndex } = get();
      if (!currentSession) return;

      const currentExercise = currentSession.exercises[currentExerciseIndex];
      if (!currentExercise) return;

      // Remove the stored answer for this exercise
      const updatedAnswers = new Map(currentSession.answers);
      updatedAnswers.delete(currentExercise.id);

      set({
        currentSession: {
          ...currentSession,
          answers: updatedAnswers,
        },
        currentAnswer: "",
        hasSubmitted: false,
        isCorrect: null,
        showHint: false,
        showTranslation: false,
      });
    },

    // Progress tracking
    markExerciseCompleted: (exerciseId: number) => {
      const { progress } = get();
      const newCompletedExercises = new Set(progress.completedExercises);
      newCompletedExercises.add(exerciseId);

      set({
        progress: {
          ...progress,
          completedExercises: newCompletedExercises,
          totalExercisesCompleted: progress.totalExercisesCompleted + 1,
        },
      });
    },

    markLessonCompleted: (lessonId: number) => {
      const { progress } = get();
      const newCompletedLessons = new Set(progress.completedLessons);
      newCompletedLessons.add(lessonId);

      set({
        progress: {
          ...progress,
          completedLessons: newCompletedLessons,
        },
      });
    },

    // UI state
    setAudioPlaying: (playing: boolean) => {
      set({ isAudioPlaying: playing });
    },

    toggleHint: () => {
      set((state) => ({ showHint: !state.showHint }));
    },

    toggleTranslation: () => {
      set((state) => ({ showTranslation: !state.showTranslation }));
    },

    // Getters
    getCurrentExercise: () => {
      const { currentSession, currentExerciseIndex } = get();
      if (!currentSession) return null;
      return currentSession.exercises[currentExerciseIndex] || null;
    },

    getExerciseAnswer: (exerciseId: number) => {
      const { currentSession } = get();
      return currentSession?.answers.get(exerciseId);
    },

    isSessionCompleted: () => {
      const { currentSession } = get();
      return currentSession?.completedAt !== undefined;
    },
  }))
);

// Subscribe to session changes for persistence or analytics
useExerciseSessionStore.subscribe(
  (state) => state.currentSession,
  (session) => {
    if (process.env.NODE_ENV !== "production") {
      console.log("Session updated:", session?.lessonId);
    }
  }
);

// Subscribe to progress changes
useExerciseSessionStore.subscribe(
  (state) => state.progress,
  (progress) => {
    if (process.env.NODE_ENV !== "production") {
      console.log("Progress updated:", progress.totalExercisesCompleted);
    }
  }
);
