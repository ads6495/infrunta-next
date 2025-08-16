import type { Exercise } from "../../lib/types";
import { ExerciseBody } from "./exercise-body";
import { ExerciseControls } from "./exercise-controls";
import { ExerciseFooter } from "./exercise-footer";
import { ExerciseHeader } from "./exercise-header";
import { ExerciseProvider } from "./exercise-provider";

interface ExerciseCompoundProps {
	// Session management
	exercises: Exercise[];
	lessonId: number;
	lessonTitle?: string;

	// Navigation
	onBack?: () => void;
	onComplete?: () => void;

	// UI configuration
	showProgress?: boolean;
	showHints?: boolean;
	showTranslations?: boolean;
	showAudio?: boolean;
	allowRetry?: boolean;
	enableToastFeedback?: boolean;

	// Layout
	className?: string;
	headerClassName?: string;
	bodyClassName?: string;
	controlsClassName?: string;
	footerClassName?: string;
}

export function ExerciseCompound({
	exercises,
	lessonId,
	lessonTitle,
	onBack,
	onComplete,
	showProgress = true,
	showHints = true,
	showTranslations = true,
	showAudio = true,
	allowRetry = true,
	enableToastFeedback = true,
	className,
	headerClassName,
	bodyClassName,
	controlsClassName,
	footerClassName,
}: ExerciseCompoundProps) {
	return (
		<ExerciseProvider
			onSessionComplete={onComplete}
			enableToastFeedback={enableToastFeedback}
		>
			<ExerciseCompoundContent
				exercises={exercises}
				lessonId={lessonId}
				lessonTitle={lessonTitle}
				onBack={onBack}
				showProgress={showProgress}
				showHints={showHints}
				showTranslations={showTranslations}
				showAudio={showAudio}
				allowRetry={allowRetry}
				className={className}
				headerClassName={headerClassName}
				bodyClassName={bodyClassName}
				controlsClassName={controlsClassName}
				footerClassName={footerClassName}
			/>
		</ExerciseProvider>
	);
}

// Separate component to use hooks inside the provider
function ExerciseCompoundContent({
	exercises,
	lessonId,
	lessonTitle,
	onBack,
	showProgress,
	showHints,
	showTranslations,
	showAudio,
	allowRetry,
	className,
	headerClassName,
	bodyClassName,
	controlsClassName,
	footerClassName,
}: Omit<ExerciseCompoundProps, "onComplete" | "enableToastFeedback">) {
	const { startSession, currentExercise } = useExercise();
	const [hasInitialized, setHasInitialized] = React.useState(false);

	// Initialize session when exercises are provided - only once
	React.useEffect(() => {
		if (exercises.length > 0 && !hasInitialized) {
			startSession(lessonId, exercises);
			setHasInitialized(true);
		}
	}, [exercises.length, lessonId, hasInitialized, startSession]);

	if (!currentExercise) {
		return (
			<div className="flex items-center justify-center p-8">
				<div className="space-y-2 text-center">
					<div className="font-medium text-lg">Loading exercise...</div>
					<div className="text-muted-foreground text-sm">
						{exercises.length > 0
							? "Preparing your session"
							: "No exercises available"}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className={`space-y-6 ${className || ""}`}>
			{/* Header */}
			<ExerciseHeader
				lessonTitle={lessonTitle}
				onBack={onBack}
				showProgress={showProgress}
				showHintButton={showHints}
				showTranslationButton={showTranslations}
				className={headerClassName}
			/>

			{/* Main exercise content */}
			<ExerciseBody className={bodyClassName} />

			{/* Controls */}
			<ExerciseControls allowRetry={allowRetry} className={controlsClassName} />

			{/* Footer with hints, translations, audio */}
			<ExerciseFooter
				showHint={showHints}
				showTranslation={showTranslations}
				showAudioButton={showAudio}
				className={footerClassName}
			/>
		</div>
	);
}

// Import React for useEffect
import React from "react";
import { useExercise } from "./exercise-provider";
