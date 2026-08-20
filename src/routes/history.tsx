import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Clock, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Disclaimer, EmptyState } from "@/components/states";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { deleteHistory, formatWhen, getHistory, type HistoryItem } from "@/lib/history";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "History — WorkFlow AI" },
      {
        name: "description",
        content:
          "Review previously generated emails, meeting summaries and task plans saved on this device.",
      },
      { property: "og:title", content: "History — WorkFlow AI" },
      {
        property: "og:description",
        content: "Your saved WorkFlow AI activity: emails, meetings and task plans.",
      },
    ],
  }),
  component: HistoryPage,
});

const LABEL: Record<HistoryItem["kind"], string> = {
  email: "Email",
  meeting: "Meeting",
  task: "Task plan",
};

const LINK: Record<HistoryItem["kind"], "/email" | "/meetings" | "/planner"> = {
  email: "/email",
  meeting: "/meetings",
  task: "/planner",
};

function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [filter, setFilter] = useState<"all" | HistoryItem["kind"]>("all");

  const refresh = () => setItems(getHistory());
  useEffect(() => {
    refresh();
    window.addEventListener("workflow-ai:history-changed", refresh);
    return () => window.removeEventListener("workflow-ai:history-changed", refresh);
  }, []);

  const shown = filter === "all" ? items : items.filter((i) => i.kind === filter);

  return (
    <AppShell title="History" description="Everything WorkFlow AI has generated for you">
      <div className="space-y-6">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="email">Emails</TabsTrigger>
            <TabsTrigger value="meeting">Meetings</TabsTrigger>
            <TabsTrigger value="task">Tasks</TabsTrigger>
          </TabsList>
        </Tabs>

        {shown.length ? (
          <div className="grid gap-3">
            {shown.map((item) => (
              <Card key={item.id}>
                <CardContent className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary">{LABEL[item.kind]}</Badge>
                      {item.demo ? <Badge variant="outline">Demo data</Badge> : null}
                      <span className="text-sm font-medium">{item.title}</span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {item.preview}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="size-3" /> {formatWhen(item.createdAt)} · {item.status}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link to={LINK[item.kind]}>View</Link>
                    </Button>
                    {item.demo ? null : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          deleteHistory(item.id);
                          refresh();
                          toast.success("Item deleted");
                        }}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Nothing here yet"
            description="Generate an email, summarise a meeting or plan your tasks and save the result to see it here."
          />
        )}

        <Disclaimer />
      </div>
    </AppShell>
  );
}
