"use client";

import { ReactNode, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";

export interface ComponentCardProps {
  title: string;
  description: string;
  variationCount: number;
  preview: ReactNode;
  onClick?: () => void;
  isActive?: boolean;
}

export function ComponentCard({
  title,
  description,
  variationCount,
  preview,
  onClick,
  isActive = false,
}: ComponentCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: isActive ? -4 : 0,
        scale: isActive ? 1.02 : 1,
        filter: isActive
          ? "drop-shadow(0 10px 15px rgba(0, 180, 216, 0.15))"
          : "none",
      }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="min-w-0"
    >
      <motion.div
        animate={{
          borderColor: isActive ? "#00b4d8" : "transparent",
          boxShadow: isActive
            ? "0 20px 25px -5px rgba(0, 180, 216, 0.2), 0 0 0 2px rgba(0, 180, 216, 0.2)"
            : "",
        }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="h-full rounded-lg border-2"
      >
        <Card
          variant="elevated"
          padding="none"
          className={`group cursor-pointer transition-all duration-300 overflow-hidden h-full flex flex-col ${
            isActive
              ? ""
              : "hover:border-[#00b4d8] hover:shadow-xl hover:shadow-[#00b4d8]/10"
          }`}
          onClick={onClick}
        >
          <div
            className={`p-4 sm:p-6 bg-gradient-to-br min-h-[180px] sm:min-h-[200px] flex items-center justify-center relative transition-all duration-300 overflow-hidden ${
              isActive
                ? "from-[#00b4d8]/10 to-[#00b4d8]/20"
                : "from-gray-50 to-gray-100/50 group-hover:from-[#00b4d8]/5 group-hover:to-[#00b4d8]/10"
            }`}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="w-full max-w-full scale-[0.6] sm:scale-[0.7] md:scale-[0.75] lg:scale-[0.8] xl:scale-90"
            >
              {preview}
            </motion.div>
          </div>

          <div className="p-4 sm:p-5 bg-white border-t border-gray-100 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <motion.h3
                className={`font-bold text-base sm:text-lg transition-colors ${
                  isActive
                    ? "text-[#00b4d8]"
                    : "text-gray-900 group-hover:text-[#00b4d8]"
                }`}
                animate={{
                  color: isActive
                    ? "#00b4d8"
                    : isHovered
                    ? "#00b4d8"
                    : "#111827",
                }}
              >
                {title}
              </motion.h3>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mb-3 leading-relaxed flex-1">
              {description}
            </p>
            <div className="flex items-center gap-1.5 mt-auto">
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-[#00b4d8]"
                animate={{ scale: isHovered ? [1, 1.5, 1] : 1 }}
                transition={{ duration: 0.6, repeat: isHovered ? Infinity : 0 }}
              />
              <p className="text-xs text-gray-500 font-medium">
                {variationCount} variations
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
