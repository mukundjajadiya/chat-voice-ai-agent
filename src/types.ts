export const MessageRole = {
  USER: "user",
  MODEL: "model",
} as const;

export type MessageRole = (typeof MessageRole)[keyof typeof MessageRole];

export interface Source {
  uri: string;
  title: string;
}

export interface ChatMessage {
  role: MessageRole;
  text: string;
  sources?: Source[];
}
