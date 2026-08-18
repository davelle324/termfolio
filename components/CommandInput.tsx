"use client";

import React, { KeyboardEvent, useRef, useEffect } from "react";

interface Props {
  value: string;
  onChange: (val: string) => void;
  onSubmit: (val: string) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  prompt: string;
  commands: string[];
}

export default function CommandInput({ value, onChange, onSubmit, onKeyDown, prompt, commands }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSubmit(value);
    } else if (e.key === "Tab") {
      e.preventDefault();
      const trimmed = value.toLowerCase();
      if (!trimmed) return;
      const matches = commands.filter((cmd) => cmd.startsWith(trimmed));
      if (matches.length === 1) {
        onChange(matches[0]);
      } else if (matches.length > 1) {
        const common = matches.reduce((acc, cmd) => {
          let i = 0;
          while (i < acc.length && acc[i] === cmd[i]) i++;
          return acc.slice(0, i);
        }, matches[0]);
        if (common.length > trimmed.length) onChange(common);
      }
    } else {
      onKeyDown?.(e);
    }
  };

  return (
    <div
      className="flex items-center gap-2 pt-2 border-t border-[var(--term-dim)] mt-2"
      onClick={() => inputRef.current?.focus()}
    >
      <span className="text-[var(--term-accent)] shrink-0 select-none">{prompt}</span>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKey}
        className="flex-1 bg-transparent outline-none text-[var(--term-fg)] caret-[var(--term-cursor)]"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        aria-label="terminal input"
      />
    </div>
  );
}
