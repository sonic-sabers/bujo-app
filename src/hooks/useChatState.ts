import { useState, useCallback, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { type Message } from "../types/chat";
import { parseComponentFull } from "../lib/componentParser";
import { simulateStreamingResponse } from "../lib/streamingResponse";
import { getChatStorage } from "../lib/storage";
import { useDebounce } from "./useDebounce";

interface UseChatStateOptions {
  initialMessage?: string;
  onError?: (error: Error) => void;
}

export function useChatState(options: UseChatStateOptions = {}) {
  const { initialMessage = "How can I help you today?", onError } = options;

  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const cancelStreamRef = useRef<(() => void) | null>(null);

  // Load messages from storage on mount
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const storedMessages = await getChatStorage().loadMessages();
        if (storedMessages.length > 0) {
          setMessages(storedMessages);
        } else {
          // Add initial message if no stored messages
          setMessages([
            {
              id: uuidv4(),
              role: "assistant" as const,
              content: initialMessage,
              timestamp: new Date(),
            },
          ]);
        }
      } catch (error) {
        console.error("Failed to load messages:", error);
        // Fallback to initial message
        setMessages([
          {
            id: uuidv4(),
            role: "assistant" as const,
            content: initialMessage,
            timestamp: new Date(),
          },
        ]);
      } finally {
        setIsLoaded(true);
      }
    };

    loadMessages();
  }, [initialMessage]);

  // Debounced messages for saving (prevents excessive writes during streaming)
  const debouncedMessages = useDebounce(messages, 1000);

  // Save messages to storage whenever they change (but not during streaming)
  useEffect(() => {
    if (!isLoaded || isStreaming) return;

    const saveMessages = async () => {
      try {
        await getChatStorage().saveMessages(debouncedMessages);
      } catch (error) {
        console.error("Failed to save messages:", error);
      }
    };

    saveMessages();
  }, [debouncedMessages, isLoaded, isStreaming]);

  // Save immediately on unmount to prevent data loss
  useEffect(() => {
    return () => {
      if (messages.length > 0) {
        getChatStorage()
          .saveMessages(messages)
          .catch((error) => {
            console.error("Failed to save messages on unmount:", error);
          });
      }
    };
  }, [messages]);

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
          role: "user" as const,
          content: content.trim(),
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setIsTyping(true);
        setIsStreaming(true);

        // Parse query for component requests
        const parsed = parseComponentFull(content);
        const responseText = parsed.response;

        // Show typing indicator for 800ms before bot starts replying
        setTimeout(() => {
          setIsTyping(false);

          // Create assistant message and start streaming
          const messageId = uuidv4();
          const assistantMessage: Message = {
            id: messageId,
            role: "assistant" as const,
            content: "",
            componentType: parsed.componentType,
            componentData: parsed.componentData,
            isStreaming: true,
            timestamp: new Date(),
          };

          setMessages((prev) => [...prev, assistantMessage]);

          // Stream the response text character by character
          let streamedText = "";
          const cancel = simulateStreamingResponse(
            responseText,
            (chunk: string) => {
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

  const clearChat = useCallback(async () => {
    // Cancel any ongoing streaming
    if (cancelStreamRef.current) {
      cancelStreamRef.current();
      cancelStreamRef.current = null;
    }

    const newMessages: Message[] = [
      {
        id: uuidv4(),
        role: "assistant" as const,
        content: "Chat cleared! How can I help you?",
        timestamp: new Date(),
      },
    ];

    setMessages(newMessages);
    setIsTyping(false);
    setIsStreaming(false);
    setError(null);

    // Save cleared state to storage
    try {
      await getChatStorage().saveMessages(newMessages);
    } catch (error) {
      console.error("Failed to save cleared chat:", error);
    }
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
    isLoaded,
    sendMessage,
    clearChat,
    retryLastMessage,
  };
}
