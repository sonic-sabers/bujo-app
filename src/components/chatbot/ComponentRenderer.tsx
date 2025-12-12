"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { JsonRenderer, type JsonNode } from "./JsonRenderer";
import { ComponentType } from "../../types/chat";

interface ComponentRendererProps {
  componentType?: ComponentType;
  componentData?: Record<string, unknown>;
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
  componentData,
}: ComponentRendererProps) {
  if (!componentType && !componentData) return null;

  const buttonVariantsNode: JsonNode = {
    type: "button-group",
    variants: ["default", "secondary", "ghost"],
    events: { onClick: "likeDemo" },
  };

  const cardVariantsNode: JsonNode = {
    type: "card-group",
    variants: ["default", "elevated", "outlined", "gradient"],
  };

  const inputVariantsNode: JsonNode = {
    type: "input-group",
    inputs: [
      {
        name: "defaultText",
        label: "Default input",
        placeholder: "Type something…",
      },
      {
        name: "email",
        label: "Email input",
        type: "email",
        placeholder: "you@example.com",
      },
      {
        name: "search",
        label: "Search input",
        type: "search",
        placeholder: "Search…",
      },
    ],
  };

  const chatBubblesNode: JsonNode = {
    type: "chat-group",
    messages: [
      {
        role: "assistant",
        text: "Assistant bubble (default)",
        timestamp: "12:30",
      },
      {
        role: "user",
        text: "User bubble (gradient)",
        timestamp: "12:31",
        variant: "gradient",
      },
      { role: "system", text: "System message bubble" },
    ],
  };

  const formVariantsNode: JsonNode = {
    type: "ui-group",
    props: {
      title: "Example form",
      description: "This is rendered from JSON (no hardcoded JSX).",
    },
    events: { onSubmit: "formSubmitDemo" },
    components: [
      {
        type: "input",
        props: {
          name: "email",
          label: "Email",
          type: "email",
          placeholder: "you@example.com",
          required: true,
        },
      },
      {
        type: "select",
        props: {
          name: "plan",
          label: "Plan",
          defaultValue: "pro",
          options: [
            { label: "Starter", value: "starter" },
            { label: "Pro", value: "pro" },
            { label: "Enterprise", value: "enterprise" },
          ],
        },
      },
      {
        type: "checkbox",
        props: {
          name: "agree",
          label: "I agree to the terms",
          defaultChecked: true,
        },
      },
      { type: "divider" },
      {
        type: "button",
        props: { label: "Like", variant: "secondary" },
        events: { onClick: "likeDemo" },
      },
    ],
  };

  const components: Record<string, React.ReactElement> = {
    "button-variants": <JsonRenderer node={buttonVariantsNode} />,
    "card-variants": <JsonRenderer node={cardVariantsNode} />,
    "input-variants": <JsonRenderer node={inputVariantsNode} />,
    "chat-bubbles": <JsonRenderer node={chatBubblesNode} />,
    "form-variants": <JsonRenderer node={formVariantsNode} />,
  };

  if (componentData) {
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
        <JsonRenderer node={componentData as JsonNode} />
      </motion.div>
    );
  }

  if (!componentType) return null;

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
