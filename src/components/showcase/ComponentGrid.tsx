import { ReactNode } from "react";

export interface ComponentGridProps {
  children: ReactNode;
}

export function ComponentGrid({ children }: ComponentGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 auto-rows-fr">
      {children}
    </div>
  );
}
