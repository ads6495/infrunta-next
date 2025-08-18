import { useState } from "react";
import type { SyllableAssemblyExercise } from "../../lib/types";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

interface SyllableAssemblyProps {
	exercise: SyllableAssemblyExercise;
	answer?: string;
	onAnswerChange: (answer: string) => void;
	disabled?: boolean;
}

export function SyllableAssembly({
	exercise,
	answer = "",
	onAnswerChange,
	disabled = false,
}: SyllableAssemblyProps) {
	const [selectedSyllables, setSelectedSyllables] = useState<string[]>([]);
	const [usedIndices, setUsedIndices] = useState<Set<number>>(new Set());

	const handleSyllableClick = (syllable: string, index: number) => {
		if (disabled || usedIndices.has(index)) return;

		const newSelectedSyllables = [...selectedSyllables, syllable];
		const newUsedIndices = new Set(usedIndices).add(index);

		setSelectedSyllables(newSelectedSyllables);
		setUsedIndices(newUsedIndices);
		onAnswerChange(newSelectedSyllables.join(""));
	};

	const handleRemoveSyllable = (syllableIndex: number) => {
		if (disabled) return;

		const syllableToRemove = selectedSyllables[syllableIndex];
		const newSelectedSyllables = selectedSyllables.filter(
			(_, i) => i !== syllableIndex,
		);

		// Find the original index of this syllable to re-enable it
		const originalIndex = exercise.syllables.findIndex(
			(s, idx) => s.content === syllableToRemove && usedIndices.has(idx),
		);

		const newUsedIndices = new Set(usedIndices);
		if (originalIndex !== -1) {
			newUsedIndices.delete(originalIndex);
		}

		setSelectedSyllables(newSelectedSyllables);
		setUsedIndices(newUsedIndices);
		onAnswerChange(newSelectedSyllables.join(""));
	};

	const handleClear = () => {
		if (disabled) return;

		setSelectedSyllables([]);
		setUsedIndices(new Set());
		onAnswerChange("");
	};

	const availableSyllables = exercise.syllables.sort(
		(a, b) => a.orderIndex - b.orderIndex,
	);

	return (
		<div className="space-y-6">
			{exercise.prompt && (
				<p className="text-center font-medium text-lg">{exercise.prompt}</p>
			)}

			{/* Current Word Display */}
			<div className="flex min-h-16 items-center justify-center rounded-lg bg-muted p-4">
				<div className="flex gap-1">
					{selectedSyllables.map((syllable, index) => (
						<Card
							key={index}
							className="cursor-pointer px-3 py-2 transition-colors hover:bg-destructive hover:text-destructive-foreground"
							onClick={() => handleRemoveSyllable(index)}
						>
							<span className="font-bold">{syllable}</span>
						</Card>
					))}
					{selectedSyllables.length === 0 && (
						<span className="text-muted-foreground">
							Click syllables to build the word
						</span>
					)}
				</div>
			</div>

			{/* Syllables Bank */}
			<div className="space-y-4">
				<h4 className="text-center font-medium">Available Syllables</h4>
				<div className="flex flex-wrap justify-center gap-2">
					{availableSyllables.map((syllable, index) => (
						<Button
							key={index}
							variant="outline"
							size="lg"
							className={`font-bold ${usedIndices.has(index) ? "opacity-50" : ""}`}
							onClick={() => handleSyllableClick(syllable.content, index)}
							disabled={disabled || usedIndices.has(index)}
						>
							{syllable.content}
						</Button>
					))}
				</div>
			</div>

			{/* Clear Button */}
			{selectedSyllables.length > 0 && (
				<div className="flex justify-center">
					<Button variant="outline" onClick={handleClear} disabled={disabled}>
						Clear
					</Button>
				</div>
			)}

			<p className="text-center text-muted-foreground text-sm">
				Arrange the syllables in the correct order to form the word
			</p>
		</div>
	);
}
