import { useMemo, useCallback, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  CaretLeft,
  CaretRight,
  CheckCircle,
  Play,
  Pause,
  Square,
  Sun,
  Moon,
  Clock,
  SquaresFour,
  SignOut,
  Warning,
} from "@phosphor-icons/react";
import { Button, Modal, AlertDialog, useOverlayState } from "@heroui/react";
import questions from "../data/questions";
import { useExam } from "../hooks/useExam";
import { useTimer } from "../hooks/useTimer";
import { useQuestionSelector } from "../hooks/useQuestionSelector";
import { QuestionCard } from "../components/QuestionCard";
import { QuestionPalette } from "../components/QuestionPalette";
import { PassageView } from "../components/PassageView";
import { successButtonStyle, warningButtonStyle } from "../components/buttonStyles";
import { useSpeech } from "../hooks/useSpeech";
import { useTheme } from "../context/ThemeContext";
import type { AnswerKey, AnswerSelection } from "../types";

function ReadAloudInline({ text }: { text: string }) {
  const { speak, pause, resume, cancel, speaking, paused, supported } = useSpeech();
  if (!supported) return null;
  return (
    <div className="rounded-xl border border-border bg-surface p-3.5 mb-4 shadow-surface">
      <div className="flex justify-center">
        {!speaking ? (
          <Button
            variant="outline"
            size="sm"
            className="rounded-md"
            onPress={() => speak(text)}
          >
            <Play weight="bold" size={15} /> Phát
          </Button>
        ) : (
          <div className="flex gap-2">
            {paused ? (
              <Button variant="outline" size="sm" className="rounded-md" onPress={resume}>
                <Play weight="bold" size={15} /> Tiếp tục
              </Button>
            ) : (
              <Button variant="outline" size="sm" className="rounded-md" onPress={pause}>
                <Pause weight="bold" size={15} /> Tạm dừng
              </Button>
            )}
            <Button variant="danger" size="sm" className="rounded-md" onPress={cancel}>
              <Square weight="bold" size={15} /> Dừng
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

const LISTENING_TIME = 45 * 60;
const READING_TIME = 75 * 60;
const FULL_TIME = 120 * 60;

export function Exam() {
  const { section } = useParams<{ section: string }>();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const paletteState = useOverlayState();
  const [submitOpen, setSubmitOpen] = useState(false);
  const [exitOpen, setExitOpen] = useState(false);
  const [checkedQuestions, setCheckedQuestions] = useState<Set<number>>(new Set());

  const typedSection = (section === "listening" || section === "reading" || section === "full")
    ? section
    : "full";

  const shuffledQuestions = useQuestionSelector(questions, typedSection);

  const isListening = typedSection === "listening";

  const timeLimit = useMemo(() => {
    if (typedSection === "listening") return LISTENING_TIME;
    if (typedSection === "reading") return READING_TIME;
    return FULL_TIME;
  }, [typedSection]);

  const exam = useExam(shuffledQuestions.length);

  const computeScore = useCallback(
    (answers: Record<number, AnswerSelection>) => {
      let score = 0;
      let total = 0;
      for (const q of shuffledQuestions) {
        const points = q.blanks ? q.blanks.length : 1;
        total += points;
        const userAnswer = answers[q.id];
        if (!userAnswer) continue;
        if (Array.isArray(userAnswer)) {
          score += q.blanks
            ? q.blanks.filter((b, i) => userAnswer[i] === b.answer).length
            : 0;
        } else if (userAnswer === q.answer) {
          score += 1;
        }
      }
      return { score, total };
    },
    [shuffledQuestions]
  );

  const timer = useTimer(timeLimit, () => {
    if (exam.isSubmitted) return;
    const { score, total } = computeScore(exam.answers);
    navigate("/result", {
      state: {
        section: typedSection,
        score,
        total,
        answers: exam.answers,
        questions: shuffledQuestions,
        timeSpent: timeLimit,
      },
    });
  });

  const timerStarted = useRef(false);
  useEffect(() => {
    if (!timerStarted.current && shuffledQuestions.length > 0) {
      timerStarted.current = true;
      timer.start();
    }
  }, [shuffledQuestions.length, timer]);

  const currentQuestion = shuffledQuestions[exam.currentIndex];
  const hasPassage =
    currentQuestion?.passageBody != null ||
    (currentQuestion?.part != null && currentQuestion.part >= 6 && currentQuestion.passage != null);
  const isPart6 = currentQuestion?.part === 6;

  const currentAnswer = currentQuestion ? exam.answers[currentQuestion.id] : undefined;
  const isArrayAnswer = Array.isArray(currentAnswer);

  const showAudio = isListening || (typedSection === "full" && currentQuestion != null && currentQuestion.part <= 4);

  const { cancel } = useSpeech();

  useEffect(() => {
    cancel();
  }, [cancel, currentQuestion?.id, exam.isSubmitted]);

  useEffect(() => {
    if (exam.isSubmitted) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [exam.isSubmitted]);

  useEffect(() => {
    const baseTitle = "TOEIC";
    if (exam.isSubmitted || !timer.isRunning || timer.timeRemaining >= 600) {
      document.title = baseTitle;
      return;
    }
    document.title = `${timer.formatted} · ${baseTitle}`;
    return () => {
      document.title = baseTitle;
    };
  }, [timer.formatted, timer.timeRemaining, timer.isRunning, exam.isSubmitted]);

  const handleSelect = useCallback(
    (answer: AnswerKey) => {
      if (exam.isSubmitted || !currentQuestion || currentQuestion.blanks) return;
      exam.setAnswer(currentQuestion.id, answer);
    },
    [currentQuestion, exam]
  );

  const handleSelectBlank = useCallback(
    (blankIndex: number, answer: AnswerKey) => {
      if (exam.isSubmitted || !currentQuestion || !currentQuestion.blanks) return;
      exam.setBlankAnswer(currentQuestion.id, blankIndex, answer);
    },
    [currentQuestion, exam]
  );

  const handleClearAnswer = useCallback(() => {
    if (!currentQuestion || exam.isSubmitted) return;
    exam.setAnswer(currentQuestion.id, null);
  }, [currentQuestion, exam]);

  const isQuestionAnswered = useCallback(
    (q: (typeof currentQuestion)) => {
      if (!q) return false;
      const entry = exam.answers[q.id];
      if (entry == null) return false;
      return Array.isArray(entry) ? entry.every((a) => a != null) : true;
    },
    [exam.answers]
  );

  const unansweredCount = useMemo(
    () => shuffledQuestions.filter((q) => !isQuestionAnswered(q)).length,
    [shuffledQuestions, isQuestionAnswered]
  );

  const firstUnansweredIndex = useMemo(
    () => shuffledQuestions.findIndex((q) => !isQuestionAnswered(q)),
    [shuffledQuestions, isQuestionAnswered]
  );

  const handleCheck = useCallback(() => {
    if (!currentQuestion || exam.isSubmitted) return;
    if (!exam.answers[currentQuestion.id]) return;
    setCheckedQuestions(prev => {
      const next = new Set(prev);
      next.add(currentQuestion.id);
      return next;
    });
  }, [currentQuestion, exam.isSubmitted, exam.answers]);

  const handleSubmit = useCallback(() => {
    setSubmitOpen(true);
  }, []);

  const confirmSubmit = useCallback(() => {
    timer.pause();
    const { score, total } = computeScore(exam.answers);
    navigate("/result", {
      state: {
        section: typedSection,
        score,
        total,
        answers: exam.answers,
        questions: shuffledQuestions,
        timeSpent: timeLimit - timer.timeRemaining,
      },
    });
  }, [computeScore, shuffledQuestions, exam.answers, typedSection, navigate, timeLimit, timer]);

  const timeWarning = timer.timeRemaining < 300;

  if (shuffledQuestions.length === 0) {
    return <div className="p-10 text-center">Đang tải câu hỏi...</div>;
  }

  if (!currentQuestion) {
    return <div className="p-10 text-center">Không tìm thấy câu hỏi.</div>;
  }

  return (
    <div className="h-dvh flex flex-col overflow-hidden">
      <header className="z-10 flex shrink-0 items-center justify-between gap-2 border-b border-border bg-surface px-3 py-2 shadow-xs">
        <button
          onClick={() => setExitOpen(true)}
          className="font-serif text-lg font-semibold tracking-tight text-accent hover:opacity-80 cursor-pointer"
        >
          TOEIC
        </button>

        <div className="flex items-center gap-1.5 rounded-full border border-border bg-surface-secondary px-3 py-1 font-mono text-sm font-semibold tracking-wider tabular-nums">
          <Clock size={14} className={timeWarning ? "text-danger" : "text-muted"} />
          <span className={timeWarning ? "text-danger" : ""}>{timer.formatted}</span>
        </div>

        <div className="flex items-center gap-1">
          <Button size="sm" variant="primary" onPress={handleSubmit} className="rounded-lg">
            <CheckCircle size={14} /> <span className="hidden sm:inline ml-0.5">Nộp bài</span>
          </Button>
          <Button size="sm" variant="ghost" onPress={() => setExitOpen(true)} className="rounded-lg">
            <SignOut size={14} /> <span className="hidden sm:inline ml-0.5">Thoát</span>
          </Button>
          <span title={theme === "dark" ? "Chế độ sáng" : "Chế độ tối"}>
            <Button
              isIconOnly
              size="sm"
              variant="ghost"
              onPress={toggleTheme}
              className="rounded-lg text-muted hover:text-foreground"
              aria-label="Chuyển chế độ sáng tối"
            >
              {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            </Button>
          </span>
        </div>
      </header>

      <div className="flex flex-1 p-3 gap-3 max-w-[1200px] w-full mx-auto overflow-hidden">
        <div className="flex-1 min-w-0 overflow-y-auto pb-24 lg:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {hasPassage && !isPart6 && currentQuestion.passageBody && (
            <PassageView
              title={currentQuestion.passageTitle}
              body={currentQuestion.passageBody}
              isListening={showAudio}
            />
          )}

          {isPart6 && currentQuestion.passage && (
            <PassageView
              title={currentQuestion.passageTitle}
              body={currentQuestion.passage}
              isListening={showAudio}
            />
          )}

          {currentQuestion.part === 1 && currentQuestion.passage && !currentQuestion.passageBody && (
            <PassageView
              body={currentQuestion.passage}
              isListening={showAudio}
            />
          )}

          {currentQuestion.part >= 3 && currentQuestion.part <= 4 && currentQuestion.passage && !currentQuestion.passageBody && (
            <PassageView
              body={currentQuestion.passage}
              isListening={showAudio}
            />
          )}

          {showAudio && currentQuestion.part === 2 && (
            <ReadAloudInline text={currentQuestion.passage || currentQuestion.question} />
          )}

          <QuestionCard
            question={currentQuestion}
            selectedAnswer={isArrayAnswer ? undefined : (currentAnswer ?? null)}
            onSelect={handleSelect}
            showResult={checkedQuestions.has(currentQuestion.id)}
            correctAnswer={checkedQuestions.has(currentQuestion.id) ? currentQuestion.answer : undefined}
            hidePassage={showAudio || hasPassage}
            flagged={exam.flagged.has(currentQuestion.id)}
            onToggleFlag={() => exam.toggleFlag(currentQuestion.id)}
            onClearAnswer={handleClearAnswer}
            questionNumber={exam.currentIndex + 1}
            partLabel={`Phần ${currentQuestion.part}`}
            blankAnswers={isArrayAnswer ? currentAnswer : []}
            onSelectBlank={handleSelectBlank}
          />

          {/* Desktop inline nav */}
          <div className="hidden lg:flex justify-between mt-4">
            <Button
              variant="outline"
              isDisabled={exam.currentIndex === 0}
              onPress={exam.goPrev}
              className="rounded-lg"
            >
              <CaretLeft size={18} /> Trước
            </Button>

            <div className="flex gap-2">
              {exam.answers[currentQuestion.id] && !checkedQuestions.has(currentQuestion.id) && (
                <Button
                  variant="primary"
                  style={warningButtonStyle}
                  onPress={handleCheck}
                  className="rounded-lg"
                >
                  <CheckCircle size={18} /> Kiểm tra
                </Button>
              )}

              {exam.currentIndex === exam.totalQuestions - 1 ? (
                <Button
                  variant="primary"
                  style={successButtonStyle}
                  onPress={handleSubmit}
                  className="rounded-lg"
                >
                  <CheckCircle size={18} /> Nộp bài
                </Button>
              ) : (
                <Button variant="primary" onPress={exam.goNext} className="rounded-lg">
                  Tiếp theo <CaretRight size={18} />
                </Button>
              )}
            </div>
          </div>

          {/* Mobile fixed bottom nav */}
          <div className="fixed bottom-0 left-0 right-0 z-20 flex items-center gap-1 border-t border-border bg-surface px-2 py-1.5 shadow-lg lg:hidden">
            <Button
              size="sm"
              variant="outline"
              isDisabled={exam.currentIndex === 0}
              onPress={exam.goPrev}
              className="flex-1 min-w-0 rounded-lg px-2"
            >
              <CaretLeft size={14} /> <span className="hidden xs:inline ml-0.5">Trước</span>
            </Button>

            {exam.answers[currentQuestion.id] && !checkedQuestions.has(currentQuestion.id) ? (
              <Button
                size="sm"
                variant="primary"
                style={warningButtonStyle}
                onPress={handleCheck}
                className="flex-1 min-w-0 rounded-lg px-2"
              >
                <CheckCircle size={14} /> <span className="hidden xs:inline ml-0.5">Kiểm tra</span>
              </Button>
            ) : null}

            {exam.currentIndex === exam.totalQuestions - 1 ? (
              <Button
                size="sm"
                variant="primary"
                style={successButtonStyle}
                onPress={handleSubmit}
                className="flex-1 min-w-0 rounded-lg px-2"
              >
                <span className="hidden xs:inline">Nộp</span> <CheckCircle size={14} />
              </Button>
            ) : (
              <Button
                size="sm"
                variant="primary"
                onPress={exam.goNext}
                className="flex-1 min-w-0 rounded-lg px-2"
              >
                <span className="hidden xs:inline">Tiếp</span> <CaretRight size={14} />
              </Button>
            )}

            <span title="Danh sách câu hỏi">
              <Button
                isIconOnly
                size="sm"
                variant="ghost"
                onPress={paletteState.open}
                className="shrink-0 rounded-lg"
                aria-label="Danh sách câu hỏi"
              >
                <SquaresFour size={14} />
              </Button>
            </span>
          </div>
        </div>

        <div className="w-[340px] flex-shrink-0 self-stretch overflow-y-auto hidden lg:block [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="min-h-full">
            <QuestionPalette
              total={exam.totalQuestions}
              currentIndex={exam.currentIndex}
              answers={exam.answers}
              flagged={exam.flagged}
              questionIds={shuffledQuestions.map((q) => q.id)}
              onGoTo={exam.goTo}
            />
          </div>
        </div>
      </div>

      {/* Mobile palette modal */}
      <Modal.Root state={paletteState}>
        <Modal.Backdrop>
          <Modal.Container placement="bottom" size="md">
            <Modal.Dialog className="max-h-[85svh]">
              <Modal.Header>
                <Modal.Heading className="w-full text-center">
                  Danh sách câu hỏi
                </Modal.Heading>
                <Modal.CloseTrigger aria-label="Đóng" />
              </Modal.Header>
              <Modal.Body>
                <QuestionPalette
                  total={exam.totalQuestions}
                  currentIndex={exam.currentIndex}
                  answers={exam.answers}
                  flagged={exam.flagged}
                  questionIds={shuffledQuestions.map((q) => q.id)}
                  onGoTo={(i) => {
                    exam.goTo(i);
                    paletteState.close();
                  }}
                  large
                />
              </Modal.Body>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal.Root>

      {/* Submit confirmation */}
      <AlertDialog.Root isOpen={submitOpen} onOpenChange={setSubmitOpen}>
        <AlertDialog.Backdrop>
          <AlertDialog.Container size="sm">
            <AlertDialog.Dialog>
              <AlertDialog.Header>
                <AlertDialog.Icon status="warning">
                  <Warning size={20} weight="bold" />
                </AlertDialog.Icon>
                <AlertDialog.Heading>Nộp bài?</AlertDialog.Heading>
              </AlertDialog.Header>
              <AlertDialog.Body className="flex min-h-16 items-center">
                <p>
                  Bạn có chắc chắn muốn nộp bài
                  {unansweredCount > 0 ? ` (còn ${unansweredCount} câu chưa trả lời)` : ""}?
                </p>
              </AlertDialog.Body>
              <AlertDialog.Footer>
                <Button
                  size="sm"
                  variant="ghost"
                  onPress={() => setSubmitOpen(false)}
                  className="rounded-lg whitespace-nowrap"
                >
                  Huỷ
                </Button>
                {unansweredCount > 0 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onPress={() => {
                      setSubmitOpen(false);
                      if (firstUnansweredIndex >= 0) exam.goTo(firstUnansweredIndex);
                    }}
                    className="rounded-lg whitespace-nowrap"
                  >
                    Đến câu chưa trả lời
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="danger"
                  onPress={confirmSubmit}
                  className="rounded-lg whitespace-nowrap"
                >
                  Nộp bài
                </Button>
              </AlertDialog.Footer>
            </AlertDialog.Dialog>
          </AlertDialog.Container>
        </AlertDialog.Backdrop>
      </AlertDialog.Root>

      {/* Exit confirmation */}
      <AlertDialog.Root isOpen={exitOpen} onOpenChange={setExitOpen}>
        <AlertDialog.Backdrop>
          <AlertDialog.Container size="sm">
            <AlertDialog.Dialog>
              <AlertDialog.Header>
                <AlertDialog.Icon status="warning">
                  <Warning size={20} weight="bold" />
                </AlertDialog.Icon>
                <AlertDialog.Heading>Thoát bài thi?</AlertDialog.Heading>
              </AlertDialog.Header>
              <AlertDialog.Body className="flex min-h-16 items-center">
                Tiến độ làm bài sẽ bị mất. Bạn có chắc chắn muốn thoát?
              </AlertDialog.Body>
              <AlertDialog.Footer>
                <Button
                  variant="ghost"
                  onPress={() => setExitOpen(false)}
                  className="rounded-lg"
                >
                  Huỷ
                </Button>
                <Button variant="danger" onPress={() => navigate("/")} className="rounded-lg">
                  Thoát
                </Button>
              </AlertDialog.Footer>
            </AlertDialog.Dialog>
          </AlertDialog.Container>
        </AlertDialog.Backdrop>
      </AlertDialog.Root>
    </div>
  );
}
