import { useState } from "react";
import type { SpellingBankExercise } from "../../lib/types";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

interface SpellingBankProps {
	exercise: SpellingBankExercise;
	answer?: string;
	onAnswerChange: (answer: string) => void;
	disabled?: boolean;
}

export function SpellingBank({
	exercise,
	answer = "",
	onAnswerChange,
	disabled = false,
}: SpellingBankProps) {
	const [selectedLetters, setSelectedLetters] = useState<string[]>([]);

	const handleLetterClick = (letter: string, index: number) => {
		if (disabled) return;

		const newSelectedLetters = [...selectedLetters, letter];
		setSelectedLetters(newSelectedLetters);
		onAnswerChange(newSelectedLetters.join(""));
	};

	const handleRemoveLetter = (index: number) => {
		if (disabled) return;

		const newSelectedLetters = selectedLetters.filter((_, i) => i !== index);
		setSelectedLetters(newSelectedLetters);
		onAnswerChange(newSelectedLetters.join(""));
	};

	const handleClear = () => {
		if (disabled) return;

		setSelectedLetters([]);
		onAnswerChange("");
	};

	// Get available letters (not selected yet)
	const availableLetters = exercise.letterGroups
		.sort((a, b) => a.orderIndex - b.orderIndex)
		.map((group) => group.content);

	return (
		<div className="space-y-6">
			{exercise.prompt && (
				<p className="text-center font-medium text-lg">{exercise.prompt}</p>
			)}

			{/* Current Word Display */}
			<div className="flex min-h-16 items-center justify-center rounded-lg bg-muted p-4">
				<div className="flex gap-2">
					{selectedLetters.map((letter, index) => (
						<Card
							key={index}
							className="flex h-12 w-12 cursor-pointer items-center justify-center transition-colors hover:bg-destructive hover:text-destructive-foreground"
							onClick={() => handleRemoveLetter(index)}
						>
							<span className="font-bold text-lg">{letter}</span>
						</Card>
					))}
					{selectedLetters.length === 0 && (
						<span className="text-muted-foreground">
							Click letters to spell the word
						</span>
					)}
				</div>
			</div>

			{/* Letter Bank */}
			<div className="space-y-4">
				<h4 className="text-center font-medium">Available Letters</h4>
				<div className="flex flex-wrap justify-center gap-2">
					{availableLetters.map((letter, index) => (
						<Button
							key={index}
							variant="outline"
							size="lg"
							className="h-12 w-12 font-bold text-lg"
							onClick={() => handleLetterClick(letter, index)}
							disabled={disabled}
						>
							{letter}
						</Button>
					))}
				</div>
			</div>

			{/* Clear Button */}
			{selectedLetters.length > 0 && (
				<div className="flex justify-center">
					<Button variant="outline" onClick={handleClear} disabled={disabled}>
						Clear
					</Button>
				</div>
			)}

			<p className="text-center text-muted-foreground text-sm">
				Click letters to spell the word, then click letters in your word to
				remove them
			</p>
		</div>
	);
}
