"use client";

import React from "react";
import { CONTENT } from "@/data/content";
import { fetchGitHubRepos } from "@/lib/github";
import { applyTheme, loadSavedTheme, THEMES } from "@/lib/themes";

export type CommandContext = {
  clear: () => void;
  getHistory: () => string[];
  cwd: string;
  setCwd: (path: string) => void;
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
    ["apps", "browse my live projects"],
    ["resume", "download my resume"],
    ["contact", "get in touch"],
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
      <p className="pl-4 mt-2 opacity-40 text-xs">tip: feels like a real shell — try ls, cat, sudo...</p>
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
        <p key={i} className="pl-4 mt-1">
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
            className="text-[var(--term-link)] underline hover:opacity-75 break-all"
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

function AppsOutput() {
  if (CONTENT.apps.length === 0) {
    return <p className="my-1 opacity-50">no apps deployed yet.</p>;
  }
  return (
    <div className="my-1 space-y-2">
      <p className="text-[var(--term-accent)]">live projects:</p>
      {CONTENT.apps.map((app) => (
        <div key={app.name} className="pl-4">
          <a
            href={app.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--term-link)] underline hover:opacity-75 font-semibold"
          >
            {app.name}
          </a>
          {app.description && (
            <p className="text-sm opacity-70 mt-0.5">{app.description}</p>
          )}
        </div>
      ))}
    </div>
  );
}

function ResumeOutput() {
  return (
    <div className="my-1 space-y-0.5">
      <p className="text-[var(--term-accent)]">resume:</p>
      <div className="pl-4">
        <a
          href={CONTENT.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--term-link)] underline hover:opacity-75"
        >
          {CONTENT.resumeUrl}
        </a>
      </div>
    </div>
  );
}

