import { useNavigate } from "react-router-dom";
import { Headphones, BookOpen, FileText, Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export function Home() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={toggleTheme}
          title={theme === "dark" ? "Chế độ sáng" : "Chế độ tối"}
          className="btn btn-ghost btn-circle"
        >
          {theme === "dark" ? <Sun size={22} /> : <Moon size={22} />}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full max-w-5xl">
      <div className="card bg-base-100 border border-base-300 w-full">
        <div className="card-body">
          <h2 className="card-title justify-center">
            <Headphones size={20} />
            Ôn phần nghe
          </h2>
          <div className="flex justify-between text-sm text-base-content/60 mb-1">
            <span>Câu hỏi</span>
            <strong className="text-base-content">100</strong>
          </div>
          <div className="flex justify-between text-sm text-base-content/60 mb-3">
            <span>Thời gian</span>
            <strong className="text-base-content">45 phút</strong>
          </div>
          <button
            className="btn btn-primary w-full"
            onClick={() => navigate("/exam/listening")}
          >
            Bắt đầu
          </button>
        </div>
      </div>

      <div className="card bg-base-100 border border-base-300 w-full">
        <div className="card-body">
          <h2 className="card-title justify-center">
            <BookOpen size={20} />
            Ôn phần đọc
          </h2>
          <div className="flex justify-between text-sm text-base-content/60 mb-1">
            <span>Câu hỏi</span>
            <strong className="text-base-content">100</strong>
          </div>
          <div className="flex justify-between text-sm text-base-content/60 mb-3">
            <span>Thời gian</span>
            <strong className="text-base-content">75 phút</strong>
          </div>
          <button
            className="btn btn-primary w-full"
            onClick={() => navigate("/exam/reading")}
          >
            Bắt đầu
          </button>
        </div>
      </div>

      <div className="card bg-base-100 border border-base-300 w-full">
        <div className="card-body">
          <h2 className="card-title justify-center">
            <FileText size={20} />
            Bài thi Đầy đủ
          </h2>
          <div className="flex justify-between text-sm text-base-content/60 mb-1">
            <span>Tổng câu hỏi</span>
            <strong className="text-base-content">200</strong>
          </div>
          <div className="flex justify-between text-sm text-base-content/60 mb-3">
            <span>Tổng thời gian</span>
            <strong className="text-base-content">120 phút</strong>
          </div>
          <button
            className="btn btn-outline btn-primary w-full"
            onClick={() => navigate("/exam/full")}
          >
            Bắt đầu
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}
