import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { AlertTriangle, CalendarClock, Copy, Plus, RotateCw, Save, Sparkles, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import {
  Disclaimer,
  EmptyState,
  ErrorState,
  LoadingState,
  MissingInfoNotice,
} from "@/components/states";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { planTasks } from "@/lib/ai.functions";
import type { PlannerResult } from "@/lib/ai-schemas";
import { saveHistory, takePlannerHandoff } from "@/lib/history";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — WorkFlow AI" },
      {
        name: "description",
        content:
          "Prioritise workplace tasks by urgency, importance and deadlines, and get a realistic daily or weekly schedule from today's date.",
      },
      { property: "og:title", content: "AI Task Planner — WorkFlow AI" },
      {
        property: "og:description",
        content: "Priority ranking, a realistic schedule and task breakdowns you can adjust.",
      },
    ],
  }),
  component: PlannerPage,
});

interface TaskRow {
  id: string;
  description: string;
  deadline: string;
  importance: string;
  urgency: string;
  duration: string;
  dependencies: string;
}

const LEVELS = ["High", "Medium", "Low"];

const emptyTask = (): TaskRow => ({
  id: `t-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  description: "",
  deadline: "",
  importance: "Medium",
  urgency: "Medium",
  duration: "",
  dependencies: "",
});

const DEMO_TASKS = [
  { description: "Complete project research", duration: "4 hours", importance: "High", urgency: "High" },
  { description: "Prepare presentation", duration: "3 hours", importance: "High", urgency: "Medium" },
  { description: "Review final report", duration: "2 hours", importance: "Medium", urgency: "Medium" },
  { description: "Submit project", duration: "30 minutes", importance: "High", urgency: "High" },
];

function PlannerPage() {
  const [tasks, setTasks] = useState<TaskRow[]>([emptyTask()]);
  const [workingHours, setWorkingHours] = useState("09:00–17:00, Monday to Friday");
  const [horizon, setHorizon] = useState("Weekly");
  const [today, setToday] = useState("");
  const [result, setResult] = useState<PlannerResult | null>(null);

  useEffect(() => {
    setToday(new Date().toLocaleDateString("en-CA"));
    const handoff = takePlannerHandoff();
    if (handoff.length) {
      setTasks(
        handoff.map((h) => ({
          ...emptyTask(),
          id: `t-${Math.random().toString(36).slice(2, 8)}`,
          description: h.description,
          deadline: h.deadline,
          importance: LEVELS.includes(h.priority) ? h.priority : "Medium",
        })),
      );
      toast.success("Action items imported from your meeting summary");
    }
  }, []);

  const update = (id: string, patch: Partial<TaskRow>) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));

  const run = useServerFn(planTasks);
  const mutation = useMutation({
    mutationFn: () =>
      run({
        data: {
          currentDate: today,
          workingHours,
          horizon,
          tasks: tasks
            .filter((t) => t.description.trim().length > 1)
            .map((t) => ({
              description: t.description,
              deadline: t.deadline,
              importance: t.importance,
              urgency: t.urgency,
              duration: t.duration,
              dependencies: t.dependencies,
            })),
        },
      }),
    onSuccess: setResult,
  });

  const loadDemo = () => {
    const base = new Date();
    setTasks(
      DEMO_TASKS.map((d, i) => {
        const due = new Date(base);
        due.setDate(due.getDate() + (i + 1) * 2);
        return {
          ...emptyTask(),
          id: `demo-${i}`,
          description: d.description,
          duration: d.duration,
          importance: d.importance,
          urgency: d.urgency,
          deadline: due.toLocaleDateString("en-CA"),
          dependencies: i === 3 ? "Review final report" : "",
        };
      }),
    );
  };

  const copy = async () => {
    if (!result) return;
    const text = result.schedule
      .map(
        (d) =>
          `${d.date} (${d.day})\n${d.blocks.map((b) => `  ${b.time} — ${b.task} (${b.duration})`).join("\n")}`,
      )
      .join("\n\n");
    await navigator.clipboard.writeText(text);
    toast.success("Schedule copied to clipboard");
  };

  const save = () => {
    if (!result) return;
    saveHistory({
      kind: "task",
      title: `${horizon} plan · ${result.priorityRanking.length} tasks`,
      preview: result.priorityRanking
        .slice(0, 3)
        .map((p) => p.task)
        .join(", "),
      status: "Planned",
      payload: result,
    });
    toast.success("Plan saved to history");
  };

  const validTasks = tasks.filter((t) => t.description.trim().length > 1).length;

  return (
    <AppShell title="AI Task Planner" description="Prioritised tasks and a realistic schedule">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Your tasks</CardTitle>
            <CardDescription>
              Today’s date is detected automatically from your device:{" "}
              <span className="font-medium text-foreground">{today || "detecting…"}</span>. Nothing
              is scheduled before it.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="hours">Available working hours</Label>
                <Input
                  id="hours"
                  value={workingHours}
                  onChange={(e) => setWorkingHours(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Planning horizon</Label>
                <Select value={horizon} onValueChange={setHorizon}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Daily">Daily</SelectItem>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              {tasks.map((t, index) => (
                <div key={t.id} className="rounded-xl border border-border p-4">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase">
                      Task {index + 1}
                    </p>
                    {tasks.length > 1 ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Remove task"
                        onClick={() => setTasks((p) => p.filter((x) => x.id !== t.id))}
                      >
                        <X className="size-4" />
                      </Button>
                    ) : null}
                  </div>
                  <div className="mt-3 grid gap-3 md:grid-cols-2">
                    <div className="space-y-2 md:col-span-2">
                      <Label>Task description</Label>
                      <Input
                        value={t.description}
                        onChange={(e) => update(t.id, { description: e.target.value })}
                        placeholder="e.g. Prepare presentation"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Deadline</Label>
                      <Input
                        value={t.deadline}
                        onChange={(e) => update(t.id, { deadline: e.target.value })}
                        placeholder="YYYY-MM-DD or leave blank"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Estimated duration</Label>
                      <Input
                        value={t.duration}
                        onChange={(e) => update(t.id, { duration: e.target.value })}
                        placeholder="e.g. 2 hours"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Importance</Label>
                      <Select
                        value={t.importance}
                        onValueChange={(v) => update(t.id, { importance: v })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {LEVELS.map((l) => (
                            <SelectItem key={l} value={l}>
                              {l}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Urgency</Label>
                      <Select value={t.urgency} onValueChange={(v) => update(t.id, { urgency: v })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {LEVELS.map((l) => (
                            <SelectItem key={l} value={l}>
                              {l}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Dependencies (optional)</Label>
                      <Input
                        value={t.dependencies}
                        onChange={(e) => update(t.id, { dependencies: e.target.value })}
                        placeholder="Tasks that must be done first"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => setTasks((p) => [...p, emptyTask()])}>
                <Plus className="size-4" /> Add task
              </Button>
              <Button
                onClick={() => mutation.mutate()}
                disabled={!validTasks || !today || mutation.isPending}
              >
                <CalendarClock className="size-4" /> Plan Tasks
              </Button>
              <Button variant="outline" onClick={loadDemo}>
                <Sparkles className="size-4" /> Load demo tasks
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setTasks([emptyTask()]);
                  setResult(null);
                  mutation.reset();
                }}
              >
                <Trash2 className="size-4" /> Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">AI recommendation</CardTitle>
            <CardDescription>
              A suggested plan you can review and modify — not a guaranteed optimal schedule.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {mutation.isPending ? (
              <LoadingState label="Prioritising tasks and building your schedule…" />
            ) : mutation.isError ? (
              <ErrorState
                message={(mutation.error as Error).message}
                onRetry={() => mutation.mutate()}
              />
            ) : result ? (
              <>
                {result.warnings.length ? (
                  <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3">
                    <p className="flex items-center gap-2 text-sm font-semibold text-destructive">
                      <AlertTriangle className="size-4" /> Flags
                    </p>
                    <ul className="mt-2 space-y-1 text-sm">
                      {result.warnings.map((w) => (
                        <li key={w}>• {w}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <div>
                  <h3 className="text-sm font-semibold">Priority ranking</h3>
                  <div className="mt-2 space-y-2">
                    {result.priorityRanking.map((p) => (
                      <div
                        key={`${p.rank}-${p.task}`}
                        className="flex flex-col gap-1 rounded-xl border border-border p-3 sm:flex-row sm:items-start sm:justify-between"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium">
                            {p.rank}. {p.task}
                          </p>
                          <p className="text-xs text-muted-foreground">{p.reason}</p>
                        </div>
                        <div className="flex shrink-0 flex-wrap items-center gap-2">
                          <Badge variant="secondary">{p.priority}</Badge>
                          <Badge variant="outline">Due: {p.deadline}</Badge>
                          {p.overdue ? <Badge variant="destructive">Overdue</Badge> : null}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold">Recommended schedule</h3>
                  <div className="mt-2 grid gap-3 md:grid-cols-2">
                    {result.schedule.map((d) => (
                      <div key={d.date} className="rounded-xl border border-border p-4">
                        <p className="text-sm font-semibold">
                          {d.day} · {d.date}
                        </p>
                        <ul className="mt-2 space-y-2">
                          {d.blocks.map((b, i) => (
                            <li key={`${b.time}-${i}`} className="text-sm">
                              <span className="font-medium">{b.time}</span> — {b.task}{" "}
                              <span className="text-xs text-muted-foreground">({b.duration})</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {result.taskBreakdown.length ? (
                  <div>
                    <h3 className="text-sm font-semibold">Task breakdown</h3>
                    <div className="mt-2 grid gap-3 md:grid-cols-2">
                      {result.taskBreakdown.map((t) => (
                        <div key={t.task} className="rounded-xl border border-border p-4">
                          <p className="text-sm font-medium">{t.task}</p>
                          <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
                            {t.steps.map((s) => (
                              <li key={s}>{s}</li>
                            ))}
                          </ol>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                <MissingInfoNotice items={result.missingInformation} />

                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" onClick={copy}>
                    <Copy className="size-4" /> Copy schedule
                  </Button>
                  <Button variant="outline" onClick={() => mutation.mutate()}>
                    <RotateCw className="size-4" /> Regenerate
                  </Button>
                  <Button onClick={save}>
                    <Save className="size-4" /> Save plan
                  </Button>
                </div>
              </>
            ) : (
              <EmptyState
                title="No plan generated yet"
                description="Add your tasks with deadlines, importance and estimated duration, then click Plan Tasks."
                hints={[
                  "Leave a field blank if you don't know it — the AI will flag it instead of guessing.",
                  "Deadlines already in the past are flagged as overdue.",
                  "You can import action items straight from a meeting summary.",
                ]}
              />
            )}
          </CardContent>
        </Card>

        <Disclaimer />
      </div>
    </AppShell>
  );
}
