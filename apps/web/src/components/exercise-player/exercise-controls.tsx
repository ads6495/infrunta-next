import { Check, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
  useExercise,
  useExerciseNavigation,
  useExerciseSubmission,
} from "./exercise-provider";

interface ExerciseControlsProps {
  showSubmitButton?: boolean;
  showNavigationButtons?: boolean;
  allowRetry?: boolean;
  className?: string;
}

export function ExerciseControls({
  showSubmitButton = true,
  showNavigationButtons = true,
  allowRetry = true,
  className,
}: ExerciseControlsProps) {
  const { currentAnswer, retryExercise } = useExercise();
  const { hasSubmitted, isCorrect, submitAnswer } = useExerciseSubmission();
  const {
    nextExercise,
    previousExercise,
    canGoNext,
    canGoPrevious,
    isSessionCompleted,
  } = useExerciseNavigation();

  const handleSubmit = () => {
    if (!hasSubmitted) {
      submitAnswer();
    } else if (isCorrect || isSessionCompleted) {
      // Move to next exercise if correct or session is completed
      nextExercise();
    }
  };

  const handleRetry = () => {
    retryExercise();
  };

  const canSubmit = currentAnswer.trim().length > 0 && !hasSubmitted;
  const canContinue = hasSubmitted && (isCorrect || isSessionCompleted);

  return (
    <Card className={`p-4 ${className || ""}`}>
      <div className="flex items-center justify-between">
        {/* Previous button */}
        {showNavigationButtons && (
          <Button
            variant="outline"
            onClick={previousExercise}
            disabled={!canGoPrevious}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
        )}

        {/* Center content */}
        <div className="flex items-center space-x-3">
          {/* Submit/Continue button */}
          {showSubmitButton && (
            <Button
              size="lg"
              onClick={handleSubmit}
              disabled={!canSubmit && !canContinue}
              variant={canContinue ? "default" : "outline"}
            >
              {!hasSubmitted ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Check Answer
                </>
              ) : canContinue ? (
                <>
                  Continue
                  <ChevronRight className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Check Answer
                </>
              )}
            </Button>
          )}

          {/* Retry button */}
          {allowRetry && hasSubmitted && !isCorrect && (
            <Button variant="outline" onClick={handleRetry} size="sm">
              <RotateCcw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          )}
        </div>

        {/* Next button */}
        {showNavigationButtons && (
          <Button
            onClick={nextExercise}
            disabled={!canGoNext || (!hasSubmitted && !isSessionCompleted)}
          >
            {isSessionCompleted ? "Complete" : "Next"}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Feedback section */}
      {hasSubmitted && (
        <div className="mt-3 text-center">
          {isCorrect === true && (
            <p className="font-medium text-green-600">✅ Correct! Great job!</p>
          )}
          {isCorrect === false && (
            <p className="font-medium text-red-600">
              ❌ Not quite right. {allowRetry ? "Try again!" : "Keep going!"}
            </p>
          )}
        </div>
      )}

      {/* Answer preview */}
      {!hasSubmitted && currentAnswer && (
        <div className="mt-3 text-center text-muted-foreground text-sm">
          Your answer: <span className="font-medium">{currentAnswer}</span>
        </div>
      )}
    </Card>
  );
}
