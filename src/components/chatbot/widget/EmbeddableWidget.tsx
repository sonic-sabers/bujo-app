"use client";

import { useState, useCallback, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { preloadChatComponents } from "./LazyComponents";
import { WidgetErrorBoundary } from "./WidgetErrorBoundary";

/**
 * Embeddable Chat Widget with optimized loading for high-traffic sites.
 *
 * Features:
 * - Lazy loads ChatWindow only when opened (~50-80KB saved on initial load)
 * - Preloads on hover for instant open experience
 * - Minimal initial footprint (~5KB including FAB button)
 * - SSR disabled to prevent hydration issues in host apps
 *
 * Bundle Strategy:
 * - Initial: FAB button + minimal state (~5KB gzipped)
 * - On hover: Preload ChatWindow chunk
 * - On click: Render ChatWindow (already loaded if hovered)
 *
 * @example
 * // Embed in any React app:
 * import { EmbeddableWidget } from '@bujo/chat-widget';
 *
 * <EmbeddableWidget
 *   themeColor="#00b4d8"
 *   position="bottom-right"
 * />
 */

const LazyChatWindow = dynamic(
  () => import("../ChatWindow").then((mod) => ({ default: mod.ChatWindow })),
  {
    ssr: false,
    loading: () => <ChatWindowLoadingState />,
  }
);

function ChatWindowLoadingState() {
  return (
    <div
      className="fixed right-6 z-40 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
      style={{ bottom: "96px", height: "400px" }}
    >
      <div className="bg-[#00b4d8] p-4 flex items-center gap-3">
        <div className="w-12 h-12 bg-white/20 rounded-full animate-pulse" />
        <div className="flex-1">
          <div className="h-4 bg-white/20 rounded w-24 animate-pulse" />
          <div className="h-3 bg-white/20 rounded w-32 mt-1 animate-pulse" />
        </div>
      </div>
      <div className="flex-1 p-4 bg-gray-50 flex items-center justify-center">
        <div className="flex gap-1">
          <div
            className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          />
          <div
            className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          />
          <div
            className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          />
        </div>
      </div>
    </div>
  );
}

export interface EmbeddableWidgetProps {
  /** Primary theme color */
  themeColor?: string;
  /** Widget position */
  position?: "bottom-right" | "bottom-left";
  /** Z-index for layering */
  zIndex?: number;
  /** Callback when widget opens */
  onOpen?: () => void;
  /** Callback when widget closes */
  onClose?: () => void;
  /** Error callback for monitoring */
  onError?: (error: Error) => void;
  /** Disable animations (respects prefers-reduced-motion by default) */
  disableAnimations?: boolean;
}

export interface ChatWindowConfig {
  themeColor: string;
  position: "bottom-right" | "bottom-left";
}

export function EmbeddableWidget({
  themeColor = "#00b4d8",
  position = "bottom-right",
  zIndex = 50,
  onOpen,
  onClose,
  onError,
  disableAnimations = false,
}: EmbeddableWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasPreloaded, setHasPreloaded] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Detect reduced motion preference
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) =>
      setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  const shouldAnimate = !disableAnimations && !prefersReducedMotion;

  const handleMouseEnter = useCallback(() => {
    if (!hasPreloaded) {
      preloadChatComponents();
      setHasPreloaded(true);
    }
  }, [hasPreloaded]);

  const handleToggle = useCallback(() => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (newState) {
      onOpen?.();
    } else {
      onClose?.();
    }
  }, [isOpen, onOpen, onClose]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    onClose?.();
  }, [onClose]);

  const handleError = useCallback(
    (error: Error) => {
      onError?.(error);
    },
    [onError]
  );

  const positionClasses =
    position === "bottom-left" ? "left-4 md:left-6" : "right-4 md:right-6";

  return (
    <WidgetErrorBoundary onError={(e) => handleError(e)}>
      <AnimatePresence>
        {isOpen && (
          <Suspense fallback={<ChatWindowLoadingState />}>
            <LazyChatWindow
              onClose={handleClose}
              themeColor={themeColor}
              position={position}
            />
          </Suspense>
        )}
      </AnimatePresence>

      <motion.button
        onClick={handleToggle}
        onMouseEnter={handleMouseEnter}
        onFocus={handleMouseEnter}
        className={`fixed bottom-4 md:bottom-6 ${positionClasses} w-14 h-14 md:w-16 md:h-16 rounded-full shadow-2xl flex items-center justify-center text-white transition-shadow`}
        style={{
          backgroundColor: themeColor,
          zIndex,
          boxShadow: `0 10px 40px ${themeColor}40`,
        }}
        whileHover={shouldAnimate ? { scale: 1.1 } : undefined}
        whileTap={shouldAnimate ? { scale: 0.9 } : undefined}
        initial={shouldAnimate ? { scale: 0, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={
          shouldAnimate
            ? {
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.5,
              }
            : { duration: 0 }
        }
        aria-label={isOpen ? "Close chat" : "Open chat"}
        aria-expanded={isOpen}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.svg
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-5 h-5 md:w-6 md:h-6"
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
            </motion.svg>
          ) : (
            <motion.svg
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-6 h-6 md:w-7 md:h-7"
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
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>
    </WidgetErrorBoundary>
  );
}

export default EmbeddableWidget;
