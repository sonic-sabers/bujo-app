import { useState, useCallback, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { type Message } from "@/types/chat";
import {
  parseComponentQuery,
  getComponentResponse,
} from "@/lib/componentParser";
import { simulateStreamingResponse } from "@/lib/streamingResponse";

interface UseChatStateOptions {
  initialMessage?: string;
  onError?: (error: Error) => void;
}

export function useChatState(options: UseChatStateOptions = {}) {
  const { initialMessage = "How can I help you today?", onError } = options;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: uuidv4(),
      role: "assistant",
      content: initialMessage,
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cancelStreamRef = useRef<(() => void) | null>(null);

  const sendMessage = useCallback(
    async (content: string) => {
      try {
        // Validate input
        if (!content || !content.trim()) {
          throw new Error("Message cannot be empty");
        }

        // Prevent sending while streaming
        if (isStreaming || isTyping) {
          return;
        }

        // Clear any previous errors
        setError(null);

        const userMessage: Message = {
          id: uuidv4(),
          role: "user",
          content: content.trim(),
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setIsTyping(true);
        setIsStreaming(true);

        // Parse query for component requests
        const componentType = parseComponentQuery(content);

        // Get appropriate response
        const responseText = componentType
          ? getComponentResponse(componentType)
          : "I can help you explore our component library! Try asking about buttons, cards, inputs, or chat bubbles.";

        // Simulate thinking delay
        setTimeout(() => {
          setIsTyping(false);

          // Create initial message with empty content and streaming flag
          const messageId = uuidv4();
          const assistantMessage: Message = {
            id: messageId,
            role: "assistant",
            content: "",
            componentType,
            isStreaming: true,
            timestamp: new Date(),
          };

          setMessages((prev) => [...prev, assistantMessage]);

          // Stream the response text character by character
          let streamedText = "";
          const cancel = simulateStreamingResponse(
            responseText,
            (chunk) => {
              streamedText += chunk;
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === messageId ? { ...msg, content: streamedText } : msg
                )
              );
            },
            () => {
              // Mark streaming as complete when done
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === messageId ? { ...msg, isStreaming: false } : msg
                )
              );
              setIsStreaming(false);
              cancelStreamRef.current = null;
            },
            30
          );

          cancelStreamRef.current = cancel;
        }, 800);
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Unknown error");
        setError(error.message);
        setIsTyping(false);
        setIsStreaming(false);
        onError?.(error);
      }
    },
    [isStreaming, isTyping, onError]
  );

  const clearChat = useCallback(() => {
    // Cancel any ongoing streaming
    if (cancelStreamRef.current) {
      cancelStreamRef.current();
      cancelStreamRef.current = null;
    }

    setMessages([
      {
        id: uuidv4(),
        role: "assistant",
        content: "Chat cleared! How can I help you?",
        timestamp: new Date(),
      },
    ]);
    setIsTyping(false);
    setIsStreaming(false);
    setError(null);
  }, []);

  const retryLastMessage = useCallback(() => {
    const lastUserMessage = [...messages]
      .reverse()
      .find((msg) => msg.role === "user");

    if (lastUserMessage) {
      // Remove failed assistant message if exists
      setMessages((prev) => {
        const lastUserIndex = prev.findIndex(
          (msg) => msg.id === lastUserMessage.id
        );
        return prev.slice(0, lastUserIndex + 1);
      });

      sendMessage(lastUserMessage.content);
    }
  }, [messages, sendMessage]);

  return {
    messages,
    isTyping,
    isStreaming,
    error,
    sendMessage,
    clearChat,
    retryLastMessage,
  };
}
