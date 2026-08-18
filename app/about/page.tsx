import Link from "next/link";
import { CONTENT } from "@/data/content";
import ThemeProvider from "@/components/ThemeProvider";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata = {
  title: `${CONTENT.name} — About`,
  description: CONTENT.bio[0],
};

const contactLabels: Record<string, string> = {
  email: "Email",
  github: "GitHub",
  linkedin: "LinkedIn",
  letterboxd: "Letterboxd",
};

export default function AboutPage() {
  return (
    <div className="min-h-[100dvh] bg-[var(--term-bg)] text-[var(--term-fg)] font-mono flex flex-col">
      <ThemeProvider />
      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-16 sm:py-24">

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--term-accent)] mb-2">
            {CONTENT.name}
          </h1>
          <p className="text-lg opacity-70 mb-6">
            {CONTENT.title} — {CONTENT.location}
          </p>
          <a
            href={CONTENT.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 text-sm border border-[var(--term-accent)] text-[var(--term-accent)] rounded hover:bg-[var(--term-accent)] hover:text-[var(--term-bg)] transition-colors"
          >
            Download Resume ↓
          </a>
        </div>

        {/* Bio */}
        <section className="mb-12 space-y-4">
          {CONTENT.bio.map((paragraph, i) => (
            <p key={i} className="leading-relaxed opacity-90">
              {paragraph}
            </p>
          ))}
        </section>

        {/* Apps */}
        {CONTENT.apps.length > 0 && (
          <section className="mb-12">
            <h2 className="text-[var(--term-accent)] text-sm uppercase tracking-widest mb-4">
              Projects
            </h2>
            <div className="space-y-4">
              {CONTENT.apps.map((app) => (
                <a
                  key={app.name}
                  href={app.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block border border-[var(--term-dim)] rounded p-4 hover:border-[var(--term-accent)] transition-colors group"
                >
                  <p className="font-semibold text-[var(--term-link)] group-hover:opacity-75">
                    {app.name} →
                  </p>
                  {app.description && (
                    <p className="text-sm opacity-60 mt-1">{app.description}</p>
                  )}
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Contact */}
        <section className="mb-12">
          <h2 className="text-[var(--term-accent)] text-sm uppercase tracking-widest mb-4">
            Contact
          </h2>
          <div className="space-y-2">
            {Object.entries(CONTENT.contact).map(([key, value]) => (
              <div key={key} className="flex gap-4">
                <span className="opacity-40 w-24 shrink-0">
                  {contactLabels[key] ?? key}
                </span>
                <a
                  href={key === "email" ? `mailto:${value}` : value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--term-link)] underline hover:opacity-75 break-all"
                >
                  {value}
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-sm opacity-40 hover:opacity-70 transition-opacity"
          >
            ← terminal version
          </Link>
          <ThemeToggle />
        </div>
      </main>
    </div>
  );
}
