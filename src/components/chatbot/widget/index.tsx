"use client";
// IMP Info: Added it as a part of side quest
import dynamic from "next/dynamic";
import { Suspense } from "react";

/**
 * Lazy-loaded Chat Widget for production embedding.
 *
 * This component uses dynamic imports to ensure the chat widget
 * is loaded as a separate chunk, reducing initial page load for host apps.
 *
 * Bundle size optimization:
 * - ChatWindow and all dependencies loaded on-demand
 * - Only the FAB button shell loads initially (~2KB)
 * - Full widget loads when user clicks to open (~50-80KB)
 *
 * @example
 * // In host application:
 * import { ChatWidget } from '@bujo/chat-widget';
 *
 * function App() {
 *   return (
 *     <div>
 *       <YourAppContent />
 *       <ChatWidget />
 *     </div>
 *   );
 * }
 */

const LazyUiLibraryAssistant = dynamic(
  () =>
    import("../UiLibraryAssistant").then((mod) => ({
      default: mod.UiLibraryAssistant,
    })),
  {
    ssr: false,
    loading: () => (
      <WidgetLoadingShell themeColor="#00b4d8" position="bottom-right" />
    ),
  }
);

function WidgetLoadingShell({
  themeColor = "#00b4d8",
  position = "bottom-right",
}: {
  themeColor?: string;
  position?: "bottom-right" | "bottom-left";
}) {
  const positionClasses =
    position === "bottom-left" ? "left-4 md:left-6" : "right-4 md:right-6";
  return (
    <button
      className={`fixed bottom-4 md:bottom-6 ${positionClasses} z-50 w-14 h-14 md:w-16 md:h-16 rounded-full shadow-2xl flex items-center justify-center text-white opacity-50 cursor-wait`}
      style={{ backgroundColor: themeColor }}
      disabled
      aria-label="Loading chat widget..."
    >
      <svg
        className="w-6 h-6 md:w-7 md:h-7 animate-pulse"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    </button>
  );
}

export interface ChatWidgetProps {
  /** Custom theme color (CSS color value) */
  themeColor?: string;
  /** Initial greeting message */
  greeting?: string;
  /** Position of the widget */
  position?: "bottom-right" | "bottom-left";
  /** Z-index for the widget */
  zIndex?: number;
}

export function ChatWidget({
  themeColor = "#00b4d8",
  position = "bottom-right",
  zIndex = 50,
}: ChatWidgetProps) {
  return (
    <Suspense
      fallback={
        <WidgetLoadingShell themeColor={themeColor} position={position} />
      }
    >
      <LazyUiLibraryAssistant
        themeColor={themeColor}
        position={position}
        zIndex={zIndex}
      />
    </Suspense>
  );
}

export default ChatWidget;
