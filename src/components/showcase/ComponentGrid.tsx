import { ReactNode } from "react";

export interface ComponentGridProps {
  children: ReactNode;
}

export function ComponentGrid({ children }: ComponentGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {children}
    </div>
  );
}
