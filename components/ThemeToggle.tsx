"use client";

import { applyTheme, loadSavedTheme, THEMES } from "@/lib/themes";

const THEME_CYCLE = Object.keys(THEMES);

export default function ThemeToggle() {
  const handleClick = () => {
    const current = loadSavedTheme();
    const idx = THEME_CYCLE.indexOf(current);
    const next = THEME_CYCLE[(idx + 1) % THEME_CYCLE.length];
    applyTheme(next);
  };

  return (
    <button
      onClick={handleClick}
      className="px-3 py-1 text-xs border border-[var(--term-dim)] text-[var(--term-dim)] brightness-200 hover:border-[var(--term-accent)] hover:text-[var(--term-accent)] transition-colors rounded cursor-pointer"
    >
      [theme]
    </button>
  );
}
