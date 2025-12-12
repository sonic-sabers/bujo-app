"use client";

import { memo } from "react";
import { ComponentType } from "@/types/chat";
import { motion } from "framer-motion";
import { JsonRenderer, type JsonNode } from "./JsonRenderer";

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

  const buttonVariantsNode: JsonNode = {
    type: "container",
    props: { className: "space-y-3" },
    children: [
      { type: "text", children: "Button variants:" },
      {
        type: "container",
        props: { className: "flex flex-wrap gap-2" },
        children: [
          {
            type: "button",
            props: { label: "Primary", variant: "default" },
            events: { onClick: "likeDemo" },
            eventPayload: { variant: "primary" },
          },
          {
            type: "button",
            props: { label: "Secondary", variant: "secondary" },
            events: { onClick: "likeDemo" },
            eventPayload: { variant: "secondary" },
          },
        ],
      },
    ],
  };

  const cardVariantsNode: JsonNode = {
    type: "container",
    props: { className: "grid grid-cols-1 gap-3" },
    children: [
      {
        type: "card",
        props: {
          title: "Default card",
          description: "Subtle border + shadow.",
          variant: "default",
        },
      },
      {
        type: "card",
        props: {
          title: "Elevated card",
          description: "More emphasis via stronger shadow.",
          variant: "elevated",
        },
      },
      {
        type: "card",
        props: {
          title: "Outlined card",
          description: "Border-only style.",
          variant: "outlined",
        },
      },
      {
        type: "card",
        props: {
          title: "Gradient card",
          description: "Eye-catching gradient background.",
          variant: "gradient",
        },
      },
    ],
  };

  const inputVariantsNode: JsonNode = {
    type: "container",
    props: { className: "space-y-3" },
    children: [
      {
        type: "input",
        props: {
          name: "defaultText",
          label: "Default input",
          placeholder: "Type something…",
        },
      },
      {
        type: "input",
        props: {
          name: "email",
          label: "Email input",
          type: "email",
          placeholder: "you@example.com",
        },
      },
      {
        type: "input",
        props: {
          name: "search",
          label: "Search input",
          type: "search",
          placeholder: "Search…",
        },
      },
    ],
  };

  const chatBubblesNode: JsonNode = {
    type: "container",
    props: { className: "space-y-2" },
    children: [
      {
        type: "chatBubble",
        props: {
          role: "assistant",
          text: "Assistant bubble (default)",
          timestamp: "12:30",
        },
      },
      {
        type: "chatBubble",
        props: {
          role: "user",
          text: "User bubble (gradient)",
          timestamp: "12:31",
          variant: "gradient",
        },
      },
      {
        type: "chatBubble",
        props: {
          role: "system",
          text: "System message bubble",
        },
      },
    ],
  };

  const formVariantsNode: JsonNode = {
    type: "form",
    props: {
      title: "Example form",
      description: "This is rendered from JSON (no hardcoded JSX).",
    },
    events: { onSubmit: "formSubmitDemo", onReset: "resetDemo" },
    children: [
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
        type: "text",
        children: "Interactive example: click the like button below.",
      },
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
