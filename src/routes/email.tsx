import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Copy, RotateCw, Save, Sparkles, Trash2, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Disclaimer, EmptyState, ErrorState, LoadingState, MissingInfoNotice } from "@/components/states";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateEmail } from "@/lib/ai.functions";
import type { EmailResult } from "@/lib/ai-schemas";
import { saveHistory } from "@/lib/history";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — WorkFlow AI" },
      {
        name: "description",
        content:
          "Generate professional workplace emails with a chosen tone and length, then edit, copy and save the draft.",
      },
      { property: "og:title", content: "Smart Email Generator — WorkFlow AI" },
      {
        property: "og:description",
        content: "AI-drafted workplace emails you can review, edit and send with confidence.",
      },
    ],
  }),
  component: EmailPage,
});

const TONES = ["Formal", "Professional", "Friendly", "Persuasive", "Apologetic", "Concise"];
const LENGTHS = ["Short", "Medium", "Detailed"];

const DEMO = {
  purpose: "Request a short extension for the final project submission",
  recipient: "Dr. Mokoena, module coordinator. I am a final-year student on the ICT project module.",
  keyPoints:
    "- Project is 80% complete\n- Delayed by a hardware failure last week\n- Requesting 3 extra days\n- Willing to submit progress evidence",
  callToAction: "Ask for confirmation of the new submission date",
};

function EmailPage() {
  const [purpose, setPurpose] = useState("");
  const [recipient, setRecipient] = useState("");
  const [keyPoints, setKeyPoints] = useState("");
  const [tone, setTone] = useState("Professional");
  const [length, setLength] = useState("Medium");
  const [callToAction, setCallToAction] = useState("");

  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [result, setResult] = useState<EmailResult | null>(null);

  const run = useServerFn(generateEmail);
  const mutation = useMutation({
    mutationFn: () =>
      run({ data: { purpose, recipient, keyPoints, tone, length, callToAction } }),
    onSuccess: (data) => {
      setResult(data);
      setSubject(data.subject);
      setBody(data.body);
    },
  });

  const loadDemo = () => {
    setPurpose(DEMO.purpose);
    setRecipient(DEMO.recipient);
    setKeyPoints(DEMO.keyPoints);
    setCallToAction(DEMO.callToAction);
    setTone("Formal");
    setLength("Medium");
  };

  const clearAll = () => {
    setPurpose("");
    setRecipient("");
    setKeyPoints("");
    setCallToAction("");
    setResult(null);
    setSubject("");
    setBody("");
    mutation.reset();
  };

  const copy = async () => {
    await navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`);
    toast.success("Email copied to clipboard");
  };

  const save = () => {
    saveHistory({
      kind: "email",
      title: subject || "Untitled email",
      preview: body.slice(0, 140),
      status: "Draft saved",
      payload: { subject, body },
    });
    toast.success("Saved to history");
  };

  const canGenerate = purpose.trim().length > 2 && !mutation.isPending;

  return (
    <AppShell
      title="Smart Email Generator"
      description="Create professional workplace emails in seconds"
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Email details</CardTitle>
            <CardDescription>
              The AI uses only what you enter here. It will not invent names, dates or facts.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="purpose">Email purpose *</Label>
              <Input
                id="purpose"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="e.g. Request a deadline extension"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient / context</Label>
              <Textarea
                id="recipient"
                rows={2}
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Who are you writing to, and what is your relationship to them?"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="points">Key points to communicate</Label>
              <Textarea
                id="points"
                rows={5}
                value={keyPoints}
                onChange={(e) => setKeyPoints(e.target.value)}
                placeholder="One point per line"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TONES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Length</Label>
                <Select value={length} onValueChange={setLength}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LENGTHS.map((l) => (
                      <SelectItem key={l} value={l}>
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cta">Call to action (optional)</Label>
              <Input
                id="cta"
                value={callToAction}
                onChange={(e) => setCallToAction(e.target.value)}
                placeholder="e.g. Confirm the new submission date"
              />
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              <Button onClick={() => mutation.mutate()} disabled={!canGenerate}>
                <Wand2 className="size-4" /> Generate Email
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
              <CardTitle className="text-base">AI draft</CardTitle>
              <CardDescription>Editable output — review before sending.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mutation.isPending ? (
                <LoadingState label="Drafting your email…" />
              ) : mutation.isError ? (
                <ErrorState
                  message={(mutation.error as Error).message}
                  onRetry={() => mutation.mutate()}
                />
              ) : result ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Suggested subject</Label>
                    <Input
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="body">Email body</Label>
                    <Textarea
                      id="body"
                      rows={14}
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                    />
                  </div>
                  <MissingInfoNotice items={result.missingInformation} />
                  {result.notes.length ? (
                    <div className="rounded-xl border border-border bg-muted/40 px-4 py-3">
                      <p className="text-sm font-semibold">AI suggestions</p>
                      <p className="text-xs text-muted-foreground">
                        Recommendations, not facts from your input.
                      </p>
                      <ul className="mt-2 space-y-1 text-sm">
                        {result.notes.map((n) => (
                          <li key={n} className="flex gap-2">
                            <span className="text-muted-foreground">•</span>
                            <span>{n}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" onClick={copy}>
                      <Copy className="size-4" /> Copy
                    </Button>
                    <Button variant="outline" onClick={() => mutation.mutate()}>
                      <RotateCw className="size-4" /> Regenerate
                    </Button>
                    <Button onClick={save}>
                      <Save className="size-4" /> Save to history
                    </Button>
                  </div>
                </>
              ) : (
                <EmptyState
                  title="No email generated yet"
                  description="Fill in the purpose and your key points, then choose a tone and length."
                  hints={[
                    "Be specific about what you want the recipient to do.",
                    "List facts as bullet points — the AI will not add anything you did not write.",
                    "Never include confidential workplace information.",
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
