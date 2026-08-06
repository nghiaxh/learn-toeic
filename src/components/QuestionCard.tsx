import { Button } from "@heroui/react";
import type { CSSProperties } from "react";
import { Check, X, Flag, ArrowCounterClockwise } from "@phosphor-icons/react";
import { successButtonStyle } from "./buttonStyles";
import type { Question, AnswerKey, Blank } from "../types";

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
  questionNumber?: number;
  partLabel?: string;
  blankAnswers?: (AnswerKey | null)[];
  onSelectBlank?: (blankIndex: number, answer: AnswerKey) => void;
}

const ALL_KEYS: AnswerKey[] = ["A", "B", "C", "D"];

interface OptionRowProps {
  keyLabel: AnswerKey;
  text: string;
  isSelected: boolean;
  isCorrect: boolean;
  isWrong: boolean;
  disabled: boolean;
  onPress: () => void;
}

function OptionRow({ keyLabel, text, isSelected, isCorrect, isWrong, disabled, onPress }: OptionRowProps) {
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
      variant={variant}
      style={style}
      isDisabled={disabled}
      onPress={() => !disabled && onPress()}
      className="justify-start w-full h-auto min-h-10 py-2.5 px-3 text-sm font-normal rounded-lg disabled:opacity-100"
    >
      <span
        className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs shrink-0 ${badgeClass}`}
      >
        {keyLabel}
      </span>
      <span className="flex-1 text-left">{text}</span>
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
}

function renderOptionGroup({
  options,
  selection,
  answer,
  disabled,
  onPress,
}: {
  options: string[];
  selection?: AnswerKey | null;
  answer?: AnswerKey;
  disabled: boolean;
  onPress: (key: AnswerKey) => void;
}) {
  return options.map((opt, idx) => {
    const key = ALL_KEYS[idx];
    const isSelected = selection === key;
    const isCorrect = disabled && key === answer;
    const isWrong = disabled && isSelected && key !== answer;
    return (
      <OptionRow
        key={key}
        keyLabel={key}
        text={opt}
        isSelected={isSelected}
        isCorrect={isCorrect}
        isWrong={isWrong}
        disabled={disabled}
        onPress={() => onPress(key)}
      />
    );
  });
}

function renderBlanks({
  blanks,
  blankAnswers,
  showResult,
  onSelectBlank,
}: {
  blanks: Blank[];
  blankAnswers?: (AnswerKey | null)[];
  showResult: boolean;
  onSelectBlank?: (blankIndex: number, answer: AnswerKey) => void;
}) {
  return blanks.map((blank, bi) => (
    <div key={bi} className="rounded-xl border border-border bg-surface p-3.5">
      <p className="text-sm font-medium mb-2.5">Câu {bi + 1}</p>
      <div className="flex flex-col gap-1.5">
        {renderOptionGroup({
          options: blank.options,
          selection: blankAnswers?.[bi],
          answer: blank.answer,
          disabled: showResult,
          onPress: (key) => onSelectBlank?.(bi, key),
        })}
      </div>
    </div>
  ));
}

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
  questionNumber,
  partLabel,
  blankAnswers,
  onSelectBlank,
}: QuestionCardProps) {
  const hasBlanks = question.blanks != null && question.blanks.length > 0;
  const anyAnswered = hasBlanks
    ? (blankAnswers?.some((a) => a != null) ?? false)
    : selectedAnswer != null;
  const displayNumber = questionNumber ?? question.id;

  return (
    <div>
      {question.passage && !hidePassage && !hasBlanks && (
        <div className="rounded-xl border border-border bg-surface p-3.5 mb-4 whitespace-pre-wrap leading-relaxed text-sm shadow-surface">
          {question.passage}
        </div>
      )}

      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="text-base leading-relaxed font-medium">
          <span>Câu {displayNumber}</span>
          {partLabel && (
            <span className="ml-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
              {partLabel}
            </span>
          )}
          {!hasBlanks && <span>: {question.question}</span>}
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

      {hasBlanks ? (
        <div className="flex flex-col gap-3">
          {renderBlanks({ blanks: question.blanks!, blankAnswers, showResult: !!showResult, onSelectBlank })}
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          {renderOptionGroup({
            options: question.options,
            selection: selectedAnswer,
            answer: showResult ? correctAnswer : undefined,
            disabled: !!showResult,
            onPress: onSelect,
          })}
        </div>
      )}

      {!showResult && anyAnswered && onClearAnswer && (
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
