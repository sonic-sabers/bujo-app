"use client";

import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start"
    >
      <div className="flex gap-2 max-w-[80%]">
        <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
          <AlertCircle className="w-5 h-5 text-white" />
        </div>
        <div className="flex flex-col">
          <div className="px-4 py-2 rounded-2xl rounded-bl-sm bg-red-50 border border-red-200">
            <p className="text-sm text-red-800">{message}</p>
          </div>
          {onRetry && (
            <button
              onClick={onRetry}
              className="text-xs text-red-600 hover:text-red-800 mt-1 text-left underline"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
