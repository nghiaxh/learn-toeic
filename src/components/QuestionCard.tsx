import { Button } from "@heroui/react";
import type { CSSProperties } from "react";
import { Check, X, Flag, ArrowCounterClockwise } from "@phosphor-icons/react";
import { successButtonStyle } from "./buttonStyles";
import type { Question, AnswerKey } from "../types";

interface QuestionCardProps {
  question: Question;
  selectedAnswer: AnswerKey | null | undefined;
  onSelect: (answer: AnswerKey) => void;
  showResult?: boolean;
  correctAnswer?: AnswerKey;
  hidePassage?: boolean;
  flagged?: boolean;
  onToggleFlag?: () => void;
  onClearAnswer?: () => void;
}

const ALL_KEYS: AnswerKey[] = ["A", "B", "C", "D"];

export function QuestionCard({
  question,
  selectedAnswer,
  onSelect,
  showResult,
  correctAnswer,
  hidePassage,
  flagged,
  onToggleFlag,
  onClearAnswer,
}: QuestionCardProps) {
  return (
    <div>
      {question.passage && !hidePassage && (
        <div className="rounded-xl border border-border bg-surface p-3.5 mb-4 whitespace-pre-wrap leading-relaxed text-sm shadow-surface">
          {question.passage}
        </div>
      )}

      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="text-base leading-relaxed font-medium">
          Câu {question.id}: {question.question}
        </h3>
        {!showResult && onToggleFlag && (
          <span title={flagged ? "Bỏ đánh dấu" : "Đánh dấu câu này"}>
            <Button
              isIconOnly
              size="sm"
              variant="ghost"
              className={`shrink-0 ${flagged ? "text-warning" : "text-muted"}`}
              aria-label={flagged ? "Bỏ đánh dấu" : "Đánh dấu câu này"}
              onPress={onToggleFlag}
            >
              <Flag size={15} weight={flagged ? "fill" : "regular"} />
            </Button>
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        {question.options.map((opt, idx) => {
          const key = ALL_KEYS[idx];
          const isSelected = selectedAnswer === key;
          const isCorrect = showResult && key === correctAnswer;
          const isWrong = showResult && isSelected && key !== correctAnswer;

          let variant: "outline" | "primary" | "danger" = "outline";
          let style: CSSProperties | undefined;
          let badgeClass = "bg-surface-secondary text-muted";

          if (isCorrect) {
            variant = "primary";
            style = successButtonStyle;
            badgeClass = "bg-black/10 text-current";
          } else if (isWrong) {
            variant = "danger";
            badgeClass = "bg-white/15 text-current";
          } else if (isSelected) {
            variant = "primary";
            badgeClass = "bg-white/15 text-current";
          }

          return (
            <Button
              key={key}
              variant={variant}
              style={style}
              isDisabled={showResult}
              onPress={() => !showResult && onSelect(key)}
              className="justify-start w-full h-auto min-h-10 py-2.5 px-3 text-sm font-normal rounded-lg disabled:opacity-100"
            >
              <span
                className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs shrink-0 ${badgeClass}`}
              >
                {key}
              </span>
              <span className="flex-1 text-left">{opt}</span>
              {isCorrect && (
                <span className="text-success-foreground font-semibold text-xs flex items-center gap-1">
                  <Check weight="bold" size={14} /> Đúng
                </span>
              )}
              {isWrong && (
                <span className="text-white font-semibold text-xs flex items-center gap-1">
                  <X weight="bold" size={14} /> Câu của bạn
                </span>
              )}
            </Button>
          );
        })}
      </div>

      {!showResult && selectedAnswer && onClearAnswer && (
        <Button
          variant="ghost"
          size="sm"
          className="text-muted hover:text-foreground mt-1"
          onPress={onClearAnswer}
        >
          <ArrowCounterClockwise size={13} /> Xoá
        </Button>
      )}
    </div>
  );
}
