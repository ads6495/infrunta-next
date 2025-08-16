import { useState } from "react";
import type { AudioTypingExercise } from "../../../lib/types";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";

interface AudioTypingProps {
	exercise: AudioTypingExercise;
	answer?: string;
	onAnswerChange: (answer: string) => void;
	disabled?: boolean;
}

export function AudioTyping({
	exercise,
	answer = "",
	onAnswerChange,
	disabled = false,
}: AudioTypingProps) {
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

	const handleInputChange = (value: string) => {
		if (!disabled) {
			onAnswerChange(value);
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

			{/* Text Input */}
			<div className="mx-auto max-w-2xl">
				<Input
					type="text"
					value={answer}
					onChange={(e) => handleInputChange(e.target.value)}
					placeholder="Type what you hear..."
					disabled={disabled}
					className="text-center text-lg"
				/>
			</div>

			<p className="text-center text-muted-foreground text-sm">
				Listen carefully and type exactly what you hear
			</p>
		</div>
	);
}
