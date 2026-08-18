"use client";

import React, { useState, useRef, useEffect, KeyboardEvent, useCallback } from "react";
import CommandInput from "./CommandInput";
import OutputLine from "./OutputLine";
import QuickLinks from "./QuickLinks";
import { COMMANDS } from "@/lib/commands";
import { CONTENT } from "@/data/content";
import { applyTheme, loadSavedTheme } from "@/lib/themes";

interface OutputEntry {
  id: string;
  command?: string;
  output: React.ReactNode;
}

const WELCOME: React.ReactNode = (
  <div className="mb-3 space-y-0.5">
    <p className="text-[var(--term-accent)] font-bold">
      {CONTENT.name} — {CONTENT.title}
    </p>
    <p className="opacity-60 text-sm">
      type <span className="text-[var(--term-fg)]">help</span> to see available
      commands, or click the shortcuts above.
    </p>
  </div>
);

const COMMAND_NAMES = Object.keys(COMMANDS);
const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export default function Terminal() {
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [input, setInput] = useState("");
  const [entries, setEntries] = useState<OutputEntry[]>([
    { id: uid(), output: WELCOME },
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);
  const typingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cmdHistoryRef = useRef<string[]>([]);

  useEffect(() => {
    cmdHistoryRef.current = cmdHistory;
  }, [cmdHistory]);

  useEffect(() => {
    applyTheme(loadSavedTheme());
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [entries]);

  const clearFn = useCallback(() => setEntries([]), []);

  const handleSubmit = useCallback(
    async (cmd: string) => {
      const trimmed = cmd.trim();
      if (!trimmed) return;

      const parts = trimmed.split(/\s+/);
      const name = parts[0].toLowerCase();
      const args = parts.slice(1);

      setEntries((prev) => [
        ...prev,
        { id: uid(), command: trimmed, output: null },
      ]);
      setInput("");
      setCmdHistory((prev) => [trimmed, ...prev]);
      setHistoryIndex(-1);

      const handler = COMMANDS[name];
      if (!handler) {
        setEntries((prev) => [
          ...prev,
          {
            id: uid(),
            output: (
              <p className="my-1 text-[var(--term-error)]">
                command not found: {name} — type{" "}
                <span className="text-[var(--term-fg)]">help</span> for
                available commands.
              </p>
            ),
          },
        ]);
        return;
      }

      const ctx = {
        clear: clearFn,
        getHistory: () => cmdHistoryRef.current,
      };

      try {
        const result = await Promise.resolve(handler(args, ctx));
        if (result !== null) {
          setEntries((prev) => [...prev, { id: uid(), output: result }]);
        }
      } catch {
        setEntries((prev) => [
          ...prev,
          {
            id: uid(),
            output: (
              <p className="my-1 text-[var(--term-error)]">
                error running command: {name}
              </p>
            ),
          },
        ]);
      }
    },
    [clearFn]
  );

  const handleQuickLink = useCallback(
    (cmd: string) => {
      if (typingRef.current) clearInterval(typingRef.current);
      setInput("");
      let i = 0;
      typingRef.current = setInterval(() => {
        i++;
        setInput(cmd.slice(0, i));
        if (i >= cmd.length) {
          clearInterval(typingRef.current!);
          typingRef.current = null;
          setTimeout(() => handleSubmit(cmd), 150);
        }
      }, 55);
    },
    [handleSubmit]
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        const newIndex = Math.min(historyIndex + 1, cmdHistory.length - 1);
        setHistoryIndex(newIndex);
        setInput(cmdHistory[newIndex] ?? "");
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        const newIndex = Math.max(historyIndex - 1, -1);
        setHistoryIndex(newIndex);
        setInput(newIndex === -1 ? "" : cmdHistory[newIndex]);
      }
    },
    [historyIndex, cmdHistory]
  );

  return (
    <div className="h-[100dvh] w-screen bg-[var(--term-bg)] text-[var(--term-fg)] font-mono flex flex-col p-3 sm:p-6 overflow-hidden text-xs sm:text-sm md:text-base">
      <QuickLinks onCommand={handleQuickLink} />
      <div className="flex-1 overflow-y-auto">
        {entries.map((entry) => (
          <div key={entry.id}>
            {entry.command !== undefined && (
              <div className="flex gap-2 flex-wrap">
                <span className="text-[var(--term-accent)] shrink-0">
                  {CONTENT.prompt}
                </span>
                <span>{entry.command}</span>
              </div>
            )}
            {entry.output !== null && (
              <OutputLine>{entry.output}</OutputLine>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <CommandInput
        value={input}
        onChange={setInput}
        onSubmit={handleSubmit}
        onKeyDown={handleKeyDown}
        prompt={CONTENT.prompt}
        commands={COMMAND_NAMES}
      />
    </div>
  );
}
