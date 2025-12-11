/**
 * Role of the message sender in the chat conversation.
 */
export type Role = "user" | "assistant";

/**
 * Represents a single message in the chat conversation.
 *
 * @property id - Unique identifier for the message
 * @property role - Who sent the message (user or assistant)
 * @property content - The text content of the message
 * @property componentType - Optional component to render with this message
 * @property isStreaming - Whether the message is currently being streamed
 * @property timestamp - When the message was created
 */
export interface Message {
  id: string;
  role: Role;
  content: string;
  componentType?: ComponentType;
  isStreaming?: boolean;
  timestamp: Date;
}

/**
 * Types of UI components that can be rendered in the chat.
 * Each type corresponds to a specific set of component examples.
 *
 * @example
 * "button-variants" - Shows different button styles (Primary, Secondary, Ghost, etc.)
 * "card-variants" - Shows different card layouts
 * "input-variants" - Shows different input field types
 * "chat-bubbles" - Shows different chat message styles
 */
export type ComponentType =
  | "button-variants"
  | "chat-bubbles"
  | "card-variants"
  | "input-variants"
  | "form-variants"
  | null;

export interface StreamChunk {
  type: "text" | "component" | "done";
  content: string;
  componentType?: ComponentType;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error?: string;
}
