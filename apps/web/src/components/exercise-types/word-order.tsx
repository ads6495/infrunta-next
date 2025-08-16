import { useEffect, useState } from "react";
import type { WordOrderExercise } from "../../../lib/types";
import { Button } from "../../ui/button";
import { Card } from "../../ui/card";

interface WordOrderProps {
  exercise: WordOrderExercise;
  answer?: string;
  onAnswerChange: (answer: string) => void;
  disabled?: boolean;
}

export function WordOrder({
  exercise,
  answer = "",
  onAnswerChange,
  disabled = false,
}: WordOrderProps) {
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [usedIndices, setUsedIndices] = useState<Set<number>>(new Set());

  const handleWordClick = (word: string, index: number) => {
    if (disabled || usedIndices.has(index)) return;

    const newSelectedWords = [...selectedWords, word];
    const newUsedIndices = new Set(usedIndices).add(index);

    setSelectedWords(newSelectedWords);
    setUsedIndices(newUsedIndices);
    onAnswerChange(newSelectedWords.join(" "));
  };

  const handleRemoveWord = (wordIndex: number) => {
    if (disabled) return;

    const wordToRemove = selectedWords[wordIndex];
    const newSelectedWords = selectedWords.filter((_, i) => i !== wordIndex);

    // Find the original index of this word to re-enable it
    const originalIndex = exercise.words.findIndex(
      (w, idx) => w.content === wordToRemove && usedIndices.has(idx)
    );

    const newUsedIndices = new Set(usedIndices);
    if (originalIndex !== -1) {
      newUsedIndices.delete(originalIndex);
    }

    setSelectedWords(newSelectedWords);
    setUsedIndices(newUsedIndices);
    onAnswerChange(newSelectedWords.join(" "));
  };

  const handleClear = () => {
    if (disabled) return;

    setSelectedWords([]);
    setUsedIndices(new Set());
    onAnswerChange("");
  };

  // When the upstream answer is reset (e.g., after Try Again), clear local UI state
  useEffect(() => {
    if (answer === "") {
      setSelectedWords([]);
      setUsedIndices(new Set());
    }
  }, [answer]);

  // Shuffle words once per exercise load for display, keep originalIndex for correctness
  const [availableWords, setAvailableWords] = useState<
    { content: string; originalIndex: number }[]
  >([]);

  useEffect(() => {
    const base = (exercise.words ?? []).map((word, index: number) => ({
      content: word.content,
      originalIndex: index,
    }));
    const shuffled = [...base].sort(() => Math.random() - 0.5);
    setAvailableWords(shuffled);
  }, [exercise.words]);

  return (
    <div className="space-y-6">
      {exercise.prompt && (
        <p className="text-center font-medium text-lg">{exercise.prompt}</p>
      )}

      {/* Current Sentence Display */}
      <div className="flex min-h-16 items-center justify-center rounded-lg bg-muted p-4">
        <div className="flex flex-wrap justify-center gap-2">
          {selectedWords.map((word, index) => (
            <Card
              key={index}
              className="cursor-pointer px-3 py-2 transition-colors hover:bg-destructive hover:text-destructive-foreground"
              onClick={() => handleRemoveWord(index)}
            >
              <span className="font-medium">{word}</span>
            </Card>
          ))}
          {selectedWords.length === 0 && (
            <span className="text-muted-foreground">
              Click words to build the sentence
            </span>
          )}
        </div>
      </div>

      {/* Words Bank */}
      <div className="space-y-4">
        <h4 className="text-center font-medium">Available Words</h4>
        <div className="flex flex-wrap justify-center gap-2">
          {availableWords.map((word, index: number) => (
            <Button
              key={index}
              variant="outline"
              size="lg"
              className={`font-medium ${
                usedIndices.has(word.originalIndex) ? "opacity-50" : ""
              }`}
              onClick={() => handleWordClick(word.content, word.originalIndex)}
              disabled={disabled || usedIndices.has(word.originalIndex)}
            >
              {word.content}
            </Button>
          ))}
        </div>
      </div>

      {/* Clear Button */}
      {
        <div className="flex justify-center">
          <Button
            variant="outline"
            disabled={selectedWords.length === 0}
            onClick={handleClear}
          >
            Clear
          </Button>
        </div>
      }

      <p className="text-center text-muted-foreground text-sm">
        Arrange the words in the correct order to form the sentence
      </p>
    </div>
  );
}
