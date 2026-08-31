/**
 * Shared types.
 *
 * The chat types mirror the backend's request/response shape exactly — see
 * backend/app/models.py. Keeping them in sync matters: the backend is stateless,
 * so getting a field wrong here silently breaks conversations rather than erroring.
 */

export type Role = "user" | "assistant";

export interface ChatMessage {
  role: Role;
  content: string;
}

/** What we send to the backend. */
export interface ChatRequest {
  /** The whole conversation so far — the backend remembers nothing between requests. */
  messages: ChatMessage[];
  /** Echoed back exactly as received; it's signed, so any edit invalidates it. */
  pending_action: EmailDraft | null;
  /** Groups messages into one conversation. Null on the very first request. */
  conversation_id: string | null;
}

/** What the backend sends back. */
export interface ChatResponse {
  reply: string;
  pending_action: EmailDraft | null;
  conversation_id: string | null;
  /** Which tools ran, in order. Drives the character's pose. */
  tools_used: ToolName[];
  /**
   * Added by our own /api/chat route when the backend couldn't be reached or
   * returned a failure. The backend itself never sends this.
   */
  error?: boolean;
}

/** An email waiting for the visitor to confirm or cancel. */
export interface EmailDraft {
  subject: string;
  message: string;
  visitor_name: string;
  visitor_email: string;
  signature: string;
}

/**
 * One update from the streaming endpoint.
 *
 * `tool_start` arrives *before* the tool runs, which is what lets the character
 * change pose while the work is happening rather than after it.
 */
export type StreamEvent =
  | { type: "tool_start"; tool: ToolName }
  | { type: "tool_end"; tool: ToolName }
  | { type: "token"; text: string }
  | {
      type: "done";
      reply: string;
      pending_action: EmailDraft | null;
      conversation_id: string | null;
      tools_used: ToolName[];
      error?: boolean;
    }
  | { type: "error"; message: string };

export type ToolName =
  | "portfolio_search"
  | "github_repo_info"
  | "draft_contact_email"
  | "send_contact_email";

/**
 * What the character is currently doing. Mostly derived from `tools_used`,
 * except `idle`, `thinking` and `error`, which come from the request lifecycle.
 */
export type CharacterState =
  | "idle"
  | "thinking"
  | "searching"
  | "coding"
  | "envelope"
  | "error";

/** Maps a tool the agent used onto the pose that represents it. */
export const TOOL_TO_STATE: Record<ToolName, CharacterState> = {
  portfolio_search: "searching",
  github_repo_info: "coding",
  draft_contact_email: "envelope",
  send_contact_email: "envelope",
};
