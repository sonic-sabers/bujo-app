export interface ComponentMetadata {
  id: string;
  name: string;
  category: string;
  keywords: string[];
  description: string;
}

export type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";
export type InputVariant = "default" | "search" | "email" | "password";
export type CardVariant = "default" | "elevated" | "outlined";
