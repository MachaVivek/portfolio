/**
 * Shared types for AI Assistant communication and character states.
 */

export type Role = "user" | "assistant";

export interface ChatMessage {
  id?: string;
  role: Role;
  content: string;
  toolUsed?: string;
  draft?: EmailDraft;
  timestamp?: string;
}

export interface EmailDraft {
  subject: string;
  message: string;
  visitor_name: string;
  visitor_email: string;
  signature: string;
}

export interface ChatRequest {
  messages: { role: Role; content: string }[];
  pending_action: EmailDraft | null;
  conversation_id: string | null;
}

export interface ChatResponse {
  reply: string;
  pending_action: EmailDraft | null;
  conversation_id: string | null;
  tools_used: ToolName[];
  error?: boolean;
}

export type ToolName =
  | "portfolio_search"
  | "github_repo_info"
  | "draft_contact_email"
  | "send_contact_email";

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

export type CharacterState =
  | "idle"
  | "thinking"
  | "searching"
  | "coding"
  | "envelope"
  | "error";

export const TOOL_TO_STATE: Record<ToolName, CharacterState> = {
  portfolio_search: "searching",
  github_repo_info: "coding",
  draft_contact_email: "envelope",
  send_contact_email: "envelope",
};
