"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { TypingIndicator } from "./TypingIndicator";
import { QuickReplies } from "./QuickReplies";
import { ChatErrorBoundary } from "./ErrorBoundary";
import { useChatState } from "@/hooks/useChatState";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useKeyboardHeight } from "@/hooks/useKeyboardHeight";

interface ChatWindowProps {
  onClose: () => void;
}

export function ChatWindow({ onClose }: ChatWindowProps) {
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
  const quickReplies = [
    "Show me button variations",
    "Display card examples",
    "Input field types",
    "Chat bubble styles",
  ];
  const [isExpanded, setIsExpanded] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const keyboardHeight = useKeyboardHeight();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

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
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
          height: isExpanded ? 600 : 72,
        }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        transition={{
          opacity: { type: "spring", stiffness: 300, damping: 25 },
          scale: { type: "spring", stiffness: 300, damping: 25 },
          y: { type: "spring", stiffness: 300, damping: 25 },
          height: { duration: 0.5, ease: "easeInOut" },
        }}
        className="fixed right-6 z-40 w-96 max-w-[calc(100vw-3rem)] md:w-96 bg-[#00b4d8] rounded-2xl shadow-2xl flex flex-col overflow-hidden p-[2px]"
        style={{
          bottom: `${Math.max(96, keyboardHeight + 16)}px`,
          maxHeight:
            keyboardHeight > 0
              ? `calc(100vh - ${keyboardHeight + 32}px)`
              : "calc(100vh - 8rem)",
        }}
        onWheel={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Bujo Assistant Chat"
        aria-modal="true"
      >
        <div className="bg-white rounded-[calc(1rem-2px)] h-full flex flex-col overflow-hidden">
          {/* Header */}
          <div
            className="bg-[#00b4d8] p-4 flex items-center justify-between rounded-t-[calc(1rem-2px)]"
            role="banner"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                <svg
                  className="w-6 h-6 text-[#00b4d8]"
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
              className="chat-messages flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4 bg-gray-50"
              role="log"
              aria-live="polite"
              aria-label="Chat messages"
              onWheel={(e) => {
                const element = e.currentTarget;
                const isAtTop = element.scrollTop === 0;
                const isAtBottom =
                  element.scrollHeight - element.scrollTop ===
                  element.clientHeight;

                // Prevent outer scroll when scrolling within bounds
                if (
                  (e.deltaY < 0 && !isAtTop) || // Scrolling up and not at top
                  (e.deltaY > 0 && !isAtBottom) // Scrolling down and not at bottom
                ) {
                  e.stopPropagation();
                }
              }}
            >
              {messages.map((message, index) => (
                <ChatMessage key={message.id} message={message} index={index} />
              ))}
              {isTyping && <TypingIndicator />}

              {error && (
                <div
                  className="p-3 bg-red-50 border border-red-200 rounded-lg"
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

              <div ref={messagesEndRef} />
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
