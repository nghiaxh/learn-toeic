import { Button } from "@heroui/react";
import { Play, Pause, Square, SpeakerHigh } from "@phosphor-icons/react";
import { useSpeech } from "../hooks/useSpeech";

interface PassageViewProps {
  title?: string;
  body: string;
  isListening?: boolean;
}

export function PassageView({ title, body, isListening }: PassageViewProps) {
  const { speak, pause, resume, cancel, speaking, paused, supported } = useSpeech();

  return (
    <div className="rounded-xl border border-border bg-surface p-3.5 mb-4 shadow-surface">
      {isListening ? (
        <>
          {title && (
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted text-center mb-4">
              {title}
            </h3>
          )}
          {supported ? (
            <div className="flex justify-center gap-2">
              {!speaking ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-md"
                  onPress={() => speak(body)}
                >
                  <Play weight="bold" size={15} /> Phát
                </Button>
              ) : (
                <>
                  {paused ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-md"
                      onPress={resume}
                    >
                      <Play weight="bold" size={15} /> Tiếp tục
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-md"
                      onPress={pause}
                    >
                      <Pause weight="bold" size={15} /> Tạm dừng
                    </Button>
                  )}
                  <Button
                    variant="danger"
                    size="sm"
                    className="rounded-md"
                    onPress={cancel}
                  >
                    <Square weight="bold" size={15} /> Dừng
                  </Button>
                </>
              )}
            </div>
          ) : (
            <div className="flex justify-center">
              <span className="text-xs text-muted flex items-center gap-1">
                <SpeakerHigh size={14} /> Trình duyệt không hỗ trợ
              </span>
            </div>
          )}
        </>
      ) : (
        <>
          {title && (
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              {title}
            </h3>
          )}
          {body && (
            <div
              className={`whitespace-pre-wrap leading-relaxed text-sm text-foreground/90 ${title ? "mt-2.5" : ""}`}
            >
              {body}
            </div>
          )}
        </>
      )}
    </div>
  );
}
