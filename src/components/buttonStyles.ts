import type { CSSProperties } from "react";

export const successButtonStyle = {
  "--button-bg": "var(--success)",
  "--button-bg-hover": "var(--success-hover)",
  "--button-bg-pressed": "var(--success-hover)",
  "--button-fg": "var(--success-foreground)",
} as CSSProperties;

export const warningButtonStyle = {
  "--button-bg": "var(--warning)",
  "--button-bg-hover": "var(--warning-hover)",
  "--button-bg-pressed": "var(--warning-hover)",
  "--button-fg": "var(--warning-foreground)",
} as CSSProperties;
