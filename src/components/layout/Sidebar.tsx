"use client";

import { ComponentCategory } from "@/types/ui-library";

export interface SidebarItem {
  id: string;
  label: string;
  category: ComponentCategory;
  badge?: "new" | "coming-next";
  disabled?: boolean;
}

export interface SidebarProps {
  items: SidebarItem[];
  activeCategory?: ComponentCategory;
  onCategoryClick?: (category: ComponentCategory) => void;
}

export function Sidebar({
  items,
  activeCategory,
  onCategoryClick,
}: SidebarProps) {
  return (
    <aside className="hidden lg:block w-64 bg-white border-r border-gray-200/50 h-screen overflow-y-auto sticky top-0 animate-slide-in-left">
      <div className="p-6 pt-8">
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-5">
          Components
        </h2>

        <nav className="space-y-0.5">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => !item.disabled && onCategoryClick?.(item.category)}
              disabled={item.disabled}
              className={`
                w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all duration-200
                flex items-center justify-between group relative overflow-hidden
                ${
                  activeCategory === item.category
                    ? "bg-gradient-to-r from-blue-50 to-blue-100/50 text-blue-700 font-semibold shadow-sm"
                    : "text-gray-700 hover:bg-gray-50 hover:translate-x-1"
                }
                ${
                  item.disabled
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer hover:shadow-sm"
                }
              `}
            >
              <span className="capitalize relative z-10">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}
