import { useState } from "react";
import type { AudioImageMatchExercise } from "../../../lib/types";
import { Button } from "../../ui/button";
import { Card } from "../../ui/card";

interface AudioImageMatchProps {
	exercise: AudioImageMatchExercise;
	selectedAnswer?: string;
	onAnswerChange: (answer: string) => void;
	disabled?: boolean;
}

export function AudioImageMatch({
	exercise,
	selectedAnswer,
	onAnswerChange,
	disabled = false,
}: AudioImageMatchProps) {
	const [isPlaying, setIsPlaying] = useState(false);
	const [audio] = useState(() => new Audio(exercise.audioUrl));

	const handlePlayAudio = () => {
		if (isPlaying) {
			audio.pause();
			audio.currentTime = 0;
		} else {
			audio.play();
		}
		setIsPlaying(!isPlaying);
	};

	const handleOptionSelect = (optionText: string) => {
		if (!disabled) {
			onAnswerChange(optionText);
		}
	};

	// Clean up audio on unmount
	useState(() => {
		return () => {
			audio.pause();
			audio.currentTime = 0;
		};
	});

	// Handle audio events
	useState(() => {
		const handleAudioEnd = () => setIsPlaying(false);
		audio.addEventListener("ended", handleAudioEnd);
		return () => audio.removeEventListener("ended", handleAudioEnd);
	});

	return (
		<div className="space-y-6">
			{exercise.prompt && (
				<p className="text-center font-medium text-lg">{exercise.prompt}</p>
			)}

			{/* Audio Player */}
			<div className="flex justify-center">
				<Button
					onClick={handlePlayAudio}
					variant={isPlaying ? "secondary" : "default"}
					size="lg"
					disabled={disabled}
				>
					{isPlaying ? "⏸️ Pause" : "▶️ Play Audio"}
				</Button>
			</div>

			{/* Options Grid */}
			<div className="grid grid-cols-2 gap-4">
				{exercise.options.map((option) => (
					<Card
						key={option.id}
						className={`cursor-pointer p-4 transition-colors hover:bg-accent${selectedAnswer === option.text ? "bg-primary/10 ring-2 ring-primary" : ""}
							${disabled ? "cursor-not-allowed opacity-50" : ""}
						`}
						onClick={() => handleOptionSelect(option.text)}
					>
						{option.imageUrl ? (
							<div className="space-y-2">
								<img
									src={option.imageUrl}
									alt={option.text}
									className="h-32 w-full rounded object-cover"
								/>
								<p className="text-center font-medium">{option.text}</p>
							</div>
						) : (
							<div className="flex h-32 items-center justify-center">
								<p className="text-center font-medium text-lg">{option.text}</p>
							</div>
						)}
					</Card>
				))}
			</div>
		</div>
	);
}
