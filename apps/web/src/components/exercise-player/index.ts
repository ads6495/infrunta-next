// Main compound component

export { ExerciseBody } from "./exercise-body";
export { ExerciseCompound } from "./exercise-compound";
export { ExerciseControls } from "./exercise-controls";
export { ExerciseFooter } from "./exercise-footer";
// Individual compound components
export { ExerciseHeader } from "./exercise-header";
// Provider and hooks
export {
	ExerciseProvider,
	useExercise,
	useExerciseAnswer,
	useExerciseAudio,
	useExerciseNavigation,
	useExerciseSubmission,
} from "./exercise-provider";

// Exercise renderer
export { ExerciseRenderer } from "./exercise-renderer";

// Exercise type components
export * from "./types";
