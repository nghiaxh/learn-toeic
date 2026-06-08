import { Check, X, Flag, RotateCcw } from "lucide-react";
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
        <div className="bg-base-100 border border-base-300 rounded-box p-3 mb-4 whitespace-pre-wrap leading-relaxed text-sm shadow-sm">
          {question.passage}
        </div>
      )}

      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="text-base leading-relaxed font-medium">
          Câu {question.id}: {question.question}
        </h3>
        {!showResult && onToggleFlag && (
          <button
            onClick={onToggleFlag}
            title={flagged ? "Bỏ đánh dấu" : "Đánh dấu câu này"}
            className={`btn btn-ghost btn-square btn-xs shrink-0 ${flagged ? "text-warning" : "text-base-content/40"}`}
          >
            <Flag size={14} className={flagged ? "fill-warning" : ""} />
          </button>
        )}
      </div>

      <div>
        {question.options.map((opt, idx) => {
          const key = ALL_KEYS[idx];
          const isSelected = selectedAnswer === key;
          const isCorrect = showResult && key === correctAnswer;
          const isWrong = showResult && isSelected && key !== correctAnswer;

          let btnClass = "btn-outline btn-ghost";
          let circleClass = "bg-base-300 text-base-content/60";

          if (isCorrect) {
            btnClass = "btn-success";
            circleClass = "bg-success text-white";
          } else if (isWrong) {
            btnClass = "btn-error";
            circleClass = "bg-error text-white";
          } else if (isSelected) {
            btnClass = "btn-primary";
            circleClass = "bg-primary text-white";
          }

          return (
            <button
              key={key}
              onClick={() => !showResult && onSelect(key)}
              disabled={showResult}
              className={`btn ${btnClass} w-full justify-start gap-2 mb-1.5 h-auto min-h-[36px] px-3 py-1.5 text-sm font-normal ${
                showResult ? "cursor-default" : ""
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${circleClass}`}
              >
                {key}
              </span>
              <span className="flex-1 text-left">{opt}</span>
              {isCorrect && (
                <span className="text-success font-bold text-xs flex items-center gap-1">
                  <Check size={14} /> Đúng
                </span>
              )}
              {isWrong && (
                <span className="text-error font-bold text-xs flex items-center gap-1">
                  <X size={14} /> Câu của bạn
                </span>
              )}
            </button>
          );
        })}
      </div>

      {!showResult && selectedAnswer && onClearAnswer && (
        <button
          onClick={onClearAnswer}
          className="btn btn-ghost btn-xs text-base-content/50 hover:text-base-content mt-1"
        >
          <RotateCcw size={12} /> Xoá
        </button>
      )}
    </div>
  );
}
