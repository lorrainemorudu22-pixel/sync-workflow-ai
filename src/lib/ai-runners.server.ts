import { callAiJson } from "./ai-gateway.server";
import { emailPrompt, meetingPrompt, plannerPrompt } from "./prompts.server";
import type {
  EmailFormInput,
  EmailResult,
  MeetingFormInput,
  MeetingResult,
  PlannerFormInput,
  PlannerResult,
} from "./ai-schemas";

type Raw = Record<string, unknown>;

const g = (o: Raw, k: string): unknown => o[k];

const str = (v: unknown, fallback = "Not specified") =>
  typeof v === "string" && v.trim() ? v.trim() : fallback;

const list = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === "string" && x.trim().length > 0) : [];

const arr = (v: unknown): Raw[] =>
  Array.isArray(v) ? (v.filter((x) => x && typeof x === "object") as Raw[]) : [];

export async function runEmailGeneration(data: EmailFormInput): Promise<EmailResult> {
  const { system, user } = emailPrompt(data);
  const raw = (await callAiJson(system, user)) as Raw;
  return {
    subject: str(g(raw, "subject"), "Suggested subject not provided"),
    body: str(g(raw, "body"), ""),
    missingInformation: list(g(raw, "missingInformation")),
    notes: list(g(raw, "notes")),
  };
}

export async function runMeetingSummary(data: MeetingFormInput): Promise<MeetingResult> {
  const { system, user } = meetingPrompt(data);
  const raw = (await callAiJson(system, user)) as Raw;
  return {
    summary: str(g(raw, "summary")),
    keyDecisions: list(g(raw, "keyDecisions")),
    actionItems: arr(g(raw, "actionItems")).map((a) => ({
      task: str(g(a, "task")),
      owner: str(g(a, "owner")),
      deadline: str(g(a, "deadline")),
      priority: str(g(a, "priority")),
    })),
    discussionPoints: list(g(raw, "discussionPoints")),
    unresolved: list(g(raw, "unresolved")),
    missingInformation: list(g(raw, "missingInformation")),
    recommendations: list(g(raw, "recommendations")),
  };
}

export async function runTaskPlan(data: PlannerFormInput): Promise<PlannerResult> {
  const { system, user } = plannerPrompt(data);
  const raw = (await callAiJson(system, user)) as Raw;
  return {
    priorityRanking: arr(g(raw, "priorityRanking")).map((p, i) => {
      const rank = g(p, "rank");
      return {
        rank: typeof rank === "number" ? rank : i + 1,
        task: str(g(p, "task")),
        priority: str(g(p, "priority")),
        deadline: str(g(p, "deadline")),
        overdue: g(p, "overdue") === true,
        reason: str(g(p, "reason"), ""),
      };
    }),
    schedule: arr(g(raw, "schedule")).map((d) => ({
      date: str(g(d, "date"), ""),
      day: str(g(d, "day"), ""),
      blocks: arr(g(d, "blocks")).map((b) => ({
        time: str(g(b, "time"), ""),
        task: str(g(b, "task")),
        duration: str(g(b, "duration"), ""),
      })),
    })),
    taskBreakdown: arr(g(raw, "taskBreakdown")).map((t) => ({
      task: str(g(t, "task")),
      steps: list(g(t, "steps")),
    })),
    warnings: list(g(raw, "warnings")),
    missingInformation: list(g(raw, "missingInformation")),
  };
}
