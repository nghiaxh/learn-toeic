import { useNavigate } from "react-router";
import { Headphones, BookOpen, FileText, Sun, Moon } from "@phosphor-icons/react";
import { Button, Card } from "@heroui/react";
import { useTheme } from "../context/ThemeContext";
import { useReveal } from "../hooks/useReveal";

const sections = [
  {
    title: "Ôn phần nghe",
    icon: <Headphones size={18} weight="bold" />,
    questions: "100",
    time: "45 phút",
    variant: "primary" as const,
    to: "/exam/listening",
  },
  {
    title: "Ôn phần đọc",
    icon: <BookOpen size={18} weight="bold" />,
    questions: "100",
    time: "75 phút",
    variant: "primary" as const,
    to: "/exam/reading",
  },
  {
    title: "Bài thi Đầy đủ",
    icon: <FileText size={18} weight="bold" />,
    questions: "200",
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
    <div className="min-h-dvh flex flex-col items-center px-6 py-12 sm:py-16">
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

      <div ref={heroRef} className="reveal max-w-xl text-center">
        <span className="inline-flex items-center rounded-full border border-border bg-surface px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.25em] text-muted">
          Luyện thi TOEIC
        </span>
        <h1 className="mt-4 font-serif text-3xl leading-tight tracking-tight sm:text-4xl">
          Mô phỏng bài thi <em className="italic">TOEIC</em>
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">
          Luyện Nghe, Đọc và bài thi đầy đủ với 100 câu hỏi ngẫu nhiên mỗi lượt.
        </p>
      </div>

      <div className="mt-10 grid w-full max-w-4xl grid-cols-1 gap-3 lg:grid-cols-3">
        {sections.map((section, i) => (
          <div
            key={section.to}
            ref={cardRefs[i]}
            className="reveal"
            style={{ transitionDelay: `${i * 80}ms` }}
          >
            <Card className="flex h-full flex-col rounded-xl border border-border bg-surface p-5 shadow-surface">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent-soft-foreground">
                  {section.icon}
                </span>
                <div>
                  <h2 className="font-semibold">{section.title}</h2>
                  <p className="mt-0.5 text-xs tabular-nums text-muted">
                    <span>{section.questions}</span> câu · <span>{section.time}</span>
                  </p>
                </div>
              </div>

              <Button
                variant={section.variant}
                fullWidth
                onPress={() => navigate(section.to)}
                className="mt-5 h-10 rounded-lg"
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
