import { SidebarItem } from "@/components/layout/Sidebar";

// Only show components available in chatbot quick replies
export const sidebarItems: SidebarItem[] = [
  { id: "1", label: "Buttons", category: "buttons" },
  { id: "2", label: "Cards", category: "cards" },
  { id: "3", label: "Input Fields", category: "input-groups" },
  { id: "4", label: "Chat Bubbles", category: "chat-bubbles" },
];
