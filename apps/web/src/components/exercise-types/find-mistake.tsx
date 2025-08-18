import { useState } from "react";
import type { FindMistakeExercise } from "../../lib/types";
import { Button } from "../ui/button";

interface FindMistakeProps {
	exercise: FindMistakeExercise;
	answer?: string;
	onAnswerChange: (answer: string) => void;
	disabled?: boolean;
}

export function FindMistake({
	exercise,
	answer = "",
	onAnswerChange,
	disabled = false,
}: FindMistakeProps) {
	const [selectedMistakes, setSelectedMistakes] = useState<Set<number>>(
		new Set(),
	);

	// Split text into words with their positions
	const words = exercise.text.split(/(\s+)/).map((word, index) => ({
		word,
		position: index,
		isMistake: exercise.mistakes.some((mistake) => mistake.position === index),
	}));

	const handleWordClick = (position: number, isMistake: boolean) => {
		if (disabled || !isMistake) return;

		const newSelectedMistakes = new Set(selectedMistakes);

		if (newSelectedMistakes.has(position)) {
			newSelectedMistakes.delete(position);
		} else {
			newSelectedMistakes.add(position);
		}

		setSelectedMistakes(newSelectedMistakes);

		// Format answer as selected positions
		const sortedPositions = Array.from(newSelectedMistakes).sort(
			(a, b) => a - b,
		);
		onAnswerChange(sortedPositions.join(","));
	};

	const handleClear = () => {
		if (disabled) return;
		setSelectedMistakes(new Set());
		onAnswerChange("");
	};

	const selectedCount = selectedMistakes.size;
	const totalMistakes = exercise.mistakes.length;

	return (
		<div className="space-y-6">
			{exercise.prompt && (
				<p className="text-center font-medium text-lg">{exercise.prompt}</p>
			)}

			{/* Text with clickable words */}
			<div className="mx-auto max-w-4xl rounded-lg bg-muted p-6">
				<div className="text-lg leading-relaxed">
					{words.map((item, index) => {
						if (/^\s+$/.test(item.word)) {
							// Preserve whitespace
							return <span key={index}>{item.word}</span>;
						}

						const isMistake = item.isMistake;
						const isSelected = selectedMistakes.has(item.position);

						return (
							<span
								key={index}
								className={`
									${isMistake ? "cursor-pointer rounded px-1 hover:bg-yellow-200" : ""}
									${isSelected ? "rounded bg-red-200 px-1 font-semibold text-red-800" : ""}
									${disabled ? "cursor-not-allowed" : ""}
								`}
								onClick={() => handleWordClick(item.position, isMistake)}
								title={isMistake ? "Click to mark as mistake" : undefined}
							>
								{item.word}
							</span>
						);
					})}
				</div>
			</div>

			{/* Progress indicator */}
			<div className="space-y-2 text-center">
				<p className="text-muted-foreground text-sm">
					Found {selectedCount} of {totalMistakes} mistakes
				</p>
				{selectedCount > 0 && (
					<div className="flex justify-center">
						<Button variant="outline" onClick={handleClear} disabled={disabled}>
							Clear Selection
						</Button>
					</div>
				)}
			</div>

			<p className="text-center text-muted-foreground text-sm">
				Click on the words that contain mistakes
			</p>
		</div>
	);
}
