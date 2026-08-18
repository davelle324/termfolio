export interface Theme {
  name: string;
  bg: string;
  fg: string;
  accent: string;
  cursor: string;
  dim: string;
  error: string;
  link: string;
}

export const THEMES: Record<string, Theme> = {
  green: {
    name: "green",
    bg: "#0d0d0d",
    fg: "#00ff41",
    accent: "#00cc33",
    cursor: "#00ff41",
    dim: "#004d13",
    error: "#ff4444",
    link: "#00ffaa",
  },
  amber: {
    name: "amber",
    bg: "#0d0c0a",
    fg: "#ffb000",
    accent: "#cc8800",
    cursor: "#ffb000",
    dim: "#4d3200",
    error: "#ff6644",
    link: "#ffdd88",
  },
  slate: {
    name: "slate",
    bg: "#0f1117",
    fg: "#e2e8f0",
    accent: "#60a5fa",
    cursor: "#60a5fa",
    dim: "#1e2433",
    error: "#f87171",
    link: "#93c5fd",
  },
};

export const DEFAULT_THEME = "green";
const STORAGE_KEY = "terminal-theme";

export function applyTheme(name: string): void {
  const theme = THEMES[name];
  if (!theme) return;
  const root = document.documentElement;
  root.style.setProperty("--term-bg", theme.bg);
  root.style.setProperty("--term-fg", theme.fg);
  root.style.setProperty("--term-accent", theme.accent);
  root.style.setProperty("--term-cursor", theme.cursor);
  root.style.setProperty("--term-dim", theme.dim);
  root.style.setProperty("--term-error", theme.error);
  root.style.setProperty("--term-link", theme.link);
  try {
    localStorage.setItem(STORAGE_KEY, name);
  } catch {
    // localStorage unavailable (SSR or private mode)
  }
}

export function loadSavedTheme(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}
