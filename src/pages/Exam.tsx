import { useMemo, useCallback, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, CheckCircle, Play, Pause, Square, Sun, Moon, Clock, Grid3X3, LogOut } from "lucide-react";
import questions from "../data/questions";
import { useExam } from "../hooks/useExam";
import { useTimer } from "../hooks/useTimer";
import { useQuestionSelector } from "../hooks/useQuestionSelector";
import { QuestionCard } from "../components/QuestionCard";
import { QuestionPalette } from "../components/QuestionPalette";
import { PassageView } from "../components/PassageView";
import { useSpeech } from "../hooks/useSpeech";
import { useTheme } from "../context/ThemeContext";

function ReadAloudInline({ text }: { text: string }) {
  const { speak, pause, resume, cancel, speaking, paused, supported } = useSpeech();
  if (!supported) return null;
  return (
    <div className="bg-base-100 border border-base-300 rounded-box p-3 mb-4 shadow-sm">
      <div className="flex justify-center">
        {!speaking ? (
          <button
            onClick={() => speak(text)}
            title="Đọc to"
            className="btn btn-outline btn-primary btn-md"
          >
            <Play size={18} /> Phát
          </button>
        ) : (
          <div className="flex gap-2">
            {paused ? (
              <button onClick={resume} className="btn btn-outline btn-primary btn-md">
                <Play size={18} /> Tiếp tục
              </button>
            ) : (
              <button onClick={pause} className="btn btn-outline btn-warning btn-md">
                <Pause size={18} /> Tạm dừng
              </button>
            )}
            <button onClick={cancel} className="btn btn-outline btn-error btn-md">
              <Square size={18} /> Dừng
            </button>
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
  const [paletteOpen, setPaletteOpen] = useState(false);
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

  const timer = useTimer(timeLimit, () => {
    if (exam.isSubmitted) return;
    const score = shuffledQuestions.reduce((acc, q) => {
      const userAnswer = exam.answers[q.id];
      if (!userAnswer) return acc;
      if (q.blanks) {
        return acc + q.blanks.filter((b) => b.answer === userAnswer).length;
      }
      return acc + (userAnswer === q.answer ? 1 : 0);
    }, 0);
    const total = shuffledQuestions.reduce(
      (acc, q) => acc + (q.blanks ? q.blanks.length : 1),
      0
    );
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

  const showAudio = isListening || (typedSection === "full" && currentQuestion != null && currentQuestion.part <= 4);

  const handleSelect = useCallback(
    (answer: string) => {
      if (exam.isSubmitted || !currentQuestion) return;
      exam.setAnswer(currentQuestion.id, answer as "A" | "B" | "C" | "D");
    },
    [currentQuestion, exam]
  );

  const handleClearAnswer = useCallback(() => {
    if (!currentQuestion || exam.isSubmitted) return;
    exam.setAnswer(currentQuestion.id, null);
  }, [currentQuestion, exam.isSubmitted, exam]);

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
    if (!window.confirm("Bạn có chắc chắn muốn nộp bài?")) return;
    timer.pause();
    const score = shuffledQuestions.reduce((acc, q) => {
      const userAnswer = exam.answers[q.id];
      if (!userAnswer) return acc;
      if (q.blanks) {
        return acc + q.blanks.filter((b) => b.answer === userAnswer).length;
      }
      return acc + (userAnswer === q.answer ? 1 : 0);
    }, 0);
    const total = shuffledQuestions.reduce(
      (acc, q) => acc + (q.blanks ? q.blanks.length : 1),
      0
    );
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
  }, [shuffledQuestions, exam.answers, typedSection, navigate, timeLimit, timer.timeRemaining]);

  const timeWarning = timer.timeRemaining < 300;

  if (shuffledQuestions.length === 0) {
    return <div className="p-10 text-center">Đang tải câu hỏi...</div>;
  }

  if (!currentQuestion) {
    return <div className="p-10 text-center">Không tìm thấy câu hỏi.</div>;
  }

  return (
    <div className="h-dvh flex flex-col overflow-hidden">
      <header className="flex items-center justify-between px-3 py-1.5 border-b border-base-200 bg-base-100 shrink-0 z-10 gap-2 shadow-xs">
        <button onClick={() => navigate("/")} className="font-bold text-sm whitespace-nowrap text-primary hover:opacity-80 cursor-pointer">
          TOEIC
        </button>

        <div className="flex items-center gap-1.5 font-mono text-sm font-bold tracking-wider px-3 py-1 rounded-full border shadow-sm bg-base-100 border-base-300">
          <Clock size={14} className={timeWarning ? "text-error" : "text-base-content/60"} />
          <span className={timeWarning ? "text-error" : ""}>{timer.formatted}</span>
        </div>

        <div className="flex items-center gap-1">
          <button onClick={handleSubmit} className="btn btn-success btn-xs sm:btn-sm" title="Nộp bài">
            <CheckCircle size={14} /> <span className="hidden sm:inline ml-0.5">Nộp bài</span>
          </button>
          <button onClick={() => navigate("/")} className="btn btn-ghost btn-xs sm:btn-sm" title="Thoát">
            <LogOut size={14} /> <span className="hidden sm:inline ml-0.5">Thoát</span>
          </button>
          <button
            onClick={toggleTheme}
            title={theme === "dark" ? "Chế độ sáng" : "Chế độ tối"}
            className="btn btn-ghost btn-square btn-xs text-base-content/50 hover:text-base-content"
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>
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
            selectedAnswer={exam.answers[currentQuestion.id]}
            onSelect={handleSelect}
            showResult={checkedQuestions.has(currentQuestion.id)}
            correctAnswer={checkedQuestions.has(currentQuestion.id) ? currentQuestion.answer : undefined}
            hidePassage={showAudio || hasPassage}
            flagged={exam.flagged.has(currentQuestion.id)}
            onToggleFlag={() => exam.toggleFlag(currentQuestion.id)}
            onClearAnswer={handleClearAnswer}
          />

          <>
              {/* Desktop inline nav */}
              <div className="hidden lg:flex justify-between mt-4">
                <button
                  onClick={exam.goPrev}
                  disabled={exam.currentIndex === 0}
                  className="btn btn-outline"
                >
                  <ChevronLeft size={18} /> Trước
                </button>

                <div className="flex gap-2">
                  {exam.answers[currentQuestion.id] && !checkedQuestions.has(currentQuestion.id) && (
                    <button
                      onClick={handleCheck}
                      className="btn btn-warning"
                    >
                      <CheckCircle size={18} /> Kiểm tra
                    </button>
                  )}

                  {exam.currentIndex === exam.totalQuestions - 1 ? (
                    <button onClick={handleSubmit} className="btn btn-success">
                      <CheckCircle size={18} /> Nộp bài
                    </button>
                  ) : (
                    <button onClick={exam.goNext} className="btn btn-primary">
                      Tiếp theo <ChevronRight size={18} />
                    </button>
                  )}
                </div>
              </div>

              {/* Mobile fixed bottom nav */}
              <div className="fixed bottom-0 left-0 right-0 lg:hidden z-20 bg-base-100 border-t border-base-200 px-2 py-1.5 flex items-center gap-1 shadow-lg">
                <button
                  onClick={exam.goPrev}
                  disabled={exam.currentIndex === 0}
                  className="btn btn-outline btn-xs flex-1 min-w-0"
                >
                  <ChevronLeft size={14} /> <span className="hidden xs:inline ml-0.5">Trước</span>
                </button>

                {exam.answers[currentQuestion.id] && !checkedQuestions.has(currentQuestion.id) ? (
                  <button onClick={handleCheck} className="btn btn-warning btn-xs flex-1 min-w-0">
                    <CheckCircle size={14} /> <span className="hidden xs:inline ml-0.5">Kiểm tra</span>
                  </button>
                ) : null}

                {exam.currentIndex === exam.totalQuestions - 1 ? (
                  <button onClick={handleSubmit} className="btn btn-success btn-xs flex-1 min-w-0">
                    <span className="hidden xs:inline">Nộp</span> <CheckCircle size={14} />
                  </button>
                ) : (
                  <button onClick={exam.goNext} className="btn btn-primary btn-xs flex-1 min-w-0">
                    <span className="hidden xs:inline">Tiếp</span> <ChevronRight size={14} />
                  </button>
                )}

                <button
                  onClick={() => setPaletteOpen(true)}
                  className="btn btn-ghost btn-square btn-xs shrink-0"
                  title="Danh sách câu hỏi"
                >
                  <Grid3X3 size={14} />
                </button>
              </div>
            </>
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

        {paletteOpen && (
          <div
            className="fixed inset-0 z-30 flex items-end sm:items-center justify-center bg-black/50"
            onClick={() => setPaletteOpen(false)}
          >
            <div
              className="bg-base-100 w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl max-h-[80vh] overflow-y-auto p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-base">Danh sách câu hỏi</span>
                <button
                  onClick={() => setPaletteOpen(false)}
                  className="btn btn-ghost btn-sm btn-square"
                >
                  ✕
                </button>
              </div>
              <QuestionPalette
                total={exam.totalQuestions}
                currentIndex={exam.currentIndex}
                answers={exam.answers}
                flagged={exam.flagged}
                questionIds={shuffledQuestions.map((q) => q.id)}
                onGoTo={(i) => { exam.goTo(i); setPaletteOpen(false); }}
                large
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
