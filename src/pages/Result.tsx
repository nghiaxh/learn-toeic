import { useLocation, useNavigate } from "react-router";
import { useMemo, useState, useEffect } from "react";
import { ArrowUp, House, ArrowCounterClockwise } from "@phosphor-icons/react";
import { Button, Card, Accordion, ProgressBar } from "@heroui/react";
import type { Question, AnswerSelection } from "../types";
import { QuestionCard } from "../components/QuestionCard";
import { useReveal } from "../hooks/useReveal";

interface ResultState {
  section: string;
  score: number;
  total: number;
  answers: Record<number, AnswerSelection>;
  questions: Question[];
  timeSpent: number;
}

function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!visible) return null;
  return (
    <Button
      isIconOnly
      variant="primary"
      onPress={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 z-50 rounded-full shadow-lg"
      aria-label="Cuộn lên đầu trang"
    >
      <ArrowUp size={20} weight="bold" />
    </Button>
  );
}

export function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as ResultState | null;
  const score = state?.score ?? 0;
  const total = state?.total ?? 0;
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const section = state?.section ?? "listening";
  const timeSpent = state?.timeSpent ?? 0;
  const headerRef = useReveal<HTMLDivElement>();
  const scoreRef = useReveal<HTMLDivElement>();

  const estimatedScore = useMemo(() => {
    if (section === "full") return Math.round((score / total) * 990);
    return Math.round((score / total) * 495);
  }, [score, total, section]);

  const minutes = Math.floor(timeSpent / 60);
  const seconds = timeSpent % 60;

  const sectionName =
    section === "listening" ? "Nghe" : section === "reading" ? "Đọc" : "Đầy đủ";

  const pctColor = pct >= 70 ? "text-success" : pct >= 50 ? "text-warning" : "text-danger";
  const progressColor = pct >= 70 ? "success" : pct >= 50 ? "warning" : "danger";

  if (!state) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-24 text-center">
        <p className="text-muted">Không có kết quả. Vui lòng làm bài thi trước.</p>
        <Button variant="primary" onPress={() => navigate("/")} className="mt-5 rounded-lg">
          Trang chủ
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-dvh px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-[820px]">
        <header className="reveal text-center" ref={headerRef}>
          <span className="inline-flex items-center rounded-full border border-border bg-surface px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-muted">
            Kết quả bài thi
          </span>
          <p className="mt-3 text-sm text-muted">
            {sectionName} — Hoàn thành trong {minutes}m {seconds}s
          </p>
        </header>

        <div className="reveal mt-8" ref={scoreRef} style={{ transitionDelay: "80ms" }}>
          <Card className="rounded-2xl border border-border bg-surface p-6 text-center shadow-surface sm:p-8">
            <p className="text-xs uppercase tracking-widest text-muted">Số câu đúng</p>
            <p className={`mt-2 font-serif text-6xl leading-none tabular-nums ${pctColor}`}>
              {score}/{total}
            </p>
            <p className="mt-2 text-sm text-muted">{pct}% Đúng</p>
            {section === "full" && (
              <div className="mt-5 inline-flex items-baseline gap-2 rounded-lg border border-border bg-surface-secondary px-4 py-2.5">
                <span className="text-xs text-muted">Điểm TOEIC ước tính</span>
                <span className="font-semibold tabular-nums">{estimatedScore} / 990</span>
              </div>
            )}
            <ProgressBar
              color={progressColor}
              size="sm"
              value={pct}
              aria-label="Tỷ lệ trả lời đúng"
              className="mt-7"
            />
          </Card>
        </div>

        <div className="mt-5 flex justify-center gap-2 pb-8">
          <Button variant="outline" size="sm" onPress={() => navigate("/")} className="rounded-lg">
            <House size={16} /> Về trang chủ
          </Button>
          <Button
            variant="primary"
            size="sm"
            onPress={() => navigate(`/exam/${section}`)}
            className="rounded-lg"
          >
            <ArrowCounterClockwise size={16} /> Làm lại
          </Button>
        </div>

        <Accordion
          variant="surface"
          hideSeparator
          className="mb-10 overflow-hidden rounded-xl border border-border shadow-surface"
        >
          <Accordion.Item defaultExpanded>
            <Accordion.Heading>
              <Accordion.Trigger>
                Xem lại đáp án ({state.questions.length} câu)
                <Accordion.Indicator />
              </Accordion.Trigger>
            </Accordion.Heading>
            <Accordion.Panel>
              <div className="space-y-4 px-4 pb-4">
                {state.questions.map((q, i) => {
                  const reviewAnswer = state.answers[q.id];
                  return (
                    <QuestionCard
                      key={q.id}
                      question={q}
                      selectedAnswer={
                        Array.isArray(reviewAnswer) ? undefined : (reviewAnswer ?? null)
                      }
                      onSelect={() => {}}
                      showResult
                      correctAnswer={q.answer}
                      questionNumber={i + 1}
                      partLabel={`Phần ${q.part}`}
                      blankAnswers={Array.isArray(reviewAnswer) ? reviewAnswer : []}
                    />
                  );
                })}
              </div>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>

        <ScrollToTop />
      </div>
    </div>
  );
}
