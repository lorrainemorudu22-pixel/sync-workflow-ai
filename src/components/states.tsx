import { AlertTriangle, Info, Loader2, RotateCw } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export function LoadingState({ label = "WorkFlow AI is working on it…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-muted/40 px-6 py-14 text-center">
      <Loader2 className="size-6 animate-spin text-primary" />
      <p className="text-sm font-medium">{label}</p>
      <p className="max-w-sm text-xs text-muted-foreground">
        Analysing your input and building a structured draft. This usually takes a few seconds.
      </p>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-5 py-6">
      <p className="flex items-center gap-2 text-sm font-semibold text-destructive">
        <AlertTriangle className="size-4" /> Generation failed
      </p>
      <p className="mt-2 text-sm text-muted-foreground">{message}</p>
      {onRetry ? (
        <Button variant="outline" size="sm" className="mt-4" onClick={onRetry}>
          <RotateCw className="size-4" /> Try again
        </Button>
      ) : null}
    </div>
  );
}

export function EmptyState({
  title,
  description,
  hints,
}: {
  title: string;
  description: string;
  hints?: string[];
}) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-muted/30 px-6 py-12 text-center">
      <span className="mx-auto flex size-10 items-center justify-center rounded-full bg-card text-primary">
        <Info className="size-5" />
      </span>
      <p className="mt-3 text-sm font-semibold">{title}</p>
      <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">{description}</p>
      {hints?.length ? (
        <ul className="mx-auto mt-4 max-w-md space-y-1 text-left text-xs text-muted-foreground">
          {hints.map((h) => (
            <li key={h} className="flex gap-2">
              <span className="text-primary">•</span>
              <span>{h}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function MissingInfoNotice({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <div className="rounded-xl border border-warning/40 bg-warning/10 px-4 py-3">
      <p className="text-sm font-semibold text-foreground">Missing information</p>
      <p className="mt-0.5 text-xs text-muted-foreground">
        The AI did not invent these details. Add them for a stronger result.
      </p>
      <ul className="mt-2 space-y-1 text-sm text-foreground">
        {items.map((i) => (
          <li key={i} className="flex gap-2">
            <span className="text-muted-foreground">•</span>
            <span>{i}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Disclaimer({ children }: { children?: ReactNode }) {
  return (
    <p className="rounded-lg border border-border bg-muted/50 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
      {children ??
        "AI-generated content may contain errors or omissions. Review and verify important information before using it for professional, academic, financial, legal, or other consequential decisions."}
    </p>
  );
}
