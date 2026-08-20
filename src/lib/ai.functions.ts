import { createServerFn } from "@tanstack/react-start";
import { emailInputSchema, meetingInputSchema, plannerInputSchema } from "./ai-schemas";
import { runEmailGeneration, runMeetingSummary, runTaskPlan } from "./ai-runners.server";

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => emailInputSchema.parse(data))
  .handler(async ({ data }) => runEmailGeneration(data));

export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => meetingInputSchema.parse(data))
  .handler(async ({ data }) => runMeetingSummary(data));

export const planTasks = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => plannerInputSchema.parse(data))
  .handler(async ({ data }) => runTaskPlan(data));
