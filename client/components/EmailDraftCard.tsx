"use client";

import { useState } from "react";

export interface EmailDraft {
  subject: string;
  visitor_name?: string;
  visitor_email?: string;
  message: string;
}

interface EmailDraftCardProps {
  draft: EmailDraft;
  onSend?: () => void;
  onCancel?: () => void;
}

export default function EmailDraftCard({
  draft,
  onSend,
  onCancel,
}: EmailDraftCardProps) {
  const [status, setStatus] = useState<"idle" | "sent" | "cancelled">("idle");

  const handleSend = () => {
    setStatus("sent");
    onSend?.();
  };

  const handleCancel = () => {
    setStatus("cancelled");
    onCancel?.();
  };

  if (status === "sent") {
    return (
      <div className="email-draft-card sent">
        <div className="draft-badge success">
          <ion-icon name="checkmark-circle-outline"></ion-icon>
          <span>Message Dispatched</span>
        </div>
        <p className="draft-confirmation-text">
          Email confirmed and sent to Richard! He will get back to you shortly.
        </p>
      </div>
    );
  }

  if (status === "cancelled") {
    return (
      <div className="email-draft-card cancelled">
        <div className="draft-badge cancel">
          <ion-icon name="close-circle-outline"></ion-icon>
          <span>Draft Cancelled</span>
        </div>
        <p className="draft-confirmation-text">
          Draft discarded. Feel free to ask anything else.
        </p>
      </div>
    );
  }

  return (
    <div className="email-draft-card">
      <div className="draft-header">
        <div className="draft-badge">
          <ion-icon name="mail-unread-outline"></ion-icon>
          <span>Ready to send (Confirmation required)</span>
        </div>
      </div>

      <dl className="draft-fields">
        <div className="draft-row">
          <dt className="draft-label">Subject:</dt>
          <dd className="draft-value highlight">{draft.subject}</dd>
        </div>

        {draft.visitor_email && (
          <div className="draft-row">
            <dt className="draft-label">From:</dt>
            <dd className="draft-value">
              {draft.visitor_name ? `${draft.visitor_name} · ` : ""}
              {draft.visitor_email}
            </dd>
          </div>
        )}

        <div className="draft-row column">
          <dt className="draft-label">Message:</dt>
          <dd className="draft-message-box">{draft.message}</dd>
        </div>
      </dl>

      <div className="draft-actions">
        <button
          type="button"
          onClick={handleSend}
          className="draft-btn send-btn"
        >
          <ion-icon name="paper-plane-outline"></ion-icon>
          <span>Send Message</span>
        </button>

        <button
          type="button"
          onClick={handleCancel}
          className="draft-btn cancel-btn"
        >
          <ion-icon name="close-outline"></ion-icon>
          <span>Cancel</span>
        </button>
      </div>
    </div>
  );
}