function NeoFetchOutput() {
  const logo = [
    " ██████╗  ██████╗ ",
    " ██╔══██╗██╔════╝ ",
    " ██║  ██║██║      ",
    " ██║  ██║██║      ",
    " ██████╔╝╚██████╗ ",
    " ╚═════╝  ╚═════╝ ",
  ];
  const theme = loadSavedTheme();
  const info = [
    ["", "guest@davelle.dev"],
    ["", "-----------------"],
    ["OS", "davelle.dev 1.0"],
    ["Host", "Vercel Edge Network"],
    ["Kernel", "Next.js 16.3.1"],
    ["Shell", "davelle-sh 1.0"],
    ["Theme", theme],
    ["CPU", "coffee-powered @ 3AM"],
    ["Memory", "vibes / enough"],
  ];
  return (
    <div className="my-1 flex gap-6 text-xs leading-5">
      <pre className="text-[var(--term-accent)] shrink-0 hidden sm:block">
        {logo.join("\n")}
      </pre>
      <div className="space-y-0">
        {info.map(([label, value], i) => (
          <div key={i} className="flex gap-2">
            {label ? (
              <>
                <span className="text-[var(--term-accent)] w-16 shrink-0">{label}</span>
                <span className="opacity-80">{value}</span>
              </>
            ) : (
              <span className={i === 0 ? "text-[var(--term-accent)] font-bold" : "opacity-40"}>{value}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function SudoOutput() {
  return (
    <p className="my-1 text-[var(--term-error)]">
      guest is not in the sudoers file. This incident will be reported.
    </p>
  );
}

const README_CONTENT = `# davelle.dev

A terminal portfolio. Poke around.

## Hidden Commands

  ls              list the filesystem
  cd <dir>        navigate directories (try projects or apps)
  cat <file>      read a file (try README.md, about.txt, .secrets)
  vim <file>      open a file (good luck closing it)
  pwd             print working directory
  whoami          who are you, exactly?
  date            current date and time
  uname           system info
  neofetch        system info, but make it aesthetic
  sudo <anything> test your privileges
  nvidia-smi      system diagnostics
  exit / logout   there is no escape
  rm <file>       permission denied (nice try)`;

function VimOutput({ file }: { file?: string }) {
  if (file === "README.md") {
    const lines = README_CONTENT.split("\n");
    return (
      <div className="my-1">
        <div className="text-xs opacity-40 mb-1">README.md [readonly]</div>
        <pre className="text-xs leading-relaxed opacity-80">{README_CONTENT}</pre>
        <div className="mt-1 text-xs opacity-40">
          {lines.length} lines -- NORMAL -- :q! to quit (you know the drill)
        </div>
      </div>
    );
  }
  const art = `
  ~
  ~
  ~
  ~
  ~
  "davelle.dev" [readonly] 1 line
  -- NORMAL --`;
  return (
    <div className="my-1">
      <pre className="text-xs leading-relaxed opacity-70">{art}</pre>
      <p className="mt-1 opacity-50 text-xs">you are now in vim. type :q! to escape. (it won&apos;t work.)</p>
    </div>
  );
}

function LsOutput() {
  const entries = [
    { perms: "dr-xr-xr-x", name: "projects/", color: "text-[var(--term-link)]" },
    { perms: "dr-xr-xr-x", name: "apps/", color: "text-[var(--term-link)]" },
    { perms: "-r--r--r--", name: "README.md", color: "text-[var(--term-accent)]" },
    { perms: "-r--r--r--", name: "about.txt", color: "" },
    { perms: "-r--r--r--", name: "contact.txt", color: "" },
    { perms: "-r--------", name: ".secrets", color: "text-[var(--term-error)]" },
  ];
  return (
    <div className="my-1 space-y-0.5">
      {entries.map(({ perms, name, color }) => (
        <div key={name} className="flex gap-4 text-xs font-mono">
          <span className="opacity-40">{perms}</span>
          <span className={color || "text-[var(--term-fg)]"}>{name}</span>
        </div>
      ))}
    </div>
  );
}

function CatOutput({ file }: { file: string }) {
  if (file === "README.md") {
    return <pre className="my-1 text-xs leading-relaxed opacity-80">{README_CONTENT}</pre>;
  }
  if (file === "about.txt") {
    return <AboutOutput />;
  }
  if (file === "contact.txt") {
    return <ContactOutput />;
  }
  if (file === ".secrets") {
    return (
      <div className="my-1 space-y-0.5 opacity-70 text-xs">
        <p># things i will never admit publicly</p>
        <p>i push to main and pray</p>
        <p>i have 47 unfinished side projects</p>
        <p>i google "how to center a div" every single time</p>
        <p>i have never actually read the docs</p>
        <p>every project starts as "this one will be clean"</p>
      </div>
    );
  }
  return (
    <p className="my-1 text-[var(--term-error)]">
      cat: {file}: No such file or directory
    </p>
  );
}

function DateOutput() {
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
  }).format(new Date());
  return <p className="my-1 opacity-70">{now} EST</p>;
}

function UnameOutput() {
  return (
    <p className="my-1 opacity-70 text-xs">
      davelle.dev NextJS 16.3.1 #1 SMP x86_64 portfolio
    </p>
  );
}

export const COMMANDS: Record<string, CommandHandler> = {
  help: () => <HelpOutput />,
  resume: () => <ResumeOutput />,
  about: () => <AboutOutput />,
  contact: () => <ContactOutput />,
  apps: () => <AppsOutput />,
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
  sudo: () => <SudoOutput />,
  vim: (args) => <VimOutput file={args[0]} />,
  nano: (args) => <VimOutput file={args[0]} />,
  ls: async (args, ctx) => {
    const FILES = ["readme.md", "about.txt", "contact.txt", ".secrets"];
    const target = args[0]?.replace(/\/$/, "").toLowerCase();
    const effectiveCwd = target || ctx.cwd;
    if (effectiveCwd === "~" || effectiveCwd === ".") return <LsOutput />;
    if (effectiveCwd === "projects") return COMMANDS.projects([], ctx);
    if (effectiveCwd === "apps") return COMMANDS.apps([], ctx);
    if (target && FILES.includes(target)) return <p className="my-1 text-[var(--term-error)]">ls: {args[0]}: Not a directory</p>;
    return <p className="my-1 text-[var(--term-error)]">ls: cannot access &apos;{args[0]}&apos;: No such file or directory</p>;
  },
  cd: (_args, ctx) => {
    const FILES = ["readme.md", "about.txt", "contact.txt", ".secrets"];
    const DIRS = ["projects", "apps"];
    const raw = _args[0];
    if (!raw || raw === "~") {
      ctx.setCwd("~");
      return null;
    }
    const target = raw.replace(/\/$/, "").toLowerCase();
    if (target === "..") {
      if (ctx.cwd === "~") return <p className="my-1 text-[var(--term-error)]">cd: permission denied: /</p>;
      ctx.setCwd("~");
      return null;
    }
    if (DIRS.includes(target)) {
      ctx.setCwd(target);
      return null;
    }
    if (FILES.includes(target)) {
      return <p className="my-1 text-[var(--term-error)]">cd: not a directory: {raw}</p>;
    }
    return <p className="my-1 text-[var(--term-error)]">cd: no such file or directory: {raw}</p>;
  },
  cat: (args) => {
    const file = args[0] ?? "";
    if (!file) return <p className="my-1 text-[var(--term-error)]">cat: missing operand</p>;
    return <CatOutput file={file} />;
  },
  pwd: (_args, ctx) => (
    <p className="my-1 opacity-70">
      {ctx.cwd === "~" ? "/home/davelle/portfolio" : `/home/davelle/portfolio/${ctx.cwd}`}
    </p>
  ),
  neofetch: () => <NeoFetchOutput />,
  whoami: () => <p className="my-1 opacity-70">guest</p>,
  date: () => <DateOutput />,
  uname: () => <UnameOutput />,
  exit: () => <p className="my-1 opacity-70">there is no escape.</p>,
  logout: () => <p className="my-1 opacity-70">there is no escape.</p>,
  rm: (args) => {
    const target = args.find((a) => !a.startsWith("-"));
    if (!target) return <p className="my-1 text-[var(--term-error)]">rm: missing operand</p>;
    return <p className="my-1 text-[var(--term-error)]">rm: cannot remove &apos;{target}&apos;: Permission denied</p>;
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
