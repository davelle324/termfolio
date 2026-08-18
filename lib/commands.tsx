"use client";

import React from "react";
import { CONTENT } from "@/data/content";
import { fetchGitHubRepos } from "@/lib/github";
import { applyTheme, THEMES } from "@/lib/themes";

export type CommandContext = {
  clear: () => void;
  getHistory: () => string[];
};

export type CommandHandler = (
  args: string[],
  ctx: CommandContext
) => React.ReactNode | Promise<React.ReactNode>;

function HelpOutput() {
  const cmds = [
    ["help", "show this message"],
    ["about", "learn about me"],
    ["projects", "browse my GitHub projects"],
    ["contact", "get in touch"],
    ["nvidia-smi", "system diagnostics"],
    ["history", "show command history"],
    ["theme <name>", `switch color theme (${Object.keys(THEMES).join(", ")})`],
    ["clear", "clear the terminal"],
  ];
  return (
    <div className="my-1 space-y-0.5">
      <p className="text-[var(--term-accent)]">available commands:</p>
      {cmds.map(([cmd, desc]) => (
        <div key={cmd} className="pl-4 flex gap-4">
          <span className="text-[var(--term-fg)] shrink-0 whitespace-nowrap w-32">{cmd}</span>
          <span className="opacity-50">{desc}</span>
        </div>
      ))}
    </div>
  );
}

function AboutOutput() {
  return (
    <div className="my-1 space-y-0.5">
      <p className="text-[var(--term-accent)]">
        {CONTENT.name} / {CONTENT.title} / {CONTENT.location}
      </p>
      {CONTENT.bio.map((line, i) => (
        <p key={i} className={line === "" ? "h-2" : "pl-4"}>
          {line}
        </p>
      ))}
    </div>
  );
}

function ContactOutput() {
  const links = [
    { label: "email", value: CONTENT.contact.email, href: `mailto:${CONTENT.contact.email}` },
    { label: "github", value: CONTENT.contact.github, href: CONTENT.contact.github },
    { label: "linkedin", value: CONTENT.contact.linkedin, href: CONTENT.contact.linkedin },
    { label: "letterboxd", value: CONTENT.contact.letterboxd, href: CONTENT.contact.letterboxd },
  ];
  return (
    <div className="my-1 space-y-0.5">
      <p className="text-[var(--term-accent)]">reach me at:</p>
      {links.map(({ label, value, href }) => (
        <div key={label} className="pl-4 flex gap-4">
          <span className="text-[var(--term-fg)] shrink-0 w-24">{label}</span>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--term-link)] underline hover:opacity-75"
          >
            {value}
          </a>
        </div>
      ))}
    </div>
  );
}

function ProjectsList({ repos }: { repos: import("@/lib/github").GitHubRepo[] }) {
  if (repos.length === 0) {
    return <p className="my-1">no public repositories found.</p>;
  }
  return (
    <div className="my-1 space-y-2">
      <p className="text-[var(--term-accent)]">
        github.com/{CONTENT.githubUsername}
      </p>
      {repos.map((repo) => (
        <div key={repo.name} className="pl-4">
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--term-link)] underline hover:opacity-75 font-semibold"
          >
            {repo.name}
          </a>
          {repo.language && (
            <span className="ml-2 text-[var(--term-accent)] text-xs">
              [{repo.language}]
            </span>
          )}
          {repo.stargazers_count > 0 && (
            <span className="ml-2 opacity-50 text-xs">
              ★ {repo.stargazers_count}
            </span>
          )}
          {repo.description && (
            <p className="text-sm opacity-70 mt-0.5">{repo.description}</p>
          )}
        </div>
      ))}
    </div>
  );
}

function NvidiaSmiOutput() {
  const now = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    weekday: "short",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    year: "numeric",
    hour12: false,
  }).format(new Date()).replace(/,/g, "") + " EST";
  const output = `${now}
+-----------------------------------------------------------------------------+
| NVIDIA-SMI 535.154.05   Driver Version: coffee-2.0   CUDA Version: Inf     |
+-----------------------------+---------------------+---------------------------+
| GPU  Name         Temp Perf | Memory-Usage        | GPU-Util   Compute M.   |
|=============================+=====================+===========================|
|   0  RTX Inf Brain 37C   P0 | 63231MiB / 65536MiB |    99%      Default     |
+-----------------------------+---------------------+---------------------------+

+-----------------------------------------------------------------------------+
| Processes:                                                                  |
|  GPU   PID  Type  Process Name                            GPU Memory Usage  |
|=============================================================================|
|    0  1337   C    /usr/bin/vscode                               4096MiB     |
|    0  4200   C    /usr/bin/apple_music                          2048MiB     |
|    0  6969   G    ./side_project_thatll_make_me_rich           57087MiB     |
+-----------------------------------------------------------------------------+`;

  return (
    <div className="my-1 overflow-x-auto">
      <pre className="text-xs leading-relaxed">{output}</pre>
    </div>
  );
}

function HistoryOutput({ entries }: { entries: string[] }) {
  if (entries.length === 0) {
    return <p className="my-1 opacity-50">no commands in history.</p>;
  }
  return (
    <div className="my-1 space-y-0.5">
      {entries.map((cmd, i) => (
        <p key={i}>
          <span className="opacity-40 inline-block w-6 text-right mr-3">
            {i + 1}
          </span>
          {cmd}
        </p>
      ))}
    </div>
  );
}

export const COMMANDS: Record<string, CommandHandler> = {
  help: () => <HelpOutput />,
  about: () => <AboutOutput />,
  contact: () => <ContactOutput />,
  "nvidia-smi": () => <NvidiaSmiOutput />,
  history: (_args, ctx) => {
    const entries = [...ctx.getHistory()].reverse();
    return <HistoryOutput entries={entries} />;
  },
  projects: async () => {
    let repos;
    try {
      repos = await fetchGitHubRepos(CONTENT.githubUsername);
      if (CONTENT.pinnedRepos.length > 0) {
        repos = repos.filter((r) => CONTENT.pinnedRepos.includes(r.name));
      } else {
        repos = repos.slice(0, 8);
      }
    } catch {
      return (
        <p className="my-1 text-[var(--term-error)]">
          failed to fetch repos — check your GitHub username in data/content.ts
        </p>
      );
    }
    return <ProjectsList repos={repos} />;
  },
  clear: (_args, ctx) => {
    ctx.clear();
    return null;
  },
  theme: (args) => {
    const name = args[0]?.toLowerCase();
    if (!name || !THEMES[name]) {
      return (
        <p className="my-1 text-[var(--term-error)]">
          usage: theme &lt;name&gt; — available: {Object.keys(THEMES).join(", ")}
        </p>
      );
    }
    applyTheme(name);
    return (
      <p className="my-1 text-[var(--term-accent)]">theme changed to {name}</p>
    );
  },
};
