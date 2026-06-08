import { Play, Pause, Square, Volume2 } from "lucide-react";
import { useSpeech } from "../hooks/useSpeech";

interface PassageViewProps {
  title?: string;
  body: string;
  isListening?: boolean;
}

export function PassageView({ title, body, isListening }: PassageViewProps) {
  const { speak, pause, resume, cancel, speaking, paused, supported } = useSpeech();

  return (
    <div className="bg-base-100 border border-base-300 rounded-box p-3 mb-4 shadow-sm">
      {isListening ? (
        <>
          {title && (
            <h3 className="text-xs font-bold text-primary uppercase tracking-wide text-center mb-4">
              {title}
            </h3>
          )}
          {supported ? (
            <div className="flex justify-center gap-2">
              {!speaking ? (
                <button
                  onClick={() => speak(body)}
                  title="Đọc to"
                  className="btn btn-outline btn-primary btn-md"
                >
                  <Play size={18} /> Phát
                </button>
              ) : (
                <>
                  {paused ? (
                    <button
                      onClick={resume}
                      title="Tiếp tục"
                      className="btn btn-outline btn-primary btn-md"
                    >
                      <Play size={18} /> Tiếp tục
                    </button>
                  ) : (
                    <button
                      onClick={pause}
                      title="Tạm dừng"
                      className="btn btn-outline btn-warning btn-md"
                    >
                      <Pause size={18} /> Tạm dừng
                    </button>
                  )}
                  <button
                    onClick={cancel}
                    title="Dừng"
                    className="btn btn-outline btn-error btn-md"
                  >
                    <Square size={18} /> Dừng
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="flex justify-center">
              <span className="text-xs text-base-content/60 flex items-center gap-1">
                <Volume2 size={14} /> Trình duyệt không hỗ trợ
              </span>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              {title && (
                <h3 className="text-sm font-bold text-primary uppercase tracking-wide">
                  {title}
                </h3>
              )}
            </div>
          </div>
          {body && (
            <div className={`whitespace-pre-wrap leading-relaxed text-sm text-base-content/90 ${title ? "mt-2.5" : ""}`}>
              {body}
            </div>
          )}
        </>
      )}
    </div>
  );
}
