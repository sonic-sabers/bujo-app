"use client";

import { memo } from "react";
import { ComponentType } from "@/types/chat";
import { ButtonExamples } from "./examples/ButtonExamples";
import { CardExamples } from "./examples/CardExamples";
import { InputExamples } from "./examples/InputExamples";
import { ChatBubbleExamples } from "./examples/ChatBubbleExamples";
import { motion } from "framer-motion";

interface ComponentRendererProps {
  componentType: ComponentType;
}

/**
 * Renders live, interactive UI component examples based on the component type.
 * This component appears in the chat after the assistant's text response has finished streaming.
 *
 * @param componentType - The type of component to render (e.g., "button-variants")
 * @returns A motion-wrapped component example or null if no type is provided
 *
 * Features:
 * - Smooth fade-in animation when appearing
 * - Maps component types to their respective example components
 * - All rendered components are fully interactive
 *
 * @example
 * <ComponentRenderer componentType="button-variants" />
 * // Renders ButtonExamples with animation
 */
export const ComponentRenderer = memo(function ComponentRenderer({
  componentType,
}: ComponentRendererProps) {
  if (!componentType) return null;

  const components: Record<string, React.ReactElement> = {
    "button-variants": <ButtonExamples />,
    "card-variants": <CardExamples />,
    "input-variants": <InputExamples />,
    "chat-bubbles": <ChatBubbleExamples />,
    "form-variants": (
      <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
        Form components coming soon...
      </div>
    ),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
        delay: 0.1,
      }}
      className="mt-3"
    >
      {components[componentType]}
    </motion.div>
  );
});
