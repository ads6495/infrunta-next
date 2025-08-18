import type { WordUsageQuizExercise } from "../../lib/types";
import { Card } from "../ui/card";

interface WordUsageQuizProps {
	exercise: WordUsageQuizExercise;
	selectedAnswer?: string;
	onAnswerChange: (answer: string) => void;
	disabled?: boolean;
}

export function WordUsageQuiz({
	exercise,
	selectedAnswer,
	onAnswerChange,
	disabled = false,
}: WordUsageQuizProps) {
	const handleOptionSelect = (optionText: string) => {
		if (!disabled) {
			onAnswerChange(optionText);
		}
	};

	return (
		<div className="space-y-6">
			{exercise.prompt && (
				<p className="text-center font-medium text-lg">{exercise.prompt}</p>
			)}

			{/* Options */}
			<div className="mx-auto max-w-2xl space-y-3">
				{exercise.options
					.sort((a, b) => a.orderIndex - b.orderIndex)
					.map((option) => (
						<Card
							key={option.id}
							className={`cursor-pointer p-4 transition-colors hover:bg-accent${selectedAnswer === option.text ? "bg-primary/10 ring-2 ring-primary" : ""}
								${disabled ? "cursor-not-allowed opacity-50" : ""}
							`}
							onClick={() => handleOptionSelect(option.text)}
						>
							<p className="text-center font-medium">{option.text}</p>
						</Card>
					))}
			</div>

			<p className="text-center text-muted-foreground text-sm">
				Choose the best answer
			</p>
		</div>
	);
}
