"use client";

import { memo, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { type Message } from "@/types/chat";
import { ComponentRenderer } from "./ComponentRenderer";

const MAX_CONTENT_LENGTH = 500;
const TRUNCATION_THRESHOLD = 600;

interface ChatMessageProps {
  message: Message;
  index: number;
  totalMessages?: number;
  isLastStreamingMessage?: boolean;
}

const MAX_ANIMATED_MESSAGES = 5;

export const ChatMessage = memo(function ChatMessage({
  message,
  index,
  totalMessages = 0,
  isLastStreamingMessage = false,
}: ChatMessageProps) {
  const isUser = message.role === "user";
  const shouldAnimate = totalMessages - index <= MAX_ANIMATED_MESSAGES;
  const [isExpanded, setIsExpanded] = useState(false);

  const { displayContent, isTruncated } = useMemo(() => {
    const content = message.content;
    if (message.isStreaming || content.length <= TRUNCATION_THRESHOLD) {
      return { displayContent: content, isTruncated: false };
    }
    return {
      displayContent: isExpanded
        ? content
        : content.slice(0, MAX_CONTENT_LENGTH),
      isTruncated: !isExpanded,
    };
  }, [message.content, message.isStreaming, isExpanded]);

  return (
    <motion.div
      initial={shouldAnimate ? { opacity: 0, y: 10, scale: 0.95 } : false}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={shouldAnimate ? { duration: 0.3 } : { duration: 0 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`flex gap-2 max-w-[80%] items-start ${
          isUser ? "flex-row-reverse" : "flex-row"
        }`}
      >
        {/* Avatar */}
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
            isUser ? "bg-blue-600" : "bg-[#00b4d8]"
          }`}
        >
          {isUser ? (
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5 text-white"
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
          )}
        </div>

        {/* Message bubble */}
        <div className="flex flex-col max-w-full">
          <div
            className={`px-4 py-2 rounded-2xl ${
              isUser
                ? "bg-blue-600 text-white rounded-br-sm"
                : "bg-white text-gray-800 rounded-bl-sm shadow-sm border border-gray-200"
            }`}
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {displayContent}
              {isTruncated && <span className="text-gray-400">...</span>}
              {message.isStreaming && !isUser && isLastStreamingMessage && (
                <motion.span
                  className="inline-block w-0.5 h-4 bg-[#00b4d8] ml-0.5"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              )}
            </p>
            {isTruncated && (
              <button
                onClick={() => setIsExpanded(true)}
                className="text-xs text-blue-500 hover:text-blue-700 mt-1 underline"
              >
                Show more
              </button>
            )}
            {isExpanded && message.content.length > TRUNCATION_THRESHOLD && (
              <button
                onClick={() => setIsExpanded(false)}
                className="text-xs text-blue-500 hover:text-blue-700 mt-1 underline"
              >
                Show less
              </button>
            )}
          </div>
          {(message.componentType || message.componentData) &&
            !isUser &&
            !message.isStreaming && (
              <ComponentRenderer
                componentType={message.componentType}
                componentData={message.componentData}
              />
            )}
          <span
            className={`text-xs text-gray-500 mt-1 ${
              isUser ? "text-right" : "text-left"
            }`}
          >
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>
    </motion.div>
  );
});
