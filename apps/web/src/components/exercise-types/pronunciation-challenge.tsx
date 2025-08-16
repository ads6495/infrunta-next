import { useState } from "react";
import type { PronunciationChallengeExercise } from "../../../lib/types";
import { Button } from "../../ui/button";
import { Card } from "../../ui/card";

interface PronunciationChallengeProps {
	exercise: PronunciationChallengeExercise;
	answer?: string;
	onAnswerChange: (answer: string) => void;
	disabled?: boolean;
}

export function PronunciationChallenge({
	exercise,
	answer = "",
	onAnswerChange,
	disabled = false,
}: PronunciationChallengeProps) {
	const [isPlaying, setIsPlaying] = useState(false);
	const [isRecording, setIsRecording] = useState(false);
	const [hasRecording, setHasRecording] = useState(false);
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

	const handleStartRecording = async () => {
		if (disabled) return;

		try {
			// This is a simplified placeholder - in a real app you'd need to:
			// 1. Request microphone permissions
			// 2. Use MediaRecorder API to record audio
			// 3. Process the audio for comparison
			// 4. Provide feedback on pronunciation accuracy

			setIsRecording(true);

			// Simulate recording duration
			setTimeout(() => {
				setIsRecording(false);
				setHasRecording(true);
				onAnswerChange("recorded"); // Placeholder answer
			}, 2000);
		} catch (error) {
			console.error("Recording failed:", error);
			setIsRecording(false);
		}
	};

	const handleStopRecording = () => {
		setIsRecording(false);
		setHasRecording(true);
		onAnswerChange("recorded"); // Placeholder answer
	};

	const handleTryAgain = () => {
		if (disabled) return;
		setHasRecording(false);
		onAnswerChange("");
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

			{/* Target word/phrase */}
			<Card className="border-primary/20 bg-primary/5 p-6">
				<p className="text-center font-bold text-2xl">
					{exercise.correctAnswer}
				</p>
			</Card>

			{/* Audio Player */}
			<div className="flex justify-center">
				<Button
					onClick={handlePlayAudio}
					variant={isPlaying ? "secondary" : "default"}
					size="lg"
					disabled={disabled}
				>
					{isPlaying ? "⏸️ Pause" : "🔊 Listen"}
				</Button>
			</div>

			{/* Recording Interface */}
			<div className="flex flex-col items-center space-y-4">
				{!hasRecording ? (
					<>
						<Button
							onClick={isRecording ? handleStopRecording : handleStartRecording}
							size="lg"
							variant={isRecording ? "destructive" : "default"}
							disabled={disabled}
							className="w-32"
						>
							{isRecording ? <>⏹️ Stop</> : <>🎤 Record</>}
						</Button>
						{isRecording && (
							<p className="animate-pulse text-muted-foreground text-sm">
								Recording... Speak clearly
							</p>
						)}
					</>
				) : (
					<>
						<div className="flex items-center space-x-4">
							<div className="text-green-600">✓ Recording complete</div>
							<Button
								onClick={handleTryAgain}
								variant="outline"
								disabled={disabled}
							>
								Try Again
							</Button>
						</div>
						<p className="text-muted-foreground text-sm">
							Note: Pronunciation scoring is not implemented in this demo
						</p>
					</>
				)}
			</div>

			<div className="space-y-2 text-center">
				<p className="text-muted-foreground text-sm">
					1. Listen to the pronunciation
				</p>
				<p className="text-muted-foreground text-sm">
					2. Record yourself saying the word or phrase
				</p>
				<p className="text-muted-foreground text-sm">
					3. Get feedback on your pronunciation
				</p>
			</div>
		</div>
	);
}
