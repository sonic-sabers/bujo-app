import { HTMLAttributes, ReactNode } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "outlined";
  padding?: "none" | "sm" | "md" | "lg";
  children: ReactNode;
}

export function Card({
  variant = "default",
  padding = "md",
  className = "",
  children,
  ...props
}: CardProps) {
  const baseStyles = "rounded-lg";

  const variants = {
    default: "bg-white",
    elevated: "bg-white shadow-lg",
    outlined: "bg-white border-2 border-gray-200",
  };

  const paddings = {
    none: "",
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${paddings[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
