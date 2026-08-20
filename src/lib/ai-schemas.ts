import { z } from "zod";

export const emailInputSchema = z.object({
  purpose: z.string().min(3, "Describe the purpose of the email"),
  recipient: z.string().default(""),
  keyPoints: z.string().default(""),
  tone: z.string().default("Professional"),
  length: z.string().default("Medium"),
  callToAction: z.string().optional(),
});

export const meetingInputSchema = z.object({
  title: z.string().default(""),
  date: z.string().default(""),
  attendees: z.string().default(""),
  notes: z.string().min(10, "Paste the meeting notes"),
});

export const plannerInputSchema = z.object({
  currentDate: z.string().min(4),
  workingHours: z.string().default(""),
  horizon: z.string().default("Daily"),
  tasks: z
    .array(
      z.object({
        description: z.string().min(2),
        deadline: z.string().optional(),
        importance: z.string().default("Medium"),
        urgency: z.string().default("Medium"),
        duration: z.string().optional(),
        dependencies: z.string().optional(),
      }),
    )
    .min(1, "Add at least one task"),
});

export type EmailFormInput = z.infer<typeof emailInputSchema>;
export type MeetingFormInput = z.infer<typeof meetingInputSchema>;
export type PlannerFormInput = z.infer<typeof plannerInputSchema>;

export interface EmailResult {
  subject: string;
  body: string;
  missingInformation: string[];
  notes: string[];
}

export interface ActionItem {
  task: string;
  owner: string;
  deadline: string;
  priority: string;
}

export interface MeetingResult {
  summary: string;
  keyDecisions: string[];
  actionItems: ActionItem[];
  discussionPoints: string[];
  unresolved: string[];
  missingInformation: string[];
  recommendations: string[];
}

export interface PlannerResult {
  priorityRanking: Array<{
    rank: number;
    task: string;
    priority: string;
    deadline: string;
    overdue: boolean;
    reason: string;
  }>;
  schedule: Array<{
    date: string;
    day: string;
    blocks: Array<{ time: string; task: string; duration: string }>;
  }>;
  taskBreakdown: Array<{ task: string; steps: string[] }>;
  warnings: string[];
  missingInformation: string[];
}
