"use client";

import { motion } from "framer-motion";

interface QuickRepliesProps {
  replies: string[];
  onSelect: (reply: string) => void;
}

export function QuickReplies({ replies, onSelect }: QuickRepliesProps) {
  return (
    <div className="flex flex-wrap gap-2 px-4 pb-3">
      {replies.map((reply, index) => (
        <motion.button
          key={reply}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(reply)}
          className="px-3 py-1.5 bg-white border-1 border-[#00b4d8] text-[#00b4d8] rounded-full text-xs font-medium hover:bg-[#00b4d8]/10 transition-colors"
        >
          {reply}
        </motion.button>
      ))}
    </div>
  );
}
