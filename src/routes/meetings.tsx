import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowRight, Copy, NotebookPen, RotateCw, Save, Sparkles, Trash2 } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { summarizeMeeting } from "@/lib/ai.functions";
import type { MeetingResult } from "@/lib/ai-schemas";
import { saveHistory, setPlannerHandoff } from "@/lib/history";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — WorkFlow AI" },
      {
        name: "description",
        content:
          "Turn raw meeting notes into a summary, key decisions and action items with owners and deadlines — without invented details.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer — WorkFlow AI" },
      {
        property: "og:description",
        content: "Structured meeting summaries, decisions and action items you can verify.",
      },
    ],
  }),
  component: MeetingsPage,
});

const DEMO_NOTES = `Weekly project team meeting. Thabo opened with a status update: the research phase is done and the data set has been cleaned.
Team agreed to move the demo to next Thursday because the client rescheduled.
Sarah will prepare the presentation by Friday.
Naledi raised concerns about the testing timeline - no decision was made yet.
Budget for extra cloud credits still needs approval from finance.
We agreed the final report structure follows the university template.`;

function Section({ title, items, note }: { title: string; items: string[]; note?: string }) {
  return (
    <div>
      <h3 className="text-sm font-semibold">{title}</h3>
      {note ? <p className="text-xs text-muted-foreground">{note}</p> : null}
      {items.length ? (
        <ul className="mt-2 space-y-1.5 text-sm">
          {items.map((i) => (
            <li key={i} className="flex gap-2">
              <span className="text-primary">•</span>
              <span>{i}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-muted-foreground">Not specified in the notes.</p>
      )}
    </div>
  );
}

function MeetingsPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [attendees, setAttendees] = useState("");
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState<MeetingResult | null>(null);
  const [summary, setSummary] = useState("");

  const run = useServerFn(summarizeMeeting);
  const mutation = useMutation({
    mutationFn: () => run({ data: { title, date, attendees, notes } }),
    onSuccess: (data) => {
      setResult(data);
      setSummary(data.summary);
    },
  });

  const loadDemo = () => {
    setTitle("Weekly Project Team Meeting");
    setDate(new Date().toISOString().slice(0, 10));
    setAttendees("Thabo, Sarah, Naledi, Lesego");
    setNotes(DEMO_NOTES);
  };

  const clearAll = () => {
    setTitle("");
    setDate("");
    setAttendees("");
    setNotes("");
    setResult(null);
    setSummary("");
    mutation.reset();
  };

  const copy = async () => {
    if (!result) return;
    const text = [
      `Meeting: ${title || "Not specified"}`,
      `Date: ${date || "Not specified"}`,
      `Attendees: ${attendees || "Not specified"}`,
      "",
      `Summary:\n${summary}`,
      "",
      `Key decisions:\n${result.keyDecisions.map((d) => `- ${d}`).join("\n") || "- Not specified"}`,
      "",
      `Action items:\n${
        result.actionItems
          .map((a) => `- ${a.task} | ${a.owner} | ${a.deadline} | ${a.priority}`)
          .join("\n") || "- Not specified"
      }`,
    ].join("\n");
    await navigator.clipboard.writeText(text);
    toast.success("Summary copied to clipboard");
  };

  const save = () => {
    if (!result) return;
    saveHistory({
      kind: "meeting",
      title: title || "Untitled meeting",
      preview: `${result.keyDecisions.length} decisions · ${result.actionItems.length} action items`,
      status: "Summarised",
      payload: { ...result, summary },
    });
    toast.success("Saved to history");
  };

  const sendToPlanner = () => {
    if (!result?.actionItems.length) return;
    setPlannerHandoff(
      result.actionItems.map((a) => ({
        description: a.task,
        deadline: a.deadline === "Not specified" ? "" : a.deadline,
        owner: a.owner,
        priority: a.priority,
      })),
    );
    toast.success("Action items sent to the Task Planner");
    void navigate({ to: "/planner" });
  };

  return (
    <AppShell
      title="Meeting Notes Summarizer"
      description="Structured summaries, decisions and action items"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Meeting input</CardTitle>
            <CardDescription>
              Only what appears in your notes is extracted. Anything absent is marked “Not
              specified”.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Meeting title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Meeting date</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="attendees">Attendees</Label>
              <Input
                id="attendees"
                value={attendees}
                onChange={(e) => setAttendees(e.target.value)}
                placeholder="Comma separated"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Meeting notes *</Label>
              <Textarea
                id="notes"
                rows={12}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Paste your raw notes exactly as you took them."
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => mutation.mutate()} disabled={notes.trim().length < 10 || mutation.isPending}>
                <NotebookPen className="size-4" /> Summarize Meeting
              </Button>
              <Button variant="outline" onClick={loadDemo}>
                <Sparkles className="size-4" /> Load demo
              </Button>
              <Button variant="ghost" onClick={clearAll}>
                <Trash2 className="size-4" /> Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Structured output</CardTitle>
              <CardDescription>Editable summary — verify before circulating.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {mutation.isPending ? (
                <LoadingState label="Structuring your meeting notes…" />
              ) : mutation.isError ? (
                <ErrorState
                  message={(mutation.error as Error).message}
                  onRetry={() => mutation.mutate()}
                />
              ) : result ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="summary">Meeting summary</Label>
                    <Textarea
                      id="summary"
                      rows={4}
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                    />
                  </div>

                  <Section title="Key decisions" items={result.keyDecisions} />

                  <div>
                    <h3 className="text-sm font-semibold">Action items</h3>
                    {result.actionItems.length ? (
                      <div className="mt-2 overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Task</TableHead>
                              <TableHead>Owner</TableHead>
                              <TableHead>Deadline</TableHead>
                              <TableHead>Priority</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {result.actionItems.map((a, i) => (
                              <TableRow key={`${a.task}-${i}`}>
                                <TableCell className="min-w-40">{a.task}</TableCell>
                                <TableCell className="text-muted-foreground">{a.owner}</TableCell>
                                <TableCell className="text-muted-foreground">
                                  {a.deadline}
                                </TableCell>
                                <TableCell>
                                  <Badge variant="secondary">{a.priority}</Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <p className="mt-2 text-sm text-muted-foreground">
                        No action items were stated in the notes.
                      </p>
                    )}
                  </div>

                  <Section title="Important discussion points" items={result.discussionPoints} />
                  <Section title="Unresolved issues / follow-ups" items={result.unresolved} />
                  <MissingInfoNotice items={result.missingInformation} />
                  {result.recommendations.length ? (
                    <Section
                      title="AI recommendations"
                      note="Interpretation by the AI — not stated in your notes."
                      items={result.recommendations}
                    />
                  ) : null}

                  <div className="flex flex-wrap gap-2">
                    <Button onClick={sendToPlanner} disabled={!result.actionItems.length}>
                      Add Action Items to Task Planner <ArrowRight className="size-4" />
                    </Button>
                    <Button variant="outline" onClick={copy}>
                      <Copy className="size-4" /> Copy
                    </Button>
                    <Button variant="outline" onClick={() => mutation.mutate()}>
                      <RotateCw className="size-4" /> Regenerate
                    </Button>
                    <Button variant="outline" onClick={save}>
                      <Save className="size-4" /> Save
                    </Button>
                  </div>
                </>
              ) : (
                <EmptyState
                  title="No summary yet"
                  description="Paste your raw meeting notes on the left and click Summarize Meeting."
                  hints={[
                    "Include who said what where possible — owners are only extracted when stated.",
                    "Deadlines are copied exactly as written, e.g. “by Friday”.",
                    "Missing details are reported, never guessed.",
                  ]}
                />
              )}
            </CardContent>
          </Card>
          <Disclaimer />
        </div>
      </div>
    </AppShell>
  );
}
