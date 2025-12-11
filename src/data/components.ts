import { ComponentShowcase } from "@/types/ui-library";

// Only show components available in chatbot quick replies
export const componentsData: ComponentShowcase[] = [
  {
    id: "buttons",
    name: "Buttons",
    description: "Clickable text element with various styles and states",
    category: "buttons",
    variationCount: 132,
    previewType: "light",
  },
  {
    id: "cards",
    name: "Cards",
    description: "Flexible content container with multiple layouts",
    category: "cards",
    variationCount: 12,
    previewType: "light",
  },
  {
    id: "input-groups",
    name: "Input Fields",
    description: "Text input elements with labels and validation",
    category: "input-groups",
    variationCount: 12,
    previewType: "light",
  },
  {
    id: "chat-bubbles",
    name: "Chat Bubbles",
    description: "Message containers for chat interfaces",
    category: "chat-bubbles",
    variationCount: 8,
    previewType: "light",
  },
];
