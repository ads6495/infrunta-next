import { Card } from "../ui/card";
import { useExercise } from "./exercise-provider";
import { ExerciseRenderer } from "./exercise-renderer";

interface ExerciseBodyProps {
	className?: string;
}

export function ExerciseBody({ className }: ExerciseBodyProps) {
	const { currentExercise, currentAnswer, hasSubmitted, setAnswer } =
		useExercise();

	if (!currentExercise) {
		return (
			<Card className={`p-8 text-center ${className || ""}`}>
				<div className="text-muted-foreground">
					<p>No exercise loaded</p>
				</div>
			</Card>
		);
	}

	return (
		<div className={className}>
			<ExerciseRenderer
				exercise={currentExercise}
				answer={currentAnswer}
				onAnswerChange={setAnswer}
				disabled={hasSubmitted}
			/>
		</div>
	);
}
