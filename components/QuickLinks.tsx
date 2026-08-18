"use client";

import { loadSavedTheme, THEMES } from "@/lib/themes";

const LINKS = ["help", "about", "projects", "apps", "contact", "clear"] as const;
const THEME_CYCLE = Object.keys(THEMES);

export default function QuickLinks({
  onCommand,
}: {
  onCommand: (cmd: string) => void;
}) {
  const handleTheme = () => {
    const current = loadSavedTheme();
    const idx = THEME_CYCLE.indexOf(current);
    const next = THEME_CYCLE[(idx + 1) % THEME_CYCLE.length];
    onCommand(`theme ${next}`);
  };

  return (
    <div className="flex flex-wrap gap-2 pb-3 border-b border-[var(--term-dim)] mb-3">
      {LINKS.map((cmd) => (
        <button
          key={cmd}
          onClick={() => onCommand(cmd)}
          className="px-2 py-0.5 sm:px-3 sm:py-1 text-xs border border-[var(--term-dim)] text-[var(--term-dim)] brightness-200 hover:border-[var(--term-accent)] hover:text-[var(--term-accent)] transition-colors rounded cursor-pointer"
        >
          [{cmd}]
        </button>
      ))}
      <button
        onClick={handleTheme}
        className="px-3 py-1 text-xs border border-[var(--term-dim)] text-[var(--term-dim)] brightness-200 hover:border-[var(--term-accent)] hover:text-[var(--term-accent)] transition-colors rounded cursor-pointer"
      >
        [theme]
      </button>
    </div>
  );
}
