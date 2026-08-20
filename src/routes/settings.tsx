import { createFileRoute } from "@tanstack/react-router";
import { EyeOff, ShieldCheck, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Disclaimer } from "@/components/states";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { clearHistory } from "@/lib/history";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — WorkFlow AI" },
      {
        name: "description",
        content:
          "Responsible AI guidance, privacy guidance and local history controls for WorkFlow AI.",
      },
      { property: "og:title", content: "Settings — WorkFlow AI" },
      {
        property: "og:description",
        content: "Responsible AI and privacy guidance, plus clearing your locally stored activity.",
      },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <AppShell title="Settings" description="Responsible AI, privacy and stored activity">
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <ShieldCheck className="size-5" />
            </span>
            <CardTitle className="mt-3 text-base">Responsible AI</CardTitle>
            <CardDescription>How WorkFlow AI expects to be used.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              AI-generated content may contain errors or omissions. Every output in WorkFlow AI is a
              draft that requires human review before it is sent, shared or acted on.
            </p>
            <p>
              The assistant is instructed never to fabricate names, dates, decisions or commitments.
              When information is missing it says so instead of guessing.
            </p>
            <p>AI assists your decision-making — it does not replace your judgement.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
              <EyeOff className="size-5" />
            </span>
            <CardTitle className="mt-3 text-base">Privacy guidance</CardTitle>
            <CardDescription>What not to paste into WorkFlow AI.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              Do not enter confidential or sensitive workplace information such as client contracts,
              personal data, credentials, salary details or unpublished financials.
            </p>
            <p>
              Saved activity is stored locally in this browser only. Clearing your browser data
              removes it.
            </p>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Clear history</CardTitle>
            <CardDescription>
              Removes all activity you saved on this device. Built-in demo examples remain so the
              app still shows how it works.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="destructive"
              onClick={() => {
                clearHistory();
                toast.success("Local history cleared");
              }}
            >
              <Trash2 className="size-4" /> Clear saved history
            </Button>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <Disclaimer />
        </div>
      </div>
    </AppShell>
  );
}
