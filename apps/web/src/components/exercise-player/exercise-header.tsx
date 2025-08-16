import { ArrowLeft, Languages, Lightbulb } from "lucide-react";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { useExercise, useExerciseNavigation } from "./exercise-provider";

interface ExerciseHeaderProps {
	lessonTitle?: string;
	onBack?: () => void;
	showProgress?: boolean;
	showHintButton?: boolean;
	showTranslationButton?: boolean;
	className?: string;
}

export function ExerciseHeader({
	lessonTitle,
	onBack,
	showProgress = true,
	showHintButton = true,
	showTranslationButton = true,
	className,
}: ExerciseHeaderProps) {
	const {
		currentExercise,
		toggleHint,
		toggleTranslation,
		showHint,
		showTranslation,
	} = useExercise();
	const { currentIndex, totalExercises, progress } = useExerciseNavigation();

	return (
		<div className={`space-y-4 ${className || ""}`}>
			{/* Top navigation bar */}
			<div className="flex items-center justify-between">
				{onBack ? (
					<Button variant="ghost" size="sm" onClick={onBack}>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back
					</Button>
				) : (
					<div /> // Spacer
				)}

				{lessonTitle && (
					<div className="text-center">
						<h1 className="font-semibold text-xl">{lessonTitle}</h1>
					</div>
				)}

				<div className="flex items-center space-x-2">
					{showHintButton && currentExercise?.prompt && (
						<Button
							variant={showHint ? "default" : "outline"}
							size="sm"
							onClick={toggleHint}
						>
							<Lightbulb className="h-4 w-4" />
						</Button>
					)}

					{showTranslationButton && currentExercise?.englishTranslation && (
						<Button
							variant={showTranslation ? "default" : "outline"}
							size="sm"
							onClick={toggleTranslation}
						>
							<Languages className="h-4 w-4" />
						</Button>
					)}
				</div>
			</div>

			{/* Progress section */}
			{showProgress && (
				<div className="space-y-2">
					<div className="flex items-center justify-between text-sm">
						<span>
							Question {currentIndex + 1} of {totalExercises}
						</span>
						<span>{Math.round(progress)}% Complete</span>
					</div>
					<Progress value={progress} className="h-2" />
				</div>
			)}

			{/* Exercise type indicator */}
			{currentExercise && (
				<div className="text-center">
					<span className="font-medium text-muted-foreground text-xs uppercase tracking-wide">
						{currentExercise.type.replace(/_/g, " ")}
					</span>
				</div>
			)}
		</div>
	);
}
