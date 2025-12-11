"use client";

import { useState, KeyboardEvent, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { validateChatMessage } from "@/lib/validation";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const [input, setInput] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-focus input when component mounts
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  const handleSend = () => {
    if (disabled) return;

    const validation = validateChatMessage(input);

    if (!validation.isValid) {
      setValidationError(validation.error || "Invalid message");
      return;
    }

    setValidationError(null);
    onSend(input.trim());
    setInput("");
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    // Clear validation error on typing
    if (validationError) {
      setValidationError(null);
    }
  };

  return (
    <div className="px-3 py-2.5 md:px-4 md:py-3 bg-white border-t border-gray-200">
      {validationError && (
        <div
          className="px-3 py-2 mb-2 bg-red-50 border border-red-200 rounded-md"
          role="alert"
        >
          <p className="text-xs text-red-700">{validationError}</p>
        </div>
      )}
      <div className="flex items-center gap-2 md:gap-3">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type and press [enter]"
          className="flex-1 bg-transparent text-gray-900 placeholder:text-gray-400 focus:outline-none text-xs md:text-sm"
          aria-label="Chat message input"
          aria-invalid={!!validationError}
          aria-describedby={validationError ? "input-error" : undefined}
          maxLength={1000}
        />

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Attach file"
          disabled={disabled}
          type="button"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
            />
          </svg>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSend}
          disabled={!input.trim() || disabled}
          className="w-9 h-9 md:w-10 md:h-10 bg-[#00b4d8] rounded-full flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:shadow-[#00b4d8]/40 transition-all"
          aria-label="Send message"
          type="button"
        >
          <svg
            className="w-5 h-5 rotate-90"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </motion.button>
      </div>
    </div>
  );
}
