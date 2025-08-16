import { useState, useEffect, useMemo } from "react";
import type { DragMatchExercise } from "../../../lib/types";

type Pair = { left: string; right: string };

interface DragMatchProps {
  exercise: DragMatchExercise;
  answer?: string;
  onAnswerChange: (answer: string) => void;
  disabled?: boolean;
}

export function DragMatch({
  exercise,
  answer = "",
  onAnswerChange,
  disabled = false,
}: DragMatchProps) {
  // State for matches and selected left item
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [rightItems, setRightItems] = useState<string[]>([]);
  // Build pairs directly from exercise components (authoring order by orderIndex)
  const pairs: Pair[] = useMemo(() => {
    // exercise.pairs contains components of type MATCH_PAIR
    const sorted = [...exercise.pairs].sort(
      (a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0)
    );
    return sorted
      .filter((c) => c.content && c.pairWith)
      .map((c) => ({ left: c.content, right: c.pairWith! }));
  }, [exercise.pairs]);

  // Left items in authoring order (used for emitting answers)
  const leftItemsAuthoring = pairs.map((p) => p.left);

  // Shuffle left items once per exercise for display only
  const [leftItemsDisplay, setLeftItemsDisplay] = useState<string[]>([]);
  useEffect(() => {
    const shuffledLeft = pairs
      .map((p) => p.left)
      .sort(() => Math.random() - 0.5);
    setLeftItemsDisplay(shuffledLeft);
  }, [pairs]);

  // Shuffle right items once on mount

  useEffect(() => {
    const shuffled = pairs.map((p) => p.right).sort(() => Math.random() - 0.5);
    setRightItems(shuffled);
  }, [pairs]);

  // Hydrate matches from incoming answer string
  useEffect(() => {
    if (!answer) {
      setMatches({});
      return;
    }
    const parsed = Object.fromEntries(
      answer
        .split(/[|,]/)
        .map((s) => s.trim())
        .filter(Boolean)
        .map((pair) => {
          const [l, r] = pair.split(":").map((s) => s.trim());
          return [l, r] as const;
        })
    );
    setMatches(parsed);
  }, [answer]);

  const emitAnswer = (newMatches: Record<string, string>) => {
    // Emit in authoring (leftItems) order; use a stable separator
    const formatted = leftItemsAuthoring
      .filter((l) => newMatches[l])
      .map((l) => `${l}:${newMatches[l]}`)
      .join(", ");
    onAnswerChange(formatted);
  };

  const handleLeftClick = (left: string) => {
    if (disabled) return;
    setSelectedLeft((prev) => (prev === left ? null : left));
  };

  const handleRightClick = (right: string) => {
    if (disabled || !selectedLeft) return;

    setMatches((prev) => {
      // Remove any previous match that has this right item
      const newMatches = Object.fromEntries(
        Object.entries(prev).filter(([_, val]) => val !== right)
      ) as Record<string, string>;

      // Set the new match
      newMatches[selectedLeft] = right;

      // Emit formatted answer in authoring order
      emitAnswer(newMatches);

      return newMatches;
    });

    setSelectedLeft(null);
  };

  const handleClear = () => {
    if (disabled) return;
    setMatches({});
    setSelectedLeft(null);
    onAnswerChange("");
  };

  return (
    <div className="space-y-6">
      {exercise.prompt && (
        <p className="text-center font-medium text-lg">{exercise.prompt}</p>
      )}

      <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8">
        {/* Left column */}
        <div className="space-y-3">
          <h4 className="text-center font-medium">Match these</h4>
          {leftItemsDisplay.map((left) => (
            <div
              key={left}
              className={`cursor-pointer p-3 rounded border transition-colors
                ${
                  selectedLeft === left
                    ? "bg-primary/10 ring-2 ring-primary"
                    : ""
                }
                ${
                  matches[left]
                    ? "border-green-400 bg-green-50"
                    : "border-gray-300"
                }
                ${disabled ? "cursor-not-allowed opacity-50" : ""}
              `}
              onClick={() => handleLeftClick(left)}
            >
              <p className="text-center font-medium">{left}</p>
              {matches[left] && (
                <p className="mt-1 text-center text-green-600 text-sm">
                  → {matches[left]}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Right column */}
        <div className="space-y-3">
          <h4 className="text-center font-medium">With these</h4>
          {rightItems.map((right) => {
            const matched = Object.values(matches).includes(right);
            return (
              <div
                key={right}
                className={`cursor-pointer p-3 rounded border transition-colors
                  ${
                    matched
                      ? "border-green-400 bg-green-50"
                      : "border-gray-300 hover:bg-accent"
                  }
                  ${disabled ? "cursor-not-allowed opacity-50" : ""}
                `}
                onClick={() => handleRightClick(right)}
              >
                <p className="text-center font-medium">{right}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="space-y-2 text-center">
        {selectedLeft ? (
          <p className="text-primary text-sm">
            Selected "{selectedLeft}" - now click an item on the right to match
          </p>
        ) : (
          <p className="text-muted-foreground text-sm">
            Click an item on the left, then click its match on the right
          </p>
        )}
      </div>

      {Object.keys(matches).length > 0 && (
        <div className="flex justify-center">
          <button
            className="btn btn-outline"
            onClick={handleClear}
            disabled={disabled}
          >
            Clear All Matches
          </button>
        </div>
      )}
    </div>
  );
}
