# termfolio

A personal landing page styled as an interactive terminal. Built with Next.js 16, Tailwind CSS v4, and TypeScript. Fully static — deploys to Vercel's free tier with zero config.

## Features

- Interactive terminal UI with command history (↑/↓ arrows) and tab completion
- Commands: `help`, `about`, `projects`, `apps`, `resume`, `contact`, `nvidia-smi`, `history`, `theme`, `clear`
- Clickable quick-link bar for mouse and mobile users — each click animates typing the command
- GitHub public API integration — fetches repos without an auth token
- Three color themes (`green`, `amber`, `slate`) switchable via `theme <name>`, persisted to localStorage
- `/about` — a clean, non-terminal view for non-technical visitors with theme sync
- Custom 404 page styled as a terminal error
- Security headers configured in `next.config.ts`

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router, static export)
- [Tailwind CSS v4](https://tailwindcss.com)
- TypeScript
- [Vercel](https://vercel.com) for hosting

## Project structure

```
app/
  layout.tsx          root layout — fonts, metadata, OG tags
  page.tsx            renders <Terminal /> fullscreen
  not-found.tsx       custom 404 page styled as a terminal error
  globals.css         CSS custom properties for the theme system
  about/
    page.tsx          clean non-terminal view for non-technical visitors
components/
  Terminal.tsx        shell — manages history, output entries, keyboard nav
  CommandInput.tsx    styled prompt with blinking cursor and tab completion
  OutputLine.tsx      wraps rendered command output
  QuickLinks.tsx      clickable pill buttons with typewriter animation
  ThemeProvider.tsx   loads saved theme from localStorage on mount
  ThemeToggle.tsx     cycles through themes, used on the /about page
lib/
  commands.tsx        command registry — maps names to handlers returning ReactNode
  github.ts           fetchGitHubRepos() against the GitHub public API
  themes.ts           theme definitions, applyTheme(), loadSavedTheme()
data/
  content.ts          personal info — name, bio, GitHub username, contact links, resume URL
```

## Adding a command

Add an entry to the `COMMANDS` object in `lib/commands.tsx`:

```ts
mycommand: (args, ctx) => <p>Hello from mycommand</p>,
```

The handler receives `args: string[]` and a `ctx` object with `ctx.clear()` and `ctx.getHistory()`. Return any `ReactNode` — or `null` to produce no output. Async handlers are supported.

## Adding a theme

Add an entry to `THEMES` in `lib/themes.ts` and update the `:root` defaults in `app/globals.css` if you want it as the default.

## Deploying

Push to GitHub and import the repo at [vercel.com](https://vercel.com). Next.js is detected automatically — no configuration needed.
