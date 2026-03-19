export type ChatRole = "user" | "ai";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  timestamp: number;
}

export interface ChatHistory {
  role: "user" | "model";
  parts: Array<{ text: string }>;
}
