interface ProgressBarProps {
  answered: number;
  total: number;
}

export function ProgressBar({ answered, total }: ProgressBarProps) {
  const pct = total > 0 ? (answered / total) * 100 : 0;

  return (
    <div className="flex items-center gap-2">
      <progress
        className={`progress w-full ${pct === 100 ? "progress-success" : "progress-primary"}`}
        value={answered}
        max={total}
      />
      <span className="text-xs font-semibold text-base-content/60 min-w-[36px] text-right">
        {answered}/{total}
      </span>
    </div>
  );
}
