import { useMemo } from "react";
import type { Exercise } from "../../lib/types";
import { Card } from "../ui/card";
import {
  AlphabetOverview,
  AudioFillBlank,
  AudioImageMatch,
  AudioTyping,
  ConversationResponse,
  DragMatch,
  FindMistake,
  PronunciationChallenge,
  SpellingBank,
  SyllableAssembly,
  WordOrder,
  WordUsageQuiz,
} from "../exercise-types";

interface ExerciseRendererProps {
  exercise: Exercise;
  answer?: string;
  disabled?: boolean;
  onAnswerChange?: (answer: string) => void;
}

export function ExerciseRenderer({
  exercise,
  answer = "",
  disabled = false,
  onAnswerChange,
}: ExerciseRendererProps) {
  const handleAnswerChange = (answer: string) => {
    onAnswerChange?.(answer);
  };

  const renderExercise = () => {
    const commonProps = {
      answer,
      onAnswerChange: handleAnswerChange,
      disabled,
    };

    switch (exercise.type) {
      case "AUDIO_IMAGE_MATCH":
        return (
          <AudioImageMatch
            exercise={exercise}
            {...commonProps}
            selectedAnswer={answer}
          />
        );

      case "AUDIO_FILL_BLANK":
        return <AudioFillBlank exercise={exercise} {...commonProps} />;

      case "WORD_USAGE_QUIZ":
        return (
          <WordUsageQuiz
            exercise={exercise}
            {...commonProps}
            selectedAnswer={answer}
          />
        );

      case "SPELLING_BANK":
        return <SpellingBank exercise={exercise} {...commonProps} />;

      case "SYLLABLE_ASSEMBLY":
        return <SyllableAssembly exercise={exercise} {...commonProps} />;

      case "DRAG_MATCH":
        return <DragMatch exercise={exercise} {...commonProps} />;

      case "PRONUNCIATION_CHALLENGE":
        return <PronunciationChallenge exercise={exercise} {...commonProps} />;

      case "CONVERSATION_RESPONSE":
        return <ConversationResponse exercise={exercise} {...commonProps} />;

      case "WORD_ORDER":
        return <WordOrder exercise={exercise} {...commonProps} />;

      case "AUDIO_TYPING":
        return <AudioTyping exercise={exercise} {...commonProps} />;

      case "FIND_MISTAKE":
        return <FindMistake exercise={exercise} {...commonProps} />;

      case "ALPHABET_OVERVIEW":
        return <AlphabetOverview exercise={exercise} {...commonProps} />;

      default:
        return (
          <div className="p-8 text-center">
            <h3 className="font-semibold text-lg">Unknown Exercise Type</h3>
            <p className="text-muted-foreground">
              Exercise type "{(exercise as Exercise).type}" is not implemented
              yet.
            </p>
          </div>
        );
    }
  };

  return <Card className="p-6">{renderExercise()}</Card>;
}
