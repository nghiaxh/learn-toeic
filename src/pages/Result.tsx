import { useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import { RotateCcw, Home, ChevronDown, ChevronUp } from "lucide-react";
import type { Question, AnswerKey } from "../types";
import { QuestionCard } from "../components/QuestionCard";

interface ResultState {
  section: string;
  score: number;
  total: number;
  answers: Record<number, AnswerKey | null>;
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
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="btn btn-primary btn-circle fixed bottom-6 right-6 shadow-lg z-50"
    >
      <ChevronUp size={20} />
    </button>
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

  const estimatedScore = useMemo(() => {
    if (section === "full") return Math.round((score / total) * 990);
    return Math.round((score / total) * 495);
  }, [score, total, section]);

  const minutes = Math.floor(timeSpent / 60);
  const seconds = timeSpent % 60;

  const sectionName =
    section === "listening" ? "Nghe" : section === "reading" ? "Đọc" : "Đầy đủ";

  if (!state) {
    return (
      <div className="p-10 text-center">
        <p className="mb-4">Không có kết quả. Vui lòng làm bài thi trước.</p>
        <button onClick={() => navigate("/")} className="btn btn-primary">Trang chủ</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-6 max-w-[800px] mx-auto">

      <h1 className="text-2xl font-bold text-center mb-0.5 text-primary">
        Kết quả bài thi
      </h1>
      <p className="text-center text-base-content/60 mb-4 text-xs">
        {sectionName} — Hoàn thành trong {minutes}m {seconds}s
      </p>

      <div className="card bg-base-100 border border-base-300 text-center mb-4 shadow-sm">
        <div className="card-body py-4">
          <div
            className="text-4xl font-bold leading-none"
            style={{
              color: pct >= 70 ? "var(--color-success)" : pct >= 50 ? "#eab308" : "var(--color-error)",
            }}
          >
            {score}/{total}
          </div>
          <div className="text-sm text-base-content/60 mt-0.5">{pct}% Đúng</div>
          {section === "full" && (
            <div className="mt-2 px-4 py-2 bg-primary/10 rounded-box inline-block">
              <span className="text-xs text-base-content/60">Điểm TOEIC ước tính:</span>
              <span className="text-lg font-bold ml-2 text-primary">
                {estimatedScore} / 990
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center gap-2 pb-6">
        <button onClick={() => navigate("/")} className="btn btn-outline btn-sm">
          <Home size={16} /> Về trang chủ
        </button>
        <button onClick={() => navigate(`/exam/${section}`)} className="btn btn-primary btn-sm">
          <RotateCcw size={16} /> Làm lại
        </button>
      </div>

      <details className="mb-8" open>
        <summary className="cursor-pointer text-sm font-semibold text-base-content/70 hover:text-base-content flex items-center gap-1 select-none">
          <ChevronDown size={16} className="transition-transform" />
          Xem lại đáp án ({state.questions.length} câu)
        </summary>
        <div className="mt-4 space-y-4">
          {state.questions.map((q) => (
            <div key={q.id} className="card bg-base-100 border border-base-300 shadow-sm">
              <div className="card-body py-3 px-3">
                <QuestionCard
                  question={q}
                  selectedAnswer={state.answers[q.id] ?? null}
                  onSelect={() => {}}
                  showResult
                  correctAnswer={q.answer}
                />
              </div>
            </div>
          ))}
        </div>
      </details>

      <ScrollToTop />
    </div>
  );
}
