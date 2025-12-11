export interface ComponentShowcase {
  id: string;
  name: string;
  description: string;
  category: ComponentCategory;
  variationCount: number;
  previewType: "light" | "dark";
}

export type ComponentCategory =
  | "accordions"
  | "alerts"
  | "avatars"
  | "badges"
  | "buttons"
  | "breadcrumbs"
  | "cards"
  | "chat-bubbles"
  | "checkboxes"
  | "dropdowns"
  | "footers"
  | "input-groups"
  | "layouts"
  | "modals"
  | "navbars"
  | "notifications"
  | "pagination"
  | "progress-bars"
  | "radio-groups"
  | "select-menus"
  | "tables"
  | "tabs"
  | "testimonials"
  | "textareas"
  | "tooltips"
  | "toggles"
  | "spinners";

export interface SidebarItem {
  id: string;
  label: string;
  category: ComponentCategory;
  badge?: "new" | "coming-next";
  disabled?: boolean;
}
