import type { ConversationResponseExercise } from "../../../lib/types";
import { Card } from "../../ui/card";
import { Input } from "../../ui/input";

interface ConversationResponseProps {
	exercise: ConversationResponseExercise;
	answer?: string;
	onAnswerChange: (answer: string) => void;
	disabled?: boolean;
}

export function ConversationResponse({
	exercise,
	answer = "",
	onAnswerChange,
	disabled = false,
}: ConversationResponseProps) {
	const handleInputChange = (value: string) => {
		if (!disabled) {
			onAnswerChange(value);
		}
	};

	const handleOptionSelect = (optionText: string) => {
		if (!disabled) {
			onAnswerChange(optionText);
		}
	};

	const hasOptions = exercise.options && exercise.options.length > 0;

	return (
		<div className="space-y-6">
			{exercise.prompt && (
				<Card className="bg-muted p-4">
					<p className="font-medium text-lg">{exercise.prompt}</p>
				</Card>
			)}

			{hasOptions ? (
				<>
					{/* Multiple Choice Options */}
					<div className="mx-auto max-w-2xl space-y-3">
						<h4 className="text-center font-medium">Choose your response:</h4>
						{exercise.options
							?.sort((a, b) => a.orderIndex - b.orderIndex)
							.map((option) => (
								<Card
									key={option.id}
									className={`cursor-pointer p-4 transition-colors hover:bg-accent${answer === option.text ? "bg-primary/10 ring-2 ring-primary" : ""}
										${disabled ? "cursor-not-allowed opacity-50" : ""}
									`}
									onClick={() => handleOptionSelect(option.text)}
								>
									<p className="font-medium">{option.text}</p>
								</Card>
							))}
					</div>
				</>
			) : (
				<>
					{/* Free Text Response */}
					<div className="mx-auto max-w-2xl space-y-4">
						<h4 className="text-center font-medium">Type your response:</h4>
						<Input
							type="text"
							value={answer}
							onChange={(e) => handleInputChange(e.target.value)}
							placeholder="Enter your response..."
							disabled={disabled}
							className="p-4 text-lg"
						/>
					</div>
				</>
			)}

			<p className="text-center text-muted-foreground text-sm">
				{hasOptions
					? "Select the most appropriate response to the conversation"
					: "Type what you would say in this situation"}
			</p>
		</div>
	);
}
