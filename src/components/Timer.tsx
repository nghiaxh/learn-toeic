interface TimerProps {
  formatted: string;
  isWarning?: boolean;
}

export function Timer({ formatted, isWarning }: TimerProps) {
  return (
    <div
      className={`font-mono text-2xl font-bold tracking-wider px-5 py-1.5 rounded-xl border shadow-sm transition-all duration-200 ${
        isWarning
          ? "text-error bg-error/10 border-error"
          : "text-base-content bg-base-100 border-base-300"
      }`}
    >
      {formatted}
    </div>
  );
}
