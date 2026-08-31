"use client";

import type { EmailDraft } from "@/lib/types";

/**
 * The email preview shown before anything is sent.
 *
 * The buttons send the literal words "yes" and "no", because that's exactly what
 * the backend's confirmation check looks for. Typing them by hand works the same
 * way — the buttons are a shortcut, not a separate path, so there's only ever one
 * way an email actually gets sent.
 */
interface EmailDraftCardProps {
  draft: EmailDraft;
  disabled: boolean;
  onRespond: (answer: string) => void;
}

export function EmailDraftCard({ draft, disabled, onRespond }: EmailDraftCardProps) {
  return (
    <div className="rounded-xl border border-accent/40 bg-accent-soft p-4">
      <p className="mb-3 text-xs font-medium uppercase tracking-wide text-accent">
        Ready to send
      </p>

      <dl className="space-y-2 text-sm">
        <div className="flex gap-2">
          <dt className="w-16 shrink-0 text-muted">Subject</dt>
          <dd className="font-medium">{draft.subject}</dd>
        </div>
        {draft.visitor_email && (
          <div className="flex gap-2">
            <dt className="w-16 shrink-0 text-muted">From</dt>
            <dd>
              {draft.visitor_name ? `${draft.visitor_name} · ` : ""}
              {draft.visitor_email}
            </dd>
          </div>
        )}
        <div className="flex gap-2">
          <dt className="w-16 shrink-0 text-muted">Message</dt>
          {/* whitespace-pre-wrap keeps the visitor's line breaks intact. */}
          <dd className="whitespace-pre-wrap leading-relaxed">{draft.message}</dd>
        </div>
      </dl>

      <div className="mt-4 flex gap-2">
        <button
          type="button"
          disabled={disabled}
          onClick={() => onRespond("yes")}
          className="rounded-lg bg-accent px-4 py-1.5 text-sm font-medium text-background transition disabled:opacity-40"
        >
          Send
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => onRespond("no")}
          className="rounded-lg border border-border px-4 py-1.5 text-sm transition hover:border-accent disabled:opacity-40"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
