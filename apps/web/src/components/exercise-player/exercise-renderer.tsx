import React from "react";
import type { Exercise } from "../../lib/types";
import { Card } from "../ui/card";
import dynamic from "next/dynamic";

// Dynamic imports for each exercise type to enable code-splitting
const loading = () => (
  <div className="p-6 text-center">Loading…</div>
);

const AlphabetOverview = dynamic(
  () => import("../exercise-types/alphabet-overview").then((m) => m.AlphabetOverview),
  { ssr: false, loading }
);
const AudioFillBlank = dynamic(
  () => import("../exercise-types/audio-fill-blank").then((m) => m.AudioFillBlank),
  { ssr: false, loading }
);
const AudioImageMatch = dynamic(
  () => import("../exercise-types/audio-image-match").then((m) => m.AudioImageMatch),
  { ssr: false, loading }
);
const AudioTyping = dynamic(
  () => import("../exercise-types/audio-typing").then((m) => m.AudioTyping),
  { ssr: false, loading }
);
const ConversationResponse = dynamic(
  () => import("../exercise-types/conversation-response").then((m) => m.ConversationResponse),
  { ssr: false, loading }
);
const DragMatch = dynamic(
  () => import("../exercise-types/drag-match").then((m) => m.DragMatch),
  { ssr: false, loading }
);
const FindMistake = dynamic(
  () => import("../exercise-types/find-mistake").then((m) => m.FindMistake),
  { ssr: false, loading }
);
const PronunciationChallenge = dynamic(
  () => import("../exercise-types/pronunciation-challenge").then((m) => m.PronunciationChallenge),
  { ssr: false, loading }
);
const SpellingBank = dynamic(
  () => import("../exercise-types/spelling-bank").then((m) => m.SpellingBank),
  { ssr: false, loading }
);
const SyllableAssembly = dynamic(
  () => import("../exercise-types/syllable-assembly").then((m) => m.SyllableAssembly),
  { ssr: false, loading }
);
const WordOrder = dynamic(
  () => import("../exercise-types/word-order").then((m) => m.WordOrder),
  { ssr: false, loading }
);
const WordUsageQuiz = dynamic(
  () => import("../exercise-types/word-usage-quiz").then((m) => m.WordUsageQuiz),
  { ssr: false, loading }
);

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
