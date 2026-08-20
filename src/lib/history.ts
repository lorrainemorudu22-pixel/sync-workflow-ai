export type HistoryKind = "email" | "meeting" | "task";

export interface HistoryItem {
  id: string;
  kind: HistoryKind;
  title: string;
  preview: string;
  createdAt: string; // ISO
  status: string;
  demo?: boolean;
  payload?: unknown;
}

const KEY = "workflow-ai:history";

export const demoHistory: HistoryItem[] = [
  {
    id: "demo-1",
    kind: "email",
    title: "Request for Project Submission Extension",
    preview:
      "Dear Dr. Mokoena, I am writing to request a short extension for the final project submission...",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    status: "Reviewed",
    demo: true,
  },
  {
    id: "demo-2",
    kind: "email",
    title: "Follow-up email to project team",
    preview: "Thank you all for today's session. Here is a short recap of what we agreed on...",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    status: "Draft",
    demo: true,
  },
  {
    id: "demo-3",
    kind: "meeting",
    title: "Weekly Project Team Meeting",
    preview: "3 decisions · 4 action items · 2 follow-ups",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    status: "Summarised",
    demo: true,
  },
  {
    id: "demo-4",
    kind: "task",
    title: "Complete project presentation",
    preview: "High priority · due Friday · 3h estimated",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    status: "Planned",
    demo: true,
  },
  {
    id: "demo-5",
    kind: "task",
    title: "Prepare internship application",
    preview: "Medium priority · no deadline specified",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    status: "Planned",
    demo: true,
  },
];

function read(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as HistoryItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(items: HistoryItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(items.slice(0, 100)));
  window.dispatchEvent(new Event("workflow-ai:history-changed"));
}

export function getHistory(): HistoryItem[] {
  return [...read(), ...demoHistory].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function saveHistory(item: Omit<HistoryItem, "id" | "createdAt">) {
  const entry: HistoryItem = {
    ...item,
    id: `h-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
  };
  write([entry, ...read()]);
  return entry;
}

export function deleteHistory(id: string) {
  write(read().filter((i) => i.id !== id));
}

export function clearHistory() {
  write([]);
}

/** Hand-off channel: meeting action items -> task planner. */
const HANDOFF_KEY = "workflow-ai:planner-handoff";

export interface HandoffTask {
  description: string;
  deadline: string;
  owner: string;
  priority: string;
}

export function setPlannerHandoff(tasks: HandoffTask[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(HANDOFF_KEY, JSON.stringify(tasks));
}

export function takePlannerHandoff(): HandoffTask[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(HANDOFF_KEY);
  if (!raw) return [];
  window.localStorage.removeItem(HANDOFF_KEY);
  try {
    const parsed = JSON.parse(raw) as HandoffTask[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function formatWhen(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
