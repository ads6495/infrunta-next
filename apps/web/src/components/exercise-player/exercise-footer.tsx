import { Languages, Lightbulb, Volume2 } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { useExercise } from "./exercise-provider";

interface ExerciseFooterProps {
	showHint?: boolean;
	showTranslation?: boolean;
	showAudioButton?: boolean;
	className?: string;
}

export function ExerciseFooter({
	showHint = true,
	showTranslation = true,
	showAudioButton = true,
	className,
}: ExerciseFooterProps) {
	const {
		currentExercise,
		showHint: hintVisible,
		showTranslation: translationVisible,
		isAudioPlaying,
		setAudioPlaying,
	} = useExercise();

	if (!currentExercise) {
		return null;
	}

	const hasHint = currentExercise.prompt && currentExercise.prompt.length > 0;
	const hasTranslation =
		currentExercise.englishTranslation &&
		currentExercise.englishTranslation.length > 0;
	const hasAudio =
		currentExercise.audioUrl && currentExercise.audioUrl.length > 0;

	// Don't show footer if there's nothing to display
	if (!hasHint && !hasTranslation && !hasAudio) {
		return null;
	}

	const handleAudioPlay = () => {
		if (!currentExercise.audioUrl) return;

		if (isAudioPlaying) {
			// Stop audio logic would go here
			setAudioPlaying(false);
		} else {
			// Play audio logic would go here
			try {
				const audio = new Audio(currentExercise.audioUrl);
				audio.onended = () => setAudioPlaying(false);
				audio.onerror = () => setAudioPlaying(false);
				setAudioPlaying(true);
				audio.play().catch(() => setAudioPlaying(false));
			} catch (error) {
				setAudioPlaying(false);
			}
		}
	};

	return (
		<div className={`space-y-3 ${className || ""}`}>
			{/* Hint section */}
			{showHint && hasHint && hintVisible && (
				<Card className="border-amber-200 bg-amber-50 p-4">
					<div className="flex items-start space-x-3">
						<Lightbulb className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" />
						<div>
							<h4 className="mb-1 font-medium text-amber-800">Hint</h4>
							<p className="text-amber-700 text-sm">{currentExercise.prompt}</p>
						</div>
					</div>
				</Card>
			)}

			{/* Translation section */}
			{showTranslation && hasTranslation && translationVisible && (
				<Card className="border-blue-200 bg-blue-50 p-4">
					<div className="flex items-start space-x-3">
						<Languages className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
						<div>
							<h4 className="mb-1 font-medium text-blue-800">Translation</h4>
							<p className="text-blue-700 text-sm">
								{currentExercise.englishTranslation}
							</p>
						</div>
					</div>
				</Card>
			)}

			{/* Audio controls */}
		</div>
	);
}
