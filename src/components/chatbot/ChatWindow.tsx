"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  useLayoutEffect,
} from "react";
import { motion } from "framer-motion";
import { useVirtualizer } from "@tanstack/react-virtual";

// Suppress flushSync warning from @tanstack/react-virtual (known issue, doesn't affect functionality)
// See: https://github.com/TanStack/virtual/issues/578
if (typeof window !== "undefined") {
  const originalError = console.error;
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("flushSync was called from inside a lifecycle method")
    ) {
      return;
    }
    originalError.apply(console, args);
  };
}
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { TypingIndicator } from "./TypingIndicator";
import { QuickReplies } from "./QuickReplies";
import { ChatErrorBoundary } from "./ErrorBoundary";
import { useChatState } from "../../hooks/useChatState";
import { useKeyboardShortcuts } from "../../hooks/useKeyboardShortcuts";
import { useKeyboardHeight } from "../../hooks/useKeyboardHeight";
import { type Message } from "../../types/chat";

interface ChatWindowProps {
  onClose: () => void;
  themeColor?: string;
  position?: "bottom-right" | "bottom-left";
}

export function ChatWindow({
  onClose,
  themeColor = "#00b4d8",
  position = "bottom-right",
}: ChatWindowProps) {
  const {
    messages,
    isTyping,
    isStreaming,
    error,
    sendMessage,
    clearChat,
    retryLastMessage,
  } = useChatState();

  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const quickReplies = useMemo(
    () => [
      "Show me button variations",
      "Display card examples",
      "Input field types",
      "Chat bubble styles",
    ],
    []
  );
  const [isExpanded, setIsExpanded] = useState(true);
  const parentRef = useRef<HTMLDivElement>(null);
  const keyboardHeight = useKeyboardHeight();

  const lastScrollTimeRef = useRef<number>(0);
  const isUserScrollingRef = useRef<boolean>(false);
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const measurementQueueRef = useRef<Set<HTMLElement>>(new Set());
  const measurementScheduledRef = useRef(false);

  const virtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: useCallback(() => 100, []),
    overscan: 5,
    getItemKey: useCallback(
      (index: number) => messages[index]?.id ?? index,
      [messages]
    ),
  });

  // Note: flushSync warning is a known issue with @tanstack/react-virtual v3
  // It doesn't affect functionality - see: https://github.com/TanStack/virtual/issues/578
  // The warning occurs during streaming but virtualization works correctly
  const virtualItems = virtualizer.getVirtualItems();
  const totalSize = virtualizer.getTotalSize();

  // Wrap measureElement to avoid flushSync warning during render
  // Uses batched setTimeout to ensure measurements happen outside React's render cycle
  const measureElement = useCallback(
    (node: HTMLElement | null) => {
      if (node) {
        measurementQueueRef.current.add(node);

        if (!measurementScheduledRef.current) {
          measurementScheduledRef.current = true;
          // Use setTimeout(0) to escape React's render cycle completely
          setTimeout(() => {
            measurementScheduledRef.current = false;
            const nodes = Array.from(measurementQueueRef.current);
            measurementQueueRef.current.clear();

            // Batch all measurements in a single frame
            nodes.forEach((n) => {
              if (n.isConnected) {
                virtualizer.measureElement(n);
              }
            });
          }, 0);
        }
      }
    },
    [virtualizer]
  );

  // Scroll to bottom helper - direct DOM manipulation for reliability
  const scrollToBottomDirect = useCallback(() => {
    if (isUserScrollingRef.current) return;
    if (parentRef.current) {
      parentRef.current.scrollTop = parentRef.current.scrollHeight;
    }
  }, []);

  // Get the last message for scroll detection
  const lastMessage = messages[messages.length - 1];
  const lastMessageContent = lastMessage?.content ?? "";
  const isLastMessageStreaming = lastMessage?.isStreaming ?? false;

  // Scroll on new messages
  useEffect(() => {
    if (!isUserScrollingRef.current) {
      // Small delay to allow DOM to update
      const timer = setTimeout(scrollToBottomDirect, 50);
      return () => clearTimeout(timer);
    }
  }, [messages.length, isTyping, scrollToBottomDirect]);

  // Auto-scroll during streaming content updates
  useEffect(() => {
    if (isLastMessageStreaming && !isUserScrollingRef.current) {
      requestAnimationFrame(scrollToBottomDirect);
    }
  }, [lastMessageContent, isLastMessageStreaming, scrollToBottomDirect]);

  // Scroll when streaming ends (component appears)
  useEffect(() => {
    if (!isLastMessageStreaming && lastMessage && !isUserScrollingRef.current) {
      // Delay to allow component to render
      const timer = setTimeout(scrollToBottomDirect, 100);
      return () => clearTimeout(timer);
    }
  }, [isLastMessageStreaming, lastMessage, scrollToBottomDirect]);

  const handleScroll = useCallback(() => {
    if (!parentRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = parentRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;

    if (!isNearBottom) {
      isUserScrollingRef.current = true;
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        isUserScrollingRef.current = false;
      }, 2000);
    } else {
      isUserScrollingRef.current = false;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Handle resize - remeasure virtualizer when container size changes
  useEffect(() => {
    const handleResize = () => {
      virtualizer.measure();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [virtualizer]);

  // Scroll to bottom on initial load
  useEffect(() => {
    if (messages.length > 0 && !isUserScrollingRef.current) {
      const timer = setTimeout(scrollToBottomDirect, 100);
      return () => clearTimeout(timer);
    }
  }, [scrollToBottomDirect]);

  const handleSendMessage = async (content: string) => {
    setShowQuickReplies(false);
    await sendMessage(content);
  };

  const handleClearChat = () => {
    setShowQuickReplies(true);
    clearChat();
  };
  // Info: Added these intentionally to clear chatbox and close chat
  // Keyboard shortcuts
  useKeyboardShortcuts(
    [
      {
        key: "Escape",
        callback: onClose,
        description: "Close chat",
      },
      {
        key: "k",
        metaKey: true,
        callback: handleClearChat,
        description: "Clear chat (Cmd/Ctrl + K)",
      },
    ],
    isExpanded
  );

  return (
    <ChatErrorBoundary>
      <motion.div
        onClick={() => !isExpanded && setIsExpanded(!isExpanded)}
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
          height: isExpanded ? "auto" : "auto",
        }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        transition={{
          opacity: { type: "spring", stiffness: 300, damping: 25 },
          scale: { type: "spring", stiffness: 300, damping: 25 },
          y: { type: "spring", stiffness: 300, damping: 25 },
        }}
        className={`fixed ${
          position === "bottom-left" ? "left-6" : "right-6"
        } z-40 w-96 max-w-[calc(100vw-3rem)] md:w-96 rounded-2xl shadow-2xl flex flex-col overflow-hidden p-[2px]`}
        style={{
          backgroundColor: themeColor,
          bottom: `${Math.max(96, keyboardHeight + 16)}px`,
          minHeight: isExpanded
            ? keyboardHeight > 0
              ? "300px"
              : "min(400px, calc(100vh - 120px))"
            : "auto",
          maxHeight: isExpanded
            ? keyboardHeight > 0
              ? `calc(100vh - ${keyboardHeight + 32}px)`
              : "600px"
            : "auto",
        }}
        onWheel={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Bujo Assistant Chat"
        aria-modal="true"
      >
        <div className="bg-white rounded-[calc(1rem-2px)] h-full flex flex-col overflow-hidden">
          {/* Header */}
          <div
            className="p-4 flex items-center justify-between rounded-t-[calc(1rem-2px)]"
            style={{ backgroundColor: themeColor }}
            role="banner"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                <svg
                  className="w-6 h-6"
                  style={{ color: themeColor }}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-white text-lg leading-tight">
                  Bujo Assistant
                </h3>
                <p className="text-xs text-white/90 leading-tight mt-0.5">
                  Ask me about components
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-8 h-8 md:w-7 md:h-7 flex items-center justify-center text-white hover:bg-white/10 rounded-md transition-colors"
                aria-label={isExpanded ? "Minimize chat" : "Expand chat"}
                aria-expanded={isExpanded}
              >
                <motion.svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  animate={{ rotate: isExpanded ? 0 : 180 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </motion.svg>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-7 h-7 flex items-center justify-center text-white hover:bg-white/10 rounded-md transition-colors"
                aria-label="Close chat"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </motion.button>
            </div>
          </div>

          {/* Messages */}
          {isExpanded && (
            <div
              ref={parentRef}
              className="chat-messages flex-1 overflow-y-auto p-3 md:p-4 bg-gray-50 min-h-[280px] md:min-h-[440px]"
              role="log"
              aria-live="polite"
              aria-label="Chat messages"
              onScroll={handleScroll}
              onWheel={(e) => {
                const element = e.currentTarget;
                const isAtTop = element.scrollTop === 0;
                const isAtBottom =
                  element.scrollHeight - element.scrollTop ===
                  element.clientHeight;

                if (
                  (e.deltaY < 0 && !isAtTop) ||
                  (e.deltaY > 0 && !isAtBottom)
                ) {
                  e.stopPropagation();
                }
              }}
            >
              <div
                style={{
                  height: `${totalSize}px`,
                  width: "100%",
                  position: "relative",
                }}
              >
                {virtualItems.map((virtualRow) => {
                  const message = messages[virtualRow.index];
                  if (!message) return null;

                  return (
                    <div
                      key={virtualRow.key}
                      data-index={virtualRow.index}
                      ref={measureElement}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                      className="py-1.5 md:py-2"
                    >
                      <ChatMessage
                        message={message}
                        index={virtualRow.index}
                        totalMessages={messages.length}
                        isLastStreamingMessage={
                          message.isStreaming &&
                          virtualRow.index === messages.length - 1
                        }
                      />
                    </div>
                  );
                })}
              </div>

              {isTyping && (
                <div className="py-1.5 md:py-2">
                  <TypingIndicator />
                </div>
              )}

              {error && (
                <div
                  className="p-3 bg-red-50 border border-red-200 rounded-lg my-2"
                  role="alert"
                >
                  <p className="text-sm text-red-800">{error}</p>
                  <button
                    onClick={retryLastMessage}
                    className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
                  >
                    Retry
                  </button>
                </div>
              )}

              {showQuickReplies && messages.length === 1 && (
                <QuickReplies
                  replies={quickReplies}
                  onSelect={handleSendMessage}
                />
              )}
            </div>
          )}

          {/* Input */}
          {isExpanded && (
            <ChatInput
              onSend={handleSendMessage}
              disabled={isStreaming || isTyping}
            />
          )}
        </div>
      </motion.div>
    </ChatErrorBoundary>
  );
}
