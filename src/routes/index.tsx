import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, NotebookPen, ListChecks, ArrowRight, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Disclaimer } from "@/components/states";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getHistory, formatWhen, type HistoryItem } from "@/lib/history";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WorkFlow AI — AI workplace productivity assistant" },
      {
        name: "description",
        content:
          "WorkFlow AI turns workplace information into professional emails, structured meeting summaries and realistic task plans you can review and act on.",
      },
      { property: "og:title", content: "WorkFlow AI — AI workplace productivity assistant" },
      {
        property: "og:description",
        content:
          "Generate professional emails, summarise meeting notes and plan tasks with AI you can review and verify.",
      },
    ],
  }),
  component: Dashboard,
});

const FEATURES = [
  {
    to: "/email" as const,
    icon: Mail,
    title: "Smart Email Generator",
    description: "Create professional workplace emails in seconds with AI.",
    cta: "Generate Email",
  },
  {
    to: "/meetings" as const,
    icon: NotebookPen,
    title: "Meeting Notes Summarizer",
    description: "Turn meeting notes into clear summaries, decisions, and action items.",
    cta: "Summarize Meeting",
  },
  {
    to: "/planner" as const,
    icon: ListChecks,
    title: "AI Task Planner",
    description: "Prioritize tasks and create practical daily or weekly schedules.",
    cta: "Plan Tasks",
  },
];

const KIND_LABEL: Record<HistoryItem["kind"], string> = {
  email: "Email",
  meeting: "Meeting",
  task: "Task plan",
};

const KIND_LINK: Record<HistoryItem["kind"], "/email" | "/meetings" | "/planner"> = {
  email: "/email",
  meeting: "/meetings",
  task: "/planner",
};

function Dashboard() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  useEffect(() => setItems(getHistory()), []);

  const counts = {
    email: items.filter((i) => i.kind === "email").length,
    meeting: items.filter((i) => i.kind === "meeting").length,
    task: items.filter((i) => i.kind === "task").length,
  };

  return (
    <AppShell title="Dashboard" description="Your AI workplace productivity overview">
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold sm:text-3xl">
            Good day! What would you like to accomplish?
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Turn workplace information into clear communication, organized tasks, and actionable
            plans with AI.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {FEATURES.map((f) => (
            <Card key={f.to} className="flex flex-col justify-between">
              <CardHeader>
                <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                  <f.icon className="size-5" />
                </span>
                <CardTitle className="mt-3 text-base">{f.title}</CardTitle>
                <CardDescription>{f.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link to={f.to}>
                    {f.cta} <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </section>

        <section>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Productivity overview
          </h3>
          <div className="mt-3 grid gap-4 sm:grid-cols-3">
            {[
              { label: "Emails Generated", value: counts.email },
              { label: "Meetings Summarized", value: counts.meeting },
              { label: "Tasks Planned", value: counts.task },
            ].map((s) => (
              <Card key={s.label}>
                <CardContent className="py-5">
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="mt-1 font-display text-3xl font-semibold">{s.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Recent activity
            </h3>
            <Button asChild variant="ghost" size="sm">
              <Link to="/history">View all</Link>
            </Button>
          </div>
          <Card className="mt-3">
            <CardContent className="divide-y divide-border p-0">
              {items.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary">{KIND_LABEL[item.kind]}</Badge>
                      {item.demo ? <Badge variant="outline">Demo</Badge> : null}
                      <span className="truncate text-sm font-medium">{item.title}</span>
                    </div>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="size-3" /> {formatWhen(item.createdAt)} · {item.status}
                    </p>
                  </div>
                  <Button asChild variant="outline" size="sm" className="shrink-0">
                    <Link to={KIND_LINK[item.kind]}>View</Link>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <Disclaimer />
      </div>
    </AppShell>
  );
}
