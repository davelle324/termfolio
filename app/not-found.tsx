import Link from "next/link";
import ThemeProvider from "@/components/ThemeProvider";
import { CONTENT } from "@/data/content";

export default function NotFound() {
  return (
    <div className="h-[100dvh] bg-[var(--term-bg)] text-[var(--term-fg)] font-mono flex flex-col p-6">
      <ThemeProvider />
      <div className="flex-1 flex flex-col justify-center max-w-xl">
        <div className="space-y-1 mb-6">
          <p>
            <span className="text-[var(--term-accent)]">{CONTENT.prompt}</span>{" "}
            cd /{"{that page}"}
          </p>
          <p className="text-[var(--term-error)]">
            bash: cd: /{"{that page}"}: No such file or directory
          </p>
        </div>
        <p className="text-5xl font-bold text-[var(--term-accent)] mb-2">404</p>
        <p className="opacity-50 mb-8">page not found</p>
        <Link
          href="/"
          className="text-[var(--term-link)] underline hover:opacity-75 text-sm"
        >
          ← back to terminal
        </Link>
      </div>
    </div>
  );
}
