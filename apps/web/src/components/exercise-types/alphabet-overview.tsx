import { useState } from "react";
import type { AlphabetOverviewExercise } from "../../lib/types";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

interface AlphabetOverviewProps {
	exercise: AlphabetOverviewExercise;
	answer?: string;
	onAnswerChange: (answer: string) => void;
	disabled?: boolean;
}

export function AlphabetOverview({
	exercise,
	answer = "",
	onAnswerChange,
	disabled = false,
}: AlphabetOverviewProps) {
	const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
	const [playingAudio, setPlayingAudio] = useState<string | null>(null);

	const handleLetterClick = (letter: string) => {
		if (disabled) return;

		const newSelectedLetters = selectedLetters.includes(letter)
			? selectedLetters.filter((l) => l !== letter)
			: [...selectedLetters, letter];

		setSelectedLetters(newSelectedLetters);
		onAnswerChange(newSelectedLetters.join(","));
	};

	const handlePlayAudio = async (audioUrl?: string) => {
		if (!audioUrl || disabled) return;

		if (playingAudio === audioUrl) {
			// Stop current audio
			setPlayingAudio(null);
			return;
		}

		try {
			const audio = new Audio(audioUrl);
			setPlayingAudio(audioUrl);

			audio.addEventListener("ended", () => {
				setPlayingAudio(null);
			});

			await audio.play();
		} catch (error) {
			console.error("Audio play failed:", error);
			setPlayingAudio(null);
		}
	};

	const handleSelectAll = () => {
		if (disabled) return;
		const allLetters = exercise.letterGroups.map((group) => group.content);
		setSelectedLetters(allLetters);
		onAnswerChange(allLetters.join(","));
	};

	const handleClear = () => {
		if (disabled) return;
		setSelectedLetters([]);
		onAnswerChange("");
	};

	const sortedLetterGroups = exercise.letterGroups.sort(
		(a, b) => a.orderIndex - b.orderIndex,
	);

	return (
		<div className="space-y-6">
			{exercise.prompt && (
				<p className="text-center font-medium text-lg">{exercise.prompt}</p>
			)}

			{/* Alphabet Grid */}
			<div className="mx-auto max-w-4xl">
				<div className="grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8">
					{sortedLetterGroups.map((letterGroup) => (
						<Card
							key={letterGroup.id}
							className={`cursor-pointer p-4 text-center transition-colors hover:bg-accent${selectedLetters.includes(letterGroup.content) ? "bg-primary/10 ring-2 ring-primary" : ""}
								${disabled ? "cursor-not-allowed opacity-50" : ""}
							`}
							onClick={() => handleLetterClick(letterGroup.content)}
						>
							<div className="space-y-2">
								<div className="font-bold text-2xl">{letterGroup.content}</div>

								{letterGroup.audioUrl && (
									<Button
										variant="ghost"
										size="sm"
										onClick={(e) => {
											e.stopPropagation();
											handlePlayAudio(letterGroup.audioUrl);
										}}
										disabled={disabled}
										className="h-8 w-full p-1"
									>
										{playingAudio === letterGroup.audioUrl ? "⏸️" : "🔊"}
									</Button>
								)}

								{letterGroup.imageUrl && (
									<img
										src={letterGroup.imageUrl}
										alt={`Letter ${letterGroup.content}`}
										className="mx-auto h-12 w-12 rounded object-cover"
									/>
								)}
							</div>
						</Card>
					))}
				</div>
			</div>

			{/* Controls */}
			{!disabled && (
				<div className="flex justify-center space-x-4">
					<Button variant="outline" onClick={handleSelectAll}>
						Select All
					</Button>
					<Button variant="outline" onClick={handleClear}>
						Clear
					</Button>
				</div>
			)}

			{/* Selected count */}
			{selectedLetters.length > 0 && (
				<p className="text-center text-muted-foreground text-sm">
					Selected: {selectedLetters.join(", ")} ({selectedLetters.length}{" "}
					letters)
				</p>
			)}

			<p className="text-center text-muted-foreground text-sm">
				Click on letters to interact with them. Letters with audio can be played
				individually.
			</p>
		</div>
	);
}
