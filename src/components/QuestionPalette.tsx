import { memo, useMemo } from "react";
import { Flag } from "@phosphor-icons/react";
import type { AnswerSelection } from "../types";

interface QuestionPaletteProps {
  total: number;
  currentIndex: number;
  answers: Record<number, AnswerSelection>;
  flagged: Set<number>;
  questionIds: number[];
  onGoTo: (index: number) => void;
  large?: boolean;
}

function isAnswered(entry: AnswerSelection | undefined): boolean {
  if (entry == null) return false;
  return Array.isArray(entry) ? entry.every((a) => a != null) : true;
}

export const QuestionPalette = memo(function QuestionPalette({
  total,
  currentIndex,
  answers,
  flagged,
  questionIds,
  onGoTo,
  large,
}: QuestionPaletteProps) {
  const answeredCount = useMemo(
    () => questionIds.filter((id) => isAnswered(answers[id])).length,
    [questionIds, answers]
  );

  const flaggedCount = useMemo(
    () => questionIds.filter((id) => flagged.has(id)).length,
    [questionIds, flagged]
  );

  const cols = large ? (total > 100 ? 10 : 8) : total > 100 ? 12 : 5;

  return (
    <div className={`rounded-xl border border-border bg-surface shadow-surface ${large ? "p-4" : "p-2"}`}>
      <div className={`flex items-center justify-between gap-2 ${large ? "mb-3" : "mb-2"}`}>
        <span className={`font-semibold ${large ? "text-sm" : "text-xs"}`}>Câu hỏi</span>
        <span className={`text-muted tabular-nums flex items-center gap-0.5 ${large ? "text-xs" : "text-[11px]"}`}>
          {answeredCount}/{total} · {flaggedCount} <Flag size={large ? 11 : 10} />
        </span>
      </div>
      <div className={large ? "gap-1.5" : "gap-1"} style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: total }, (_, i) => {
          const isCurrent = i === currentIndex;
          const qId = questionIds[i];
          const isAnsweredFlag = isAnswered(answers[qId]);
          const isFlagged = flagged.has(qId);

          let cellClass = "bg-surface-secondary text-muted hover:bg-surface-tertiary";

          if (isCurrent) {
            cellClass = "bg-accent text-accent-foreground hover:bg-accent-hover";
          } else if (isAnsweredFlag) {
            cellClass = "bg-accent-soft text-accent-soft-foreground hover:bg-accent-soft-hover";
          }

          return (
            <button
              key={i}
              type="button"
              onClick={() => onGoTo(i)}
              aria-current={isCurrent ? "true" : undefined}
              title={`Câu ${i + 1}${isFlagged ? " (đã đánh dấu)" : ""}`}
              className={`relative flex items-center justify-center rounded-md font-semibold tabular-nums transition-colors duration-150 cursor-pointer ${large ? "h-9 text-sm" : "h-7 text-xs"} ${cellClass}`}
            >
              {i + 1}
              {isFlagged && (
                <Flag
                  size={large ? 8 : 6}
                  className="absolute -top-px -right-px text-warning"
                  weight="fill"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
});
