"use client";

import { useState } from "react";
import { ComponentCategory } from "@/types/ui-library";
import { SidebarItem } from "./Sidebar";
import { Badge } from "@/components/ui/Badge";

export interface MobileMenuProps {
  items: SidebarItem[];
  activeCategory?: ComponentCategory;
  onCategoryClick?: (category: ComponentCategory) => void;
}

export function MobileMenu({
  items,
  activeCategory,
  onCategoryClick,
}: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleCategoryClick = (category: ComponentCategory) => {
    onCategoryClick?.(category);
    setIsOpen(false);
  };

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 left-4 md:bottom-6 md:left-6 z-50 w-14 h-14 md:w-16 md:h-16 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-blue-700 transition-all duration-300 hover:scale-110 active:scale-95"
        aria-label="Toggle menu"
      >
        <svg
          className={`w-6 h-6 md:w-7 md:h-7 transition-transform duration-300 ${
            isOpen ? "rotate-90" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-80 max-w-[85vw] bg-white z-50 overflow-y-auto animate-slide-in-left shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Components
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <nav className="space-y-0.5">
                {items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() =>
                      !item.disabled && handleCategoryClick(item.category)
                    }
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
                    <span className="capitalize relative z-10">
                      {item.label}
                    </span>
                    {item.badge === "new" && (
                      <Badge variant="success" size="sm">
                        NEW
                      </Badge>
                    )}
                    {item.badge === "coming-next" && (
                      <Badge variant="warning" size="sm">
                        Soon
                      </Badge>
                    )}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
