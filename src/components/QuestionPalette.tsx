import { useMemo } from "react";
import { Flag } from "lucide-react";
import type { AnswerKey } from "../types";

interface QuestionPaletteProps {
  total: number;
  currentIndex: number;
  answers: Record<number, AnswerKey | null>;
  flagged: Set<number>;
  questionIds: number[];
  onGoTo: (index: number) => void;
  large?: boolean;
}

export function QuestionPalette({
  total,
  currentIndex,
  answers,
  flagged,
  questionIds,
  onGoTo,
  large,
}: QuestionPaletteProps) {
  const answeredCount = useMemo(
    () => questionIds.filter((id) => answers[id] != null).length,
    [questionIds, answers]
  );

  const flaggedCount = useMemo(
    () => questionIds.filter((id) => flagged.has(id)).length,
    [questionIds, flagged]
  );

  const cols = large ? (total > 100 ? 10 : 5) : (total > 100 ? 12 : 5);

  return (
    <div className={`bg-base-100 border border-base-300 rounded-box shadow-sm ${large ? "p-4" : "p-1.5"}`}>
      <div className={`flex items-center justify-between gap-2 ${large ? "mb-3" : "mb-2"}`}>
        <span className={`font-semibold ${large ? "text-sm" : "text-xs"}`}>Câu hỏi</span>
        <span className={`text-base-content/40 tabular-nums ${large ? "text-xs" : "text-[11px]"}`}>
          {answeredCount}/{total} &middot; {flaggedCount} <Flag size={large ? 11 : 10} className="inline" />
        </span>
      </div>
      <div className={large ? "gap-1.5" : "gap-1"} style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: total }, (_, i) => {
          const isCurrent = i === currentIndex;
          const qId = questionIds[i];
          const isAnswered = answers[qId] != null;
          const isFlagged = flagged.has(qId);

          let btnClass = "btn-ghost border-base-300";

          if (isCurrent && isAnswered) {
            btnClass = "btn-primary";
          } else if (isCurrent) {
            btnClass = "btn-outline btn-primary";
          } else if (isAnswered) {
            btnClass = "btn-success";
          }

          return (
            <button
              key={i}
              onClick={() => {
                onGoTo(i);
              }}
              title={`Câu ${i + 1}${isFlagged ? " (đã đánh dấu)" : ""}`}
              className={`btn ${btnClass} relative ${large ? "btn-sm min-h-9 h-10 px-0 text-sm" : "btn-xs min-h-5 h-6 px-0 text-[10px]"}`}
            >
              {i + 1}
              {isFlagged && (
                <Flag size={large ? 8 : 6} className={`absolute ${large ? "-top-0.5 -right-0.5" : "-top-px -right-px"} text-warning fill-warning`} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
