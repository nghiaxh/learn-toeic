import { useNavigate } from "react-router";
import { Headphones, BookOpen, FileText, Sun, Moon } from "@phosphor-icons/react";
import { Button, Card } from "@heroui/react";
import { useTheme } from "../context/ThemeContext";
import { useReveal } from "../hooks/useReveal";

const sections = [
  {
    title: "Ôn phần nghe",
    description: "Parts 1–4 · Hình ảnh, hỏi – đáp, hội thoại, bài nói ngắn",
    icon: <Headphones size={20} weight="bold" />,
    questionLabel: "Câu hỏi",
    questions: "100",
    timeLabel: "Thời gian",
    time: "45 phút",
    variant: "primary" as const,
    to: "/exam/listening",
  },
  {
    title: "Ôn phần đọc",
    description: "Parts 5–7 · Câu chưa hoàn chỉnh, hoàn thiện đoạn văn, đọc hiểu",
    icon: <BookOpen size={20} weight="bold" />,
    questionLabel: "Câu hỏi",
    questions: "100",
    timeLabel: "Thời gian",
    time: "75 phút",
    variant: "primary" as const,
    to: "/exam/reading",
  },
  {
    title: "Bài thi Đầy đủ",
    description: "Nghe + Đọc trong một lượt thi hoàn chỉnh",
    icon: <FileText size={20} weight="bold" />,
    questionLabel: "Tổng câu hỏi",
    questions: "200",
    timeLabel: "Tổng thời gian",
    time: "120 phút",
    variant: "outline" as const,
    to: "/exam/full",
  },
];

export function Home() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const heroRef = useReveal<HTMLDivElement>();
  const cardRefs = [useReveal<HTMLDivElement>(), useReveal<HTMLDivElement>(), useReveal<HTMLDivElement>()];

  return (
    <div className="min-h-dvh flex flex-col items-center px-6 py-16 sm:py-24">
      <div className="fixed top-4 right-4 z-50">
        <span title={theme === "dark" ? "Chế độ sáng" : "Chế độ tối"}>
          <Button
            isIconOnly
            variant="ghost"
            onPress={toggleTheme}
            className="rounded-lg text-muted hover:text-foreground"
            aria-label="Chuyển chế độ sáng tối"
          >
            {theme === "dark" ? <Sun size={22} /> : <Moon size={22} />}
          </Button>
        </span>
      </div>

      <div ref={heroRef} className="reveal max-w-2xl text-center">
        <span className="inline-flex items-center rounded-full border border-border bg-surface px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-muted">
          Luyện thi TOEIC
        </span>
        <h1 className="mt-6 font-serif text-5xl leading-[1.05] tracking-tight sm:text-6xl">
          Mô phỏng bài thi <em className="italic">TOEIC</em>
        </h1>
        <p className="mx-auto mt-5 max-w-md leading-relaxed text-muted">
          Luyện Nghe, Đọc và bài thi đầy đủ với 100 câu hỏi ngẫu nhiên mỗi lượt.
        </p>
      </div>

      <div className="mt-14 grid w-full max-w-4xl grid-cols-1 gap-4 lg:grid-cols-2">
        {sections.map((section, i) => (
          <div
            key={section.to}
            ref={cardRefs[i]}
            className={`reveal ${i === 2 ? "lg:col-span-2" : ""}`}
            style={{ transitionDelay: `${i * 80}ms` }}
          >
            <Card className="h-full rounded-xl border border-border bg-surface p-6 shadow-surface">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent-soft-foreground">
                  {section.icon}
                </span>
                <div>
                  <h2 className="font-semibold">{section.title}</h2>
                  <p className="mt-0.5 text-sm text-muted">{section.description}</p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-border bg-surface-secondary p-3">
                  <p className="text-[11px] uppercase tracking-wider text-muted">{section.questionLabel}</p>
                  <p className="mt-1 font-serif text-2xl tabular-nums">{section.questions}</p>
                </div>
                <div className="rounded-lg border border-border bg-surface-secondary p-3">
                  <p className="text-[11px] uppercase tracking-wider text-muted">{section.timeLabel}</p>
                  <p className="mt-1 font-serif text-2xl tabular-nums">{section.time}</p>
                </div>
              </div>

              <Button
                variant={section.variant}
                fullWidth
                onPress={() => navigate(section.to)}
                className="mt-5 h-11 rounded-lg"
              >
                Bắt đầu
              </Button>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
