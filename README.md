# WorkFlow AI

A modern AI-powered workplace productivity assistant that helps students, interns, employees, administrators, and professionals automate common workplace tasks using AI.

## Features

WorkFlow AI combines three core AI-powered workplace tools in one integrated application:

### 1. Smart Email Generator

Create polished workplace emails from a brief description. Choose tone, length, and purpose, then edit the generated subject and body before copying or sending.

- **Tones**: Professional, Formal, Friendly, Persuasive, Apologetic, Concise
- **Lengths**: Short, Medium, Detailed
- **Responsible AI**: Flags missing information and suggests improvements instead of guessing

### 2. Meeting Notes Summarizer

Transform raw meeting notes into a structured record with summary, key decisions, action items, discussion points, unresolved items, and recommendations.

- Extracts action items with owners, deadlines, and priorities
- One-click handoff of action items to the AI Task Planner
- Keeps interpretations separate from extracted facts

### 3. AI Task Planner / Scheduler

Prioritize tasks and build a realistic daily or weekly schedule based on importance, urgency, deadlines, and estimated duration. Uses the browser's current date automatically.

- Priority ranking with reasoning
- Time-blocked schedule suggestions
- Step-by-step task breakdowns
- Overdue and missing-information warnings

## Additional Pages

- **Dashboard**: Quick actions, productivity stats, and recent activity
- **History**: Review past AI-generated outputs (stored locally in your browser)
- **Settings**: App guidance and preferences
- **Responsible AI**: Disclaimers and review reminders throughout the app

## Tech Stack

- **Framework**: [TanStack Start](https://tanstack.com/start)
- **UI Library**: React 19 + TypeScript
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui
- **AI Gateway**: Lovable AI Gateway (`google/gemini-3.7-flash`)
- **Routing**: TanStack Router (file-based)
- **State / History**: Browser localStorage

## Project Structure

```
src/
  components/      # Reusable UI components (AppShell, states, shadcn/ui)
  hooks/           # Custom hooks
  lib/             # AI logic, prompts, schemas, history, utilities
  routes/          # TanStack Start file-based routes
  server.ts        # Server configuration
  start.ts         # App start configuration
  styles.css       # Tailwind v4 theme and design tokens
public/            # Static assets
```

## Key Implementation Details

- **Server-side AI calls**: AI logic is wrapped in `createServerFn` from `@tanstack/react-start` to keep prompts and API keys off the client.
- **Structured prompts**: Each feature uses dedicated system prompts with role, objective, constraints, responsible AI rules, and JSON output schemas.
- **JSON mode**: The AI Gateway is called with `response_format: { type: "json_object" }` for reliable structured output.
- **Action item handoff**: Meeting action items can be transferred directly to the Task Planner via a temporary storage key.
- **History**: Generated results are saved in browser `localStorage` and displayed in the History page.

## Getting Started

### Prerequisites

- Node.js (preferably managed via [nvm](https://github.com/nvm-sh/nvm))
- A Lovable API key (`LOVABLE_API_KEY`) for AI features

### Install and Run

```bash
git clone <this-repository-url>
cd <repository-name>
bun install
bun run dev
```

The dev server starts at `http://localhost:8080`.

### Environment Variables

The project uses the Lovable-managed environment variable:

- `LOVABLE_API_KEY` — Required for AI gateway calls. Do not expose this in the browser.

No additional manual API keys are required when running inside Lovable.

## Development Conventions

- Routes are file-based under `src/routes/`.
- Server functions live in `src/lib/ai.functions.ts` and call helper logic in `src/lib/ai-runners.server.ts`.
- Prompts are centralized in `src/lib/prompts.server.ts`.
- Zod schemas and TypeScript types are defined in `src/lib/ai-schemas.ts`.
- Colors and typography are configured via CSS theme variables in `src/styles.css`.

## Responsible AI

WorkFlow AI is designed as a drafting assistant. AI-generated content should always be reviewed before being sent, shared, or acted upon. The app surfaces responsible AI reminders and flags missing information to reduce reliance on fabricated details.

## License

This project was built with [Lovable](https://lovable.dev). The code is owned by the project creator and can be deployed anywhere.
